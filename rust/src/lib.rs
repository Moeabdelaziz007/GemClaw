use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
pub struct VoiceEngine {
    ring_buffer: Vec<f32>,
    write_ptr: usize,
    read_ptr: usize,
    capacity: usize,
    sample_rate: u32,
    smoothed_volume: f32, // Added for Phase 14 "Accurate Voice"
}

#[wasm_bindgen]
impl VoiceEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(sample_rate: u32, jitter_ms: u32) -> VoiceEngine {
        let capacity = ((sample_rate as f32) * (jitter_ms as f32 / 1000.0)) as usize;
        let capacity = capacity.max(1024);
        
        VoiceEngine {
            ring_buffer: vec![0.0; capacity],
            write_ptr: 0,
            read_ptr: 0,
            capacity,
            sample_rate,
            smoothed_volume: 0.0,
        }
    }

    pub fn push_input(&mut self, input: &[f32]) {
        for &sample in input.iter() {
            self.ring_buffer[self.write_ptr] = sample;
            self.write_ptr = (self.write_ptr + 1) % self.capacity;
        }
        
        // Autonomously update smoothed volume (EMA)
        let current_rms = self.calculate_rms(input.len());
        let alpha = 0.15; // Smoothing factor
        self.smoothed_volume = (alpha * current_rms) + ((1.0 - alpha) * self.smoothed_volume);
    }

    fn calculate_rms(&self, window_size: usize) -> f32 {
        if window_size == 0 { return 0.0; }
        let mut sum_sq = 0.0;
        for i in 0..window_size {
            let idx = (self.write_ptr + self.capacity - i - 1) % self.capacity;
            let val = self.ring_buffer[idx];
            sum_sq += val * val;
        }
        (sum_sq / window_size as f32).sqrt()
    }

    pub fn pull_output(&mut self, size: usize) -> Vec<f32> {
        let mut output = Vec::with_capacity(size);
        for _ in 0..size {
            output.push(self.ring_buffer[self.read_ptr]);
            self.read_ptr = (self.read_ptr + 1) % self.capacity;
        }
        output
    }

    pub fn get_volume(&self) -> f32 {
        self.smoothed_volume
    }

    pub fn get_latency_ms(&self) -> f32 {
        let diff = (self.write_ptr + self.capacity - self.read_ptr) % self.capacity;
        (diff as f32 / self.sample_rate as f32) * 1000.0
    }
}
