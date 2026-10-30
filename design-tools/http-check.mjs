import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {once} from 'node:events';import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),port='4193',origin=`http://127.0.0.1:${port}`;
const {pages}=JSON.parse(fs.readFileSync(path.join(root,'release-checks/manifest.json')));
const server=spawn(process.execPath,['design-tools/serve.mjs'],{cwd:root,env:{...process.env,PORT:port},stdio:['ignore','pipe','pipe']});
try{
 await Promise.race([once(server.stdout,'data'),once(server,'exit').then(()=>{throw Error('Local preview failed to start')})]);
 for(const page of pages){const response=await fetch(origin+'/'+page);assert.equal(response.status,200,page);assert.match(response.headers.get('x-robots-tag'),/noindex/);assert.equal(await response.text(),fs.readFileSync(path.join(root,page),'utf8'))}
 const privacy=await fetch(origin+'/privacy-modulo.html');assert.equal(privacy.status,200);
 const clip=await fetch(origin+'/film/chp-originale.mp4',{headers:{Range:'bytes=0-127'}});assert.equal(clip.status,206);assert.equal((await clip.arrayBuffer()).byteLength,128);
 for(const blocked of ['.git/config','design-tools/base-c696014.json.gz','release-checks/manifest.json'])assert.equal((await fetch(origin+'/'+blocked)).status,403);
 const css=await fetch(origin+'/inner-premium.css');assert.equal(css.status,200);
 console.log('PASS HTTP: 45 pages + privacy, identical HTML, video byte range, development noindex header and blocked repository metadata. No contact submission performed.');
}finally{server.kill();}
