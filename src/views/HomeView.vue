<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { usePortfolioStore } from "../stores/portfolioStore";
import emailjs from "@emailjs/browser";

const store = usePortfolioStore();

// ── Konstanta — CARD_W dibaca dari DOM ──
const GAP           = 20;
const CENTER_OFFSET = -30;
const MIN_REPEAT    = 10;
const MIN_CARDS     = 20;

// Baca ukuran card aktual dari DOM (responsive-aware)
function getCardW() {
  const card = scrollContainer.value?.querySelector(".porto-card");
  return card ? card.offsetWidth : 320;
}
function getStride() {
  return getCardW() + GAP;
}

const isLoopMode = computed(() => store.projects.length >= 6);

const loopedProjects = computed(() => {
  const p = store.projects;
  if (p.length === 0) return [];
  if (!isLoopMode.value) return p;
  const times = Math.max(Math.ceil(MIN_CARDS / p.length), MIN_REPEAT);
  return Array.from({ length: times }, () => p).flat();
});

const scrollContainer = ref(null);
const activeIndex     = ref(0);
const paddingInline   = ref(0);
const TOTAL           = computed(() => store.projects.length);

// ── Typewriter ──
const typewriterText = ref("");
const showCursor = ref(true);
const phrases = [
  "My Web Portfolio",
  "Fullstack Projects",
  "Built with Vue & Laravel",
  "Open for Collaboration",
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeTimer = null;
let cursorTimer = null;

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

// ── Contact Form ──
const form = ref({ name: "", email: "", subject: "", message: "" });
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
      "service_mwdlpz9", // ← Service ID
      "template_z6rojrs", // ← Template ID
      {
        from_name: form.value.name,
        from_email: form.value.email,
        subject: form.value.subject,
        message: form.value.message,
      },
      "Q9iPwGcdzweQMDht0", // ← Public Key
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

// ── Scroll state ──
let isDown = false;
let isDragging = false;
let startX = 0;
let scrollStart = 0;
let momentumId = null;
let snapId = null;
let vel = 0;
let lastX = 0;
let lastT = 0;

// ── Loop mode ──
function getNearestIndexLoop() {
  const el = scrollContainer.value;
  if (!el) return 0;
  const center = el.scrollLeft + el.offsetWidth / 2 + CENTER_OFFSET;
  return Math.round((center - CARD_W / 2) / STRIDE);
}

function getTargetForIndex(i) {
  const el = scrollContainer.value;
  return i * STRIDE + CARD_W / 2 - el.offsetWidth / 2 - CENTER_OFFSET;
}

function checkLoop() {
  const el = scrollContainer.value;
  if (!el || !isLoopMode.value) return;
  const setW = STRIDE * TOTAL.value;
  const totalRepeats = loopedProjects.value.length / TOTAL.value;
  const half = Math.floor(totalRepeats / 2);
  if (el.scrollLeft > setW * (half + 2)) el.scrollLeft -= setW * half;
  if (el.scrollLeft < setW * (half - 2)) el.scrollLeft += setW * half;
}

function snapToIndexLoop(i) {
  if (snapId) cancelAnimationFrame(snapId);
  if (momentumId) cancelAnimationFrame(momentumId);
  const el = scrollContainer.value;
  const target = getTargetForIndex(i);
  const dist = Math.abs(el.scrollLeft - target);
  const dur = Math.min(Math.max(160, dist * 0.35), 440);
  activeIndex.value = i % TOTAL.value;
  const s = el.scrollLeft,
    d = target - s,
    t0 = performance.now();
  function run(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.scrollLeft = s + d * (1 - Math.pow(1 - p, 4));
    if (p < 1) {
      snapId = requestAnimationFrame(run);
    } else {
      el.scrollLeft = target;
      checkLoop();
      activeIndex.value = getNearestIndexLoop() % TOTAL.value;
    }
  }
  snapId = requestAnimationFrame(run);
}

function snapNearestLoop() {
  checkLoop();
  snapToIndexLoop(getNearestIndexLoop());
}

// ── No-loop mode ──
function getNearestIndexNoLoop() {
  const el = scrollContainer.value;
  if (!el) return 0;
  const pad = paddingInline.value;
  const center = el.scrollLeft + el.offsetWidth / 2;
  let best = 0,
    bestDist = Infinity;
  store.projects.forEach((_, i) => {
    const mid = pad + i * STRIDE + CARD_W / 2;
    const dist = Math.abs(center - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

function getTargetNoLoop(i) {
  const el = scrollContainer.value;
  const pad = paddingInline.value;
  return pad + i * STRIDE + CARD_W / 2 - el.offsetWidth / 2;
}

function snapToIndexNoLoop(i) {
  if (snapId) cancelAnimationFrame(snapId);
  if (momentumId) cancelAnimationFrame(momentumId);
  const clamped = Math.max(0, Math.min(i, TOTAL.value - 1));
  const el = scrollContainer.value;
  const target = getTargetNoLoop(clamped);
  const dist = Math.abs(el.scrollLeft - target);
  const dur = Math.min(Math.max(160, dist * 0.35), 440);
  activeIndex.value = clamped;
  const s = el.scrollLeft,
    d = target - s,
    t0 = performance.now();
  function run(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.scrollLeft = s + d * (1 - Math.pow(1 - p, 4));
    if (p < 1) {
      snapId = requestAnimationFrame(run);
    } else {
      el.scrollLeft = target;
      activeIndex.value = clamped;
    }
  }
  snapId = requestAnimationFrame(run);
}

function snapNearestNoLoop() {
  snapToIndexNoLoop(getNearestIndexNoLoop());
}

// ── Unified ──
function snapNearest() {
  isLoopMode.value ? snapNearestLoop() : snapNearestNoLoop();
}

function getActiveFromScroll() {
  return isLoopMode.value
    ? getNearestIndexLoop() % TOTAL.value
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

// ── Open project ──
function tryOpenProject(e) {
  const cardEl = e.target.closest(".porto-card");
  if (!cardEl) return;
  const all = [...scrollContainer.value.querySelectorAll(".porto-card")];
  const idx = all.indexOf(cardEl);
  const project = loopedProjects.value[idx];
  if (!project) return;
  if (idx !== -1) {
    isLoopMode.value
      ? snapToIndexLoop(idx)
      : snapToIndexNoLoop(idx % TOTAL.value);
  }
  if (project.demo && project.demo !== "#") {
    window.open(project.demo, "_blank", "noopener,noreferrer");
  }
}

// ── Momentum ──
function startMomentum() {
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId) cancelAnimationFrame(snapId);
  let v = vel * 16 * 8;
  v = Math.sign(v) * Math.min(Math.abs(v), 55);
  if (Math.abs(v) < 0.8) {
    snapNearest();
    return;
  }
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

// ── Mouse ──
function onMouseDown(e) {
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId) cancelAnimationFrame(snapId);
  isDown = true;
  isDragging = false;
  startX = e.pageX;
  scrollStart = scrollContainer.value.scrollLeft;
  lastX = e.pageX;
  lastT = performance.now();
  vel = 0;
  scrollContainer.value.style.cursor = "grabbing";
}
function onMouseMove(e) {
  if (!isDown) return;
  e.preventDefault();
  const dx = e.pageX - startX;
  if (Math.abs(dx) > 10) isDragging = true;
  if (!isDragging) return;
  const now = performance.now(),
    dt = now - lastT;
  if (dt > 0) vel = (e.pageX - lastX) / dt;
  lastX = e.pageX;
  lastT = now;
  scrollContainer.value.scrollLeft = scrollStart - dx;
  if (isLoopMode.value) checkLoop();
  activeIndex.value = getActiveFromScroll();
}
function onMouseUp(e) {
  if (!isDown) return;
  isDown = false;
  scrollContainer.value.style.cursor = "grab";
  if (!isDragging) {
    tryOpenProject(e);
    isDragging = false;
    return;
  }
  isDragging = false;
  startMomentum();
}
function onMouseLeave() {
  if (!isDown) return;
  isDown = false;
  isDragging = false;
  scrollContainer.value.style.cursor = "grab";
  startMomentum();
}

// ── Touch ──
let tStart = 0,
  tScroll = 0,
  tLastX = 0,
  tLastT = 0,
  tVel = 0,
  tDrag = false;

function onTouchStart(e) {
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId) cancelAnimationFrame(snapId);
  tStart = e.touches[0].pageX;
  tScroll = scrollContainer.value.scrollLeft;
  tLastX = e.touches[0].pageX;
  tLastT = performance.now();
  tVel = 0;
  tDrag = false;
}
function onTouchMove(e) {
  const dx = e.touches[0].pageX - tStart;
  if (Math.abs(dx) > 10) tDrag = true;
  if (!tDrag) return;
  const now = performance.now(),
    dt = now - tLastT;
  if (dt > 0) tVel = (e.touches[0].pageX - tLastX) / dt;
  tLastX = e.touches[0].pageX;
  tLastT = now;
  scrollContainer.value.scrollLeft = tScroll - dx;
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

// ── Init ──
onMounted(() => {
  const el = scrollContainer.value;
  if (!el) return;
  if (isLoopMode.value) {
    const totalRepeats = loopedProjects.value.length / TOTAL.value;
    const startIdx = Math.floor(totalRepeats / 2) * TOTAL.value;
    el.scrollLeft = getTargetForIndex(startIdx);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        snapNearestLoop();
      });
    });
  } else {
    const pad = Math.max(
      0,
      Math.round(el.offsetWidth / 2 - CARD_W / 2 + Math.abs(CENTER_OFFSET)),
    );
    paddingInline.value = pad;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        snapToIndexNoLoop(0);
      });
    });
  }
  typeTimer = setTimeout(typewrite, 600);
  cursorTimer = setInterval(() => {
    showCursor.value = !showCursor.value;
  }, 530);
});

onUnmounted(() => {
  if (momentumId) cancelAnimationFrame(momentumId);
  if (snapId) cancelAnimationFrame(snapId);
  clearTimeout(typeTimer);
  clearInterval(cursorTimer);
});
</script>

<template>
  <main>
    <!-- ─── HERO ─── -->
    <section class="hero" id="home">
      <div class="hero-glow-top"></div>

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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          class="porto-scroll"
          ref="scrollContainer"
          :style="
            !isLoopMode
              ? {
                  paddingLeft: paddingInline + 'px',
                  paddingRight: paddingInline + 'px',
                }
              : {}
          "
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
              <span v-else class="porto-card-emoji">{{ project.emoji }}</span>
            </div>
            <div class="porto-card-body">
              <div class="porto-card-meta">{{ project.year }}</div>
              <div class="porto-card-title">{{ project.title }}</div>
              <div class="porto-card-tags">
                <span
                  v-for="tag in project.tags.slice(0, 2)"
                  :key="tag"
                  class="porto-card-tag"
                  >{{ tag }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <button class="porto-arrow porto-arrow-right" @click="scrollNext">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <!-- Foto + Nama -->
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
              Lihat Portfolio
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <a href="#contact" class="btn-secondary">Hubungi Saya</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SKILLS ─── -->
    <section class="skills-section" id="skills">
      <div class="section-label">Tech Stack</div>
      <h2 class="section-title">Skills & Teknologi</h2>
      <p class="section-sub">
        Tools dan teknologi yang saya gunakan sehari-hari.
      </p>
      <div class="skills-grid">
        <div
          v-for="cat in store.skills"
          :key="cat.category"
          class="skill-category"
        >
          <div class="skill-cat-icon">{{ cat.icon }}</div>
          <div class="skill-cat-title">{{ cat.category }}</div>
          <div class="skill-items">
            <span v-for="item in cat.items" :key="item" class="skill-tag">{{
              item
            }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CONTACT ─── -->
    <section class="contact-section" id="contact">
      <div class="section-label">Contact</div>
      <h2 class="section-title">Mari bekerja<br />sama</h2>
      <p class="section-sub">
        Punya project menarik? Saya selalu terbuka untuk diskusi.
      </p>
      <div class="contact-grid">
        <div>
          <ul class="contact-info-list">
            <li class="contact-info-item">
              <div class="contact-info-icon">
                <img
                  v-if="store.contact.email_img"
                  :src="store.contact.email_img"
                  :alt="store.contact.email"
                  class="hero-photo-img"
                />
              </div>
              <div>
                <div class="contact-info-label">Email</div>
                <div class="contact-info-value">{{ store.profile.email }}</div>
              </div>
            </li>
            <li class="contact-info-item">
              <div class="contact-info-icon">
                <img
                  v-if="store.contact.whatsapp_img"
                  :src="store.contact.whatsapp_img"
                  :alt="store.contact.whatsapp"
                  class="hero-photo-img"
                />
              </div>
              <div>
                <div class="contact-info-label">WhatsApp</div>

                <a
                  :href="'https://wa.me/6281252205174?text=Halo%20saya%20tertarik%20dengan%20project%20anda'"
                  target="_blank"
                  class="contact-info-value contact-info-link"
                  >{{ store.profile.whatsapp }}</a
                  >
                </div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">
                  <img
                    v-if="store.contact.instagram_img"
                    :src="store.contact.instagram_img"
                    :alt="store.contact.instagram"
                    class="hero-photo-img"
                  />
                </div>
                <div>
                  <div class="contact-info-label">Instagram</div>
                  <a
                    :href="store.contact.instagram"
                    target="_blank"
                    class="contact-info-value contact-info-link"
                    >{{
                      store.contact.instagram.replace(
                        "https://www.instagram.com/",
                        "@",
                      )
                    }}</a
                  >
                </div>
              </li>
            <li class="contact-info-item">
              <div class="contact-info-icon">
                <img
                  v-if="store.contact.github_img"
                  :src="store.contact.github_img"
                  :alt="store.contact.github"
                  class="hero-photo-img"
                />
              </div>
              <div>
                <div class="contact-info-label">GitHub</div>
                <a
                  :href="store.profile.github"
                  target="_blank"
                  class="contact-info-value contact-info-link"
                  >{{
                    store.profile.github.replace("https://github.com/", "@")
                  }}</a
                >
              </div>
            </li>

          </ul>
        </div>

        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nama</label>
              <input
                class="form-input"
                type="text"
                placeholder="John Doe"
                v-model="form.name"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                class="form-input"
                type="email"
                placeholder="john@email.com"
                v-model="form.email"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Subjek</label>
            <input
              class="form-input"
              type="text"
              placeholder="Kolaborasi / Freelance / Lainnya"
              v-model="form.subject"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Pesan</label>
            <textarea
              class="form-textarea"
              placeholder="Ceritakan tentang project Anda..."
              v-model="form.message"
            ></textarea>
          </div>

          <div v-if="formStatus === 'success'" class="form-status success">
            ✓ Pesan berhasil dikirim! Saya akan membalas segera.
          </div>
          <div v-else-if="formStatus === 'error'" class="form-status error">
            ✕ Gagal mengirim. Pastikan semua field terisi atau coba lagi.
          </div>

          <button
            type="submit"
            class="btn-submit"
            :disabled="formStatus === 'sending'"
          >
            <span v-if="formStatus === 'sending'">Mengirim...</span>
            <span
              v-else
              style="display: inline-flex; align-items: center; gap: 8px"
            >
              Kirim Pesan
              <svg
                width="16"
                height="16"
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
        </form>
      </div>
    </section>

    <!-- ─── FOOTER ─── -->
    <footer class="footer">
      <div class="footer-text">
        © 2026 {{ store.profile.name }} — Dibuat dengan Vue 3
      </div>
      <div class="footer-socials">
        <a :href="store.profile.github" target="_blank" class="social-link"
          >GH</a
        >
        <a :href="store.contact.instagram" target="_blank" class="social-link"
          >IG</a
        >
      </div>
    </footer>
  </main>
</template>
