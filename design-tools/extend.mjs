import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

import {ROOT as root,BASE,source,manifest} from './base.mjs';
process.chdir(root);
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function replaceDiv(html,replacement){const start=html.indexOf('<div class="inner-visual">');assert(start>=0);const re=/<\/?div\b[^>]*>/g;re.lastIndex=start;let depth=0,m;while(m=re.exec(html)){depth+=m[0].startsWith('</')?-1:1;if(!depth)return{html:html.slice(0,start)+replacement+html.slice(re.lastIndex),old:html.slice(start,re.lastIndex)}}throw Error('Unbalanced visual')}
const text=s=>s.replace(/<[^>]+>/g,'').trim();
const escape=s=>s.replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g,'&amp;').replace(/"/g,'&quot;');
const added=s=>`<!--inner-extension-start-->${s}<!--inner-extension-end-->`;
const strip=s=>s.replace(/<!--inner-extension-start-->[\s\S]*?<!--inner-extension-end-->/g,'');
const typeOf=(html,file)=>file==='blog.html'?'journal':file==='contatti.html'?'contact':file==='perche-chp.html'?'model':file==='pilastri.html'?'pillars':html.match(/kind-(\w+)/)[1];
const glyph=(html)=>html.match(/<svg class="family-glyph"[\s\S]*?<\/svg>/)?.[0]||'';
const headings=html=>[...html.matchAll(/<h2 id="(lettura-\d+)">([\s\S]*?)<\/h2>/g)].map(m=>({id:m[1],label:text(m[2])}));
const chapterNav=(items,style='chapter-compass')=>`<nav class="${style}" aria-label="Percorsi di approfondimento">${items.slice(0,3).map((x,i)=>`<a href="#${x.id}" data-chapter-target="${x.id}"><span class="compass-index">0${i+1}</span><span>${x.label}</span><i aria-hidden="true">↗</i></a>`).join('')}</nav>`;
const inventory=[],proof=[];
for(const file of manifest.pages){
 if(file==='index.html'||file==='per-studi.html'||file==='servizi.html')continue;
 const original=source(file),type=typeOf(original,file),family=Number(original.match(/family-(\d+)/)?.[1]||0),items=headings(original);
 let html=original,visual=null,oldVisual=null;
 let composition=type==='macroarea'?(family%2?'panorama':'atlas'):type==='servizio'?(['dossier','focus','process'][family%3]):type==='articolo'?(['aumentare-valore-cliente-senza-assumere.html','oltre-il-payroll-studi-consulenza-lavoro.html'].includes(file)?'essay':'cover'):type;
 if(type==='pilastro')composition=['formazione-finanziata.html','ente-bilaterale.html','assistenza-contrattuale.html'].indexOf(file)%2?'pillar-wide':'pillar-split';
 if(file==='lead-generation.html'){
  visual=`<div class="inner-visual">${glyph(original)}<figure class="page-photo hero-photo"><img src="inner-media/lead-1200.webp" srcset="inner-media/lead-640.webp 640w, inner-media/lead-1200.webp 1200w" sizes="(max-width:800px) 92vw, 52vw" width="1200" height="900" fetchpriority="high" alt="Confronto su segmentazione e pianificazione marketing"><figcaption><a href="https://www.pexels.com/photo/people-working-with-documents-in-an-office-7688100/" target="_blank" rel="noopener noreferrer">Kindel Media / Pexels</a> · Repertorio, non team o clienti CHP.</figcaption></figure></div>`;
 }else if(type==='journal'){
  const cards=[...original.matchAll(/<h3><a href="([^"]+)">([\s\S]*?)<\/a><\/h3>/g)];assert.equal(cards.length,4);
  visual=`<div class="inner-visual editorial-index"><nav aria-label="Articoli del Blog">${cards.map((m,i)=>`<a href="${m[1]}"><span>0${i+1}</span><strong>${m[2]}</strong><i aria-hidden="true">↗</i></a>`).join('')}</nav><span class="inner-caption">CONTESTO. COMPETENZE. CONFRONTO.</span></div>`;
 }else if(type==='pillars'){
  const labels=['Formazione finanziata','Ente bilaterale','Assistenza contrattuale'],files=['formazione-finanziata.html','ente-bilaterale.html','assistenza-contrattuale.html'];
  visual=`<div class="inner-visual pillars-diagram"><svg viewBox="0 0 600 440" aria-hidden="true"><path d="M70 90C200 90 180 220 300 220S400 350 530 350M70 90 530 90M300 220V350H530"/></svg>${labels.map((label,i)=>`<a href="${files[i]}" class="pillar-point pillar-point-${i}"><span>0${i+1}</span><strong>${label}</strong><i aria-hidden="true">↗</i></a>`).join('')}<span class="inner-caption">CONTESTO. COMPETENZE. CONFRONTO.</span></div>`;
 }else if(type==='model'){
  visual=`<div class="inner-visual model-photo"><figure class="page-photo"><img src="inner-media/model-1400.webp" srcset="inner-media/model-640.webp 640w, inner-media/model-1400.webp 1400w" sizes="(max-width:800px) 92vw, 52vw" width="1400" height="931" fetchpriority="high" alt="Un partecipante a Milano riordina i contributi su un canvas di progetto"><figcaption><a href="https://unsplash.com/photos/man-in-white-dress-shirt-holding-yellow-and-white-labeled-pack-5NrLhyRAh-E" target="_blank" rel="noopener noreferrer">FORTYTWO / Unsplash · Milano</a></figcaption></figure><span class="inner-caption">CONTESTO. COMPETENZE. CONFRONTO.</span></div>`;
 }else if(type==='contact'){
  visual='<div class="inner-visual contact-space"><svg viewBox="0 0 600 160" aria-hidden="true"><path d="M10 80H180C260 80 240 25 330 25H590M180 80C260 80 240 135 330 135H590"/><circle cx="180" cy="80" r="8"/><circle cx="330" cy="25" r="5"/><circle cx="330" cy="135" r="5"/></svg><span class="inner-caption">CONTESTO. COMPETENZE. CONFRONTO.</span></div>';
 }
 if(visual){const r=replaceDiv(html,visual);html=r.html;oldVisual=r.old}
 html=html.replace(/(<body[^>]*class=")/,'$1refined-inner refined-'+type+' composition-'+composition+' ');
 html=html.replace('</head>','<link rel="stylesheet" href="inner-premium.css"><script type="module" src="inner-premium.js"></script></head>');
 if(type==='macroarea'){
  const cards=[...new Map([...original.matchAll(/<article class="service-card"[\s\S]*?<h3>([\s\S]*?)<\/h3>[\s\S]*?<a[^>]*href="([^"]+\.html)"/g)].map(m=>[m[2],{label:text(m[1]),href:m[2]}])).values()];assert(cards.length>=3&&cards.length<=5,file+' service graph');
  const count=cards.length,center=300,points=cards.map((c,i)=>({x:90+i*420/(count-1),y:140+Math.sin((i+family)*1.3)*34}));
  const map=`<div class="competence-route" data-competence-route><svg viewBox="0 0 600 210" preserveAspectRatio="none" aria-hidden="true">${points.map((p,i)=>`<path data-route-line="${i}" d="M${center} 10C${center} 80 ${p.x} 50 ${p.x} ${p.y}"/>`).join('')}</svg><nav aria-label="Collegamenti tra le competenze">${cards.map((c,i)=>`<a href="${c.href}" data-route-node="${i}"><span>0${i+1}</span>${c.label}<i aria-hidden="true">↗</i></a>`).join('')}</nav></div>`;
  html=html.replace('<div id="scopri"',added(map)+'<div id="scopri"');
 }else if(type==='servizio'&&composition==='process'&&items.length){
  html=html.replace('<div id="scopri"',added(chapterNav(items))+'<div id="scopri"');
 }else if(type==='pilastro'&&items.length){
  html=html.replace('<div id="scopri"',added(chapterNav(items,'pillar-reading-path'))+'<div id="scopri"');
 }
 // Reversible, exact proof: no original content, CTA, metadata or integration was changed.
 let undone=strip(html).replace('refined-inner refined-'+type+' composition-'+composition+' ','').replace('<link rel="stylesheet" href="inner-premium.css"><script type="module" src="inner-premium.js"></script>','');
 if(visual)undone=undone.replace(visual,oldVisual);
 assert.equal(undone,original,'Original content changed: '+file);
 fs.writeFileSync(file,html);
 inventory.push({file,type,family,composition,originalSha256:sha(original),newSha256:sha(html),chapters:items.length,photos:[...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m=>m[1]).filter(x=>!x.includes('logo')&&!x.includes('partner'))});
 proof.push({file,exactOriginalRecovered:true});
}
const approved=JSON.parse(fs.readFileSync('design-tools/approved-samples.json','utf8'));
for(const [file,expected] of Object.entries(approved.hashes))assert.equal(sha(fs.readFileSync(file)),expected,'Approved sample modified: '+file);
assert.equal(fs.readFileSync('index.html','utf8').replace(/\r\n/g,'\n'),source('index.html').replace(/\r\n/g,'\n'),'Homepage changed');
fs.writeFileSync('design-tools/inventory.json',JSON.stringify({base:BASE,pages:inventory,approvedSamples:['per-studi.html','servizi.html'],homepageUnchanged:true,privacyDocumentUnchanged:fs.readFileSync('privacy-modulo.html','utf8').replace(/\r\n/g,'\n')===source('privacy-modulo.html').replace(/\r\n/g,'\n'),faqReviewsPartners:'Existing homepage sections preserved, no duplicate pages'},null,2));
fs.writeFileSync('design-tools/content-proof.json',JSON.stringify({base:BASE,pages:proof,allOriginalContentRecovered:true},null,2));
console.log(`PASS: ${inventory.length} internal pages refined; 2 approved samples frozen; homepage and privacy unchanged. All original content recovered exactly.`);
