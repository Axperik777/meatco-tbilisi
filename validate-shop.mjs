import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root=path.resolve('dist'),locales=JSON.parse(fs.readFileSync('src/locales.json','utf8'));
for(const file of ['app.js','config.js','content.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'));
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),sandbox);
const {dishes,cuts}=sandbox.window.MEATCO_CONTENT;
assert.equal(dishes.length,15);assert.equal(new Set(dishes.map(d=>d.id)).size,15);
assert.equal(new Set(dishes.map(d=>d.image)).size,15);
assert.equal(new Set(cuts.map(c=>c.id)).size,cuts.length);
for(const lang of ['ka','ru','en']){
 assert.deepEqual(Object.keys(locales[lang]).sort(),Object.keys(locales.ka).sort());
 for(const value of Object.values(locales[lang]))assert.ok(typeof value==='string'&&value.trim());
 for(const c of cuts){assert.ok(c.name[lang]&&c.use[lang],c.id+' '+lang);}
 for(const d of dishes){assert.equal(d[lang].length,3);assert.ok(d[lang].every(s=>typeof s==='string'&&s.trim()));}
}
const imageHashes=[];
for(const d of dishes){
 for(const cut of d.cuts)assert.ok(cuts.some(c=>c.id===cut),'Unknown cut '+cut);
 for(const file of [d.image,d.image.replace('.webp','-small.webp')])assert.ok(fs.existsSync(path.join(root,file)),file);
 imageHashes.push(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,d.image))).digest('hex'));
}
assert.equal(new Set(imageHashes).size,15,'Duplicate dish image content');
for(const c of cuts)if(c.price!==undefined){assert.ok(c.price>0,'Zero / invalid public price: '+c.id);assert.ok(['kg','piece'].includes(c.unit));}
const photographed=cuts.filter(c=>c.image&&c.photoStatus!=='pending');
for(const c of photographed)for(const image of [c.image,c.image.replace('.webp','-small.webp')])assert.ok(fs.existsSync(path.join(root,image)),c.id+': missing product photo; mark photoStatus=pending instead of using a substitute');
assert.equal(new Set(photographed.map(c=>c.image)).size,photographed.length,'Mark products without unique photos as pending');
for(const file of ['index.html','catalog.html']){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 assert.equal((html.match(/data-product-card=/g)||[]).length,52,'46 catalog + 6 home products');
 assert.equal((html.match(/data-app-panel=/g)||[]).length,3,'Home/catalog/help app screens');
 assert.ok(html.includes('app-tabbar'));
 assert.ok(html.includes('id="product-quantity"')&&html.includes('class="product-checkout"'));
 assert.ok(!/data-favorite|favorite-toggle|data-story|data-video|cart-video|product-video|card-brand|product-sort|filter-dialog|install-hint/.test(html),'Removed UI must not return');
 assert.equal((html.match(/data-category=/g)||[]).length,5);
 assert.equal((html.match(/name="cart-slot"/g)||[]).length,5);
 assert.ok(html.includes('id="cart-photo"'));
 assert.ok(html.includes('id="cart-district" name="address" type="text"'));
 assert.ok(!/brand-seal|utility-strip|store-hero/.test(html));
}
assert.ok(!/Ваке|Сабуртало|Диди Дигоми|Vake|Saburtalo|Didi Dighomi|ვაკე|საბურთალო|დიდი დიღომი/.test(JSON.stringify(locales)),'District lists removed from all locales');
for(const suffix of ['','-small']){
 const hashes=photographed.map(c=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,c.image.replace('.webp',suffix+'.webp')))).digest('hex'));
 assert.equal(new Set(hashes).size,photographed.length,'Different products must not share identical image content');
}
assert.ok(!fs.readFileSync(path.join(root,'index.html'),'utf8').includes('id="featured-dishes"'));
const pages=['index.html','catalog.html','dishes.html'];
let references=0;
for(const file of pages){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,file+': duplicate ID');
 assert.equal((html.match(/<h1\b/g)||[]).length,file==='dishes.html'?1:3,file+': one h1 for each app screen');
 for(const m of html.matchAll(/data-(?:i18n|alt|aria|placeholder)="([^"]+)"/g))assert.ok(locales.ka[m[1]],file+': untranslated '+m[1]);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(m[1].startsWith('#')){assert.ok(ids.includes(m[1].slice(1)),file+': anchor '+m[1]);continue;}
  if(!m[1].startsWith('./'))continue;
  const url=new URL(m[1],'https://meatco.example/');
  const target=path.join(root,decodeURIComponent(url.pathname));
  assert.ok(fs.existsSync(target),file+': missing '+m[1]);references++;
  if(url.hash){const targetHtml=fs.readFileSync(target,'utf8');assert.ok(targetHtml.includes('id="'+url.hash.slice(1)+'"'),'Broken cross-page anchor '+m[1]);}
 }
 assert.ok(!/Lorem ipsum|®|preview-pig/.test(html));
 assert.ok(html.includes('995568258118'));
 assert.ok(html.includes('data-page='));
}
for(const file of ['style.css','app-ui.css','app-shell.css'])for(const m of fs.readFileSync(path.join(root,file),'utf8').matchAll(/url\(['"]?(\.\/[^)'"]+)/g))assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);
const mapping=JSON.parse(fs.readFileSync('docs/price-mapping.json','utf8'));
for(const p of mapping.mapping){
 const cut=cuts.find(c=>c.id===p.product);assert.ok(cut);
 assert.equal(cut.price,p.retailPrice,cut.id+' price mismatch');assert.equal(cut.unit,p.unit,cut.id+' unit mismatch');
}
const publicFiles=fs.readdirSync(root,{recursive:true}).filter(f=>fs.statSync(path.join(root,f)).isFile());
console.log(JSON.stringify({status:'passed',pages:3,languages:3,stringsPerLanguage:Object.keys(locales.ka).length,dishes:dishes.length,uniqueDishImages:new Set(imageHashes).size,catalogItems:cuts.length,pricedItems:cuts.filter(c=>c.price>0).length,verifiedReferences:references,totalBytes:publicFiles.reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0)},null,2));
