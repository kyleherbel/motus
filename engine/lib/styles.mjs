// Style packs on disk: discovery and manifest loading.
import path from 'node:path';
import fs from 'node:fs/promises';
import { STYLES, readJson, exists, MotusError } from './util.mjs';

/** A style id is a folder name: letters, digits, "-" and "_" (never a path). */
const ID = /^[a-z0-9][a-z0-9_-]*$/i;

// A pack may show a small preview on the app's style cards: "preview": { "video": "preview.webm", "poster": "preview.webp" }.
// Only plain file names inside the pack with an image or video extension are accepted.
const PREVIEW_FILE = /^[\w.-]+\.(webm|mp4|webp|png|jpg|jpeg)$/i;
function previewOf(p) {
  if (!p || typeof p !== 'object') return null;
  const out = {};
  for (const k of ['video', 'poster']) if (typeof p[k] === 'string' && PREVIEW_FILE.test(p[k]) && !p[k].startsWith('.')) out[k] = p[k];
  return out.video || out.poster ? out : null;
}

export async function listStyles() {
  let dirs = [];
  try { dirs = await fs.readdir(STYLES, { withFileTypes: true }); } catch { return []; }
  const out = [];
  for (const d of dirs) {
    if (!d.isDirectory() || d.name.startsWith('.') || d.name.startsWith('_')) continue;
    const file = path.join(STYLES, d.name, 'style.json');
    if (!(await exists(file))) continue;
    const base = { dir: path.join(STYLES, d.name), guide: path.join(STYLES, d.name, 'STYLE.md') };
    let m;
    try { m = await readJson(file); } catch (e) {
      // one broken pack must not hide the others (or break motus doctor)
      out.push({ id: d.name, name: d.name, version: '?', summary: `broken: ${e.message.split('\n')[0]}`, bestFor: [], aspect: '?', status: 'broken', ...base });
      continue;
    }
    out.push({
      id: m.id ?? d.name, name: m.name ?? d.name, version: m.version, summary: m.summary ?? '', bestFor: m.bestFor || [],
      aspect: m.aspect || '9:16', status: m.status || 'stable', order: Number.isFinite(m.order) ? m.order : 100, preview: previewOf(m.preview), ...base,
    });
  }
  // a manifest may ask to be listed earlier with "order" (lower first); ties and the rest go by name
  return out.sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || String(a.name).localeCompare(String(b.name)));
}

export async function loadStyle(id) {
  if (typeof id !== 'string' || !id) {
    const have = (await listStyles()).map((s) => s.id).join(', ') || 'none installed';
    throw new MotusError('No style chosen for this project.', `Set "style" in plan/edit.json (installed: ${have}), or start the project with: motus init <video> --style <id>`);
  }
  if (!ID.test(id)) throw new MotusError(`"${id}" is not a style id.`, 'A style id is the name of a folder under styles/ (letters, digits, "-", "_"). List them with: motus styles');
  const dir = path.join(STYLES, id);
  const file = path.join(dir, 'style.json');
  if (!(await exists(file))) {
    const have = (await listStyles()).map((s) => s.id).join(', ') || 'none installed';
    throw new MotusError(`Unknown style "${id}".`, `Installed styles: ${have}. List them with: motus styles`);
  }
  const manifest = await readJson(file);
  if (manifest.id !== id) throw new MotusError(`styles/${id}/style.json declares id "${manifest.id}".`, 'The folder name and the manifest id must match.');
  return { id, dir, manifest, guide: path.join(dir, 'STYLE.md') };
}
