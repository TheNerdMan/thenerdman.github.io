<template>
  <header class="hero">
    <div class="hero__logo-stage">
      <button
        v-if="!swapped"
        type="button"
        class="hero__logo"
        :class="{ 'hero__logo--spinning': spinning, 'hero__logo--gone': awake }"
        aria-label="Wake the Nerdie head"
        @click="wake"
      >
        <LogoIcon :width="128" :height="128" />
      </button>

      <!-- Mounted while the logo spins, so the reveal has nothing left to load. -->
      <div
        v-if="spinning || spun"
        class="hero__head"
        :class="{ 'hero__head--live': awake }"
        :aria-hidden="!awake"
        role="img"
        aria-label="The Nerdie head, watching your cursor"
      >
        <TresCanvas>
          <TresPerspectiveCamera :position="[0, 0, 6.2]" :fov="35" />
          <Suspense>
            <NerdieHead :mouth="dizzy ? 2 : 0" :dizzy="dizzy" @ready="onHeadReady" />
          </Suspense>
          <TresAmbientLight :intensity="1.4" />
          <TresDirectionalLight :position="[1.5, 2, 3]" />
        </TresCanvas>
      </div>
    </div>

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
import { usePreferredReducedMotion } from '@vueuse/core';
import { TresCanvas } from '@tresjs/core';
import LogoIcon from './icons/LogoIcon.vue';
import NerdieHead from './NerdieHead/NerdieHead.vue';

const navItems = [
  { label: 'Tools', href: '#tools' },
  { label: 'Blogs', href: '#blog' },
  { label: 'Playground', href: '#playground' },
];

const SPIN_MS = 1100;
const DIZZY_MS = 2600;
// Matches the opacity transition on .hero__logo / .hero__head.
const REVEAL_MS = 350;

const awake = ref(false);
const swapped = ref(false);
const spinning = ref(false);
const spun = ref(false);
const headReady = ref(false);
const dizzy = ref(false);
const reducedMotion = usePreferredReducedMotion();
const timers: number[] = [];

function after(ms: number, run: () => void) {
  timers.push(window.setTimeout(run, ms));
}

// The logo finishes spinning and the head has drawn: hand over.
function swap() {
  if (!spun.value || !headReady.value || awake.value) return;
  awake.value = true;
  spinning.value = false;
  dizzy.value = reducedMotion.value !== 'reduce';
  if (dizzy.value) after(DIZZY_MS, () => (dizzy.value = false));
  // Leave the fading logo in the DOM until the head has taken over.
  after(REVEAL_MS, () => (swapped.value = true));
}

function wake() {
  if (spinning.value || awake.value) return;
  const still = reducedMotion.value === 'reduce';
  // Keep spinning until the model is loaded, so a slow fetch is never a blank box.
  spinning.value = !still;

  after(still ? 0 : SPIN_MS, () => {
    spun.value = true;
    swap();
  });
}

function onHeadReady() {
  headReady.value = true;
  swap();
}

onBeforeUnmount(() => timers.forEach(window.clearTimeout));
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

.hero__logo-stage {
  position: relative;
  width: 8rem;
  height: 8rem;
  margin-bottom: 2.5rem;
}

.hero__logo,
.hero__head {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.hero__logo {
  z-index: 1;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transition: opacity 0.35s ease;
}

.hero__logo--gone {
  opacity: 0;
  pointer-events: none;
}

.hero__head {
  opacity: 0;
  transition: opacity 0.35s ease;
}

.hero__head--live {
  opacity: 1;
}

.hero__logo::before,
.hero__head::before {
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
  transform-origin: center;
}

@media (hover: hover) {
  .hero__logo:hover:not(.hero__logo--spinning) :deep(svg) {
    animation: logo-nudge 0.9s ease-in-out infinite;
  }
}

/* The cursor is still over the button while it spins, so this has to win outright. */
.hero__logo--spinning :deep(svg) {
  animation: logo-spin 0.25s linear infinite;
}

@keyframes logo-nudge {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-12deg);
  }
  75% {
    transform: rotate(12deg);
  }
}

@keyframes logo-spin {
  to {
    transform: rotate(360deg);
  }
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
  .hero__logo,
  .hero__handle,
  .hero__nav-link,
  .hero__head {
    transition: none;
  }

  .hero__logo:hover :deep(svg) {
    animation: none;
  }
}
</style>