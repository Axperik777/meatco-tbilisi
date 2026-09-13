let appScreen='home';
const appPanels=Array.from(document.querySelectorAll('[data-app-panel]'));
const appScrollPositions={home:0,catalog:0,help:0};
const storyAsset=path=>typeof path==='string'&&/^\.\/assets\/stories\/[a-zA-Z0-9/_-]+\.(mp4|webm|vtt)$/.test(path)?path:'';
function switchAppScreen(next,{push=true,anchor='',focus=false}={}){
 if(!['home','catalog','help'].includes(next))return;
 if(!appPanels.length){
  const url=new URL('./index.html',location.href);url.searchParams.set('lang',language);url.hash=next;location.assign(url);return;
 }
 if(next!==appScreen)appScrollPositions[appScreen]=window.scrollY;
 const scrollTop=next===appScreen?0:appScrollPositions[next]||0;
 for(const panel of appPanels)panel.hidden=panel.dataset.appPanel!==next;
 appScreen=next;document.body.dataset.screen=next;
 for(const button of document.querySelectorAll('.app-tabbar [data-app-tab]')){
  if(button.dataset.appTab===next)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
 }
 if(push){const url=new URL(location.href);url.hash=anchor||next;history.pushState({screen:next},'',url);}
 window.scrollTo({top:scrollTop,behavior:'instant'});
 if(anchor)document.getElementById(anchor)?.scrollIntoView({block:'start',behavior:'instant'});
 if(focus){const heading=document.querySelector(`[data-app-panel="${next}"] h1`);heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});}
}
function updateProductEstimate(){
 if(!activeProduct)return;
 const c=activeProduct,value=$('product-quantity').value.trim(),valid=validCartQuantity(c,value),q=Number(value.replace(',','.'));
 $('product-live-total').textContent=!valid?'—':c.price?currency(lineAmount(c,q)):text('priceAsk');
 $('product-live-quantity').textContent=valid?quantityText(c,q):text(c.unit==='piece'?'quantityPiece':'quantityKg');
 const range=$('product-weight-range');range.min=c.unit==='piece'?'1':'.5';range.step=c.unit==='piece'?'1':'.5';range.max='5';
 range.value=String(Math.min(5,Math.max(Number(range.min),valid?q:1)));
 range.setAttribute('aria-valuetext',valid?quantityText(c,q):'');
 range.setAttribute('aria-label',text(c.unit==='piece'?'quantityPiece':'quantityKg'));
 document.querySelector('label[for="product-weight-range"]').textContent=text(c.unit==='piece'?'quantityPiece':'quantityKg');
}
function initializeAppShell(){
 for(const button of document.querySelectorAll('[data-story]')){
  if(storyAsset(config.stories?.[button.dataset.story]?.src)){
   const label=button.querySelector('small');label.dataset.i18n='storyWatch';label.textContent=text('storyWatch');
  }
 }
 if($('sheet-filters')&&document.querySelector('.catalog-tabs'))$('sheet-filters').innerHTML=document.querySelector('.catalog-tabs').innerHTML;
 renderCatalog();
 if(appPanels.length){
  const hash=location.hash.slice(1),anchor=['delivery','restaurants','faq'].includes(hash)?hash:'';
  const start=anchor?'help':['home','catalog','help'].includes(hash)?hash:document.querySelector('.app-frame').dataset.initialScreen;
  switchAppScreen(start,{push:false,anchor});
  try{
   const visits=Number(localStorage.getItem('meatco:visits')||0)+1;localStorage.setItem('meatco:visits',String(visits));
   if($('install-hint'))$('install-hint').hidden=visits<2||localStorage.getItem('meatco:install-dismissed')==='1'||matchMedia('(display-mode: standalone)').matches;
  }catch{}
 }
}
document.addEventListener('click',event=>{
 const el=event.target.closest('button,a');if(!el)return;
 if(el.matches('[data-app-tab]'))switchAppScreen(el.dataset.appTab,{focus:true});
 if(el.matches('[data-app-category]')){category=el.dataset.appCategory;productLimit=12;$('product-search').value='';renderCatalog();updateUrl('q','');updateUrl('category',category);appScrollPositions.catalog=0;switchAppScreen('catalog',{focus:true});}
 if(el.matches('[data-app-business]'))switchAppScreen('help',{anchor:'restaurants'});
 if(el.matches('[data-open-privacy]'))showDialog($('privacy-dialog'),el);
 if(el.matches('[data-filter-open]'))showDialog($('filter-dialog'),el);
 if(el.matches('[data-story]')){
  const story={fresh:['storyFresh','beef-tenderloin','storyFreshMessage'],cut:['storyCut','pork-ribs','storyCutMessage'],weight:['storyWeight','beef-round','storyWeightMessage']}[el.dataset.story];
  $('story-title').textContent=text(story[0]);$('story-image').src=cutById(story[1]).image;$('story-image').alt=cutById(story[1]).name[language];
  const media=config.stories?.[el.dataset.story],source=storyAsset(media?.src),video=$('story-video');
  video.pause();video.replaceChildren();video.removeAttribute('src');video.hidden=!source;$('story-image').hidden=!!source;
  if(source){
   video.poster=cutById(story[1]).image;video.src=source;video.setAttribute('aria-label',text(story[0]));
   for(const lang of supported){
    const caption=storyAsset(media.captions?.[lang]);if(!caption)continue;
    const track=document.createElement('track');track.kind='captions';track.srclang=lang;track.label={ka:'ქართული',ru:'Русский',en:'English'}[lang];track.src=caption;track.default=lang===language;video.append(track);
   }
   video.load();
  }
  $('story-request').href=whatsappUrl(text(story[2]));showDialog($('story-dialog'),el);
 }
 if(el.matches('[data-install-open]'))showDialog($('install-dialog'),el);
 if(el.matches('[data-install-dismiss]')){$('install-hint').hidden=true;try{localStorage.setItem('meatco:install-dismissed','1');}catch{}}
 if(el.matches('a[data-local]')&&appPanels.length){
  const url=new URL(el.href),file=url.pathname.split('/').pop();if(!['','index.html','catalog.html'].includes(file))return;
  event.preventDefault();for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  const anchor=url.hash.slice(1);
  const next=file==='catalog.html'||anchor==='catalog'?'catalog':['delivery','restaurants','faq'].includes(anchor)?'help':'home';
  if(next==='catalog'){const cat=url.searchParams.get('category');category=categories.includes(cat)?cat:'all';productLimit=12;renderCatalog();updateUrl('category',category==='all'?'':category);}
  switchAppScreen(next,{anchor:['delivery','restaurants','faq'].includes(anchor)?anchor:'',focus:true});
 }
});
$('story-dialog').addEventListener('close',()=>{$('story-video').pause();});
$('story-video').addEventListener('error',()=>{$('story-video').hidden=true;$('story-image').hidden=false;});
$('product-weight-range').addEventListener('input',()=>{
 $('product-quantity').value=$('product-weight-range').value;$('product-quantity-error').hidden=true;$('product-quantity').removeAttribute('aria-invalid');renderProductDetail();
});
window.addEventListener('popstate',()=>{
 for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
 const hash=location.hash.slice(1);if(appPanels.length)switchAppScreen(['home','catalog','help'].includes(hash)?hash:'home',{push:false});
});
