
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
  
  // Utiliser useRef pour stocker l'instance de reconnaissance vocale
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Initialiser la reconnaissance vocale une seule fois
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
    recognitionInstance.lang = 'fr-FR'; // Langue française
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    
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
        
        // Insérer le texte dans l'élément actif
        const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          )?.set;
          
          if (nativeInputValueSetter) {
            const lastValue = activeElement.value;
            nativeInputValueSetter.call(activeElement, lastValue + text + ' ');
            
            // Déclencher un événement input pour mettre à jour l'interface utilisateur
            const event = new Event('input', { bubbles: true });
            activeElement.dispatchEvent(event);
          }
        }
      }
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      
      // Réinitialiser l'état si une erreur survient
      setIsListening(false);
      
      // Message d'erreur personnalisé en fonction du type d'erreur
      let errorMessage = "Une erreur s'est produite";
      
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        errorMessage = "Accès au microphone refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
      } else if (event.error === 'network') {
        errorMessage = "Problème de connexion réseau";
      } else if (event.error === 'aborted') {
        // Ne pas afficher de toast si l'utilisateur a simplement arrêté la reconnaissance
        return;
      }
      
      toast({
        title: "Erreur de reconnaissance vocale",
        description: errorMessage,
        variant: "destructive"
      });
    };
    
    recognitionRef.current = recognitionInstance;
    
    // Nettoyer à la sortie
    return () => {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);
  
  // Écouter les événements de l'API Electron
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
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        console.log("Démarrage de la reconnaissance vocale");
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        // Si une erreur se produit lors du démarrage, réinitialiser l'état
        setIsListening(false);
        toast({
          title: "Erreur de démarrage",
          description: "Impossible de démarrer la reconnaissance vocale",
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
