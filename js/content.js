/* All wording on the site lives here: elements, hints, wisdom cards and mixer results.
   Edit this file to correct text or to translate the site. */

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
