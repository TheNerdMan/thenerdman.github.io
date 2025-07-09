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
          <NerdieHead />
        </Suspense>
        <TresGridHelper :position="[0, -1, 0]" />
        <TresAmbientLight />
        <TresDirectionalLight :position="[0, 2, 4]" />
      </TresCanvas>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { TresCanvas } from '@tresjs/core';
import { CameraControls } from '@tresjs/cientos';
import NerdieHead from './NerdieHead/NerdieHead.vue';
</script>

<style scoped lang="scss">
.tres-canvas-container {
  width: 65vw;
  height: 80vh;
}
</style>
