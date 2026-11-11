#!/usr/bin/env python3
"""Transcribe an audio file to words with timings, using faster-whisper.

Writes {language, duration, model, words:[{i,w,start,end,p}], segments:[{start,end,text,words:[i0,i1]}]}.
Progress goes to stderr as JSON lines: {"progress": 0.42}.
"""
import argparse
import json
import os
import sys


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default=os.environ.get("MOTUS_WHISPER_MODEL", "large-v3-turbo"))
    ap.add_argument("--language", default=None, help="ISO code; omit to auto-detect")
    ap.add_argument("--device", default=os.environ.get("MOTUS_WHISPER_DEVICE", "auto"))
    ap.add_argument("--compute", default=os.environ.get("MOTUS_WHISPER_COMPUTE", "int8"))
    ap.add_argument("--prompt", default=None, help="names and terms to bias spelling, comma separated")
    args = ap.parse_args()

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print(json.dumps({"error": "faster-whisper is not installed",
                          "fix": "python3 -m pip install faster-whisper"}))
        return 2

    model = WhisperModel(args.model, device=args.device, compute_type=args.compute)
    segments, info = model.transcribe(
        args.audio,
        language=args.language,
        beam_size=5,
        word_timestamps=True,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 300},
        condition_on_previous_text=False,
        initial_prompt=args.prompt,
    )
    words, segs = [], []
    total = float(info.duration or 0) or 1.0
    for seg in segments:
        i0 = len(words)
        for w in seg.words or []:
            text = w.word.strip()
            if not text:
                continue
            words.append({
                "i": len(words),
                "w": text,
                "start": round(float(w.start), 3),
                "end": round(float(w.end), 3),
                "p": round(float(w.probability), 3),
            })
        if len(words) > i0:
            segs.append({"start": round(float(seg.start), 3), "end": round(float(seg.end), 3),
                         "text": seg.text.strip(), "words": [i0, len(words) - 1]})
        print(json.dumps({"progress": round(min(1.0, float(seg.end) / total), 3)}), file=sys.stderr, flush=True)

    # Whisper sometimes returns zero-length or overlapping words; make them strictly ordered.
    for a, b in zip(words, words[1:]):
        if b["start"] < a["start"]:
            b["start"] = a["start"]
        if a["end"] > b["start"]:
            a["end"] = b["start"]
        if a["end"] <= a["start"]:
            a["end"] = round(a["start"] + 0.02, 3)
    if words and words[-1]["end"] <= words[-1]["start"]:
        words[-1]["end"] = round(words[-1]["start"] + 0.05, 3)

    out = {
        "language": info.language,
        "language_probability": round(float(info.language_probability or 0), 3),
        "duration": round(float(info.duration or 0), 3),
        "model": args.model,
        "words": words,
        "segments": segs,
    }
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(json.dumps({"ok": True, "words": len(words), "segments": len(segs), "language": info.language}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
