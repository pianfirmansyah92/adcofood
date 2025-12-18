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

// Product detail modal: static modal open/close and add-to-cart (no dynamic population)
(function(){
  const modal = document.getElementById('productModal');
  if(!modal) return;
  const backdrop = modal.querySelector('.modal-backdrop');
  const closeEls = modal.querySelectorAll('[data-close-modal]');
  const addBtn = modal.querySelector('#productModalAdd');

  function openModal(){
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function(e){
    const view = e.target.closest('.view-product');
    if(!view) return;
    e.preventDefault();
    openModal();
  });

  closeEls.forEach(el=> el.addEventListener('click', closeModal));
  backdrop && backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal(); });

  addBtn && addBtn.addEventListener('click', function(){
    const badge = document.querySelector('.badge');
    if(badge){
      const n = parseInt((badge.textContent||'0').trim(), 10) || 0;
      badge.textContent = n + 1;
    }
    showToast('Produk ditambahkan ke keranjang', 'success');
    closeModal();
  });
})();

// Toast helper: show transient messages (success, error, info)
(function(){
  const containerId = 'toastContainer';
  const container = document.getElementById(containerId);
  function buildToast(message, type='info', duration=4000, action){
    const colors = {
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      info: 'bg-gray-800 text-white'
    };
    const toast = document.createElement('div');
    toast.className = `max-w-sm w-full p-3 rounded-lg shadow-lg transform transition-all duration-300 opacity-0 translate-y-3 ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-1 text-sm leading-tight">${message}</div>
      </div>
    `;

    if(action && typeof action.text === 'string' && typeof action.onClick === 'function'){
      const btn = document.createElement('button');
      btn.className = 'ml-3 px-3 py-1 rounded bg-white/10 text-sm text-white';
      btn.textContent = action.text;
      btn.addEventListener('click', ()=>{ action.onClick(); remove(); });
      toast.querySelector('.flex').appendChild(btn);
    }

    function remove(){
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0','translate-y-3');
      setTimeout(()=>{ toast.remove(); }, 350);
    }

    // auto remove
    const timer = setTimeout(remove, duration);

    // clear timer on hover
    toast.addEventListener('mouseenter', ()=> clearTimeout(timer));
    toast.addEventListener('click', remove);

    return {el: toast, remove};
  }

  window.showToast = function(message, type='info', opts={}){
    if(!container) return;
    const {duration=4000, action} = opts;
    const t = buildToast(message, type, duration, action);
    container.appendChild(t.el);
    // trigger enter
    requestAnimationFrame(()=>{ t.el.classList.remove('opacity-0','translate-y-3'); t.el.classList.add('opacity-100','translate-y-0'); });
    return t;
  };
})();

// Cart interactions: quantity +/- and delete
(function(){
  const cartContainer = document.querySelector('main .container');
  if(!cartContainer) return;

  cartContainer.addEventListener('click', function(e){
    const dec = e.target.closest('.qty-decrement');
    const inc = e.target.closest('.qty-increment');
    const del = e.target.closest('.cart-delete');

    if(dec || inc){
      const btn = dec || inc;
      const item = btn.closest('.cart-item');
      if(!item) return;
      const valueEl = item.querySelector('.qty-value');
      const current = parseInt(valueEl.value || '1', 10) || 1;
      let next = current;
      if(dec) next = Math.max(1, current - 1);
      if(inc) next = current + 1;
      valueEl.value = next;
    }

    if(del){
      const item = del.closest('.cart-item');
      if(!item) return;
      // remove item immediately and show undo toast
      const parent = item.parentElement;
      const next = item.nextElementSibling;
      const clone = item.cloneNode(true);
      item.remove();
      const toast = showToast('Item dihapus dari keranjang', 'info', {duration:5000, action:{
        text: 'Undo',
        onClick: ()=>{
          if(next) parent.insertBefore(clone, next); else parent.appendChild(clone);
        }
      }});
    }
  });

  // Handle direct input changes in quantity field
  cartContainer.addEventListener('change', function(e){
    const input = e.target.closest('.qty-value[type=number]');
    if(!input) return;
    let val = parseInt(input.value, 10);
    // enforce minimum value of 1
    if(isNaN(val) || val < 1) val = 1;
    input.value = val;
  });

  // Prevent negative and non-numeric values while typing
  cartContainer.addEventListener('input', function(e){
    const input = e.target.closest('.qty-value[type=number]');
    if(!input) return;
    let val = input.value.trim();
    if(val === '' || val === '-') return; // allow empty or '-' while typing
    let num = parseInt(val, 10);
    if(isNaN(num) || num < 1){
      input.value = '';
    }
  });
})();

// Checkout modal: open/close and basic submit handling
(function(){
  const openBtn = document.getElementById('openCheckout');
  const modal = document.getElementById('checkoutModal');
  const closeElements = modal ? modal.querySelectorAll('[data-close-modal]') : [];
  const form = document.getElementById('checkoutForm');

  if(!modal || !openBtn) return;

  function openModal(){
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    // focus first input for accessibility
    const first = modal.querySelector('input,textarea,button');
    first && first.focus();
  }

  function closeModal(){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);

  closeElements.forEach(el=> el.addEventListener('click', closeModal));

  // close on ESC
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal(); });

  // simple submit handler (validate required fields and captcha)
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const address = (data.get('address') || '').toString().trim();

      if(!name){ showToast('Silakan masukkan nama.', 'error'); return; }
      if(!phone){ showToast('Silakan masukkan nomor Whatsapp.', 'error'); return; }
      if(!address){ showToast('Silakan masukkan alamat pengiriman.', 'error'); return; }

      // check reCAPTCHA v2 response (client-side guard)
      const captchaEl = document.getElementsByName('g-recaptcha-response')[0];
      if(!captchaEl || !captchaEl.value || !captchaEl.value.trim()){
        showToast('Silakan selesaikan reCAPTCHA (I\'m not a robot).', 'error');
        return;
      }

      // TODO: send to server via fetch() if needed (also verify token server-side)
      showToast('Pesanan berhasil dikirim. Terima kasih.', 'success', {duration:5000});
      form.reset();
      closeModal();
    });
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
