<template>
  <header>
    <h1>Tres <RouterLink to="/playground"> Playground </RouterLink></h1>
  </header>
  <main>
    <div class="tres-canvas-container">
      <TresCanvas clear-color="#82DBC5">
        <TresPerspectiveCamera :position="[5, 5, 5]" />
        <CameraControls make-default />
        <Suspense>
          <NerdieHead :mouth="frame" />
        </Suspense>
        <TresGridHelper :position="[0, -1, 0]" />
        <TresAmbientLight />
        <TresDirectionalLight :position="[0, 2, 4]" />
      </TresCanvas>
      <div class="mouth-controls">
        <button
          v-for="shape in MOUTH_SHAPES"
          :key="shape"
          type="button"
          :aria-pressed="frame === shape - 1"
          @click="frame = shape - 1"
        >
          {{ shape }}
        </button>
        <button type="button" :aria-pressed="listening" @click="listening ? stop() : start()">
          {{ listening ? 'Stop mic' : 'Talk to me' }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { TresCanvas } from '@tresjs/core';
import { CameraControls } from '@tresjs/cientos';
import NerdieHead from '@/components/NerdieHead/NerdieHead.vue';
import { useVoiceMouth } from '@/composables/useVoiceMouth';

const MOUTH_SHAPES = 4;
const { frame, listening, start, stop } = useVoiceMouth();
</script>

<style scoped lang="scss">
.tres-canvas-container {
  width: 65vw;
  height: 80vh;
}
.mouth-controls {
  display: flex;
  gap: 8px;
  padding-top: 12px;

  button {
    padding: 8px 16px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background-color: var(--color-background-mute);
    color: var(--color-text);
    cursor: pointer;
  }
  button[aria-pressed='true'] {
    border-color: var(--teal);
    background-color: var(--teal);
    color: var(--nd-c-white);
  }
}
</style>
