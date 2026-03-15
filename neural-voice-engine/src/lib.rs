use wasm_bindgen::prelude::*;
use std::collections::VecDeque;

#[wasm_bindgen]
pub struct VoiceEngine {
    jitter_buffer: VecDeque<f32>,
    buffer_capacity: usize,
    sample_rate: u32,
    is_speaking: bool,
}

#[wasm_bindgen]
impl VoiceEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(capacity: usize, sample_rate: u32) -> Self {
        web_sys::console::log_1(&"Neural Voice Engine Initialized (Rust/WASM)".into());
        Self {
            jitter_buffer: VecDeque::with_capacity(capacity),
            buffer_capacity: capacity,
            sample_rate,
            is_speaking: false,
        }
    }

    pub fn process_audio(&mut self, input: &[f32]) -> bool {
        // 1. Push to Jitter Buffer
        for &sample in input {
            if self.jitter_buffer.len() < self.buffer_capacity {
                self.jitter_buffer.push_back(sample);
            } else {
                self.jitter_buffer.pop_front();
                self.jitter_buffer.push_back(sample);
            }
        }

        // 2. Simple VAD (Voice Activity Detection) - Amplitude based
        let mut max_amp = 0.0;
        for &sample in input {
            if sample.abs() > max_amp {
                max_amp = sample.abs();
            }
        }

        // Threshold for speaking (Adjustable)
        let threshold = 0.05;
        self.is_speaking = max_amp > threshold;

        self.is_speaking
    }

    pub fn get_buffer_status(&self) -> String {
        format!("Buffer: {}/{}", self.jitter_buffer.len(), self.buffer_capacity)
    }

    pub fn clear(&mut self) {
        self.jitter_buffer.clear();
    }
}
