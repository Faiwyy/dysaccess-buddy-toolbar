
import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isInitialized = useRef(false);
  
  // Initialize speech recognition once
  useEffect(() => {
    if (isInitialized.current) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      toast({
        title: "Dictée vocale non disponible",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale",
        variant: "destructive"
      });
      return;
    }

    // Check network connectivity
    if (!navigator.onLine) {
      console.error('No network connection for speech recognition');
      toast({
        title: "Connexion réseau requise",
        description: "La reconnaissance vocale nécessite une connexion internet",
        variant: "destructive"
      });
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'fr-FR';
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.maxAlternatives = 1;
    
    recognitionInstance.onstart = () => {
      setIsListening(true);
      console.log("Reconnaissance vocale démarrée");
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
      console.log("Reconnaissance vocale arrêtée");
    };
    
    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      
      if (result.isFinal) {
        const text = result[0].transcript;
        setTranscript(prev => prev + text + ' ');
        console.log("Texte reconnu:", text);
        
        if (window.electronAPI) {
          insertTextIntoActiveElement(text);
        } else {
          const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
          if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            insertTextIntoInputElement(activeElement, text);
          }
        }
      }
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = "Une erreur s'est produite";
      
      switch (event.error) {
        case 'not-allowed':
        case 'audio-capture':
          errorMessage = "Accès au microphone refusé. Veuillez autoriser l'accès dans les paramètres.";
          break;
        case 'network':
          errorMessage = "Problème de connexion. Vérifiez votre connexion internet.";
          // Try to restart if it's a temporary network issue
          setTimeout(() => {
            if (navigator.onLine && recognitionRef.current) {
              console.log("Tentative de redémarrage après erreur réseau");
              startListening();
            }
          }, 2000);
          break;
        case 'aborted':
          return; // Don't show toast for user-initiated stops
        case 'no-speech':
          errorMessage = "Aucune parole détectée. Parlez plus fort ou vérifiez votre microphone.";
          break;
        case 'service-not-allowed':
          errorMessage = "Service de reconnaissance vocale non autorisé.";
          break;
        default:
          errorMessage = `Erreur de reconnaissance vocale: ${event.error}`;
      }
      
      toast({
        title: "Erreur de reconnaissance vocale",
        description: errorMessage,
        variant: "destructive"
      });
    };
    
    recognitionRef.current = recognitionInstance;
    isInitialized.current = true;
    
    return () => {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);
  
  const insertTextIntoInputElement = (element: HTMLInputElement | HTMLTextAreaElement, text: string) => {
    try {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        element instanceof HTMLInputElement 
          ? window.HTMLInputElement.prototype 
          : window.HTMLTextAreaElement.prototype, 
        'value'
      )?.set;
      
      if (nativeInputValueSetter) {
        const lastValue = element.value;
        nativeInputValueSetter.call(element, lastValue + text + ' ');
        
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error inserting text:', error);
    }
  };

  const insertTextIntoActiveElement = (text: string) => {
    if (window.electronAPI) {
      console.log("Inserting text via Electron:", text);
      
      try {
        navigator.clipboard.writeText(text + ' ')
          .then(() => {
            console.log("Text copied to clipboard, ready for paste operation");
          })
          .catch(err => {
            console.error('Failed to copy text to clipboard:', err);
          });
      } catch (error) {
        console.error("Error in clipboard operation:", error);
      }
    }
  };
  
  useEffect(() => {
    const handleToggle = () => {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    };
    
    document.addEventListener('toggle-speech-recognition', handleToggle);
    
    return () => {
      document.removeEventListener('toggle-speech-recognition', handleToggle);
    };
  }, [isListening]);
  
  const startListening = useCallback(() => {
    if (!navigator.onLine) {
      toast({
        title: "Connexion requise",
        description: "La reconnaissance vocale nécessite une connexion internet",
        variant: "destructive"
      });
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        console.log("Démarrage de la reconnaissance vocale");
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        setIsListening(false);
        toast({
          title: "Erreur de démarrage",
          description: "Impossible de démarrer la reconnaissance vocale. Vérifiez votre microphone.",
          variant: "destructive"
        });
      }
    }
  }, [isListening, toast]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        console.log("Arrêt de la reconnaissance vocale");
      } catch (e) {
        console.error("Error stopping speech recognition:", e);
      }
    }
  }, [isListening]);
  
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
