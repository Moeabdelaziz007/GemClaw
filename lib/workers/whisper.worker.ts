import { pipeline, env } from '@xenova/transformers';

// ─── Sovereign Configuration ────
env.allowLocalModels = false;
env.useBrowserCache = true;

let transcriber: ((audio: Float32Array, options?: Record<string, any>) => Promise<any>) | null = null;
let sab: SharedArrayBuffer | null = null;
let readPtr: Int32Array | null = null;
let writePtr: Int32Array | null = null;
let buffer: Int16Array | null = null;

async function init() {
  if (!transcriber) {
    self.postMessage({ type: 'STATUS', payload: 'Loading Neural Models...' });
    transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
    self.postMessage({ type: 'STATUS', payload: 'Neural Fallback Active' });
  }
}

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    await init();
  }

  if (type === 'SAB_SETUP') {
    sab = payload.sab;
    readPtr = new Int32Array(sab!, 8, 1); // Dedicated read pointer for Fallback
    writePtr = new Int32Array(sab!, 0, 1);
    buffer = new Int16Array(sab!, 16);
    
    startProcessing();
  }
};

async function startProcessing() {
  while (true) {
    if (!buffer || !readPtr || !writePtr || !transcriber) {
      await new Promise(r => setTimeout(r, 100));
      continue;
    }

    const start = readPtr[0];
    const end = writePtr[0];

    if (start === end) {
      await new Promise(r => setTimeout(r, 100));
      continue;
    }

    // Read available samples
    let samples;
    if (end > start) {
      samples = buffer.slice(start, end);
    } else {
      const part1 = buffer.slice(start);
      const part2 = buffer.slice(0, end);
      samples = new Int16Array(part1.length + part2.length);
      samples.set(part1);
      samples.set(part2, part1.length);
    }

    // Convert Int16 -> Float32 for Transformers.js
    const float32 = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      float32[i] = samples[i] / 32768.0;
    }

    // Update read pointer
    readPtr[0] = end;

    // Run transcription
    try {
      const result = await transcriber(float32, {
        chunk_length_s: 30,
        stride_length_s: 5,
        language: 'english',
        task: 'transcribe',
        return_timestamps: false,
      });

      if (result.text.trim()) {
        self.postMessage({ type: 'TRANSCRIPTION', payload: result.text });
      }
    } catch (err) {
      console.error("[WhisperWorker] Inference error:", err);
    }
  }
}
