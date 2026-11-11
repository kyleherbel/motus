// motus-vision: Apple Vision helper for Motus (macOS only).
//
//   motus-vision matte <video> --mode person-accurate|person-balanced|person-fast|fg-instance|person-instance
//                     [--start s] [--dur s] [--raw out.gray | --raw -] [--png-dir dir] [--png-every n]
//                     [--fresh] [--native]            -> 8-bit gray mattes at source resolution
//   motus-vision faces <video> [--n 60] [--start s] [--dur s] [--seg balanced|accurate|fast|none]
//                     -> JSON: face box, pupils, eye line, roll/yaw/pitch, head top (from the person matte)
//   motus-vision info                                  -> which requests / revisions exist on this OS
//
// Build: swiftc -O -swift-version 5 motus-vision.swift -o motus-vision
// Stats (JSON) go to stderr for `matte`, results go to stdout for `faces` / `info`.

import Foundation
import AVFoundation
import Vision
import Accelerate
import CoreVideo
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

func elog(_ s: String) { FileHandle.standardError.write((s + "\n").data(using: .utf8)!) }
func die(_ s: String) -> Never { elog("error: " + s); exit(1) }
func now() -> Double { return CFAbsoluteTimeGetCurrent() }

struct Args {
    var pos: [String] = []
    var opt: [String: String] = [:]
    init(_ a: [String]) {
        var i = 0
        while i < a.count {
            if a[i].hasPrefix("--") {
                let k = String(a[i].dropFirst(2))
                if i + 1 < a.count && !(a[i + 1].hasPrefix("--")) { opt[k] = a[i + 1]; i += 2 } else { opt[k] = "1"; i += 1 }
            } else { pos.append(a[i]); i += 1 }
        }
    }
    func d(_ k: String) -> Double? { if let v = opt[k] { return Double(v) }; return nil }
    func i(_ k: String, _ def: Int) -> Int { if let v = opt[k], let n = Int(v) { return n }; return def }
}

final class FrameReader {
    let reader: AVAssetReader
    let output: AVAssetReaderTrackOutput
    let width: Int
    let height: Int
    let fps: Double
    let duration: Double
    let frameCountEstimate: Int
    init(path: String, start: Double?, dur: Double?) {
        let asset = AVURLAsset(url: URL(fileURLWithPath: path))
        guard let track = asset.tracks(withMediaType: .video).first else { die("no video track in \(path)") }
        let size = track.naturalSize
        width = Int(size.width); height = Int(size.height)
        fps = Double(track.nominalFrameRate)
        duration = asset.duration.seconds
        frameCountEstimate = Int((duration * fps).rounded())
        if track.preferredTransform != .identity { elog("warning: track has a non-identity transform; frames are read unrotated") }
        do { reader = try AVAssetReader(asset: asset) } catch { die("AVAssetReader: \(error)") }
        output = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
        output.alwaysCopiesSampleData = false
        if let s = start {
            let d = dur != nil ? CMTime(seconds: dur!, preferredTimescale: 600) : CMTime.positiveInfinity
            reader.timeRange = CMTimeRange(start: CMTime(seconds: s, preferredTimescale: 600), duration: d)
        } else if let du = dur {
            reader.timeRange = CMTimeRange(start: .zero, duration: CMTime(seconds: du, preferredTimescale: 600))
        }
        reader.add(output)
        if !reader.startReading() { die("startReading failed: \(String(describing: reader.error))") }
    }
    func next() -> (CVPixelBuffer, Double)? {
        while let sb = output.copyNextSampleBuffer() {
            if let pb = CMSampleBufferGetImageBuffer(sb) { return (pb, CMSampleBufferGetPresentationTimeStamp(sb).seconds) }
        }
        return nil
    }
}

/// Convert any one-component mask buffer (8-bit or float) to a W x H planar-8 buffer (Lanczos resample).
func maskToPlanar8(_ pb: CVPixelBuffer, W: Int, H: Int, dst: UnsafeMutablePointer<UInt8>) {
    CVPixelBufferLockBaseAddress(pb, .readOnly)
    defer { CVPixelBufferUnlockBaseAddress(pb, .readOnly) }
    let w = CVPixelBufferGetWidth(pb), h = CVPixelBufferGetHeight(pb)
    let rb = CVPixelBufferGetBytesPerRow(pb)
    let base = CVPixelBufferGetBaseAddress(pb)!
    let fmt = CVPixelBufferGetPixelFormatType(pb)
    var dstBuf = vImage_Buffer(data: dst, height: vImagePixelCount(H), width: vImagePixelCount(W), rowBytes: W)
    if fmt == kCVPixelFormatType_OneComponent8 {
        var src = vImage_Buffer(data: base, height: vImagePixelCount(h), width: vImagePixelCount(w), rowBytes: rb)
        if w == W && h == H {
            for y in 0..<H { memcpy(dst + y * W, base + y * rb, W) }
        } else {
            vImageScale_Planar8(&src, &dstBuf, nil, vImage_Flags(kvImageHighQualityResampling))
        }
    } else if fmt == kCVPixelFormatType_OneComponent32Float {
        var src = vImage_Buffer(data: base, height: vImagePixelCount(h), width: vImagePixelCount(w), rowBytes: rb)
        if w == W && h == H {
            vImageConvert_PlanarFtoPlanar8(&src, &dstBuf, 1.0, 0.0, vImage_Flags(kvImageNoFlags))
        } else {
            let tmp = UnsafeMutablePointer<UInt8>.allocate(capacity: w * h)
            defer { tmp.deallocate() }
            var t = vImage_Buffer(data: tmp, height: vImagePixelCount(h), width: vImagePixelCount(w), rowBytes: w)
            vImageConvert_PlanarFtoPlanar8(&src, &t, 1.0, 0.0, vImage_Flags(kvImageNoFlags))
            vImageScale_Planar8(&t, &dstBuf, nil, vImage_Flags(kvImageHighQualityResampling))
        }
    } else {
        die("unexpected mask pixel format \(fmt)")
    }
}

func writeGrayPNG(_ p: UnsafeMutablePointer<UInt8>, W: Int, H: Int, path: String) {
    let cs = CGColorSpaceCreateDeviceGray()
    let data = Data(bytes: p, count: W * H) as CFData
    let prov = CGDataProvider(data: data)!
    let img = CGImage(width: W, height: H, bitsPerComponent: 8, bitsPerPixel: 8, bytesPerRow: W, space: cs,
                      bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.none.rawValue), provider: prov, decode: nil,
                      shouldInterpolate: false, intent: .defaultIntent)!
    let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: path) as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(dest, img, nil)
    CGImageDestinationFinalize(dest)
}

func personRequest(_ q: String) -> VNGeneratePersonSegmentationRequest {
    let r = VNGeneratePersonSegmentationRequest()
    switch q {
    case "fast": r.qualityLevel = .fast
    case "balanced": r.qualityLevel = .balanced
    default: r.qualityLevel = .accurate
    }
    r.outputPixelFormat = kCVPixelFormatType_OneComponent8
    return r
}

func median(_ a: [Double]) -> Double { if a.isEmpty { return 0 }; let s = a.sorted(); return s[s.count / 2] }

// ---------------------------------------------------------------- matte
func runMatte(_ args: Args) {
    guard args.pos.count >= 2 else { die("usage: motus-vision matte <video> --mode ... [--raw out|-] [--png-dir d]") }
    let mode = args.opt["mode"] ?? "person-accurate"
    let fr = FrameReader(path: args.pos[1], start: args.d("start"), dur: args.d("dur"))
    let W = fr.width, H = fr.height
    let fresh = args.opt["fresh"] != nil
    let native = args.opt["native"] != nil   // write masks at the model's native resolution (no upscale)
    let pngDir = args.opt["png-dir"]
    let pngEvery = args.i("png-every", 1)
    if let d = pngDir { try? FileManager.default.createDirectory(atPath: d, withIntermediateDirectories: true) }
    var rawFile: UnsafeMutablePointer<FILE>? = nil
    if let r = args.opt["raw"] { rawFile = (r == "-") ? stdout : fopen(r, "wb"); if rawFile == nil { die("cannot open \(r)") } }
    if let f = rawFile { setvbuf(f, nil, _IOFBF, 1 << 22) }

    var outW = W, outH = H
    var buf = UnsafeMutablePointer<UInt8>.allocate(capacity: W * H)
    var personReq: VNGeneratePersonSegmentationRequest? = nil
    if mode.hasPrefix("person-") && mode != "person-instance" { personReq = personRequest(String(mode.dropFirst(7))) }
    let faceReq = VNDetectFaceRectanglesRequest()
    var visionMs: [Double] = [], totalMs: [Double] = []
    var nativeW = 0, nativeH = 0, n = 0, empty = 0
    var instanceCounts: [Int] = []
    let t0 = now()
    while true {
        var item: (CVPixelBuffer, Double)? = nil
        autoreleasepool { item = fr.next() }
        guard let (pb, _) = item else { break }
        autoreleasepool {
            let ta = now()
            let handler = VNImageRequestHandler(cvPixelBuffer: pb, options: [:])
            var mask: CVPixelBuffer? = nil
            do {
                if let pr0 = personReq {
                    let pr = fresh ? personRequest(String(mode.dropFirst(7))) : pr0
                    try handler.perform([pr])
                    mask = pr.results?.first?.pixelBuffer
                } else if mode == "fg-instance" {
                    let req = VNGenerateForegroundInstanceMaskRequest()
                    let which = args.opt["instances"] ?? "face"
                    if which == "face" { try handler.perform([req, faceReq]) } else { try handler.perform([req]) }
                    if let obs = req.results?.first {
                        var inst = obs.allInstances
                        instanceCounts.append(inst.count)
                        if which == "face", let face = faceReq.results?.max(by: { $0.boundingBox.width < $1.boundingBox.width }) {
                            // label under the face centre in the low-res instance label map
                            let lm = obs.instanceMask
                            CVPixelBufferLockBaseAddress(lm, .readOnly)
                            let lw = CVPixelBufferGetWidth(lm), lh = CVPixelBufferGetHeight(lm), lrb = CVPixelBufferGetBytesPerRow(lm)
                            let lp = CVPixelBufferGetBaseAddress(lm)!.assumingMemoryBound(to: UInt8.self)
                            let cx = min(lw - 1, max(0, Int(face.boundingBox.midX * CGFloat(lw))))
                            let cy = min(lh - 1, max(0, Int((1 - face.boundingBox.midY) * CGFloat(lh))))
                            let label = Int(lp[cy * lrb + cx])
                            CVPixelBufferUnlockBaseAddress(lm, .readOnly)
                            if label > 0 { inst = IndexSet(integer: label) }
                        }
                        mask = try obs.generateScaledMaskForImage(forInstances: inst, from: handler)
                    }
                } else if mode == "person-instance" {
                    let req = VNGeneratePersonInstanceMaskRequest()
                    try handler.perform([req])
                    if let obs = req.results?.first {
                        instanceCounts.append(obs.allInstances.count)
                        mask = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
                    }
                } else { die("unknown mode \(mode)") }
            } catch { elog("frame \(n): \(error)") }
            let tb = now()
            if let m = mask {
                if nativeW == 0 {
                    nativeW = CVPixelBufferGetWidth(m); nativeH = CVPixelBufferGetHeight(m)
                    if native { outW = nativeW; outH = nativeH; buf.deallocate(); buf = UnsafeMutablePointer<UInt8>.allocate(capacity: outW * outH) }
                }
                maskToPlanar8(m, W: outW, H: outH, dst: buf)
            } else { memset(buf, 0, outW * outH); empty += 1 }
            if let f = rawFile { fwrite(buf, 1, outW * outH, f) }
            if let d = pngDir, n % pngEvery == 0 { writeGrayPNG(buf, W: outW, H: outH, path: String(format: "%@/%06d.png", d, n)) }
            let tc = now()
            visionMs.append((tb - ta) * 1000); totalMs.append((tc - ta) * 1000)
            n += 1
        }
    }
    if let f = rawFile { fflush(f); if f != stdout { fclose(f) } }
    let wall = now() - t0
    let steady = Array(visionMs.dropFirst(min(3, max(0, visionMs.count - 1))))
    let stats: [String: Any] = [
        "mode": mode, "frames": n, "empty_frames": empty, "source": [W, H], "out": [outW, outH], "native_mask": [nativeW, nativeH],
        "fps_source": fr.fps, "wall_s": wall, "wall_fps": Double(n) / wall,
        "first_frame_ms": visionMs.first ?? 0, "vision_ms_median": median(steady),
        "vision_ms_mean": steady.reduce(0, +) / Double(max(1, steady.count)),
        "vision_ms_p95": steady.sorted()[min(steady.count - 1, Int(Double(steady.count) * 0.95))],
        "per_frame_total_ms_median": median(Array(totalMs.dropFirst(min(3, max(0, totalMs.count - 1))))),
        "instances_median": instanceCounts.isEmpty ? -1 : instanceCounts.sorted()[instanceCounts.count / 2],
        "stateful_reuse": !fresh,
    ]
    let js = try! JSONSerialization.data(withJSONObject: stats, options: [.sortedKeys])
    elog(String(data: js, encoding: .utf8)!)
}

// ---------------------------------------------------------------- faces
func pts(_ r: VNFaceLandmarkRegion2D?, _ W: Int, _ H: Int) -> [[Double]] {
    guard let r = r else { return [] }
    return r.pointsInImage(imageSize: CGSize(width: W, height: H)).map { [Double($0.x), Double(H) - Double($0.y)] }
}
func centroid(_ p: [[Double]]) -> [Double]? {
    if p.isEmpty { return nil }
    return [p.map { $0[0] }.reduce(0, +) / Double(p.count), p.map { $0[1] }.reduce(0, +) / Double(p.count)]
}
func r1(_ v: Double) -> Double { return (v * 10).rounded() / 10 }

func runFaces(_ args: Args) {
    guard args.pos.count >= 2 else { die("usage: motus-vision faces <video> [--n 60]") }
    let fr = FrameReader(path: args.pos[1], start: args.d("start"), dur: args.d("dur"))
    let W = fr.width, H = fr.height
    let N = args.i("n", 60)
    let segQ = args.opt["seg"] ?? "balanced"
    let span = args.d("dur") ?? (fr.duration - (args.d("start") ?? 0))
    let total = max(1, Int((span * fr.fps).rounded()))
    let step = max(1, total / max(1, N))
    let lmReq = VNDetectFaceLandmarksRequest()
    let segReq: VNGeneratePersonSegmentationRequest? = segQ == "none" ? nil : personRequest(segQ)
    var samples: [[String: Any]] = []
    var visionMs: [Double] = []
    var idx = 0
    let t0 = now()
    var maskBuf: UnsafeMutablePointer<UInt8>? = nil
    var mw = 0, mh = 0
    while true {
        var item: (CVPixelBuffer, Double)? = nil
        autoreleasepool { item = fr.next() }
        guard let (pb, t) = item else { break }
        defer { idx += 1 }
        if idx % step != 0 { continue }
        autoreleasepool {
            let ta = now()
            let handler = VNImageRequestHandler(cvPixelBuffer: pb, options: [:])
            var reqs: [VNRequest] = [lmReq]
            if let s = segReq { reqs.append(s) }
            do { try handler.perform(reqs) } catch { elog("frame \(idx): \(error)"); return }
            visionMs.append((now() - ta) * 1000)
            var s: [String: Any] = ["t": (t * 1000).rounded() / 1000, "frame": idx]
            let faces = lmReq.results ?? []
            s["faces"] = faces.count
            var fx0 = 0.0, fx1 = Double(W)
            if let f = faces.max(by: { $0.boundingBox.width * $0.boundingBox.height < $1.boundingBox.width * $1.boundingBox.height }) {
                let bb = f.boundingBox
                let x = Double(bb.minX) * Double(W), w = Double(bb.width) * Double(W)
                let h = Double(bb.height) * Double(H), y = (1 - Double(bb.maxY)) * Double(H)
                fx0 = x; fx1 = x + w
                s["box"] = [r1(x), r1(y), r1(w), r1(h)]
                s["conf"] = Double(f.confidence)
                if let v = f.roll { s["roll_deg"] = r1(v.doubleValue * 180 / .pi) }
                if let v = f.yaw { s["yaw_deg"] = r1(v.doubleValue * 180 / .pi) }
                if let v = f.pitch { s["pitch_deg"] = r1(v.doubleValue * 180 / .pi) }
                if let lm = f.landmarks {
                    let le = centroid(pts(lm.leftEye, W, H)), re = centroid(pts(lm.rightEye, W, H))
                    let lp = pts(lm.leftPupil, W, H).first, rp = pts(lm.rightPupil, W, H).first
                    if let a = le, let b = re {
                        s["left_eye"] = [r1(a[0]), r1(a[1])]; s["right_eye"] = [r1(b[0]), r1(b[1])]
                        s["eye_line_y"] = r1((a[1] + b[1]) / 2); s["eye_mid_x"] = r1((a[0] + b[0]) / 2)
                        s["eye_dist"] = r1(hypot(a[0] - b[0], a[1] - b[1]))
                    }
                    if let a = lp, let b = rp { s["pupils"] = [[r1(a[0]), r1(a[1])], [r1(b[0]), r1(b[1])]] }
                    let contour = pts(lm.faceContour, W, H)
                    if !contour.isEmpty {
                        s["chin_y"] = r1(contour.map { $0[1] }.max()!)
                        s["contour_x"] = [r1(contour.map { $0[0] }.min()!), r1(contour.map { $0[0] }.max()!)]
                    }
                    if let n = centroid(pts(lm.nose, W, H)) { s["nose"] = [r1(n[0]), r1(n[1])] }
                }
            }
            if let sr = segReq, let m = sr.results?.first?.pixelBuffer {
                let w = CVPixelBufferGetWidth(m), h = CVPixelBufferGetHeight(m)
                if maskBuf == nil { mw = w; mh = h; maskBuf = UnsafeMutablePointer<UInt8>.allocate(capacity: w * h) }
                maskToPlanar8(m, W: mw, H: mh, dst: maskBuf!)
                let p = maskBuf!
                let sx = Double(W) / Double(mw), sy = Double(H) / Double(mh)
                // head top: first row (from the top) with matte > 50% inside the face columns widened by 30% each side
                let pad = (fx1 - fx0) * 0.30
                let c0 = max(0, Int((fx0 - pad) / sx)), c1 = min(mw - 1, Int((fx1 + pad) / sx))
                var top = -1
                var y = 0
                while y < mh && top < 0 {
                    var cnt = 0
                    var x = c0
                    while x <= c1 { if p[y * mw + x] > 127 { cnt += 1 }; x += 1 }
                    if cnt >= max(2, (c1 - c0) / 50) { top = y }
                    y += 1
                }
                if top >= 0 { s["head_top_y"] = r1(Double(top) * sy) }
                // person bbox and head silhouette width at the eye line
                var minX = mw, maxX = -1, minY = mh, maxY = -1
                for yy in 0..<mh { for xx in 0..<mw where p[yy * mw + xx] > 127 {
                    if xx < minX { minX = xx }; if xx > maxX { maxX = xx }; if yy < minY { minY = yy }; if yy > maxY { maxY = yy } } }
                if maxX >= 0 { s["person_box"] = [r1(Double(minX) * sx), r1(Double(minY) * sy), r1(Double(maxX - minX + 1) * sx), r1(Double(maxY - minY + 1) * sy)] }
                if let ey = s["eye_line_y"] as? Double {
                    let row = min(mh - 1, max(0, Int(ey / sy)))
                    var a = -1, b = -1
                    for xx in c0...c1 where p[row * mw + xx] > 127 { if a < 0 { a = xx }; b = xx }
                    if a >= 0 { s["head_span_at_eyes"] = [r1(Double(a) * sx), r1(Double(b) * sx)] }
                }
            }
            samples.append(s)
        }
    }
    let wall = now() - t0
    let steady = Array(visionMs.dropFirst(min(2, max(0, visionMs.count - 1))))
    let out: [String: Any] = [
        "video": args.pos[1], "width": W, "height": H, "fps": fr.fps, "duration": fr.duration, "frames_read": idx,
        "sampled": samples.count, "step": step, "seg_quality": segQ, "seg_native": [mw, mh],
        "wall_s": wall, "vision_ms_median": median(steady), "samples": samples,
    ]
    let js = try! JSONSerialization.data(withJSONObject: out, options: [.sortedKeys])
    FileHandle.standardOutput.write(js)
    FileHandle.standardOutput.write("\n".data(using: .utf8)!)
}

func runInfo() {
    var o: [String: Any] = [:]
    o["os"] = ProcessInfo.processInfo.operatingSystemVersionString
    o["person_segmentation_revisions"] = VNGeneratePersonSegmentationRequest.supportedRevisions.map { $0 }
    o["foreground_instance_revisions"] = VNGenerateForegroundInstanceMaskRequest.supportedRevisions.map { $0 }
    o["person_instance_revisions"] = VNGeneratePersonInstanceMaskRequest.supportedRevisions.map { $0 }
    o["face_landmarks_revisions"] = VNDetectFaceLandmarksRequest.supportedRevisions.map { $0 }
    o["face_rectangles_revisions"] = VNDetectFaceRectanglesRequest.supportedRevisions.map { $0 }
    let js = try! JSONSerialization.data(withJSONObject: o, options: [.sortedKeys, .prettyPrinted])
    print(String(data: js, encoding: .utf8)!)
}

let args = Args(Array(CommandLine.arguments.dropFirst()))
switch args.pos.first ?? "" {
case "matte": runMatte(args)
case "faces": runFaces(args)
case "info": runInfo()
default: die("usage: motus-vision matte|faces|info ...")
}
