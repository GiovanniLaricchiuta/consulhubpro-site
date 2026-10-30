import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
export const ROOT=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const BASE='c696014ce6acf7dc6b9352de35cdd4202c35e0e4';
const bytes=fs.readFileSync(new URL('./base-c696014.json.gz',import.meta.url));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'cfc9c69e75eb3d18ce7098c85834f8b2c7c5c93ea2869c1c19b5205309c65887','Immutable production baseline modified');
const data=JSON.parse(zlib.gunzipSync(bytes));assert.equal(data.commit,BASE);
export const manifest=data.manifest;
export function source(file){if(file==='release-checks/manifest.json')return JSON.stringify(manifest);assert(Object.hasOwn(data.html,file),'Missing production source: '+file);return data.html[file]}
export const baselineSources=new Map(Object.entries(data.html));
