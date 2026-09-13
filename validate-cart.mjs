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
  MIN_ORDER:50,
  preparationNotes:new Map([['pork-ribs','TEST: thicker cuts']]),
  slotKeys:{'12-14':'slotMidday','16-18':'slotAfternoon','18-21':'slotEvening',tomorrow:'slotTomorrow',chat:'slotUnknown'},
  selectedSlot:()=> 'tomorrow',
  text:key=>locale[language][key],cutById:id=>cuts.find(c=>c.id===id),
  $:id=>fields[id],formatPrice:c=>c.price?`${c.price} ₾ / ${locale[language][c.unit==='piece'?'perPiece':'perKg']}`:locale[language].priceAsk,
  validWeight:value=>/^\d{1,4}([.,]\d{1,3})?$/.test(value)&&Number(value.replace(',','.'))>0&&Number(value.replace(',','.'))<=9999
 };
 vm.createContext(sandbox);vm.runInContext(quantityValidation+cartFunctions,sandbox);
 const message=vm.runInContext('cartMessage()',sandbox);
 assert.equal(vm.runInContext('cartSubtotal()',sandbox),64);
 assert.ok(message.includes(cuts.find(c=>c.id==='pork-ribs').name[language]));
 assert.ok(message.includes('30 ₾')&&message.includes('34 ₾')&&message.includes('64 ₾'));
 assert.ok(message.includes(locale[language].cartUnpriced.replace('{items}',cuts.find(c=>c.id==='offal-tripe').name[language])));
 for(const part of ['Test address 3','TEST: no salt','TEST: thicker cuts',locale[language].slotTomorrow,locale[language].photoMessage,locale[language].messageEnd])assert.ok(message.includes(part),language+': '+part);
 assert.ok(!/video|видео|ვიდეო/i.test(message));
 assert.equal(vm.runInContext("validCartQuantity(cutById('chicken'),'1.5')",sandbox),false);
 assert.equal(vm.runInContext("validCartQuantity(cutById('pork-ribs'),'1,5')",sandbox),true);
 assert.equal(vm.runInContext("validCartQuantity(cutById('pork-ribs'),'')",sandbox),false);
 fields['cart-photo'].checked=false;fields['cart-note'].value='';fields['cart-district'].value='';sandbox.preparationNotes.clear();
 const minimal=vm.runInContext('cartMessage()',sandbox);
 assert.ok(!minimal.includes(locale[language].photoMessage)&&!minimal.includes('TEST:')&&!minimal.includes('Test address'));
 sandbox.selectedSlot=()=>'chat';assert.ok(vm.runInContext('cartMessage()',sandbox).includes(locale[language].slotUnknown));
 for(const [basket,remaining] of [[{'pork-ribs':2.49},.2],[{'pork-ribs':2.5},0],[{'beef-round':1.5},.5],[{'beef-round':2},0],[{'offal-tripe':1},null]]){
  sandbox.basket=basket;assert.equal(vm.runInContext('cartMinimumRemaining()',sandbox),remaining);
 }
 sandbox.MIN_ORDER=null;assert.equal(vm.runInContext('cartMinimumRemaining()',sandbox),0);
 scenarios+=13;
}
console.log(`Cart: ${scenarios} multilingual calculation, note, photo and validation checks passed.`);
