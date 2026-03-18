import { useState, useCallback, useEffect, useRef } from 'react';

export function useVisionPulse(onFrame: (base64: string) => void) {
  const [isCapturing, setIsCapturing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const captureFrame = useCallback(async () => {
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve(true);
      });
      
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
      onFrame(base64);
    } catch (error) {
      console.error("Vision Pulse capture failed:", error);
    } finally {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    }
  }, [onFrame]);

  const startPulse = useCallback((intervalMs: number = 5000) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setIsCapturing(true);
    captureFrame(); // Initial capture
    intervalRef.current = setInterval(captureFrame, intervalMs);
  }, [captureFrame]);

  const stopPulse = useCallback(() => {
    setIsCapturing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPulse();
  }, [stopPulse]);

  return { isCapturing, startPulse, stopPulse };
}
