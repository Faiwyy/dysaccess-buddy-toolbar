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
  const isInitialized = useRef(false);
  
  // Initialiser la reconnaissance vocale une seule fois
  useEffect(() => {
    if (isInitialized.current) return;
    
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
    
    // Add additional configuration for better reliability
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
        
        // Insérer le texte dans l'élément actif, même hors de l'application
        if (window.electronAPI) {
          // Utiliser l'API Electron pour insérer le texte dans l'application active
          insertTextIntoActiveElement(text);
        } else {
          // Fallback pour le mode navigateur
          const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
          if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            insertTextIntoInputElement(activeElement, text);
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
        errorMessage = "Problème de connexion. Vérifiez votre connexion internet et réessayez.";
      } else if (event.error === 'aborted') {
        // Ne pas afficher de toast si l'utilisateur a simplement arrêté la reconnaissance
        return;
      } else if (event.error === 'no-speech') {
        errorMessage = "Aucune parole détectée. Parlez plus fort ou vérifiez votre microphone.";
      } else if (event.error === 'service-not-allowed') {
        errorMessage = "Service de reconnaissance vocale non autorisé. Vérifiez les paramètres de votre navigateur.";
      }
      
      toast({
        title: "Erreur de reconnaissance vocale",
        description: errorMessage,
        variant: "destructive"
      });
    };
    
    recognitionRef.current = recognitionInstance;
    isInitialized.current = true;
    
    // Nettoyer à la sortie
    return () => {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);
  
  // Fonction pour insérer du texte dans un élément input ou textarea
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
        
        // Déclencher un événement input pour mettre à jour l'interface utilisateur
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error inserting text:', error);
    }
  };

  // Fonction pour insérer du texte dans l'application active en mode Electron
  const insertTextIntoActiveElement = (text: string) => {
    // Dans un contexte Electron, on peut utiliser un IPC pour communiquer avec le processus principal
    // qui se chargera d'injecter le texte dans l'application active (niveau OS)
    if (window.electronAPI) {
      // Simuler l'insertion de texte via les événements clavier ou le presse-papier
      // Dans un cas réel, une fonction spécifique serait implémentée dans le main process d'Electron
      console.log("Inserting text via Electron:", text);
      
      try {
        // Copier le texte dans le presse-papier
        navigator.clipboard.writeText(text + ' ')
          .then(() => {
            // Simuler le raccourci Ctrl+V (ou Cmd+V) pour coller le texte
            console.log("Text copied to clipboard, ready for paste operation");
            // Le processus principal d'Electron pourrait ensuite simuler la combinaison de touches Ctrl+V
          })
          .catch(err => {
            console.error('Failed to copy text to clipboard:', err);
          });
      } catch (error) {
        console.error("Error in clipboard operation:", error);
      }
    }
  };
  
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
          description: "Impossible de démarrer la reconnaissance vocale. Vérifiez votre microphone et votre connexion.",
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
