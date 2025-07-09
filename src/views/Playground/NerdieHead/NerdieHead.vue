<template>
  <primitive :object="scene" />
</template>

<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import gltfPath from './alex_head_model.gltf?url';

const { scene } = await useGLTF(gltfPath);
</script>
