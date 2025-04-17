
import React from "react";
import { Lightbulb, Smile } from "lucide-react";

interface BuddyMascotProps {
  showTip?: boolean;
  tipText?: string;
}

const BuddyMascot: React.FC<BuddyMascotProps> = ({ 
  showTip = false, 
  tipText = "Clique sur une icône pour ouvrir l'application !" 
}) => {
  return (
    <div className="relative">
      {/* Mascotte Buddy */}
      <div className="relative buddy-bounce">
        <div className="w-14 h-14 rounded-full bg-dysaccess-purple flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Smile className="h-8 w-8 text-dysaccess-purple" />
          </div>
        </div>
        
        {/* Antennes */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <div className="w-1 h-5 bg-dysaccess-purple rounded-full -ml-3"></div>
          <div className="w-1 h-5 bg-dysaccess-purple rounded-full"></div>
        </div>
      </div>
      
      {/* Bulle d'info */}
      {showTip && (
        <div className="absolute top-0 left-16 bg-white p-3 rounded-xl shadow-md w-44 dyslexic-friendly text-sm text-dysaccess-text">
          <div className="absolute -left-2 top-4 w-4 h-4 bg-white transform rotate-45"></div>
          <div className="flex items-start">
            <Lightbulb className="h-4 w-4 text-dysaccess-yellow mr-2 mt-0.5 flex-shrink-0" />
            <p>{tipText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuddyMascot;
