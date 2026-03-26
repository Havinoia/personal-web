<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  // Cek preferensi tersimpan atau preferensi sistem OS
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  }
});
</script>

<template>
  <nav>
    <div class="nav-logo">dev<span>.</span>porto</div>

    <ul class="nav-links">
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><a href="#home">Portfolio</a></li>
      <li><a href="#about">About</a></li>
      <!-- <li><a href="#skills">Skills</a></li> -->
      <li><a href="#achievements">Achievements</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>

    <div class="nav-right">
      <button
        @click="toggleDarkMode"
        class="theme-toggle"
        aria-label="Toggle Theme"
      >
        <svg
          v-if="isDark"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="5" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          />
        </svg>
        <svg
          v-else
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <a href="/documents/CV_HAVIN.pdf" class="nav-cta" download="CV_HAVIN.pdf">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Download CV</span>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: var(--bg3);
  color: var(--text);
}

/* Responsif untuk mobile */
@media (max-width: 768px) {
  .nav-cta span {
    display: none;
  }
}
</style>
