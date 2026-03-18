<template>
  <main class="landing-page">
    <HomeComponent />
    <div class="links">
      <RouterLink :to="{ name: ROUTE_NAMES.TOOLS }">Tools</RouterLink>
      <span> | </span>
      <RouterLink :to="{ name: ROUTE_NAMES.BLOG }">Blogs</RouterLink>
    </div>
    <div class="links">
      <RouterLink :to="{ name: ROUTE_NAMES.PLAYGROUND }">Playground</RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import HomeComponent from '@/components/HomeComponent.vue';
import { ROUTE_NAMES } from '@/router';
</script>

<style scoped>
.links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
  .landing-page {
    height: calc(100vh - 4rem);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
