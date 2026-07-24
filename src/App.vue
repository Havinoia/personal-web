<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import NavBar from './components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
import { initLenis } from './utils/lenis'

const router = useRouter()
let lenis = null

onMounted(() => {
  lenis = initLenis()

  router.afterEach((to, from) => {
    if (!lenis) return

    if (to.hash) {
      setTimeout(() => {
        const target = document.querySelector(to.hash)
        if (target) {
          lenis.scrollTo(target, { offset: -80, duration: 1.2 })
        }
      }, 100)
    } else if (to.path !== from.path) {
      lenis.scrollTo(0, { immediate: true })
    }
  })
})

onUnmounted(() => {
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
})
</script>

<template>
  <NavBar />
  <RouterView />
  <Footer />
</template>