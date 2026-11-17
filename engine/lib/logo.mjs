// Brand marks for a project's graphics (`motus logo`). The mark goes into the user's project, never into
// the repository. Two sources, in order:
//   1. the site's own icon, full colour, from Google's favicon service at 256 px (kept when >= 96 px)
//   2. Simple Icons (CC0 icon data, simpleicons.org): the brand's vector mark in its official colour
// A brand with neither is reported with a fix: name its official site with --domain, or supply a file.
import fs from 'node:fs/promises';
import path from 'node:path';
import { MotusError, CACHE, mkdirp } from './util.mjs';

export const SI_VERSION = '13.21.0';
const SI_BASE = `https://cdn.jsdelivr.net/npm/simple-icons@${SI_VERSION}`;
const FAVICON = (domain) => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`;
const MIN_SITE = 96;   // a smaller site icon is upscaled mush on a 180 px tile

/** Simple Icons' slug for a title (their documented rules: + plus, . dot, & and, diacritics and the rest dropped). */
export function siSlug(title) {
  return String(title).toLowerCase()
    .replace(/\+/g, 'plus').replace(/^\./, 'dot-').replace(/\.$/, '-dot').replace(/\./g, '-dot-').replace(/&/g, 'and')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/** Width and height of a PNG, JPEG or GIF from its bytes; null when it is something else. */
export function imageSize(buf) {
  if (!buf || buf.length < 24) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return { type: 'png', w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return { type: 'gif', w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { type: 'jpg', w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  return null;
}

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'motus-logo' }, redirect: 'follow' });
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function siIndex() {
  const file = path.join(CACHE, `simple-icons-${SI_VERSION}.json`);
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { /* not cached yet */ }
  const buf = await get(`${SI_BASE}/_data/simple-icons.json`);
  if (!buf) return null;
  const data = JSON.parse(buf.toString('utf8'));
  await mkdirp(CACHE);
  await fs.writeFile(file, JSON.stringify(data));
  return data;
}

/** The Simple Icons entry for a brand name ("YouTube", "x", "OpenAI"), or null. */
export async function findBrand(name) {
  const data = await siIndex();
  const icons = Array.isArray(data) ? data : data?.icons || [];
  const want = siSlug(name);
  const hit = icons.find((i) => (i.slug || siSlug(i.title)) === want) || icons.find((i) => (i.aliases?.aka || []).some((a) => siSlug(a) === want));
  return hit ? { title: hit.title, slug: hit.slug || siSlug(hit.title), hex: hit.hex } : null;
}

const withExt = (file, ext) => file.replace(/\.(png|jpe?g|gif|svg|webp)$/i, '') + `.${ext}`;

/**
 * Fetch a brand mark into `out` (its extension is set to what was found).
 * opt: { brand, domain, out, mono, icon, colour } -> { file, source, domain?, w?, h?, hex? }
 * icon: a Simple Icons name to use when the brand is filed under another (ChatGPT -> openai); colour: recolour the vector mark.
 */
export async function fetchLogo({ brand, domain, out, mono = false, icon = null, colour = null }) {
  if (!brand && !domain) throw new MotusError('Missing the brand.', 'Usage: motus logo <brand> --out <project>/assets/logos/name.png [--domain site.com] [--mono]');
  if (!out) throw new MotusError('Missing --out.', 'Usage: motus logo <brand> --out <project>/assets/logos/name.png');
  const info = (icon || brand) ? await findBrand(icon || brand).catch(() => null) : null;
  if (icon) mono = true;
  const dom = domain || (/\.[a-z]{2,}$/i.test(brand || '') ? brand : `${info?.slug || siSlug(brand)}.com`);
  await mkdirp(path.dirname(path.resolve(out)));

  if (!mono) {
    const buf = await get(FAVICON(dom)).catch(() => null);
    const size = imageSize(buf);
    if (size && size.w >= MIN_SITE && size.h >= MIN_SITE) {
      const file = withExt(path.resolve(out), size.type);
      await fs.writeFile(file, buf);
      const meta = { brand: brand || dom, source: 'site icon', domain: dom, w: size.w, h: size.h, note: 'The brand\'s own mark: a trademark of its owner, used to name it. Kept in this project only.' };
      await fs.writeFile(`${file}.json`, JSON.stringify(meta, null, 2));
      return { file, ...meta };
    }
  }
  if (info) {
    const svg = await get(`${SI_BASE}/icons/${info.slug}.svg`).catch(() => null);
    if (svg) {
      const hex = colour && /^#?[0-9a-f]{6}$/i.test(colour) ? colour.replace('#', '') : info.hex;
      const coloured = svg.toString('utf8').replace('<svg ', `<svg fill="#${hex}" `);
      const file = withExt(path.resolve(out), 'svg');
      await fs.writeFile(file, coloured);
      const meta = { brand: brand || info.title, source: `Simple Icons ${SI_VERSION} (CC0 icon data, ${info.title})`, hex: `#${hex}`, note: 'The brand\'s mark: a trademark of its owner, used to name it. Kept in this project only.' };
      await fs.writeFile(`${file}.json`, JSON.stringify(meta, null, 2));
      return { file, ...meta };
    }
  }
  throw new MotusError(`No icon found for "${brand || dom}".`, 'Pass the brand\'s official site with --domain, or the Simple Icons name it is filed under with --icon (ChatGPT: --icon openai), or put a logo file the user supplied in the project\'s assets folder.');
}
