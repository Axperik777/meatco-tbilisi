const cartKey='meatco:basket:v1',cartDialog=$('cart-dialog'),productDialog=$('product-dialog');
let basket=readBasket(),invalidCart=new Set(),cartDrafts=new Map(),activeProduct=null,toastTimer;
const preparationNotes=new Map();
const slotKeys={'12-14':'slotMidday','14-16':'slotAfternoon','16-18':'slotEvening',tomorrow:'slotTomorrow',chat:'slotUnknown'};
const selectedSlot=()=>document.querySelector('input[name="cart-slot"]:checked')?.value||'chat';
function refreshDeliverySlots(){
 const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tbilisi',hour:'2-digit',hourCycle:'h23'}).format(new Date()));
 for(const radio of document.querySelectorAll('input[name="cart-slot"]')){
  const end={'12-14':14,'14-16':16,'16-18':18}[radio.value];
  radio.disabled=!!end&&hour>=end;
  if(radio.disabled&&radio.checked)document.querySelector('input[name="cart-slot"][value="chat"]').checked=true;
 }
}
function validCartQuantity(c,value){
 const input=String(value).trim();return !!input&&(c.unit==='piece'?/^\d{1,4}$/.test(input)&&Number(input)>0:validWeight(input));
}
function readBasket(){
 const result={};
 try{
  const saved=JSON.parse(localStorage.getItem(cartKey)||'{}');
  if(saved.version!==1||!Array.isArray(saved.items))return result;
  for(const item of saved.items.slice(0,content.cuts.length)){
   const c=cutById(item.id);
   if(c&&typeof item.quantity==='number'&&Number.isFinite(item.quantity)&&validCartQuantity(c,item.quantity))result[c.id]=item.quantity;
  }
 }catch{}
 return result;
}
function saveBasket(){try{localStorage.setItem(cartKey,JSON.stringify({version:1,items:Object.entries(basket).map(([id,quantity])=>({id,quantity}))}));}catch{}}
const cartHasItems=()=>Object.keys(basket).length>0;
const currency=value=>new Intl.NumberFormat(language,{maximumFractionDigits:2,minimumFractionDigits:0}).format(value)+' ₾';
const quantityText=(c,q)=>new Intl.NumberFormat(language,{maximumFractionDigits:3}).format(q)+' '+text(c.unit==='piece'?'perPiece':'perKg');
const lineAmount=(c,q)=>Math.round(((c.price||0)*q+Number.EPSILON)*100)/100;
const cartSubtotal=()=>Object.entries(basket).reduce((sum,[id,q])=>sum+lineAmount(cutById(id),q),0);
function cartMinimumRemaining(){
 return MIN_ORDER?Math.max(0,Math.round((MIN_ORDER-cartSubtotal())*100)/100):0;
}
const cartUnavailable=()=>Object.keys(basket).map(cutById).filter(c=>!cutAvailable(c));
function cartMessageItems(){
 const lines=[];
 Object.entries(basket).forEach(([id,q])=>{
  const c=cutById(id);lines.push(`• ${c.name[language]} — ${quantityText(c,q)} × ${formatPrice(c)}`);
  if(preparationNotes.has(id))lines.push('   '+text('messageNote')+': '+preparationNotes.get(id));
 });
 return lines;
}
const cartMessageEstimate=()=>text('messageEstimate')+': '+(Object.keys(basket).some(id=>cutById(id).price>0)?currency(cartSubtotal()):text('priceAsk'));
const cartMessageSlot=()=>text('messageTime')+': '+text(slotKeys[selectedSlot()]||'slotUnknown');
function cartMessage(){
 const lines=['MeatCO','',...cartMessageItems()];
 const unpriced=Object.keys(basket).map(cutById).filter(c=>!c.price);
 lines.push('',cartMessageEstimate());
 if(unpriced.length)lines.push(text('cartUnpriced').replace('{items}',unpriced.map(c=>c.name[language]).join(', ')));
 if(unpriced.length&&MIN_ORDER)lines.push(text('minimumOrder').replace('{amount}',currency(MIN_ORDER)));
 lines.push(text('messageAddress')+': '+($('cart-district').value.trim()||text('messageTbc')));
 lines.push(cartMessageSlot());
 lines.push(text('messageComment')+': '+($('cart-note').value.trim()||'—'));
 lines.push(text('messagePhoto')+': '+text($('cart-photo')?.checked?'answerYes':'answerNo'));
 lines.push('',text('cartMessageEnd'),text('messageHours').replace('{hours}',config.hours));return lines.join('\n');
}
function cartSuggestions(){
 const remaining=cartMinimumRemaining();
 if(!cartHasItems()||!remaining||invalidCart.size||cartUnavailable().length)return [];
 const eligible=id=>{const c=cutById(id);return cutAvailable(c)&&c.price>0&&c.unit==='kg'&&!basket[id];};
 const preferred=['mixed-mince','pork-ribs','offal-beef-liver','pork-flesh','pork-grill','pork-leg','beef-brisket'];
 const ids=[...preferred,...content.cuts.map(c=>c.id).filter(id=>!preferred.includes(id))].filter(eligible);
 const suggestions=ids.map(id=>{
  const c=cutById(id),quantity=[.5,1].find(q=>lineAmount(c,q)>=remaining);
  return quantity?{id,quantity,amount:lineAmount(c,quantity)}:null;
 }).filter(Boolean).sort((a,b)=>a.amount-b.amount);
 // Lowest extra cost first; keep familiar cuts ahead when costs are equal.
 const closeToThreshold=suggestions.filter(s=>s.amount-remaining<=20);
 return (closeToThreshold.length>=2?closeToThreshold:suggestions).slice(0,3);
}
function renderCartSuggestions(){
 const suggestions=cartSuggestions();$('cart-suggestions').hidden=!suggestions.length;
 $('cart-suggestions-title').textContent=text('cartSuggestionTitle').replace('{amount}',currency(MIN_ORDER||0));
 $('cart-suggestion-list').innerHTML=suggestions.map(({id,quantity,amount})=>{
  const c=cutById(id),details=quantityText(c,quantity)+' · +'+currency(amount);
  return `<button type="button" data-cart-suggestion="${id}" aria-label="${esc(text('addToCart')+': '+c.name[language]+', '+details)}"><span><strong>${esc(c.name[language])}</strong><small>${esc(details)}</small></span><span aria-hidden="true">+</span></button>`;
 }).join('');
}
function renderCheckoutHint(){
 const hint=$('cart-checkout-hint'),hasItems=cartHasItems(),remaining=cartMinimumRemaining();
 hint.hidden=!hasItems;document.body.classList.toggle('has-cart-hint',hasItems);
 const ids=Object.keys(basket),hasPriced=ids.some(id=>cutById(id).price>0),unpriced=ids.some(id=>!cutById(id).price);
 const money=value=>currency(value).replace(/ ₾$/,'\u00a0₾');
 const amount=invalidCart.size?'—':hasPriced?money(cartSubtotal())+(unpriced?' +':''):text('priceAsk');
 $('cart-hint-total').textContent=text('cartHintTotal').replace('{amount}',amount);
 $('cart-hint-action').textContent=invalidCart.size||cartUnavailable().length?text('cartHintCheck'):remaining?text('cartHintRemaining').replace('{amount}',money(remaining)):text('cartHintCheckout');
 syncCartHintSpace();
}
function syncCartHintSpace(){
 const height=$('cart-checkout-hint').getBoundingClientRect().height;
 if(height)document.documentElement.style.setProperty('--cart-hint-space',Math.ceil(height+16)+'px');
}
function keepCardControlVisible(button){
 const control=button.closest('.meat-buy'),hint=$('cart-checkout-hint');
 if(!control||hint.hidden)return;
 const overlap=control.getBoundingClientRect().bottom-hint.getBoundingClientRect().top+8;
 if(overlap>0)window.scrollBy({top:overlap,behavior:'instant'});
}
function renderCartControls(){
 const total=cartSubtotal(),hasPriced=Object.keys(basket).some(id=>cutById(id).price>0);
 for(const el of document.querySelectorAll('[data-cart-total]')){el.hidden=!cartHasItems();el.textContent=hasPriced?currency(total)+(Object.keys(basket).some(id=>!cutById(id).price)?' +':''):text('cartNav');}
 for(const el of document.querySelectorAll('.empty-cart-label'))el.hidden=cartHasItems();
 const count=Object.keys(basket).length;
 for(const button of document.querySelectorAll('.app-tabbar [data-cart-open]'))button.setAttribute('aria-label',text('cartNav')+(count?', '+count+(hasPriced?', '+currency(total):''):''));
 for(const el of document.querySelectorAll('[data-cart-count]')){el.textContent=String(count);el.hidden=count===0;el.classList.toggle('has-items',count>0);}
 for(const card of document.querySelectorAll('[data-product-card]')){
  const id=card.dataset.productCard,c=cutById(id),qty=basket[id]||0;
  const add=card.querySelector('[data-add-cut]'),control=card.querySelector('[data-card-quantity]');
  const available=cutAvailable(c);card.classList.toggle('is-unavailable',!available);
  card.querySelector('[data-stock-status]').hidden=available;
  add.hidden=qty>0&&available;control.hidden=!qty||!available;add.disabled=!available;
  add.setAttribute('aria-label',text('addToCart')+': '+c.name[language]);
  card.querySelector('.meat-photo').setAttribute('aria-label',c.name[language]);
  const value=control.querySelector('.card-quantity-value');value.textContent=quantityText(c,qty);value.setAttribute('aria-label',text('cartOpen')+': '+c.name[language]+', '+quantityText(c,qty));
  for(const button of control.querySelectorAll('[data-cart-step]'))button.setAttribute('aria-label',text(button.dataset.cartStep==='1'?'increase':'decrease')+': '+c.name[language]);
 }
}
function updateCartSummary(){
 const ids=Object.keys(basket),unpriced=ids.map(cutById).filter(c=>!c.price);
 $('cart-total').textContent=invalidCart.size?'—':ids.some(id=>cutById(id).price>0)?currency(cartSubtotal()):text('priceAsk');
 $('cart-total').classList.toggle('is-unpriced',!ids.some(id=>cutById(id).price>0));
 $('cart-unpriced').hidden=!unpriced.length;
 $('cart-unpriced').textContent=text('cartUnpriced').replace('{items}',unpriced.map(c=>c.name[language]).join(', '));
 $('cart-preview-items').textContent=cartMessageItems().join('\n');
 $('cart-preview-total').textContent=cartMessageEstimate();
 $('cart-preview-slot').textContent=cartMessageSlot();
 const remaining=cartMinimumRemaining();
 $('cart-minimum').textContent=remaining?text('minimumRemaining').replace('{amount}',currency(remaining)).replace('{minimum}',currency(MIN_ORDER)):MIN_ORDER?text('minimumOrder').replace('{amount}',currency(MIN_ORDER)):text('minimumUnknown');
 $('cart-minimum').classList.toggle('minimum-unmet',remaining>0);
 const unavailable=cartUnavailable();$('cart-unavailable').hidden=!unavailable.length;
 $('cart-unavailable').textContent=text('cartUnavailable').replace('{items}',unavailable.map(c=>c.name[language]).join(', '));
 $('cart-submit').disabled=!ids.length||invalidCart.size>0||remaining>0||unavailable.length>0;
 $('cart-form').dataset.preparedUrl=!$('cart-submit').disabled?whatsappUrl(cartMessage()):'';
 renderCartSuggestions();renderCheckoutHint();
}
function renderCart(){
 const focused=document.activeElement;
 const focusId=focused?.dataset.cartId,focusStep=focused?.dataset.cartStep,wasInCart=!!focused?.closest('#cart-items');
 const ids=Object.keys(basket);
 $('cart-empty').hidden=!!ids.length;$('cart-form').hidden=!ids.length;$('cart-checkout').hidden=!ids.length;
 $('cart-items').innerHTML=ids.map(id=>{
  const c=cutById(id),qty=basket[id];return `<article class="cart-line" data-cart-line="${id}"><img ${thumbnailAttrs(c,64)} alt=""><div class="cart-line-name"><h3>${esc(c.name[language])}</h3><p>${esc(formatPrice(c))}</p>${preparationNotes.has(id)?`<p class="cart-preparation">${esc(preparationNotes.get(id))}</p>`:''}</div><button type="button" class="cart-remove" data-cart-remove="${id}" aria-label="${esc(text('cartRemove')+': '+c.name[language])}">×</button><div class="cart-line-controls"><div class="cart-quantity"><button type="button" data-cart-id="${id}" data-cart-step="-1" aria-label="${esc(text('decrease')+': '+c.name[language])}">−</button><label class="sr-only" for="cart-q-${id}">${esc(text('cartLineQuantity').replace('{name}',c.name[language]))}</label><input id="cart-q-${id}" data-cart-quantity="${id}" value="${qty}" maxlength="8" type="text" inputmode="${c.unit==='piece'?'numeric':'decimal'}" aria-describedby="cart-error-${id}"><span>${esc(text(c.unit==='piece'?'perPiece':'perKg'))}</span><button type="button" data-cart-id="${id}" data-cart-step="1" aria-label="${esc(text('increase')+': '+c.name[language])}">+</button></div><strong class="cart-line-total">${c.price>0?esc(currency(c.price*qty)):esc(text('priceAsk'))}</strong></div><p class="field-error" id="cart-error-${id}" hidden></p></article>`;
 }).join('');
 for(const id of [...invalidCart])if(!ids.includes(id)){invalidCart.delete(id);cartDrafts.delete(id);}
 for(const id of invalidCart){
  const input=$('cart-q-'+id),c=cutById(id);
  input.value=cartDrafts.get(id)||'';input.setAttribute('aria-invalid','true');
  $('cart-error-'+id).textContent=text(c.unit==='piece'?'piecesError':'quantityError');$('cart-error-'+id).hidden=false;
 }
 $('cart-status').replaceChildren();renderCartControls();updateCartSummary();
 if(wasInCart){
  const replacement=focusId&&focusStep?$('cart-items').querySelector(`[data-cart-id="${focusId}"][data-cart-step="${focusStep}"]`):null;
  (replacement||$('cart-items').querySelector('button')||$('cart-empty').querySelector('a')).focus({preventScroll:true});
 }
}
function notifyAdded(c,updated=false){
 clearTimeout(toastTimer);$('cart-toast-text').textContent=text(updated?'cartUpdated':'cartAdded')+': '+c.name[language];$('cart-toast').hidden=false;
 toastTimer=setTimeout(()=>{$('cart-toast').hidden=true;},3500);
}
function addToBasket(id,qty=1,replace=false){
 const c=cutById(id);if(!cutAvailable(c)||!validCartQuantity(c,qty))return;
 const updated=replace&&!!basket[id];
 basket[id]=Math.min(9999,Math.round(((replace?0:basket[id]||0)+Number(qty))*1000)/1000);
 invalidCart.delete(id);cartDrafts.delete(id);saveBasket();renderCart();notifyAdded(c,updated);track(updated?'meatco_update_cart':'meatco_add_to_cart',{product_id:id,quantity:qty});
}
function changeCartQuantity(id,direction){
 const c=cutById(id);if(!c||!basket[id]||direction>0&&!cutAvailable(c))return;
 const next=Math.round((basket[id]+direction*(c.unit==='piece'?1:.5))*1000)/1000;
 if(next<=0){delete basket[id];preparationNotes.delete(id);}else basket[id]=Math.min(9999,next);
 invalidCart.delete(id);cartDrafts.delete(id);saveBasket();renderCart();updatePreview();
}
function openCart(opener){
 $('cart-toast').hidden=true;refreshDeliverySlots();renderCart();
 if(!cartDialog.open)showDialog(cartDialog,opener);
 $('cart-form').scrollTop=0;
}
function renderProductDetail(){
 if(!activeProduct)return;
 const c=activeProduct;
 const img=$('product-detail-image');
 if(img.dataset.productId!==c.id){
  failedImages.delete(img);delete img.dataset.imageFallback;img.dataset.productId=c.id;
  img.dataset.imageFull=photoFor(c);img.dataset.imageSmall=photoFor(c,true);img.src=photoFor(c,true);
 }
 const pending=document.querySelector('.product-detail-photo .photo-pending-label');pending.hidden=img.dataset.imageFallback!=='true'&&!photoFor(c).endsWith('.svg');pending.textContent=c.name[language];img.alt=c.name[language];
 $('product-title').textContent=c.name[language];$('product-category').textContent=text(c.category);
 $('product-use').textContent=c.use[language].replace(/[.!?]$/,'')+'. '+text(c.unit==='piece'?'productDescriptionPiece':'productDescriptionKg');$('product-price').textContent=formatPrice(c);
 $('product-preparation-hint').hidden=!preparableCuts.has(c.id);
 $('product-unit-note').hidden=c.unit==='piece'||!(c.price>0);
 $('product-question').href=whatsappUrl(questionMessage(c))||'tel:+995568258118';
 $('product-quantity-label').textContent=text(c.unit==='piece'?'quantityPiece':'quantityKg');
 $('product-quantity').inputMode=c.unit==='piece'?'numeric':'decimal';
 $('product-submit').disabled=!cutAvailable(c);
 $('product-submit').textContent=text(!cutAvailable(c)?'soldOut':basket[c.id]?'updateCart':'addToCart');
 const focusedPreset=document.activeElement?.dataset.quantityPreset;
 $('product-presets').innerHTML=(c.unit==='piece'?[1,2,3]:[.5,1,1.5,2]).map(q=>`<button type="button" data-quantity-preset="${q}" aria-pressed="${Number($('product-quantity').value.replace(',','.'))===q}">${quantityText(c,q)}</button>`).join('');
 if(focusedPreset)$('product-presets').querySelector(`[data-quantity-preset="${focusedPreset}"]`)?.focus({preventScroll:true});
 updateProductEstimate();
}
function validateCartInput(input,showError=false){
 const id=input.dataset.cartQuantity,c=cutById(id),value=input.value.trim(),valid=validCartQuantity(c,value);
 if(valid){
  basket[id]=Number(value.replace(',','.'));invalidCart.delete(id);cartDrafts.delete(id);saveBasket();input.removeAttribute('aria-invalid');$('cart-error-'+id).hidden=true;
  input.closest('.cart-line').querySelector('.cart-line-total').textContent=c.price>0?currency(c.price*basket[id]):text('priceAsk');
 }else{
  invalidCart.add(id);cartDrafts.set(id,input.value);
  if(showError){input.setAttribute('aria-invalid','true');$('cart-error-'+id).textContent=text(c.unit==='piece'?'piecesError':'quantityError');$('cart-error-'+id).hidden=false;}
 }
 renderCartControls();updateCartSummary();return valid;
}
document.addEventListener('click',event=>{
 const el=event.target.closest('button,a');if(!el)return;
 if(el.matches('[data-add-cut]')){addToBasket(el.dataset.addCut);keepCardControlVisible(el);}
 if(el.matches('[data-cart-suggestion]')){
  const suggestion=cartSuggestions().find(s=>s.id===el.dataset.cartSuggestion);
  if(suggestion){addToBasket(suggestion.id,suggestion.quantity);$('cart-submit').focus({preventScroll:true});}
 }
 if(el.matches('[data-cart-step]')){changeCartQuantity(el.dataset.cartId,Number(el.dataset.cartStep));keepCardControlVisible(el);}
 if(el.matches('[data-cart-remove]')){delete basket[el.dataset.cartRemove];preparationNotes.delete(el.dataset.cartRemove);invalidCart.delete(el.dataset.cartRemove);saveBasket();renderCart();updatePreview();}
 if(el.matches('[data-cart-open]'))openCart(el);
 if(el.matches('[data-view-product]')){
  activeProduct=cutById(el.dataset.viewProduct);if(!activeProduct)return;
  $('product-note').value=preparationNotes.get(activeProduct.id)||'';$('product-quantity').value=String(basket[activeProduct.id]||1);$('product-quantity').removeAttribute('aria-invalid');$('product-quantity-error').hidden=true;
  renderProductDetail();showDialog(productDialog,el);
 }
 if(el.matches('[data-quantity-preset]')){$('product-quantity').value=el.dataset.quantityPreset;$('product-quantity-error').hidden=true;$('product-quantity').removeAttribute('aria-invalid');renderProductDetail();}
 if(el.matches('[data-product-step]')&&activeProduct){
  const current=Number($('product-quantity').value.replace(',','.'))||1,step=activeProduct.unit==='piece'?1:.5;
  $('product-quantity').value=String(Math.max(step,Math.min(9999,Math.round((current+Number(el.dataset.productStep)*step)*1000)/1000)));
  $('product-quantity-error').hidden=true;$('product-quantity').removeAttribute('aria-invalid');renderProductDetail();
 }
 if(el.matches('#product-question'))track('meatco_whatsapp_click',{source:'product_question',product_id:activeProduct?.id});
});
$('product-form').addEventListener('submit',event=>{
 event.preventDefault();const value=$('product-quantity').value.trim();
 if(!cutAvailable(activeProduct))return;
 if(!validCartQuantity(activeProduct,value)){$('product-quantity').setAttribute('aria-invalid','true');$('product-quantity-error').textContent=text(activeProduct.unit==='piece'?'piecesError':'quantityError');$('product-quantity-error').hidden=false;$('product-quantity').focus();return;}
 const preparation=$('product-note').value.trim();if(preparation)preparationNotes.set(activeProduct.id,preparation);else preparationNotes.delete(activeProduct.id);
 addToBasket(activeProduct.id,Number(value.replace(',','.')),true);productDialog.close();
});
$('cart-form').addEventListener('input',event=>{
 $('cart-status').replaceChildren();
 if(event.target.matches('[data-cart-quantity]'))validateCartInput(event.target);else updateCartSummary();
});
$('cart-form').addEventListener('change',event=>{
 if(event.target.matches('[data-cart-quantity]'))validateCartInput(event.target,true);
});
$('cart-form').addEventListener('submit',event=>{
 event.preventDefault();if(!cartHasItems())return;
 for(const input of $('cart-items').querySelectorAll('[data-cart-quantity]'))validateCartInput(input,true);
 if(invalidCart.size){$('cart-status').textContent=text('cartInvalid');$('cart-items').querySelector('[aria-invalid="true"]').focus();return;}
 if(cartMinimumRemaining()>0){updateCartSummary();$('cart-minimum').scrollIntoView({block:'nearest'});return;}
 if(cartUnavailable().length){updateCartSummary();$('cart-unavailable').scrollIntoView({block:'nearest'});return;}
 refreshDeliverySlots();updateCartSummary();
 const url=whatsappUrl(cartMessage());if(!url){$('cart-status').textContent=text('phoneError');return;}
 track('meatco_whatsapp_click',{source:'basket',items:Object.keys(basket).length});window.open(url,'_blank','noopener,noreferrer');
 const label=document.createElement('span');label.textContent=text('chatFallback')+' ';
 const phone=document.createElement('a');phone.href='tel:+995568258118';phone.textContent='+995 568 258 118';
 const retry=document.createElement('a');retry.href=url;retry.target='_blank';retry.rel='noopener noreferrer';retry.textContent=text('retryWhatsapp');
 $('cart-status').replaceChildren(label,phone,document.createElement('br'),retry);
});
$('product-quantity').addEventListener('input',updateProductEstimate);
new ResizeObserver(syncCartHintSpace).observe($('cart-checkout-hint'));
window.addEventListener('storage',event=>{if(event.key===cartKey||event.key===null){basket=readBasket();for(const id of preparationNotes.keys())if(!basket[id])preparationNotes.delete(id);renderCart();updatePreview();}});

$('product-quantity').addEventListener('input',()=>{for(const button of $('product-presets').querySelectorAll('button'))button.setAttribute('aria-pressed',String(Number($('product-quantity').value.replace(',','.'))===Number(button.dataset.quantityPreset)));});
