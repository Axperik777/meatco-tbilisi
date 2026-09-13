import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import {imageVariants,productPhoto,homeImagePreload} from './src/image-assets.mjs';

const attr=(tag,name)=>tag.match(new RegExp('(?:^|\\s)'+name+'="([^"]*)"'))?.[1];
const imageTags=html=>[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
const panel=(html,name)=>html.split('data-app-panel="'+name+'"')[1].split('data-app-panel=')[0];
for(const file of ['index.html','catalog.html']){
 const html=fs.readFileSync('dist/'+file,'utf8'),images=imageTags(html);
 assert.equal(images.filter(tag=>attr(tag,'fetchpriority')==='high').length,2,'Only two high-priority photos');
 assert(!html.includes('meatco-logo.png'),'Original logo must not be fetched by hidden dialogs');
 assert(!/\.ttf|notoserifgeorgian|manrope-extrabold/.test(html));
 const home=imageTags(panel(html,'home')),catalog=imageTags(panel(html,'catalog'));
 for(const [tags,active,count] of [[home,file==='index.html',2],[catalog,file==='catalog.html',4]]){
  const products=tags.filter(tag=>!tag.includes('alt=""'));
  assert.equal(products.filter(tag=>attr(tag,'loading')==='eager').length,active?count:0);
  for(const [index,tag] of products.entries()){
   const highCount=tags===home?1:2;
   assert.equal(attr(tag,'fetchpriority'),active&&index<highCount?'high':'low');
   assert.equal(attr(tag,'decoding'),'async');
   assert(+attr(tag,'width')>0&&+attr(tag,'height')>0);
   assert(/-small\.webp$/.test(attr(tag,'src')));
  }
 }
 const hero=home[0];
 assert.equal(attr(hero,'src'),'./assets/products/beef-round-small.webp');
 assert.equal(attr(hero,'loading'),file==='index.html'?'eager':'lazy');
 assert.equal(attr(hero,'fetchpriority'),file==='index.html'?'high':'low');
 for(const tag of home.slice(1).filter(tag=>tag.includes('alt=""'))){assert.equal(attr(tag,'loading'),'lazy');assert.equal(attr(tag,'fetchpriority'),'low');}
 const preloads=[...html.matchAll(/<link\b[^>]*as="image"[^>]*>/g)].map(m=>m[0]);
 assert.equal(preloads.length,file==='index.html'?1:0);
 if(preloads.length){assert.equal(attr(preloads[0],'href'),'./assets/products/beef-round-small.webp');assert.equal(attr(preloads[0],'media'),'(max-width:639px)');}
 for(const tag of [...images,...[...html.matchAll(/<source\b[^>]*>/g)].map(m=>m[0])]){
  for(const candidate of (attr(tag,'srcset')||'').split(',').filter(Boolean))assert(fs.existsSync(path.join('dist',candidate.trim().split(/\s+/)[0])));
 }
}
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('dist/content.js','utf8'),sandbox);
for(const c of sandbox.window.MEATCO_CONTENT.cuts){const v=imageVariants(c.image);assert.equal(v.width,480);assert.equal(v.height,480);assert(fs.statSync(path.join('dist',v.src)).size<50000);}
// The compact logo has no -small-small variant. Prove a one-file image does not invent one.
const single='./assets/brand/meatco-logo-small.webp',v=imageVariants(single);
assert.equal(v.src,single);assert.equal(v.width,360);assert(!productPhoto(single,'Logo').includes('-small-small'));
assert.equal(homeImagePreload('./assets/products/photo-pending.svg'),'');
console.log('Images PASS: 46 small WebP variants, initial-view priorities, one preload, hidden panels lazy, real srcset files, single-file fallback.');
