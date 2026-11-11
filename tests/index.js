// Entry point for `node --test tests/`: Node 22+ treats a directory argument as a module and loads
// this file (package.json "main"), so it imports every *.test.mjs here into one test run.
// `node --test` from the repository root finds the same files on its own, one process each.
import './helpers.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.test.mjs')).sort()) await import(`./${f}`);
