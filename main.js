/* ==========================
   Kirby Super Cute – main.js
   完全統合版（ロード / 背景 / キャラ / グッズ / スライダー / 効果音 / ダブルタップ / 安定化）
========================== */

/* ---- 設定 ---- */
const PLACEHOLDER_IMG = "https://i.imgur.com/6NX19xf.jpeg"; // フォールバック画像

/* ---- 効果音 ---- */
const SFX = {
  load: new Audio("https://audio.jukehost.co.uk/32y3pFzi9M16.wav"),
  loaded: new Audio("https://audio.jukehost.co.uk/5zZKJRXW2G0H.wav"),
  click: new Audio("https://audio.jukehost.co.uk/mjK7rWGXDLEu.wav"),
  open: new Audio("https://audio.jukehost.co.uk/KO8qSgfLMt3M.wav"),
  close: new Audio("https://audio.jukehost.co.uk/1hBhgFexFm1n.wav"),
  hover: new Audio("https://audio.jukehost.co.uk/wGLjTUxF58yk.wav"),
  toast: new Audio("https://audio.jukehost.co.uk/Wx1nH9AfpPFo.wav"),
  slide: new Audio("https://audio.jukehost.co.uk/ViBPrHkkG99x.wav"),
  star: new Audio("https://audio.jukehost.co.uk/MpsSVg8AsFQh.wav")
};
Object.values(SFX).forEach(a => { try{ a.volume = 0.45 }catch(e){} });

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

/* ---- 背景生成 ---- */
function generateBackground(){
  try{
    const bubbles = document.querySelector(".kirby-bubbles");
    if(stars){
      for(let i=0;i<100;i++){const s=document.createElement('div');s.className='star';s.style.left=rnd(0,100)+'%';s.style.top=rnd(0,100)+'%';stars.appendChild(s)}
    }
    if(clouds){
      for(let i=0;i<8;i++){const c=document.createElement('div');c.className='cloud';c.style.top=rnd(-10,90)+'%';c.style.animationDelay=rnd(0,40)+'s';clouds.appendChild(c)}
    }
    if(bubbles){
      for(let i=0;i<8;i++){const k=document.createElement('div');k.className='kirby-floating';k.style.left=rnd(0,100)+'%';k.style.top=rnd(0,100)+'%';k.style.animationDelay=rnd(0,4)+'s';bubbles.appendChild(k)}
    }
  }catch(e){console.warn('generateBackground error',e)}
}

/* ---- スライダー ---- */
let slideIndex = 0, slideIntervalId = null;
function initSlider(){
  try{
    const slides = document.getElementById('slides');
    const dots = document.getElementById('dots');
    if(!slides || !dots) return;
    const total = Math.max(1, slides.children.length);
    dots.innerHTML='';
    for(let i=0;i<total;i++){const d=document.createElement('div');d.className='dot';if(i===0)d.classList.add('active');dots.appendChild(d);d.addEventListener('click',()=>{slideIndex=i;updateSlide()});}
    // ensure images in slides have fallback
    [...slides.querySelectorAll('img')].forEach(img=>{if(!img.src) img.src=PLACEHOLDER_IMG; img.onerror=()=>{img.src=PLACEHOLDER_IMG}});
    function updateSlide(){ try{ SFX.slide.play(); slides.style.transform = `translateX(${slideIndex * -100}%)`; [...dots.children].forEach((d,i)=>d.classList.toggle('active', i===slideIndex)); }catch(e){console.warn('updateSlide',e)} }
    if(slideIntervalId) clearInterval(slideIntervalId);
    slideIntervalId = setInterval(()=>{ slideIndex=(slideIndex+1)%total; updateSlide(); }, 6000);
  }catch(e){console.warn('initSlider error',e)}
}

/* ---- ダブルタップヘルパー ---- */
function addDoubleTap(el, callback){
  if(!el) return;
  let last=0;
  el.addEventListener('touchend', e=>{const now=Date.now(); if(now-last<300){ e.preventDefault(); callback(e); } last=now});
  el.addEventListener('dblclick', e=>{ e.preventDefault(); callback(e) });
}

/* ---- キャラ / グッズ データ ---- */
const characters = [
  { name: "カービィ", img: "https://www.kirby.jp/images/character/chara-kirby.png" },
  { name: "ワドルディ", img: "https://www.kirby.jp/images/character/chara-waddledee.png" },
  { name: "メタナイト", img: "https://www.kirby.jp/images/character/chara-metaknight.png" },
  { name: "デデデ大王", img: "https://www.kirby.jp/images/character/chara-dedede.png" }
];
const goods = [
  { title: "カービィぬいぐるみ", price: 2300, img: "kirbynui.png" },
  { title: "ワドルディポーチ", price: 1600, img: "waddorde_po-ti.png" },
  { title: "カービィのハンカチ", price: 3200, img: "kirby_hankati.png" }
];

/* ---- キャラ表示 ---- */
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

/* ---- グッズ表示 ---- */
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

/* ---- モーダル / トースト ---- */
function openModal(obj){ try{ SFX.open.play(); const m = document.getElementById('modal'); const body = document.getElementById('modalBody'); if(!m||!body) return; body.innerHTML = `<h3>${obj.name||obj.title}</h3><p>とってもかわいいキャラだよ！</p>`; m.style.display='flex'; }catch(e){console.warn('openModal',e)} }
function closeModal(){ try{ const m=document.getElementById('modal'); if(m) m.style.display='none'; SFX.close.play(); }catch(e){console.warn('closeModal',e)} }
function showToast(text){ try{ SFX.toast.play(); const t=document.getElementById('toast'); if(!t) return; t.innerText=text; t.style.display='block'; setTimeout(()=>{ if(t) t.style.display='none' },2500); }catch(e){console.warn('showToast',e)} }

/* ---- 安全な初期化（必ず完了する） ---- */
function init(){
  try{
    generateBackground(); loadCharacters(); loadGoods(); initSlider();
    // hover / click sounds
    document.querySelectorAll('.hover-sfx').forEach(e=>{ e.addEventListener('mouseenter', ()=>{ try{ SFX.hover.play() }catch(_){} }); e.addEventListener('click', ()=>{ try{ SFX.click.play() }catch(_){} }) });
    // close modal
    const closeBtn = document.getElementById('closeModal'); if(closeBtn) closeBtn.addEventListener('click', closeModal);
  }catch(e){console.warn('init error',e)}
}

/* ---- ローディング（万が一の保険でタイムアウトで開放） ---- */
function simulateLoading(){
  try{
    try{ SFX.load.play() }catch(_){}
    const fill = document.getElementById('suckFill'); if(fill){ fill.style.width='0%' }
    let p=0;
    const timer = setInterval(()=>{
      try{ p += rnd(8,25); if(p>100) p=100; if(fill) fill.style.width = p + '%'; }
      catch(e){console.warn(e)}
      if(p>=100){ clearInterval(timer); setTimeout(()=>{ try{ SFX.loaded.play() }catch(_){}; const lw = document.getElementById('loadingWrap'); if(lw) lw.style.display='none'; init(); },700); }
    },200);
    // 保険：10秒経っても終わらなければ強制的に抜ける
    setTimeout(()=>{
      if(document.getElementById('loadingWrap') && document.getElementById('loadingWrap').style.display !== 'none'){
        try{ const lw = document.getElementById('loadingWrap'); lw.style.display='none'; }catch(_){}
        init();
      }
    },10000);
  }catch(e){console.warn('simulateLoading error',e); try{ const lw=document.getElementById('loadingWrap'); if(lw) lw.style.display='none' }catch(_){}; init(); }
}

/* ---- 実行 ---- */
window.addEventListener('load', simulateLoading);

/* End of main.js */
