const cartKey='meatco:basket:v1',cartDialog=$('cart-dialog'),productDialog=$('product-dialog');
let basket=readBasket(),invalidCart=new Set(),cartDrafts=new Map(),activeProduct=null,toastTimer;
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
function cartMessage(){
 const lines=[text('cartGreeting'),''];
 Object.entries(basket).forEach(([id,q],i)=>{
  const c=cutById(id);lines.push(`${i+1}. ${c.name[language]} — ${quantityText(c,q)} · ${formatPrice(c)}${c.price>0?' = '+currency(lineAmount(c,q)):''}`);
 });
 const unpriced=Object.keys(basket).map(cutById).filter(c=>!c.price);
 if(Object.keys(basket).some(id=>cutById(id).price>0))lines.push('',text('cartEstimate')+': '+currency(cartSubtotal()));
 if(unpriced.length)lines.push(text('cartUnpriced').replace('{items}',unpriced.map(c=>c.name[language]).join(', ')));
 if($('cart-district').value)lines.push(text('messageDistrict')+': '+$('cart-district').value.trim());
 if($('cart-slot').value)lines.push(text('messageSlot')+': '+text({asap:'slotAny',evening:'slotEvening',tomorrow:'slotTomorrow'}[$('cart-slot').value]));
 if($('cart-note').value.trim())lines.push(text('messageNote')+': '+$('cart-note').value.trim());
 if($('cart-video')?.checked)lines.push(text('videoMessage'));
 lines.push('',text('messageEnd'));return lines.join('\n');
}
function renderCartControls(){
 const total=cartSubtotal(),hasPriced=Object.keys(basket).some(id=>cutById(id).price>0);
 for(const el of document.querySelectorAll('[data-cart-total]')){el.hidden=!cartHasItems();el.textContent=hasPriced?currency(total)+(Object.keys(basket).some(id=>!cutById(id).price)?' +':''):text('cartNav');}
 for(const el of document.querySelectorAll('.empty-cart-label'))el.hidden=cartHasItems();
 const count=Object.keys(basket).length;
 for(const button of document.querySelectorAll('.app-tabbar [data-cart-open]'))button.setAttribute('aria-label',text('cartNav')+(count?', '+count+(hasPriced?', '+currency(total):''):''));
 for(const el of document.querySelectorAll('[data-cart-count]')){el.textContent=String(count);el.classList.toggle('has-items',count>0);}
 for(const card of document.querySelectorAll('[data-product-card]')){
  const id=card.dataset.productCard,c=cutById(id),qty=basket[id]||0;
  const add=card.querySelector('[data-add-cut]'),control=card.querySelector('[data-card-quantity]');
  add.hidden=qty>0;control.hidden=!qty;
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
 $('cart-message').textContent=cartMessage();
 $('cart-form').dataset.preparedUrl=ids.length&&!invalidCart.size?whatsappUrl(cartMessage()):'';
 for(const link of document.querySelectorAll('[data-whatsapp]'))if(ids.length)link.href=invalidCart.size?'#':whatsappUrl(cartMessage());
}
function renderCart(){
 const focused=document.activeElement;
 const focusId=focused?.dataset.cartId,focusStep=focused?.dataset.cartStep,wasInCart=!!focused?.closest('#cart-items');
 const ids=Object.keys(basket);
 $('cart-empty').hidden=!!ids.length;$('cart-form').hidden=!ids.length;
 $('cart-items').innerHTML=ids.map(id=>{
  const c=cutById(id),qty=basket[id];return `<article class="cart-line" data-cart-line="${id}"><img src="${c.image.replace('.webp','-small.webp')}" alt="" width="64" height="64"><div class="cart-line-name"><h3>${esc(c.name[language])}</h3><p>${esc(formatPrice(c))}</p></div><button type="button" class="cart-remove" data-cart-remove="${id}" aria-label="${esc(text('cartRemove')+': '+c.name[language])}">×</button><div class="cart-line-controls"><div class="cart-quantity"><button type="button" data-cart-id="${id}" data-cart-step="-1" aria-label="${esc(text('decrease')+': '+c.name[language])}">−</button><label class="sr-only" for="cart-q-${id}">${esc(text('cartLineQuantity').replace('{name}',c.name[language]))}</label><input id="cart-q-${id}" data-cart-quantity="${id}" value="${qty}" maxlength="8" type="text" inputmode="${c.unit==='piece'?'numeric':'decimal'}" aria-describedby="cart-error-${id}"><span>${esc(text(c.unit==='piece'?'perPiece':'perKg'))}</span><button type="button" data-cart-id="${id}" data-cart-step="1" aria-label="${esc(text('increase')+': '+c.name[language])}">+</button></div><strong class="cart-line-total">${c.price>0?esc(currency(c.price*qty)):esc(text('priceAsk'))}</strong></div><p class="field-error" id="cart-error-${id}" hidden></p></article>`;
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
function notifyAdded(c){
 clearTimeout(toastTimer);$('cart-toast-text').textContent=text('cartAdded')+': '+c.name[language];$('cart-toast').hidden=false;
 toastTimer=setTimeout(()=>{$('cart-toast').hidden=true;},3500);
}
function addToBasket(id,qty=1){
 const c=cutById(id);if(!c||!validCartQuantity(c,qty))return;
 basket[id]=Math.min(9999,Math.round(((basket[id]||0)+Number(qty))*1000)/1000);
 saveBasket();renderCart();notifyAdded(c);track('meatco_add_to_cart',{product_id:id,quantity:qty});
}
function changeCartQuantity(id,direction){
 const c=cutById(id);if(!c||!basket[id])return;
 const next=Math.round((basket[id]+direction*(c.unit==='piece'?1:.5))*1000)/1000;
 if(next<=0)delete basket[id];else basket[id]=Math.min(9999,next);
 invalidCart.delete(id);cartDrafts.delete(id);saveBasket();renderCart();updatePreview();
}
function openCart(opener){
 $('cart-toast').hidden=true;renderCart();
 if(!cartDialog.open)showDialog(cartDialog,opener);
 $('cart-form').scrollTop=0;
}
function renderProductDetail(){
 if(!activeProduct)return;
 const c=activeProduct;
 $('product-detail-image').src=c.image.replace('.webp','-small.webp');$('product-detail-image').alt=c.name[language];
 $('product-title').textContent=c.name[language];$('product-category').textContent=text(c.category);
 $('product-use').textContent=c.use[language];$('product-price').textContent=formatPrice(c);
 $('product-quantity-label').textContent=text(c.unit==='piece'?'quantityPiece':'quantityKg');
 $('product-quantity').inputMode=c.unit==='piece'?'numeric':'decimal';
 const focusedPreset=document.activeElement?.dataset.quantityPreset;
 $('product-presets').innerHTML=(c.unit==='piece'?[1,2,3]:[.5,1,1.5,2]).map(q=>`<button type="button" data-quantity-preset="${q}" aria-pressed="${Number($('product-quantity').value.replace(',','.'))===q}">${quantityText(c,q)}</button>`).join('');
 if(focusedPreset)$('product-presets').querySelector(`[data-quantity-preset="${focusedPreset}"]`)?.focus({preventScroll:true});
 updateProductEstimate();
 const video=$('product-video');if(video)video.href=whatsappUrl(text('videoProductMessage')+' '+c.name[language]);
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
 if(el.matches('[data-add-cut]'))addToBasket(el.dataset.addCut);
 if(el.matches('[data-cart-step]'))changeCartQuantity(el.dataset.cartId,Number(el.dataset.cartStep));
 if(el.matches('[data-cart-remove]')){delete basket[el.dataset.cartRemove];invalidCart.delete(el.dataset.cartRemove);saveBasket();renderCart();updatePreview();}
 if(el.matches('[data-cart-open]'))openCart(el);
 if(el.matches('[data-view-product]')){
  activeProduct=cutById(el.dataset.viewProduct);if(!activeProduct)return;
  $('product-quantity').value='1';$('product-quantity').removeAttribute('aria-invalid');$('product-quantity-error').hidden=true;
  renderProductDetail();showDialog(productDialog,el);
 }
 if(el.matches('[data-quantity-preset]')){$('product-quantity').value=el.dataset.quantityPreset;$('product-quantity-error').hidden=true;$('product-quantity').removeAttribute('aria-invalid');renderProductDetail();}
 if(el.matches('[data-product-step]')&&activeProduct){
  const current=Number($('product-quantity').value.replace(',','.'))||1,step=activeProduct.unit==='piece'?1:.5;
  $('product-quantity').value=String(Math.max(step,Math.min(9999,Math.round((current+Number(el.dataset.productStep)*step)*1000)/1000)));
  $('product-quantity-error').hidden=true;$('product-quantity').removeAttribute('aria-invalid');renderProductDetail();
 }
 if(el.matches('[data-whatsapp]')&&cartHasItems()){event.preventDefault();openCart(el);}
});
$('product-form').addEventListener('submit',event=>{
 event.preventDefault();const value=$('product-quantity').value.trim();
 if(!validCartQuantity(activeProduct,value)){$('product-quantity').setAttribute('aria-invalid','true');$('product-quantity-error').textContent=text(activeProduct.unit==='piece'?'piecesError':'quantityError');$('product-quantity-error').hidden=false;$('product-quantity').focus();return;}
 addToBasket(activeProduct.id,Number(value.replace(',','.')));productDialog.close();
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
 const url=whatsappUrl(cartMessage());if(!url){$('cart-status').textContent=text('phoneError');return;}
 const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=text('fallback');const next=document.createElement('span');next.textContent=text('checkoutNext')+' ';$('cart-status').replaceChildren(next,link);
 track('meatco_whatsapp_click',{source:'basket',items:Object.keys(basket).length});window.open(url,'_blank','noopener,noreferrer');
});
$('product-quantity').addEventListener('input',updateProductEstimate);
window.addEventListener('storage',event=>{if(event.key===cartKey||event.key===null){basket=readBasket();renderCart();updatePreview();}});

$('product-quantity').addEventListener('input',()=>{for(const button of $('product-presets').querySelectorAll('button'))button.setAttribute('aria-pressed',String(Number($('product-quantity').value.replace(',','.'))===Number(button.dataset.quantityPreset)));});
