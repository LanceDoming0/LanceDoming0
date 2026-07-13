(()=>{
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=matchMedia('(pointer: coarse)').matches;

  // Reference-style preloader.
  const preloader=document.querySelector('#page-preloader');
  const removePreloader=()=>{if(!preloader)return;preloader.classList.add('preloader-hidden');setTimeout(()=>preloader.remove(),520);};
  addEventListener('load',()=>setTimeout(removePreloader,180),{once:true});
  setTimeout(removePreloader,2800);

  // Reference animation system (same AOS timing/feel as the supplied site).
  if(window.AOS){AOS.init({duration:850,easing:'ease-out-cubic',once:false,mirror:true,offset:95,anchorPlacement:'top-bottom'});}

  // Strong scroll-triggered reveal transitions for the restored timeline.
  const scrollRevealNodes=[...document.querySelectorAll('[data-scroll-reveal]')];
  if(scrollRevealNodes.length){
    if(reduced||!('IntersectionObserver' in window)){scrollRevealNodes.forEach(el=>el.classList.add('is-revealed'));}
    else{
      const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-revealed');}
        else if(entry.boundingClientRect.top>0){entry.target.classList.remove('is-revealed');}
      }),{threshold:.16,rootMargin:'0px 0px -7% 0px'});
      scrollRevealNodes.forEach(el=>revealObserver.observe(el));
    }
  }

  // Typed rotating professional titles.
  const typedTarget=document.querySelector('.typed');
  if(typedTarget){
    const items=(typedTarget.dataset.typedItems||'Junior Web Developer,IT Support Technician,Digital Assistant').split(',').map(s=>s.trim());
    if(window.Typed&&!reduced){new Typed('.typed',{strings:items,loop:true,typeSpeed:100,backSpeed:50,backDelay:2000,smartBackspace:true});}
    else typedTarget.textContent=items[0];
  }

  // Smooth scroll, mobile menu close, and navigation scroll spy.
  const links=[...document.querySelectorAll('.navbar-nav .nav-link[href^="#"]')];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy=()=>{const y=scrollY+135;links.forEach(a=>a.classList.remove('active'));sections.forEach((s,i)=>{if(y>=s.offsetTop&&y<s.offsetTop+s.offsetHeight)links[i]?.classList.add('active');});};
  addEventListener('scroll',spy,{passive:true});spy();
  document.querySelectorAll('.navbar-collapse .nav-link').forEach(a=>a.addEventListener('click',()=>{const c=document.querySelector('.navbar-collapse');if(c?.classList.contains('show')&&window.bootstrap)bootstrap.Collapse.getOrCreateInstance(c).hide();}));

  // Scroll progress and back-to-top control.
  const progress=document.querySelector('#scroll-progress'),scrollTopBtn=document.querySelector('.scroll-top');
  const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;const pct=max>0?scrollY/max*100:0;if(progress)progress.style.width=pct+'%';if(scrollTopBtn)scrollTopBtn.classList.toggle('active',scrollY>320);};
  addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll,{passive:true});updateScroll();
  scrollTopBtn?.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:reduced?'auto':'smooth'});});

  // Project image lightbox, matching the reference portfolio behavior.
  if(window.GLightbox){GLightbox({selector:'.glightbox',touchNavigation:true,loop:true,zoomable:true,openEffect:'zoom',closeEffect:'fade'});}

  // Animated portfolio filters, matching the reference Isotope layout.
  document.querySelectorAll('.isotope-layout').forEach(layout=>{
    const container=layout.querySelector('.row'); if(!container||!window.Isotope)return;
    const init=()=>{
      const iso=new Isotope(container,{itemSelector:'.isotope-item',layoutMode:layout.dataset.layout||'fitRows',filter:layout.dataset.defaultFilter||'*',transitionDuration:'0.55s'});
      layout.querySelectorAll('.isotope-filters li').forEach(btn=>btn.addEventListener('click',()=>{
        layout.querySelector('.filter-active')?.classList.remove('filter-active');btn.classList.add('filter-active');iso.arrange({filter:btn.dataset.filter});
        setTimeout(()=>window.AOS?.refresh(),620);
      }));
    };
    if(window.imagesLoaded)imagesLoaded(container,init);else init();
  });

  // Count-up animation for the statistics strip.
  const statNums=[...document.querySelectorAll('.stat strong')];
  if(statNums.length){
    const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;const el=entry.target;const raw=el.textContent.trim();const match=raw.match(/^(\d+)(.*)$/);if(!match||reduced){countObserver.unobserve(el);return;}
      const end=Number(match[1]),suffix=match[2],start=performance.now(),dur=900;
      const tick=now=>{const p=Math.min((now-start)/dur,1);const eased=1-Math.pow(1-p,3);el.textContent=Math.round(end*eased)+suffix;if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);countObserver.unobserve(el);
    }),{threshold:.7});statNums.forEach(el=>countObserver.observe(el));
  }

  // Responsive 3D hover system. Scroll animations stay on the outer Bootstrap columns,
  // while the inner cards react to the mouse with depth, glare, and directional shadow.
  const hover3DSelector=[
    '.service-card','.experience-card','.education-card','.restored-tool-cloud',
    '.support-card','.project-card','.info-card','.contact-item','.contact-panel',
    '.stats-box','.case-media','.case-copy','.about-photo','.about-copy'
  ].join(',');
  const hover3DNodes=[...document.querySelectorAll(hover3DSelector)];

  hover3DNodes.forEach((card,index)=>{
    card.classList.add('hover-3d');
    card.style.setProperty('--card-index',String(index));
    if(reduced||coarse)return;

    let raf=0;
    const update=e=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const rect=card.getBoundingClientRect();
        const x=Math.min(Math.max((e.clientX-rect.left)/rect.width,0),1);
        const y=Math.min(Math.max((e.clientY-rect.top)/rect.height,0),1);
        const rotateY=(x-.5)*15;
        const rotateX=(.5-y)*12;
        const shadowX=(x-.5)*-24;
        const shadowY=(y-.5)*-18+24;
        card.style.setProperty('--rx',`${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--ry',`${rotateY.toFixed(2)}deg`);
        card.style.setProperty('--spot-x',`${(x*100).toFixed(1)}%`);
        card.style.setProperty('--spot-y',`${(y*100).toFixed(1)}%`);
        card.style.setProperty('--shadow-x',`${shadowX.toFixed(1)}px`);
        card.style.setProperty('--shadow-y',`${shadowY.toFixed(1)}px`);
      });
    };
    const enter=()=>card.classList.add('is-3d-hovered');
    const reset=()=>{
      cancelAnimationFrame(raf);
      card.classList.remove('is-3d-hovered');
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
      card.style.setProperty('--spot-x','50%');
      card.style.setProperty('--spot-y','50%');
      card.style.setProperty('--shadow-x','0px');
      card.style.setProperty('--shadow-y','24px');
    };

    card.addEventListener('pointerenter',enter,{passive:true});
    card.addEventListener('pointermove',update,{passive:true});
    card.addEventListener('pointerleave',reset,{passive:true});
    card.addEventListener('pointercancel',reset,{passive:true});
  });

  // Hero portrait parallax, keeping the real unaltered face.
  const stage=document.querySelector('.hero-photo-stage'),photo=document.querySelector('.hero-photo');
  if(stage&&photo&&!reduced&&!coarse){stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;photo.style.transform=`translate3d(${x*12}px,${y*9}px,35px) scale(1.015)`;});stage.addEventListener('pointerleave',()=>photo.style.transform='translate3d(0,0,35px)');}

  // Magnetic buttons.
  document.querySelectorAll('.btn-main,.btn-ghost,.hero-social a,.portfolio-filters li').forEach(el=>{el.classList.add('magnetic');if(reduced||coarse)return;el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.1}px,${y*.1}px)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});

  // Cursor glow.
  const glow=document.querySelector('.cursor-glow');
  if(glow&&!coarse&&!reduced){addEventListener('pointermove',e=>{glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`;},{passive:true});document.addEventListener('mouseleave',()=>glow.style.opacity='0');document.addEventListener('mouseenter',()=>glow.style.opacity='.34');}

  // Lightweight animated particle network.
  const canvas=document.querySelector('#ambient-canvas');
  if(canvas&&!reduced){
    const ctx=canvas.getContext('2d',{alpha:true});let w=0,h=0,dpr=1,pts=[],raf=0,running=true;
    const resize=()=>{dpr=Math.min(devicePixelRatio||1,1.6);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(76,Math.max(34,Math.floor(w/24)));pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16,r:Math.random()*1.4+.35}));};
    const draw=()=>{if(!running)return;ctx.clearRect(0,0,w,h);for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.fillStyle='rgba(89,213,255,.38)';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);if(dist<115){ctx.strokeStyle=`rgba(64,173,255,${(1-dist/115)*.08})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}raf=requestAnimationFrame(draw);};
    resize();draw();addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',()=>{running=!document.hidden;if(running)draw();else cancelAnimationFrame(raf);});
  }
})();
