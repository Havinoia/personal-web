<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { usePortfolioStore } from "../stores/portfolioStore";
import emailjs from "@emailjs/browser";

const store = usePortfolioStore();

// ── About panel ──
const showAbout = ref(false);
const aboutPanel = ref(null);

function toggleAbout() {
  showAbout.value = !showAbout.value;
  if (showAbout.value) {
    setTimeout(() => {
      aboutPanel.value?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
  }
}

// ══════════════════════════════════════════════════════════════
// SCROLL FADE — fade in saat masuk viewport, fade out saat terlewati
// ══════════════════════════════════════════════════════════════
let observerIn  = null;
let observerOut = null;

function initScrollFade() {
  const els = document.querySelectorAll(".scroll-fade");

  // Observer untuk FADE IN — elemen masuk viewport dari bawah
  observerIn = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.classList.remove("fade-out");
        }
      });
    },
    {
      threshold:  0.1,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  // Observer untuk FADE OUT — elemen keluar viewport ke atas
  observerOut = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Jika tidak terlihat DAN posisinya di atas viewport
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          entry.target.classList.add("fade-out");
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0 }
  );

  els.forEach((el) => {
    observerIn.observe(el);
    observerOut.observe(el);
  });
}

// ══════════════════════════════════════════════════════════════
// PORTO SCROLL
// ══════════════════════════════════════════════════════════════
const GAP          = 20;
const CENTER_OFFSET = -30;
const MIN_REPEAT   = 10;
const MIN_CARDS    = 20;

function getCardW() {
  const card = scrollContainer.value?.querySelector(".porto-card");
  return card ? card.offsetWidth : 320;
}
function getStride() { return getCardW() + GAP; }

const isLoopMode = computed(() => store.projects.length >= 6);

const loopedProjects = computed(() => {
  const p = store.projects;
  if (!p.length) return [];
  if (!isLoopMode.value) return p;
  const times = Math.max(Math.ceil(MIN_CARDS / p.length), MIN_REPEAT);
  return Array.from({ length: times }, () => p).flat();
});

const scrollContainer = ref(null);
const activeIndex     = ref(0);
const paddingInline   = ref(0);
const TOTAL = computed(() => store.projects.length);

// ── Typewriter ──
const typewriterText = ref("");
const showCursor     = ref(true);
const phrases = ["My Web Portfolio", "Fullstack Projects", "Open for Collaboration"];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
let typeTimer = null, cursorTimer = null;

function typewrite() {
  const current = phrases[phraseIdx];
  if (!isDeleting) {
    typewriterText.value = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      typeTimer = setTimeout(() => { isDeleting = true; typewrite(); }, 1800);
      return;
    }
    typeTimer = setTimeout(typewrite, 80);
  } else {
    typewriterText.value = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      typeTimer  = setTimeout(typewrite, 320);
      return;
    }
    typeTimer = setTimeout(typewrite, 40);
  }
}

// ── Contact Form ──
const form       = ref({ name: "", email: "", subject: "", message: "" });
const formStatus = ref("");

async function submitForm() {
  if (!form.value.name || !form.value.email || !form.value.message) {
    formStatus.value = "error";
    setTimeout(() => (formStatus.value = ""), 3000);
    return;
  }
  formStatus.value = "sending";
  try {
    await emailjs.send(
      "service_mwdlpz9",
      "template_z6rojrs",
      {
        from_name:  form.value.name,
        from_email: form.value.email,
        subject:    form.value.subject,
        message:    form.value.message,
      },
      "Q9iPwGcdzweQMDht0"
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

// ── Scroll / drag state ──
let isDown = false, isDragging = false;
let startX = 0, scrollStart = 0;
let momentumId = null, snapId = null;
let vel = 0, lastX = 0, lastT = 0;

// ── Loop mode helpers ──
function getNearestIndexLoop() {
  const el = scrollContainer.value; if (!el) return 0;
  const center = el.scrollLeft + el.offsetWidth / 2 + CENTER_OFFSET;
  return Math.round((center - getCardW() / 2) / getStride());
}
function getTargetForIndex(i) {
  const el = scrollContainer.value;
  return i * getStride() + getCardW() / 2 - el.offsetWidth / 2 - CENTER_OFFSET;
}
function checkLoop() {
  const el = scrollContainer.value; if (!el || !isLoopMode.value) return;
  const setW = getStride() * TOTAL.value;
  const half = Math.floor(loopedProjects.value.length / TOTAL.value / 2);
  if (el.scrollLeft > setW * (half + 2)) el.scrollLeft -= setW * half;
  if (el.scrollLeft < setW * (half - 2)) el.scrollLeft += setW * half;
}
function snapToIndexLoop(i) {
  if (snapId)     cancelAnimationFrame(snapId);
  if (momentumId) cancelAnimationFrame(momentumId);
  const el = scrollContainer.value;
  const target = getTargetForIndex(i);
  const dur = Math.min(Math.max(160, Math.abs(el.scrollLeft - target) * 0.35), 440);
  activeIndex.value = ((i % TOTAL.value) + TOTAL.value) % TOTAL.value;
  const s = el.scrollLeft, d = target - s, t0 = performance.now();
  function run(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.scrollLeft = s + d * (1 - Math.pow(1 - p, 4));
    if (p < 1) snapId = requestAnimationFrame(run);
    else {
      el.scrollLeft = target; checkLoop();
      activeIndex.value = ((getNearestIndexLoop() % TOTAL.value) + TOTAL.value) % TOTAL.value;
    }
  }
  snapId = requestAnimationFrame(run);
}
function snapNearestLoop() { checkLoop(); snapToIndexLoop(getNearestIndexLoop()); }

// ── No-loop mode helpers ──
function recalcPadding() {
  const el = scrollContainer.value; if (!el) return;
  paddingInline.value = Math.max(0, Math.round(el.offsetWidth / 2 - getCardW() / 2 + Math.abs(CENTER_OFFSET)));
}
function getNearestIndexNoLoop() {
  const el = scrollContainer.value; if (!el) return 0;
  const center = el.scrollLeft + el.offsetWidth / 2;
  let best = 0, bestDist = Infinity;
  store.projects.forEach((_, i) => {
    const mid  = paddingInline.value + i * getStride() + getCardW() / 2;
    const dist = Math.abs(center - mid);
    if (dist < bestDist) { bestDist = dist; best = i; }
  });
  return best;
}
function getTargetNoLoop(i) {
  return paddingInline.value + i * getStride() + getCardW() / 2 - scrollContainer.value.offsetWidth / 2;
}
function snapToIndexNoLoop(i) {
  if (snapId)     cancelAnimationFrame(snapId);
  if (momentumId) cancelAnimationFrame(momentumId);
  const clamped = Math.max(0, Math.min(i, TOTAL.value - 1));
  const el = scrollContainer.value;
  const target = getTargetNoLoop(clamped);
  const dur = Math.min(Math.max(160, Math.abs(el.scrollLeft - target) * 0.35), 440);
  activeIndex.value = clamped;
  const s = el.scrollLeft, d = target - s, t0 = performance.now();
  function run(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.scrollLeft = s + d * (1 - Math.pow(1 - p, 4));
    if (p < 1) snapId = requestAnimationFrame(run);
    else { el.scrollLeft = target; activeIndex.value = clamped; }
  }
  snapId = requestAnimationFrame(run);
}
function snapNearestNoLoop() { snapToIndexNoLoop(getNearestIndexNoLoop()); }

// ── Unified ──
function snapNearest()       { isLoopMode.value ? snapNearestLoop()    : snapNearestNoLoop(); }
function getActiveFromScroll() {
  return isLoopMode.value
    ? ((getNearestIndexLoop() % TOTAL.value) + TOTAL.value) % TOTAL.value
    : getNearestIndexNoLoop();
}
function scrollPrev() { isLoopMode.value ? snapToIndexLoop(getNearestIndexLoop() - 1) : snapToIndexNoLoop(getNearestIndexNoLoop() - 1); }
function scrollNext() { isLoopMode.value ? snapToIndexLoop(getNearestIndexLoop() + 1) : snapToIndexNoLoop(getNearestIndexNoLoop() + 1); }

function tryOpenProject(e) {
  const cardEl = e.target.closest(".porto-card"); if (!cardEl) return;
  const all  = [...scrollContainer.value.querySelectorAll(".porto-card")];
  const idx  = all.indexOf(cardEl);
  const proj = loopedProjects.value[idx]; if (!proj) return;
  if (idx !== -1) isLoopMode.value ? snapToIndexLoop(idx) : snapToIndexNoLoop(idx % TOTAL.value);
  if (proj.demo && proj.demo !== "#") window.open(proj.demo, "_blank", "noopener,noreferrer");
}

function startMomentum() {
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId)     cancelAnimationFrame(snapId);
  let v = Math.sign(vel * 16 * 8) * Math.min(Math.abs(vel * 16 * 8), 55);
  if (Math.abs(v) < 0.8) { snapNearest(); return; }
  const el = scrollContainer.value;
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

// Mouse handlers
function onMouseDown(e) {
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId)     cancelAnimationFrame(snapId);
  isDown = true; isDragging = false;
  startX = e.pageX; scrollStart = scrollContainer.value.scrollLeft;
  lastX = e.pageX; lastT = performance.now(); vel = 0;
  scrollContainer.value.style.cursor = "grabbing";
}
function onMouseMove(e) {
  if (!isDown) return;
  e.preventDefault();
  const dx = e.pageX - startX;
  if (Math.abs(dx) > 10) isDragging = true;
  if (!isDragging) return;
  const now = performance.now(), dt = now - lastT;
  if (dt > 0) vel = (e.pageX - lastX) / dt;
  lastX = e.pageX; lastT = now;
  scrollContainer.value.scrollLeft = scrollStart - dx;
  if (isLoopMode.value) checkLoop();
  activeIndex.value = getActiveFromScroll();
}
function onMouseUp(e) {
  if (!isDown) return;
  isDown = false;
  scrollContainer.value.style.cursor = "grab";
  if (!isDragging) { tryOpenProject(e); isDragging = false; return; }
  isDragging = false;
  startMomentum();
}
function onMouseLeave() {
  if (!isDown) return;
  isDown = false; isDragging = false;
  scrollContainer.value.style.cursor = "grab";
  startMomentum();
}

// Touch handlers
let tStart=0, tScroll=0, tLastX=0, tLastT=0, tVel=0, tDrag=false;
function onTouchStart(e) {
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId)     cancelAnimationFrame(snapId);
  tStart = e.touches[0].pageX; tScroll = scrollContainer.value.scrollLeft;
  tLastX = e.touches[0].pageX; tLastT = performance.now(); tVel = 0; tDrag = false;
}
function onTouchMove(e) {
  const dx = e.touches[0].pageX - tStart;
  if (Math.abs(dx) > 10) tDrag = true;
  if (!tDrag) return;
  const now = performance.now(), dt = now - tLastT;
  if (dt > 0) tVel = (e.touches[0].pageX - tLastX) / dt;
  tLastX = e.touches[0].pageX; tLastT = now;
  scrollContainer.value.scrollLeft = tScroll - dx;
  if (isLoopMode.value) checkLoop();
  activeIndex.value = getActiveFromScroll();
}
function onTouchEnd(e) {
  if (!tDrag) { tryOpenProject(e); return; }
  tDrag = false; vel = tVel; startMomentum();
}

// Resize
let resizeTimer = null;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!isLoopMode.value) { recalcPadding(); snapToIndexNoLoop(activeIndex.value); }
    else snapNearestLoop();
  }, 150);
}

// ══════════════════════════════════════════════════════════════
// LIFECYCLE
// ══════════════════════════════════════════════════════════════
onMounted(() => {
  const el = scrollContainer.value;
  if (!el) return;

  if (isLoopMode.value) {
    const totalRepeats = loopedProjects.value.length / TOTAL.value;
    const startIdx     = Math.floor(totalRepeats / 2) * TOTAL.value;
    el.scrollLeft      = getTargetForIndex(startIdx);
    requestAnimationFrame(() => requestAnimationFrame(() => snapNearestLoop()));
  } else {
    recalcPadding();
    requestAnimationFrame(() => requestAnimationFrame(() => snapToIndexNoLoop(0)));
  }

  window.addEventListener("resize", onResize);

  typeTimer   = setTimeout(typewrite, 600);
  cursorTimer = setInterval(() => { showCursor.value = !showCursor.value; }, 530);

  // Init scroll fade setelah DOM siap
  setTimeout(initScrollFade, 150);
});

onUnmounted(() => {
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId)     cancelAnimationFrame(snapId);
  clearTimeout(typeTimer);
  clearTimeout(resizeTimer);
  clearInterval(cursorTimer);
  window.removeEventListener("resize", onResize);
  if (observerIn)  observerIn.disconnect();
  if (observerOut) observerOut.disconnect();
});
</script>

<template>
  <main>
    <!-- ═══════════════════════════════════════════════
         HERO
    ═══════════════════════════════════════════════ -->
    <section class="hero" id="home">
      <div class="hero-grid"></div>

      <!-- Typewriter -->
      <div class="hero-typewriter-wrap">
        <div class="hero-typewriter-inner">
          <span class="hero-typewriter">{{ typewriterText }}</span>
          <span class="hero-cursor" :class="{ visible: showCursor }">|</span>
        </div>
      </div>

      <!-- Porto Scroll -->
      <div class="hero-porto-row">
        <button class="porto-arrow porto-arrow-left" @click="scrollPrev">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          class="porto-scroll"
          ref="scrollContainer"
          :style="!isLoopMode ? { paddingLeft: paddingInline + 'px', paddingRight: paddingInline + 'px' } : {}"
          @mousedown="onMouseDown"
          @mouseup="onMouseUp"
          @mouseleave="onMouseLeave"
          @mousemove="onMouseMove"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div
            v-for="(project, index) in loopedProjects"
            :key="index"
            class="porto-card"
            :class="{ active: index % store.projects.length === activeIndex }"
          >
            <div class="porto-card-thumb">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                class="porto-card-img"
                loading="lazy"
                draggable="false"
                @error="(e) => (e.target.style.display = 'none')"
              />
              <span v-else style="font-size:36px">{{ project.emoji }}</span>
            </div>
            <div class="porto-card-body">
              <div class="porto-card-meta">{{ project.year }}</div>
              <div class="porto-card-title">{{ project.title }}</div>
              <div class="porto-card-tags">
                <span v-for="tag in project.tags.slice(0, 2)" :key="tag" class="porto-card-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <button class="porto-arrow porto-arrow-right" @click="scrollNext">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <!-- Foto + Info -->
      <div class="hero-center">
        <div class="hero-photo-wrap">
          <div class="hero-photo-glow"></div>
          <div class="hero-photo-frame">
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
          <div class="hero-status-badge">
            <div class="hero-eyebrow-dot"></div>
            Tersedia untuk project baru
          </div>
        </div>

        <div class="hero-info-wrap">
          <div class="hero-info">
            <h1 class="hero-name">
              <span class="first">{{ store.profile.name.split(" ")[0] }}</span>
              <span class="last">{{ store.profile.name.split(" ").slice(1).join(" ") }}</span>
            </h1>
            <div class="hero-role">{{ store.profile.role }}</div>
            <div class="hero-actions">
              <a href="#portfolio" class="btn-primary">
                Lihat Portfolio
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
              <a href="#contact" class="btn-secondary">Hubungi Saya</a>
              <button
                class="btn-about"
                :class="{ active: showAbout }"
                @click="toggleAbout"
                :aria-expanded="showAbout"
              >
                <span>Tentang Saya</span>
                <svg class="btn-about-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>

          <!-- About panel -->
          <Transition name="about-slide">
            <div v-if="showAbout" class="about-panel" ref="aboutPanel">
              <div class="about-panel-line"></div>
              <div class="about-bio">
                <p>{{ store.profile.bio || "Seorang fullstack developer yang passionate dalam membangun produk digital yang elegan dan fungsional. Saya suka bekerja di semua lapisan — dari desain UI hingga arsitektur backend." }}</p>
              </div>
              <div class="about-stats">
                <div class="about-stat">
                  <span class="about-stat-num">{{ store.profile.yearsExp || "2" }}+</span>
                  <span class="about-stat-label">Tahun Pengalaman</span>
                </div>
                <div class="about-stat-divider"></div>
                <div class="about-stat">
                  <span class="about-stat-num">{{ store.projects.length || "10" }}+</span>
                  <span class="about-stat-label">Project Selesai</span>
                </div>
                <div class="about-stat-divider"></div>
                <div class="about-stat">
                  <span class="about-stat-num">{{ store.profile.clients || "8" }}+</span>
                  <span class="about-stat-label">Client Puas</span>
                </div>
              </div>
              <div class="about-chips">
                <div class="about-chip" v-if="store.profile.location">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ store.profile.location }}
                </div>
                <div class="about-chip" v-if="store.profile.university">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  {{ store.profile.university }}
                </div>
                <div class="about-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ store.profile.availability || "Tersedia fulltime & freelance" }}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════
         SKILLS
    ═══════════════════════════════════════════════ -->
    <section class="skills-section" id="skills">
      <div class="section-header">
        <div class="section-label scroll-fade">Tech Stack</div>
        <h2  class="section-title scroll-fade" data-delay="1">Technologies I Work With</h2>
        <p   class="section-sub   scroll-fade" data-delay="2">Tools dan teknologi yang saya gunakan sehari-hari.</p>
      </div>
      <div class="skills-grid">
        <div
          v-for="(cat, i) in store.skills"
          :key="cat.category"
          class="skill-category scroll-fade"
          :data-delay="String((i % 6) + 1)"
        >
          <div class="skill-cat-icon">{{ cat.icon }}</div>
          <div class="skill-cat-title">{{ cat.category }}</div>
          <div class="skill-items">
            <span v-for="item in cat.items" :key="item" class="skill-tag">{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════
         CERTIFICATIONS
    ═══════════════════════════════════════════════ -->
    <section class="cert-section" id="certifications">
      <div class="section-header">
        <div class="section-label scroll-fade">Achievements</div>
        <h2  class="section-title scroll-fade" data-delay="1">Sertifikasi</h2>
        <p   class="section-sub   scroll-fade" data-delay="2">Sertifikat dan pencapaian yang telah saya raih.</p>
      </div>

      <div class="cert-grid">
        <!-- Data dari store -->
        <template v-if="store.certifications && store.certifications.length">
          <div
            v-for="(cert, i) in store.certifications"
            :key="cert.id || i"
            class="cert-card scroll-fade"
            :data-delay="String((i % 8) + 1)"
          >
            <div class="cert-card-img-wrap">
              <img
                v-if="cert.image"
                :src="cert.image"
                :alt="cert.title"
                class="cert-card-img"
                loading="lazy"
                draggable="false"
              />
              <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;">🏅</div>
              <div class="cert-card-overlay">
                <a
                  v-if="cert.link"
                  :href="cert.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="cert-view-btn"
                >
                  Lihat Sertifikat
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
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

        <!-- Placeholder jika belum ada data -->
        <template v-else>
          <div
            v-for="n in 4"
            :key="'ph-' + n"
            class="cert-card scroll-fade"
            :data-delay="String(n)"
          >
            <div class="cert-card-img-wrap">
              <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;color:var(--text3)">🏆</div>
              <div class="cert-card-overlay">
                <span class="cert-view-btn">Lihat Sertifikat</span>
              </div>
            </div>
            <div class="cert-card-body">
              <div class="cert-card-issuer">Issuer Name</div>
              <div class="cert-card-title">Nama Sertifikasi Anda</div>
              <div class="cert-card-footer">
                <span class="cert-card-date">2024</span>
                <span class="cert-card-badge">✓ Verified</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════
         CONTACT
    ═══════════════════════════════════════════════ -->
    <section class="contact-section" id="contact">
      <div class="section-header">
        <div class="section-label scroll-fade">Contact</div>
        <h2  class="section-title scroll-fade" data-delay="1">Mari bekerja<br />sama</h2>
        <p   class="section-sub   scroll-fade" data-delay="2">Punya project menarik? Saya selalu terbuka untuk diskusi.</p>
      </div>

      <div class="contact-grid">
        <ul class="contact-info-list">
          <li class="contact-info-item scroll-fade" data-delay="1">
            <div class="contact-info-icon">
              <img v-if="store.contact.email_img" :src="store.contact.email_img" class="hero-photo-img" alt="" />
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--text3)">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <div class="contact-info-label">Email</div>
              <div class="contact-info-value">{{ store.profile.email }}</div>
            </div>
          </li>

          <li class="contact-info-item scroll-fade" data-delay="2">
            <div class="contact-info-icon">
              <img v-if="store.contact.whatsapp_img" :src="store.contact.whatsapp_img" class="hero-photo-img" alt="" />
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--text3)">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <div class="contact-info-label">WhatsApp</div>
              <a :href="'https://wa.me/6281252205174?text=Halo%20saya%20tertarik%20dengan%20project%20anda'" target="_blank" class="contact-info-value contact-info-link">
                {{ store.profile.whatsapp }}
              </a>
            </div>
          </li>

          <li class="contact-info-item scroll-fade" data-delay="3">
            <div class="contact-info-icon">
              <img v-if="store.contact.instagram_img" :src="store.contact.instagram_img" class="hero-photo-img" alt="" />
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--text3)">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </div>
            <div>
              <div class="contact-info-label">Instagram</div>
              <a :href="store.contact.instagram" target="_blank" class="contact-info-value contact-info-link">
                {{ store.contact.instagram.replace("https://www.instagram.com/", "@") }}
              </a>
            </div>
          </li>

          <li class="contact-info-item scroll-fade" data-delay="4">
            <div class="contact-info-icon">
              <img v-if="store.contact.github_img" :src="store.contact.github_img" class="hero-photo-img" alt="" />
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--text3)">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </div>
            <div>
              <div class="contact-info-label">GitHub</div>
              <a :href="store.profile.github" target="_blank" class="contact-info-value contact-info-link">
                {{ store.profile.github.replace("https://github.com/", "@") }}
              </a>
            </div>
          </li>
        </ul>

        <form class="contact-form scroll-fade" data-delay="2" @submit.prevent="submitForm">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nama</label>
              <input class="form-input" type="text" placeholder="John Doe" v-model="form.name" />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input class="form-input" type="email" placeholder="john@email.com" v-model="form.email" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Subjek</label>
            <input class="form-input" type="text" placeholder="Kolaborasi / Freelance / Lainnya" v-model="form.subject" />
          </div>
          <div class="form-group">
            <label class="form-label">Pesan</label>
            <textarea class="form-textarea" placeholder="Ceritakan tentang project Anda..." v-model="form.message"></textarea>
          </div>

          <div v-if="formStatus === 'success'" class="form-status success">
            ✓ Pesan berhasil dikirim! Saya akan membalas segera.
          </div>
          <div v-else-if="formStatus === 'error'" class="form-status error">
            ✕ Gagal mengirim. Pastikan semua field terisi atau coba lagi.
          </div>

          <button type="submit" class="btn-submit" :disabled="formStatus === 'sending'">
            <span v-if="formStatus === 'sending'">Mengirim...</span>
            <span v-else style="display:inline-flex;align-items:center;gap:8px;">
              Kirim Pesan
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </span>
          </button>
        </form>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════
         FOOTER
    ═══════════════════════════════════════════════ -->
    <footer class="footer">
      <div class="footer-text">© 2026 {{ store.profile.name }} — Dibuat dengan Vue 3</div>
      <div class="footer-socials">
        <a :href="store.profile.github"    target="_blank" class="social-link">GH</a>
        <a :href="store.contact.instagram" target="_blank" class="social-link">IG</a>
      </div>
    </footer>
  </main>
</template>