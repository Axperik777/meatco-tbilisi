"""Re-encode existing product thumbnails only; originals and framing are preserved."""
from PIL import Image
from pathlib import Path
import hashlib,json,subprocess
root=Path(__file__).resolve().parents[1]
# Read the current catalog without modifying it or requiring a saved QA fixture.
script="const fs=require('fs'),vm=require('vm'),s={window:{}};vm.runInNewContext(fs.readFileSync('dist/content.js','utf8'),s);process.stdout.write(JSON.stringify(s.window.MEATCO_CONTENT.cuts));"
cuts=json.loads(subprocess.check_output(['node','-e',script],cwd=root).decode('utf-8'))
rows=[]
for c in cuts:
    if not c.get('image') or c.get('photoStatus')=='pending': continue
    original=root/'dist'/c['image']
    target=original.with_stem(original.stem+'-small')
    before=target.stat().st_size if target.exists() else None
    im=Image.open(original).convert('RGB')
    im.thumbnail((480,480),Image.Resampling.LANCZOS)
    im.save(target,'WEBP',quality=73,method=6)
    rows.append({'id':c['id'],'file':target.relative_to(root/'dist').as_posix(),'width':im.width,'height':im.height,'quality':73,'beforeBytes':before,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
original=root/'dist/assets/brand/meatco-logo.png'
target=original.with_name('meatco-logo-small.webp')
im=Image.open(original).convert('RGBA')
im.thumbnail((360,128),Image.Resampling.LANCZOS)
im.save(target,'WEBP',quality=90,method=6)
rows.append({'id':'logo','file':target.relative_to(root/'dist').as_posix(),'width':im.width,'height':im.height,'quality':90,'beforeBytes':original.stat().st_size,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
(root/'docs/image-assets-v8-4.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
print(json.dumps([r for r in rows if r['id'] in ['pork-flesh','beef-round','logo']],indent=2))

