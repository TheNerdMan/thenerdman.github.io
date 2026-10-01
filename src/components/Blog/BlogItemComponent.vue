<template>
  <RouterLink
    class="blog-item glass-card"
    :to="{ name: ROUTE_NAMES.BLOG_POST, params: { slug: blog.slug } }"
  >
    <span class="blog-item__head">
      <span class="blog-item__title">{{ blog.title }}</span>
      <span v-if="blog.date" class="blog-item__date">{{ blog.date }}</span>
    </span>
    <span v-if="blog.markdown.summary" class="blog-item__summary">
      {{ blog.markdown.summary }}
    </span>
    <span class="blog-item__cta">Read post</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ROUTE_NAMES } from '@/router';
import type { BlogFile } from '@/utils/types/BlogItem.type';

defineProps<{ blog: BlogFile }>();
</script>

<style scoped>
.blog-item {
  padding: 2rem;
}

.blog-item__head {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.blog-item__title {
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.25;
  transition: color 0.3s ease;
}

.glass-card:hover .blog-item__title {
  color: var(--teal-accent-hover);
}

.blog-item__date {
  flex: none;
  color: var(--teal);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.blog-item__summary {
  display: block;
  margin-bottom: 2rem;
  color: var(--nd-c-text-dark-2);
  font-size: 1rem;
  line-height: 1.65;
}

.blog-item__cta {
  color: var(--teal-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .blog-item {
    padding: 1.5rem;
  }
  .blog-item__head {
    flex-direction: column;
    gap: 0.5rem;
  }
  .blog-item__title {
    font-size: 1.25rem;
  }
}
</style>
