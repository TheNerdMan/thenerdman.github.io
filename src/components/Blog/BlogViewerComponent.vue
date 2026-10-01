<template>
  <transition name="card-slide">
    <div v-if="localShow" class="modal-overlay">
      <div
        ref="sheet"
        class="modal-content card-bottom"
        v-on-click-outside="emitClose"
        @scroll.passive="handleScroll"
      >
        <header class="sheet-head">
          <div>
            <h2 class="sheet-title">{{ blog?.title }}</h2>
            <p v-if="blog?.date" class="sheet-date">{{ blog.date }}</p>
          </div>
          <div class="sheet-actions">
            <!-- The floating site-wide home link sits under this sheet's scrim. -->
            <RouterLink class="sheet-home" :to="{ name: ROUTE_NAMES.HOME }">Home</RouterLink>
            <button class="modal-close" aria-label="Close post" @click="emitClose">&times;</button>
          </div>
        </header>
        <div class="sheet-body">
          <MarkdownRendererComponent v-if="blog" :content="blog.markdown.content" />
          <p v-else>Loading blog content...</p>
        </div>
        <transition name="fade-up">
          <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop">Back to top</button>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { vOnClickOutside } from '@vueuse/components';
import { ROUTE_NAMES } from '@/router';
import type { BlogFile } from '@/utils/types/BlogItem.type';
import MarkdownRendererComponent from '../Markdown/MarkdownRendererComponent.vue';

const props = defineProps<{ show: boolean; blog?: BlogFile }>();
const emit = defineEmits(['close']);

const transitionDuration = 350; // ms, match your CSS

const localShow = computed({
  get() {
    return props.show;
  },
  set(val: boolean) {
    if (!val) {
      setTimeout(() => emit('close'), transitionDuration);
    }
  },
});

const sheet = ref<HTMLElement | null>(null);
const showBackToTop = ref(false);

function emitClose() {
  localShow.value = false;
}

function handleScroll(event: Event) {
  const el = event.currentTarget as HTMLElement;
  const scrollable = el.scrollHeight - el.clientHeight;
  showBackToTop.value = scrollable > 0 && el.scrollTop > scrollable * 0.05;
}

function scrollToTop() {
  sheet.value?.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.card-bottom {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(56rem, 100vw);
  max-height: 88vh;
  margin-bottom: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--color-border);
  border-bottom: 0;
  border-radius: 18px 18px 0 0;
  background: var(--color-background);
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.45);
  animation: card-slide-up 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* --- sticky head --------------------------------------------------------- */

.sheet-head {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 88%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.sheet-actions {
  display: flex;
  flex: none;
  gap: 0.75rem;
  align-items: center;
}

.sheet-home {
  color: var(--teal);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.sheet-home:hover {
  color: var(--teal-accent-hover);
}

.sheet-title {
  color: var(--color-heading);
  font-size: 1.4375rem;
  font-weight: 900;
  line-height: 1.3;
}

.sheet-date {
  margin-top: 0.4rem;
  color: var(--teal);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.modal-close {
  flex: none;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: transparent;
  color: var(--color-text);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.modal-close:hover {
  border-color: var(--teal);
  background: color-mix(in srgb, var(--teal) 16%, transparent);
  color: var(--color-heading);
}

.sheet-body {
  padding: 2.5rem 1.5rem 4rem;
}

/* --- back to top --------------------------------------------------------- */

.back-to-top {
  position: sticky;
  bottom: 1.5rem;
  z-index: 3;
  align-self: center;
  padding: 0.6rem 1.5rem;
  border: 1px solid var(--color-border-hover);
  border-radius: 2rem;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.back-to-top:hover {
  border-color: var(--teal);
  color: var(--color-heading);
}

/* --- transitions --------------------------------------------------------- */

.card-slide-enter-active,
.card-slide-leave-active {
  transition:
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-slide-enter-from,
.card-slide-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
.card-slide-enter-to,
.card-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
@keyframes card-slide-up {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-up-enter-to,
.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 600px) {
  .modal-overlay {
    align-items: stretch;
  }
  .card-bottom {
    width: 100vw;
    max-height: 100vh;
    height: 100vh;
    border: 0;
    border-radius: 0;
    animation: none;
  }
  .sheet-head {
    padding: 1.25rem 1.25rem 1rem;
  }
  .modal-close {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.5rem;
  }
  .sheet-body {
    padding: 2rem 1.25rem 4rem;
  }
  .back-to-top {
    bottom: 1.25rem;
  }
}
</style>
