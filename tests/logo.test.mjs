import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siSlug, imageSize } from '../engine/lib/logo.mjs';

test('siSlug follows the Simple Icons rules', () => {
  assert.equal(siSlug('YouTube'), 'youtube');
  assert.equal(siSlug('Google Ads'), 'googleads');
  assert.equal(siSlug('C++'), 'cplusplus');
  assert.equal(siSlug('Node.js'), 'nodedotjs');
  assert.equal(siSlug('AT&T'), 'atandt');
  assert.equal(siSlug('Pokémon'), 'pokemon');
});

test('imageSize reads PNG, GIF and JPEG headers and rejects the rest', () => {
  const png = Buffer.alloc(32); png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); png.writeUInt32BE(180, 16); png.writeUInt32BE(144, 20);
  assert.deepEqual(imageSize(png), { type: 'png', w: 180, h: 144 });
  const gif = Buffer.alloc(32); gif.write('GIF89a'); gif.writeUInt16LE(64, 6); gif.writeUInt16LE(48, 8);
  assert.deepEqual(imageSize(gif), { type: 'gif', w: 64, h: 48 });
  const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0xb4, 0x00, 0xf0, 0x03, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(imageSize(jpg), { type: 'jpg', w: 240, h: 180 });
  assert.equal(imageSize(Buffer.from('<svg></svg>xxxxxxxxxxxxxxxxxxxxxxxx')), null);
});
