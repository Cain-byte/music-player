const audio = document.getElementById('audio');
const fileInput = document.getElementById('fileInput');
const trackName = document.getElementById('trackName');
const trackExt = document.getElementById('trackExt');
const emoji = document.getElementById('emoji');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const btnPlay = document.getElementById('btnPlay');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const volumeSlider = document.getElementById('volumeSlider');
const playlistEl = document.getElementById('playlist');

let files = [];
let currentIndex = 0;
let objectURLs = [];

fileInput.addEventListener('change', (e)=>{
  const raw = Array.from(e.target.files).filter(f => f.type.startsWith('audio/'));
  if(!raw.length) return;
  files = raw;
  objectURLs.forEach(u=>URL.revokeObjectURL(u));
  objectURLs = [];
  buildPlaylist();
  loadTrack(0,true);
});

function buildPlaylist(){
  playlistEl.innerHTML='';
  files.forEach((f,i)=>{
    const item = document.createElement('div');
    item.className='playlist-item';
    item.dataset.index=i;
    const name = f.name.replace(/\.[^/.]+$/,'');
    item.textContent=name;
    item.addEventListener('click',()=>loadTrack(i,true));
    playlistEl.appendChild(item);
  });
}

function loadTrack(index, autoplay=false){
  if(!files.length) return;
  index = ((index%files.length)+files.length)%files.length;
  currentIndex=index;
  const url = URL.createObjectURL(files[index]);
  objectURLs[index]=url;
  audio.src=url;
  audio.volume=volumeSlider.value;
  trackName.textContent=files[index].name.replace(/\.[^/.]+$/,'');
  trackExt.textContent=(files[index].name.split('.').pop()||'').toUpperCase();
  document.querySelectorAll('.playlist-item').forEach((el,i)=>el.classList.toggle('active',i===index));
  if(autoplay) audio.play().catch(()=>{});
}

btnPlay.addEventListener('click',()=>{
  if(audio.paused) audio.play().catch(()=>{});
  else audio.pause();
});

btnPrev.addEventListener('click',()=>loadTrack(currentIndex-1,!audio.paused));
btnNext.addEventListener('click',()=>loadTrack(currentIndex+1,!audio.paused));

audio.addEventListener('play',()=>{ btnPlay.innerHTML='&#9646;&#9646;'; emoji.textContent='🎶'; });
audio.addEventListener('pause',()=>{ btnPlay.innerHTML='&#9654;'; emoji.textContent='🎵'; });

audio.addEventListener('timeupdate',()=>{
  if(!audio.duration) return;
  const pct=(audio.currentTime/audio.duration)*100;
  progressFill.style.width=pct+'%';
  timeCurrent.textContent=fmt(audio.currentTime);
  timeTotal.textContent=fmt(audio.duration);
});

progressBar.addEventListener('click',(e)=>{
  const rect=progressBar.getBoundingClientRect();
  audio.currentTime=((e.clientX-rect.left)/rect.width)*audio.duration;
});

volumeSlider.addEventListener('input',()=>{ audio.volume=volumeSlider.value; });

function fmt(s){ const m=Math.floor(s/60); const sec=Math.floor(s%60); return `${m}:${sec.toString().padStart(2,'0')}`; }