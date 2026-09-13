import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let sharp;try{sharp=require('sharp');}catch{sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));}
const manifest=JSON.parse(fs.readFileSync('docs/product-images-v7.json','utf8'));
for(const asset of manifest.items){
 fs.mkdirSync(path.dirname(asset.workspaceMaster),{recursive:true});
 if(!fs.existsSync(asset.workspaceMaster))fs.copyFileSync(asset.source,asset.workspaceMaster);
 for(const size of [960,480])await sharp(asset.workspaceMaster).resize(size,size,{fit:'cover'}).webp({quality:84,effort:5}).toFile('dist/assets/products/'+asset.id+(size===480?'-small':'')+'.webp');
}
console.log('Prepared '+manifest.items.length+' separate catalog photographs in 480/960 px.');
