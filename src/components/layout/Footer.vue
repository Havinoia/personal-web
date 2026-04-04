<script setup>
import { usePortfolioStore } from '../../stores/portfolioStore';
const store = usePortfolioStore();
</script>

<template>
  <footer class="footer">
    <div class="footer-text">
      © 2026 {{ store.profile.name }} — Built with Vue
    </div>
  </footer>
</template>

<style scoped>
/* Styles are already in style.css, but we can add scoped ones here if needed.
   For now, we'll rely on the global style.css since it's already well-defined. */
</style>
