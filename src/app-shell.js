let appScreen='home';
const appPanels=Array.from(document.querySelectorAll('[data-app-panel]'));
const appScrollPositions={home:0,catalog:0,help:0};
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

}
function initializeAppShell(){
 renderCatalog();
 if(appPanels.length){
  const hash=location.hash.slice(1),anchor=['delivery','restaurants','faq'].includes(hash)?hash:'';
  const start=anchor?'help':['home','catalog','help'].includes(hash)?hash:document.querySelector('.app-frame').dataset.initialScreen;
  switchAppScreen(start,{push:false,anchor});
 }
}
document.addEventListener('click',event=>{
 const el=event.target.closest('button,a');if(!el)return;
 if(el.matches('[data-app-tab]'))switchAppScreen(el.dataset.appTab,{focus:true});
 if(el.matches('[data-app-category]')){category=el.dataset.appCategory;productLimit=6;$('product-search').value='';renderCatalog();updateUrl('q','');updateUrl('category',category);appScrollPositions.catalog=0;switchAppScreen('catalog',{focus:true});}
 if(el.matches('[data-app-business]'))switchAppScreen('help',{anchor:'restaurants'});
 if(el.matches('[data-open-privacy]'))showDialog($('privacy-dialog'),el);
 if(el.matches('a[data-local]')&&appPanels.length){
  const url=new URL(el.href),file=url.pathname.split('/').pop();if(!['','index.html','catalog.html'].includes(file))return;
  event.preventDefault();for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  const anchor=url.hash.slice(1);
  const next=file==='catalog.html'||anchor==='catalog'?'catalog':['delivery','restaurants','faq'].includes(anchor)?'help':'home';
  if(next==='catalog'){const cat=url.searchParams.get('category');category=categories.includes(cat)?cat:'all';productLimit=6;$('product-search').value=url.searchParams.get('q')||'';renderCatalog();updateUrl('q',$('product-search').value);updateUrl('category',category==='all'?'':category);}
  switchAppScreen(next,{anchor:['delivery','restaurants','faq'].includes(anchor)?anchor:'',focus:true});
 }
});
window.addEventListener('popstate',()=>{
 for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
 const hash=location.hash.slice(1);if(appPanels.length)switchAppScreen(['home','catalog','help'].includes(hash)?hash:'home',{push:false});
});
