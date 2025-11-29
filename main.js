/* main.js — 強化版 統合（ロード/背景/スライダー/キャラ/グッズ/ランキング/半円） */

const PLACEHOLDER_IMG = "https://i.imgur.com/6NX19xf.jpeg";

/* 効果音（軽め） */
const SFX = {
  load: new Audio("https://audio.jukehost.co.uk/32y3pFzi9M16.wav"),
  loaded: new Audio("https://audio.jukehost.co.uk/5zZKJRXW2G0H.wav"),
  click: new Audio("https://audio.jukehost.co.uk/mjK7rWGXDLEu.wav"),
  open: new Audio("https://audio.jukehost.co.uk/KO8qSgfLMt3M.wav"),
  close: new Audio("https://audio.jukehost.co.uk/1hBhgFexFm1n.wav"),
  hover: new Audio("https://audio.jukehost.co.uk/wGLjTUxF58yk.wav"),
  toast: new Audio("https://audio.jukehost.co.uk/Wx1nH9AfpPFo.wav"),
  slide: new Audio("https://audio.jukehost.co.uk/ViBPrHkkG99x.wav")
};
Object.values(SFX).forEach(a=>{ try{ a.volume=0.4 }catch(e){} });

function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

/* ============ background ============ */
function generateBackground(){
  try{
    
    const bubbles = document.querySelector(".kirby-bubbles");
    const rain = document.querySelector(".rain");
    if(stars){
      for(let i=0;i<80;i++){ const s=document.createElement('div'); s.className='star'; s.style.left=rnd(0,100)+'%'; s.style.top=rnd(0,100)+'%'; stars.appendChild(s); }
    }
    if(clouds){
      for(let i=0;i<6;i++){ const c=document.createElement('div'); c.className='cloud'; c.style.top=rnd(-20,80)+'%'; c.style.animationDelay=rnd(0,40)+'s'; clouds.appendChild(c); }
    }
    if(bubbles){
      for(let i=0;i<6;i++){ const k=document.createElement('div'); k.className='kirby-floating'; k.style.left=rnd(0,100)+'%'; k.style.top=rnd(0,100)+'%'; k.style.animationDelay=rnd(0,6)+'s'; bubbles.appendChild(k); }
    }
    if(rain){
      for(let i=0;i<20;i++){ const d=document.createElement('div'); d.className='drop'; d.style.left=rnd(0,100)+'%'; d.style.top=rnd(-120,0)+'vh'; d.style.animationDelay=(rnd(0,300)/100)+'s'; rain.appendChild(d); }
    }
  }catch(e){ console.warn('background err',e) }
}

/* ============ slider ============ */
let slideIndex=0, slideIntervalId=null;
function initSlider(){
  try{
    const slides = document.getElementById('slides');
    const dots = document.getElementById('dots');
    if(!slides || !dots) return;
    dots.innerHTML='';
    const total = Math.max(1, slides.children.length);
    // fallback images
    [...slides.querySelectorAll('img')].forEach(img=>{ if(!img.src) img.src = PLACEHOLDER_IMG; img.onerror = ()=>{ img.src = PLACEHOLDER_IMG }});
    for(let i=0;i<total;i++){
      const d=document.createElement('div'); d.className='dot'; if(i===0) d.classList.add('active'); dots.appendChild(d);
      d.addEventListener('click', ()=>{ slideIndex=i; updateSlide()});
    }
    function updateSlide(){ try{ SFX.slide.play(); slides.style.transform = `translateX(${slideIndex * -100}%)`; [...dots.children].forEach((d,i)=>d.classList.toggle('active',i===slideIndex)); }catch(e){console.warn(e)} }
    if(slideIntervalId) clearInterval(slideIntervalId);
    slideIntervalId = setInterval(()=>{ slideIndex = (slideIndex+1)%total; updateSlide(); }, 6000);
  }catch(e){ console.warn('initSlider err',e) }
}

/* ============ utility: doubletap ============ */
function addDoubleTap(el, callback){
  if(!el) return;
  let last = 0;
  el.addEventListener('touchend', e=>{
    const now = Date.now();
    if(now - last < 300){ e.preventDefault(); callback(e); }
    last = now;
  });
  el.addEventListener('dblclick', e=>{ e.preventDefault(); callback(e); });
}

/* ============ data (characters goods) ============ */
const characters = [
  { name: "カービィ", img: "https://www.kirby.jp/images/character/chara-kirby.png" },
  { name: "ワドルディ", img: "https://www.kirby.jp/images/character/chara-waddledee.png" },
  { name: "メタナイト", img: "https://www.kirby.jp/images/character/chara-metaknight.png" },
  { name: "デデデ大王", img: "https://www.kirby.jp/images/character/chara-dedede.png" }
];
const goods = [
  { title: "カービィぬいぐるみ", price: 2300, img: "kirbynui.png" },
  { title: "カービィハンカチ", price: 1600, img: "kirby_hankati.png" },
  { title: "ワドルディポーチ", price: 3200, img: "waddorde_po-ti.png" }
];

/* ============ load characters/goods ============ */
function loadCharacters(){
  try{
    const grid = document.getElementById('charGrid'); if(!grid) return;
    grid.innerHTML='';
    characters.forEach(ch=>{
      const c=document.createElement('div'); c.className='char hover-sfx';
      const img=document.createElement('img'); img.src = ch.img || PLACEHOLDER_IMG; img.onerror = ()=>{ img.src = PLACEHOLDER_IMG };
      const h=document.createElement('h4'); h.innerText = ch.name;
      c.appendChild(img); c.appendChild(h);
      c.addEventListener('click', ()=> showToast(`${ch.name} を選択！`));
      addDoubleTap(c, ()=>{ window.location.href = `character.html?name=${encodeURIComponent(ch.name)}` });
      grid.appendChild(c);
    });
  }catch(e){console.warn('loadCharacters error',e)}
}
function loadGoods(){
  try{
    const wrap = document.querySelector('.goods'); if(!wrap) return; wrap.innerHTML='';
    goods.forEach(g=>{
      const c=document.createElement('div'); c.className='product hover-sfx';
      const img=document.createElement('img'); img.src = g.img || PLACEHOLDER_IMG; img.width=120; img.onerror=()=>{ img.src = PLACEHOLDER_IMG };
      const h=document.createElement('h3'); h.innerText = g.title;
      const p=document.createElement('div'); p.className='price'; p.innerText = `¥${g.price}`;
      c.appendChild(img); c.appendChild(h); c.appendChild(p);
      c.addEventListener('click', ()=> showToast(`${g.title} を選択！`));
      addDoubleTap(c, ()=>{ window.location.href = `goods.html?item=${encodeURIComponent(g.title)}` });
      wrap.appendChild(c);
    });
  }catch(e){console.warn('loadGoods error',e)}
}

/* ============ ranking & news ============ */
function buildRanking(){
  try{
    const rankWrap = document.getElementById('rankingGrid'); if(!rankWrap) return; rankWrap.innerHTML='';
    // simple ranking from characters order
    characters.forEach((ch,idx)=>{
      const card=document.createElement('div'); card.className='card';
      card.style.minWidth='180px';
      card.innerHTML = `<div style="font-weight:900;font-size:1.2rem">#${idx+1}</div><img src="${ch.img}" style="width:120px;height:120px;object-fit:contain;border-radius:12px"/><div style="margin-top:8px;font-weight:800">${ch.name}</div>`;
      rankWrap.appendChild(card);
    });
  }catch(e){ console.warn('buildRanking',e) }
}
function buildNews(){
  try{
    const news = [
      {date:'2025-11-07', title:'スターガーデンの更新データ公開！'},
      {date:'2025-11-01', title:'新しいステージ「スターガーデン」公開！'},
      {date:'2025-10-20', title:'限定グッズが登場！オンラインストアで販売開始'},
      {date:'2025-09-30', title:'イベント「カービィフェス」開催決定'}
    ];
    const list = document.getElementById('newsList'); if(!list) return; list.innerHTML='';
    news.forEach(n=>{
      const el=document.createElement('div'); el.className='card'; el.style.marginBottom='10px';
      el.innerHTML = `<strong>${n.date}</strong> — ${n.title}`;
      list.appendChild(el);
    });
  }catch(e){ console.warn('buildNews',e) }
}

/* ============ modal/toast ============ */
function openModal(obj){
  try{
    SFX.open.play();
    const m = document.getElementById('modal'); const body = document.getElementById('modalBody');
    if(!m||!body) return;
    body.innerHTML = `<h3>${obj.name||obj.title}</h3><p style="white-space:pre-line;margin-top:8px">とってもかわいい！</p><div style="margin-top:12px"><button class="pill" onclick="location.href='${obj.name? 'character.html?name='+encodeURIComponent(obj.name) : 'goods.html?item='+encodeURIComponent(obj.title)}'">詳細を見る</button></div>`;
    m.style.display='flex'; m.setAttribute('aria-hidden','false');
  }catch(e){ console.warn('openModal',e) }
}
function closeModal(){
  try{ const m=document.getElementById('modal'); if(m){ m.style.display='none'; m.setAttribute('aria-hidden','true'); } SFX.close.play(); }catch(e){console.warn(e)}
}
function showToast(txt){
  try{ SFX.toast.play(); const t=document.getElementById('toast'); if(!t) return; t.innerText = txt; t.style.display='block'; setTimeout(()=>{ if(t) t.style.display='none' },2300) }catch(e){console.warn(e)}
}

/* ============ half menu (centered relative to element) ============ */
let activeHalf = null;
function openHalfMenuFor(el,type,data){
  if(activeHalf) activeHalf.remove();
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width/2 + window.pageXOffset;
  const y = rect.top + window.pageYOffset;
  const menu = document.createElement('div'); menu.className='halfmenu';
  menu.style.left = x + 'px';
  menu.style.top = (y - 18) + 'px';
  // buttons
  const openBtn = document.createElement('button'); openBtn.innerText = '開く';
  openBtn.addEventListener('click', (e)=>{ e.stopPropagation(); if(type==='char') location.href=`character.html?name=${encodeURIComponent(data.name)}`; else location.href=`goods.html?item=${encodeURIComponent(data.title)}` });
  const favBtn = document.createElement('button'); favBtn.innerText = 'お気に入り';
  favBtn.addEventListener('click', (e)=>{ e.stopPropagation(); showToast('お気に入りに追加！'); });
  menu.appendChild(openBtn); menu.appendChild(favBtn);
  document.body.appendChild(menu); activeHalf = menu;
  setTimeout(()=>{ window.addEventListener('click', closeHalfOnce) },10);
}
function closeHalfOnce(){ if(activeHalf) activeHalf.remove(); activeHalf=null; window.removeEventListener('click', closeHalfOnce) }

/* ============ init & loading ============ */
function init(){
  try{
    generateBackground(); loadCharacters(); loadGoods(); initSlider(); buildRanking(); buildNews();
    // sound bind
    document.querySelectorAll('.hover-sfx').forEach(e=>{ e.addEventListener('mouseenter', ()=>{ try{ SFX.hover.play() }catch(_){} }); e.addEventListener('click', ()=>{ try{ SFX.click.play() }catch(_){} }) });
    // header shrink on scroll
    const header = document.getElementById('siteHeader');
    let lastScroll = 0;
    window.addEventListener('scroll', ()=>{ const s = window.scrollY; if(s>60) header.classList.add('header-small'); else header.classList.remove('header-small'); lastScroll=s });
    // open ranking quick
    const or = document.getElementById('openRanking'); if(or) or.addEventListener('click', ()=>{ document.getElementById('rankingSection').scrollIntoView({behavior:'smooth'}) });
    // close modal btn
    const cb = document.getElementById('closeModal'); if(cb) cb.addEventListener('click', closeModal);
  }catch(e){ console.warn('init err',e) }
}

function simulateLoading(){
  try{
    try{ SFX.load.play() }catch(_){}
    const fill = document.getElementById('suckFill'); if(fill) fill.style.width='0%';
    let p=0;
    const timer = setInterval(()=>{
      try{ p += rnd(8,25); if(p>100) p=100; if(fill) fill.style.width = p + '%'; }catch(e){}
      if(p>=100){ clearInterval(timer); setTimeout(()=>{ try{ SFX.loaded.play() }catch(_){}; const lw = document.getElementById('loadingWrap'); if(lw) lw.style.display='none'; init(); },700) }
    },200);
    // safety timeout
    setTimeout(()=>{ const lw=document.getElementById('loadingWrap'); if(lw && lw.style.display !== 'none'){ try{ lw.style.display='none' }catch(_){ } init() } },10000);
  }catch(e){ console.warn('simulateLoading err',e); const lw=document.getElementById('loadingWrap'); if(lw) lw.style.display='none'; init() }
}

/* start on load */
window.addEventListener('load', simulateLoading);
/* ---- ローディング処理 ---- */
function simulateLoading(){
  const fill = document.getElementById("suckFill");
  let p = 0;

  const timer = setInterval(()=>{
    p += Math.floor(Math.random()*15)+8;
    if(p >= 100) p = 100;
    fill.style.width = p + "%";

    if(p >= 100){
      clearInterval(timer);
      setTimeout(()=>{
        document.getElementById("loadingWrap").style.display = "none";
        init();
      }, 600);
    }
  },200);
}

/* ---- init ---- */
function init(){
  generateBackground();
  loadCharacters();
  loadGoods();
  initSlider();
}

/* ---- window.onload ---- */
window.onload = simulateLoading;
