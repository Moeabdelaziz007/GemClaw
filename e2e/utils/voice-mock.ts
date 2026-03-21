import { test, expect } from '@playwright/test';

/**
 * Mocks the Web Speech API (SpeechRecognition and SpeechSynthesis)
 * to allow deterministic testing of the voice-first intent engine.
 */
import { Page } from '@playwright/test';
export async function mockVoiceAPI(page: Page) {
  await page.addInitScript(() => {
    // Mock SpeechRecognition
    window.SpeechRecognition = window.webkitSpeechRecognition = function() {
      this.start = () => {
        console.log('[MockSpeech] Recognition started');
        // Simulate a delay then result
        setTimeout(() => {
          if (this.onresult) {
            this.onresult({
              results: [[{ transcript: window.__MOCK_VOICE_INPUT || '', confidence: 0.99 }]],
              resultIndex: 0
            });
          }
        }, 500);
      };
      this.stop = () => console.log('[MockSpeech] Recognition stopped');
    };

    // Mock SpeechSynthesis
    window.speechSynthesis = {
      speak: (utterance) => {
        console.log('[MockSpeech] Speaking:', utterance.text);
        window.__LAST_SPOKEN = utterance.text;
        if (utterance.onend) utterance.onend();
      },
      cancel: () => {},
      getVoices: () => []
    };
  });
}

/**
 * Simulates user voice input by setting a global variable used by the mock.
 */
export async function simulateVoiceInput(page, text: string) {
  await page.evaluate((t) => {
    (window as any).__MOCK_VOICE_INPUT = t;
  }, text);
}
