<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";

const isScrolled = ref(false);

function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <nav :class="{ 'is-scrolled': isScrolled }">

    <!-- Logo bubble -->
    <div class="nav-bubble">
      <RouterLink to="/" class="nav-logo">dev<span>.</span>porto</RouterLink>
    </div>

    <!-- Links bubble -->
    <ul class="nav-bubble nav-links">
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><a href="#home">Portfolio</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#certifications">Achievements</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>

    <!-- Actions bubble -->
    <div class="nav-bubble nav-right">
      <a href="/documents/CV_HAVIN.pdf" class="nav-cta" download="CV_HAVIN.pdf">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>Download CV</span>
      </a>
    </div>

  </nav>
</template>