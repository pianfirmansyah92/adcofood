// Lightweight carousel for hero and products
(function(){
  // Hero carousel (only initialize when element exists)
  const hero = document.getElementById('heroCarousel');
  if(hero){
    const heroTrack = hero.querySelector('.hero-track');
    const heroSlides = Array.from(heroTrack.children);
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    const heroDots = document.getElementById('heroDots');
    let heroIndex = 0;
    const heroCount = heroSlides.length;
    let heroInterval = null;

    function renderHero(){
      heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;
      // dots
      if(heroDots) {
        heroDots.innerHTML = '';
        for(let i=0;i<heroCount;i++){
          const btn = document.createElement('button');
          btn.className = 'w-2 h-2 rounded-full ' + (i===heroIndex? 'bg-orange-400 w-8':'bg-white/40');
          btn.addEventListener('click', ()=>{ heroIndex=i; updateHero(); resetHeroTimer(); });
          heroDots.appendChild(btn);
        }
      }
    }

    function updateHero(){ renderHero(); }
    function prevHero(){ heroIndex = (heroIndex-1+heroCount)%heroCount; updateHero(); }
    function nextHero(){ heroIndex = (heroIndex+1)%heroCount; updateHero(); }
    function resetHeroTimer(){ clearInterval(heroInterval); heroInterval = setInterval(nextHero,5000); }

    heroPrev && heroPrev.addEventListener('click', ()=>{ prevHero(); resetHeroTimer(); });
    heroNext && heroNext.addEventListener('click', ()=>{ nextHero(); resetHeroTimer(); });

    renderHero();
    resetHeroTimer();
  }

  // Products carousel (1 on mobile, 2 on tablet, 3 on desktop)
  const prod = document.getElementById('productsCarousel');
  if(prod){
    const prodTrack = prod.querySelector('.products-track');
    const prodItems = Array.from(prodTrack.children);
    const prodPrev = document.getElementById('prodPrev');
    const prodNext = document.getElementById('prodNext');
    let prodIndex = 0;
    function slidesPerView(){
      if(window.matchMedia('(min-width:1024px)').matches) return 3;
      if(window.matchMedia('(min-width:768px)').matches) return 2;
      return 1;
    }
    // compute pixel widths so transforms are accurate with gap
    function updateProducts(){
      const spv = slidesPerView();
      const containerWidth = prod.clientWidth;
      // read actual gap from CSS for accuracy (fallback to 16px)
      const computed = getComputedStyle(prodTrack);
      const gap = parseFloat(computed.gap) || parseFloat(computed.columnGap) || 16;
      const totalGap = (spv - 1) * gap;
      const itemWidth = Math.floor((containerWidth - totalGap) / spv);

      prodItems.forEach(item=>{
        item.style.width = `${itemWidth}px`;
        item.style.flex = `0 0 ${itemWidth}px`;
      });

      // ensure index within bounds
      const maxIndex = Math.max(0, prodItems.length - spv);
      if(prodIndex > maxIndex) prodIndex = maxIndex;

      const offset = (itemWidth + gap) * prodIndex * -1;
      prodTrack.style.transform = `translateX(${offset}px)`;
    }

    prodPrev && prodPrev.addEventListener('click', ()=>{ prodIndex = Math.max(0, prodIndex-1); updateProducts(); });
    prodNext && prodNext.addEventListener('click', ()=>{ const spv = slidesPerView(); prodIndex = Math.min(prodItems.length - spv, prodIndex+1); updateProducts(); });

    window.addEventListener('resize', updateProducts);
    // initial layout after images/DOM available
    setTimeout(updateProducts, 50);
  }

  // Testimonials carousel (1 on mobile, 2 on desktop)
  const test = document.getElementById('testimonialsCarousel');
  if(test){
    const testTrack = test.querySelector('.testimonials-track');
    const testItems = Array.from(testTrack.children);
    const testDotsContainer = document.getElementById('testDots');
    let testIndex = 0;
    let testInterval = null;

    function slidesPerViewTest(){
      if(window.matchMedia('(min-width:768px)').matches) return 2;
      return 1;
    }

    function updateTestimonials(){
      const spv = slidesPerViewTest();
      const containerWidth = test.clientWidth;
      const computed = getComputedStyle(testTrack);
      const gap = parseFloat(computed.gap) || parseFloat(computed.columnGap) || 16;
      const totalGap = (spv - 1) * gap;
      const itemWidth = Math.floor((containerWidth - totalGap) / spv);

      testItems.forEach(item=>{
        item.style.width = `${itemWidth}px`;
        item.style.flex = `0 0 ${itemWidth}px`;
      });

      const spvVal = slidesPerViewTest();
      const maxIndex = Math.max(0, testItems.length - spvVal);
      if(testIndex > maxIndex) testIndex = maxIndex;

      const offset = (itemWidth + gap) * testIndex * -1;
      testTrack.style.transform = `translateX(${offset}px)`;

      // update dots
      if(testDotsContainer){
        testDotsContainer.innerHTML = '';
        const numDots = Math.ceil(testItems.length / spvVal);
        for(let i=0; i<numDots; i++){
          const dot = document.createElement('button');
          dot.className = 'w-2 h-2 rounded-full ' + (i===testIndex ? 'bg-[#308136] w-8' : 'bg-gray-300');
          dot.addEventListener('click', ()=>{ testIndex=i; updateTestimonials(); resetTestimonialTimer(); });
          testDotsContainer.appendChild(dot);
        }
      }
    }

    function nextTestimonial(){
      const spv = slidesPerViewTest();
      const maxIndex = Math.max(0, testItems.length - spv);
      testIndex = (testIndex + 1) > maxIndex ? 0 : testIndex + 1;
      updateTestimonials();
    }

    function resetTestimonialTimer(){
      clearInterval(testInterval);
      testInterval = setInterval(nextTestimonial, 5000);
    }

    window.addEventListener('resize', updateTestimonials);
    setTimeout(()=>{ updateTestimonials(); resetTestimonialTimer(); }, 50);
  }
})();

// Mobile menu: open/close handlers
(function(){
  const toggle = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('menuClose');
  const overlay = document.getElementById('menuOverlay');
  const menu = document.getElementById('mobileMenu');

  if(!toggle || !menu) return;

  function openMenu(){
    menu.setAttribute('aria-hidden','false');
    toggle.setAttribute('aria-expanded','true');
    overlay.classList.remove('hidden');
    menu.focus();
    // prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function closeMenu(){
    menu.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', openMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);
  overlay && overlay.addEventListener('click', closeMenu);

  // close on ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeMenu();
  });
})();

// Header scroll handler: add background when scrolling past hero section
(function(){
  const header = document.querySelector('.site-header');
  const heroSection = document.querySelector('.hero');
  if(!header || !heroSection) return;

  // Simple scroll-based handler: add `scrolled` when window scroll passes hero height.
  function onScroll(){
    const heroHeight = heroSection.offsetHeight;
    if(window.scrollY > heroHeight){
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll);
  // initial check in case page loads already scrolled
  onScroll();
})();

// Clients marquee: JS-driven infinite carousel that clones items to avoid gaps
(function(){
  const track = document.querySelector('.clients-track');
  if(!track) return;
  const container = track.parentElement;

  track.style.display = track.style.display || 'flex';

  let speed = 18; // px per second (slower)
  let offset = 0;
  let lastTime = performance.now();
  let paused = false;

  function getGap(){
    const style = getComputedStyle(track);
    return parseFloat(style.gap) || 24;
  }

  function computeTrackWidth(){
    const children = Array.from(track.children);
    const gap = getGap();
    const widths = children.map(ch => ch.getBoundingClientRect().width || 0);
    const total = widths.reduce((s,n)=>s+n,0) + Math.max(0, children.length-1) * gap;
    return total;
  }

  function ensureEnoughContent(){
    // clone original items until track width >= container width * 2
    const originalItems = Array.from(track.children);
    let total = computeTrackWidth();
    const target = (container.getBoundingClientRect().width || window.innerWidth) * 2;
    let guard = 0;
    while(total < target && guard < 10){
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden','true');
        track.appendChild(clone);
      });
      total = computeTrackWidth();
      guard++;
    }
  }

  function step(now){
    if(paused){ lastTime = now; requestAnimationFrame(step); return; }
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    offset += speed * dt;

    const first = track.children[0];
    if(first){
      const gap = getGap();
      const firstWidth = first.getBoundingClientRect().width + gap;
      if(offset >= firstWidth){
        offset -= firstWidth;
        track.appendChild(first);
      }
    }

    track.style.transform = `translateX(${-offset}px)`;
    requestAnimationFrame(step);
  }

  function init(){
    ensureEnoughContent();
    // start marquee
    lastTime = performance.now();
    requestAnimationFrame(step);
  }

  // pause on hover
  container.addEventListener('mouseenter', ()=>{ paused = true; });
  container.addEventListener('mouseleave', ()=>{ paused = false; lastTime = performance.now(); });

  // recompute on load and resize (images need to load for accurate widths)
  window.addEventListener('load', init);
  window.addEventListener('resize', ()=>{ /* recompute clones if needed */ setTimeout(()=>{ ensureEnoughContent(); },120); });

  // kick off early in case images already loaded
  setTimeout(init, 120);
})();
