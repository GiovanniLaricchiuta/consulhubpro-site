// Independent of the journey, partner dialogs and contact form.
const film=document.querySelector('#work-film'),button=document.querySelector('#film-control');
if(film&&button){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),small=matchMedia('(max-width:800px)');
 const status=document.querySelector('#film-status');let manualPause=false;
 const label=()=>{const playing=!film.paused;button.innerHTML=playing?'Pausa <span aria-hidden="true">Ⅱ</span>':'Riproduci <span aria-hidden="true">▷</span>';button.setAttribute('aria-label',playing?'Pausa il filmato':'Riproduci il filmato');button.setAttribute('aria-pressed',String(playing));};
 const load=()=>{if(film.currentSrc||film.getAttribute('src'))return;const source=film.querySelector(small.matches?'source[media]':'source:not([media])');film.src=source.dataset.src;film.load();};
 const play=async(manual=false)=>{if(manual)manualPause=false;load();if(status)status.textContent='Caricamento del filmato…';try{await film.play();if(status)status.textContent='Clip di repertorio · 16 secondi · senza audio';}catch{if(status)status.textContent='La riproduzione automatica non è disponibile. Premi Riproduci oppure usa i controlli del video.';}label();};
 button.addEventListener('click',()=>{if(film.paused)void play(true);else{manualPause=true;film.pause();}});
 film.controls=true;film.preload='none';load();film.addEventListener('play',label);film.addEventListener('pause',label);
 film.addEventListener('error',()=>{if(status)status.innerHTML='Filmato non caricato. <a href="film/hero-desktop.mp4" target="_blank" rel="noopener">Apri direttamente la clip ↗</a>';button.disabled=false;film.removeAttribute('src');label();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause();});
 const observer=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)film.pause();else if(!small.matches&&!reduced.matches&&!navigator.connection?.saveData&&!manualPause&&!document.hidden)void play();}},{threshold:.15});observer.observe(film);
 reduced.addEventListener('change',()=>{if(reduced.matches)film.pause();});label();
}
