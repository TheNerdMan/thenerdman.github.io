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
  Vector3,
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

// The hero mounts this lazily, so a cold 500 kB fetch is what makes the swap
// feel slow. Hitting it on import parks it in the HTTP cache instead. Prerender
// has no fetch.
if (!import.meta.env.SSR) fetch(gltfPath).catch(() => {});

const props = withDefaults(defineProps<{ mouth: number; dizzy?: boolean }>(), {
  dizzy: false,
});

// The rig object: glTF's unique-name pass strips the dot out of "rig.001".
const HEAD_NODE = 'rig001';
const MOUTH_MATERIAL = 'MAT_alex_face';

type Mouth = Mesh<BufferGeometry, MeshStandardMaterial>;

const emit = defineEmits<{ ready: [] }>();
const { onBeforeRender, onAfterRender } = useLoop();
const { scene } = await useGLTF(gltfPath);

// One frame in, the model is parsed, posed and drawn: safe to reveal.
let announced = false;
onAfterRender(() => {
  if (announced) return;
  announced = true;
  emit('ready');
});

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
let mouthMesh: Mouth | undefined;
// The skin is spread over two bone chains that only meet at the rig object,
// and most of the geometry is weighted to `root`, so turning a single bone
// would tear the head apart. The rig object carries all of it.
let head: Object3D | undefined;
scene.traverse((object) => {
  const mesh = object as Partial<Mouth>;
  if (mesh.isMesh && mesh.material?.name === MOUTH_MATERIAL) mouthMesh = mesh as Mouth;
  if (object.name === HEAD_NODE) head = object;
});
if (!mouthMesh || !head) throw new Error(`NerdieHead: mouth or "${HEAD_NODE}" missing`);

// Keep the rest pose: writing the rotation straight onto the object would drop
// the pose it was exported in.
const rest = head.quaternion.clone();
const tilt = new Euler();
const tiltRotation = new Quaternion();
const pose = new Vector3();
const target = new Vector3();
const pointer = { x: 0, y: 0 };

function setMouth(frame: number) {
  if (mouthMesh) mouthMesh.material.map = mouthFrames[frame];
}
setMouth(props.mouth);
watch(() => props.mouth, setMouth);

onBeforeRender(({ delta, elapsed }) => {
  if (!head) return;

  if (props.dizzy) {
    // Lolls about instead of aiming, then eases back into place when it wears off.
    target.set(Math.sin(elapsed * 7) * 0.35, Math.sin(elapsed * 5) * 0.7, Math.sin(elapsed * 9) * 0.3);
  } else {
    target.set(pointer.y * 0.3, pointer.x * 0.5, 0);
  }

  pose.lerp(target, Math.min(1, delta * 10));
  tilt.set(pose.x, pose.y, pose.z);
  head.quaternion.copy(rest).multiply(tiltRotation.setFromEuler(tilt));
});

function onPointerMove(event: PointerEvent) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
}
window.addEventListener('pointermove', onPointerMove);

onUnmounted(() => window.removeEventListener('pointermove', onPointerMove));
</script>
