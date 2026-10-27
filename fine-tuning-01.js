const section=document.querySelector('.reviews-section');
if(section){
 const choices=[...section.querySelectorAll('[data-review]')];
 const stories=[...section.querySelectorAll('.review-story')];
 const status=section.querySelector('.review-counter');
 let active=0;
 function select(index){
  active=(index+choices.length)%choices.length;
  choices.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
  stories.forEach((story,i)=>{story.hidden=i!==active});
  status.textContent=`${String(active+1).padStart(2,'0')} / ${String(choices.length).padStart(2,'0')} · ${choices[active].querySelector('.review-choice-name').textContent}`;
 }
 choices.forEach((button,i)=>{
  button.addEventListener('click',()=>select(i));
  button.addEventListener('keydown',event=>{
   const offset={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];
   if(offset!==undefined||event.key==='Home'||event.key==='End'){
    event.preventDefault();select(event.key==='Home'?0:event.key==='End'?choices.length-1:active+offset);choices[active].focus();
   }
  });
 });
 section.querySelector('[data-review-prev]').addEventListener('click',()=>select(active-1));
 section.querySelector('[data-review-next]').addEventListener('click',()=>select(active+1));
 section.querySelector('.review-controls').hidden=false;
 section.classList.add('reviews-ready');select(0);
 // Measure the existing lazy chapters before jumping from the auxiliary menu.
 // This handler is limited to the new reviews section.
 document.querySelectorAll('a[href$="#esperienze"]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  document.querySelectorAll('main>section,.site-footer').forEach(chapter=>chapter.classList.add('rendered'));
  history.replaceState(null,'','#esperienze');
  document.fonts.ready.then(()=>requestAnimationFrame(()=>{
   section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
   const heading=section.querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});
  }));
 }));
}
