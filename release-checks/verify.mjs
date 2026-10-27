import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url)));
const root=new URL('../',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [file,expected] of Object.entries(manifest.files))assert.equal(hash(fs.readFileSync(new URL(file,root))),expected,'Approved production file changed: '+file);
const sitemap=fs.readFileSync(new URL('sitemap.xml',root),'utf8'),robots=fs.readFileSync(new URL('robots.txt',root),'utf8');
assert.match(robots,/Allow: \//);assert(!/Disallow:\s*\/\s*(?:\n|$)/.test(robots));assert.equal([...sitemap.matchAll(/<loc>/g)].length,45);
for(const file of manifest.pages){const html=fs.readFileSync(new URL(file,root),'utf8');assert(!/noindex|nofollow/.test(html),'Indexing blocked: '+file);assert(html.includes('href="https://www.consulhubpro.it/'+(file==='index.html'?'':file)+'"'),'Canonical: '+file);assert.match(html,/<meta name="robots" content="index,follow">/);}
assert.equal(manifest.pages.length,45);console.log('PASS: 45 production pages, canonicals, sitemap, robots and approved file hashes.');
// Scan every publishable text file, including legacy directories and generated scripts.
const forbidden=/form(?:a)?[\s._-]*azienda|e[\s._-]*b[\s._-]*i[\s._-]*l[\s._-]*p|f[\s._-]*i[\s._-]*s[\s._-]*a[\s._-]*p[\s._-]*i/gi;
function checkPublicDirectory(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
 if(entry.name==='.git')continue;const file=new URL(entry.name+(entry.isDirectory()?'/':''),directory);
 if(entry.isDirectory())checkPublicDirectory(file);
 else if(/\.(html|js|css|xml|json|txt|md|svg|yml)$/.test(entry.name)){
  const text=fs.readFileSync(file,'utf8');assert.equal([...text.matchAll(forbidden)].length,0,'Unauthorized public pillar reference: '+file.pathname);
 }
}}
checkPublicDirectory(root);console.log('PASS: zero unauthorized pillar references in all publication text files.');
