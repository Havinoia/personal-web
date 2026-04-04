<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { usePortfolioStore } from "../stores/portfolioStore";
import emailjs from "@emailjs/browser";

const store = usePortfolioStore();
const router = useRouter();

// Modals & Active State
const techModalVisible = ref(false);
const techModalClosing = ref(false);
const activeTech = ref(null);
const certModal = ref(null);
const certModalVisible = ref(false);
const certModalClosing = ref(false);

// Observers & Frames
let observerIn = null;
let observerOut = null;
let resizeObserver = null;
let aboutScrollFrame = null;

// Timers
let resizeTimer = null;
let typeTimer = null;
let cursorTimer = null;
let skillsFilterTimer = null;

const aboutSection = ref(null);
const aboutHeader = ref(null);
const aboutStage = ref(null);
const aboutProgress = ref(0);

function openTechModal(tech) {
  activeTech.value = tech;
  techModalVisible.value = true;
  techModalClosing.value = false;
  document.body.style.overflow = "hidden";
}

function closeTechModal() {
  techModalClosing.value = true;
  setTimeout(() => {
    techModalVisible.value = false;
    activeTech.value = null;
    document.body.style.overflow = "";
  }, 260);
}

const aboutParagraph = computed(() => store.profile.bio || "");
const aboutWords = computed(() => aboutParagraph.value.trim().length ? aboutParagraph.value.trim().split(/\s+/) : []);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateAboutProgress() {
  const section = aboutSection.value;
  const header = aboutHeader.value;
  const stage = aboutStage.value;
  if (!section || !header || typeof window === "undefined") return;

  const headerRect = header.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const startLine = viewportHeight * 0.86;
  const endDistance = Math.max(viewportHeight * 0.9, 1);
  let traveled = startLine - headerRect.top;

  if (stage) {
    const stageRect = stage.getBoundingClientRect();
    const stageOffset = Math.max(0, startLine - stageRect.top);
    traveled = Math.max(traveled, stageOffset * 0.9);
  }

  aboutProgress.value = clamp(traveled / endDistance, 0, 1);
}

function requestAboutProgressUpdate() {
  if (aboutScrollFrame) return;
  aboutScrollFrame = requestAnimationFrame(() => {
    aboutScrollFrame = null;
    updateAboutProgress();
  });
}

function getAboutWordStyle(index) {
  const totalWords = Math.max(aboutWords.value.length, 1);
  const sequencePosition = aboutProgress.value * (totalWords + 4);
  const rawReveal = clamp(sequencePosition - index + 0.15, 0, 1);
  const reveal = rawReveal * rawReveal * (3 - 2 * rawReveal);
  const xOffset = (((index % 5) - 2) * 8) * (1 - reveal);
  const yOffset = (10 + (index % 4) * 3.5) * (1 - reveal);
  const rotation = (((index % 4) - 1.5) * 0.9) * (1 - reveal);

  return {
    opacity: (0.04 + reveal * 0.96).toFixed(3),
    transform: `translate3d(${(xOffset * 1.2).toFixed(1)}px, ${(yOffset * 1.35).toFixed(1)}px, 0) rotate(${(rotation * 1.35).toFixed(1)}deg) scale(${(0.95 + reveal * 0.05).toFixed(3)})`,
    filter: `blur(${((1 - reveal) * 5.8).toFixed(2)}px)`,
    color:
      reveal > 0.96
        ? "var(--text)"
        : `rgba(236, 255, 240, ${(0.24 + reveal * 0.56).toFixed(3)})`,
  };
}

function getAboutParagraphStyle() {
  const eased = clamp((aboutProgress.value - 0.03) / 0.88, 0, 1);
  const reveal = eased * eased * (3 - 2 * eased);

  return {
    opacity: (0.08 + reveal * 0.92).toFixed(3),
    transform: `translate3d(0, ${(28 * (1 - reveal)).toFixed(1)}px, 0) scale(${(0.97 + reveal * 0.03).toFixed(3)})`,
    filter: `blur(${((1 - reveal) * 10).toFixed(2)}px)`,
  };
}

// TECH STACK — Filter & Animate
const activeFilter = ref("All");
const displayedSkills = ref([]);
const isFilteringSkills = ref(false);
const skillsViewKey = ref(0);

const skillsGridShell = ref(null);
const minSkillsHeight = ref(0);

function updateMinSkillsHeight() {
  if (activeFilter.value === "All" && skillsGridShell.value) {
    requestAnimationFrame(() => {
      if (skillsGridShell.value) {
        // Simpan min-height lama
        const oldMin = skillsGridShell.value.style.minHeight;
        // Reset min-height via DOM saja untuk ukur
        skillsGridShell.value.style.minHeight = "0px";
        
        requestAnimationFrame(() => {
          if (skillsGridShell.value) {
            const h = skillsGridShell.value.offsetHeight;
            if (h > 100) { // Safety check
              minSkillsHeight.value = h;
            }
          }
          // Kembalikan via style binding (Vue akan handle setelah ini)
          if (skillsGridShell.value) {
            skillsGridShell.value.style.minHeight = oldMin;
          }
        });
      }
    });
  }
}

const normalizedSkills = computed(() =>
  store.skills.flatMap((category, categoryIndex) =>
    category.items.map((item, itemIndex) => ({
      id: `${category.category}-${item.name || item}-${categoryIndex}-${itemIndex}`,
      name: item.name || item,
      img: item.img || null,
      desc: item.desc || null,
      setupCode: item.setupCode || null,
      docUrl: item.docUrl || null,
      cat: category.category,
    })),
  ),
);

const filterOptions = computed(() => [
  "All",
  ...new Set(store.skills.map((skill) => skill.category)),
]);

function getSkillsByFilter(category = activeFilter.value) {
  if (category === "All") return normalizedSkills.value;
  return normalizedSkills.value.filter((skill) => skill.cat === category);
}

function syncDisplayedSkills(category = activeFilter.value) {
  displayedSkills.value = getSkillsByFilter(category);
  skillsViewKey.value += 1;
  if (category === "All") {
    updateMinSkillsHeight();
  }
}

const setFilter = (cat) => {
  if (activeFilter.value === cat && !isFilteringSkills.value) return;
  activeFilter.value = cat;
  isFilteringSkills.value = true;

  clearTimeout(skillsFilterTimer);
  skillsFilterTimer = setTimeout(() => {
    syncDisplayedSkills(cat);
    requestAnimationFrame(() => {
      if (activeFilter.value === cat) {
        isFilteringSkills.value = false;
      }
    });
  }, 140);
};

// ════════════════════════════════════════
// CERT MODAL
// ════════════════════════════════════════

function openCert(cert) {
  certModal.value = cert;
  certModalVisible.value = true;
  certModalClosing.value = false;
  document.body.style.overflow = "hidden";
}
function closeCert() {
  certModalClosing.value = true;
  setTimeout(() => {
    certModalVisible.value = false;
    certModal.value = null;
    certModalClosing.value = false;
    document.body.style.overflow = "";
  }, 280);
}
function onModalKeydown(e) {
  if (e.key === "Escape" && certModalVisible.value) closeCert();
}

// ════════════════════════════════════════
// SCROLL FADE
// ════════════════════════════════════════

function initScrollFade() {
  const els = document.querySelectorAll(".scroll-fade");
  observerIn = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.classList.remove("fade-out");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
  );
  observerOut = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          entry.target.classList.add("fade-out");
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0 },
  );
  els.forEach((el) => {
    observerIn.observe(el);
    observerOut.observe(el);
  });
}

function hasFinePointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

// Cert card 3D tilt
function onCertMouseMove(e) {
  if (!hasFinePointer()) return;
  const card = e.currentTarget;
  const shine = card?.querySelector(".cert-card-shine");
  if (!card || !shine) return;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const rotY = ((x - cx) / cx) * 5.5;
  const rotX = ((cy - y) / cy) * 4;
  card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.018)`;
  card.style.setProperty("--cert-pointer-x", `${(x / rect.width) * 100}%`);
  card.style.setProperty("--cert-pointer-y", `${(y / rect.height) * 100}%`);
  card.style.setProperty("--cert-tilt-x", `${(x - cx) * 0.08}px`);
  card.style.setProperty("--cert-tilt-y", `${(y - cy) * 0.06}px`);
  shine.style.opacity = "1";
}
function onCertMouseLeave(e) {
  const card = e.currentTarget;
  const shine = card?.querySelector(".cert-card-shine");
  if (!card || !shine) return;
  card.style.transform = "";
  card.style.removeProperty("--cert-pointer-x");
  card.style.removeProperty("--cert-pointer-y");
  card.style.removeProperty("--cert-tilt-x");
  card.style.removeProperty("--cert-tilt-y");
  shine.style.opacity = "";
}

// ════════════════════════════════════════
// PORTO SCROLL
// ════════════════════════════════════════
const MIN_REPEAT = 10;
const MIN_CARDS = 20;

function getCardW() {
  const el = scrollContainer.value;
  if (!el) return 350;
  const card = el.querySelector(".porto-card");
  if (card) return card.offsetWidth;
  // Fallback ke nilai CSS jika card belum render
  return window.innerWidth <= 480 ? Math.min(window.innerWidth * 0.82, 280) : 350;
}
function getGap() {
  const el = scrollContainer.value;
  if (!el) return 22;
  const styles = window.getComputedStyle(el);
  const gapStr = styles.columnGap || styles.gap;
  if (!gapStr || gapStr === 'normal') return 22;
  const gap = parseFloat(gapStr);
  return Number.isFinite(gap) ? gap : 22;
}
function getStride() {
  return getCardW() + getGap();
}

const isLoopMode = computed(() => store.projects.length >= 10);
const loopedProjects = computed(() => {
  const p = store.projects;
  if (!p.length) return [];
  if (!isLoopMode.value) return p;
  const times = Math.max(Math.ceil(MIN_CARDS / p.length), MIN_REPEAT);
  return Array.from({ length: times }, () => p).flat();
});

const scrollContainer = ref(null);
const activeIndex = ref(0);
const paddingInline = ref(0);
const TOTAL = computed(() => store.projects.length);

// Typewriter
const typewriterText = ref("");
const showCursor = ref(true);
const phrases = [
  "My Web Portfolio",
  "Fullstack Projects",
  "Open for Collaboration",
];
let phraseIdx = 0,
  charIdx = 0,
  isDeleting = false;

function typewrite() {
  const current = phrases[phraseIdx];
  if (!isDeleting) {
    typewriterText.value = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      typeTimer = setTimeout(() => {
        isDeleting = true;
        typewrite();
      }, 1800);
      return;
    }
    typeTimer = setTimeout(typewrite, 80);
  } else {
    typewriterText.value = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeTimer = setTimeout(typewrite, 320);
      return;
    }
    typeTimer = setTimeout(typewrite, 40);
  }
}

// Contact Form
const form = ref({ name: "", email: "", subject: "", message: "" });
const formStatus = ref("");
async function submitForm() {
  // Basic validation
  if (!form.value.name || !form.value.email || !form.value.message) {
    formStatus.value = "error";
    setTimeout(() => (formStatus.value = ""), 3000);
    return;
  }
  
  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    formStatus.value = "error";
    console.error("Invalid email format");
    setTimeout(() => (formStatus.value = ""), 3000);
    return;
  }
  formStatus.value = "sending";
  try {
    await emailjs.send(
      "service_mwdlpz9",
      "template_z6rojrs",
      {
        from_name: form.value.name,
        from_email: form.value.email,
        subject: form.value.subject,
        message: form.value.message,
      },
      "Q9iPwGcdzweQMDht0",
    );
    formStatus.value = "success";
    form.value = { name: "", email: "", subject: "", message: "" };
    setTimeout(() => (formStatus.value = ""), 4000);
  } catch (err) {
    console.error(err);
    formStatus.value = "error";
    setTimeout(() => (formStatus.value = ""), 4000);
  }
}

// Scroll / drag
let isDown = false,
  isDragging = false;
let startX = 0,
  scrollStart = 0;
let momentumId = null,
  snapId = null;
let vel = 0,
  lastX = 0,
  lastT = 0;

function getNearestIndexLoop() {
  const el = scrollContainer.value;
  if (!el) return 0;
  const center = el.scrollLeft + el.clientWidth / 2;
  return Math.round((center - getCardW() / 2) / getStride());
}
function getTargetForIndex(i) {
  const el = scrollContainer.value;
  return i * getStride() + getCardW() / 2 - el.clientWidth / 2;
}
function checkLoop() {
  const el = scrollContainer.value;
  if (!el || !isLoopMode.value) return;
  const setW = getStride() * TOTAL.value;
  const half = Math.floor(loopedProjects.value.length / TOTAL.value / 2);
  if (el.scrollLeft > setW * (half + 2)) el.scrollLeft -= setW * half;
  if (el.scrollLeft < setW * (half - 2)) el.scrollLeft += setW * half;
}
function snapToIndexLoop(i) {
  if (snapId) cancelAnimationFrame(snapId);
  if (momentumId) cancelAnimationFrame(momentumId);
  const el = scrollContainer.value;
  const target = getTargetForIndex(i);
  const dur = Math.min(
    Math.max(160, Math.abs(el.scrollLeft - target) * 0.35),
    440,
  );
  activeIndex.value = ((i % TOTAL.value) + TOTAL.value) % TOTAL.value;
  const s = el.scrollLeft,
    d = target - s,
    t0 = performance.now();
  function run(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.scrollLeft = s + d * (1 - Math.pow(1 - p, 4));
    if (p < 1) snapId = requestAnimationFrame(run);
    else {
      el.scrollLeft = target;
      checkLoop();
      activeIndex.value =
        ((getNearestIndexLoop() % TOTAL.value) + TOTAL.value) % TOTAL.value;
    }
  }
  snapId = requestAnimationFrame(run);
}
function snapNearestLoop() {
  checkLoop();
  snapToIndexLoop(getNearestIndexLoop());
}

function recalcPadding() {
  const el = scrollContainer.value;
  if (!el) return;
  paddingInline.value = Math.max(0, Math.round(el.clientWidth / 2 - getCardW() / 2));
}
function getNearestIndexNoLoop() {
  const el = scrollContainer.value;
  if (!el) return 0;
  const center = el.scrollLeft + el.clientWidth / 2;
  let best = 0,
    bestDist = Infinity;
  store.projects.forEach((_, i) => {
    const mid = paddingInline.value + i * getStride() + getCardW() / 2;
    const dist = Math.abs(center - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}
function getTargetNoLoop(i) {
  return (
    paddingInline.value +
    i * getStride() +
    getCardW() / 2 -
    scrollContainer.value.clientWidth / 2
  );
}
function snapToIndexNoLoop(i) {
  if (snapId) cancelAnimationFrame(snapId);
  if (momentumId) cancelAnimationFrame(momentumId);
  const clamped = Math.max(0, Math.min(i, TOTAL.value - 1));
  const el = scrollContainer.value;
  const target = getTargetNoLoop(clamped);
  const dur = Math.min(
    Math.max(160, Math.abs(el.scrollLeft - target) * 0.35),
    440,
  );
  activeIndex.value = clamped;
  const s = el.scrollLeft,
    d = target - s,
    t0 = performance.now();
  function run(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.scrollLeft = s + d * (1 - Math.pow(1 - p, 4));
    if (p < 1) snapId = requestAnimationFrame(run);
    else {
      el.scrollLeft = target;
      activeIndex.value = clamped;
    }
  }
  snapId = requestAnimationFrame(run);
}
function snapNearestNoLoop() {
  snapToIndexNoLoop(getNearestIndexNoLoop());
}

function snapNearest() {
  isLoopMode.value ? snapNearestLoop() : snapNearestNoLoop();
}
function getActiveFromScroll() {
  return isLoopMode.value
    ? ((getNearestIndexLoop() % TOTAL.value) + TOTAL.value) % TOTAL.value
    : getNearestIndexNoLoop();
}
function scrollPrev() {
  isLoopMode.value
    ? snapToIndexLoop(getNearestIndexLoop() - 1)
    : snapToIndexNoLoop(getNearestIndexNoLoop() - 1);
}
function scrollNext() {
  isLoopMode.value
    ? snapToIndexLoop(getNearestIndexLoop() + 1)
    : snapToIndexNoLoop(getNearestIndexNoLoop() + 1);
}
function tryOpenProject(e) {
  const container = scrollContainer.value;
  if (!container) return;
  const cardEl = e.target.closest(".porto-card");
  if (!cardEl) return;
  const all = [...container.querySelectorAll(".porto-card")];
  const idx = all.indexOf(cardEl);
  const proj = loopedProjects.value[idx];
  if (!proj) return;
  if (idx !== -1)
    isLoopMode.value
      ? snapToIndexLoop(idx)
      : snapToIndexNoLoop(idx % TOTAL.value);
  if (proj.id) router.push({ name: 'project-detail', params: { id: proj.id } });
}
function startMomentum() {
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId) cancelAnimationFrame(snapId);
  const el = scrollContainer.value;
  if (!el) return;
  let v = Math.sign(vel * 16 * 8) * Math.min(Math.abs(vel * 16 * 8), 55);
  if (Math.abs(v) < 0.8) {
    snapNearest();
    return;
  }
  function run() {
    v *= 0.91;
    el.scrollLeft -= v;
    if (isLoopMode.value) checkLoop();
    activeIndex.value = getActiveFromScroll();
    if (Math.abs(v) > 0.5) momentumId = requestAnimationFrame(run);
    else snapNearest();
  }
  momentumId = requestAnimationFrame(run);
}

function onMouseDown(e) {
  const el = scrollContainer.value;
  if (!el) return;
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId) cancelAnimationFrame(snapId);
  isDown = true;
  isDragging = false;
  startX = e.pageX;
  scrollStart = el.scrollLeft;
  lastX = e.pageX;
  lastT = performance.now();
  vel = 0;
  el.style.cursor = "grabbing";
}
function onMouseMove(e) {
  const el = scrollContainer.value;
  if (!isDown || !el) return;
  e.preventDefault();
  const dx = e.pageX - startX;
  if (Math.abs(dx) > 10) isDragging = true;
  if (!isDragging) return;
  const now = performance.now(),
    dt = now - lastT;
  if (dt > 0) vel = (e.pageX - lastX) / dt;
  lastX = e.pageX;
  lastT = now;
  el.scrollLeft = scrollStart - dx;
  if (isLoopMode.value) checkLoop();
  activeIndex.value = getActiveFromScroll();
}
function onMouseUp(e) {
  const el = scrollContainer.value;
  if (!isDown) return;
  isDown = false;
  if (el) el.style.cursor = "grab";
  if (!isDragging) {
    tryOpenProject(e);
    isDragging = false;
    return;
  }
  isDragging = false;
  startMomentum();
}
function onMouseLeave() {
  const el = scrollContainer.value;
  if (!isDown) return;
  isDown = false;
  isDragging = false;
  if (el) el.style.cursor = "grab";
  startMomentum();
}

let tStart = 0,
  tScroll = 0,
  tLastX = 0,
  tLastT = 0,
  tVel = 0,
  tDrag = false;
function onTouchStart(e) {
  const el = scrollContainer.value;
  if (!el) return;
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId) cancelAnimationFrame(snapId);
  tStart = e.touches[0].pageX;
  tScroll = el.scrollLeft;
  tLastX = e.touches[0].pageX;
  tLastT = performance.now();
  tVel = 0;
  tDrag = false;
}
function onTouchMove(e) {
  const el = scrollContainer.value;
  if (!el) return;
  const dx = e.touches[0].pageX - tStart;
  if (Math.abs(dx) > 10) tDrag = true;
  if (!tDrag) return;
  const now = performance.now(),
    dt = now - tLastT;
  if (dt > 0) tVel = (e.touches[0].pageX - tLastX) / dt;
  tLastX = e.touches[0].pageX;
  tLastT = now;
  el.scrollLeft = tScroll - dx;
  if (isLoopMode.value) checkLoop();
  activeIndex.value = getActiveFromScroll();
}
function onTouchEnd(e) {
  if (!tDrag) {
    tryOpenProject(e);
    return;
  }
  tDrag = false;
  vel = tVel;
  startMomentum();
}

function onTouchCancel() {
  tDrag = false;
  tVel = 0;
}

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    recalcPadding();
    updateMinSkillsHeight();
    if (isLoopMode.value) snapNearestLoop();
    else snapToIndexNoLoop(activeIndex.value);
    requestAboutProgressUpdate();
  }, 150);
}

onMounted(() => {
  const el = scrollContainer.value;
  syncDisplayedSkills();

  if (el) {
    // 1. ResizeObserver untuk menjaga posisi tengah tetap stabil
    resizeObserver = new ResizeObserver(() => {
      recalcPadding();
      // Hanya snap otomatis jika tidak sedang ditarik/drag
      if (!isDown && !tDrag) snapNearest();
    });
    resizeObserver.observe(el);

    // 2. Inisialisasi Posisi (Gunakan timeout kecil agar layout settle)
    setTimeout(() => {
      recalcPadding();
      if (isLoopMode.value) {
        const totalRepeats = loopedProjects.value.length / TOTAL.value;
        const startIdx = Math.floor(totalRepeats / 2) * TOTAL.value;
        el.scrollLeft = getTargetForIndex(startIdx);
        requestAnimationFrame(() => snapNearestLoop());
      } else {
        snapToIndexNoLoop(0);
      }
    }, 100);
  }

  // 2. Event Listeners Global
  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onModalKeydown);
  window.addEventListener("scroll", requestAboutProgressUpdate, {
    passive: true,
  });

  // 3. Efek Visual (Typewriter & Cursor)
  typeTimer = setTimeout(typewrite, 600);
  cursorTimer = setInterval(() => {
    showCursor.value = !showCursor.value;
  }, 530);

  // 4. Inisialisasi Observer (Fade-in & Tech Stack Reveal)
  // Digabung dalam satu timeout singkat agar tidak memberatkan loading awal
  setTimeout(() => {
    initScrollFade();
    updateMinSkillsHeight();
  }, 150);

  requestAboutProgressUpdate();
});

onUnmounted(() => {
  // 1. Hentikan Animasi (Scroll & Momentum)
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId) cancelAnimationFrame(snapId);
  if (aboutScrollFrame) cancelAnimationFrame(aboutScrollFrame);

  // 2. Bersihkan Timer & Interval
  clearTimeout(typeTimer);
  clearTimeout(resizeTimer);
  clearTimeout(skillsFilterTimer);
  clearInterval(cursorTimer);

  // 3. Lepas Event Listeners
  window.removeEventListener("resize", onResize);
  window.removeEventListener("keydown", onModalKeydown);
  window.removeEventListener("scroll", requestAboutProgressUpdate);
  if (resizeObserver) resizeObserver.disconnect();

  // 4. Matikan Semua Observer (Mencegah Memory Leak)
  [observerIn, observerOut].forEach((obs) => {
    if (obs && typeof obs.disconnect === "function") obs.disconnect();
  });

  // 5. Reset State Global (Penting jika pindah halaman)
  document.body.style.overflow = "";
});
</script>

<template>
  <main>
    <!-- ═══ HERO ═══ -->
    <section class="hero" id="home">
      <div class="hero-grid"></div>

      <div class="hero-typewriter-wrap">
        <div class="hero-typewriter-inner">
          <span class="hero-typewriter">{{ typewriterText }}</span>
          <span class="hero-cursor" :class="{ visible: showCursor }">|</span>
        </div>
      </div>

      <div class="hero-porto-row" id="portfolio">
        <button
          type="button"
          class="porto-arrow porto-arrow-left"
          aria-label="Project sebelumnya"
          @click="scrollPrev"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div
          class="porto-scroll"
          ref="scrollContainer"
          :style="{
            paddingLeft: paddingInline + 'px',
            paddingRight: paddingInline + 'px',
            scrollPaddingInline: paddingInline + 'px',
          }"
          @mousedown="onMouseDown"
          @mouseup="onMouseUp"
          @mouseleave="onMouseLeave"
          @mousemove="onMouseMove"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @touchcancel="onTouchCancel"
        >
          <div
            v-for="(project, index) in loopedProjects"
            :key="`${project.id ?? 'project'}-${index}`"
            class="porto-card"
            :class="{ active: index % store.projects.length === activeIndex }"
          >
            <div class="porto-card-glow"></div>
            <div class="porto-card-thumb">
              <img
                v-if="project.image || project.gallery?.length"
                :src="project.image || project.gallery[0]"
                :alt="project.title"
                class="porto-card-img"
                loading="lazy"
                draggable="false"
                @error="(e) => (e.target.style.display = 'none')"
              />
              <span
                v-else
                style="font-size: 36px; position: relative; z-index: 1"
                >{{ project.emoji }}</span
              >
            </div>
            <div class="porto-card-body">
              <div class="porto-card-meta">{{ project.year }}</div>
              <div class="porto-card-title">{{ project.title }}</div>
              <div class="porto-card-tags">
                <span
                  v-for="tag in project.tags.slice(0, 10)"
                  :key="tag"
                  class="porto-card-tag"
                  >{{ tag }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="porto-arrow porto-arrow-right"
          aria-label="Project berikutnya"
          @click="scrollNext"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div class="hero-center">
        <div class="hero-photo-wrap">
          <div class="hero-photo-glow"></div>
          <div class="hero-photo-aura hero-photo-aura-one"></div>
          <div class="hero-photo-aura hero-photo-aura-two"></div>
          <div class="hero-photo-pill hero-photo-pill-top">
            <span class="hero-photo-pill-label">Experience</span>
            <strong>{{ store.profile.yearsExp || "3" }} Years</strong>
          </div>
          <div class="hero-photo-pill hero-photo-pill-bottom">
            <span class="hero-photo-pill-dot"></span>
            {{ store.projects.length || "10" }} Projects shipped
          </div>
          <div class="hero-photo-frame">
            <div class="hero-photo-frame-inner">
              <img
                v-if="store.profile.photo"
                :src="store.profile.photo"
                :alt="store.profile.name"
                class="hero-photo-img"
              />
              <div v-else class="hero-photo-placeholder">
                <div class="photo-silhouette">
                  <div class="photo-silhouette-body"></div>
                </div>
              </div>
            </div>
            <div class="hero-photo-shine"></div>
            <div class="hero-photo-corner hero-photo-corner-top"></div>
            <div class="hero-photo-corner hero-photo-corner-bottom"></div>
          </div>
          <div class="hero-status-badge">
            <div class="hero-eyebrow-dot"></div>
            Available for Work
          </div>
        </div>

        <div class="hero-info-wrap">
          <div class="hero-info">
            <h1 class="hero-name">
              <span class="first">{{ store.profile.name.split(" ")[0] }}</span>
              <span class="last">{{
                store.profile.name.split(" ").slice(1).join(" ")
              }}</span>
            </h1>
            <div class="hero-role">{{ store.profile.role }}</div>
            <div class="hero-actions">
              <a href="#portfolio" class="btn-primary">
                <span
                  >View Portfolio
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </a>
              <a href="#contact" class="btn-secondary">Contact Me</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ ABOUT ═══ -->
    <section class="about-section about-scroll-section" id="about" ref="aboutSection">
      <div class="about-scroll-track">
        <div class="about-sticky-shell">
          <div class="section-header about-header" ref="aboutHeader">
        <div class="section-label scroll-fade">About</div>
        <h2 class="section-title scroll-fade" data-delay="1">
          Building thoughtful products from interface to infrastructure
        </h2>
        <p class="section-sub scroll-fade" data-delay="2">
          {{ store.profile.role }} based in
          {{ store.profile.location || "Indonesia" }}
        </p>
          </div>

          <div class="about-text-stage" ref="aboutStage">
            <p
              class="about-word-paragraph about-word-paragraph-animated"
              :aria-label="aboutParagraph"
              :style="getAboutParagraphStyle()"
            >
              <span
                v-for="(word, index) in aboutWords"
                :key="`${word}-${index}`"
                class="about-word"
                :style="getAboutWordStyle(index)"
              >
                {{ word }}
              </span>
            </p>
            <p class="about-word-paragraph about-word-paragraph-hidden" :aria-hidden="true">
              {{
                store.profile.bio ||
                "Seorang fullstack developer yang passionate dalam membangun produk digital yang elegan dan fungsional. Saya suka bekerja di semua lapisan — dari desain UI hingga arsitektur backend."
              }}
            </p>
            <div class="about-scroll-hint">
              Scroll to Adjust Paragraph Order
            </div>
          </div>

          <div class="about-side-stack">
          <div class="about-mini-card scroll-fade" data-delay="2">
            <div class="about-mini-title">Highlights</div>
            <div class="about-stats">
              <div class="about-stat">
                <span class="about-stat-num"
                  >{{ store.profile.yearsExp || "2" }}+</span
                >
                <span class="about-stat-label">Tahun Pengalaman</span>
              </div>
              <div class="about-stat-divider"></div>
              <div class="about-stat">
                <span class="about-stat-num"
                  >{{ store.projects.length || "10" }}+</span
                >
                <span class="about-stat-label">Project Selesai</span>
              </div>
              <div class="about-stat-divider"></div>
              <div class="about-stat">
                <span class="about-stat-num"
                  >{{ store.profile.clients || "8" }}+</span
                >
                <span class="about-stat-label">Client Puas</span>
              </div>
            </div>
          </div>

          <div class="about-mini-card scroll-fade" data-delay="3">
            <div class="about-mini-title">Details</div>
            <div class="about-chips">
              <div class="about-chip" v-if="store.profile.location">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {{ store.profile.location }}
              </div>
              <div class="about-chip" v-if="store.profile.university">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                {{ store.profile.university }}
              </div>
              <div class="about-chip">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {{
                  store.profile.availability || "Tersedia fulltime & freelance"
                }}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>

    <!-- ═══ TECH STACK — Floating Icon Grid ═══ -->
    <section class="skills-section" id="skills">
      <div class="section-header">
        <div class="section-label">Tech Stack</div>
        <h2 class="section-title">Tools & Technologies</h2>
        <p class="section-sub">My everyday development toolkit</p>
      </div>

      <div class="skills-filter">
        <button
          v-for="opt in filterOptions"
          :key="opt"
          type="button"
          class="skills-filter-btn"
          :class="{ active: activeFilter === opt }"
          :aria-pressed="activeFilter === opt"
          @click="setFilter(opt)"
        >
          {{ opt }}
        </button>
      </div>

      <div class="skills-container-centered">
        <div
          ref="skillsGridShell"
          class="skills-grid-shell"
          :class="{ 'is-filtering': isFilteringSkills }"
          :style="{ minHeight: minSkillsHeight + 'px' }"
        >
          <div
            :key="skillsViewKey"
            class="skills-icon-grid"
          >
            <div
              v-for="(item, i) in displayedSkills"
              :key="item.id"
              class="skill-icon-box"
              style="cursor: pointer;"
              @click="openTechModal(item)"
              :style="{
                '--delay': i * 0.04 + 's',
                '--float-delay': i * 0.18 + 's',
              }"
            >
              <div class="skill-icon-wrap">
                <img
                  v-if="item.img"
                  :src="item.img"
                  :alt="item.name"
                  class="skill-icon-img"
                />
                <span v-else class="skill-icon-emoji">⚡</span>
              </div>
              <span class="skill-icon-label">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CERTIFICATIONS ═══ -->
    <section class="cert-section" id="certifications">
      <div class="section-header">
        <div class="section-label scroll-fade">Achievements</div>
        <h2 class="section-title scroll-fade" data-delay="1">Certifications</h2>
        <p class="section-sub scroll-fade" data-delay="2">
          Certificates and achievements I have earned
        </p>
      </div>

      <div class="cert-grid">
        <template v-if="store.cert && store.cert.length">
          <div
            v-for="(cert, i) in store.cert"
            :key="cert.id || i"
            class="cert-card scroll-fade"
            :data-delay="String((i % 6) + 1)"
            @mousemove="onCertMouseMove"
            @mouseleave="onCertMouseLeave"
            @click="openCert(cert)"
          >
            <div class="cert-card-shine"></div>
            <div class="cert-card-img-wrap">
              <img
                v-if="cert.image"
                :src="cert.image"
                :alt="cert.title"
                class="cert-card-img"
                loading="lazy"
                draggable="false"
              />
              <div v-else class="cert-fallback-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div class="cert-card-overlay">
                <div class="cert-view-btn">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View Certificate
                </div>
              </div>
            </div>
            <div class="cert-card-body">
              <div class="cert-card-issuer">{{ cert.issuer || "Issuer" }}</div>
              <div class="cert-card-title">{{ cert.title }}</div>
              <div class="cert-card-footer">
                <span class="cert-card-date">{{ cert.date || "2024" }}</span>
                <span class="cert-card-badge">✓ Verified</span>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div
            v-for="n in 4"
            :key="'ph-' + n"
            class="cert-card scroll-fade"
            :data-delay="String(n)"
            @mousemove="onCertMouseMove"
            @mouseleave="onCertMouseLeave"
            @click="
              openCert({
                title: 'Nama Sertifikasi ' + n,
                issuer: 'Issuer Name',
                date: '2024',
                description:
                  'Deskripsi sertifikasi ini akan muncul di sini. Tambahkan field description di portfolioStore.js untuk mengisi konten ini.',
                image: null,
              })
            "
          >
            <div class="cert-card-shine"></div>
            <div class="cert-card-img-wrap">
              <div class="cert-fallback-icon">🏆</div>
              <div class="cert-card-overlay">
                <div class="cert-view-btn">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View Certificate
                </div>
              </div>
            </div>
            <div class="cert-card-body">
              <div class="cert-card-issuer">Issuer Name</div>
              <div class="cert-card-title">Nama Sertifikasi Anda {{ n }}</div>
              <div class="cert-card-footer">
                <span class="cert-card-date">2024</span>
                <span class="cert-card-badge">✓ Verified</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- ═══ TECH MODAL ═══ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="techModalVisible" class="tech-modal-overlay" :class="{ closing: techModalClosing }" @click.self="closeTechModal">
          <div class="tech-modal" :class="{ closing: techModalClosing }">
            <button class="tech-modal-close" @click="closeTechModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <div class="tech-modal-header">
              <div class="tech-modal-icon-wrap">
                <img v-if="activeTech?.img" :src="activeTech.img" class="tech-modal-icon" alt=""/>
                <span v-else class="tech-modal-emoji">⚡</span>
              </div>
              <div class="tech-modal-header-text">
                <h3 class="tech-modal-title">{{ activeTech?.name }}</h3>
                <p class="tech-modal-eyebrow">Technology Overview</p>
              </div>
            </div>

            <p class="tech-modal-detailed-desc" v-if="activeTech?.desc">
              {{ activeTech.desc }}
            </p>
            <p class="tech-modal-detailed-desc" v-else>
              Pelajari cara instalasi dan penggunaan teknologi ini melalui terminal atau dokumentasi resmi.
            </p>
            
            <div class="tech-modal-terminal" v-if="activeTech?.setupCode">
              <div class="tech-terminal-top">
                <div class="tech-terminal-dots"><span class="t-red"></span><span class="t-yellow"></span><span class="t-green"></span></div>
                <span class="tech-terminal-label">Terminal</span>
              </div>
              <pre class="tech-terminal-code"><code><span class="t-command-win">C:\Users\example&gt; <span class="t-cmd-text">{{ activeTech.setupCode }}</span></span>
<span class="t-command-lin"><span class="t-usr">example@linux</span>:<span class="t-dir">~</span>$ <span class="t-cmd-text">{{ activeTech.setupCode }}</span></span></code></pre>
            </div>

            <div class="tech-modal-actions">
              <a v-if="activeTech?.docUrl" :href="activeTech.docUrl" target="_blank" class="tech-btn-docs">
                Official Documentation
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ CERT MODAL ═══ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="certModalVisible"
          class="cert-modal-overlay"
          :class="{ closing: certModalClosing }"
          @click.self="closeCert"
        >
          <div class="cert-modal" :class="{ closing: certModalClosing }">
            <!-- Close btn -->
            <button class="cert-modal-close" @click="closeCert">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <!-- Image -->
            <div class="cert-modal-img-wrap">
              <img
                v-if="certModal?.image"
                :src="certModal.image"
                :alt="certModal.title"
                class="cert-modal-img"
              />
              <div v-else class="cert-modal-img-placeholder">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
            </div>

            <!-- Info -->
            <div class="cert-modal-body">
              <div class="cert-modal-issuer">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                {{ certModal?.issuer || "Issuer" }}
              </div>
              <h3 class="cert-modal-title">{{ certModal?.title }}</h3>
              <div class="cert-modal-meta">
                <span class="cert-modal-date">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {{ certModal?.date || "2024" }}
                </span>
                <span class="cert-modal-badge">✓ Verified</span>
              </div>
              <p class="cert-modal-desc" v-if="certModal?.description">
                {{ certModal.description }}
              </p>

              <a
                v-if="certModal?.link"
                :href="certModal.link"
                target="_blank"
                rel="noopener noreferrer"
                class="cert-modal-link"
              >
                Show Detail
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ CONTACT ═══ -->
    <section class="contact-section" id="contact">
      <div class="section-header">
        <div class="section-label scroll-fade">Contact</div>
        <h2 class="section-title scroll-fade" data-delay="1">
          Have an idea? Let’s make it real
        </h2>
        <p class="section-sub scroll-fade" data-delay="2">
          Have an interesting project? I'm always open to discussion
        </p>
      </div>
      <div class="contact-grid">
        <ul class="contact-info-list" aria-label="Contact links">
          <li v-if="store.contact?.email_img" class="scroll-fade" data-delay="1">
            <a
              :href="`mailto:${store.profile.email}`"
              class="contact-info-item"
              aria-label="Email"
              title="Email"
            >
              <span class="contact-info-icon">
                <img
                  :src="store.contact.email_img"
                  class="contact-info-img"
                  alt="Email"
                />
              </span>
            </a>
          </li>
          <li
            v-if="store.contact?.whatsapp_img"
            class="scroll-fade"
            data-delay="2"
          >
            <a
              :href="'https://wa.me/6281252205174?text=Halo%20saya%20tertarik%20dengan%20project%20anda'"
              target="_blank"
              rel="noreferrer"
              class="contact-info-item"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <span class="contact-info-icon">
                <img
                  :src="store.contact.whatsapp_img"
                  class="contact-info-img"
                  alt="WhatsApp"
                />
              </span>
            </a>
          </li>
          <li
            v-if="store.contact?.instagram_img"
            class="scroll-fade"
            data-delay="3"
          >
            <a
              :href="store.contact?.instagram"
              target="_blank"
              rel="noreferrer"
              class="contact-info-item"
              aria-label="Instagram"
              title="Instagram"
            >
              <span class="contact-info-icon">
                <img
                  :src="store.contact.instagram_img"
                  class="contact-info-img"
                  alt="Instagram"
                />
              </span>
            </a>
          </li>
          <li
            v-if="store.contact?.github_img"
            class="scroll-fade"
            data-delay="4"
          >
            <a
              :href="store.profile.github"
              target="_blank"
              rel="noreferrer"
              class="contact-info-item"
              aria-label="GitHub"
              title="GitHub"
            >
              <span class="contact-info-icon">
                <img
                  :src="store.contact.github_img"
                  class="contact-info-img"
                  alt="GitHub"
                />
              </span>
            </a>
          </li>
        </ul>

        <form
          class="contact-form scroll-fade"
          data-delay="2"
          @submit.prevent="submitForm"
        >
          <div class="form-row">
            <div class="form-group">
              <input
                class="form-input"
                type="text"
                placeholder="Name"
                aria-label="Nama"
                v-model="form.name"
              />
            </div>
            <div class="form-group">
              <input
                class="form-input"
                type="email"
                placeholder="Email"
                aria-label="Email"
                v-model="form.email"
              />
            </div>
          </div>
          <div class="form-group">
            <input
              class="form-input"
              type="text"
              placeholder="Subject"
              aria-label="Subjek"
              v-model="form.subject"
            />
          </div>
          <div class="form-group">
            <textarea
              class="form-textarea"
              placeholder="Tell me about your project"
              aria-label="Pesan"
              v-model="form.message"
            ></textarea>
          </div>
          <div v-if="formStatus === 'success'" class="form-status success">
            ✓ Message sent successfully! I will get back to you soon.
          </div>
          <div v-else-if="formStatus === 'error'" class="form-status error">
            ✕ Failed to send. Please make sure all fields are filled or try again.
          </div>
          <button
            type="submit"
            class="btn-submit"
            :disabled="formStatus === 'sending'"
          >
            <span v-if="formStatus === 'sending'">Sending...</span>
            <span
              v-else
              style="display: inline-flex; align-items: center; gap: 8px"
            >
              Send Message
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </span>
          </button>
          <div class="form-footer">
            <span class="form-powered-by">Powered by EmailJS</span>
          </div>
        </form>
      </div>
    </section>


  </main>
</template>
