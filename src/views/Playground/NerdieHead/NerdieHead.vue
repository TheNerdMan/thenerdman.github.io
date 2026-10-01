<template>
  <primitive :object="scene" />
</template>

<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import gltfPath from './alex_head_model.glb?url';

const { scene } = await useGLTF(gltfPath);
// The Blender scene also contains a backdrop plane that hides the model from
// every angle. Everything else in it is the rig: bones, controllers and the
// skinned meshes, which have to be added together to be posed.
const backdrop = scene.getObjectByName('Plane');
if (backdrop) backdrop.visible = false;
// The head is exported ~1 unit above the origin, the scene camera's target,
// which left it out of frame.
scene.position.y = -1;
</script>
