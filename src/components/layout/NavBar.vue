<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <div class="nav-logo">dev<span>.</span>porto</div>

    <ul class="nav-links">
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><a href="#about">About</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#portfolio">Portfolio</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>

    <a href="/cv.pdf" target="_blank" class="nav-cta">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download CV
    </a>
  </nav>
</template>