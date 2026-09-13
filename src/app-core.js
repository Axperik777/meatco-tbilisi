const config = window.MEATCO_CONFIG || {};
const MIN_ORDER=typeof config.minimumOrder==='number'&&config.minimumOrder>0?config.minimumOrder:null;
const content = window.MEATCO_CONTENT || {dishes:[],cuts:[]};
const supported = ['ka','ru','en'];
const $ = id => document.getElementById(id);
const text = key => strings[language][key] || strings.ka[key] || key;
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const form=$('order-form'), orderDialog=$('order-dialog'), dishDialog=$('dish-dialog');
const quantity=$('quantity'), district=$('district'), note=$('order-note'), error=$('quantity-error'), status=$('form-status');
const page=document.body.dataset.page;
const params=new URLSearchParams(location.search);
const categories=['all','beef','pork','offal','other'];
let language='ka', category=categories.includes(params.get('category'))?params.get('category'):'all', productLimit=6;
let meatFilter=['pork','beef','offal'].includes(params.get('meat'))?params.get('meat'):'all';
let activeDish=null, context={cut:'',dish:'',people:''}, attribution={};
const openers=new WeakMap();
const cutById=id=>content.cuts.find(c=>c.id===id);
const cutAvailable=c=>!!c&&c.available!==false;
// Only cuts suited to all three requests: mince, trim and slice. No claim on bones, offal or ready mince.
const preparableCuts=new Set(['pork-flesh','pork-tenderloin','pork-grill','pork-jowl','beef-round','beef-tenderloin','beef-cheek','beef-diaphragm']);
const defaultProductOrder=Array.from(document.querySelectorAll('#product-grid [data-product-card]'),card=>card.dataset.productCard);
const imageCounts=new Map();for(const c of content.cuts)if(c.image)imageCounts.set(c.image,(imageCounts.get(c.image)||0)+1);
function photoFor(c,small=false){const image=c?.image&&c.photoStatus!=='pending'&&imageCounts.get(c.image)===1?c.image:'./assets/products/photo-pending.svg';return small?(imageVariants[image]?.src||image):image;}
function thumbnailAttrs(c,size){const src=photoFor(c,true),v=imageVariants[photoFor(c)];return `src="${src}" data-image-full="${photoFor(c)}" data-image-small="${src}" ${v?`srcset="${src} ${v.width}w" sizes="${size}px"`:''} width="${size}" height="${size}" loading="lazy" fetchpriority="low" decoding="async"`;}
// Respect a direct #catalog/#help entry after the existing router selects its panel.
// Only request hints change; routing, filtering and product order stay untouched.
function prioritizeEntryPhotos(){
 document.querySelectorAll('[data-app-panel]').forEach(panel=>{
  const active=!panel.hidden,isCatalog=panel.dataset.appPanel==='catalog',count=isCatalog?4:2;
  const hero=panel.querySelector('.counter-hero-photo img');
  if(hero){hero.loading=active?'eager':'lazy';hero.fetchPriority=active?'high':'low';}
  panel.querySelectorAll('.meat-photo img').forEach((img,index)=>{
   img.loading=active&&index<count?'eager':'lazy';
   img.fetchPriority=active&&index<(isCatalog?2:1)?'high':'low';
  });
 });
}
// Recover the same cut from its other local variant, never from another product.
const failedImages=new WeakMap();
function recoverProductImage(img){
 if(img.tagName!=='IMG'||!img.getAttribute('src')||!img.closest('.meat-photo,.product-detail-photo,.cart-line,.quick-categories,.counter-hero-photo'))return;
 if(img.dataset.imageFallback==='true')return;
 const failed=failedImages.get(img)||new Set();
 failed.add(new URL(img.currentSrc||img.src,location.href).href);failedImages.set(img,failed);
 img.closest('picture')?.querySelectorAll('source').forEach(source=>source.remove());img.removeAttribute('srcset');
 const next=[img.dataset.imageSmall,img.dataset.imageFull].filter(Boolean).find(src=>!failed.has(new URL(src,location.href).href));
 if(next){img.src=next;return;}
 img.dataset.imageFallback='true';
 img.src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480"><rect width="480" height="480" fill="#EFE7DB"/><text x="240" y="210" text-anchor="middle" fill="#161513" font-family="Arial,sans-serif" font-size="32" font-weight="700">MEAT CO</text><path d="M170 232h140" stroke="#161513"/></svg>');
 const label=img.closest('.meat-photo,.product-detail-photo,.cart-line,.quick-categories,.counter-hero-photo').querySelector('.photo-pending-label');
 if(label){label.hidden=false;label.textContent=img.alt||text('photoSoon');}
}
document.addEventListener('error',event=>recoverProductImage(event.target),true);
// An eager photo can fail before this deferred script starts.
for(const img of document.images)if(img.complete&&!img.naturalWidth)recoverProductImage(img);
const dishById=id=>content.dishes.find(d=>d.id===id);
const findProducts=createProductSearch(content.cuts,content.dishes,strings);
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
function message(){
 const meat=selectedMeat();
 const lines=[text('messageGreeting'),'',text('messageMeat')+': '+(meat==='any'?text('messageHelp'):text(meat))];
 const weight=quantity.value.trim(),cut=cutById(context.cut),dish=dishById(context.dish);
 if(cut)lines.push(text('messageCut')+': '+cut.name[language]);
 if(dish)lines.push(text('messageDish')+': '+dish[language][0]);
 if(context.people)lines.push(text('messagePeople')+': '+context.people);
 if(cut?.price>0)lines.push(text('priceLabel')+': '+formatPrice(cut));
 if(weight&&validQuantity(weight))lines.push(text(pieceOrder()?'messageQuantity':'messageWeight')+': '+weight.replace(',','.')+' '+text(pieceOrder()?'perPiece':'kg'));
 if(district.value)lines.push(text('messageDistrict')+': '+district.value.trim());
 if(note.value.trim())lines.push(text('messageNote')+': '+note.value.trim());
 lines.push('',text('messageEnd'));return lines.join('\n');
}
function updatePreview(){
 const prepared=message();$('message-preview-text').textContent=prepared;
 form.dataset.preparedUrl=validQuantity(quantity.value.trim())?whatsappUrl(prepared):'';
 document.querySelector('label[for="quantity"]').textContent=text(pieceOrder()?'piecesLabel':'quantityLabel');
 quantity.inputMode=pieceOrder()?'numeric':'decimal';quantity.placeholder=pieceOrder()?'1':'1.5';
 const directMessage=cartHasItems()?cartMessage():context.cut||context.dish?prepared:text('messageGreeting');
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
function renderProductCards(){
 for(const card of document.querySelectorAll('[data-product-card]')){
  const c=cutById(card.dataset.productCard);card.querySelector('img').alt=c.name[language];
  (card.querySelector('h3 button')||card.querySelector('h3')).textContent=c.name[language];
  card.querySelector('.meat-category').textContent=text(c.category);
  card.querySelector('.meat-purpose').textContent=c.use[language];
  const pending=card.querySelector('.photo-pending-label');if(!pending.hidden)pending.textContent=c.name[language];
  card.querySelector('.meat-price').innerHTML=c.price>0?new Intl.NumberFormat(language,{maximumFractionDigits:2}).format(c.price)+' <span>₾ / '+esc(text(c.unit==='piece'?'perPiece':'perKg'))+'</span>':esc(text('priceAsk'));
  for(const b of card.querySelectorAll('[data-cut]'))b.setAttribute('aria-label',text('cutCta')+': '+c.name[language]);
 }
 if(document.querySelector('[data-welcome-image]'))document.querySelector('[data-welcome-image]').alt=cutById('pork-ribs').name[language];
 const hero=cutById('beef-tenderloin');
 if(document.querySelector('[data-hero-image]')){
  document.querySelector('[data-hero-image]').alt=hero.name[language];

 }
}
function renderCatalog(){
 if(!$('product-grid'))return;
 for(const b of document.querySelectorAll('[data-category]'))b.setAttribute('aria-pressed',String(b.dataset.category===category));
 const query=$('product-search').value.trim(),found=findProducts(query),matches=new Set(found.map(c=>c.id));let count=0;
 const cards=Array.from($('product-grid').querySelectorAll('[data-product-card]'));
 cards.sort((a,b)=>{
  const ca=cutById(a.dataset.productCard),cb=cutById(b.dataset.productCard);
  if(query)return found.indexOf(ca)-found.indexOf(cb);
  return defaultProductOrder.indexOf(ca.id)-defaultProductOrder.indexOf(cb.id);
 });
 $('product-grid').append(...cards);
 for(const card of cards){
  const c=cutById(card.dataset.productCard),group=c.group||c.category;
  const categoryMatch=category==='all'||(category==='other'?!['pork','beef','offal'].includes(group):group===category);
  const match=categoryMatch&&matches.has(c.id);if(match)count++;
  card.hidden=!match||count>productLimit;
 }
 $('product-count').hidden=!query;
 $('product-count').textContent=text(found.fuzzy?'fuzzyResults':'productCount').replace('{n}',count);
 if($('catalog-title'))$('catalog-title').textContent=text(category==='all'?'appCatalog':category==='other'?'categoryMore':category);
 if($('catalog-empty-title'))$('catalog-empty-title').textContent=text('productNoResults');
 if($('catalog-empty-description'))$('catalog-empty-description').textContent=text('productNoResultsText');
 $('product-empty').hidden=count!==0;$('more-products').hidden=count<=productLimit;
 $('clear-product-search').hidden=!query;
 $('search-all-categories').hidden=!!count||category==='all'||!matches.size;
}
function renderQuickSearch(){
 if(!$('quick-search'))return;
 const query=$('quick-search').value.trim(),matches=findProducts(query);
 $('quick-results').hidden=!query;$('clear-quick-search').hidden=!query;
 document.querySelector('.quick-finder .category-rail').hidden=!!query;
 $('quick-language').value=language;
 if(!query){$('quick-products').replaceChildren();return;}
 $('quick-count').textContent=text('searchResults').replace('{n}',matches.length);
 $('quick-products').innerHTML=matches.slice(0,4).map(c=>`<article class="quick-product"><button type="button" data-view-product="${c.id}" aria-label="${esc(c.name[language])}"><img ${thumbnailAttrs(c,58)} alt=""><span><strong>${esc(c.name[language])}</strong><span>${esc(formatPrice(c))}</span></span></button><button type="button" class="quick-add" data-add-cut="${c.id}" aria-label="${esc(text('addToCart')+': '+c.name[language])}">+</button></article>`).join('');
 $('quick-empty').hidden=matches.length!==0;$('quick-all').hidden=!matches.length;
 $('quick-all').textContent=text('searchAll').replace('{n}',matches.length)+' ↗';
 const url=new URL('./catalog.html',location.href);url.searchParams.set('lang',language);url.searchParams.set('q',query);$('quick-all').href=url.href;
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
 for(const a of document.querySelectorAll('[data-event-whatsapp]'))a.href=whatsappUrl(text('eventGreeting'));
 for(const a of document.querySelectorAll('[data-wholesale]'))a.href=whatsappUrl(text('b2bMessage'))||'tel:+995568258118';
 if(!error.hidden)error.textContent=text(pieceOrder()?'piecesError':'quantityError');
 status.replaceChildren();renderProductCards();renderCatalog();renderQuickSearch();renderDishCards();renderDishDetail();renderContext();filterDishes();updatePreview();localLinks();renderCart();renderProductDetail();renderOperations();
 if(persist){try{localStorage.setItem('meatco:language',language);}catch{}updateUrl('lang',language);}
}
function homeHoursKey(now=new Date()){
 const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tbilisi',hour:'2-digit',hourCycle:'h23'}).format(now));
 return hour>=18?'homeAfterHoursNow':'homeAfterHours';
}
function renderOperations(){
 for(const el of document.querySelectorAll('[data-minimum-order]'))el.textContent=MIN_ORDER?text('minimumOrder').replace('{amount}',currency(MIN_ORDER)):text('minimumUnknown');
 for(const el of document.querySelectorAll('[data-working-hours]'))el.textContent=config.hours?text('workingHours').replace('{hours}',config.hours):text('workingHoursUnknown');
 for(const el of document.querySelectorAll('[data-home-hours-note]'))el.textContent=text(homeHoursKey());
}
window.addEventListener('focus',renderOperations);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderOperations();});
setInterval(()=>{if(!document.hidden)renderOperations();},60000);
function closeMenu(focus=false){
 $('mobile-nav').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');if(focus)$('menu-toggle').focus();
}
document.addEventListener('click',event=>{
 const el=event.target.closest('button,a');if(!el)return;
 if(el.matches('[data-lang]'))setLanguage(el.dataset.lang);
 if(el.matches('[data-category]')){category=el.dataset.category;productLimit=6;renderCatalog();updateUrl('category',category==='all'?'':category);}
 if(el.matches('[data-meat-filter]')){meatFilter=el.dataset.meatFilter;filterDishes(true);}
 if(el.matches('[data-open-dish]')){
  activeDish=dishById(el.dataset.openDish);$('dish-people').value='';renderDishDetail();showDialog(dishDialog,el);track('meatco_dish_view',{dish:activeDish.id});
 }
 if(el.matches('[data-order]'))openOrder(el);
 if(el.matches('[data-find]')){
  const field=$('quick-search')||$('product-search');
  if(field){field.scrollIntoView({block:'center'});field.focus({preventScroll:true});}
  else{const url=new URL('./catalog.html',location.href);url.searchParams.set('lang',language);url.hash='product-search';location.assign(url);}
 }
 if(el.matches('[data-close]'))el.closest('dialog').close();
 if(el.matches('[data-whatsapp]'))track('meatco_whatsapp_click',{source:'direct'});
 if(el.matches('[data-wholesale]'))track('meatco_whatsapp_click',{source:'restaurant_supply',segment:'b2b'});
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
form.addEventListener('change',e=>{if(e.target.name==='meat'){context={cut:'',dish:'',people:''};renderContext();error.hidden=true;quantity.removeAttribute('aria-invalid');for(const label of form.querySelectorAll('[data-secondary-type]'))label.hidden=label.dataset.secondaryType!==selectedMeat();}updatePreview();});
form.addEventListener('submit',e=>{
 e.preventDefault();if(!validQuantity(quantity.value.trim())){error.textContent=text(pieceOrder()?'piecesError':'quantityError');error.hidden=false;quantity.setAttribute('aria-invalid','true');quantity.focus();updatePreview();return;}
 const url=whatsappUrl(message());if(!url){status.textContent=text('phoneError');return;}
 const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=text('fallback');status.replaceChildren(link);
 track('meatco_whatsapp_click',{source:'order_form',category:selectedMeat()});window.open(url,'_blank','noopener,noreferrer');
});
if($('product-search')){
 $('product-search').value=(params.get('q')||'').slice(0,100);
 $('product-search').addEventListener('input',()=>{productLimit=6;renderCatalog();updateUrl('q',$('product-search').value.trim());});
 $('reset-products').addEventListener('click',()=>{category='all';productLimit=6;$('product-search').value='';renderCatalog();updateUrl('category','');updateUrl('q','');$('product-search').focus();});
 $('clear-product-search').addEventListener('click',()=>{$('product-search').value='';productLimit=6;renderCatalog();updateUrl('q','');$('product-search').focus();});
 $('search-all-categories').addEventListener('click',()=>{category='all';productLimit=6;renderCatalog();updateUrl('category','');$('catalog-tools').scrollIntoView({block:'start'});$('product-search').focus({preventScroll:true});});
 $('more-products').addEventListener('click',()=>{const before=[...$('product-grid').querySelectorAll('[data-product-card]:not([hidden])')];productLimit+=6;renderCatalog();const next=[...$('product-grid').querySelectorAll('[data-product-card]:not([hidden])')].find(c=>!before.includes(c));next?.querySelector('button').focus();});
}
if($('quick-search')){
 $('quick-search').addEventListener('input',renderQuickSearch);
 $('quick-search').addEventListener('keydown',e=>{
  if(e.key==='Escape'){$('quick-search').value='';renderQuickSearch();}
  if(e.key==='ArrowDown'&&$('quick-products').firstElementChild){e.preventDefault();$('quick-products').querySelector('button').focus();}
 });
 $('clear-quick-search').addEventListener('click',()=>{$('quick-search').value='';renderQuickSearch();$('quick-search').focus();});
 $('quick-find-form').addEventListener('submit',e=>{e.preventDefault();const url=new URL('./catalog.html',location.href);url.searchParams.set('lang',language);const query=$('quick-search').value.trim();if(query)url.searchParams.set('q',query);location.assign(url);});
}
if($('dish-search')){
 $('dish-search').value=(params.get('q')||'').slice(0,100);
 const method=params.get('method');if(['pan','stew','boil','grill','roast','cold'].includes(method))$('dish-method').value=method;
 $('dish-search').addEventListener('input',()=>filterDishes(true));$('dish-method').addEventListener('change',()=>filterDishes(true));
 $('clear-search').addEventListener('click',()=>{$('dish-search').value='';filterDishes(true);$('dish-search').focus();});
 $('reset-filters').addEventListener('click',()=>{meatFilter='all';$('dish-search').value='';$('dish-method').value='';filterDishes(true);$('dish-search').focus();});
}
// CART_MODULE
let initial=config.defaultLanguage||'ka';
try{const saved=localStorage.getItem('meatco:language');if(supported.includes(saved))initial=saved;}catch{}
if(supported.includes(params.get('lang')))initial=params.get('lang');
setLanguage(initial,false);initializeAppShell();prioritizeEntryPhotos();$('year').textContent=String(new Date().getFullYear());
