'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, SkipForward, ChevronLeft,
  Brain, Zap, Activity, Loader2
} from 'lucide-react';
import { useVoiceInteraction } from '../hooks/useVoiceInteraction';
import { useTextToSpeech } from '../lib/agents/ttsService';
import { 
  CONVERSATION_FLOW, 
  ConversationStep, 
  getNextStep, 
  getPreviousStep,
  getStepDataUpdate
} from '../lib/agents/conversationFlow';
import { Button } from './ui/Button';

interface AgentFormData {
  name: string;
  description: string;
  voiceName: string;
  computeTier: 'Standard' | 'Neural' | 'Gemigram';
  systemPrompt: string;
  rules: string;
  soul: string;
  tools: Record<string, boolean>;
  skills: Record<string, boolean>;
}

interface ConversationalAgentCreatorProps {
  onClose: () => void;
  onSubmit: (data: AgentFormData) => void;
}

export default function ConversationalAgentCreator({ 
  onClose, 
  onSubmit 
}: ConversationalAgentCreatorProps) {
  const [currentStep, setCurrentStep] = useState<ConversationStep>('GREETING');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Array<{
    speaker: 'ASTRAEUS' | 'USER';
    text: string;
    timestamp: Date;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentData, setAgentData] = useState<Partial<AgentFormData>>({});
  const [micPermission, setMicPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);
  const setVoiceSession = useGemigramStore(state => state.setVoiceSession);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Voice hooks
  const { 
    transcript, 
    confidence,
    isListening, 
    startListening, 
    stopListening,
    isSupported: speechRecognitionSupported,
    resetTranscript
  } = useVoiceInteraction();
  
  const { speak, cancel: cancelSpeech, isSpeaking } = useTextToSpeech();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle transcript from voice input
  useEffect(() => {
    if (transcript && isListening === false) {
      if (confidence > 0.90) {
        // >90% -> auto-fill and advance
        setUserInput(transcript);
        handleSendMessage(transcript);
      } else if (confidence >= 0.70 && confidence <= 0.90) {
        // 70-90% -> warn and allow override
        setUserInput(transcript);
        setMessages(prev => [...prev, {
          speaker: 'ASTRAEUS',
          text: `[WARNING] Confidence ${Math.round(confidence * 100)}%. I heard: "${transcript}". You may override or submit.`,
          timestamp: new Date()
        }]);
        // Do not auto handleSendMessage, let user verify visually (visual warning) and then user can manually confirm if they want, but since no text input, wait how to override? 
        // User just says "confirm" or re-speaks. Actually, we can just populate UI and wait.
      } else if (confidence > 0 && confidence < 0.70) {
        // <70% -> re-ask
        const msg = "I didn't quite catch that. Could you repeat?";
        setMessages(prev => [...prev, {
          speaker: 'ASTRAEUS',
          text: msg,
          timestamp: new Date()
        }]);
        speak(msg);
        resetTranscript();
      }
    }
  }, [transcript, confidence, isListening]);

  useEffect(() => {
    setVoiceSession({ stage: 'forge', lastVoiceAction: 'Conversational forge opened. Checking microphone permission.' });

    const checkMicPermission = async () => {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setMicPermission('denied');
        setPermissionChecked(true);
        setVoiceSession({ micPermission: 'denied', lastVoiceAction: 'Microphone API not available. Use text fallback to continue.' });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setMicPermission('granted');
        setPermissionChecked(true);
        setVoiceSession({ micPermission: 'granted', lastVoiceAction: 'Mic ready. Voice onboarding is active.' });
      } catch (error) {
        setMicPermission('denied');
        setPermissionChecked(true);
        setVoiceSession({ micPermission: 'denied', lastVoiceAction: 'Mic blocked. Continue with text prompts or retry permissions.' });
      }
    };

    checkMicPermission();
  }, [setVoiceSession]);

  useEffect(() => {
    if (permissionChecked && micPermission === 'granted' && speechRecognitionSupported && !isListening && !isProcessing) {
      startListening();
    }
  }, [permissionChecked, micPermission, speechRecognitionSupported, isListening, isProcessing, startListening]);

  // Speak Gemini lines
  useEffect(() => {
    const message = CONVERSATION_FLOW[currentStep];
    
    if (currentStep === 'NEURAL_SYNTHESIS') {
      synthesizeBlueprint();
    }

    if (message.speaker === 'ASTRAEUS' && message.voicePrompt) {
      // Small delay for natural flow
      const timer = setTimeout(() => {
        speak(message.voicePrompt!, { rate: 0.95, pitch: 1.0 });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleSendMessage = async (text?: string) => {
    const inputText = text || userInput;
    if (!inputText.trim()) return;

    setIsProcessing(true);
    cancelSpeech();

    // Add user message to chat
    const newMessage = {
      speaker: 'USER' as const,
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setUserInput('');

    // Process response based on current step
    await processStepResponse(inputText);
  };

  const synthesizeBlueprint = async () => {
    setIsSynthesizing(true);
    try {
      const transcriptText = messages.map(m => `${m.speaker}: ${m.text}`).join('\n');
      const response = await fetch('/api/forge/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: agentData.description, 
          currentTranscript: transcriptText 
        }),
      });

      const data = await response.json();
      if (isMounted.current && data.blueprint) {
        setBlueprint(data.blueprint);
        
        // Update agent data with blueprint results
        setAgentData(prev => ({
          ...prev,
          name: data.blueprint.name,
          systemPrompt: data.blueprint.systemPrompt,
          voiceName: data.blueprint.voiceName,
          tools: data.blueprint.tools,
          skills: data.blueprint.skills
        }));

        // Present the pitch
        const pitchMessage = {
          speaker: 'ASTRAEUS' as const,
          text: `Neural Synthesis complete. I have architected "${data.blueprint.name}", target role: ${data.blueprint.role}. I've pre-configured your entity with ${Object.values(data.blueprint.tools).filter(Boolean).length} sensory tools and ${Object.values(data.blueprint.skills).filter(Boolean).length} workspace bridges. Does this align with your vision?`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, pitchMessage]);
        speak(pitchMessage.text).then(() => {
          // Auto-advance to voice selection after synthesis pitch
          setTimeout(() => {
            if (isMounted.current) {
              setCurrentStep('VOICE_SELECTION');
            }
          }, 2000);
        });
      }
    } catch (error) {
      console.error('Synthesis failed:', error);
    } finally {
      if (isMounted.current) {
        setIsSynthesizing(false);
      }
    }
  };

  const processStepResponse = async (input: string) => {
    const message = CONVERSATION_FLOW[currentStep];
    
    // Validate input if required
    if (message.requiresInput && message.validation) {
      const result = message.validation(input);
      if (!result.valid) {
        // Show error and re-ask question
        const errorMessage = {
          speaker: 'ASTRAEUS' as const,
          text: `I need clarification: ${result.error}. ${message.text}`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        speak(errorMessage.text);
        setIsProcessing(false);
        return;
      }
    }

    // Store data based on step
    const updates = getStepDataUpdate(currentStep, input);
    if (Object.keys(updates).length > 0) {
      setAgentData(prev => ({ ...prev, ...updates }));
    }

    // Move to next step
    const next = getNextStep(currentStep);
    if (next) {
      setTimeout(() => {
        setCurrentStep(next);
        setIsProcessing(false);
      }, 1000);
    } else {
      // Final step - submit form
      finalizeCreation();
    }
  };

  const finalizeCreation = () => {
    // Prepare final agent data
    const finalData: AgentFormData = {
      name: agentData.name || 'Unknown',
      description: agentData.description || 'AI Assistant',
      voiceName: agentData.voiceName || 'Zephyr',
      computeTier: agentData.computeTier || 'Neural',
      systemPrompt: agentData.systemPrompt || 'You are a helpful assistant.',
      rules: agentData.rules || 'Be helpful and honest.',
      soul: agentData.soul || 'Friendly and curious.',
      tools: agentData.tools || {},
      skills: agentData.skills || {},
    };

    // Announce completion
    const completionMessage = {
      speaker: 'ASTRAEUS' as const,
      text: "Consciousness matrix initialized. Your sovereign AI entity awakens now.",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, completionMessage]);
    speak(completionMessage.text, {}).then(() => {
      onSubmit(finalData);
    });
  };

  const handleGoBack = () => {
    const prev = getPreviousStep(currentStep);
    if (prev) {
      cancelSpeech();
      setCurrentStep(prev);
    }
  };

  const handleSkipStep = () => {
    const next = getNextStep(currentStep);
    if (next) {
      cancelSpeech();
      setCurrentStep(next);
    }
  };

  const currentMessage = CONVERSATION_FLOW[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aether-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl h-[85vh] bg-bg-primary/90 border border-border-color rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col"
      >
        {/* Obsidian Depth Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-gemigram-neon/5 to-transparent" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-purple/5 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] carbon-fiber" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 shrink-0 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-black border border-gemigram-neon/40 flex items-center justify-center shadow-[0_0_20px_rgba(142,255,113,0.15)]">
              <Brain className="w-7 h-7 text-gemigram-neon" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-[0.4em] uppercase text-white flex items-center gap-4">
                <span className="text-gemigram-neon">Aether</span> Forge
              </h2>
              <p className="text-[11px] font-mono text-text-secondary uppercase tracking-[0.4em] mt-1.5 mix-blend-plus-lighter">
                Neural Synthesis & Materialization
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              disabled={currentStep === 'GREETING'}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipStep}
              rightIcon={<SkipForward className="w-4 h-4" />}
            >
              Skip
            </Button>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-white/50 hover:text-white">×</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.speaker === 'USER' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.speaker === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                  <div className={`max-w-[85%] rounded-[24px] px-7 py-5 ${
                    msg.speaker === 'USER' 
                      ? 'bg-gemigram-neon/10 border border-gemigram-neon/20 text-white shadow-[0_0_30px_rgba(142,255,113,0.05)]' 
                      : 'bg-surface-container-low border border-white/5 text-white shadow-xl'
                  }`}>
                    <p className="text-[15px] leading-relaxed font-medium tracking-wide">{msg.text}</p>
                    <p className="text-[10px] font-mono text-text-tertiary mt-3 uppercase tracking-widest">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {msg.speaker}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Current Astraeus Message */}
            {currentMessage.speaker === 'ASTRAEUS' && !messages.find(m => m.text === currentMessage.text) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] rounded-3xl px-6 py-4 glass-medium border border-gemigram-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-3 h-3 text-gemigram-neon animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-gemigram-neon">
                      Astraeus Speaking
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-white">{currentMessage.text}</p>
                  
                  {/* Neural Blueprint Visualization */}
                  {blueprint && currentStep === 'VOICE_SELECTION' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white/40">Sovereign Blueprint</span>
                        <Zap className="w-3 h-3 text-gemigram-neon" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <p className="text-[8px] text-white/30 uppercase font-black">Core Tools</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(blueprint.tools).filter(([, v]) => v).map(([k]) => (
                              <span key={k} className="px-2 py-0.5 rounded-md bg-gemigram-neon/10 border border-gemigram-neon/20 text-[8px] text-gemigram-neon uppercase">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] text-white/30 uppercase font-black">Neural Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(blueprint.skills).filter(([, v]) => v).map(([k]) => (
                              <span key={k} className="px-2 py-0.5 rounded-md bg-fuchsia-500/10 border border-fuchsia-500/20 text-[8px] text-fuchsia-400 uppercase">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[8px] text-white/30 uppercase font-black mb-1">Synthesized Persona</p>
                        <p className="text-[10px] text-white/70 italic line-clamp-2">"{blueprint.systemPrompt}"</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Suggestions */}
                  {currentMessage.suggestions && currentMessage.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {currentMessage.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-4 py-2 rounded-xl bg-gemigram-neon/10 border border-gemigram-neon/20 text-gemigram-neon text-xs font-black uppercase tracking-widest hover:bg-gemigram-neon/20 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/5 px-8 py-6 shrink-0">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Status Indicators */}            <div className="flex items-center justify-center gap-10 text-[10px] font-mono uppercase tracking-[0.3em] pb-2 border-b border-white/5 mb-6">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="text-gemigram-neon font-black">STEP</span>
                <span className="text-white bg-white/10 px-2 py-0.5 rounded-md">
                  {Math.min(Object.keys(CONVERSATION_FLOW).indexOf(currentStep) + 1, 11)}/11
                </span>
              </div>
              <div className={`flex items-center gap-3 ${speechRecognitionSupported ? 'text-gemigram-neon' : 'text-red-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-gemigram-neon'}`} />
                <span>LINK: {micPermission === 'granted' ? 'STABLE' : 'FAILED'}</span>
              </div>
              <div className={`flex items-center gap-3 ${isSpeaking() ? 'text-accent-purple' : 'text-text-tertiary'}`}>
                <Activity className="w-3 h-3" />
                <span>BIO-FEEDBACK: {isSpeaking() ? 'ACTIVE' : 'IDLE'}</span>
              </div>
            </div>

            {permissionChecked && micPermission === 'denied' && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-[11px] text-red-300 font-mono text-center uppercase tracking-widest leading-relaxed">
                [SYSTEM ERROR] MIC_PERMISSION_DENIED. ESTABLISHING TEXTUAL INTERFACE FALLBACK.
              </div>
            )}

            {/* Input Controls */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <motion.div 
                  initial={false}
                  animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gemigram-neon/20 rounded-full blur-xl opacity-50" 
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={!speechRecognitionSupported || micPermission === 'denied'}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all relative z-10 ${
                    isListening 
                      ? 'bg-black border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]' 
                      : micPermission === 'denied' || !speechRecognitionSupported
                      ? 'bg-black border-2 border-white/10 text-white/30 cursor-not-allowed opacity-40'
                      : 'bg-black border-2 border-gemigram-neon shadow-[0_0_40px_rgba(142,255,113,0.2)] hover:shadow-[0_0_60px_rgba(142,255,113,0.3)]'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8 text-red-500" />
                  ) : (
                    <Mic className="w-8 h-8 text-gemigram-neon" />
                  )}
                </button>
              </div>

              <div className="flex-1 relative">
                <div className="w-full bg-black border border-white/10 rounded-3xl px-8 py-6 text-text-secondary font-mono text-sm min-h-[80px] flex items-center shadow-inner">
                  {isListening ? (
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <motion.span 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="tracking-[0.1em] text-white"
                      >
                        ANALYZING NEURAL IMPRINT...
                      </motion.span>
                    </div>
                  ) : isProcessing ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-gemigram-neon" />
                      <span className="tracking-[0.1em]">SEQUENCING COGNITIVE DATA...</span>
                    </div>
                  ) : (
                    <span className="tracking-[0.2em] opacity-30 italic">AWAITING NEURAL LINK COMMAND...</span>
                  )}
                </div>
              </div>


              {/* Text input removed to enforce VOICE-ONLY challenge rules */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
