<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { ROUTE_NAMES } from '@/router';

const route = useRoute();

/* The site has no shell, so every route except the landing itself needs one
   obvious way back to it. */
const showHomeLink = computed(() => route.name !== ROUTE_NAMES.HOME);
</script>

<template>
  <RouterView />
  <RouterLink v-if="showHomeLink" class="home-link" :to="{ name: ROUTE_NAMES.HOME }">
    &larr; Home
  </RouterLink>
</template>

<style scoped>
/* Deliberately dark glass rather than the semantic tokens: this floats over both
   the dark canvas and the still-light /tools and /playground pages, and the
   tokens resolve differently on each. */
.home-link {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 10;
  padding: 0.5rem 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 2rem;
  background: rgba(24, 24, 24, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
  transition:
    border-color 0.3s ease,
    color 0.3s ease;
}

.home-link:hover {
  border-color: var(--teal);
  color: var(--teal);
}
</style>
