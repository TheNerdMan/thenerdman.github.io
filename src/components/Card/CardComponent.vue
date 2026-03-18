<template>
  <div class="card">
    <h2 class="title">{{ title }}</h2>
    <p class="content">{{ content }}</p>
    <RouterLink class="button" :to="{ name: routeName }">Go</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ROUTE_NAMES } from '@/router';

defineProps<{
  title: string;
  thumbnail: string;
  content: string;
  routeName: (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];
}>();
</script>

<style scoped>
.card {
  background-color: var(--color-card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: transform 0.3s ease;
}
.card:hover {
  transform: translateY(-5px);
}
.title {
  font-size: 1.5rem;
  margin-bottom: 8px;
}
.content {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}
.button {
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--color-button-bg);
  color: var(--color-button-text);
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}
</style>
