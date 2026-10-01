<template>
  <vue-markdown-render
    class="markdown-body"
    :source="content"
    :options="markdownOptions"
    :plugins="plugins"
  />
</template>

<script setup lang="ts">
import type MarkdownIt from 'markdown-it';
import type { Options as MarkdownItOptions } from 'markdown-it';
import { computed } from 'vue';
import VueMarkdownRender from 'vue-markdown-render';
import MarkdownItHighlightjs from 'markdown-it-highlightjs';

defineProps<{ content: string }>();

const markdownOptions = computed<MarkdownItOptions>(() => ({
  html: true,
  linkify: true,
  typographer: true,
}));

/**
 * markdown-it renders a fence as `<pre><code class="hljs language-ts">`, which
 * buries the fence's language on a descendant. Tag it on the wrapper as well so
 * the stylesheet can read it back with `attr(data-lang)` and label the block —
 * and so an unlabelled block means the fence genuinely declared no language.
 */
function labelFencedCode(md: MarkdownIt) {
  const fence = md.renderer.rules.fence;
  if (!fence) return;

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const lang = tokens[idx].info.trim().split(/\s+/)[0] ?? '';
    const openTag = lang ? `<pre data-lang="${md.utils.escapeHtml(lang)}">` : '<pre>';
    return fence(tokens, idx, options, env, self).replace('<pre>', openTag);
  };
}

/* Order matters: the highlighter installs the fence renderer we then decorate. */
const plugins = computed(() => [MarkdownItHighlightjs, labelFencedCode]);
</script>

<style>
/* Global on purpose. The markdown reaches the DOM through v-html, so none of it
   carries this component's scope attribute and no scoped rule can style it. The
   theme is bundled from node_modules rather than a CDN so highlighting never
   depends on a third-party request at page load. */
@import 'highlight.js/styles/github-dark-dimmed.css';
</style>

<style scoped>
.markdown-body {
  --mono: ui-monospace, 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;
  --code-canvas: #22272e; /* the github-dark-dimmed canvas, in either colour scheme */

  max-width: 60ch;
  margin: 0 auto;
  color: var(--color-text);
  /* Reading size, not the 15px site base — long-form body copy needs more. */
  font-size: 1.125rem;
  line-height: 1.75;
}

/* --- rhythm -------------------------------------------------------------- */

.markdown-body :deep(p),
.markdown-body :deep(ul),
.markdown-body :deep(ol),
.markdown-body :deep(blockquote) {
  margin-bottom: 1.5rem;
}

.markdown-body :deep(hr) {
  height: 1px;
  margin: 3rem 0;
  border: 0;
  background: var(--color-border);
}

/* --- headings ------------------------------------------------------------ */

.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin-bottom: 1.25rem;
  color: var(--color-heading);
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.markdown-body :deep(h2) {
  margin-top: 3.5rem;
  font-size: 1.75rem;
}

.markdown-body :deep(h3) {
  margin-top: 2.5rem;
  font-size: 1.3125rem;
}

/* --- inline -------------------------------------------------------------- */

.markdown-body :deep(strong) {
  color: var(--color-heading);
  font-weight: 800;
}

.markdown-body :deep(a) {
  color: var(--teal);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--teal) 45%, transparent);
  text-underline-offset: 0.2em;
}

.markdown-body :deep(code) {
  padding: 0.15em 0.4em;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-mute);
  color: var(--color-heading);
  font-family: var(--mono);
  font-size: 0.875em;
  word-break: break-word;
}

/* --- lists --------------------------------------------------------------- */

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
}

.markdown-body :deep(li) {
  margin-bottom: 0.4rem;
}

.markdown-body :deep(li)::marker {
  color: var(--teal);
  font-weight: 700;
}

.markdown-body :deep(blockquote) {
  padding-left: 1.25rem;
  border-left: 2px solid var(--teal);
  font-style: italic;
}

/* --- code blocks --------------------------------------------------------- */

.markdown-body :deep(pre) {
  margin-bottom: 1.75rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--code-canvas);
}

.markdown-body :deep(pre)::before {
  content: attr(data-lang);
  display: block;
  padding: 0.45rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.03);
  color: var(--teal);
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* No language on the fence, so no strip. */
.markdown-body :deep(pre:not([data-lang]))::before {
  content: none;
}

.markdown-body :deep(pre > code) {
  display: block;
  padding: 1.125rem 1.25rem;
  overflow-x: auto;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #adbac7;
  font-family: var(--mono);
  font-size: 0.9375rem;
  line-height: 1.7;
  tab-size: 2;
  word-break: normal;
}

@media (max-width: 600px) {
  .markdown-body {
    font-size: 1rem;
  }
  .markdown-body :deep(h2) {
    margin-top: 2.5rem;
    font-size: 1.4375rem;
  }
  .markdown-body :deep(h3) {
    font-size: 1.125rem;
  }
  .markdown-body :deep(pre)::before {
    padding: 0.4rem 1rem;
  }
  .markdown-body :deep(pre > code) {
    padding: 1rem;
    font-size: 0.8125rem;
  }
}
</style>
