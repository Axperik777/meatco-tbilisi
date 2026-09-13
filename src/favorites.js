const favoritesKey='meatco:favorites:v1';
const defaultProductOrder=Array.from(document.querySelectorAll('#product-grid [data-product-card]'),card=>card.dataset.productCard);
function readFavorites(){
 try{const saved=JSON.parse(localStorage.getItem(favoritesKey)||'[]');return new Set(Array.isArray(saved)?saved.filter(id=>typeof id==='string'&&cutById(id)).slice(0,content.cuts.length):[]);}catch{return new Set();}
}
let favoriteIds=readFavorites();
function renderFavorites(){
 for(const button of document.querySelectorAll('[data-favorite]')){
  const c=cutById(button.dataset.favorite),saved=favoriteIds.has(c.id);
  button.setAttribute('aria-pressed',String(saved));button.setAttribute('aria-label',text(saved?'removeFavorite':'saveFavorite')+': '+c.name[language]);
 }
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-favorite]');if(!button)return;
 const id=button.dataset.favorite;
 if(favoriteIds.has(id))favoriteIds.delete(id);else favoriteIds.add(id);
 try{localStorage.setItem(favoritesKey,JSON.stringify([...favoriteIds]));}catch{}
 renderFavorites();renderCatalog();
 if(category==='favorites'&&!favoriteIds.has(id))document.querySelector('[data-category="favorites"]')?.focus({preventScroll:true});
});
if($('product-sort'))$('product-sort').addEventListener('change',()=>{productLimit=12;renderCatalog();});
window.addEventListener('storage',event=>{if(event.key===favoritesKey||event.key===null){favoriteIds=readFavorites();renderFavorites();renderCatalog();}});
