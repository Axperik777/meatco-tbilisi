import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let sharp;
try{sharp=require('sharp');}catch{sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));}
const source=path.resolve('../Креативы/MeatCO_product_assets_v04');
const target=path.resolve('dist/assets/products');
fs.mkdirSync(target,{recursive:true});fs.mkdirSync('qa',{recursive:true});
const files=fs.readdirSync(source).filter(f=>f.endsWith('.png'));
for(const file of files){
 const input=path.join(source,file),id=path.basename(file,'.png');
 for(const size of [960,480]){
  const output=path.join(target,id+(size===480?'-small':'')+'.webp');
  if(!fs.existsSync(output)||fs.statSync(input).mtimeMs>fs.statSync(output).mtimeMs)await sharp(input).resize(size,size,{fit:'contain',background:'#e8e9e1'}).webp({quality:82,effort:5}).toFile(output);
 }
}
for(let i=0;i<files.length;i+=12){
 const tiles=await Promise.all(files.slice(i,i+12).map(async(file,j)=>{
  const thumb=await sharp(path.join(source,file)).resize(260,260).toBuffer();
  const label=Buffer.from(`<svg width="260" height="32"><rect width="260" height="32" fill="#ffffff"/><text x="8" y="22" font-family="Arial" font-size="14" fill="#222">${path.basename(file,'.png')}</text></svg>`);
  return [{input:thumb,left:(j%3)*260,top:Math.floor(j/3)*292},{input:label,left:(j%3)*260,top:Math.floor(j/3)*292+260}];
 }));
 await sharp({create:{width:780,height:Math.ceil(Math.min(12,files.length-i)/3)*292,channels:3,background:'#ffffff'}}).composite(tiles.flat()).png().toFile(`qa/products-contact-${1+i/12}.png`);
}
console.log(JSON.stringify({productImages:files.length,webpFiles:fs.readdirSync(target).length,webpBytes:fs.readdirSync(target).reduce((n,f)=>n+fs.statSync(path.join(target,f)).size,0)}));
