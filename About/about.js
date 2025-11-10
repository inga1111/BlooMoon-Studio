 
gsap.from(".about-title", { opacity: 0, y: -40, duration: 1.3, ease: "power2.out" });
gsap.from(".about-subtitle", { opacity: 0, y: -20, duration: 1.1, delay: 0.3, ease: "power2.out" });

 
gsap.utils.toArray(".card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
    },
    opacity: 0,
    y: 60,
    duration: 1,
    delay: i * 0.1,
    ease: "power2.out",
  });
});

 
fetch("../main.js")
  .then(() => {
    if (typeof loadNavBar === "function") loadNavBar();
    if (typeof loadFooter === "function") loadFooter();
  });

// --- Flip card behavior for team members ---
document.addEventListener('DOMContentLoaded', () => {
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    const figure = card.closest('.team-member');
    // populate back content from data attributes if present
    const ig = figure?.dataset?.instagram || '';
    const qual = figure?.dataset?.qualification || '';
    const back = card.querySelector('.back-content');
    if (back) {
      const igEl = back.querySelector('.ig');
      const qEl = back.querySelector('.qual');
      if (igEl) igEl.textContent = ig || igEl.textContent;
      if (qEl) qEl.textContent = (qual ? 'Qualification: ' + qual : qEl.textContent);
    }

    function toggleFlip(e) {
      card.classList.toggle('is-flipped');
      const pressed = card.classList.contains('is-flipped');
      card.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    }

    // click/tap
    card.addEventListener('click', (e) => {
      toggleFlip(e);
    });

    // keyboard: Enter or Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip(e);
      }
    });
  });
});
