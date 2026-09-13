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
  return {cut:c,names:normalize(names),text:normalize([names,...Object.values(c.use),category,species,aliases[c.id]||'',related].join(' '))};
 });
 return query=>{
  const clean=normalize(query),words=clean.split(' ').filter(Boolean);
  return entries.filter(e=>words.every(word=>e.text.includes(word)))
   .sort((a,b)=>Number(b.names.includes(clean))-Number(a.names.includes(clean)))
   .map(e=>e.cut);
 };
}
