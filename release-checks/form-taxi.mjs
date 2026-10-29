import fs from 'node:fs';import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),endpoint='https://form.taxi/s/33u46gb0';
for(const file of ['index.html','contatti.html']){
 const h=fs.readFileSync(new URL(file,root),'utf8'),form=h.match(/<form id="contact-form"[\s\S]*?<\/form>/)?.[0];
 assert(form?.includes('action="'+endpoint+'"'),file+' form action');
 for(const field of ['name','email','studio','message','privacy','_subject','_lang','_gotcha'])assert(form.includes('name="'+field+'"'),file+' field '+field);
 assert(h.includes('href="privacy-modulo.html"'));assert(!/formsubmit\.co/i.test(h));
}
for(const file of ['site.js','home.js']){const js=fs.readFileSync(new URL(file,root),'utf8');assert(js.includes(endpoint));assert(js.includes("headers:{Accept:'application/json'},body:new FormData(contactForm)"));assert(!/formsubmit\.co/i.test(js));assert(js.includes('I campi sono conservati:'));}
const policy=fs.readFileSync(new URL('privacy-modulo.html',root),'utf8');
for(const value of ['CONSULTING ADVANCED S.R.L.','Via Vallazze 100, 20131 Milano','12234360969','g.laricchiuta@consulhubpro.it','contenuto libero','https://form.taxi/en/privacy','https://www.iubenda.com/privacy-policy/78495644','https://www.iubenda.com/privacy-policy/78495644/cookie-policy'])assert(policy.includes(value),'Privacy '+value);
assert(!/FormSubmit|non ancora rilasciabile/.test(policy));
console.log('PASS Form.taxi: public endpoint, AJAX, preserved fields, error handling and linked supplement. Real receipt checked separately.');
