import fs from 'node:fs';import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),origin='https://www.consulhubpro.it/';
const {pages}=JSON.parse(fs.readFileSync(new URL('manifest.json',import.meta.url)));
const titles=new Set(),descriptions=new Set();
for(const file of pages){
 const html=fs.readFileSync(new URL(file,root),'utf8');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1],description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
 assert(title&&!titles.has(title),'Missing/duplicate title: '+file);titles.add(title);
 assert(description&&!descriptions.has(description),'Missing/duplicate description: '+file);descriptions.add(description);
 assert.equal([...html.matchAll(/<h1\b/gi)].length,1,'H1: '+file);
 const url=origin+(file==='index.html'?'':file);assert(html.includes('<link rel="canonical" href="'+url+'"'));
 for(const key of ['type','title','description','url','image','site_name','locale'])assert(html.includes('property="og:'+key+'"'),'OG '+key+': '+file);
 const graph=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m=>{const o=JSON.parse(m[1]);return o['@graph']||[o]});
 const org=graph.find(g=>g['@id']===origin+'#organization');assert.equal(org?.url,origin);assert.equal(org?.name,'ConsulHub Pro');
 for(const article of graph.filter(g=>g['@type']==='Article')){
  assert(article.image?.startsWith(origin+'media/'),'Article image not aligned: '+file);
  assert(fs.existsSync(new URL(article.image.slice(origin.length),root)),'Article image file: '+file);
 }
 if(file==='index.html')assert(graph.some(g=>g['@type']==='WebSite'));
}
const sitemap=[...fs.readFileSync(new URL('sitemap.xml',root),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(sitemap).size,45);assert.equal(sitemap.length,45);
for(const file of pages)assert(sitemap.includes(origin+(file==='index.html'?'':file)));
console.log('PASS SEO: 45 unique titles/descriptions, H1, OG, aligned article images, organization, WebSite and sitemap.');
