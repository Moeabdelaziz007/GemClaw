class NeuralSpineProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.ptr = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      
      for (let i = 0; i < channelData.length; i++) {
        this.buffer[this.ptr] = channelData[i];
        this.ptr++;
        
        if (this.ptr >= this.bufferSize) {
          this.port.postMessage({
            type: 'audio_chunk',
            payload: this.buffer
          });
          this.buffer = new Float32Array(this.bufferSize);
          this.ptr = 0;
        }
      }
    }
    return true;
  }
}

registerProcessor('neural-spine-processor', NeuralSpineProcessor);
