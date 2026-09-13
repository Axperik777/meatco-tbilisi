import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';

const read=file=>fs.readFileSync(file,'utf8');
const manifest=JSON.parse(read('docs/font-build.json'));
const css=read('dist/fonts.css');
const activeCss=['style.css','app-ui.css','app-shell.css'].map(f=>read('dist/'+f)).join('\n');
assert(!/\.ttf|Noto Serif Georgian|@import|fonts\.googleapis/.test(css+activeCss));
for(const face of css.match(/@font-face\{[^}]+\}/g)){
 assert(!/font-weight:(?:800|900|\d+ \d+)|font-style:italic/.test(face));
 for(const key of ['size-adjust','ascent-override','descent-override','line-gap-override'])assert(face.includes(key+':'));
 assert(face.includes('font-display:optional')||face.includes('font-display:swap'));
}
for(const file of manifest.files){
 const data=fs.readFileSync('dist/assets/fonts/'+file.file);
 assert.equal(data.subarray(0,4).toString(),'wOF2');
 assert.equal(data.length,file.bytes);
 assert.equal(createHash('sha256').update(data).digest('hex'),file.sha256);
 assert([400,600,700].includes(file.weight));
}
const budget=gzipSync(css).length+manifest.files.filter(f=>/^(manrope|prata)/.test(f.file)).reduce((sum,f)=>sum+f.bytes,0);
assert(budget<100000,`Font payload ${budget} exceeds 100KB`);
const bootstrap=read('src/font-loading.js');
const locales=JSON.parse(read('src/locales.json'));
for(const lang of ['ru','en'])for(const char of locales[lang].appHero){
 if(!/\s/u.test(char))assert(manifest.files.find(f=>f.file==='prata-400.woff2').characters.includes(char),`Rebuild Prata subset: missing ${char}`);
}
for(const weight of [400,700])for(const char of Object.values(locales.ka).join('')){
 if(/[\u10d0-\u10f0]/u.test(char))assert(manifest.files.find(f=>f.file===`georgian-${weight}.woff2`).characters.includes(char),`Missing Georgian glyph ${char}`);
}
let cases=0;
for(const saved of [null,'ru','en','ka','invalid'])for(const query of ['', '?lang=ru','?lang=en','?lang=ka','?lang=invalid'])for(const entry of ['home','catalog'])for(const hash of ['','#home','#catalog','#help','#delivery','#restaurants','#faq']){
 const links=[];const document={documentElement:{},createElement:()=>({}),head:{append:link=>links.push(link)}};
 vm.runInNewContext(bootstrap.replace('__ENTRY_PAGE__',JSON.stringify(entry)),{document,URLSearchParams,localStorage:{getItem:()=>saved},location:{search:query,hash}});
 const langs=['ka','ru','en'],requested=new URLSearchParams(query).get('lang');
 const lang=langs.includes(requested)?requested:langs.includes(saved)?saved:'ka';
 const page=['#delivery','#restaurants','#faq'].includes(hash)?'help':hash?hash.slice(1):entry;
 assert.equal(document.documentElement.lang,lang);
 const expected=lang==='ka'?[]:['manrope-400.woff2','manrope-600.woff2',...(page==='home'?['prata-400.woff2']:[])];
 assert.deepEqual(links.map(l=>l.href.replace('./assets/fonts/','')),expected);
 cases++;
}
console.log(`Fonts PASS: ${cases} locale/entry preload cases, 6 WOFF2 assets, worst-case ${budget} bytes incl. gzip CSS.`);
