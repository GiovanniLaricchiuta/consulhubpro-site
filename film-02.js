const film=document.querySelector('#work-film'),button=document.querySelector('#film-control');
if(film&&button){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),small=matchMedia('(max-width:800px)');
 const status=document.querySelector('#film-status');let manualPause=false;
 const label=()=>{const playing=!film.paused;button.innerHTML=playing?'Pausa <span aria-hidden="true">Ⅱ</span>':'Riproduci <span aria-hidden="true">▷</span>';button.setAttribute('aria-label',playing?'Pausa il filmato':'Riproduci il filmato');button.setAttribute('aria-pressed',String(playing));};
 const source=film.querySelector(small.matches?'source[media]':'source:not([media])');
 film.controls=false;film.preload='none';film.poster=small.matches?'film/chp-02-poster-mobile.webp':'film/chp-02-poster-desktop.webp';
 // Keep the poster free of the native buffering indicator before playback is requested.
 film.addEventListener('loadeddata',()=>{film.controls=true});
 // Assigning the source with preload=none avoids fetching the film on mobile/reduced motion.
 film.src=source.dataset.src;
 const play=async()=>{manualPause=false;if(status)status.textContent='Caricamento del filmato…';try{await film.play();if(status)status.textContent='Microfilm di repertorio · 18 secondi · senza audio';}catch{if(status)status.textContent='Premi Riproduci oppure usa i controlli del video per avviare il filmato.';}label();};
 button.addEventListener('click',()=>{if(film.paused)void play();else film.pause()});
 film.addEventListener('play',()=>{manualPause=false;label()});
 film.addEventListener('pause',()=>{manualPause=true;label()});
 film.addEventListener('error',()=>{if(status){status.textContent='Filmato non caricato. ';const link=document.createElement('a');link.href=source.dataset.src;link.textContent='Apri direttamente la clip ↗';status.append(link)}label()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause()});
 const observer=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)film.pause();else if(!small.matches&&!reduced.matches&&!navigator.connection?.saveData&&!manualPause&&!document.hidden)void play()}},{threshold:.15});observer.observe(film);
 reduced.addEventListener('change',()=>{if(reduced.matches)film.pause()});label();
}
