import { useEffect, useRef, useState, useCallback } from 'react';

export function useNeuralFallback(sab: SharedArrayBuffer | null, isEnabled: boolean) {
  const [transcription, setTranscription] = useState("");
  const [status, setStatus] = useState("Idle");
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!isEnabled || !sab) {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      return;
    }

    const worker = new Worker(new URL('../lib/workers/whisper.worker.ts', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'STATUS') setStatus(payload);
      if (type === 'TRANSCRIPTION') setTranscription(payload);
    };

    worker.postMessage({ type: 'INIT' });
    worker.postMessage({ type: 'SAB_SETUP', payload: { sab } });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [isEnabled, sab]);

  return { transcription, status };
}
