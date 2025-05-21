
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';

const VoiceDictation: React.FC = () => {
  const { isListening, toggleListening } = useSpeechRecognition();
  const { toast } = useToast();
  
  const handleToggle = () => {
    toggleListening();
    
    // Afficher un toast pour informer l'utilisateur de l'état
    if (!isListening) {
      toast({
        title: "Dictée vocale activée",
        description: "Parlez maintenant pour dicter du texte"
      });
    } else {
      toast({
        title: "Dictée vocale désactivée"
      });
    }
  };
  
  return (
    <Toggle
      pressed={isListening}
      onPressedChange={handleToggle}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        isListening 
          ? "bg-red-500 text-white animate-pulse" 
          : "bg-dysaccess-blue text-white hover:bg-dysaccess-light-blue"
      }`}
      aria-label={isListening ? "Désactiver la dictée vocale" : "Activer la dictée vocale"}
    >
      {isListening ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Toggle>
  );
};

export default VoiceDictation;
