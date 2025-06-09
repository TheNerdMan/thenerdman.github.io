<script setup lang="ts">
import CardComponent from '@/components/Card/CardComponent.vue';
import { ROUTE_NAMES } from '@/router';
</script>

<template>
  <header>
    <h1>
      Sometimes I want to mess around something, this place is likely a graveyard but sometimes
      graveyards are cool, right?
    </h1>
  </header>
  <main>
    <h1>Playground</h1>
    <div>
      <CardComponent
        title="Tres.js Playground"
        thumbnail="https://tresjs.org/assets/logo.png"
        content="A playground for testing Tres.js features and components."
        :routeName="ROUTE_NAMES.PLAYGROUND_TRES"
      />
    </div>
  </main>
</template>
