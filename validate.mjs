import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const root = path.resolve('dist');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const css = fs.readFileSync(path.join(root,'style.css'),'utf8');
const app = fs.readFileSync(path.join(root,'app.js'),'utf8');
new vm.Script(app);
new vm.Script(fs.readFileSync(path.join(root,'config.js'),'utf8'));
const dict = JSON.parse(app.match(/const strings = ([\s\S]*?);\nconst config/)[1]);
const keys = [...html.matchAll(/data-(?:i18n|alt|aria|placeholder)="([^"]+)"/g)].map(m=>m[1]);
for (const lang of ['ka','ru','en']) {
 for (const key of keys) assert.ok(typeof dict[lang][key] === 'string' && dict[lang][key].trim(),lang+': missing '+key);
 assert.deepEqual(Object.keys(dict[lang]).sort(),Object.keys(dict.ka).sort());
}
const references = [...html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)].map(m=>m[1]);
references.push(...[...css.matchAll(/url\(['"]?(\/[^)'"]+)/g)].map(m=>m[1]));
for (const ref of references) assert.ok(fs.existsSync(path.join(root,ref)), 'Missing '+ref);
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate IDs');
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]),'Broken anchor '+match[1]);
assert.ok(html.includes('995568258118'));
assert.ok(!/®|Lorem ipsum|category-letter|preview-pig/.test(html));
assert.equal((html.match(/<h1\b/g)||[]).length,1);
const publicFiles = fs.readdirSync(root,{recursive:true}).filter(f=>fs.statSync(path.join(root,f)).isFile());
const bytes = publicFiles.reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0);
console.log(JSON.stringify({status:'passed',languages:3,stringsPerLanguage:Object.keys(dict.ka).length,verifiedReferences:references.length,files:publicFiles.length,totalBytes:bytes},null,2));
