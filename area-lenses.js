// Small conversation tools: no scoring, diagnosis, storage or automatic submission.
export function mountAreaLenses({state,onChange,reduced}){
 const lenses=[
  {title:'Da quale priorità partire?',kind:'priority',options:['Un investimento','Sviluppare il mercato','Un progetto da inquadrare'],answers:['Qual è l’investimento, in quale fase si trova e quali tempi ha l’impresa?','Quale mercato interessa e quali risorse sono già presenti nell’impresa?','Che cosa vuole cambiare l’impresa e chi sta già seguendo il progetto?']},
  {title:'A che punto è il cambiamento?',kind:'timeline',options:['Prima delle scelte','Una scelta già avviata'],answers:['Prima di decidere: condividere il contesto, distinguere i temi e definire gli approfondimenti.','Con una scelta avviata: ricostruire i passaggi, riconoscere gli interlocutori e chiarire i punti ancora aperti.']},
  {title:'Dove si concentra la domanda?',kind:'roles',options:['Ruoli sovrapposti','Nuove responsabilità'],answers:['Quali attività passano tra più persone, e dove manca una responsabilità chiara?','Quali responsabilità nuove stanno emergendo, e come vengono condivise con le persone?']},
  {title:'Cambia il punto di vista.',kind:'perspective',options:[],answers:['Come si racconta l’impresa: quali servizi, per chi, con quale linguaggio?','Mettere a confronto ciò che l’impresa comunica e ciò che il cliente cerca.','Come la trova il cliente: quali domande pone e quali informazioni riesce a trovare?']},
  {title:'Segui un’attività quotidiana.',kind:'process',options:['L’attività','Gli strumenti','Le persone'],answers:['Quale attività si ripete e da dove parte l’informazione?','Dove viene registrata, copiata o trasferita la stessa informazione?','Chi riceve il passaggio e come riconosce che l’attività è conclusa?']},
  {title:'Componi il quadro da approfondire.',kind:'scope',options:['Persone','Processi','Documenti'],answers:[]}
 ];
 const captions=['Mettere a fuoco','Ordinare i passaggi','Chiarire i ruoli','Confrontare gli sguardi','Seguire il processo','Raccogliere il contesto'];
 const svg=[
  '<path d="M10 88H180M35 88V54h24v34m25 0V34h24v54m25 0V15h24v73"/><circle class="lens-node" cx="47" cy="54" r="5"/>',
  '<path d="M15 50H185"/><circle cx="30" cy="50" r="8"/><circle cx="100" cy="50" r="8"/><circle cx="170" cy="50" r="8"/><path class="lens-accent" d="M30 50H170"/>',
  '<circle cx="40" cy="50" r="22"/><circle cx="100" cy="50" r="22"/><circle cx="160" cy="50" r="22"/><path class="lens-accent" d="M62 50H78m44 0h16"/>',
  '<path class="perspective-company" d="M20 20h60v60H20z"/><path class="perspective-client" d="M120 20h60v60h-60z"/><path class="lens-accent" d="M80 50h40m-9-8 9 8-9 8"/>',
  '<path d="M15 25h45v50H15zm62 0h45v50H77zm62 0h45v50h-45z"/><path class="lens-accent" d="M60 50h17m45 0h17"/>',
  '<path d="M100 10 165 30v30c0 22-65 36-65 36S35 82 35 60V30Z"/><circle cx="73" cy="50" r="5"/><circle cx="100" cy="50" r="5"/><circle cx="127" cy="50" r="5"/>'
 ];
 state.lenses={};
 lenses.forEach((lens,i)=>{
  const detail=document.querySelector('#area-detail-'+i),oldList=detail.querySelector(':scope>ul'),side=document.createElement('div');side.className='area-side';if(oldList)side.append(oldList);detail.append(side);
  const tool=document.createElement('div');tool.className='area-lens lens-'+lens.kind;tool.dataset.lens=i;tool.dataset.step='0';
  const id='lens-'+i;
  let controls='';
  if(lens.kind==='perspective')controls='<div class="lens-range-labels"><span>Lo sguardo dell’impresa</span><span>Lo sguardo del cliente</span></div><label class="sr-only" for="'+id+'-range">Confronta il punto di vista dell’impresa e del cliente</label><input id="'+id+'-range" type="range" min="0" max="2" step="1" value="0" aria-valuetext="Lo sguardo dell’impresa">';
  else if(lens.kind==='process')controls='<ol class="process-stages">'+lens.options.map((label,n)=>'<li data-node="'+n+'"'+(n===0?' class="current"':'')+'>'+label+'</li>').join('')+'</ol><button type="button" class="lens-next">Segui il passaggio <span aria-hidden="true">→</span></button>';
  else if(lens.kind==='scope')controls='<fieldset class="lens-checks"><legend class="sr-only">Scegli i temi del quadro iniziale</legend>'+lens.options.map((label,n)=>'<label><input type="checkbox" value="'+n+'"><span>'+label+'</span></label>').join('')+'</fieldset>';
  else controls='<div class="lens-options" role="group" aria-label="'+lens.title+'">'+lens.options.map((label,n)=>'<button type="button" data-choice="'+n+'" aria-pressed="'+(n===0)+'">'+label+'</button>').join('')+'</div>';
  tool.innerHTML='<span class="eyebrow">PER IL PRIMO CONFRONTO / '+captions[i]+'</span><h4 id="'+id+'-title">'+lens.title+'</h4><svg viewBox="0 0 200 100" aria-hidden="true">'+svg[i]+'</svg>'+controls+'<p class="lens-answer" role="status" aria-live="polite">'+(lens.answers[0]||'Scegli i temi da raccontare: la loro applicabilità si approfondisce con lo specialista.')+'</p>';
  side.append(tool);
  const answer=tool.querySelector('.lens-answer');
  function update(index){tool.dataset.step=index;const title=lens.kind==='perspective'?['Lo sguardo dell’impresa','Il confronto','Lo sguardo del cliente'][index]:lens.options[index];answer.textContent=lens.answers[index];state.lenses[i]=title;tool.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.choice===index)));tool.querySelectorAll('[data-node]').forEach(li=>li.classList.toggle('current',+li.dataset.node===index));const range=tool.querySelector('input[type=range]');if(range)range.setAttribute('aria-valuetext',title);if(!reduced.matches)tool.querySelector('svg').animate([{transform:'translateY(3px)'},{transform:'translateY(0)'}],{duration:300,easing:'ease-out'});onChange()}
  tool.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>update(+b.dataset.choice)));
  tool.querySelector('input[type=range]')?.addEventListener('input',e=>update(+e.target.value));
  tool.querySelector('.lens-next')?.addEventListener('click',()=>update((+tool.dataset.step+1)%3));
  tool.querySelectorAll('input[type=checkbox]').forEach(input=>input.addEventListener('change',()=>{const values=[...tool.querySelectorAll('input:checked')].map(x=>lens.options[+x.value]);state.lenses[i]=values.join(', ');answer.textContent=values.length?'Da raccontare nella call: '+values.join(', ')+'. Quali informazioni sono già disponibili e quali temi vanno chiariti?':'Scegli i temi da raccontare: la loro applicabilità si approfondisce con lo specialista.';tool.dataset.count=values.length;onChange()}));
 });
}
