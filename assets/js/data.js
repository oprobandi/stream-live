/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.0 — data.js
   Initialises the global SL namespace and seeds all mock data.
   ═══════════════════════════════════════════════════════════════ */

window.SL = {};

const _SRC = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
];

const _DAY = 86400000;
const _NOW = Date.now();

SL.data = {

  videos: [
    { id:1,  title:"Dawn Over Patagonia",       creator:"Elena Rivas",     views:2100000, duration:"14:32", cat:"Nature", thumb:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80",  premium:false, purchasable:false, price:null, desc:"A breathtaking journey through Patagonia's golden hour landscapes, captured in stunning 8K across three expeditions.", src:_SRC[0], uploaded:_NOW - _DAY*20 },
    { id:2,  title:"Tokyo After Midnight",       creator:"Kenji Matsuda",   views:4800000, duration:"22:10", cat:"City",   thumb:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&q=80",  premium:false, purchasable:false, price:null, desc:"Neon reflections and silent streets — an intimate portrait of Tokyo when the crowds disappear and the city exhales.", src:_SRC[1], uploaded:_NOW - _DAY*15 },
    { id:3,  title:"The Deep Dive",              creator:"Marina Sousa",    views:980000,  duration:"38:45", cat:"Ocean",  thumb:"https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=700&q=80",  premium:true,  purchasable:true,  price:2.99, desc:"Exclusive footage from 3,000 metres below — creatures never before filmed. Produced over 18 months with a team of marine biologists.", src:_SRC[2], uploaded:_NOW - _DAY*10 },
    { id:4,  title:"Sahara: Heat & Light",       creator:"Omar Azziz",      views:1300000, duration:"19:08", cat:"Nature", thumb:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=700&q=80",  premium:false, purchasable:false, price:null, desc:"Sand dunes shift like slow breath. A meditative film about time, space, and the patience required to understand a desert.", src:_SRC[3], uploaded:_NOW - _DAY*8  },
    { id:5,  title:"Mastering Sourdough",        creator:"Claire Dupont",   views:5600000, duration:"45:00", cat:"Food",   thumb:"https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=700&q=80",  premium:false, purchasable:false, price:null, desc:"From starter to final crust — the definitive sourdough guide filmed over 30 consecutive days of real baking, no shortcuts.", src:_SRC[4], uploaded:_NOW - _DAY*6  },
    { id:6,  title:"Symphony in Code",           creator:"Priya Krishnan",  views:730000,  duration:"1:12:00",cat:"Tech",  thumb:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&q=80",  premium:true,  purchasable:true,  price:4.99, desc:"A full masterclass in generative music composition with live code. Uncut studio workshop — premium edition includes project files.", src:_SRC[5], uploaded:_NOW - _DAY*5  },
    { id:7,  title:"Streets of Havana",          creator:"Luis Pereira",    views:2900000, duration:"28:33", cat:"City",   thumb:"https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=700&q=80",  premium:false, purchasable:false, price:null, desc:"Color, rhythm, and resilience — a wandering portrait of Havana's everyday magic filmed over six weeks with the city's residents.", src:_SRC[6], uploaded:_NOW - _DAY*4  },
    { id:8,  title:"Northern Lights: Full Cut",  creator:"Astrid Lindqvist",views:8200000, duration:"55:17", cat:"Nature", thumb:"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=700&q=80",  premium:true,  purchasable:true,  price:3.99, desc:"The uncut, remastered aurora documentary — 55 minutes of pure phenomenon captured across Norway, Iceland, and Svalbard.", src:_SRC[0], uploaded:_NOW - _DAY*3  },
    { id:9,  title:"Fermentation Lab",           creator:"Jin Wei",         views:1100000, duration:"31:20", cat:"Food",   thumb:"https://images.unsplash.com/photo-1563720223185-11003d516935?w=700&q=80",  premium:false, purchasable:false, price:null, desc:"Kimchi, miso, kefir, and beyond — the science and art of fermentation explained beautifully by a Michelin-starred chef.", src:_SRC[1], uploaded:_NOW - _DAY*2  },
    { id:10, title:"Quantum Minds",              creator:"Dr. Yael Tamir",  views:640000,  duration:"1:04:00",cat:"Tech",  thumb:"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=700&q=80",  premium:true,  purchasable:false, price:null, desc:"Documentary on quantum computing's frontier — subscription only. Includes unreleased lab footage and interviews with leading researchers.", src:_SRC[2], uploaded:_NOW - _DAY   },
    { id:11, title:"Forest Rain",                creator:"Tomás Reyes",     views:3400000, duration:"10:00", cat:"Nature", thumb:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=80",  premium:false, purchasable:false, price:null, desc:"Ten uninterrupted minutes of pristine temperate rainforest. No narration, no music. Pure atmosphere for focus and calm.", src:_SRC[3], uploaded:_NOW - _DAY*12 },
    { id:12, title:"Blade & Board",              creator:"Yuki Sato",       views:2000000, duration:"24:55", cat:"Food",   thumb:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80",  premium:false, purchasable:false, price:null, desc:"Knife skills, mise en place, and the professional mindset — a Tokyo-trained chef's complete guide to serious home cooking.", src:_SRC[4], uploaded:_NOW - _DAY*18 },
    { id:13, title:"Urban Runners",              creator:"Kai Johansson",   views:1750000, duration:"17:42", cat:"Sport",  thumb:"https://images.unsplash.com/photo-1486218119243-13301543a212?w=700&q=80",  premium:false, purchasable:false, price:null, desc:"Five free-runners. Seven cities. One summer. A kinetic portrait of urban movement that redefines what a city can be.", src:_SRC[5], uploaded:_NOW - _DAY*22 },
    { id:14, title:"Deep Ocean: The Abyss",      creator:"Dr. Kira Novak",  views:420000,  duration:"48:00", cat:"Ocean",  thumb:"https://images.unsplash.com/photo-1559825481-12a05cc00344?w=700&q=80",  premium:true,  purchasable:true,  price:3.99, desc:"Hadal zone exploration — the most remote places on Earth. Exclusive footage from a 2025 research expedition, premium edition.", src:_SRC[6], uploaded:_NOW - _DAY*7  },
  ],

  users: [
    { id:1, name:"Demo User", email:"demo@streamlive.io", password:"demo1234", plan:"monthly", planExpiry: _NOW + 30*_DAY, avatar:"D", uploads:[], purchased:[] }
  ],

};
