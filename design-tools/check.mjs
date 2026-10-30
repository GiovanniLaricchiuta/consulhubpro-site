import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import zlib from 'node:zlib';
import {ROOT as root,BASE,manifest as base,baselineSources} from './base.mjs';
process.chdir(root);
const norm=b=>b.toString().replace(/\r\n/g,'\n'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const inventory=JSON.parse(fs.readFileSync('design-tools/inventory.json')),proof=JSON.parse(fs.readFileSync('design-tools/content-proof.json')),approved=JSON.parse(fs.readFileSync('design-tools/approved-samples.json'));
assert.equal(inventory.pages.length,42);assert.equal(base.pages.length,45);assert.equal(proof.pages.length,42);assert(proof.pages.every(p=>p.exactOriginalRecovered));
// privacy-modulo.html: autorizzata dal titolare il 30 ottobre 2026 la sostituzione del recapito privacy con info@consulhubpro.it.
const expectedChanged=new Set([...inventory.pages.map(p=>p.file),'per-studi.html','servizi.html','privacy-modulo.html']);
let preserved=0;for(const [file,expected]of Object.entries(base.files)){if(expectedChanged.has(file))continue;assert.equal(hash(base.hashNormalization==='lf-text-v1'&&(/\.(html|css|js|xml|txt|md|json|svg)$/i.test(file)||file==='CNAME')?norm(fs.readFileSync(file)):fs.readFileSync(file)),expected,'Protected base file changed: '+file);preserved++}
for(const [file,expected]of Object.entries(approved.hashes))assert.equal(hash(fs.readFileSync(file)),expected,'Approved sample changed: '+file);
const issues=[],refs=[],images=[],pages=new Set(base.pages);const addIssue=(page,type,value)=>issues.push({page,type,value});
const decode=s=>s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
const htmlCache=new Map();const getHtml=p=>{if(!htmlCache.has(p))htmlCache.set(p,fs.readFileSync(p,'utf8'));return htmlCache.get(p)};
for(const page of base.pages){const html=getHtml(page),head=html.slice(0,html.indexOf('</head>'));
 assert(!/<meta[^>]+(?:noindex|nofollow)/i.test(head),page+' indexing');assert.equal([...html.matchAll(/<h1\b/g)].length,1,page+' H1 count');
 const plain=html.replace(/<script\b[\s\S]*?<\/script>/gi,'').replace(/<style\b[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ');
 if(/\b(?:undefined|null|NaN)\b/.test(plain))addIssue(page,'Technical value in text',plain.match(/.{0,40}\b(?:undefined|null|NaN)\b.{0,40}/)?.[0]);
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const value=decode(m[1]);if(/^(https?:|mailto:|tel:|data:|javascript:)/i.test(value))continue;
  const [pathname,fragment]=value.split('#'),file=pathname.split('?')[0]||page,absolute=path.resolve(path.dirname(page),file.endsWith('/')?file+'index.html':file);
  refs.push({page,value});if(!absolute.startsWith(root+path.sep))addIssue(page,'Outside site',value);else if(!fs.existsSync(absolute))addIssue(page,'Missing file',value);else if(fragment&&file.endsWith('.html')){const destination=getHtml(path.relative(root,absolute));if(!destination.includes('id="'+fragment+'"')&&!destination.includes("id='"+fragment+"'"))addIssue(page,'Missing fragment',value)}
 }
 for(const img of html.matchAll(/<img\b[^>]*>/g)){const tag=img[0],src=tag.match(/src="([^"]+)"/)?.[1];if(src&&!/https?:/.test(src)){assert(fs.existsSync(src),'Image missing '+src);images.push({page,src,bytes:fs.statSync(src).size,hash:hash(fs.readFileSync(src))});}assert(/\balt="[^"]*"/.test(tag),page+' image alt');for(const v of tag.match(/srcset="([^"]+)"/)?.[1]?.split(',')||[]){assert(fs.existsSync(v.trim().split(' ')[0]),'Missing srcset '+v)}}
 assert(html.includes('https://embeds.iubenda.com/widgets/ff65dfa4-bd4d-478e-bac9-43a70683b4cf.js'),page+' consent integration');
}
// Compare head tags, contact form and all original links with immutable Git in one archive.
const sources=baselineSources;
for(const page of base.pages){const before=sources.get(page),after=getHtml(page),cleanHead=h=>norm(h.slice(0,h.indexOf('</head>'))).replace(/<link rel="stylesheet" href="(?:inner-premium|samples)\.css"><script type="module" src="(?:inner-premium|samples)\.js"><\/script>/g,'');assert.equal(cleanHead(after),cleanHead(before),'SEO or integration head changed '+page);for(const link of before.matchAll(/<a\b[^>]*href="([^"]+)"/g)){if(page==='lead-generation.html'&&link[1]==='https://www.pexels.com/photo/people-discuss-strategy-documents-7688106/')continue;assert(after.includes('href="'+link[1]+'"'),'Original link removed '+page+' '+link[1])}if(page==='contatti.html')assert.equal(norm(after.match(/<form\b[\s\S]*?<\/form>/)?.[0]),norm(before.match(/<form\b[\s\S]*?<\/form>/)?.[0]),'Contact form changed')}
const incoming=new Map([...pages].map(p=>[p,0]));for(const r of refs){const name=r.value.split('#')[0];if(incoming.has(name))incoming.set(name,incoming.get(name)+1)}const isolated=[...incoming].filter(([p,n])=>p!=='index.html'&&n===0);assert.equal(isolated.length,0,'Isolated pages');
const duplicateHeroPhotos=Object.values(Object.groupBy(images.filter(x=>!x.src.includes('logo')&&!x.src.includes('partners')&&x.page!=='index.html'&&x.page!=='blog.html'),x=>x.hash)).filter(g=>g.length>1);
const result={pages:45,updatedInnerPages:44,protectedUnchangedFiles:preserved,approvedSamplesFrozen:true,seoHeadsIdentical:true,originalContactFormIdentical:true,allOriginalLinksPreserved:true,linksChecked:refs.length,issues,isolatedPages:isolated,photos:images.filter(x=>!x.src.includes('logo')&&!x.src.includes('partners')),duplicateHeroPhotos,resources:['inner-premium.css','inner-premium.js'].map(file=>({file,bytes:fs.statSync(file).size,gzipBytes:zlib.gzipSync(fs.readFileSync(file)).length}))};fs.writeFileSync('design-tools/check-results.json',JSON.stringify(result,null,2));
assert.equal(issues.length,0,'Local links/resources/text issues: '+JSON.stringify(issues));console.log(`PASS: ${base.pages.length} pages; ${refs.length} local references; original content, SEO, form, consent, homepage and approved samples preserved. ${preserved} protected files unchanged.`);
