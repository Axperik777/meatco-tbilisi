const config = window.MEATCO_CONFIG || {};
const content = window.MEATCO_CONTENT || {dishes:[],cuts:[]};
const supported = ['ka','ru','en'];
const $ = id => document.getElementById(id);
const text = key => strings[language][key] || strings.ka[key] || key;
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const form=$('order-form'), orderDialog=$('order-dialog'), dishDialog=$('dish-dialog');
const quantity=$('quantity'), district=$('district'), note=$('order-note'), error=$('quantity-error'), status=$('form-status');
const page=document.body.dataset.page;
const params=new URLSearchParams(location.search);
const categories=['pork','beef','offal'];
const categoryImages={pork:'./assets/meatco-pork-v01.jpg',beef:'./assets/meatco-beef-v01.jpg',offal:'./assets/meatco-offal-v03.webp'};
const extraKeys={vegetables:'extraVegetables',fruit:'extraFruit',eggs:'extraEggs'};
let language='ka', category=categories.includes(params.get('category'))?params.get('category'):'pork';
let meatFilter=['pork','beef','offal'].includes(params.get('meat'))?params.get('meat'):'all';
let activeDish=null, context={cut:'',dish:'',people:''}, attribution={};
const openers=new WeakMap();
const cutById=id=>content.cuts.find(c=>c.id===id);
const dishById=id=>content.dishes.find(d=>d.id===id);
try {
 const saved=JSON.parse(sessionStorage.getItem('meatco:attribution')||'{}');
 if(saved&&typeof saved==='object'&&!Array.isArray(saved)) attribution=saved;
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','gbraid','wbraid']){
  const value=params.get(key);if(value&&value.length<=300)attribution[key]=value;
 }
 if(Object.keys(attribution).length)sessionStorage.setItem('meatco:attribution',JSON.stringify(attribution));
}catch{attribution={};}
function track(event,details={}){
 if(!config.analytics?.enabled)return;
 if(config.analytics.consentRequired){try{if(localStorage.getItem('meatco:analytics-consent')!=='granted')return;}catch{return;}}
 window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,language,...attribution,...details});
}
function whatsappUrl(message){
 const phone=String(config.whatsappNumber||'').replace(/\D/g,'');
 return /^[1-9]\d{7,14}$/.test(phone)?'https://wa.me/'+phone+'?text='+encodeURIComponent(message):'';
}
const selectedMeat=()=>form.querySelector('input[name="meat"]:checked')?.value||'any';
const validWeight=value=>!value||(/^\d{1,4}([.,]\d{1,3})?$/.test(value)&&Number(value.replace(',','.'))>0&&Number(value.replace(',','.'))<=9999);
const pieceOrder=()=>cutById(context.cut)?.unit==='piece';
const validQuantity=value=>pieceOrder()?(!value||(/^\d{1,4}$/.test(value)&&Number(value)>0)):validWeight(value);
const formatPrice=cut=>cut?.price>0?new Intl.NumberFormat(language,{maximumFractionDigits:2}).format(cut.price)+' ₾ / '+text(cut.unit==='piece'?'perPiece':'perKg'):text('priceAsk');
const chosenExtras=()=>[...form.querySelectorAll('input[name="extra"]:checked')].map(i=>i.value);
function message(){
 const meat=selectedMeat();
 const lines=[text('messageGreeting'),'',text('messageMeat')+': '+(meat==='any'?text('messageHelp'):text(meat))];
 const weight=quantity.value.trim(),cut=cutById(context.cut),dish=dishById(context.dish);
 if(cut)lines.push(text('messageCut')+': '+cut.name[language]);
 if(dish)lines.push(text('messageDish')+': '+dish[language][0]);
 if(context.people)lines.push(text('messagePeople')+': '+context.people);
 if(cut?.price>0)lines.push(text('priceLabel')+': '+formatPrice(cut));
 if(weight&&validQuantity(weight))lines.push(text(pieceOrder()?'messageQuantity':'messageWeight')+': '+weight.replace(',','.')+' '+text(pieceOrder()?'perPiece':'kg'));
 if(district.value)lines.push(text('messageDistrict')+': '+text(district.value==='nearby'?'otherDistrict':district.value));
 if(note.value.trim())lines.push(text('messageNote')+': '+note.value.trim());
 const extras=chosenExtras();if(extras.length)lines.push(text('messageExtraList')+': '+extras.map(k=>text(extraKeys[k])).join(', '));
 lines.push('',text('messageEnd'));return lines.join('\n');
}
function updatePreview(){
 const prepared=message();$('message-preview-text').textContent=prepared;
 form.dataset.preparedUrl=validQuantity(quantity.value.trim())?whatsappUrl(prepared):'';
 document.querySelector('label[for="quantity"]').textContent=text(pieceOrder()?'piecesLabel':'quantityLabel');
 quantity.inputMode=pieceOrder()?'numeric':'decimal';quantity.placeholder=pieceOrder()?'1':'1.5';
 const directMessage=context.cut||context.dish||chosenExtras().length?prepared:text('messageGreeting');
 for(const link of document.querySelectorAll('[data-whatsapp]'))link.href=whatsappUrl(directMessage)||'tel:+995568258118';
}
function updateUrl(key,value){
 const url=new URL(location.href);if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);
 history.replaceState(null,'',url);
}
function localLinks(){
 for(const a of document.querySelectorAll('[data-local]')){
  const url=new URL(a.getAttribute('href'),location.href);url.searchParams.set('lang',language);
  a.href=url.href;
 }
}
function renderContext(){
 const parts=[],cut=cutById(context.cut),dish=dishById(context.dish);
 if(cut){parts.push(cut.name[language]);if(cut.price>0)parts.push(formatPrice(cut));}if(dish)parts.push(dish[language][0]);
 if(context.people)parts.push(context.people+' '+text('peopleUnit'));
 $('order-context').hidden=!parts.length;$('order-context-text').textContent=text('contextLabel')+': '+parts.join(' · ');
 form.querySelector('fieldset').hidden=parts.length>0;
}
function renderExtras(){
 const selected=chosenExtras();
 for(const b of document.querySelectorAll('[data-extra-choice]')){
  const active=selected.includes(b.dataset.extraChoice);b.setAttribute('aria-pressed',String(active));b.querySelector('.extra-checkmark').textContent=active?'✓':'+';
 }
 if($('extras-summary'))$('extras-summary').textContent=selected.length?text('extrasSelected')+': '+selected.map(k=>text(extraKeys[k])).join(', '):text('extrasNone');
}
function cutRows(cuts){
 return cuts.map(c=>`<article class="cut-row"><div><h3>${esc(c.name[language])}</h3><p>${esc(c.use[language])}</p></div><div class="cut-buy"><span class="cut-price${c.price>0?'':' price-pending'}">${esc(formatPrice(c))}</span><button type="button" class="cut-select" data-order="${c.category}" data-cut="${c.id}" aria-label="${esc(text('cutCta')+': '+c.name[language])}">${esc(text('cutCta'))}<span aria-hidden="true">↗</span></button></div></article>`).join('');
}
function renderCatalog(){
 if(!$('cut-list'))return;
 for(const b of document.querySelectorAll('[data-category]'))b.setAttribute('aria-pressed',String(b.dataset.category===category));
 $('catalog-image').src=categoryImages[category];$('catalog-image').alt=text(category+'Alt');
 $('catalog-category').textContent=text(category);
 $('category-intro').textContent=text('category'+category[0].toUpperCase()+category.slice(1)+'Intro');
 const cuts=content.cuts.filter(c=>(c.group||c.category)===category);
 $('cut-list').innerHTML=cutRows(cuts);
 const count=document.querySelector('.cut-heading>span');if(count)count.textContent=String(cuts.length);
 if($('other-cuts'))$('other-cuts').innerHTML=cutRows(content.cuts.filter(c=>!categories.includes(c.group||c.category)));
}
function renderDishCards(){
 for(const card of document.querySelectorAll('[data-dish-id]')){
  const d=dishById(card.dataset.dishId);if(!d)continue;
  card.querySelector('img').alt=d[language][0];
  card.querySelector('.dish-image').setAttribute('aria-label',d[language][0]+': '+text('dishView'));
  card.querySelector('h3').textContent=d[language][0];
  card.querySelector('.dish-meta').textContent=text(d.category)+' · '+text(d.method);
  card.querySelector('.dish-description').textContent=d[language][1];
  card.querySelector('.dish-cta').setAttribute('aria-label',text('dishView')+': '+d[language][0]);
 }
}
function filterDishes(sync=false){
 if(!$('all-dishes'))return;
 const query=$('dish-search').value.trim().toLocaleLowerCase(language),method=$('dish-method').value;
 let count=0;
 for(const card of $('all-dishes').querySelectorAll('[data-dish-id]')){
  const d=dishById(card.dataset.dishId);
  const haystack=[...d[language],...d.cuts.map(id=>cutById(id)?.name[language]||''),...d.filters.map(text)].join(' ').toLocaleLowerCase(language);
  const match=(meatFilter==='all'||d.filters.includes(meatFilter))&&(!method||d.method===method)&&(!query||haystack.includes(query));
  card.hidden=!match;if(match)count++;
 }
 for(const b of document.querySelectorAll('[data-meat-filter]'))b.setAttribute('aria-pressed',String(b.dataset.meatFilter===meatFilter));
 $('dish-count').textContent=text('dishCount').replace('{n}',count);
 $('dish-empty').hidden=count!==0;$('clear-search').hidden=!query;
 if(sync){updateUrl('meat',meatFilter==='all'?'':meatFilter);updateUrl('method',method);updateUrl('q',$('dish-search').value.trim());}
}
function renderDishDetail(){
 if(!activeDish)return;
 const d=activeDish;$('dish-detail-image').src=d.image;$('dish-detail-image').alt=d[language][0];
 $('dish-detail-meta').textContent=text(d.category)+' · '+text(d.method);
 $('dish-title').textContent=d[language][0];$('dish-description').textContent=d[language][1];$('dish-advice').textContent=d[language][2];
 $('dish-cut-list').replaceChildren(...d.cuts.map(id=>{const li=document.createElement('li');li.textContent=cutById(id).name[language];return li;}));
}
function showDialog(dialog,opener){
 openers.set(dialog,opener);dialog.showModal();document.documentElement.classList.add('modal-open');
}
function openOrder(button,selection){
 const cat=selection?.category||button.dataset.order||'any';
 const nextCut=selection?.cut||button.dataset.cut||'',nextDish=selection?.dish||'';
 if(context.cut!==nextCut||context.dish!==nextDish)quantity.value='';
 const radio=form.querySelector('input[name="meat"][value="'+cat+'"]')||form.querySelector('input[value="any"]');
 radio.checked=true;
 for(const label of form.querySelectorAll('[data-secondary-type]'))label.hidden=label.dataset.secondaryType!==cat;
 context={cut:nextCut,dish:nextDish,people:selection?.people||''};
 if(button.dataset.district)district.value=button.dataset.district;
 renderContext();status.replaceChildren();error.hidden=true;quantity.removeAttribute('aria-invalid');updatePreview();
 showDialog(orderDialog,button);track('meatco_order_form_open',{category:cat});
}
function setLanguage(next,persist=true){
 language=supported.includes(next)?next:'ka';document.documentElement.lang=language;
 document.title=text(page==='catalog'?'catalogPageTitle':page==='dishes'?'dishesPageTitle':'title');
 document.querySelector('meta[name="description"]').content=text(page==='catalog'?'catalogPageDescription':page==='dishes'?'dishesPageDescription':'description');
 for(const el of document.querySelectorAll('[data-i18n]'))el.textContent=text(el.dataset.i18n);
 for(const el of document.querySelectorAll('[data-alt]'))el.alt=text(el.dataset.alt);
 for(const el of document.querySelectorAll('[data-aria]'))el.setAttribute('aria-label',text(el.dataset.aria));
 for(const el of document.querySelectorAll('[data-placeholder]'))el.placeholder=text(el.dataset.placeholder);
 for(const b of document.querySelectorAll('[data-lang]'))b.setAttribute('aria-pressed',String(b.dataset.lang===language));
 for(const a of document.querySelectorAll('[data-whatsapp]'))a.href=whatsappUrl(text('messageGreeting'))||'tel:+995568258118';
 for(const a of document.querySelectorAll('[data-wholesale]'))a.href=whatsappUrl(text('b2bMessage'))||'tel:+995568258118';
 if(!error.hidden)error.textContent=text(pieceOrder()?'piecesError':'quantityError');
 status.replaceChildren();renderCatalog();renderDishCards();renderDishDetail();renderExtras();renderContext();filterDishes();updatePreview();localLinks();
 if(persist){try{localStorage.setItem('meatco:language',language);}catch{}updateUrl('lang',language);}
}
function closeMenu(focus=false){
 $('mobile-nav').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');if(focus)$('menu-toggle').focus();
}
document.addEventListener('click',event=>{
 const el=event.target.closest('button,a');if(!el)return;
 if(el.matches('[data-lang]'))setLanguage(el.dataset.lang);
 if(el.matches('[data-category]')){category=el.dataset.category;renderCatalog();updateUrl('category',category);}
 if(el.matches('[data-meat-filter]')){meatFilter=el.dataset.meatFilter;filterDishes(true);}
 if(el.matches('[data-open-dish]')){
  activeDish=dishById(el.dataset.openDish);$('dish-people').value='';renderDishDetail();showDialog(dishDialog,el);track('meatco_dish_view',{dish:activeDish.id});
 }
 if(el.matches('[data-order]'))openOrder(el);
 if(el.matches('[data-close]'))el.closest('dialog').close();
 if(el.matches('[data-whatsapp]'))track('meatco_whatsapp_click',{source:'direct'});
 if(el.matches('[data-wholesale]'))track('meatco_whatsapp_click',{source:'restaurant_supply',segment:'b2b'});
 if(el.matches('[data-extra-choice]')){
  const input=form.querySelector('input[name="extra"][value="'+el.dataset.extraChoice+'"]');input.checked=!input.checked;renderExtras();updatePreview();
 }
 if(el.closest('#mobile-nav'))closeMenu();
});
$('menu-toggle').addEventListener('click',()=>{const open=$('mobile-nav').hidden;$('mobile-nav').hidden=!open;$('menu-toggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('mobile-nav').hidden)closeMenu(true);});
for(const dialog of document.querySelectorAll('dialog')){
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]')){document.documentElement.classList.remove('modal-open');const opener=openers.get(dialog);if(opener?.isConnected)opener.focus();}});
}
$('privacy-open').addEventListener('click',e=>showDialog($('privacy-dialog'),e.currentTarget));
$('dish-order').addEventListener('click',()=>{
 const selection={category:activeDish.category,dish:activeDish.id,people:$('dish-people').value};
 const opener=openers.get(dishDialog);dishDialog.close();openOrder(opener,selection);
});
$('clear-context').addEventListener('click',()=>{context={cut:'',dish:'',people:''};renderContext();updatePreview();});
form.addEventListener('input',()=>{status.replaceChildren();if(validQuantity(quantity.value.trim())){error.hidden=true;quantity.removeAttribute('aria-invalid');}updatePreview();});
form.addEventListener('change',e=>{if(e.target.name==='meat'){context={cut:'',dish:'',people:''};renderContext();error.hidden=true;quantity.removeAttribute('aria-invalid');for(const label of form.querySelectorAll('[data-secondary-type]'))label.hidden=label.dataset.secondaryType!==selectedMeat();}renderExtras();updatePreview();});
form.addEventListener('submit',e=>{
 e.preventDefault();if(!validQuantity(quantity.value.trim())){error.textContent=text(pieceOrder()?'piecesError':'quantityError');error.hidden=false;quantity.setAttribute('aria-invalid','true');quantity.focus();updatePreview();return;}
 const url=whatsappUrl(message());if(!url){status.textContent=text('phoneError');return;}
 const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=text('fallback');status.replaceChildren(link);
 track('meatco_whatsapp_click',{source:'order_form',category:selectedMeat()});window.open(url,'_blank','noopener,noreferrer');
});
if($('dish-search')){
 $('dish-search').value=(params.get('q')||'').slice(0,100);
 const method=params.get('method');if(['pan','stew','boil','grill','roast','cold'].includes(method))$('dish-method').value=method;
 $('dish-search').addEventListener('input',()=>filterDishes(true));$('dish-method').addEventListener('change',()=>filterDishes(true));
 $('clear-search').addEventListener('click',()=>{$('dish-search').value='';filterDishes(true);$('dish-search').focus();});
 $('reset-filters').addEventListener('click',()=>{meatFilter='all';$('dish-search').value='';$('dish-method').value='';filterDishes(true);$('dish-search').focus();});
}
let initial=config.defaultLanguage||'ka';
try{const saved=localStorage.getItem('meatco:language');if(supported.includes(saved))initial=saved;}catch{}
if(supported.includes(params.get('lang')))initial=params.get('lang');
setLanguage(initial,false);$('year').textContent=String(new Date().getFullYear());
