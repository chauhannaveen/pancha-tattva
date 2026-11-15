/* All wording on the site lives here: elements, hints, wisdom cards and mixer results,
   in English first and then in Hindi (the HI block near the end). Edit this file to correct text. */

/* ---------------------------------------------------------------- data */
const T=[
 {k:'ORIGIN',d:'पञ्च तत्त्व',c:'#b98cff',f:68},
 {k:'PRITHVI',e:'Earth',d:'पृथ्वी',c:'#e9b872',f:98.0,
  l:'The first stillness. Mountain, bone and seed — the ground that holds every other thing and asks for nothing.',
  m:[['CHAKRA','Muladhara'],['BIJA','LAM'],['SENSE','Smell'],['ESSENCE','Stability']]},
 {k:'JALA',e:'Water',d:'जल',c:'#ff9b6a',f:110.0,
  l:'What cannot be broken because it never resists. The ocean remembers every river and keeps none of their names.',
  m:[['CHAKRA','Svadhisthana'],['BIJA','VAM'],['SENSE','Taste'],['ESSENCE','Flow']]},
 {k:'AGNI',e:'Fire',d:'अग्नि',c:'#ffb13d',f:123.5,
  l:'The mouth of the gods. It takes what is offered and returns it as light, as heat, as ash — transformed, never lost.',
  m:[['CHAKRA','Manipura'],['BIJA','RAM'],['SENSE','Sight'],['ESSENCE','Transformation']]},
 {k:'VAYU',e:'Air',d:'वायु',c:'#bfe4ff',f:130.8,
  l:'Unseen and everywhere. The breath that moves through ten thousand lungs and belongs to no one.',
  m:[['CHAKRA','Anahata'],['BIJA','YAM'],['SENSE','Touch'],['ESSENCE','Movement']]},
 {k:'AKASHA',e:'Ether',d:'आकाश',c:'#9aa8ff',f:146.8,
  l:'The space in which everything happens. Older than the stars it carries, and the silence beneath all sound.',
  m:[['CHAKRA','Vishuddha'],['BIJA','HAM'],['SENSE','Sound'],['ESSENCE','Space']]},
 {k:'JYOTI',e:'Inner Light',d:'ज्योति',c:'#6dffb4',f:164.8,cnt:'BEYOND THE ELEMENTS · MIND',
  l:'The inner flame that needs no fuel. Where seeing ends, insight begins — a curtain of radiance across the dark.',
  m:[['CHAKRA','Ajna'],['BIJA','OM'],['FACULTY','Manas · Mind'],['ESSENCE','Insight']]},
 {k:'CHETANA',e:'Consciousness',d:'चेतना',c:'#ffd98a',f:174.6,cnt:'BEYOND THE ELEMENTS · AWARENESS',
  l:'The thousand-petalled lotus. Not an element among elements, but the one that knows them all. You were always here.',
  m:[['CHAKRA','Sahasrara'],['BIJA','Silence'],['SENSE','Beyond'],['ESSENCE','Awareness']]},
 {k:'EKAM',e:'The One',d:'एकम्',c:'#ffe2b0',f:136.1,cnt:'ALL BECOME ONE',
  l:'Ekam sat — truth is one. Five elements, the mind that lights them and the one who sees: never separate things. One thing, seen many ways.',
  m:[['MANTRA','Ekam Sat'],['SOURCE','Rig Veda 1.164.46'],['ESSENCE','Unity']]},
 {k:'SANGAM',e:'Confluence',d:'संगम',c:'#ffffff',f:136.1,l:'',m:[]}
];
const TIP=['','MOVE TO SWING THE SUN','MOVE TO SEND RIPPLES','MOVE TO RAISE THE FLAME','MOVE TO PART THE CLOUDS','MOVE TO BEND SPACE',
 'MOVE TO CALL THE AURORA','MOVE TO CARRY THE LOTUS','MOVE TO STEER THE SUNRISE',''];
// per element: from the texts, worth knowing, a practice
const KN=[
 ['Samkhya, one of India’s oldest philosophies, counts 25 tattvas, the principles of reality. The five great elements, the pancha mahabhuta, are the last and most tangible of them.',
  'The Taittiriya Upanishad (2.1) gives the order of creation: from the Self came space, from space air, from air fire, from fire water, from water earth. This journey follows those five, then climbs to the two highest chakras, the mind and pure consciousness, which tradition places beyond the elements.',
  'Before you begin, take three slow breaths and simply notice that you are here.'],
 ['The Atharva Veda’s Prithvi Sukta (12.1) is a 63-verse hymn to the Earth. Its best-known line: “Mata bhumih putro aham prithivyah” — Earth is my mother, I am her child.',
  'In Samkhya, earth is the only element that carries all five qualities: sound, touch, form, taste and smell. Each subtler element has one fewer.',
  'Grounding. Sit or stand. Feel the weight of your body pressing down and the ground pressing back. Stay with that contact for ten breaths.'],
 ['The Rig Veda (10.9) praises the waters, Apah, as healers: “Apo hi shtha mayobhuvah” — waters, you are the source of comfort.',
  'About 60% of an adult human body is water. Ayurveda links jala to taste, the tongue and every fluid in the body.',
  'Flow. Breathe in for four counts and out for six. Let each exhale draw back like a wave leaving the shore. Twelve rounds.'],
 ['“Agni” is the first word of the Rig Veda. Around 200 of its 1,028 hymns are addressed to him, more than to any god except Indra.',
  'Ayurveda calls digestion jatharagni, the fire in the belly. It uses the same word, agni, as the flame on the altar.',
  'Trataka. Set a candle at eye level, an arm’s length away. Gaze at the flame steadily, then close your eyes and hold the afterimage until it fades.'],
 ['The Prashna Upanishad tells how the senses argued over who was greatest. Then Prana, the breath, began to leave, and all of them were pulled out with it.',
  'Yoga names five winds in the body: prana, apana, samana, udana and vyana. A resting adult breathes about 20,000 times a day.',
  'Nadi Shodhana. Close the right nostril and inhale left. Close the left, exhale right. Inhale right, exhale left. That is one round; do nine.'],
 ['The Chandogya Upanishad (8.1) says the space within the heart is as vast as the space outside. Heaven and earth are both contained in it.',
  'Akasha’s quality is sound, the one sensation the ancient thinkers tied to space itself. It is the first element to appear and the last to dissolve.',
  'Listening. Close your eyes and find the farthest sound you can hear. Then the nearest. Then rest in the silence between sounds.'],
 ['“Tamaso ma jyotir gamaya” — lead me from darkness to light. The line is from the Brihadaranyaka Upanishad (1.3.28), composed more than 2,500 years ago.',
  'The Gayatri mantra (Rig Veda 3.62.10) asks the light of the sun to illuminate the mind. It has been recited at dawn for some three thousand years.',
  'Inner light. Close your eyes and rest attention between the eyebrows. Picture a small, steady flame there. Stay for five minutes.'],
 ['The Mandukya Upanishad, only 12 verses long, maps consciousness as waking, dream and deep sleep, and then turiya, “the fourth”, the awareness that witnesses all three.',
  '“Prajnanam Brahma” — consciousness is the ultimate reality — is one of the four Mahavakyas, the great sayings. It comes from the Aitareya Upanishad.',
  'Witness. Let thoughts come without following or pushing them. Each time, ask quietly “who is aware of this?” and rest in the one who notices.'],
 ['“Ekam sat vipra bahudha vadanti” — truth is one; the wise call it by many names. Rig Veda 1.164.46.',
  'The Rig Veda is among the oldest sacred texts still in use. It was carried for centuries by exact oral recitation before being widely written down.',
  'Goodwill. Repeat silently “Lokah samastah sukhino bhavantu” — may all beings everywhere be happy — widening the circle each time.'],
 ['Ayurveda’s three doshas are pairs of elements: Vata is space and air, Pitta is fire and water, Kapha is water and earth.',
  'Vedanta’s doctrine of panchikarana says nothing in the world is a pure element. Each one is half itself and one-eighth of each of the other four.',
  'Notice the elements in you now: the weight of bone, the moisture of breath, the warmth of skin, the air moving, and the space that holds it all.']
];

/* ---------------------------------------------------- sangam: the mixer */
// deva, name, meaning, line, dark, mid, bright, [flow, veins, rain, sparks], [lightning, swirl, scale, rings], rainbow
const MIX={
 '12':['कर्दम','Kardama','Fertile Clay','Where river meets soil, the first green thing decides to live.','#1a1206','#3d5a1e','#9fd06a',[.15,.55,0,0],[0,.2,1.6,0],0],
 '13':['लावा','Lava','Molten Stone','The mountain remembers that it was once a river of fire.','#0a0403','#7a1204','#ffb02e',[.12,1,0,.5],[0,0,1.5,0],0],
 '14':['धूलि','Dhuli','Dust','The ground learns to fly, and every horizon turns to gold.','#2a1c10','#a8793f','#f1d6a0',[.5,0,0,.5],[0,0,1.2,0],0],
 '15':['ग्रह','Graha','Worlds','Stone set adrift in emptiness becomes a planet.','#02030a','#3a2f55','#d9c7a0',[.03,.3,0,1],[0,1,1,.6],0],
 '16':['रत्न','Ratna','Gem','Pressure and patience teach the dark rock to hold light.','#05020f','#1c6fd0','#e8fbff',[.05,1,0,.8],[0,.6,2.4,0],0],
 '17':['देह','Deha','Body','Clay that looks back at you. Earth, briefly awake.','#120505','#8a2b2b','#ffc9a8',[.1,.8,0,0],[0,.3,1.3,1],0],
 '23':['बाष्प','Bashpa','Steam','Neither will yield, so both rise together as cloud.','#0b0d12','#6c7a89','#f4f7fa',[.7,0,0,.15],[0,.1,1.1,0],0],
 '24':['झंझा','Jhanjha','Storm','The sea climbs into the sky and comes back down as thunder.','#04070d','#22344d','#cfe6ff',[.25,0,1,0],[1,.2,1,0],0],
 '25':['हिम','Hima','Ice','Water, given enough silence, becomes glass.','#020814','#2a6f9e','#eaf8ff',[.03,1,0,.9],[0,.2,2,0],0],
 '26':['इन्द्रधनुष','Indradhanush','Rainbow','One white ray enters a raindrop and leaves as seven.','#0a1626','#3b79b8','#dff1ff',[.3,0,.5,0],[0,0,1,0],1],
 '27':['भाव','Bhava','Feeling','The tide inside the chest that no moon explains.','#0a0418','#5a2a8a','#ff9ad5',[.1,0,0,.2],[0,.8,1,.8],0],
 '34':['विद्युत्','Vidyut','Lightning','Fire that has learned to travel through the wind.','#05030a','#3b2a6b','#fff2c9',[.3,0,0,.3],[1.6,.1,1,0],0],
 '35':['तारा','Tara','Star','A fire with nothing around it to burn but itself.','#020208','#b3480a','#fff3d0',[0,.2,0,1],[0,1.2,1,1],0],
 '36':['सूर्य','Surya','Sun','The flame that every other light is borrowed from.','#1a0500','#ff7a00','#fffbe0',[.2,.35,0,.3],[0,.5,1.8,.6],0],
 '37':['तपस्','Tapas','Inner Fire','The heat of a mind that refuses to look away.','#0d0202','#c2410c','#ffe9a8',[.5,.2,0,.8],[0,0,1,.9],0],
 '45':['नाद','Nada','Sound','Space trembles, air carries it, and the universe hears itself.','#03040c','#28407a','#bcd4ff',[0,0,0,.2],[0,0,.8,2.2],0],
 '46':['उषा','Usha','Dawn','The sky blushes before it remembers how to be blue.','#1b1030','#e0708a','#ffe6b8',[.08,0,0,0],[0,.1,.7,0],0],
 '47':['प्राण','Prana','Life Breath','The wind that knows your name.','#02100c','#1f8a6a','#d6fff0',[.25,.5,0,.5],[0,.9,1.1,.8],0],
 '56':['ब्रह्माण्ड','Brahmanda','Cosmos','Emptiness, lit from within, becomes everything.','#020108','#5b2a9a','#9ff0ff',[.04,.15,0,1],[0,1.4,1.2,.3],0],
 '57':['स्वप्न','Svapna','Dream','A whole world built from nothing, every night.','#07021a','#6a3fb0','#ffc6f2',[.06,0,0,.5],[0,1.6,.9,.5],0],
 '67':['बोध','Bodha','Awakening','The light sees itself, and there is no one left to be in the dark.','#1a1405','#e0b040','#ffffff',[.03,.6,0,.4],[0,1,1.6,1.5],0]
};

/* ------------------------------------------------------------ language */
// The address (?lang=hi) wins, then the visitor's saved choice, then the browser's own language.
const LANG=(()=>{let l=new URLSearchParams(location.search).get('lang');try{l=l||localStorage.getItem('pt-lang');}catch(e){}
  l=l||((navigator.language||'').toLowerCase().startsWith('hi')?'hi':'en');return l==='hi'?'hi':'en';})();

// Short interface wording that the scripts put on screen, in both languages.
const UI={
 en:{other:'हिन्दी',loc:'en-GB',tattva:'TATTVA',again:'↺ RETURN TO SOURCE',cap2:'⤓ CAPTURE THIS VIEW',
  mixHead:'SANGAM · CHOOSE ANY TWO',mixTip:'21 COMBINATIONS · MOVE TO STIR',noGl:'WEBGL IS NOT AVAILABLE IN THIS BROWSER',
  journey:'▶ JOURNEY',pause:'❚❚ PAUSE',resume:'▶ RESUME JOURNEY',play:'▶ PLAY JOURNEY',
  pure:'PRESS H TO BRING THE INTERFACE BACK',noFs:'FULLSCREEN IS NOT AVAILABLE HERE',
  dhyana:'◉ DHYANA',ret:'◉ RETURN',follow:'FOLLOW THE CIRCLE WITH YOUR BREATH',breath:['BREATHE IN','HOLD','BREATHE OUT'],
  sound:'♪ SOUND',mute:'♪ MUTE',tod:['LIVE','DAWN','NOON','DUSK','NIGHT'],todIs:'TIME OF DAY · ',todLive:'TIME OF DAY · FOLLOWING YOUR CLOCK',
  tdb:"TODAY'S PRACTICE",tdbStreak:n=>"TODAY'S PRACTICE · "+n+'-DAY STREAK',tdbDone:n=>'✓ PRACTISED TODAY · '+n+'-DAY STREAK',
  wd:['S','M','T','W','T','F','S'],prDone:'PRACTICE COMPLETE',prToday:'TODAY · ',
  wellDone:t=>'Well done. Tomorrow’s practice is '+t.k[0]+t.k.slice(1).toLowerCase()+'.',
  min:'MIN',prAgain:'PRACTISE AGAIN',prBegin:'BEGIN PRACTICE',
  stats:(n,s,m)=>n+'-DAY STREAK · '+s+' SESSION'+(s===1?'':'S')+' · '+m+' MIN',saved:'SAVED ON THIS DEVICE ONLY',
  early:'SESSION ENDED EARLY · NOT COUNTED',imgSaved:'IMAGE SAVED · ',
  share:'SHARE',shareText:'The five elements, rendered live in your browser.',copied:'LINK COPIED',noCopy:'COULD NOT COPY THE LINK',
  abHead:'ABOUT',abSrc:'PROJECT PAGE · SOURCE CODE',abBy:'BUILT WITH CLAUDE',abP:[
   'A journey through the five great elements of Indian thought — earth, water, fire, air and ether — and the mind and consciousness that tradition places beyond them.',
   'Every scene is drawn live by your device’s graphics chip, many times a second. There are no photographs and no video: the mountains, ocean, flames and stars are all mathematics.',
   'The quotations are from the Vedas and Upanishads, with references beside each. If you spot an error, please report it on the project page.',
   'Your practice streak stays on this device only. It is not sent anywhere.']},
 hi:{other:'ENGLISH',loc:'hi-IN',tattva:'तत्त्व',again:'↺ स्रोत पर लौटें',cap2:'⤓ यह दृश्य सहेजें',
  mixHead:'संगम · कोई दो चुनें',mixTip:'21 संयोग · हाथ घुमाकर मथें',noGl:'इस ब्राउज़र में WEBGL उपलब्ध नहीं है',
  journey:'▶ यात्रा',pause:'❚❚ रोकें',resume:'▶ यात्रा जारी रखें',play:'▶ यात्रा चलाएँ',
  pure:'इंटरफ़ेस वापस लाने के लिए H दबाएँ',noFs:'यहाँ फ़ुलस्क्रीन उपलब्ध नहीं है',
  dhyana:'◉ ध्यान',ret:'◉ लौटें',follow:'वृत्त के साथ साँस लें',breath:['साँस लें','रोकें','साँस छोड़ें'],
  sound:'♪ ध्वनि',mute:'♪ मौन',tod:['अभी','भोर','दोपहर','संध्या','रात'],todIs:'समय · ',todLive:'समय · आपकी घड़ी के अनुसार',
  tdb:'आज का अभ्यास',tdbStreak:n=>'आज का अभ्यास · लगातार '+n+' दिन',tdbDone:n=>'✓ आज का अभ्यास पूर्ण · लगातार '+n+' दिन',
  wd:['र','सो','मं','बु','गु','शु','श'],prDone:'अभ्यास पूर्ण',prToday:'आज · ',
  wellDone:t=>'बहुत अच्छे। कल का अभ्यास है '+t.d+'।',
  min:'मिनट',prAgain:'फिर अभ्यास करें',prBegin:'अभ्यास आरंभ करें',
  stats:(n,s,m)=>'लगातार '+n+' दिन · '+s+' सत्र · '+m+' मिनट',saved:'केवल इसी डिवाइस पर सुरक्षित',
  early:'सत्र बीच में रुका · गिना नहीं गया',imgSaved:'चित्र सहेजा गया · ',
  share:'साझा करें',shareText:'पाँच तत्त्व, आपके ब्राउज़र में जीवंत।',copied:'लिंक कॉपी हो गया',noCopy:'लिंक कॉपी नहीं हो सका',
  abHead:'परिचय',abSrc:'प्रोजेक्ट पृष्ठ · सोर्स कोड',abBy:'CLAUDE की सहायता से निर्मित',abP:[
   'भारतीय चिंतन के पाँच महाभूतों — पृथ्वी, जल, अग्नि, वायु और आकाश — और उनसे परे माने गए मन तथा चेतना की एक यात्रा।',
   'हर दृश्य आपके उपकरण की ग्राफ़िक्स चिप उसी क्षण रचती है, प्रति सेकंड कई बार। यहाँ कोई तस्वीर या वीडियो नहीं है: पर्वत, सागर, ज्वाला और तारे — सब गणित हैं।',
   'उद्धरण वेदों और उपनिषदों से हैं, और संदर्भ उनके साथ दिए गए हैं। कोई त्रुटि दिखे तो कृपया प्रोजेक्ट पृष्ठ पर बताएँ।',
   'आपका अभ्यास-क्रम केवल इसी डिवाइस पर रहता है। इसे कहीं भेजा नहीं जाता।']}
};
const S=UI[LANG];

/* --------------------------------------------------------------- hindi */
// Same order as the English above. Sanskrit names, colours and scene settings are shared; only the wording differs.
const HI={
 title:'पञ्च तत्त्व — पाँच तत्त्व',
 // wording that sits in index.html, by CSS selector
 html:{'#load span':'तत्त्व जाग रहे हैं','#td':'☀ आज','#auto':'▶ यात्रा','#dh':'◉ ध्यान','#kn':'❋ ज्ञान','#cap':'⤓ चित्र','#fs':'⛶ पूर्ण','#snd':'♪ ध्वनि',
  '#hint':'स्क्रॉल करें','#btxt':'साँस लें','#jno':'❋ ज्ञान','#jn div:nth-of-type(1) small':'ग्रंथों से','#jn div:nth-of-type(2) small':'जानने योग्य',
  '#jn div:nth-of-type(3) small':'अभ्यास',
  '#keys':'हाथ घुमाएँ · मथें &nbsp;&nbsp; क्लिक · लहर &nbsp;&nbsp; D · ध्यान &nbsp;&nbsp; K · ज्ञान &nbsp;&nbsp; P · अभ्यास &nbsp;&nbsp; L · समय &nbsp;&nbsp; H · इंटरफ़ेस छिपाएँ &nbsp;&nbsp; F · फ़ुलस्क्रीन &nbsp;&nbsp; C · चित्र &nbsp;&nbsp; ← → · यात्रा',
  '.hero .count':'पाँच तत्त्व · और उनसे परे दो',
  '.hero .line':'जो कुछ है, था या होगा, वह पाँच तत्त्वों से बुना है। उनके परे हैं देखने वाला मन और जानने वाली चेतना।',
  '#begin':'यात्रा आरंभ करें','#ab span':' परिचय'},
 T:[
  {},
  {e:'धरती',l:'पहली स्थिरता। पर्वत, अस्थि और बीज — वह धरा जो सबको धारण करती है और बदले में कुछ नहीं माँगती।',
   m:[['चक्र','मूलाधार'],['बीज','लं'],['इंद्रिय','गंध'],['सार','स्थिरता']]},
  {e:'पानी',l:'जिसे तोड़ा नहीं जा सकता, क्योंकि वह कभी प्रतिरोध नहीं करता। सागर हर नदी को याद रखता है, पर किसी का नाम नहीं रखता।',
   m:[['चक्र','स्वाधिष्ठान'],['बीज','वं'],['इंद्रिय','स्वाद'],['सार','प्रवाह']]},
  {e:'आग',l:'देवताओं का मुख। जो अर्पित किया जाए उसे ग्रहण कर प्रकाश, ताप और भस्म बनाकर लौटा देती है — रूप बदलता है, कुछ खोता नहीं।',
   m:[['चक्र','मणिपूर'],['बीज','रं'],['इंद्रिय','दृष्टि'],['सार','रूपांतरण']]},
  {e:'हवा',l:'अदृश्य, फिर भी सर्वत्र। वह श्वास जो दस हज़ार फेफड़ों से गुज़रती है और किसी की नहीं होती।',
   m:[['चक्र','अनाहत'],['बीज','यं'],['इंद्रिय','स्पर्श'],['सार','गति']]},
  {e:'अंतरिक्ष',l:'वह अवकाश जिसमें सब कुछ घटता है। जिन तारों को यह धारण करता है उनसे भी पुराना, और हर ध्वनि के नीचे का मौन।',
   m:[['चक्र','विशुद्ध'],['बीज','हं'],['इंद्रिय','शब्द'],['सार','अवकाश']]},
  {e:'अंतर्ज्योति',cnt:'तत्त्वों से परे · मन',
   l:'भीतर की वह लौ जिसे ईंधन नहीं चाहिए। जहाँ देखना समाप्त होता है, वहाँ अंतर्दृष्टि आरंभ होती है — अँधेरे पर फैला प्रकाश का परदा।',
   m:[['चक्र','आज्ञा'],['बीज','ॐ'],['शक्ति','मनस् · मन'],['सार','अंतर्दृष्टि']]},
  {e:'चैतन्य',cnt:'तत्त्वों से परे · चैतन्य',
   l:'सहस्रदल कमल। तत्त्वों में एक तत्त्व नहीं, बल्कि वह जो उन सबको जानता है। आप सदा यहीं थे।',
   m:[['चक्र','सहस्रार'],['बीज','मौन'],['इंद्रिय','इंद्रियातीत'],['सार','बोध']]},
  {e:'एक',cnt:'सब एक हो जाते हैं',
   l:'एकं सत् — सत्य एक है। पाँच तत्त्व, उन्हें प्रकाशित करने वाला मन और देखने वाला द्रष्टा: ये कभी अलग नहीं थे। एक ही है, अनेक रूपों में देखा गया।',
   m:[['मंत्र','एकं सत्'],['स्रोत','ऋग्वेद 1.164.46'],['सार','एकत्व']]},
  {e:'मिलन'}
 ],
 TIP:['','हाथ घुमाएँ · सूर्य डोलेगा','हाथ घुमाएँ · लहरें उठेंगी','हाथ घुमाएँ · ज्वाला उठेगी','हाथ घुमाएँ · बादल छँटेंगे','हाथ घुमाएँ · अंतरिक्ष मुड़ेगा',
  'हाथ घुमाएँ · ध्रुवीय ज्योति जागेगी','हाथ घुमाएँ · कमल साथ चलेगा','हाथ घुमाएँ · सूर्योदय मुड़ेगा',''],
 KN:[
  ['सांख्य, भारत के प्राचीनतम दर्शनों में से एक, 25 तत्त्व गिनता है — सृष्टि के मूल सिद्धांत। पंच महाभूत उनमें अंतिम और सबसे स्थूल हैं।',
   'तैत्तिरीय उपनिषद् (2.1) सृष्टि का क्रम बताता है: आत्मा से आकाश, आकाश से वायु, वायु से अग्नि, अग्नि से जल, जल से पृथ्वी। यह यात्रा इन्हीं पाँचों से गुज़रती है, फिर दो सर्वोच्च चक्रों — मन और शुद्ध चेतना — तक चढ़ती है, जिन्हें परंपरा तत्त्वों से परे मानती है।',
   'आरंभ से पहले तीन धीमी साँसें लें और बस यह अनुभव करें कि आप यहाँ हैं।'],
  ['अथर्ववेद का पृथ्वी सूक्त (12.1) धरती की 63 मंत्रों की स्तुति है। उसकी सबसे प्रसिद्ध पंक्ति: “माता भूमिः पुत्रोऽहं पृथिव्याः” — भूमि मेरी माता है, मैं उसकी संतान हूँ।',
   'सांख्य के अनुसार पृथ्वी अकेला तत्त्व है जिसमें पाँचों गुण हैं: शब्द, स्पर्श, रूप, रस और गंध। हर सूक्ष्मतर तत्त्व में एक गुण कम होता जाता है।',
   'स्थिरता। बैठें या खड़े हों। अपने शरीर का भार नीचे जाता और धरती का सहारा ऊपर आता अनुभव करें। दस साँसों तक इसी स्पर्श पर टिके रहें।'],
  ['ऋग्वेद (10.9) जल, आपः, की आरोग्यदाता के रूप में स्तुति करता है: “आपो हि ष्ठा मयोभुवः” — हे जल, तुम सुख के स्रोत हो।',
   'वयस्क मानव शरीर का लगभग 60% भाग जल है। आयुर्वेद जल को रस, जिह्वा और शरीर के हर द्रव से जोड़ता है।',
   'प्रवाह। चार गिनती में साँस लें, छह में छोड़ें। हर बार छोड़ी हुई साँस को किनारे से लौटती लहर की तरह जाने दें। बारह बार।'],
  ['“अग्नि” ऋग्वेद का पहला शब्द है। उसके 1,028 सूक्तों में से लगभग 200 अग्नि को संबोधित हैं — इंद्र को छोड़ किसी भी देवता से अधिक।',
   'आयुर्वेद पाचन को जठराग्नि कहता है, उदर की अग्नि। शब्द वही है जो यज्ञवेदी की ज्वाला के लिए है: अग्नि।',
   'त्राटक। एक दीपक आँखों की ऊँचाई पर, हाथ भर की दूरी पर रखें। लौ को स्थिर दृष्टि से देखें, फिर आँखें मूँदकर उसकी छवि को मिटने तक थामे रहें।'],
  ['प्रश्न उपनिषद् कहता है कि इंद्रियों में विवाद हुआ कि कौन श्रेष्ठ है। तब प्राण निकलने लगा, और सब उसके साथ खिंचने लगीं।',
   'योग शरीर में पाँच वायु बताता है: प्राण, अपान, समान, उदान और व्यान। विश्राम में एक वयस्क दिन में लगभग 20,000 बार साँस लेता है।',
   'नाड़ी शोधन। दायाँ नथुना बंद कर बाएँ से साँस लें। बायाँ बंद कर दाएँ से छोड़ें। दाएँ से लें, बाएँ से छोड़ें। यह एक चक्र हुआ; नौ करें।'],
  ['छांदोग्य उपनिषद् (8.1) कहता है कि हृदय के भीतर का आकाश उतना ही विशाल है जितना बाहर का। द्युलोक और पृथ्वी दोनों उसी में समाए हैं।',
   'आकाश का गुण शब्द है — वह एकमात्र अनुभूति जिसे प्राचीन चिंतकों ने स्वयं अवकाश से जोड़ा। यह सबसे पहले प्रकट होता है और सबसे अंत में विलीन।',
   'श्रवण। आँखें बंद करें और सबसे दूर की ध्वनि खोजें। फिर सबसे पास की। फिर ध्वनियों के बीच के मौन में ठहरें।'],
  ['“तमसो मा ज्योतिर्गमय” — मुझे अंधकार से प्रकाश की ओर ले चलो। यह पंक्ति बृहदारण्यक उपनिषद् (1.3.28) की है, जो 2,500 वर्ष से भी पहले रचा गया।',
   'गायत्री मंत्र (ऋग्वेद 3.62.10) सूर्य के तेज से बुद्धि को प्रकाशित करने की प्रार्थना है। यह लगभग तीन हज़ार वर्षों से भोर में जपा जाता रहा है।',
   'अंतर्ज्योति। आँखें बंद कर ध्यान भौंहों के बीच टिकाएँ। वहाँ एक छोटी, स्थिर लौ की कल्पना करें। पाँच मिनट ठहरें।'],
  ['केवल 12 मंत्रों का मांडूक्य उपनिषद् चेतना की अवस्थाएँ बताता है — जाग्रत, स्वप्न, सुषुप्ति, और फिर तुरीय, “चौथी”: वह साक्षी जो तीनों को देखता है।',
   '“प्रज्ञानं ब्रह्म” — चेतना ही परम सत्य है — चार महावाक्यों में से एक है। यह ऐतरेय उपनिषद् से है।',
   'साक्षी। विचारों को आने दें — न उनके पीछे जाएँ, न उन्हें हटाएँ। हर बार धीरे से पूछें “इसे कौन जान रहा है?” और उसी जानने वाले में ठहर जाएँ।'],
  ['“एकं सद् विप्रा बहुधा वदन्ति” — सत्य एक है; ज्ञानी उसे अनेक नामों से पुकारते हैं। ऋग्वेद 1.164.46।',
   'ऋग्वेद उन प्राचीनतम पवित्र ग्रंथों में है जो आज भी प्रयोग में हैं। व्यापक रूप से लिखे जाने से पहले यह सदियों तक शुद्ध मौखिक पाठ से सुरक्षित रहा।',
   'मैत्री। मन में दोहराएँ “लोकाः समस्ताः सुखिनो भवन्तु” — सभी लोकों के सभी प्राणी सुखी हों — और हर बार यह घेरा बड़ा करते जाएँ।'],
  ['आयुर्वेद के तीन दोष तत्त्वों के जोड़े हैं: वात आकाश और वायु है, पित्त अग्नि और जल, कफ जल और पृथ्वी।',
   'वेदांत का पंचीकरण सिद्धांत कहता है कि संसार में कोई भी तत्त्व शुद्ध नहीं। हर एक आधा स्वयं है और शेष चारों का आठवाँ-आठवाँ भाग।',
   'अभी अपने भीतर के तत्त्वों को देखें: अस्थियों का भार, साँस की नमी, त्वचा की ऊष्मा, चलती हुई वायु, और वह अवकाश जो इन सबको थामे है।']
 ],
 // mixer: meaning, line
 MIX:{
  '12':['उपजाऊ मिट्टी','जहाँ नदी मिट्टी से मिलती है, वहाँ पहला हरा अंकुर जीने का निश्चय करता है।'],
  '13':['पिघली शिला','पर्वत को याद है कि वह कभी आग की नदी था।'],
  '14':['धूल','धरती उड़ना सीखती है, और हर क्षितिज सुनहरा हो जाता है।'],
  '15':['लोक','शून्य में बहता पत्थर ग्रह बन जाता है।'],
  '16':['मणि','दबाव और धैर्य काली चट्टान को प्रकाश धारण करना सिखाते हैं।'],
  '17':['शरीर','वह मिट्टी जो पलटकर आपको देखती है। धरती, क्षण भर को जागी हुई।'],
  '23':['भाप','दोनों में से कोई नहीं झुकता, तो दोनों साथ उठकर बादल बन जाते हैं।'],
  '24':['तूफ़ान','सागर आकाश में चढ़ता है और गर्जन बनकर लौट आता है।'],
  '25':['बर्फ़','जल को पर्याप्त मौन मिले, तो वह काँच बन जाता है।'],
  '26':['सतरंगी','एक श्वेत किरण बूँद में प्रवेश करती है और सात बनकर निकलती है।'],
  '27':['भावना','सीने के भीतर का वह ज्वार जिसे कोई चंद्रमा नहीं समझा पाता।'],
  '34':['बिजली','वह आग जिसने हवा में यात्रा करना सीख लिया।'],
  '35':['सितारा','वह आग जिसके पास जलाने को स्वयं के सिवा कुछ नहीं।'],
  '36':['सूरज','वह ज्वाला जिससे हर दूसरा प्रकाश उधार लिया गया है।'],
  '37':['अंतर की अग्नि','उस मन का ताप जो नज़र हटाने से इनकार करता है।'],
  '45':['ध्वनि','अवकाश काँपता है, वायु उसे ढोती है, और ब्रह्मांड स्वयं को सुनता है।'],
  '46':['भोर','नीला होना याद आने से पहले आकाश लजा उठता है।'],
  '47':['जीवन-श्वास','वह हवा जो आपका नाम जानती है।'],
  '56':['सृष्टि','शून्य, भीतर से प्रकाशित होकर, सब कुछ बन जाता है।'],
  '57':['सपना','शून्य से रचा एक पूरा संसार, हर रात।'],
  '67':['जागरण','प्रकाश स्वयं को देखता है, और अँधेरे में रहने को कोई शेष नहीं रहता।']
 }
};
if(LANG==='hi'){
 T.forEach((t,i)=>Object.assign(t,HI.T[i]));
 HI.TIP.forEach((s,i)=>TIP[i]=s);HI.KN.forEach((k,i)=>KN[i]=k);
 for(const k in HI.MIX){MIX[k][2]=HI.MIX[k][0];MIX[k][3]=HI.MIX[k][1];}
}
