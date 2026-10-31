<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { getLenis } from "../../utils/lenis";

const route = useRoute();
const router = useRouter();

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);

function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}

function handleResize() {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > 820) {
    isMenuOpen.value = false;
  }
}

const isMobile = computed(() => windowWidth.value <= 820);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

function scrollToTop() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function handleHomeClick() {
  closeMenu();
  if (route.path === '/') {
    if (route.hash) {
      router.push({ path: '/' });
    }
    scrollToTop();
  }
}

function handleNavClick(hash) {
  closeMenu();
  if (route.path === '/' && route.hash === hash) {
    const target = document.querySelector(hash);
    if (target) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <nav :class="{ 'is-scrolled': isScrolled, 'is-mobile-open': isMenuOpen }">
    
    <!-- Mobile-only header (Visible < 820px) -->
    <div class="nav-mobile-header">
      <RouterLink to="/" class="nav-logo" @click="handleHomeClick">havin<span>.</span>dev</RouterLink>
      <button class="nav-hamburger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }" aria-label="Toggle menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- Main Navigation Content -->
    <!-- Transition only active on mobile -->
    <Transition :name="isMobile ? 'nav-slide' : ''">
      <div class="nav-content" v-if="!isMobile || isMenuOpen">
        <!-- Logo bubble (Desktop only) -->
        <div class="nav-bubble nav-logo-bubble">
          <RouterLink to="/" class="nav-logo" @click="handleHomeClick">havin<span>.</span>dev</RouterLink>
        </div>

        <!-- Links bubble -->
        <ul class="nav-bubble nav-links">
          <li><RouterLink :to="{ path: '/' }" @click="handleHomeClick">Home</RouterLink></li>
          <li><RouterLink :to="{ path: '/', hash: '#portfolio' }" @click="handleNavClick('#portfolio')">Portfolio</RouterLink></li>
          <li><RouterLink :to="{ path: '/', hash: '#skills' }" @click="handleNavClick('#skills')">Tech Stack</RouterLink></li>
          <li><RouterLink :to="{ path: '/', hash: '#certifications' }" @click="handleNavClick('#certifications')">Achievements</RouterLink></li>
          <li><RouterLink :to="{ path: '/', hash: '#contact' }" @click="handleNavClick('#contact')">Contact</RouterLink></li>
        </ul>

        <!-- Actions bubble -->
        <div class="nav-bubble nav-right">
          <a href="/documents/CV_Havin_Neo_Dimas_Nugraha.pdf" class="nav-cta" download="CV_Havin_Neo_Dimas_Nugraha.pdf" @click="closeMenu">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>Download CV</span>
          </a>
        </div>
      </div>
    </Transition>

  </nav>
</template>
