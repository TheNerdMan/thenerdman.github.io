<template>
  <div class="blog">
    <main class="blog__main">
      <header class="blog-header">
        <h1>The ramblings of a developer who is regularly nerd-sniped</h1>
        <p>
          Watch my journey of changing opinion about how I write code (or at least want to write
          code)
        </p>
      </header>
      <ul class="blog-list">
        <li v-for="blog in blogs" :key="blog.slug">
          <BlogItemComponent :blog="blog" />
        </li>
      </ul>
    </main>
    <BlogViewerComponent :show="showBlogViewer" :blog="blogToView" @close="closeBlogViewer" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BlogItemComponent from '@/components/Blog/BlogItemComponent.vue';
import BlogViewerComponent from '@/components/Blog/BlogViewerComponent.vue';
import { ROUTE_NAMES } from '@/router';
import { useBlogPosts } from '@/composables/useBlogPosts';
import type { BlogFile } from '@/utils/types/BlogItem.type';

const route = useRoute();
const router = useRouter();
const blogs = useBlogPosts();

const showBlogViewer = ref(false);
const blogToView = ref<BlogFile>();

/* The sheet follows the route rather than a click handler, so a deep link, a
   click on a post row and the browser's back button all open the same post. */
watch(
  () => route.params.slug,
  (slug) => {
    const found = blogs.find((blog) => blog.slug === slug);
    blogToView.value = found;
    showBlogViewer.value = Boolean(found);
  },
  { immediate: true },
);

function closeBlogViewer() {
  router.push({ name: ROUTE_NAMES.BLOG });
}
</script>

<style scoped>
/* The refresh pins the site to a dark canvas in both colour schemes, so the
   semantic tokens are set to their dark values here instead of following the OS.
   The sheet inherits them because it is rendered inside this element. */
.blog {
  --color-background: var(--nd-c-black);
  --color-background-soft: var(--nd-c-black-soft);
  --color-background-mute: var(--nd-c-black-mute);
  --color-border: var(--nd-c-divider-dark-2);
  --color-border-hover: var(--nd-c-divider-dark-1);
  --color-heading: var(--nd-c-white);
  --color-text: var(--nd-c-text-dark-2);

  min-height: 100vh;
  background: var(--color-background);
}

.blog__main {
  max-width: 52rem;
  margin: 0 auto;
  padding: 5rem 1.5rem 4rem;
}

.blog-header {
  margin-bottom: 3.5rem;
  text-align: center;
}

.blog-header h1 {
  color: var(--color-heading);
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.blog-header p {
  margin-top: 1.25rem;
  font-size: 1.0625rem;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  list-style: none;
}

@media (max-width: 600px) {
  .blog__main {
    padding: 3rem 1.25rem;
  }
  .blog-header {
    margin-bottom: 2.5rem;
  }
  .blog-header h1 {
    font-size: 1.5rem;
  }
}
</style>
