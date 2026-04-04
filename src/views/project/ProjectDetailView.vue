<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePortfolioStore } from '../../stores/portfolioStore';

const route = useRoute();
const router = useRouter();
const store = usePortfolioStore();

const showAccessModal = ref(false);
const lightboxImage = ref(null);

function closeLightbox() {
  lightboxImage.value = null;
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    closeLightbox();
    showAccessModal.value = false;
  }
}

const project = computed(() => {
  const id = parseInt(route.params.id);
  return store.projects.find(p => p.id === id);
});

// Setup next project
const nextProject = computed(() => {
  if (!project.value) return null;
  const currentIndex = store.projects.findIndex(p => p.id === project.value.id);
  const nextIndex = (currentIndex + 1) % store.projects.length;
  return store.projects[nextIndex];
});

watch(() => route.params.id, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

onMounted(() => {
  window.scrollTo({ top: 0 });
  window.addEventListener('keydown', handleKeydown);
  if (!project.value) {
    router.replace('/');
  }
});

import { onUnmounted } from 'vue';
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <main class="project-detail" v-if="project">
    <!-- HERO SECTION -->
    <header class="pd-hero">
      <div class="pd-hero-content">
        <div class="pd-meta">
          <span class="pd-date">{{ project.month }} {{ project.year }}</span>
        </div>
        <h1 class="pd-title">{{ project.title }}</h1>
        <div class="pd-themes">
          <span v-for="theme in (project.themes || project.tags || []).slice(0,3)" :key="theme" class="pd-theme-tag">{{ theme }}</span>
        </div>
      </div>
      <div class="pd-hero-img-wrap">
        <img :src="project.image" :alt="project.title" class="pd-hero-img" />
        <div class="pd-hero-overlay"></div>
      </div>
    </header>

    <!-- CONTENT SECTION (BLACK BG) -->
    <section class="pd-content">
      <div class="pd-container">
        
        <!-- Description -->
        <div class="pd-desc-block">
          <h2 class="pd-section-title">Overview</h2>
          <p class="pd-desc">{{ project.fullDescription || project.description }}</p>
        </div>

        <!-- Gallery -->
        <div class="pd-gallery-block" v-if="project.gallery && project.gallery.length">
          <h2 class="pd-section-title">Documentation</h2>
          <div class="pd-gallery-grid">
            <img v-for="(img, idx) in project.gallery" 
                 :key="idx" 
                 :src="img" 
                 class="pd-gallery-img" 
                 alt="Gallery item"
                 @click="lightboxImage = img" />
          </div>
        </div>

        <!-- Tech & Link -->
        <div class="pd-bottom-block">
          <div class="pd-tech">
            <h3 class="pd-tech-title">Tech Used</h3>
            <div class="pd-tech-list">
              <span v-for="tag in project.tags" :key="tag" class="pd-tech-item">{{ tag }}</span>
            </div>
          </div>
          
          <div class="pd-action">
            <a v-if="project.github && project.github !== '#'" :href="project.github" target="_blank" class="pd-btn-repo">
              Repository
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <button v-if="project.demo" @click="showAccessModal = true" class="pd-btn-ghost">
              Visit Website
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- REQ MODAL -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAccessModal" class="pd-modal-overlay" @click.self="showAccessModal = false">
          <div class="pd-modal-content">
            <h3 class="pd-modal-title">Access Restricted</h3>
            <p class="pd-modal-text">Please request admin approval to view this website live.</p>
            <div class="pd-modal-actions">
              <a :href="`https://wa.me/6281252205174?text=Hello,%20I'd%20like%20to%20request%20access%20to%20view%20the%20${encodeURIComponent(project.title)}%20website`" 
                 target="_blank" class="pd-modal-btn-wa">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.001 2c-5.514 0-10 4.486-10 10 0 1.77.464 3.496 1.344 5.03L2.015 22l5.127-1.332A9.957 9.957 0 0012.001 22c5.514 0 10-4.486 10-10s-4.486-10-10-10zM17.47 15.655c-.237.669-1.374 1.282-1.928 1.353-.518.067-1.187.175-3.08-.607-2.274-.937-3.72-3.266-3.832-3.415-.113-.15-.916-1.222-.916-2.33 0-1.109.576-1.655.782-1.884.205-.228.448-.286.598-.286.15 0 .3.003.432.008.136.006.315-.052.493.376.18.43.616 1.503.673 1.616.056.113.094.246.019.398-.075.15-.113.245-.225.358-.113.113-.238.252-.338.341-.112.102-.232.215-.104.437.127.221.564.935 1.214 1.513.842.748 1.54 1.05 1.764 1.164.225.114.358.094.492-.056.13-.15.568-.66.72-.888.15-.227.301-.19.507-.113.206.075 1.312.617 1.537.731.225.113.375.169.431.263.056.095.056.545-.181 1.214z"/>
                </svg>
                Request via WhatsApp
              </a>
              <button @click="showAccessModal = false" class="pd-modal-btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- LIGHTBOX MODAL -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightboxImage" class="pd-lightbox-overlay" @click.self="closeLightbox">
          <button class="pd-lightbox-close" @click="closeLightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="pd-lightbox-content">
            <img :src="lightboxImage" class="pd-lightbox-img" alt="Enlarged gallery item" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- NEXT PROJECT FOOTER -->
    <footer class="pd-footer" v-if="nextProject">
      <div class="pd-footer-content" @click="router.push({ name: 'project-detail', params: { id: nextProject.id } })">
        <span class="pd-next-label">Next Project</span>
        <h2 class="pd-next-title">{{ nextProject.title }}</h2>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.project-detail {
  background: #050a07; /* purely dark for the base */
  min-height: 100vh;
  color: var(--text);
  font-family: var(--font), sans-serif;
}

.pd-hero {
  position: relative;
  width: 100%;
  height: 90vh; /* large background */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.pd-hero-img-wrap {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.pd-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.05); /* Slight scale to allow for overlay */
}

.pd-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(5, 10, 7, 0.45) 0%, rgba(5, 10, 7, 0.75) 65%, #050a07 100%);
}

.pd-hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  padding: 0 32px;
  transform: translateY(10vh);
  animation: heroUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes heroUp {
  0% { opacity: 0; transform: translateY(18vh); filter: blur(5px); }
  100% { opacity: 1; transform: translateY(10vh); filter: blur(0); }
}

.pd-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.pd-date {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent3);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.pd-themes {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 26px;
}

.pd-theme-tag {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  padding: 6px 18px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.pd-title {
  font-size: clamp(48px, 8vw, 88px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -2px;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

/* CONTENT SECTION */
.pd-content {
  position: relative;
  z-index: 3;
  background: #050a07; /* Blank black */
  padding: 100px 32px;
}

.pd-container {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.pd-section-title {
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.pd-desc {
  font-size: 18px;
  line-height: 1.85;
  color: var(--text2);
  font-weight: 400;
}

/* GALLERY */
.pd-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
}

.pd-gallery-img {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  cursor: zoom-in;
  transition: all 0.3s var(--ease);
}

.pd-gallery-img:hover {
  transform: scale(1.025);
  border-color: rgba(125, 255, 155, 0.25);
  box-shadow: 0 16px 40px rgba(0,0,0,0.6);
}

/* TECH & ACTION */
.pd-bottom-block {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
  padding-top: 40px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.pd-tech-title {
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 16px;
  font-weight: 700;
}

.pd-tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pd-tech-item {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  background: #0d1712;
  border: 1px solid rgba(125, 255, 155, 0.15);
  padding: 8px 16px;
  border-radius: 8px;
}

.pd-action {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pd-btn-repo, .pd-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.3, 0.64, 1);
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.pd-btn-repo {
  background: var(--a-grad);
  color: #04110a;
  box-shadow: 0 10px 30px rgba(125, 255, 155, 0.2);
}

.pd-btn-repo:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(125, 255, 155, 0.35);
}

.pd-btn-ghost {
  background: rgba(125, 255, 155, 0.05);
  color: var(--accent3);
  border: 1.5px solid rgba(125, 255, 155, 0.4);
  backdrop-filter: blur(8px);
}

.pd-btn-ghost:hover {
  background: rgba(125, 255, 155, 0.15);
  border-color: rgba(125, 255, 155, 0.8);
  transform: translateY(-4px);
}

/* MODAL ACCESS */
.pd-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.pd-modal-content {
  background: #0d1711;
  border: 1px solid rgba(125, 255, 155, 0.15);
  border-radius: 16px;
  padding: 32px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6);
}

.pd-modal-title {
  color: white;
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 800;
}

.pd-modal-text {
  color: var(--text2);
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.pd-modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pd-modal-btn-wa {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #25D366;
  color: #fff;
  padding: 12px 22px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
}

.pd-modal-btn-wa:hover {
  background: #1ebd5a;
  transform: scale(1.02);
}

.pd-modal-btn-cancel {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--text2);
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pd-modal-btn-cancel:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

/* LIGHTBOX */
.pd-lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 12, 8, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  cursor: zoom-out;
}

.pd-lightbox-close {
  position: absolute;
  top: 32px;
  right: 32px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s var(--ease);
  z-index: 2010;
}

.pd-lightbox-close:hover {
  background: rgba(255,255,255,0.15);
  transform: rotate(90deg);
}

.pd-lightbox-content {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pd-lightbox-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8);
  animation: lightboxZoom 0.4s var(--ease) forwards;
}

@keyframes lightboxZoom {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@media (max-width: 768px) {
  .pd-lightbox-overlay { padding: 20px; }
  .pd-lightbox-close { top: 20px; right: 20px; width: 40px; height: 40px; }
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* FOOTER */
.pd-footer {
  border-top: 1px solid rgba(255,255,255,0.06);
  background: #08100c;
  padding: 100px 32px;
  text-align: center;
  cursor: pointer;
  transition: background 0.4s var(--ease);
}

.pd-footer:hover {
  background: #0c1a12;
}

.pd-footer-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  transition: transform 0.4s var(--ease);
}

.pd-footer:hover .pd-footer-content {
  transform: scale(1.025);
}

.pd-next-label {
  font-size: 15px;
  color: var(--accent3);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 800;
}

.pd-next-title {
  font-size: clamp(36px, 6vw, 68px);
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  letter-spacing: -1.5px;
  line-height: 1.1;
  background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 768px) {
  .pd-hero-content { transform: translateY(5vh); padding: 0 20px; }
  .pd-hero { height: 75vh; }
  .pd-meta { flex-direction: column; gap: 12px; }
  .pd-content { padding: 60px 20px; }
  .pd-container { gap: 56px; }
  .pd-bottom-block { flex-direction: column; align-items: stretch; }
  .pd-btn-visit { justify-content: center; }
  .pd-footer { padding: 80px 20px; }
}
</style>
