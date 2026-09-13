// Runs before CSS so font choice follows the same URL > saved > ka precedence.
(()=> {
 const supported=['ka','ru','en'];
 let lang='ka';
 try{const saved=localStorage.getItem('meatco:language');if(supported.includes(saved))lang=saved;}catch{}
 const query=new URLSearchParams(location.search).get('lang');
 if(supported.includes(query))lang=query;
 document.documentElement.lang=lang;
 const entry=__ENTRY_PAGE__;
 const hash=location.hash.slice(1);
 const landing=['delivery','restaurants','faq'].includes(hash)?'help':['home','catalog','help'].includes(hash)?hash:entry;
 const preload=file=>{
  const link=document.createElement('link');
  link.rel='preload';link.as='font';link.type='font/woff2';link.crossOrigin='anonymous';
  link.href='./assets/fonts/'+file;document.head.append(link);
 };
 // Georgian is already embedded in the render-blocking fonts.css, including the
 // language switch label. Do not request a second copy or preload other languages.
 if(lang!=='ka'){
  preload('manrope-400.woff2');preload('manrope-600.woff2');
  if(landing==='home')preload('prata-400.woff2');
 }
})();
