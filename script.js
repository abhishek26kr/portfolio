const GALLERIES = {
  nyree: {
    images: [
      "assets/nyree-dashboard.jpg",
      "assets/nyree-billing.jpg",
      "assets/nyree-inventory.jpg",
      "assets/nyree-reports.jpg"
    ],
    labels: ["01 · DASHBOARD","02 · BILLING","03 · INVENTORY","04 · REPORTS"],
    captions: [
      "Operational overview for sales, stock levels, credit and expiry watch.",
      "Fast billing flow with medicine search, payment method and bill completion.",
      "Stock-batch view for quantity, expiry, purchase price, MRP and status.",
      "Sales reporting with payment breakdown, top products and date filters."
    ]
  },
  media: {
    images: [
      "assets/media-hero.jpg",
      "assets/media-impact.jpg",
      "assets/media-packages.jpg",
      "assets/media-audience.jpg"
    ],
    labels: ["01 · HERO","02 · REACH","03 · PACKAGES","04 · AUDIENCE"],
    captions: [
      "A creator media-kit homepage designed to turn profile traffic into collaboration leads.",
      "Analytics section built around audience reach and platform performance.",
      "Collaboration packages presented as a clear product-like pricing experience.",
      "Audience and demographic information organized for brand decision-making."
    ]
  },
  velo: {
    images: ["assets/velotask.jpg"],
    labels: ["01 · LIVE WEB EXPERIENCE"],
    captions: ["VeloTask: task management, focus sessions, timer controls and activity tracking."]
  }
};

const WORKFLOWS = {
  study: {
    label:"01 / STUDY",
    title:"AI as an interactive tutor.",
    description:"I use the first answer as a starting point, not the finish line.",
    steps:["Explain","Example","Practice","Quiz","Evaluate","Revise"]
  },
  code: {
    label:"02 / CODE",
    title:"AI as a debugging partner.",
    description:"The goal is understanding the bug — not copying a fix I cannot explain.",
    steps:["Problem","Review","Why?","My fix","Test","Learn"]
  },
  research: {
    label:"03 / RESEARCH",
    title:"AI as a research assistant.",
    description:"Start with a question, challenge assumptions and synthesize only what survives checking.",
    steps:["Question","Research","Compare","Cross-check","Synthesize","Notes"]
  },
  build: {
    label:"04 / BUILD",
    title:"AI as a product co-pilot.",
    description:"AI can accelerate product work, but the human still has to understand the problem and test the result.",
    steps:["Problem","Requirements","Plan","Prototype","Test","Iterate"]
  }
};

function qs(sel, parent=document){ return parent.querySelector(sel); }
function qsa(sel, parent=document){ return [...parent.querySelectorAll(sel)]; }

// ----- Workflow panel -----
const panel = qs("#workflow-panel");
const panelLabel = qs(".panel-label");
const panelTitle = qs(".panel-copy h3");
const panelDescription = qs(".panel-copy p");
const stepTrack = qs("#step-track");

function renderWorkflow(key){
  const data = WORKFLOWS[key];
  if(!data) return;
  panelLabel.textContent = data.label;
  panelTitle.textContent = data.title;
  panelDescription.textContent = data.description;
  stepTrack.innerHTML = data.steps.map((step, i) =>
    `<span class="step"><b>${String(i+1).padStart(2,"0")}</b>${step}</span>`
  ).join("");
}
qsa(".workflow-card").forEach(card => {
  card.addEventListener("click", () => renderWorkflow(card.dataset.workflow));
});
renderWorkflow("study");

// ----- Galleries on page -----
function bindGallery(name, mainId, captionId){
  const data = GALLERIES[name];
  const main = qs(`#${mainId}`);
  const caption = qs(`#${captionId}`);
  const tabs = qsa(`[data-gallery="${name}"]`);
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const index = Number(tab.dataset.index);
      main.src = data.images[index];
      main.alt = `${data.labels[index]} screenshot`;
      caption.textContent = data.captions[index];
      tabs.forEach(t => t.classList.toggle("active", Number(t.dataset.index) === index));
    });
  });
}
bindGallery("nyree","nyree-main","nyree-caption");
bindGallery("media","media-main","media-caption");

// ----- Lightbox -----
const lightbox = qs("#lightbox");
const lightboxImage = qs("#lightbox-image");
const lightboxLabel = qs("#lightbox-label");
const lightboxCount = qs("#lightbox-count");
const lightboxCaption = qs("#lightbox-caption");
let activeGallery = "nyree";
let activeIndex = 0;

function openLightbox(name, index){
  activeGallery = name;
  activeIndex = index;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}
function updateLightbox(){
  const data = GALLERIES[activeGallery];
  lightboxImage.src = data.images[activeIndex];
  lightboxImage.alt = `${data.labels[activeIndex]} screenshot`;
  lightboxLabel.textContent = data.labels[activeIndex];
  lightboxCount.textContent = `${String(activeIndex+1).padStart(2,"0")} / ${String(data.images.length).padStart(2,"0")}`;
  lightboxCaption.textContent = data.captions[activeIndex];
}
function closeLightbox(){
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
function nextImage(){
  const data = GALLERIES[activeGallery];
  activeIndex = (activeIndex + 1) % data.images.length;
  updateLightbox();
}
function prevImage(){
  const data = GALLERIES[activeGallery];
  activeIndex = (activeIndex - 1 + data.images.length) % data.images.length;
  updateLightbox();
}

qsa(".image-trigger").forEach(trigger => {
  trigger.addEventListener("click", () => {
    openLightbox(trigger.dataset.gallery, Number(trigger.dataset.index));
  });
});
qsa("[data-close-lightbox]").forEach(el => el.addEventListener("click", closeLightbox));
qs("#next-image").addEventListener("click", nextImage);
qs("#prev-image").addEventListener("click", prevImage);
document.addEventListener("keydown", e => {
  if(!lightbox.classList.contains("open")) return;
  if(e.key === "Escape") closeLightbox();
  if(e.key === "ArrowRight") nextImage();
  if(e.key === "ArrowLeft") prevImage();
});

// ----- Scroll progress -----
const progress = qs("#progress");
function updateProgress(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio*100))}%`;
}
window.addEventListener("scroll", updateProgress, {passive:true});
updateProgress();

// ----- Reveal animations -----
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.1});
qsa(".reveal").forEach(el => observer.observe(el));

// ----- Copy email -----
const copyButton = qs("#copy-email");
if(copyButton){
  copyButton.addEventListener("click", async () => {
    const email = "abhishekkumargurua26@gmail.com";
    try{
      await navigator.clipboard.writeText(email);
      copyButton.textContent = "Copied ✓";
      setTimeout(() => copyButton.textContent = "Copy email", 1600);
    }catch{
      window.prompt("Copy this email:", email);
    }
  });
}

// Keep gallery tab selection in sync when opened from the page.
qsa('[data-gallery="nyree"], [data-gallery="media"]').forEach(tab => {
  tab.addEventListener("dblclick", () => {
    openLightbox(tab.dataset.gallery, Number(tab.dataset.index));
  });
});
