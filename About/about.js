 
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
