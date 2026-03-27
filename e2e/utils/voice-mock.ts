/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page } from '@playwright/test';

/**
 * Mocks the Web Speech API (SpeechRecognition and SpeechSynthesis)
 * to allow deterministic testing of the voice-first intent engine.
 */
export async function mockVoiceAPI(page: Page) {
  await page.addInitScript(() => {
    // Mock SpeechRecognition
    (window as any).SpeechRecognition = (window as any).webkitSpeechRecognition = function() {
      this.start = () => {
        console.log('[MockSpeech] Recognition started');
        // Simulate a delay then result
        setTimeout(() => {
          if (this.onresult) {
            this.onresult({
              results: [[{ transcript: (window as any).__MOCK_VOICE_INPUT || '', confidence: 0.99 }]],
              resultIndex: 0
            });
          }
        }, 500);
      };
      this.stop = () => console.log('[MockSpeech] Recognition stopped');
    };

    // Mock SpeechSynthesis
    (window as any).speechSynthesis = {
      speak: (utterance: any) => {
        console.log('[MockSpeech] Speaking:', utterance.text);
        (window as any).__LAST_SPOKEN = utterance.text;
        if (utterance.onend) utterance.onend();
      },
      cancel: () => {},
      getVoices: () => []
    };
  });
}

/**
 * Mocks microphone permissions and media stream acquisition so Forge can auto-start voice flow in CI.
 */
export async function mockMediaDevices(page: Page) {
  await page.addInitScript(() => {
    const mediaDevices = {
      getUserMedia: async () => ({
        getTracks: () => [{ stop: () => {} }]
      })
    };

    Object.defineProperty(navigator, 'mediaDevices', {
      value: mediaDevices,
      configurable: true,
    });
  });
}

/**
 * Simulates user voice input by setting a global variable used by the mock.
 */
export async function simulateVoiceInput(page: Page, text: string) {
  await page.evaluate((t) => {
    (window as any).__MOCK_VOICE_INPUT = t;
  }, text);
}
