<template>
  <primitive :object="scene" />
</template>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue';
import {
  Euler,
  Quaternion,
  SRGBColorSpace,
  TextureLoader,
  type BufferGeometry,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
} from 'three';
import { useLoop } from '@tresjs/core';
import { useGLTF } from '@tresjs/cientos';
import gltfPath from './alex_head_model.glb?url';
import mouth1 from './mouth_1.png?url';
import mouth2 from './mouth_2.png?url';
import mouth3 from './mouth_3.png?url';
import mouth4 from './mouth_4.png?url';

const props = defineProps<{ mouth: number }>();

// The rig object: glTF's unique-name pass strips the dot out of "rig.001".
const HEAD_NODE = 'rig001';
const MOUTH_MATERIAL = 'MAT_alex_face';

type Mouth = Mesh<BufferGeometry, MeshStandardMaterial>;

const { onBeforeRender } = useLoop();
const { scene } = await useGLTF(gltfPath);

// The Blender scene also contains a backdrop plane that hides the model from
// every angle. Everything else in it is the rig: bones, controllers and the
// skinned meshes, which have to be added together to be posed.
const backdrop = scene.getObjectByName('Plane');
if (backdrop) backdrop.visible = false;
// The head is exported ~1 unit above the origin, the scene camera's target,
// which left it out of frame.
scene.position.y = -1;

const loader = new TextureLoader();
const mouthFrames = [mouth1, mouth2, mouth3, mouth4].map((url) => {
  const texture = loader.load(url);
  // The glTF loader leaves flipY off, so match it or the mouth is upside down.
  texture.flipY = false;
  texture.colorSpace = SRGBColorSpace;
  return texture;
});

// 'mouth' is a bone name in this rig too, and glTF renames the mesh that
// collides with it, so find the mouth by the only material it uses.
let mouth: Mouth | undefined;
// The skin is spread over two bone chains that only meet at the rig object,
// and most of the geometry is weighted to `root`, so turning a single bone
// would tear the head apart. The rig object carries all of it.
let head: Object3D | undefined;
scene.traverse((object) => {
  const mesh = object as Partial<Mouth>;
  if (mesh.isMesh && mesh.material?.name === MOUTH_MATERIAL) mouth = mesh as Mouth;
  if (object.name === HEAD_NODE) head = object;
});
if (!mouth || !head) throw new Error(`NerdieHead: mouth or "${HEAD_NODE}" missing`);

// Keep the rest pose: writing the rotation straight onto the object would drop
// the pose it was exported in.
const rest = head.quaternion.clone();
const tilt = new Euler();
const tiltRotation = new Quaternion();
const pointer = { x: 0, y: 0 };

function setMouth(frame: number) {
  if (mouth) mouth.material.map = mouthFrames[frame];
}
setMouth(props.mouth);
watch(() => props.mouth, setMouth);

onBeforeRender(() => {
  if (head) {
    tilt.set(pointer.y * 0.3, pointer.x * 0.5, 0);
    head.quaternion.copy(rest).multiply(tiltRotation.setFromEuler(tilt));
  }
});

function onPointerMove(event: PointerEvent) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
}
window.addEventListener('pointermove', onPointerMove);

onUnmounted(() => window.removeEventListener('pointermove', onPointerMove));
</script>
