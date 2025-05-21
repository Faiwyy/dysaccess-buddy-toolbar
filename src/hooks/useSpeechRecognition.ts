
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();
  
  // Create a reference to the SpeechRecognition object
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Dictée vocale non disponible",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale",
        variant: "destructive"
      });
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'fr-FR'; // Set language to French
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    
    recognitionInstance.onstart = () => setIsListening(true);
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      
      if (result.isFinal) {
        const text = result[0].transcript;
        setTranscript(prev => prev + text + ' ');
        
        // Try to dispatch an input event to the focused element
        const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          )?.set;
          
          if (nativeInputValueSetter) {
            const lastValue = activeElement.value;
            nativeInputValueSetter.call(activeElement, lastValue + text + ' ');
            
            // Trigger input event
            const event = new Event('input', { bubbles: true });
            activeElement.dispatchEvent(event);
          }
        }
      }
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: "Erreur de reconnaissance vocale",
        description: `Erreur: ${event.error}`,
        variant: "destructive"
      });
    };
    
    setRecognition(recognitionInstance);
    
    // Listen for toggle events from the Electron main process
    const handleToggle = () => {
      if (isListening) {
        recognitionInstance.stop();
      } else {
        try {
          recognitionInstance.start();
        } catch (e) {
          console.error("Error starting speech recognition:", e);
        }
      }
    };
    
    document.addEventListener('toggle-speech-recognition', handleToggle);
    
    return () => {
      document.removeEventListener('toggle-speech-recognition', handleToggle);
      if (isListening && recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [isListening, toast]);
  
  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        toast({
          title: "Dictée vocale activée",
          description: "Parlez maintenant pour dicter du texte"
        });
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  }, [recognition, isListening, toast]);
  
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      toast({
        title: "Dictée vocale désactivée"
      });
    }
  }, [recognition, isListening, toast]);
  
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    toggleListening
  };
};
