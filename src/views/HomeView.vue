<template>
  <div class="landing">
    <div class="landing__glow landing__glow--top" aria-hidden="true"></div>
    <div class="landing__glow landing__glow--bottom" aria-hidden="true"></div>

    <HomeComponent />

    <main class="landing__main">
      <section id="stack" class="landing__section">
        <h2 class="landing__eyebrow landing__eyebrow--teal landing__eyebrow--tight">The Stack</h2>
        <ul class="stack">
          <li v-for="tech in stack" :key="tech" class="stack__pill">{{ tech }}</li>
        </ul>
      </section>

      <section id="tools" class="landing__section">
        <h2 class="landing__eyebrow landing__eyebrow--cyan">Tools I've built &amp; use</h2>
        <ul class="cards">
          <li v-for="tool in tools" :key="tool.name">
            <a class="card glass-card" :style="accent(tool.accent)" :href="tool.href" target="_blank"
              rel="noopener noreferrer">
              <span class="card__icon"><iconify-icon :icon="tool.icon" /></span>
              <span class="card__title">{{ tool.name }}</span>
              <span class="card__body">{{ tool.body }}</span>
              <span class="card__cta">
                {{ tool.cta }}
                <iconify-icon icon="lucide:arrow-up-right" />
              </span>
            </a>
          </li>
        </ul>
      </section>

      <section id="blog" class="landing__section">
        <h2 class="landing__eyebrow landing__eyebrow--teal">Latest Writing</h2>
        <div class="latest">
          <RouterLink v-for="post in posts" :key="post.slug" class="latest__card glass-card"
            :to="{ name: ROUTE_NAMES.BLOG_POST, params: { slug: post.slug } }">
            <span class="latest__head">
              <span class="latest__title">{{ post.title }}</span>
              <span class="latest__date">{{ post.date }}</span>
            </span>
            <span v-if="post.markdown.summary" class="latest__summary">{{ post.markdown.summary }}</span>
            <span class="latest__cta">
              Read Post
              <iconify-icon icon="lucide:chevron-right" />
            </span>
          </RouterLink>
        </div>
      </section>

      <section id="playground" class="landing__section">
        <h2 class="landing__eyebrow landing__eyebrow--cyan">The Graveyard</h2>
        <div class="graveyard">
          <RouterLink v-for="item in playground" :key="item.routeName" class="graveyard__card glass-card"
            :style="accent(item.accent)" :to="{ name: item.routeName }">
            <span class="graveyard__thumb">
              <img :src="item.thumbnail" :alt="`${item.name} logo`" />
            </span>
            <span class="graveyard__title">{{ item.name }}</span>
            <span class="graveyard__body">{{ item.body }}</span>
            <span class="card__cta">
              Enter Playground
              <iconify-icon icon="lucide:arrow-right" />
            </span>
          </RouterLink>
        </div>
      </section>
    </main>

    <footer class="landing__footer">
      <div class="landing__footer-intro">
        <h2 class="landing__footer-title">Say hi?</h2>
        <p class="landing__footer-copy">
          sometimes graveyards are cool, and sometimes it's cool to chat. you can find me here:
        </p>
        <div class="landing__social">
          <a class="landing__social-item" href="https://github.com/TheNerdMan" target="_blank"
            rel="noopener noreferrer">
            <iconify-icon icon="lucide:github" />
            <span>GitHub</span>
          </a>
          <span class="landing__social-item landing__social-item--static" aria-label="Discord handle @thenerdman">
            <iconify-icon icon="mdi:discord" />
            <span>@thenerdman</span>
          </span>
        </div>
      </div>
      <p class="landing__colophon">Built by Alex • Nerdie.dev</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import HomeComponent from '@/components/HomeComponent.vue';
import { ROUTE_NAMES } from '@/router';
import { useBlogPosts } from '@/composables/useBlogPosts';

const stack = [
  'C#',
  'dotnet',
  'SQL',
  'Vue 3',
  'Vite',
  'TypeScript',
  'vue-router',
  'Vite SSG',
];

const tools = [
  {
    name: 'Job Tracker',
    body: 'A client side, privacy focused tool, for tracking job hunting.',
    href: 'https://www.nerdie.dev/jobhunt-dashboard/',
    icon: 'lucide:briefcase',
    accent: 'var(--teal-accent)',
    cta: 'Launch Tool',
  },
  {
    name: 'Momentum Mod',
    body: 'Website / API. Alex helped build this open source platform.',
    href: 'https://github.com/momentum-mod/website',
    icon: 'lucide:code-2',
    accent: 'var(--cyan-accent)',
    cta: 'GitHub Repo',
  },
  {
    name: 'Gitmoji',
    body: 'because yes, emojis should be in git commits too. A utility Alex uses daily.',
    href: 'https://gitmoji.dev/',
    icon: 'lucide:smile',
    accent: 'var(--teal-accent)',
    cta: 'External Tool',
  },
];

const playground = [
  {
    name: 'Tres.js Playground',
    body: 'A playground for testing Tres.js features and components.',
    thumbnail: 'https://tresjs.org/logo.svg',
    routeName: ROUTE_NAMES.PLAYGROUND_TRES,
    accent: 'var(--cyan-accent)',
  },
];

const posts = useBlogPosts();

function accent(color: string): Record<string, string> {
  return { '--accent': color };
}
</script>

<style scoped>
.landing {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: var(--nd-c-black);
  color: #ffffff;
  /* The glows sit at z-index:-1 so they stay behind the content. Without an
     isolated stacking context they would also fall behind this opaque
     background and disappear entirely. */
  isolation: isolate;
}

.landing__glow {
  position: fixed;
  z-index: -1;
  border-radius: 50%;
  pointer-events: none;
}

.landing__glow--top {
  width: 50vw;
  height: 50vw;
  top: -10vw;
  left: -10vw;
  background: radial-gradient(circle, rgba(62, 170, 153, 0.08) 0%, rgba(0, 0, 0, 0) 70%);
}

.landing__glow--bottom {
  width: 40vw;
  height: 40vw;
  bottom: -5vw;
  right: -5vw;
  background: radial-gradient(circle, rgba(0, 210, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
}

.landing__main {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.landing__section {
  margin-bottom: var(--section-gap);
  scroll-margin-top: 2rem;
}

.landing__eyebrow {
  margin-bottom: 4rem;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  text-align: center;
}

.landing__eyebrow--tight {
  margin-bottom: 3rem;
}

.landing__eyebrow--teal {
  color: color-mix(in srgb, var(--teal-accent) 50%, transparent);
}

.landing__eyebrow--cyan {
  color: color-mix(in srgb, var(--cyan-accent) 50%, transparent);
}

/* --- stack ------------------------------------------------------------ */

.stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  max-width: 56rem;
  margin: 0 auto;
  list-style: none;
}

.stack__pill {
  padding: 0.5rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: default;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}

.stack__pill:hover {
  background: color-mix(in srgb, var(--teal-accent) 15%, transparent);
  border-color: var(--teal-accent);
  color: var(--teal-accent);
}

/* --- glass cards ------------------------------------------------------ */

.glass-card {
  --accent: var(--teal-accent);
  display: block;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition:
    background 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    border-color 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(62, 170, 153, 0.4);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  list-style: none;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 320px;
  padding: 2rem;
}

.card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 1.5rem;
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--accent) 20%, transparent);
  color: var(--accent);
  font-size: 1.25rem;
}

.card__title {
  display: block;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 900;
}

.card__body {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.625;
  color: var(--nd-c-text-dark-2);
}

.card__cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}

/* --- latest writing ---------------------------------------------------- */

.latest {
  max-width: 48rem;
  margin: 0 auto;
}

.latest__card {
  padding: 2rem;
}

.latest__head {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.latest__title {
  font-size: 1.5rem;
  font-weight: 900;
  transition: color 0.3s ease;
}

.glass-card:hover .latest__title {
  color: var(--teal-accent-hover);
}

.latest__date {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
}

.latest__summary {
  display: block;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.625;
  color: var(--nd-c-text-dark-2);
}

.latest__cta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--teal-accent);
}

/* --- graveyard --------------------------------------------------------- */

.graveyard {
  max-width: 24rem;
  margin: 0 auto;
}

.graveyard__card {
  display: flex;
  flex-direction: column;
  height: 400px;
  padding: 1.5rem;
}

.graveyard__thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-radius: 1rem;
  background: var(--nd-c-black-mute);
}

.graveyard__thumb img {
  width: min(100%, 9rem);
  height: auto;
  object-fit: contain;
}

.graveyard__title {
  font-size: 1.25rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.graveyard__body {
  flex: 1;
  font-size: 0.875rem;
  color: var(--nd-c-text-dark-2);
}

/* --- footer ------------------------------------------------------------ */

.landing__footer {
  max-width: 80rem;
  margin: 0 auto;
  padding: 6rem 1.5rem 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.landing__footer-intro {
  margin-bottom: 4rem;
}

.landing__footer-title {
  margin-bottom: 1.5rem;
  font-size: 1.875rem;
  font-weight: 900;
}

.landing__footer-copy {
  max-width: 24rem;
  margin: 0 auto 2.5rem;
  color: var(--nd-c-text-dark-2);
}

.landing__social {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.landing__social-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.875rem;
  color: #64748b;
}

.landing__social-item span {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

a.landing__social-item {
  transition: color 0.3s ease;
}

a.landing__social-item:hover {
  color: #ffffff;
}

.landing__social-item--static span {
  color: #ffffff;
}

.landing__colophon {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #475569;
}

/* --- breakpoints ------------------------------------------------------- */

@media (min-width: 640px) {

  .landing__main,
  .landing__footer {
    padding-inline: 2rem;
  }

  .stack {
    gap: 1rem;
  }

  .stack__pill {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }

  .card {
    height: 380px;
  }

  .latest__card {
    padding: 2.5rem;
  }

  .latest__head {
    flex-direction: row;
    align-items: center;
  }

  .latest__title {
    font-size: 1.875rem;
  }

  .latest__summary {
    font-size: 1.125rem;
  }

  .landing__footer-title {
    font-size: 3rem;
  }
}

@media (min-width: 768px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {

  .stack__pill,
  .glass-card,
  .latest__title,
  a.landing__social-item {
    transition: none;
  }

  .glass-card:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>
