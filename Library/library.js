
(function () {
  // ---------- Helpers ----------
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      // If script already loaded (check by src presence), resolve
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  function ensurePlugins() {
    // returns Promise that resolves when ScrollTrigger & MotionPathPlugin are available & registered
    const cdnBase = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/';
    const toLoad = [];

    if (typeof ScrollTrigger === 'undefined') {
      toLoad.push(loadScript(cdnBase + 'ScrollTrigger.min.js'));
    }

    if (typeof MotionPathPlugin === 'undefined') {
      toLoad.push(loadScript(cdnBase + 'MotionPathPlugin.min.js'));
    }

    if (toLoad.length === 0) {
      // already present
      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
      return Promise.resolve();
    }

    return Promise.all(toLoad)
      .then(() => {
        // register if available
        try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* ignore */ }
        try { gsap.registerPlugin(MotionPathPlugin); } catch (e) { /* ignore */ }
      })
      .catch(err => {
        console.warn('Could not load one or more GSAP plugins:', err);
      });
  }

  // ---------- Core: preserve existing logic & add animations ----------
  document.addEventListener('DOMContentLoaded', async () => {
    // Keep original username logic
    const usernameSpan = document.getElementById('username');
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser && usernameSpan) usernameSpan.textContent = storedUser;

    // ORIGINAL small GSAP animations you already had (preserved)
    try {
      if (typeof gsap !== 'undefined') {
        if (document.getElementById('welcome-text')) {
          gsap.from("#welcome-text", { opacity: 0, y: -20, duration: 1.4, ease: "power2.out" });
        }
        if (document.getElementById('username')) {
          gsap.to("#username", { color: "#ff67a6ff", repeat: -1, yoyo: true, duration: 2 });
        }
      } else {
        console.warn('gsap not found — existing small animations skipped.');
      }
    } catch (err) {
      console.warn('Existing GSAP animations error (non-fatal):', err);
    }

    // Keep poster click -> store selectedFilm & redirect behaviour
    const posters = document.querySelectorAll('.film-poster');
    posters.forEach(poster => {
      poster.addEventListener('click', () => {
        const data = poster.dataset;
        localStorage.setItem('selectedFilm', JSON.stringify(data));
        // Redirect to details using correct relative path from Library folder
        window.location.href = 'library-details.html';
      });
    });

    // Ensure ScrollTrigger & MotionPathPlugin available, then animate extras
    await ensurePlugins();

    // If gsap not available still, bail gracefully
    if (typeof gsap === 'undefined') {
      console.warn('gsap missing — enhanced animations skipped.');
      return;
    }

    // 1) Page-level entrance timeline (header -> gallery)
    const pageTL = gsap.timeline({ defaults: { ease: 'power2.out' } });
    // animate nav (if exists), welcome header, and then reveal cards in stagger
    const navEl = document.querySelector('nav');
    const welcomeEl = document.querySelector('.library-header');
    const cards = $all('.film-card');

    if (navEl) pageTL.from(navEl, { y: -50, opacity: 0, duration: 0.9 });
    if (welcomeEl) pageTL.from(welcomeEl, { y: -20, opacity: 0, duration: 0.9 }, "-=0.5");

    // Stagger first-row of cards gracefully (only small stagger to not clash with ScrollTrigger later)
    if (cards.length) {
      pageTL.from(cards.slice(0, Math.min(6, cards.length)), {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.08
      }, "-=0.4");
    }

    // 2) ScrollTrigger fade-in per card (so offscreen cards fade in when scrolled into view)
    try {
      // Use ScrollTrigger if available
      if (typeof ScrollTrigger !== 'undefined') {
        cards.forEach(card => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: 'power2.out'
          });
        });
      } else {
        // fallback: simple stagger reveal if ScrollTrigger missing
        gsap.from(cards, { opacity: 0, y: 24, duration: 0.6, stagger: 0.06, ease: 'power2.out' });
      }
    } catch (err) {
      console.warn('ScrollTrigger animations failed (non-fatal):', err);
    }

    // 3) MotionPath / SVG decorative animation (small moon that glides across header)
    try {
      if (typeof MotionPathPlugin !== 'undefined') {
        const header = document.querySelector('header') || document.querySelector('.library-header') || document.querySelector('nav');
        if (header) {
          // create an SVG container and small path + circle
          const svgNS = "http://www.w3.org/2000/svg";
          const svg = document.createElementNS(svgNS, 'svg');
          svg.setAttribute('width', '180');
          svg.setAttribute('height', '80');
          svg.setAttribute('viewBox', '0 0 180 80');
          svg.style.position = 'absolute';
          svg.style.right = '20px';
          svg.style.top = '10px';
          svg.style.pointerEvents = 'none';
          svg.style.overflow = 'visible';

          // path curve
          const path = document.createElementNS(svgNS, 'path');
          path.setAttribute('d', 'M10,60 C50,10 130,10 170,60');
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', 'rgba(255,255,255,0.0)');
          path.setAttribute('id', 'moonPath');

          // moon circle
          const circle = document.createElementNS(svgNS, 'circle');
          circle.setAttribute('r', '8');
          circle.setAttribute('cx', '10');
          circle.setAttribute('cy', '60');
          circle.setAttribute('fill', '#ffd6e0');
          circle.setAttribute('stroke', 'rgba(0,0,0,0.05)');
          circle.setAttribute('stroke-width', '1');

          svg.appendChild(path);
          svg.appendChild(circle);

          // append to header but ensure header is positioned relatively to host absolute svg nicely
          header.style.position = header.style.position || 'relative';
          header.appendChild(svg);

          // animate circle along path
          gsap.to(circle, {
            duration: 8,
            repeat: -1,
            ease: 'sine.inOut',
            motionPath: {
              path: path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false
            }
          });

          // subtle scale/pulse to add life
          gsap.to(circle, { scale: 0.85, transformOrigin: '50% 50%', repeat: -1, yoyo: true, duration: 2 });
        }
      }
    } catch (err) {
      console.warn('MotionPath decorative animation failed (non-fatal):', err);
    }

    // 4) tiny hover micro-interaction on poster using GSAP (adds dimension but doesn't replace your CSS)
    $all('.film-poster').forEach(img => {
      img.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.06, duration: 0.4, ease: 'power2.out' });
      });
      img.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
      });
    });

    // END of DOMContentLoaded
  }); // DOMContentLoaded
})();
