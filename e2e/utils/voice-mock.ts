export async function mockVoiceAPI(page: any) {
  await page.addInitScript(() => {
    (window as any).SpeechRecognition = function() {
      this.start = () => {};
      this.stop = () => {};
      this.abort = () => {};
    };
    (window as any).webkitSpeechRecognition = (window as any).SpeechRecognition;
  });
}
export async function mockMediaDevices(page: any) {
  await page.addInitScript(() => {
    if (!navigator.mediaDevices) {
      (navigator as any).mediaDevices = {};
    }
    navigator.mediaDevices.getUserMedia = async () => ({
      getTracks: () => [{ stop: () => {} }]
    } as any);
  });
}
export async function simulateVoiceInput(page: any, text: string) {
  // basic mock for testing since component just looks for transcript changes
  await page.evaluate((text: string) => {
    // Just a placeholder since the actual component might need deeper mocking
  }, text);
}
