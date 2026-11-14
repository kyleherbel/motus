#!/usr/bin/env node
// Generates style.json from the element modules, so parameters and beats are declared
// in exactly one place (the element's own file). Run after adding or changing an element:
//   node styles/night-class/build-manifest.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { elements, layouts } from './src/elements/index.js';
import { motion } from './src/tokens.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const head = JSON.parse(await fs.readFile(path.join(here, 'style.head.json'), 'utf8'));

const manifest = {
  ...head,
  timing: { sceneLead: motion.sceneLead },
  layouts: Object.fromEntries(Object.entries(layouts).map(([id, l]) => [id, {
    label: l.label, presenter: l.presenter,
    slots: Object.fromEntries(l.slots.map((slot) => [slot, elements.filter((e) => e.slots.includes(slot)).map((e) => e.type)])),
  }])),
  elements: Object.fromEntries(elements.map((e) => [e.type, { label: e.label, slots: e.slots, params: e.params || {}, beats: e.beats || {} }])),
};
await fs.writeFile(path.join(here, 'style.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`style.json: ${elements.length} elements, ${Object.keys(layouts).length} layouts`);
