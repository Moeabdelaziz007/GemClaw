/**
 * 🎙️ Aether Neural Spine PCM Processor
 * 
 * High-performance AudioWorklet for zero-latency Bidi streaming.
 */

class NeuralSpineProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.sab = null;
    this.writePtr = null;
    this.readPtr = null;
    this.buffer = null;
    
    this.port.onmessage = (event) => {
      if (event.data.type === 'sab_setup') {
        this.sab = event.data.sab;
        this.writePtr = new Int32Array(this.sab, 0, 1);
        this.buffer = new Int16Array(this.sab, 16);
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input[0] && this.buffer) {
      const channelData = input[0];
      
      // Convert to Int16 and write to SAB
      for (let i = 0; i < channelData.length; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        
        this.buffer[this.writePtr[0]] = int16;
        this.writePtr[0] = (this.writePtr[0] + 1) % this.buffer.length;
      }

      // Optional: Signal main thread if buffer is filling
      this.port.postMessage({ type: 'buffer_update' });
      
      // Pass-through to output
      const output = outputs[0];
      if (output && output[0]) {
        output[0].set(channelData);
      }
    }
    return true;
  }
}

registerProcessor('neural-spine-processor', NeuralSpineProcessor);
