const hero=document.querySelector('.cinema-hero');
const scene=document.querySelector('#hero-network');
const svg=document.querySelector('#cinema-network-svg');
if(hero&&scene&&svg){
  const ns='http://www.w3.org/2000/svg';
  const layer=name=>svg.querySelector(`[data-cinema-layer="${name}"]`);
  const element=(name,attrs,parent)=>{const e=document.createElementNS(ns,name);for(const [key,value] of Object.entries(attrs))e.setAttribute(key,String(value));parent.append(e);return e;};
  const clamp=(x,min=0,max=1)=>Math.min(max,Math.max(min,x));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:800px)');
  const scroller=document.querySelector('#page-scroll');
  const toggle=document.querySelector('#cinema-motion-toggle');
  const core=svg.querySelector('#cinema-core');
  const labels=[...scene.querySelectorAll('.cinema-area')];
  const routes=labels.map(()=>({base:element('path',{class:'cinema-route-base'},layer('routes')),line:element('path',{class:'cinema-route'},layer('routes'))}));
  const rings=Array.from({length:3},()=>element('path',{class:'cinema-orbit'},layer('rings')));
  const mesh=Array.from({length:42},()=>element('path',{class:'cinema-mesh'},layer('mesh')));
  const dots=Array.from({length:48},()=>element('circle',{class:'cinema-dot',r:3},layer('dots')));
  const packets=Array.from({length:18},()=>element('circle',{class:'cinema-packet',r:3},layer('packets')));
  const glow=element('circle',{r:7,fill:'#65cce3',opacity:.55,filter:'url(#cinema-soft-glow)'},layer('packets'));
  let active=-1,pointerX=0,pointerY=0,lookX=0,lookY=0,progress=0,time=0,last=0,frame=0,request=0,visible=true,paused=false,modalOpen=false;
  let projectionYaw=0,projectionPitch=-.12;
  scene.dataset.motion=reduced.matches?'reduced':'running';
  scene.dataset.introStage=reduced.matches?'reveal':'ignite';
  function project([x,y,z]){
    const cy=Math.cos(projectionYaw),sy=Math.sin(projectionYaw),cx=Math.cos(projectionPitch),sx=Math.sin(projectionPitch);
    const xx=x*cy+z*sy,zz=-x*sy+z*cy,yy=y*cx-zz*sx,depth=y*sx+zz*cx;
    const scale=760/(760-depth);
    return {x:500+xx*scale,y:430+yy*scale,z:depth,s:scale};
  }
  function point(branch,u,t){
    const angle=branch*Math.PI/3-Math.PI/2;
    const r=(292+Math.sin(t*.42+branch)*13)*(1-progress*.3)*u;
    const turn=Math.sin(u*Math.PI)*.24;
    return [Math.cos(angle+turn)*r,Math.sin(angle+turn)*r*.91,Math.sin(angle*2+branch*.36)*132*u+Math.sin(u*Math.PI)*70+Math.cos(t*.5+branch)*13*u];
  }
  function path(points,close=false){return points.map((p,i)=>(i?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1)).join(' ')+(close?'Z':'');}
  function render(t){
    const renderStarted=performance.now();
    const stage=t<.52?'ignite':t<1.78?'connect':t<2.68?'converge':'reveal';
    scene.dataset.introStage=reduced.matches?'reveal':stage;
    const connectionProgress=reduced.matches?1:clamp((t-.38)/1.38);
    const convergence=reduced.matches?1:clamp((t-1.7)/.96);
    scene.style.setProperty('--intro-convergence',convergence.toFixed(3));
    core.style.opacity=(.18+.82*convergence).toFixed(3);
    core.style.transform=`translateY(${progress*12}px) scale(${(.76+.24*convergence).toFixed(3)})`;
    projectionYaw=lookX*.4+Math.sin(t*.16)*.22;
    projectionPitch=-.12+lookY*.22+Math.cos(t*.19)*.06+progress*.18;
    const endpoints=[];const positions=[];
    for(let b=0;b<6;b++){
      const ep=project(point(b,1,t));endpoints.push(ep);
      // Draw each branch from its outer tip back toward CHP, matching the inward packets.
      const curve=Array.from({length:22},(_,i)=>project(point(b,1-i*.74/21,t)));
      const d=path(curve);routes[b].base.setAttribute('d',d);routes[b].line.setAttribute('d',d);
      const routeLength=routes[b].line.getTotalLength();
      routes[b].line.style.strokeDasharray=routeLength.toFixed(1);
      routes[b].line.style.strokeDashoffset=(routeLength*(1-connectionProgress)).toFixed(1);
      routes[b].line.style.opacity=(.2+.8*connectionProgress).toFixed(2);
      routes[b].line.classList.toggle('is-active',b===active);
      labels[b].style.left=ep.x/10+'%';labels[b].style.top=ep.y/8.6+'%';
      labels[b].style.zIndex=String(Math.round(ep.z+200));
      labels[b].style.setProperty('--depth',ep.s.toFixed(3));
      const pos=point(b,1,t);
      for(let j=0;j<8;j++){
        let v;
        if(j===7)v=pos;
        else{
          const u=.36+j*.085,base=point(b,u,t),spiral=j*2.4+b*.8+t*.12;
          const spread=25+Math.sin(j*1.7+b)*19;
          v=[base[0]+Math.cos(spiral)*spread,base[1]+Math.sin(spiral)*spread,base[2]+Math.sin(spiral+b)*65];
        }
        const p=project(v);positions.push(p);
        const dot=dots[b*8+j];dot.setAttribute('cx',p.x.toFixed(2));dot.setAttribute('cy',p.y.toFixed(2));
        dot.setAttribute('r',((j===7?6:2.7)*p.s).toFixed(2));
        const ignition=reduced.matches?1:clamp((t-(.1+(b*8+(7-j))*.008))/.35);
        dot.setAttribute('opacity',(clamp((p.z+260)/450,.28,.95)*ignition).toFixed(2));
        dot.classList.toggle('near',p.z>50||j===7);
      }
      for(let j=0;j<3;j++){
        const u=1-((t*.12+j/3+b*.075)%1)*.74;
        const p=project(point(b,u,t));const packet=packets[b*3+j];
        packet.setAttribute('cx',p.x.toFixed(2));packet.setAttribute('cy',p.y.toFixed(2));
        packet.setAttribute('r',((b===active?4.5:3.2)*p.s).toFixed(2));
        packet.setAttribute('opacity',((.35+Math.sin((u-.26)/.74*Math.PI)*.65)*convergence).toFixed(2));
      }
    }
    for(let b=0;b<6;b++)for(let j=0;j<7;j++){
      const a=positions[b*8+j],next=positions[b*8+j+1],other=positions[((b+1)%6)*8+Math.min(6,j+1)];
      const line=mesh[b*7+j];
      line.setAttribute('d',path([a,next,other]));
      line.setAttribute('opacity',clamp((a.z+220)/800,.08,.3).toFixed(2));
    }
    for(let k=0;k<3;k++){
      const points=[];const radius=325-k*28;
      for(let j=0;j<=80;j++){
        const a=j*Math.PI/40+t*.025*(k===1?-1:1);
        let x=Math.cos(a)*radius,y=Math.sin(a)*radius,z=0;
        if(k===1){y=Math.sin(a)*radius*.3;z=Math.sin(a)*radius*.85;}
        if(k===2){x=Math.cos(a)*radius*.4;y=Math.sin(a)*radius*.8;z=Math.cos(a)*radius*.83;}
        points.push(project([x*(1-progress*.2),y*(1-progress*.2),z]));
      }
      rings[k].setAttribute('d',path(points,true));
    }
    const gp=project(point(0,1-((t*.12)%1)*.74,t));glow.setAttribute('cx',gp.x.toFixed(2));glow.setAttribute('cy',gp.y.toFixed(2));
    if(frame%8===0){scene.dataset.frame=String(frame);scene.dataset.yaw=projectionYaw.toFixed(3);scene.dataset.pitch=projectionPitch.toFixed(3);scene.dataset.progress=progress.toFixed(3);scene.dataset.pointer=pointerX.toFixed(2)+','+pointerY.toFixed(2);scene.dataset.renderMs=(performance.now()-renderStarted).toFixed(2);}
  }
  function tick(now){
    if(!visible||paused||modalOpen||reduced.matches||document.hidden){request=0;return;}
    const interval=mobile.matches?1000/24:1000/30;
    if(now-last>=interval){const dt=Math.min((now-last)/1000,.075);last=now;time+=dt;lookX+=(pointerX-lookX)*.1;lookY+=(pointerY-lookY)*.1;frame++;render(time);}
    request=requestAnimationFrame(tick);
  }
  function start(){if(!request&&!paused&&!modalOpen&&!reduced.matches&&!document.hidden&&visible){last=performance.now();request=requestAnimationFrame(tick);}}
  function stop(){cancelAnimationFrame(request);request=0;}
  function measure(){const rect=hero.getBoundingClientRect();progress=clamp(-rect.top/(rect.height*.8));hero.style.setProperty('--cinema-progress',reduced.matches?0:progress);if(!request)render(reduced.matches?0:time);}
  let scrollQueued=false;
  scroller.addEventListener('scroll',()=>{if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;measure();});},{passive:true});
  hero.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch'||paused)return;const r=hero.getBoundingClientRect();pointerX=clamp((e.clientX-r.left)/r.width*2-1,-1,1);pointerY=clamp((e.clientY-r.top)/r.height*2-1,-1,1);},{passive:true});
  hero.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
  for(const [i,label] of labels.entries()){
    const select=()=>{active=i;label.classList.add('is-active');if(!request)render(time);};
    const deselect=()=>{active=-1;label.classList.remove('is-active');if(!request)render(time);};
    label.addEventListener('pointerenter',select);label.addEventListener('pointerleave',deselect);label.addEventListener('focus',select);label.addEventListener('blur',deselect);
  }
  toggle.addEventListener('click',()=>{paused=!paused;scene.dataset.motion=paused?'paused':'running';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Riprendi la rete animata':'Metti in pausa la rete animata');toggle.innerHTML=paused?'<span aria-hidden="true">▷</span><span class="cinema-toggle-text">Riprendi rete</span>':'<span aria-hidden="true">Ⅱ</span><span class="cinema-toggle-text">Pausa rete</span>';if(paused)stop();else start();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  document.addEventListener('chp:film-open',()=>{modalOpen=true;stop();});
  document.addEventListener('chp:film-close',()=>{modalOpen=false;start();});
  reduced.addEventListener('change',()=>{scene.dataset.motion=reduced.matches?'reduced':paused?'paused':'running';if(reduced.matches){stop();pointerX=pointerY=lookX=lookY=0;render(0);}else start();measure();});
  addEventListener('resize',measure,{passive:true});
  render(0);measure();start();
}

const openFilm=document.querySelector('#open-chp-film'),filmModal=document.querySelector('#chp-film-modal'),film=document.querySelector('#chp-original-film');
if(openFilm&&filmModal&&film){
  const scroller=document.querySelector('#page-scroll');let previousOverflow='';
  openFilm.addEventListener('click',async()=>{
    previousOverflow=scroller.style.overflow;scroller.style.overflow='hidden';
    if(!film.getAttribute('src'))film.src='film/chp-originale.mp4';
    film.muted=true;film.loop=true;film.playsInline=true;
    filmModal.showModal();
    document.dispatchEvent(new Event('chp:film-open'));
    try{await film.play();}catch{document.querySelector('#cinema-film-status').textContent='Usa i controlli del video per avviare la riproduzione.';}
  });
  document.querySelector('#close-chp-film').addEventListener('click',()=>filmModal.close());
  filmModal.addEventListener('click',e=>{const r=filmModal.getBoundingClientRect();if(e.target===filmModal&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))filmModal.close();});
  filmModal.addEventListener('close',()=>{film.pause();scroller.style.overflow=previousOverflow;openFilm.focus({preventScroll:true});document.dispatchEvent(new Event('chp:film-close'));});
}
