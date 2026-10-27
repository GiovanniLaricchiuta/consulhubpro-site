// Homepage only: original CHP film, no stock sources or device-based autoplay gate.
const film=document.querySelector('#work-film');
const button=document.querySelector('#film-control');
if(film&&button){
  const status=document.querySelector('#film-status');
  let manuallyPaused=false;
  film.muted=true;film.defaultMuted=true;film.autoplay=true;film.loop=true;film.playsInline=true;
  const label=()=>{
    const playing=!film.paused;
    button.innerHTML=playing?'Pausa <span aria-hidden="true">Ⅱ</span>':'Riproduci <span aria-hidden="true">▷</span>';
    button.setAttribute('aria-label',playing?'Pausa il filmato':'Riproduci il filmato');
    button.setAttribute('aria-pressed',String(playing));
  };
  const start=async()=>{if(manuallyPaused||document.hidden)return;try{await film.play();if(status)status.textContent='';}catch{if(status)status.textContent='Riproduzione automatica bloccata dal browser. Usa Riproduci per avviare il video.';}label();};
  film.addEventListener('play',label);film.addEventListener('pause',label);
  film.addEventListener('canplay',start,{once:true});
  film.addEventListener('error',()=>{if(status)status.textContent='Il video non è disponibile. Puoi aprire il filmato originale dal collegamento alternativo.';label();});
  button.addEventListener('click',()=>{if(film.paused){manuallyPaused=false;void start();}else{manuallyPaused=true;film.pause();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause();else void start();});
  label();void start();
}
