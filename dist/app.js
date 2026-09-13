(() => {
'use strict';
const strings = {
  "ka": {
    "skip": "მთავარ შინაარსზე გადასვლა",
    "navCatalog": "ასორტიმენტი",
    "navDelivery": "მიტანა",
    "navFaq": "კითხვები",
    "location": "ხორცის მიტანა · თბილისი",
    "hero1": "ხორცი.",
    "hero2": "თქვენს კართან.",
    "heroDescription": "ღორისა და საქონლის ხორცი თქვენი კერძებისთვის. შეარჩიეთ სასურველი ხორცი — შეკვეთას WhatsApp-ში შევათანხმებთ.",
    "orderWhatsApp": "შეკვეთა WhatsApp-ში",
    "viewCatalog": "ასორტიმენტის ნახვა",
    "zones": "ვაკე · საბურთალო · დიდი დიღომი",
    "heroPhotoLabel": "ღორისა და საქონლის ხორცი",
    "catalogEyebrow": "აირჩიეთ თქვენი გემოვნებით",
    "catalogTitle": "რა ხორცი გჭირდებათ?",
    "catalogIntro": "აირჩიეთ სახეობა. სასურველ ნაჭერს, წონასა და ფასს მიმოწერაში დავაზუსტებთ.",
    "pork": "ღორის ხორცი",
    "beef": "საქონლის ხორცი",
    "porkDescription": "შესაწვავად, მოსაშუშად თუ ღუმელში მოსამზადებლად — გვითხარით, რა გჭირდებათ.",
    "beefDescription": "სადილისთვის თუ განსაკუთრებული კერძისთვის — დაგეხმარებით შესაბამისი ნაჭრის შერჩევაში.",
    "choosePork": "ღორის ხორცის არჩევა",
    "chooseBeef": "საქონლის ხორცის არჩევა",
    "catalogNote": "ფასი და ხელმისაწვდომობა დასტურდება შეკვეთისას. ფოტოები საილუსტრაციოა.",
    "extrasEyebrow": "იმავე შეკვეთაში",
    "extrasTitle": "ბოსტნეული, ხილი და კვერცხი",
    "extrasText": "ხორცთან ერთად სხვა პროდუქტებიც გჭირდებათ? სასურველი პროდუქტები მოგვწერეთ WhatsApp-ში.",
    "extrasCta": "შეკვეთაში დამატება",
    "deliveryEyebrow": "შეარჩიეთ. მოგვწერეთ. მიიღეთ.",
    "deliveryTitle": "მიტანა თქვენს უბანში",
    "vake": "ვაკე",
    "saburtalo": "საბურთალო",
    "didi": "დიდი დიღომი",
    "nearby": "ახლომდებარე უბანში ხართ? მოგვწერეთ მისამართი — მიტანის შესაძლებლობას გადავამოწმებთ.",
    "step1Title": "გვითხარით, რა გჭირდებათ",
    "step1Text": "ხორცის სახეობა, სავარაუდო წონა და მიტანის უბანი. თუ ვერ არჩევთ, დაგეხმარებით.",
    "step2Title": "შევათანხმოთ დეტალები",
    "step2Text": "შევათანხმებთ ხელმისაწვდომ ნაჭერს, საბოლოო წონას, სრულ ღირებულებასა და მიტანის დროს.",
    "step3Title": "მიიღეთ შეკვეთა კართან",
    "step3Text": "დადასტურების შემდეგ შეკვეთას შეთანხმებულ მისამართზე კურიერი მოგიტანთ.",
    "write": "მოგვწერეთ WhatsApp-ში",
    "illustration": "MeatCO · საილუსტრაციო გამოსახულება",
    "faqTitle": "შეკვეთამდე",
    "faq1Q": "როგორ გავიგო ფასი?",
    "faq1A": "მოგვწერეთ, რომელი ხორცი და რა რაოდენობა გჭირდებათ. დაგიზუსტებთ ფასს კილოგრამზე. საბოლოო ღირებულებას, მიტანის ჩათვლით, დადასტურებამდე შევათანხმებთ.",
    "faq2Q": "შემიძლია კონკრეტული ნაჭრის შეკვეთა?",
    "faq2A": "დიახ, მოგვწერეთ სასურველი ნაჭერი ან კერძი, რომლის მომზადებაც გსურთ. ხელმისაწვდომობას გადავამოწმებთ და ვარიანტებს შემოგთავაზებთ.",
    "faq3Q": "რა ღირს მიტანა და როდის მივიღებ შეკვეთას?",
    "faq3A": "მიტანის ღირებულებასა და დროს თქვენი მისამართის მიხედვით WhatsApp-ში დავაზუსტებთ, შეკვეთის დადასტურებამდე.",
    "footerTag": "ღორისა და საქონლის ხორცის მიტანა თბილისში.",
    "photoNote": "საიტზე გამოყენებულია საილუსტრაციო გამოსახულებები.",
    "privacy": "კონფიდენციალურობა",
    "mobileLabel": "ხორცი თქვენს კართან",
    "orderTitle": "თქვენი შეკვეთა",
    "orderIntro": "მიუთითეთ რაც იცით. დანარჩენს მიმოწერაში დავაზუსტებთ.",
    "meatType": "რომელი ხორცი გჭირდებათ?",
    "porkShort": "ღორის",
    "beefShort": "საქონლის",
    "needHelp": "დამეხმარეთ არჩევაში",
    "quantityLabel": "წონა, კგ · სურვილისამებრ",
    "districtLabel": "მიტანის უბანი",
    "districtPlaceholder": "აირჩიეთ",
    "otherDistrict": "ახლომდებარე უბანი",
    "noteLabel": "სასურველი ნაჭერი ან კერძი",
    "notePlaceholder": "მაგალითად: ხორცი შესაწვავად, 4 ადამიანისთვის",
    "extrasCheck": "მაინტერესებს ბოსტნეული, ხილი ან კვერცხიც",
    "previewMessage": "შეტყობინების ნახვა",
    "formHint": "WhatsApp-ში ტექსტს გაგზავნამდე ნახავთ. შეკვეთა მხოლოდ დეტალების შეთანხმების შემდეგ დასტურდება.",
    "continueWhatsApp": "გაგრძელება WhatsApp-ში",
    "privacyText": "ფორმის შევსება MeatCO-ს მონაცემებს ავტომატურად არ უგზავნის. WhatsApp-ში გადასვლისას ტექსტი გადაეცემა WhatsApp-ს, სადაც გაგზავნამდე მის შეცვლას შეძლებთ. ბრაუზერი ინახავს ენის არჩევანს და, მიმდინარე სესიის განმავლობაში, სარეკლამო ბმულის პარამეტრებს. ფორმის ტექსტი ბრაუზერის საცავში არ ინახება. სარეკლამო ანალიტიკა გამორთულია. შეკითხვებისთვის: +995 568 258 118.",
    "whatsappPrivacy": "WhatsApp-ის კონფიდენციალურობის პოლიტიკა",
    "close": "დახურვა",
    "porkAlt": "ღორის ხორცი პერგამენტზე — საილუსტრაციო ფოტო",
    "beefAlt": "საქონლის ხორცი პერგამენტზე — საილუსტრაციო ფოტო",
    "pigAlt": "MeatCO-ს საილუსტრაციო გამოსახულება: გოჭი კართან",
    "title": "MeatCO — ხორცის მიტანა თბილისში",
    "description": "ღორისა და საქონლის ხორცის მიტანა ვაკეში, საბურთალოსა და დიდ დიღომში. შეკვეთა WhatsApp-ში.",
    "navLabel": "მთავარი ნავიგაცია",
    "languageLabel": "ენის არჩევა",
    "quantityError": "მიუთითეთ წონა 0-ზე მეტი და 9999 კგ-მდე, მაქსიმუმ 3 ათწილადი ნიშნით. მაგალითად: 1.5",
    "phoneError": "WhatsApp დროებით მიუწვდომელია. დაგვირეკეთ: +995 568 258 118.",
    "fallback": "თუ WhatsApp არ გაიხსნა, გადადით ამ ბმულზე.",
    "messageGreeting": "გამარჯობა, MeatCO! მსურს ხორცის შეკვეთა მიტანით.",
    "messageMeat": "ხორცი",
    "messageHelp": "არჩევაში დახმარება მჭირდება",
    "messageWeight": "სავარაუდო წონა",
    "messageDistrict": "უბანი",
    "messageNote": "სურვილები",
    "messageExtras": "მაინტერესებს ბოსტნეული, ხილი ან კვერცხიც.",
    "messageEnd": "გთხოვთ, დამიზუსტოთ ხელმისაწვდომობა, ფასი და მიტანის პირობები.",
    "kg": "კგ",
    "b2bEyebrow": "რესტორნებისა და კაფეებისთვის",
    "b2bTitle": "ხორცი თქვენი სამზარეულოსთვის",
    "b2bText": "ღორისა და საქონლის ხორცი თქვენი ბიზნესისთვის. განვიხილოთ სასურველი ნაჭრები, მოცულობა, ფასები და მოწოდების გრაფიკი.",
    "b2bCta": "მოწოდების განხილვა",
    "b2bMessage": "გამარჯობა, MeatCO! მაინტერესებს ხორცის მიწოდება რესტორნის ან კაფესთვის. მსურს განვიხილოთ სასურველი ნაჭრები, მოცულობა, ფასები და მოწოდების გრაფიკი."
  },
  "ru": {
    "skip": "Перейти к содержимому",
    "navCatalog": "Ассортимент",
    "navDelivery": "Доставка",
    "navFaq": "Вопросы",
    "location": "Доставка мяса · Тбилиси",
    "hero1": "Мясо.",
    "hero2": "Прямо к двери.",
    "heroDescription": "Свинина и говядина для ваших блюд. Выбирайте мясо — детали заказа согласуем в WhatsApp.",
    "orderWhatsApp": "Заказать в WhatsApp",
    "viewCatalog": "Посмотреть ассортимент",
    "zones": "Ваке · Сабуртало · Диди Дигоми",
    "heroPhotoLabel": "Свинина и говядина",
    "catalogEyebrow": "Выбирайте на свой вкус",
    "catalogTitle": "Какое мясо вам нужно?",
    "catalogIntro": "Выберите категорию. Нужный кусок, вес и цену уточним в переписке.",
    "pork": "Свинина",
    "beef": "Говядина",
    "porkDescription": "Для жарки, тушения или запекания — напишите, какое мясо вам нужно.",
    "beefDescription": "Для домашнего ужина или особенного блюда — поможем подобрать подходящий кусок.",
    "choosePork": "Выбрать свинину",
    "chooseBeef": "Выбрать говядину",
    "catalogNote": "Цены и наличие уточняются при заказе. Фотографии иллюстративные.",
    "extrasEyebrow": "В ту же доставку",
    "extrasTitle": "Овощи, фрукты и яйца",
    "extrasText": "Нужно что-то ещё к мясу? Напишите в WhatsApp, какие продукты добавить к заказу.",
    "extrasCta": "Добавить к заказу",
    "deliveryEyebrow": "Выберите. Напишите. Получите.",
    "deliveryTitle": "Доставляем в ваш район",
    "vake": "Ваке",
    "saburtalo": "Сабуртало",
    "didi": "Диди Дигоми",
    "nearby": "Живёте рядом? Напишите адрес — уточним возможность доставки.",
    "step1Title": "Расскажите, что нужно",
    "step1Text": "Вид мяса, примерный вес и район доставки. Если не определились, поможем выбрать.",
    "step2Title": "Согласуем детали",
    "step2Text": "Уточним доступный кусок, итоговый вес, полную стоимость и время доставки.",
    "step3Title": "Получите заказ у двери",
    "step3Text": "После подтверждения курьер доставит заказ по согласованному адресу.",
    "write": "Написать в WhatsApp",
    "illustration": "MeatCO · Иллюстрация",
    "faqTitle": "Перед заказом",
    "faq1Q": "Как узнать цену?",
    "faq1A": "Напишите, какое мясо и сколько вам нужно. Уточним цену за килограмм. Итоговую сумму с учётом доставки согласуем до подтверждения заказа.",
    "faq2Q": "Можно заказать определённую часть?",
    "faq2A": "Да, напишите, какой кусок нужен или что собираетесь готовить. Проверим наличие и предложим варианты.",
    "faq3Q": "Сколько стоит доставка и когда привезут?",
    "faq3A": "Стоимость и время доставки уточним в WhatsApp по вашему адресу, до подтверждения заказа.",
    "footerTag": "Свинина и говядина с доставкой по Тбилиси.",
    "photoNote": "На сайте используются иллюстративные изображения.",
    "privacy": "Конфиденциальность",
    "mobileLabel": "Мясо к вашей двери",
    "orderTitle": "Ваш заказ",
    "orderIntro": "Укажите то, что уже знаете. Остальное уточним в переписке.",
    "meatType": "Какое мясо нужно?",
    "porkShort": "Свинина",
    "beefShort": "Говядина",
    "needHelp": "Помогите выбрать",
    "quantityLabel": "Вес, кг · необязательно",
    "districtLabel": "Район доставки",
    "districtPlaceholder": "Выберите",
    "otherDistrict": "Соседний район",
    "noteLabel": "Нужный кусок или блюдо",
    "notePlaceholder": "Например: мясо для жарки на 4 человек",
    "extrasCheck": "Интересуют также овощи, фрукты или яйца",
    "previewMessage": "Посмотреть сообщение",
    "formHint": "В WhatsApp вы увидите текст перед отправкой. Заказ подтверждается после согласования деталей.",
    "continueWhatsApp": "Продолжить в WhatsApp",
    "privacyText": "Заполнение формы не отправляет данные MeatCO автоматически. При переходе в WhatsApp текст передаётся WhatsApp; его можно изменить перед отправкой. Браузер сохраняет выбранный язык и, на время текущей сессии, параметры рекламной ссылки. Текст формы в хранилище браузера не сохраняется. Рекламная аналитика отключена. По вопросам: +995 568 258 118.",
    "whatsappPrivacy": "Политика конфиденциальности WhatsApp",
    "close": "Закрыть",
    "porkAlt": "Свинина на пергаменте — иллюстративное фото",
    "beefAlt": "Говядина на пергаменте — иллюстративное фото",
    "pigAlt": "Иллюстрация MeatCO: поросёнок у двери",
    "title": "MeatCO — доставка мяса в Тбилиси",
    "description": "Свинина и говядина с доставкой в Ваке, Сабуртало и Диди Дигоми. Заказ в WhatsApp.",
    "navLabel": "Основная навигация",
    "languageLabel": "Выбрать язык",
    "quantityError": "Введите вес больше 0 и не больше 9999 кг, до 3 знаков после запятой. Например: 1,5",
    "phoneError": "WhatsApp временно недоступен. Позвоните: +995 568 258 118.",
    "fallback": "Если WhatsApp не открылся, перейдите по этой ссылке.",
    "messageGreeting": "Здравствуйте, MeatCO! Хочу заказать мясо с доставкой.",
    "messageMeat": "Мясо",
    "messageHelp": "Нужна помощь с выбором",
    "messageWeight": "Примерный вес",
    "messageDistrict": "Район",
    "messageNote": "Пожелания",
    "messageExtras": "Интересуют также овощи, фрукты или яйца.",
    "messageEnd": "Подскажите наличие, цену и условия доставки.",
    "kg": "кг",
    "b2bEyebrow": "Для ресторанов и кафе",
    "b2bTitle": "Мясо для вашей кухни",
    "b2bText": "Свинина и говядина для вашего бизнеса. Обсудим нужные части, объёмы, цены и график поставок.",
    "b2bCta": "Обсудить поставки",
    "b2bMessage": "Здравствуйте, MeatCO! Интересуют поставки мяса для ресторана или кафе. Хочу обсудить нужные части, объёмы, цены и график поставок."
  },
  "en": {
    "skip": "Skip to content",
    "navCatalog": "Our meat",
    "navDelivery": "Delivery",
    "navFaq": "Questions",
    "location": "Meat delivery · Tbilisi",
    "hero1": "Your meat.",
    "hero2": "At your door.",
    "heroDescription": "Pork and beef for the meals you love. Choose your meat and arrange your order with us on WhatsApp.",
    "orderWhatsApp": "Order on WhatsApp",
    "viewCatalog": "Explore our meat",
    "zones": "Vake · Saburtalo · Didi Dighomi",
    "heroPhotoLabel": "Pork and beef",
    "catalogEyebrow": "Choose what you love",
    "catalogTitle": "What are you cooking?",
    "catalogIntro": "Choose a category. We’ll help you find a cut and confirm the weight and price in our chat.",
    "pork": "Pork",
    "beef": "Beef",
    "porkDescription": "For frying, slow cooking or roasting — tell us what you have in mind.",
    "beefDescription": "For a family dinner or a special meal — we’ll help you choose a suitable cut.",
    "choosePork": "Choose pork",
    "chooseBeef": "Choose beef",
    "catalogNote": "Prices and availability are confirmed when ordering. Images are illustrative.",
    "extrasEyebrow": "In the same delivery",
    "extrasTitle": "Vegetables, fruit and eggs",
    "extrasText": "Need a few extras with your meat? Tell us on WhatsApp what you would like to add.",
    "extrasCta": "Add to your order",
    "deliveryEyebrow": "Choose. Message. Enjoy.",
    "deliveryTitle": "Delivered to your neighbourhood",
    "vake": "Vake",
    "saburtalo": "Saburtalo",
    "didi": "Didi Dighomi",
    "nearby": "Live nearby? Send us your address and we’ll check whether we can deliver.",
    "step1Title": "Tell us what you need",
    "step1Text": "Your choice of meat, approximate weight and delivery area. Need help choosing? Just ask.",
    "step2Title": "Confirm the details",
    "step2Text": "We’ll confirm the available cut, final weight, total cost and delivery time.",
    "step3Title": "Receive it at your door",
    "step3Text": "Once you confirm your order, our courier will bring it to the agreed address.",
    "write": "Message on WhatsApp",
    "illustration": "MeatCO · Illustration",
    "faqTitle": "Before you order",
    "faq1Q": "How can I check prices?",
    "faq1A": "Tell us which meat you need and how much. We’ll confirm the price per kilogram and agree on the total, including delivery, before you confirm your order.",
    "faq2Q": "Can I request a particular cut?",
    "faq2A": "Yes. Tell us the cut you want or the meal you’re planning. We’ll check availability and suggest options.",
    "faq3Q": "How much is delivery and when will it arrive?",
    "faq3A": "We’ll confirm the delivery fee and timing on WhatsApp based on your address, before you confirm your order.",
    "footerTag": "Pork and beef delivered in Tbilisi.",
    "photoNote": "The images on this website are illustrative.",
    "privacy": "Privacy",
    "mobileLabel": "Meat at your door",
    "orderTitle": "Your order",
    "orderIntro": "Add the details you know. We’ll work out the rest in our chat.",
    "meatType": "Which meat would you like?",
    "porkShort": "Pork",
    "beefShort": "Beef",
    "needHelp": "Help me choose",
    "quantityLabel": "Weight, kg · optional",
    "districtLabel": "Delivery area",
    "districtPlaceholder": "Choose an area",
    "otherDistrict": "A nearby area",
    "noteLabel": "Your preferred cut or dish",
    "notePlaceholder": "For example: meat for frying, for 4 people",
    "extrasCheck": "I’m also interested in vegetables, fruit or eggs",
    "previewMessage": "Preview your message",
    "formHint": "You can review the text in WhatsApp before sending. Your order is confirmed after we agree on the details.",
    "continueWhatsApp": "Continue to WhatsApp",
    "privacyText": "Completing this form does not automatically send your details to MeatCO. Opening WhatsApp shares the prepared text with WhatsApp; you can edit it before sending. Your browser stores your language choice and, for the current session, advertising link parameters. Form content is not saved in browser storage. Advertising analytics are disabled. Questions: +995 568 258 118.",
    "whatsappPrivacy": "WhatsApp privacy policy",
    "close": "Close",
    "porkAlt": "Pork on parchment — illustrative photo",
    "beefAlt": "Beef on parchment — illustrative photo",
    "pigAlt": "MeatCO illustration of a pig at a front door",
    "title": "MeatCO — meat delivery in Tbilisi",
    "description": "Pork and beef delivered in Vake, Saburtalo and Didi Dighomi. Order on WhatsApp.",
    "navLabel": "Main navigation",
    "languageLabel": "Choose a language",
    "quantityError": "Enter a weight greater than 0 and no more than 9999 kg, with up to 3 decimal places. For example: 1.5",
    "phoneError": "WhatsApp is temporarily unavailable. Call +995 568 258 118.",
    "fallback": "If WhatsApp did not open, use this link.",
    "messageGreeting": "Hello, MeatCO! I’d like to order meat for delivery.",
    "messageMeat": "Meat",
    "messageHelp": "I’d like help choosing",
    "messageWeight": "Approximate weight",
    "messageDistrict": "Area",
    "messageNote": "Notes",
    "messageExtras": "I’m also interested in vegetables, fruit or eggs.",
    "messageEnd": "Please confirm availability, prices and delivery details.",
    "kg": "kg",
    "b2bEyebrow": "For restaurants and cafés",
    "b2bTitle": "Meat for your kitchen",
    "b2bText": "Pork and beef for your business. Let’s discuss the cuts, quantities, prices and delivery schedule you need.",
    "b2bCta": "Discuss supply",
    "b2bMessage": "Hello, MeatCO! I’m interested in meat supply for a restaurant or café. I’d like to discuss cuts, quantities, prices and delivery schedules."
  }
};
const config = window.MEATCO_CONFIG || {};
const supported = Object.keys(strings);
let language = 'ka';
const form = document.getElementById('order-form');
const orderDialog = document.getElementById('order-dialog');
const privacyDialog = document.getElementById('privacy-dialog');
const quantity = document.getElementById('quantity');
const district = document.getElementById('district');
const note = document.getElementById('order-note');
const error = document.getElementById('quantity-error');
const status = document.getElementById('form-status');
let lastOpener = null;
let attribution = {};
try {
 const params = new URLSearchParams(location.search);
 const saved = JSON.parse(sessionStorage.getItem('meatco:attribution') || '{}');
 if (saved && typeof saved === 'object' && !Array.isArray(saved)) attribution = saved;
 for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','gbraid','wbraid']) {
  const value = params.get(key);
  if (value && value.length <= 300) attribution[key] = value;
 }
 if (Object.keys(attribution).length) sessionStorage.setItem('meatco:attribution',JSON.stringify(attribution));
} catch { attribution = {}; }
function text(key) { return strings[language][key] || strings.ka[key] || key; }
function track(event, details = {}) {
 if (!config.analytics?.enabled) return;
 if (config.analytics.consentRequired) {
  try { if (localStorage.getItem('meatco:analytics-consent') !== 'granted') return; } catch { return; }
 }
 window.dataLayer = window.dataLayer || [];
 window.dataLayer.push({event, language, ...attribution, ...details});
}
function phone() {
 const number = String(config.whatsappNumber || '').replace(/\D/g,'');
 return /^[1-9]\d{7,14}$/.test(number) ? number : null;
}
function whatsappUrl(message) {
 return phone() ? 'https://wa.me/' + phone() + '?text=' + encodeURIComponent(message) : '';
}
function selectedMeat() { return form.querySelector('input[name="meat"]:checked')?.value || 'any'; }
function validWeight(value) {
 return !value || (/^\d{1,4}([.,]\d{1,3})?$/.test(value) && Number(value.replace(',','.')) > 0 && Number(value.replace(',','.')) <= 9999);
}
function message() {
 const meat = selectedMeat();
 const lines = [text('messageGreeting'),'',text('messageMeat') + ': ' + (meat === 'any' ? text('messageHelp') : text(meat))];
 const weight = quantity.value.trim();
 if (weight && validWeight(weight)) lines.push(text('messageWeight') + ': ' + weight.replace(',','.') + ' ' + text('kg'));
 if (district.value) lines.push(text('messageDistrict') + ': ' + text(district.value === 'nearby' ? 'otherDistrict' : district.value));
 if (note.value.trim()) lines.push(text('messageNote') + ': ' + note.value.trim());
 if (document.getElementById('add-extras').checked) lines.push(text('messageExtras'));
 lines.push('',text('messageEnd'));
 return lines.join('\n');
}
function updatePreview() {
 const prepared = message();
 document.getElementById('message-preview-text').textContent = prepared;
 form.dataset.preparedUrl = validWeight(quantity.value.trim()) ? whatsappUrl(prepared) : '';
}
function setLanguage(next, persist = true) {
 language = supported.includes(next) ? next : 'ka';
 document.documentElement.lang = language;
 document.title = text('title');
 document.querySelector('meta[name="description"]').content = text('description');
 for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = text(element.dataset.i18n);
 for (const element of document.querySelectorAll('[data-alt]')) element.alt = text(element.dataset.alt);
 for (const element of document.querySelectorAll('[data-aria]')) element.setAttribute('aria-label',text(element.dataset.aria));
 for (const element of document.querySelectorAll('[data-placeholder]')) element.placeholder = text(element.dataset.placeholder);
 document.querySelector('.desktop-nav').setAttribute('aria-label',text('navLabel'));
 document.querySelector('.languages').setAttribute('aria-label',text('languageLabel'));
 for (const button of document.querySelectorAll('[data-lang]')) button.setAttribute('aria-pressed',String(button.dataset.lang === language));
 for (const link of document.querySelectorAll('[data-whatsapp]')) {
  const url = whatsappUrl(text('messageGreeting'));
  link.href = url || 'tel:+995568258118';
 }
 for (const link of document.querySelectorAll('[data-wholesale]')) link.href = whatsappUrl(text('b2bMessage')) || 'tel:+995568258118';
 if (!error.hidden) error.textContent = text('quantityError');
 status.replaceChildren();
 updatePreview();
 if (persist) {
  try { localStorage.setItem('meatco:language',language); } catch {}
  try { const url = new URL(location.href); url.searchParams.set('lang',language); history.replaceState(null,'',url); } catch {}
 }
}
for (const button of document.querySelectorAll('[data-lang]')) button.addEventListener('click',() => setLanguage(button.dataset.lang));
for (const button of document.querySelectorAll('[data-order]')) button.addEventListener('click',() => {
 const category = ['pork','beef'].includes(button.dataset.order) ? button.dataset.order : 'any';
 form.querySelector('input[name="meat"][value="' + category + '"]').checked = true;
 if (button.dataset.extra === 'true') document.getElementById('add-extras').checked = true;
 lastOpener = button;
 status.replaceChildren(); error.hidden = true; quantity.removeAttribute('aria-invalid');
 updatePreview();
 if (!orderDialog.open) orderDialog.showModal();
 track('meatco_order_form_open',{category});
});
for (const button of document.querySelectorAll('[data-close]')) button.addEventListener('click',() => button.closest('dialog').close());
for (const dialog of [orderDialog,privacyDialog]) {
 dialog.addEventListener('click',event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
 });
 dialog.addEventListener('close',() => { if (lastOpener?.isConnected) lastOpener.focus(); });
}
document.getElementById('privacy-open').addEventListener('click',event => { lastOpener = event.currentTarget; privacyDialog.showModal(); });
form.addEventListener('input',() => {
 status.replaceChildren();
 if (validWeight(quantity.value.trim())) { error.hidden = true; quantity.removeAttribute('aria-invalid'); }
 updatePreview();
});
form.addEventListener('change',updatePreview);
form.addEventListener('submit',event => {
 event.preventDefault();
 const weight = quantity.value.trim();
 if (!validWeight(weight)) {
  error.textContent = text('quantityError'); error.hidden = false;
  quantity.setAttribute('aria-invalid','true'); quantity.focus(); updatePreview(); return;
 }
 const url = whatsappUrl(message());
 if (!url) { status.textContent = text('phoneError'); return; }
 const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = text('fallback');
 status.replaceChildren(link);
 track('meatco_whatsapp_click',{category:selectedMeat(),source:'order_form'});
 window.open(url,'_blank','noopener,noreferrer');
});
for (const link of document.querySelectorAll('[data-whatsapp]')) link.addEventListener('click',() => track('meatco_whatsapp_click',{source:'direct'}));
for (const link of document.querySelectorAll('[data-wholesale]')) link.addEventListener('click',() => track('meatco_whatsapp_click',{source:'restaurant_supply',segment:'b2b'}));
let initial = config.defaultLanguage || 'ka';
try { const saved = localStorage.getItem('meatco:language'); if (supported.includes(saved)) initial = saved; } catch {}
const requested = new URLSearchParams(location.search).get('lang');
if (supported.includes(requested)) initial = requested;
setLanguage(initial,false);
document.getElementById('year').textContent = String(new Date().getFullYear());
})();