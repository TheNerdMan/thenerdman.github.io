<template>
  <primitive :object="nodes.eyebrowL" />
  <primitive :object="nodes.eyebrowR" />
  <primitive :object="nodes.head" />
  <primitive :object="nodes.mouth" />
  <primitive :object="nodes.ears" />
  <primitive :object="nodes.eyeL" />
  <primitive :object="nodes.eyeR" />
  <primitive :object="nodes.glasses" />
  <primitive :object="nodes.hair" />
  <primitive :object="scene" />
</template>

<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import gltfPath from './alex_head_model.gltf?url';

const { nodes, scene } = await useGLTF(gltfPath);
</script>
