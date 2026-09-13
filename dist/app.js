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
    "heroDescription": "ვახშამი ოჯახისთვის თუ სუფრა სტუმრებისთვის — ხორცი თქვენი კერძისთვის შეარჩიეთ. სასურველ ნაჭერს, წონას და მიტანას WhatsApp-ში შევათანხმებთ.",
    "orderWhatsApp": "შეკვეთა WhatsApp-ში",
    "viewCatalog": "ხორცის არჩევა",
    "zones": "ვაკე · საბურთალო · დიდი დიღომი",
    "heroPhotoLabel": "ღორისა და საქონლის ხორცი",
    "catalogEyebrow": "ღორისა და საქონლის ხორცი",
    "catalogTitle": "ყველაფერი კარგი კერძით იწყება",
    "catalogIntro": "იცით, რომელი ნაჭერი გჭირდებათ? აირჩიეთ ქვემოთ. თუ ჯერ ვერ გადაწყვიტეთ, კერძის მიხედვით დაგეხმარებით.",
    "pork": "ღორის ხორცი",
    "beef": "საქონლის ხორცი",
    "porkDescription": "შესაწვავად, მოსაშუშად თუ ღუმელში მოსამზადებლად — გვითხარით, რა გჭირდებათ.",
    "beefDescription": "სადილისთვის თუ განსაკუთრებული კერძისთვის — დაგეხმარებით შესაბამისი ნაჭრის შერჩევაში.",
    "choosePork": "ღორის ხორცის არჩევა",
    "chooseBeef": "საქონლის ხორცის არჩევა",
    "catalogNote": "კონკრეტული ნაჭრის ხელმისაწვდომობასა და ფასს შეკვეთისას დავაზუსტებთ. ფოტოები საილუსტრაციოა.",
    "extrasEyebrow": "იმავე შეკვეთაში",
    "extrasTitle": "კიდევ რა გჭირდებათ სახლში?",
    "extrasText": "მონიშნეთ სასურველი პროდუქტები. ასორტიმენტსა და ფასებს ხორცის შეკვეთასთან ერთად დავაზუსტებთ.",
    "extrasCta": "არჩეულის შესახებ კითხვა",
    "deliveryEyebrow": "თბილისი · მიტანა სახლში",
    "deliveryTitle": "თქვენთანაც მოვიტანთ",
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
    "b2bMessage": "გამარჯობა, MeatCO! მაინტერესებს ხორცის მიწოდება რესტორნის ან კაფესთვის. მსურს განვიხილოთ სასურველი ნაჭრები, მოცულობა, ფასები და მოწოდების გრაფიკი.",
    "navGuide": "რა მოვამზადოთ?",
    "navB2b": "ბიზნესისთვის",
    "promise1Title": "შერჩევა თქვენი კერძისთვის",
    "promise1Text": "გვითხარით, რას ამზადებთ",
    "promise2Title": "სრული ფასი წინასწარ",
    "promise2Text": "შევათანხმებთ დადასტურებამდე",
    "promise3Title": "მიტანა თქვენს უბანში",
    "promise3Text": "ვაკე · საბურთალო · დიდი დიღომი",
    "cutsPrompt": "იკითხეთ სასურველი ნაჭრის შესახებ",
    "cutPorkNeck": "კისერი",
    "cutPorkShoulder": "ბეჭი",
    "cutPorkRibs": "ღორის ნეკნები",
    "cutBeefFlesh": "უძვლო ხორცი",
    "cutBeefBrisket": "მკერდი",
    "cutBeefRibs": "საქონლის ნეკნები",
    "guideEyebrow": "ხორცი კერძის მიხედვით",
    "guideTitle": "რას ამზადებთ?",
    "guideIntro": "კარგად ნაცნობი კერძი გქონდეთ მხედველობაში — ხორცის შერჩევაში ჩვენ დაგეხმარებით.",
    "guideOjakhuri": "ოჯახური",
    "guideStew": "ჩაშუშული",
    "guideGrill": "გრილზე",
    "guideOwn": "სხვა კერძი",
    "guideOjakhuriTitle": "ოჯახური თქვენი სუფრისთვის",
    "guideOjakhuriText": "ღორის ხორცის შესაფერისი ნაჭერი შეარჩიეთ. კარტოფილისა და ხახვის დამატებაც შეგიძლიათ ითხოვოთ — ხელმისაწვდომობას მიმოწერაში დავაზუსტებთ.",
    "guideOjakhuriNeed": "ღორის ხორცი · შესაწვავად",
    "guideStewTitle": "ხორცი ჩაშუშულისთვის",
    "guideStewText": "მოგვწერეთ, რომ საქონლის ხორცი ჩაშუშულისთვის გჭირდებათ. შესაფერის ნაჭერსა და სასურველ რაოდენობას ერთად შევარჩევთ.",
    "guideStewNeed": "საქონლის ხორცი · მოსაშუშად",
    "guideGrillTitle": "თქვენ მოამზადეთ გრილი",
    "guideGrillText": "ღორის ხორცი გირჩევნიათ თუ საქონლის? მოგვწერეთ, როგორ აპირებთ მომზადებას — ნაჭრის შერჩევაში დაგეხმარებით.",
    "guideGrillNeed": "ღორის ან საქონლის ხორცი · გრილისთვის",
    "guideOwnTitle": "თქვენი რეცეპტი, თქვენი არჩევანი",
    "guideOwnText": "ნაჭრის სახელის ცოდნა აუცილებელი არ არის. უბრალოდ მოგვწერეთ, რას ამზადებთ და რამდენი ადამიანისთვის.",
    "guideOwnNeed": "კერძის მიხედვით შეგირჩევთ",
    "guidePeople": "რამდენი ადამიანისთვის?",
    "guideCta": "ამ კერძისთვის ხორცის შერჩევა",
    "guideImageAlt": "ოჯახურის, სალათისა და პურის საილუსტრაციო ფოტო",
    "guideCaption": "მომზადების იდეა. MeatCO-სგან ნედლ ხორცს უკვეთავთ.",
    "guideHint": "ეს მზა კერძის ან ფიქსირებული ნაკრების შეკვეთა არ არის.",
    "peopleUnit": "ადამიანი",
    "extraVegetables": "ბოსტნეული",
    "extraFruit": "ხილი",
    "extraEggs": "კვერცხი",
    "extraVegetablesText": "სალათისთვის ან გარნირისთვის",
    "extraFruitText": "სუფრასთან თუ შემდეგისთვის",
    "extraEggsText": "საუზმისა და სახლის მარაგისთვის",
    "extrasNone": "აირჩიეთ, რისი დამატება გსურთ",
    "extrasSelected": "არჩეულია",
    "extrasLegend": "ხორცთან ერთად · სურვილისამებრ",
    "controlEyebrow": "შეკვეთა თქვენს ხელშია",
    "controlTitle": "ჯერ შევათანხმოთ, შემდეგ გამოგიგზავნოთ",
    "control1Title": "ნაჭერი და რაოდენობა",
    "control1Text": "გვითხარით, რომელი ხორცი გჭირდებათ. თუ სასურველი ნაჭერი არ არის, ალტერნატივას თქვენთან შევათანხმებთ.",
    "control2Title": "წონა და ფასი",
    "control2Text": "ფასს კილოგრამზე წინასწარ გაიგებთ. აწონვის შემდეგ საბოლოო თანხას დავაზუსტებთ.",
    "control3Title": "მიტანა და სრული თანხა",
    "control3Text": "მისამართს, მიტანის დროსა და სრულ ღირებულებას შეკვეთის დადასტურებამდე შევათანხმებთ.",
    "deliveryText": "ჩვენი კურიერები შეკვეთებს ვაკეში, საბურთალოსა და დიდ დიღომში აწვდიან. ახლომდებარე მისამართებზე მიტანა წინასწარ შეათანხმეთ.",
    "checkAddress": "მისამართის გადამოწმება",
    "b2b1Title": "სასურველი ნაჭრები",
    "b2b1Text": "თქვენი მენიუსა და მოთხოვნების მიხედვით",
    "b2b2Title": "მოცულობა და სიხშირე",
    "b2b2Text": "ერთჯერადი ან პერიოდული საჭიროება",
    "b2b3Title": "პირობები წინასწარ",
    "b2b3Text": "ფასი, გრაფიკი და პირველი მოწოდება",
    "faq4Q": "თუ ნაჭრის სახელი არ ვიცი?",
    "faq4A": "მოგვწერეთ კერძის სახელი ან მომზადების გზა და რამდენი ადამიანისთვის ამზადებთ. შესაფერისი ხორცის შერჩევაში დაგეხმარებით.",
    "faq5Q": "ხორცთან ერთად სხვა პროდუქტებიც შემიძლია შევუკვეთო?",
    "faq5A": "დიახ, შეგიძლიათ მოითხოვოთ ბოსტნეული, ხილი და კვერცხი. ხელმისაწვდომობას, რაოდენობასა და ფასს თქვენთან შევათანხმებთ.",
    "faq6Q": "საიტზე რეგისტრაცია მჭირდება?",
    "faq6A": "არა. შეგიძლიათ პირდაპირ WhatsApp-ში მოგვწეროთ. საიტზე შერჩეული დეტალები შეტყობინებაში გადავა, რომელსაც გაგზავნამდე ნახავთ.",
    "closingTitle": "დავიწყოთ თქვენი კერძით",
    "closingText": "მოგვწერეთ, რას ამზადებთ. ხორცსა და მიტანაზე ერთად შევთანხმდებით.",
    "contextLabel": "თქვენი არჩევანი",
    "clearContext": "არჩევანის გაუქმება",
    "messageCut": "სასურველი ნაჭერი",
    "messageDish": "კერძი",
    "messagePeople": "ადამიანების რაოდენობა",
    "messageExtraList": "ასევე მაინტერესებს"
  },
  "ru": {
    "skip": "Перейти к содержимому",
    "navCatalog": "Ассортимент",
    "navDelivery": "Доставка",
    "navFaq": "Вопросы",
    "location": "Доставка мяса · Тбилиси",
    "hero1": "Мясо.",
    "hero2": "Прямо к двери.",
    "heroDescription": "Домашний ужин или стол для гостей — выбирайте мясо под своё блюдо. Нужный кусок, вес и доставку согласуем в WhatsApp.",
    "orderWhatsApp": "Заказать в WhatsApp",
    "viewCatalog": "Выбрать мясо",
    "zones": "Ваке · Сабуртало · Диди Дигоми",
    "heroPhotoLabel": "Свинина и говядина",
    "catalogEyebrow": "Свинина и говядина",
    "catalogTitle": "Всё начинается с хорошего блюда",
    "catalogIntro": "Знаете, какой кусок нужен? Выберите ниже. Если ещё не определились, поможем подобрать мясо под блюдо.",
    "pork": "Свинина",
    "beef": "Говядина",
    "porkDescription": "Для жарки, тушения или запекания — напишите, какое мясо вам нужно.",
    "beefDescription": "Для домашнего ужина или особенного блюда — поможем подобрать подходящий кусок.",
    "choosePork": "Выбрать свинину",
    "chooseBeef": "Выбрать говядину",
    "catalogNote": "Наличие конкретной части и цену уточним при заказе. Фотографии иллюстративные.",
    "extrasEyebrow": "В ту же доставку",
    "extrasTitle": "Что ещё нужно домой?",
    "extrasText": "Отметьте нужные продукты. Ассортимент и цены уточним вместе с заказом мяса.",
    "extrasCta": "Уточнить выбранное",
    "deliveryEyebrow": "Тбилиси · доставка домой",
    "deliveryTitle": "Привезём в ваш район",
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
    "b2bMessage": "Здравствуйте, MeatCO! Интересуют поставки мяса для ресторана или кафе. Хочу обсудить нужные части, объёмы, цены и график поставок.",
    "navGuide": "Что приготовить",
    "navB2b": "Для бизнеса",
    "promise1Title": "Подбор под ваше блюдо",
    "promise1Text": "Расскажите, что готовите",
    "promise2Title": "Полная стоимость заранее",
    "promise2Text": "Согласуем до подтверждения",
    "promise3Title": "Доставка в ваш район",
    "promise3Text": "Ваке · Сабуртало · Диди Дигоми",
    "cutsPrompt": "Уточните нужную часть",
    "cutPorkNeck": "Шея",
    "cutPorkShoulder": "Лопатка",
    "cutPorkRibs": "Свиные рёбра",
    "cutBeefFlesh": "Мякоть",
    "cutBeefBrisket": "Грудинка",
    "cutBeefRibs": "Говяжьи рёбра",
    "guideEyebrow": "Выбор под ваше блюдо",
    "guideTitle": "Что будете готовить?",
    "guideIntro": "Начните со знакомого блюда — с выбором мяса поможем.",
    "guideOjakhuri": "Оджахури",
    "guideStew": "Чашушули",
    "guideGrill": "На мангал",
    "guideOwn": "Своё блюдо",
    "guideOjakhuriTitle": "Оджахури для домашнего стола",
    "guideOjakhuriText": "Подберём подходящую свинину. К заказу можно попросить картофель и лук — наличие уточним в переписке.",
    "guideOjakhuriNeed": "Свинина · для жарки",
    "guideStewTitle": "Мясо для чашушули",
    "guideStewText": "Скажите, что нужна говядина для тушения. Подберём подходящий кусок и обсудим количество для вашего блюда.",
    "guideStewNeed": "Говядина · для тушения",
    "guideGrillTitle": "Готовите на огне?",
    "guideGrillText": "Свинина или говядина — расскажите, как собираетесь готовить. Поможем выбрать подходящий кусок.",
    "guideGrillNeed": "Свинина или говядина · для мангала",
    "guideOwnTitle": "Ваш рецепт, ваш выбор",
    "guideOwnText": "Необязательно знать названия отрубов. Напишите, что готовите и на сколько человек, — разберёмся вместе.",
    "guideOwnNeed": "Подберём под ваше блюдо",
    "guidePeople": "На сколько человек?",
    "guideCta": "Подобрать мясо для блюда",
    "guideImageAlt": "Иллюстрация подачи оджахури с салатом и хлебом",
    "guideCaption": "Идея подачи. У MeatCO вы заказываете сырое мясо.",
    "guideHint": "Это подбор мяса, а не заказ готового блюда или фиксированного набора.",
    "peopleUnit": "человек",
    "extraVegetables": "Овощи",
    "extraFruit": "Фрукты",
    "extraEggs": "Яйца",
    "extraVegetablesText": "Для салата или гарнира",
    "extraFruitText": "К столу или на потом",
    "extraEggsText": "На завтрак и про запас",
    "extrasNone": "Выберите, что хотите добавить",
    "extrasSelected": "Выбрано",
    "extrasLegend": "Вместе с мясом · необязательно",
    "controlEyebrow": "Вы контролируете заказ",
    "controlTitle": "Сначала согласуем. Потом доставим.",
    "control1Title": "Кусок и количество",
    "control1Text": "Вы выбираете нужное мясо. Если подходящей части нет, согласуем с вами альтернативу.",
    "control2Title": "Вес и цена",
    "control2Text": "Вы заранее знаете цену за килограмм. После взвешивания уточняем итоговую сумму.",
    "control3Title": "Доставка и полный итог",
    "control3Text": "Адрес, время и полную стоимость с доставкой согласуем до подтверждения заказа.",
    "deliveryText": "Наши курьеры доставляют заказы в Ваке, Сабуртало и Диди Дигоми. Соседние адреса проверяем перед оформлением.",
    "checkAddress": "Уточнить доставку по адресу",
    "b2b1Title": "Части и требования",
    "b2b1Text": "Под ваше меню и спецификацию",
    "b2b2Title": "Объём и частота",
    "b2b2Text": "Разовая или регулярная потребность",
    "b2b3Title": "Условия заранее",
    "b2b3Text": "Цена, график и первая поставка",
    "faq4Q": "Что делать, если не знаю названия частей?",
    "faq4A": "Напишите название блюда или способ приготовления и на сколько человек готовите. Поможем подобрать подходящее мясо.",
    "faq5Q": "Можно добавить к мясу другие продукты?",
    "faq5A": "Да, можно запросить овощи, фрукты и яйца. Наличие, количество и цену согласуем с вами.",
    "faq6Q": "Нужно регистрироваться на сайте?",
    "faq6A": "Нет. Можно сразу написать в WhatsApp. Выбранные на сайте детали попадут в сообщение, которое вы увидите перед отправкой.",
    "closingTitle": "Начнём с вашего блюда",
    "closingText": "Напишите, что готовите. Мясо и доставку обсудим вместе.",
    "contextLabel": "Ваш выбор",
    "clearContext": "Сбросить выбор",
    "messageCut": "Нужная часть",
    "messageDish": "Блюдо",
    "messagePeople": "Количество человек",
    "messageExtraList": "Также интересуют"
  },
  "en": {
    "skip": "Skip to content",
    "navCatalog": "Our meat",
    "navDelivery": "Delivery",
    "navFaq": "Questions",
    "location": "Meat delivery · Tbilisi",
    "hero1": "Your meat.",
    "hero2": "At your door.",
    "heroDescription": "A family dinner or a table full of guests — choose meat for the meal you have in mind. We’ll confirm the cut, weight and delivery on WhatsApp.",
    "orderWhatsApp": "Order on WhatsApp",
    "viewCatalog": "Choose your meat",
    "zones": "Vake · Saburtalo · Didi Dighomi",
    "heroPhotoLabel": "Pork and beef",
    "catalogEyebrow": "Pork and beef",
    "catalogTitle": "Every good meal starts here",
    "catalogIntro": "Know which cut you need? Choose below. Still deciding? We’ll help you find the right meat for your dish.",
    "pork": "Pork",
    "beef": "Beef",
    "porkDescription": "For frying, slow cooking or roasting — tell us what you have in mind.",
    "beefDescription": "For a family dinner or a special meal — we’ll help you choose a suitable cut.",
    "choosePork": "Choose pork",
    "chooseBeef": "Choose beef",
    "catalogNote": "We’ll confirm the availability and price of your chosen cut when you order. Images are illustrative.",
    "extrasEyebrow": "In the same delivery",
    "extrasTitle": "What else do you need at home?",
    "extrasText": "Select a few extras. We’ll confirm the range and prices along with your meat order.",
    "extrasCta": "Ask about your selection",
    "deliveryEyebrow": "Tbilisi · delivered home",
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
    "b2bMessage": "Hello, MeatCO! I’m interested in meat supply for a restaurant or café. I’d like to discuss cuts, quantities, prices and delivery schedules.",
    "navGuide": "Meal ideas",
    "navB2b": "For businesses",
    "promise1Title": "The right cut for your meal",
    "promise1Text": "Tell us what you’re cooking",
    "promise2Title": "Know the full cost",
    "promise2Text": "Agreed before you confirm",
    "promise3Title": "Delivery to your area",
    "promise3Text": "Vake · Saburtalo · Didi Dighomi",
    "cutsPrompt": "Ask about a cut",
    "cutPorkNeck": "Neck",
    "cutPorkShoulder": "Shoulder",
    "cutPorkRibs": "Pork ribs",
    "cutBeefFlesh": "Boneless beef",
    "cutBeefBrisket": "Brisket",
    "cutBeefRibs": "Beef ribs",
    "guideEyebrow": "Choose by the meal",
    "guideTitle": "What’s cooking?",
    "guideIntro": "Start with a dish you love. We’ll help you choose the meat.",
    "guideOjakhuri": "Ojakhuri",
    "guideStew": "Chashushuli",
    "guideGrill": "For the grill",
    "guideOwn": "Your own dish",
    "guideOjakhuriTitle": "Ojakhuri for your table",
    "guideOjakhuriText": "Let’s choose pork for this comforting dish of meat and potatoes. You can ask to add potatoes and onions; we’ll confirm availability in our chat.",
    "guideOjakhuriNeed": "Pork · for pan-frying",
    "guideStewTitle": "Beef for chashushuli",
    "guideStewText": "Planning a Georgian beef stew? Tell us you need beef for slow cooking. We’ll help with the cut and quantity.",
    "guideStewNeed": "Beef · for stewing",
    "guideGrillTitle": "Fire up the grill",
    "guideGrillText": "Pork or beef? Tell us how you plan to cook it and we’ll help you choose a suitable cut.",
    "guideGrillNeed": "Pork or beef · for grilling",
    "guideOwnTitle": "Your recipe, your choice",
    "guideOwnText": "You don’t need to know the name of every cut. Tell us what you’re cooking and how many people you’re feeding.",
    "guideOwnNeed": "Let’s find a cut for your dish",
    "guidePeople": "How many people?",
    "guideCta": "Find meat for this meal",
    "guideImageAlt": "Illustrative serving suggestion of ojakhuri with salad and bread",
    "guideCaption": "Serving suggestion. MeatCO delivers raw meat.",
    "guideHint": "This helps you choose meat. It is not an order for a cooked meal or a fixed box.",
    "peopleUnit": "people",
    "extraVegetables": "Vegetables",
    "extraFruit": "Fruit",
    "extraEggs": "Eggs",
    "extraVegetablesText": "For a salad or a side",
    "extraFruitText": "For the table or later",
    "extraEggsText": "For breakfast and the fridge",
    "extrasNone": "Choose what you’d like to add",
    "extrasSelected": "Selected",
    "extrasLegend": "With your meat · optional",
    "controlEyebrow": "You’re in control of your order",
    "controlTitle": "Agreed first. Delivered next.",
    "control1Title": "Your cut and quantity",
    "control1Text": "Choose the meat you need. If a cut is unavailable, we’ll agree on an alternative with you.",
    "control2Title": "Weight and price",
    "control2Text": "You’ll know the price per kilogram upfront. We’ll confirm the final amount after weighing.",
    "control3Title": "Delivery and the full total",
    "control3Text": "We’ll agree on the address, delivery time and full cost before you confirm your order.",
    "deliveryText": "Our couriers deliver in Vake, Saburtalo and Didi Dighomi. We’ll check nearby addresses before confirming an order.",
    "checkAddress": "Check your delivery address",
    "b2b1Title": "Cuts and specifications",
    "b2b1Text": "To suit your menu and requirements",
    "b2b2Title": "Quantity and frequency",
    "b2b2Text": "One-off or ongoing requirements",
    "b2b3Title": "Clear terms",
    "b2b3Text": "Prices, schedule and the first delivery",
    "faq4Q": "What if I don’t know the name of the cut?",
    "faq4A": "Tell us the dish or cooking method, and how many people you’re feeding. We’ll help you choose suitable meat.",
    "faq5Q": "Can I add other groceries?",
    "faq5A": "Yes. You can ask for vegetables, fruit and eggs. We’ll agree on availability, quantities and prices with you.",
    "faq6Q": "Do I need an account?",
    "faq6A": "No. You can message us directly on WhatsApp. Any details you select on the site will be included in a message you can review before sending.",
    "closingTitle": "Let’s start with your meal",
    "closingText": "Tell us what you’re cooking. We’ll work out the meat and delivery together.",
    "contextLabel": "Your selection",
    "clearContext": "Clear selection",
    "messageCut": "Preferred cut",
    "messageDish": "Dish",
    "messagePeople": "Number of people",
    "messageExtraList": "Also interested in"
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
let guideChoice = 'ojakhuri';
let context = {cut:'',dish:'',people:''};
const guideMeta = {ojakhuri:['Ojakhuri','pork'],stew:['Stew','beef'],grill:['Grill','any'],own:['Own','any']};
const extraKeys = {vegetables:'extraVegetables',fruit:'extraFruit',eggs:'extraEggs'};
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
 if (context.cut) lines.push(text('messageCut') + ': ' + text(context.cut));
 if (context.dish) lines.push(text('messageDish') + ': ' + text('guide'+guideMeta[context.dish][0]));
 if (context.people) lines.push(text('messagePeople') + ': ' + context.people);
 const extra = chosenExtras();
 if (extra.length) lines.push(text('messageExtraList') + ': ' + extra.map(k=>text(extraKeys[k])).join(', '));
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
 renderGuide(); renderExtras(); renderContext();
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
 context = {cut:button.dataset.cut || '',dish:button.dataset.dish || '',people:button.dataset.dish ? document.getElementById('guide-people').value : ''};
 if (button.dataset.district) district.value = button.dataset.district;
 renderContext();
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
form.addEventListener('change',event => {
 if (event.target.name === 'meat') { context = {cut:'',dish:'',people:''}; renderContext(); }
 renderExtras(); updatePreview();
});
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

function chosenExtras() { return [...form.querySelectorAll('input[name="extra"]:checked')].map(input=>input.value); }
function renderExtras() {
 const selected = chosenExtras();
 for (const button of document.querySelectorAll('[data-extra-choice]')) {
  const active = selected.includes(button.dataset.extraChoice);
  button.setAttribute('aria-pressed',String(active));
  button.querySelector('.extra-checkmark').textContent = active ? '✓' : '+';
 }
 document.getElementById('extras-summary').textContent = selected.length ? text('extrasSelected') + ': ' + selected.map(k=>text(extraKeys[k])).join(', ') : text('extrasNone');
}
function renderGuide() {
 const [key,category] = guideMeta[guideChoice];
 for (const tab of document.querySelectorAll('[data-guide]')) {
  const active = tab.dataset.guide === guideChoice;
  tab.setAttribute('aria-selected',String(active)); tab.tabIndex = active ? 0 : -1;
 }
 document.getElementById('guide-panel').setAttribute('aria-labelledby','tab-'+guideChoice);
 document.getElementById('guide-need').textContent = text('guide'+key+'Need');
 document.getElementById('guide-dish-title').textContent = text('guide'+key+'Title');
 document.getElementById('guide-dish-text').textContent = text('guide'+key+'Text');
 const order = document.getElementById('guide-order'); order.dataset.order = category; order.dataset.dish = guideChoice;
}
function renderContext() {
 const parts = [];
 if (context.cut) parts.push(text(context.cut));
 if (context.dish) parts.push(text('guide'+guideMeta[context.dish][0]));
 if (context.people) parts.push(context.people+' '+text('peopleUnit'));
 document.getElementById('order-context').hidden = !parts.length;
 document.getElementById('order-context-text').textContent = text('contextLabel')+': '+parts.join(' · ');
}
for (const tab of document.querySelectorAll('[data-guide]')) {
 tab.addEventListener('click',()=>{guideChoice=tab.dataset.guide;renderGuide();});
 tab.addEventListener('keydown',event=>{
  const tabs=[...document.querySelectorAll('[data-guide]')]; let next=tabs.indexOf(tab);
  if(event.key==='ArrowRight') next=(next+1)%tabs.length;
  else if(event.key==='ArrowLeft') next=(next+tabs.length-1)%tabs.length;
  else if(event.key==='Home') next=0;
  else if(event.key==='End') next=tabs.length-1;
  else return;
  event.preventDefault(); guideChoice=tabs[next].dataset.guide;renderGuide();tabs[next].focus();
 });
}
for (const button of document.querySelectorAll('[data-extra-choice]')) button.addEventListener('click',()=>{
 const input=form.querySelector('input[name="extra"][value="'+button.dataset.extraChoice+'"]');
 input.checked=!input.checked;renderExtras();updatePreview();
});
document.getElementById('clear-context').addEventListener('click',()=>{context={cut:'',dish:'',people:''};renderContext();updatePreview();});


let initial = config.defaultLanguage || 'ka';
try { const saved = localStorage.getItem('meatco:language'); if (supported.includes(saved)) initial = saved; } catch {}
const requested = new URLSearchParams(location.search).get('lang');
if (supported.includes(requested)) initial = requested;
setLanguage(initial,false);
document.getElementById('year').textContent = String(new Date().getFullYear());
})();
