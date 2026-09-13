import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('src/cart-core.js','utf8');
const locale=JSON.parse(fs.readFileSync('src/locales.json','utf8'));
const data={window:{}};vm.runInNewContext(fs.readFileSync('dist/content.js','utf8'),data);
const cuts=data.window.MEATCO_CONTENT.cuts;
const cartFunctions=source.slice(source.indexOf('const cartHasItems='),source.indexOf('function renderCartControls'));
const quantityValidation=source.slice(source.indexOf('function validCartQuantity'),source.indexOf('function readBasket'));
let scenarios=0;
for(const language of ['ka','ru','en']){
 const fields={'cart-district':{value:'Test address 3'},'cart-note':{value:'TEST: no salt'},'cart-photo':{checked:true}};
 const sandbox={
  language,basket:{'pork-ribs':1.5,chicken:2,'offal-tripe':1},
  MIN_ORDER:50,config:{hours:'10:00–18:00'},
  cutAvailable:c=>!!c&&c.available!==false,
  preparationNotes:new Map([['pork-ribs','TEST: thicker cuts']]),
  slotKeys:{'12-14':'slotMidday','14-16':'slotAfternoon','16-18':'slotEvening',tomorrow:'slotTomorrow',chat:'slotUnknown'},
  selectedSlot:()=> 'tomorrow',
  text:key=>locale[language][key],cutById:id=>cuts.find(c=>c.id===id),
  $:id=>fields[id],formatPrice:c=>c.price?`${c.price} ₾ / ${locale[language][c.unit==='piece'?'perPiece':'perKg']}`:locale[language].priceAsk,
  validWeight:value=>/^\d{1,4}([.,]\d{1,3})?$/.test(value)&&Number(value.replace(',','.'))>0&&Number(value.replace(',','.'))<=9999
 };
 vm.createContext(sandbox);vm.runInContext(quantityValidation+cartFunctions,sandbox);
 const message=vm.runInContext('cartMessage()',sandbox);
 for(const line of vm.runInContext('[...cartMessageItems(),cartMessageEstimate(),cartMessageSlot()]',sandbox))assert.ok(message.includes(line),'The visible preview must use the exact outgoing order values');
 assert.equal(vm.runInContext('cartSubtotal()',sandbox),64);
 assert.ok(message.includes(cuts.find(c=>c.id==='pork-ribs').name[language]));
 assert.ok(message.startsWith('MeatCO\n'));
 assert.ok(message.includes('• '+cuts.find(c=>c.id==='pork-ribs').name[language]+' — '));
 assert.ok(message.includes('× 20 ₾')&&message.includes('× 17 ₾')&&message.includes('64 ₾'));
 assert.ok(message.includes(locale[language].cartUnpriced.replace('{items}',cuts.find(c=>c.id==='offal-tripe').name[language])));
 for(const part of ['Test address 3','TEST: no salt','TEST: thicker cuts',locale[language].slotTomorrow,locale[language].messagePhoto+': '+locale[language].answerYes,locale[language].cartMessageEnd,locale[language].messageHours.replace('{hours}','10:00–18:00')])assert.ok(message.includes(part),language+': '+part);
 assert.ok(!/video|видео|ვიდეო/i.test(message));
 assert.equal(vm.runInContext("validCartQuantity(cutById('chicken'),'1.5')",sandbox),false);
 assert.equal(vm.runInContext("validCartQuantity(cutById('pork-ribs'),'1,5')",sandbox),true);
 assert.equal(vm.runInContext("validCartQuantity(cutById('pork-ribs'),'')",sandbox),false);
 fields['cart-photo'].checked=false;fields['cart-note'].value='';fields['cart-district'].value='';sandbox.preparationNotes.clear();
 const minimal=vm.runInContext('cartMessage()',sandbox);
 assert.ok(minimal.includes(locale[language].messagePhoto+': '+locale[language].answerNo));
 assert.ok(minimal.includes(locale[language].messageAddress+': '+locale[language].messageTbc));
 assert.ok(minimal.includes(locale[language].messageComment+': —'));
 assert.ok(!minimal.includes('TEST:')&&!minimal.includes('Test address'));
 sandbox.selectedSlot=()=>'chat';assert.ok(vm.runInContext('cartMessage()',sandbox).includes(locale[language].slotUnknown));
 assert.equal(vm.runInContext('cartMessageSlot()',sandbox),locale[language].messageTime+': '+locale[language].slotUnknown);
 for(const [basket,remaining] of [[{'pork-ribs':2.49},.2],[{'pork-ribs':2.5},0],[{'beef-round':1.5},.5],[{'beef-round':2},0],[{'offal-tripe':1},50]]){
  sandbox.basket=basket;assert.equal(vm.runInContext('cartMinimumRemaining()',sandbox),remaining);
 }
 sandbox.MIN_ORDER=null;assert.equal(vm.runInContext('cartMinimumRemaining()',sandbox),0);
 scenarios+=19;
}
console.log(`Cart: ${scenarios} multilingual calculation, note, photo and validation checks passed.`);

// Changing a product-sheet quantity replaces the line. Sold-out items stay in data,
// cannot be added, and a previously saved unavailable line blocks checkout.
const mutations=source.slice(source.indexOf('function addToBasket'),source.indexOf('function changeCartQuantity'));
const oneCut={id:'test-cut',price:20,unit:'kg'};
const edit={basket:{'test-cut':1},invalidCart:new Set(),cartDrafts:new Map(),cutById:()=>oneCut,cutAvailable:c=>!!c&&c.available!==false,validCartQuantity:()=>true,saveBasket(){},renderCart(){},notifyAdded(){},track(){}};
vm.createContext(edit);vm.runInContext(mutations,edit);
edit.basket={};vm.runInContext("addToBasket('test-cut')",edit);assert.equal(edit.basket['test-cut'],1);
vm.runInContext("addToBasket('test-cut',2,true)",edit);assert.equal(edit.basket['test-cut'],2);
vm.runInContext("addToBasket('test-cut',.5)",edit);assert.equal(edit.basket['test-cut'],2.5);
oneCut.available=false;vm.runInContext("addToBasket('test-cut',4,true)",edit);assert.equal(edit.basket['test-cut'],2.5);
vm.runInContext(source.slice(source.indexOf('const cartUnavailable='),source.indexOf('function cartMessage')),edit);assert.equal(vm.runInContext('cartUnavailable().length',edit),1);
const slotSource=source.slice(source.indexOf('function refreshDeliverySlots'),source.indexOf('function validCartQuantity'));
for(const [utcHour,disabled] of [[5,[]],[10,['12-14']],[12,['12-14','14-16']],[14,['12-14','14-16','16-18']]]){
 const radios=['12-14','14-16','16-18','tomorrow','chat'].map(value=>({value,checked:value==='12-14',disabled:false}));
 const Clock=class extends Date{constructor(){super(Date.UTC(2026,8,14,utcHour));}};
 const clock={Date:Clock,document:{querySelectorAll:()=>radios,querySelector:()=>radios[4]}};
 vm.createContext(clock);vm.runInContext(slotSource+';refreshDeliverySlots();',clock);
 assert.deepEqual(radios.filter(r=>r.disabled).map(r=>r.value),disabled);
 if(disabled.length)assert.equal(radios[4].checked,true);
}
console.log('Pre-launch: product update/add, sold-out guards and Tbilisi workday boundaries passed.');

// Every offered add-on is priced, available, absent from the cart, and its shown
// half-kilogram quantity actually brings this cart to the minimum in one tap.
const suggestionCuts=structuredClone(cuts);
const upsell={basket:{},MIN_ORDER:50,invalidCart:new Set(),cutById:id=>suggestionCuts.find(c=>c.id===id),cutAvailable:c=>!!c&&c.available!==false};
upsell.content={cuts:suggestionCuts};
vm.createContext(upsell);vm.runInContext(cartFunctions,upsell);
for(const basket of [{'pork-flesh':1},{'beef-round':1.5},{chicken:1},{'mixed-mince':.01,'pork-ribs':.01,'offal-beef-liver':.01,'pork-flesh':.01},{'offal-tripe':1}]){
 upsell.basket=basket;
 const suggestions=vm.runInContext('cartSuggestions()',upsell),subtotal=vm.runInContext('cartSubtotal()',upsell);
 assert.ok(suggestions.length>=1&&suggestions.length<=3);
 assert.equal(new Set(suggestions.map(s=>s.id)).size,suggestions.length);
 for(const s of suggestions){
  const c=upsell.cutById(s.id);assert.ok(!basket[s.id]&&c.available!==false&&c.price>0&&c.unit==='kg');
  assert.ok([.5,1].includes(s.quantity));
  if(s.quantity===1)assert.ok(subtotal+Math.round(c.price*.5*100)/100<50,'Use 0.5 kg whenever it reaches the minimum');
  assert.equal(s.amount,Math.round(c.price*s.quantity*100)/100);
  assert.ok(subtotal+s.amount>=50);
 }
}
upsell.basket={'pork-ribs':2.5};assert.equal(vm.runInContext('cartSuggestions().length',upsell),0);
upsell.basket={};assert.equal(vm.runInContext('cartSuggestions().length',upsell),0);
for(const [qty,expected] of [[1.5,.5],[1,1]]){
 upsell.basket={'beef-round':qty};
 const suggestion=vm.runInContext('cartSuggestions()',upsell).find(s=>s.id==='mixed-mince');
 assert.ok(suggestion);assert.equal(suggestion.quantity,expected);
}
// If no remaining kilogram-sized cut reaches the threshold, offer no misleading add-on.
upsell.basket={'offal-tripe':1};
for(const c of suggestionCuts)if(c.price>=50)c.available=false;
assert.equal(vm.runInContext('cartSuggestions().length',upsell),0);
for(const c of suggestionCuts)delete c.available;
upsell.basket={'pork-flesh':1};upsell.invalidCart.add('pork-flesh');assert.equal(vm.runInContext('cartSuggestions().length',upsell),0);upsell.invalidCart.clear();
upsell.cutById('mixed-mince').available=false;
assert.ok(vm.runInContext('cartSuggestions()',upsell).every(s=>s.id!=='mixed-mince'));
upsell.cutById('pork-flesh').available=false;assert.equal(vm.runInContext('cartSuggestions().length',upsell),0);
const core=fs.readFileSync('src/app-core.js','utf8');
const questionSource=core.slice(core.indexOf('function questionMessage('),core.indexOf('const selectedMeat='));
for(const language of ['ka','ru','en']){
 const ask={language,text:key=>locale[language][key],cut:cuts.find(c=>c.id==='beef-round'),basket:{'pork-flesh':10}};
 vm.createContext(ask);vm.runInContext(questionSource,ask);
 assert.equal(vm.runInContext('questionMessage()',ask),locale[language].questionGreeting);
 assert.equal(vm.runInContext('questionMessage(cut)',ask),locale[language].questionGreeting+'\n'+locale[language].messageCut+': '+ask.cut.name[language]);
}
console.log('Conversion: add-on totals, duplicate/stock/invalid guards and three-language question templates passed.');

// Exercise the real submit handler without opening an external chat.
const submitSource=source.slice(source.indexOf("$('cart-form').addEventListener('submit'"),source.indexOf("$('product-quantity').addEventListener('input',updateProductEstimate)"));
for(const language of ['ka','ru','en']){
 let submit,opened,remaining=0;
 const status={replaceChildren(...children){this.children=children;}};
 const fields={'cart-form':{addEventListener(type,handler){submit=handler;}},'cart-items':{querySelectorAll:()=>[]},'cart-status':status,'cart-minimum':{scrollIntoView(){}}};
 const payload='MeatCO\n• '+cuts[0].name[language]+' — 1 кг\n50 ₾';
 const checkout={basket:{[cuts[0].id]:1},invalidCart:new Set(),$:id=>fields[id],cartHasItems:()=>true,cartMinimumRemaining:()=>remaining,cartUnavailable:()=>[],refreshDeliverySlots(){},updateCartSummary(){},cartMessage:()=>payload,whatsappUrl:body=>'https://wa.me/995568258118?text='+encodeURIComponent(body),text:key=>locale[language][key],track(){},window:{open(url){opened=url;}},document:{createElement:tag=>({tag})}};
 vm.runInNewContext(submitSource,checkout);submit({preventDefault(){}});
 assert.equal(new URL(opened).searchParams.get('text'),payload);
 assert.equal(status.children[0].textContent,locale[language].chatFallback+' ');
 assert.equal(status.children[1].href,'tel:+995568258118');
 assert.equal(status.children[1].textContent,'+995 568 258 118');
 assert.equal(status.children[3].href,opened);
 opened=null;remaining=1;submit({preventDefault(){}});assert.equal(opened,null);
}
console.log('Checkout: non-empty payload, after-open call/retry fallback and minimum guard passed in ka/ru/en.');
