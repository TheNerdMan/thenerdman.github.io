import { onUnmounted, ref } from 'vue';

// The mouth frames run closed to open, so each gap needs more volume than the
// last. One level per gap between the four frames.
const LEVELS = [0.02, 0.06, 0.12];

/**
 * Picks a mouth frame from the microphone volume while listening. The caller
 * can also set `frame` directly, which is what the buttons do.
 */
export function useVoiceMouth() {
  const frame = ref(0);
  const listening = ref(false);

  let stream: MediaStream | undefined;
  let audio: AudioContext | undefined;
  let analyser: AnalyserNode | undefined;
  let samples: Uint8Array | undefined;
  let ticker = 0;

  function follow() {
    ticker = requestAnimationFrame(follow);
    analyser!.getByteTimeDomainData(samples!);
    let sum = 0;
    for (const sample of samples!) {
      const centred = (sample - 128) / 128;
      sum += centred * centred;
    }
    const volume = Math.sqrt(sum / samples!.length);
    let loudest = 0;
    while (loudest < LEVELS.length && volume > LEVELS[loudest]) loudest++;
    frame.value = loudest;
  }
  async function start() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audio = new AudioContext();
      analyser = audio.createAnalyser();
      analyser.fftSize = 256;
      audio.createMediaStreamSource(stream).connect(analyser);
      samples = new Uint8Array(analyser.fftSize);
      listening.value = true;
      follow();
    } catch (error) {
      console.warn('[useVoiceMouth] no microphone', error);
    }
  }

  function stop() {
    cancelAnimationFrame(ticker);
    stream?.getTracks().forEach((track) => track.stop());
    void audio?.close();
    stream = audio = undefined;
    analyser = samples = undefined;
    listening.value = false;
  }

  onUnmounted(stop);

  return { frame, listening, start, stop };
}
