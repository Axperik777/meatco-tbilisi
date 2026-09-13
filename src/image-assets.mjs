import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('dist'),cache=new Map();
function dimensions(file){
 const b=fs.readFileSync(file),kind=b.toString('ascii',12,16);
 if(b.toString('ascii',8,12)!=='WEBP')throw new Error('Expected WebP: '+file);
 if(kind==='VP8X')return {width:1+b.readUIntLE(24,3),height:1+b.readUIntLE(27,3)};
 if(kind==='VP8L'){const n=b.readUInt32LE(21);return {width:(n&0x3fff)+1,height:((n>>>14)&0x3fff)+1};}
 if(kind==='VP8 ')return {width:b.readUInt16LE(26)&0x3fff,height:b.readUInt16LE(28)&0x3fff};
 throw new Error('Unsupported WebP header: '+file);
}
export function imageVariants(image){
 if(cache.has(image))return cache.get(image);
 if(!image.endsWith('.webp'))return null;
 const full=path.resolve(root,image),small=image.replace(/\.webp$/,'-small.webp');
 const hasSmall=fs.existsSync(path.resolve(root,small));
 const original=dimensions(full),thumb=hasSmall?dimensions(path.resolve(root,small)):original;
 const variant={src:hasSmall?small:image,width:thumb.width,height:thumb.height,fullWidth:original.width,fullHeight:original.height,srcset:hasSmall?small+' '+thumb.width+'w, '+image+' '+original.width+'w':image+' '+original.width+'w'};
 cache.set(image,variant);return variant;
}
// Match the existing phone, Home and catalog canvases; do not guess a four-column mobile category row.
export const homeSizes='(max-width:639px) calc((100vw - 44px) / 2), (max-width:752px) calc((100vw - 46px) / 2), 351px';
export const catalogSizes='(max-width:639px) calc((100vw - 44px) / 2), (max-width:1120px) calc((100vw - 60px) / 3), 354px';
export const categorySizes='(max-width:639px) 180px, (max-width:752px) calc((100vw - 68px) / 4), 171px';
const heroSizes='(max-width:639px) calc(100vw - 32px), (max-width:752px) calc(100vw - 34px), 720px';
export function productPhoto(image,alt,{view='home',eager=false,high=false}={}){
 const v=imageVariants(image),sizes=view==='hero'?heroSizes:view==='home'?homeSizes:catalogSizes;
 const attributes=v?'src="'+v.src+'" srcset="'+v.srcset+'" sizes="'+sizes+'" width="'+v.width+'" height="'+v.height+'"':'src="'+image+'" width="480" height="480"';
 const img='<img '+attributes+' loading="'+(eager?'eager':'lazy')+'" fetchpriority="'+(high?'high':'low')+'" decoding="async" alt="'+alt+'">';
 // The mobile source caps downloads at 480px, including 3x displays.
 return v?'<picture><source media="(max-width:639px)" srcset="'+v.src+' '+v.width+'w" sizes="'+sizes+'">'+img+'</picture>':img;
}
export function categoryPhoto(image){
 const v=imageVariants(image);
 return '<img src="'+(v?.src||image)+'" '+(v?'srcset="'+v.src+' '+v.width+'w" sizes="'+categorySizes+'"':'')+' width="'+(v?.width||480)+'" height="'+(v?.height||480)+'" loading="lazy" fetchpriority="low" decoding="async" alt="">';
}
export function homeImagePreload(image){
 const v=imageVariants(image);
 // Exact match for the mobile picture source; no redundant desktop candidate.
 return v?'<link rel="preload" as="image" href="'+v.src+'" type="image/webp" fetchpriority="high" media="(max-width:639px)">':'';
}
