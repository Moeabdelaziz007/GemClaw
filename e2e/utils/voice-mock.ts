import { Page } from '@playwright/test';

/**
 * Mocks the Web Speech API (SpeechRecognition and SpeechSynthesis)
 * to allow deterministic testing of voice-first interfaces.
 */
export async function mockVoiceAPI(page: Page) {
  await page.addInitScript(() => {
    // Mock SpeechRecognition
    window.SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    class MockSpeechRecognition extends EventTarget {
      continuous = false;
      interimResults = false;
      lang = 'en-US';
      
      start() {
        console.log('[VoiceMock] Recognition started');
        this.dispatchEvent(new Event('start'));
      }
      
      stop() {
        console.log('[VoiceMock] Recognition stopped');
        this.dispatchEvent(new Event('end'));
      }

      abort() {
        this.stop();
      }

      // Helper for tests to trigger a result
      simulateResult(text: string, isFinal = true) {
        const event = new CustomEvent('result', {
          detail: {
            results: [
              {
                isFinal,
                0: { transcript: text, confidence: 0.99 }
              }
            ],
            resultIndex: 0
          }
        });
        // We have to manualy assign the results to the event object because 
        // SpeechRecognitionEvent has a specific structure
        Object.defineProperty(event, 'results', { value: (event.detail as any).results });
        Object.defineProperty(event, 'resultIndex', { value: (event.detail as any).resultIndex });
        this.dispatchEvent(event);
      }
    }

    (window as any).SpeechRecognition = MockSpeechRecognition;
    (window as any).webkitSpeechRecognition = MockSpeechRecognition;

    // Mock SpeechSynthesis
    const mockSynthesis = {
      speaking: false,
      pending: false,
      paused: false,
      getVoices: () => [],
      speak: (utterance: SpeechSynthesisUtterance) => {
        console.log(`[VoiceMock] Speaking: ${utterance.text}`);
        mockSynthesis.speaking = true;
        
        // Notify the test script via a window property if needed
        (window as any).lastSpokenText = utterance.text;

        // Simulate speech ending after a short delay
        setTimeout(() => {
          mockSynthesis.speaking = false;
          if (utterance.onend) {
            utterance.onend(new SpeechSynthesisEvent('end', { utterance }));
          }
        }, 100);
      },
      cancel: () => {
        mockSynthesis.speaking = false;
      },
      pause: () => {
        mockSynthesis.paused = true;
      },
      resume: () => {
        mockSynthesis.paused = false;
      }
    };

    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSynthesis,
      configurable: true
    });
  });
}
