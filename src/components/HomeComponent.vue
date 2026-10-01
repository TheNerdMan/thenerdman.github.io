<template>
  <header class="hero">
    <button
      type="button"
      class="hero__logo"
      :aria-pressed="crazyEyes"
      :aria-label="crazyEyes ? 'Calm the logo down' : 'Make the Nerdie logo go crazy'"
      @click="toggleCrazyEyes"
    >
      <LogoIcon ref="logo" :width="128" :height="128" />
    </button>

    <div class="hero__intro">
      <h1 class="hero__title">
        Hi 👋 I'm <span class="hero__gradient">Alex</span>,<br class="hero__break" />
        aka
        <a
          class="hero__handle"
          href="https://github.com/TheNerdMan"
          target="_blank"
          rel="noopener noreferrer"
          >TheNerdMan</a
        >,<br class="hero__break" />
        aka <strong>Nerdie</strong>, aka <strong>Nerd</strong>
      </h1>
      <p class="hero__tagline">just the ramblings of a developer who is regularly nerd-sniped</p>
    </div>

    <nav class="hero__nav" aria-label="Page sections">
      <template v-for="(item, index) in navItems" :key="item.href">
        <span v-if="index > 0" class="hero__nav-divider" aria-hidden="true">|</span>
        <a class="hero__nav-link" :href="item.href">{{ item.label }}</a>
      </template>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import LogoIcon from './icons/LogoIcon.vue';

const navItems = [
  { label: 'Tools', href: '#tools' },
  { label: 'Blogs', href: '#blog' },
  { label: 'Playground', href: '#playground' },
];

const logo = ref<InstanceType<typeof LogoIcon> | null>(null);
const crazyEyes = ref(false);
let crazyEyesTimer: number | null = null;

function toggleCrazyEyes() {
  if (crazyEyesTimer !== null) {
    window.clearInterval(crazyEyesTimer);
    crazyEyesTimer = null;
    crazyEyes.value = false;
    logo.value?.resetEyes();
    return;
  }

  if (!logo.value) return;
  crazyEyes.value = true;
  logo.value.randomizeEyes();
  crazyEyesTimer = window.setInterval(() => logo.value?.randomizeEyes(), 500);
}

onBeforeUnmount(() => {
  if (crazyEyesTimer !== null) window.clearInterval(crazyEyesTimer);
});
</script>

<style scoped>
.hero {
  max-width: 80rem;
  margin: 0 auto;
  padding: 6rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero__logo {
  position: relative;
  width: 8rem;
  height: 8rem;
  margin-bottom: 2.5rem;
  padding: 0;
  border: 0;
  background: none;
  border-radius: 50%;
  cursor: pointer;
}

.hero__logo::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--teal);
  filter: blur(16px);
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

.hero__logo:hover::before,
.hero__logo:focus-visible::before {
  opacity: 0.3;
}

.hero__logo :deep(svg) {
  position: relative;
  display: block;
}

.hero__intro {
  max-width: 48rem;
}

.hero__title {
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.25;
  margin-bottom: 2rem;
}

.hero__gradient {
  background: linear-gradient(to right, var(--teal), var(--cyan));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.hero__break {
  display: none;
}

.hero__handle {
  text-decoration: underline;
  text-underline-offset: 0.25em;
  text-decoration-color: color-mix(in srgb, var(--teal-accent) 30%, transparent);
  transition: text-decoration-color 0.3s ease;
}

.hero__handle:hover {
  text-decoration-color: var(--teal-accent);
}

.hero__tagline {
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  text-transform: lowercase;
  color: var(--nd-c-text-dark-2);
}

.hero__nav {
  margin-top: 4rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.hero__nav-link {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #64748b;
  transition: color 0.3s ease;
}

.hero__nav-link:hover {
  color: #ffffff;
}

.hero__nav-divider {
  display: none;
  opacity: 0.2;
}

@media (min-width: 640px) {
  .hero {
    padding-inline: 2rem;
  }
  .hero__title {
    font-size: 3rem;
  }
  .hero__tagline {
    font-size: 1.25rem;
  }
  .hero__nav {
    gap: 2.5rem;
  }
  .hero__nav-link {
    font-size: 0.875rem;
  }
  .hero__nav-divider,
  .hero__break {
    display: inline;
  }
}

@media (min-width: 768px) {
  .hero__title {
    font-size: 4.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__logo::before,
  .hero__handle,
  .hero__nav-link {
    transition: none;
  }
}
</style>