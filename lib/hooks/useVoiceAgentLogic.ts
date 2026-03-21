import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLiveAPI } from '@/hooks/useLiveAPI';
import { useNeuralFallback } from '@/hooks/useNeuralFallback';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';
import { useGemigramStore, Agent } from '@/lib/store/useGemigramStore';
import { bridgeStatusManager } from '@/lib/utils/bridgeStatusManager';
import { ToolResult, Tool, FunctionDeclaration } from '@/lib/types/live-api';

export interface UseVoiceAgentLogicProps {
  activeAgent: Agent;
  googleAccessToken?: string;
}

export function useVoiceAgentLogic({ activeAgent, googleAccessToken }: UseVoiceAgentLogicProps) {
  const [activeWidget, setActiveWidget] = useState<ToolResult | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  
  const transcript = useGemigramStore(state => state.transcript);
  const linkType = useGemigramStore(state => state.linkType);
  const setLinkType = useGemigramStore(state => state.setLinkType);

  useEffect(() => {
    const currentStatus = bridgeStatusManager.getStatus();
    setLinkType(currentStatus === 'unknown' ? 'stateless' : currentStatus as 'stateless' | 'bridge' | 'hibernating');
    
    const unsub = bridgeStatusManager.subscribe((status) => {
      setLinkType(status === 'unknown' ? 'stateless' : status as 'stateless' | 'bridge' | 'hibernating');
    });
    
    void bridgeStatusManager.probe();
    return unsub;
  }, [setLinkType]);
  
  const { 
    isConnected, 
    isRecording, 
    logs, 
    volume: cloudVolume, 
    connect, 
    disconnect, 
    startRecording, 
    stopRecording,
    sab // Exposed from useLiveAPI
  } = useLiveAPI('', (call) => {
    setActiveWidget(call as ToolResult);
    setIsThinking(false);
  }, googleAccessToken);

  // Neural Fallback: Local Whisper-tiny Edge AI
  const { transcription: localText } = useNeuralFallback(sab, !isConnected && isRecording);

  useEffect(() => {
    if (localText && !isConnected) {
       console.log("[Neural Fallback] Local Transcript:", localText);
       // Sync local text to transcript store if cloud is dead
       useGemigramStore.getState().addTranscriptMessage("user", `(Local) ${localText}`);
    }
  }, [localText, isConnected]);

  const { getVolume, isWasmLoaded, isSpeaking } = useAudioProcessor();

  const volume = isWasmLoaded || isSpeaking ? getVolume() : cloudVolume;

  const agentStatus = useMemo(() => {
    if (linkType === 'hibernating') return 'Hibernating';
    if (!isConnected) return 'Disconnected';
    if (activeWidget) return 'Executing';
    if (isThinking) return 'Thinking';
    if (isRecording || isSpeaking) return 'Listening';
    return 'Speaking';
  }, [isConnected, isThinking, isRecording, isSpeaking, activeWidget, linkType]);

  const toggleConnection = useCallback(() => {
    if (isConnected) {
      disconnect();
      stopRecording();
    } else {
      const tools: Tool[] = [];
      const functionDeclarations: FunctionDeclaration[] = [];

      if (activeAgent?.tools?.googleSearch) {
        tools.push({ googleSearch: {} });
      }
      
      const addTool = (name: string, desc: string, props: FunctionDeclaration['parameters']['properties'], req: string[] = []) => {
        functionDeclarations.push({
          name,
          description: desc,
          parameters: { type: 'OBJECT', properties: props, required: req }
        });
      };

      if (activeAgent?.tools?.weather) {
        addTool('getWeather', 'Get current weather', { location: { type: 'STRING' } }, ['location']);
      }
      if (activeAgent?.tools?.crypto) {
        addTool('getCryptoPrice', 'Get crypto price', { symbol: { type: 'STRING' } }, ['symbol']);
      }
      if (activeAgent?.tools?.googleMaps) {
        addTool('getMapLocation', 'Get geographical data', { location: { type: 'STRING' } });
      }

      functionDeclarations.push({
        name: 'create_agent',
        description: 'Materialize a new specialized Sovereign Intelligence agent.',
        parameters: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            role: { type: 'STRING' },
            systemPrompt: { type: 'STRING' },
            voiceName: { type: 'STRING', enum: ['Charon', 'Puck', 'Kore', 'Fenrir'] },
            tools: { type: 'ARRAY', items: { type: 'STRING' } },
            skills: { type: 'ARRAY', items: { type: 'STRING' } }
          },
          required: ['name', 'role', 'systemPrompt']
        }
      });

      addTool('listProjects', 'List all Firebase projects', {});
      addTool('getProjectDetails', 'Get detailed info for a project', { projectId: { type: 'STRING' } }, ['projectId']);

      if (functionDeclarations.length > 0) {
        tools.push({ functionDeclarations });
      }
      
      let finalPrompt = activeAgent?.systemPrompt || '';

      const activeInterrupt = useGemigramStore.getState().activeInterrupt;
      if (activeInterrupt && (Date.now() - activeInterrupt.interruptedAt < 5000)) {
        finalPrompt += `\n\n[CONTEXT: You were just interrupted by the user. Acknowledge the interruption and pivot immediately to their latest point.]`;
      }

      connect(finalPrompt, activeAgent?.voiceName, tools);
    }
  }, [isConnected, disconnect, stopRecording, connect, activeAgent]);

  return {
    isConnected,
    isRecording,
    logs,
    volume,
    agentStatus,
    activeWidget,
    transcript,
    linkType,
    showLogs,
    setShowLogs,
    toggleConnection,
    startRecording,
    stopRecording,
    setActiveWidget
  };
}
