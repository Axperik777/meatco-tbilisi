function createProductSearch(cuts,dishes,locales){
 const normalize=value=>String(value).normalize('NFKC').toLocaleLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const aliases={
  'pork-grill':'шашлык шашлыка шашлычный мцвади barbecue bbq mtsvadi მწვადი სამწვადე',
  'beef-tenderloin':'стейк стейки steak steaks სტეიკი',
  'mixed-mince':'фарш mince ground ხორცის ფარში',
  'chicken':'курица курятина chicken ქათამი ქათმის',
  'turkey':'индюшка индюшатина turkey ინდაურის',
  'offal-tripe':'рубец требуха tripe ფაშვი',
  'caul-fat':'жировая сетка сальник бадекони caul fat ბადექონი'
 };
 const entries=cuts.map(c=>{
  const names=Object.values(c.name).join(' ');
  const related=dishes.filter(d=>d.cuts.includes(c.id)).flatMap(d=>['ka','ru','en'].map(lang=>d[lang][0])).join(' ');
  let species='';
  if(/(^pork-|^young-pig$|^offal-pork)/.test(c.id))species='свинина pork ღორის';
  if(/(^beef-|^offal-beef)/.test(c.id))species='говядина beef საქონლის';
  if(c.id.includes('liver'))species+=' печенка liver ღვიძლი';
  const category=['ka','ru','en'].map(lang=>locales[lang][c.category]||'').join(' ');
  const text=normalize([names,...Object.values(c.use),category,species,aliases[c.id]||'',related].join(' '));
  return {cut:c,names:normalize(names),text,words:[...new Set(text.split(' '))]};
 });
 const distance=(a,b)=>{
  let previous=Array.from({length:b.length+1},(_,i)=>i),older;
  for(let i=1;i<=a.length;i++){
   const row=[i];
   for(let j=1;j<=b.length;j++){
    row[j]=Math.min(previous[j]+1,row[j-1]+1,previous[j-1]+(a[i-1]===b[j-1]?0:1));
    if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])row[j]=Math.min(row[j],older[j-2]+1);
   }
   older=previous;previous=row;
  }
  return previous[b.length];
 };
 return query=>{
  const clean=normalize(query),words=clean.split(' ').filter(Boolean);
  const exact=entries.filter(e=>words.every(word=>e.text.includes(word)))
   .sort((a,b)=>Number(b.names.includes(clean))-Number(a.names.includes(clean)))
   .map(e=>e.cut);
  if(exact.length||!words.length)return exact;
  const matches=[];
  for(const e of entries){
   let score=0;
   for(const word of words){
    if(e.text.includes(word))continue;
    const max=word.length<4?0:word.length<8?1:2;
    if(!max){score=Infinity;break;}
    let best=max+1;
    for(const candidate of e.words)if(Math.abs(word.length-candidate.length)<=max)best=Math.min(best,distance(word,candidate));
    if(best>max){score=Infinity;break;}score+=best;
   }
   if(Number.isFinite(score))matches.push({cut:e.cut,score});
  }
  matches.sort((a,b)=>a.score-b.score);
  const result=matches.map(m=>m.cut);result.fuzzy=result.length>0;return result;
 };
}
