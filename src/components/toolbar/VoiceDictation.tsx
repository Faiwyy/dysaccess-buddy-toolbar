
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

const VoiceDictation: React.FC = () => {
  const { isListening, toggleListening } = useSpeechRecognition();
  
  return (
    <button
      onClick={toggleListening}
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
    </button>
  );
};

export default VoiceDictation;
