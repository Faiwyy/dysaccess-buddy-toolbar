
import React from "react";
import { Smile, GripHorizontal } from "lucide-react";

interface BuddyMascotProps {
  showTip?: boolean;
  tipText?: string;
}

const BuddyMascot: React.FC<BuddyMascotProps> = () => {
  return (
    <div className="relative flex items-center">
      {/* Icône de déplacement */}
      <div className="absolute -left-1 -top-4">
        <GripHorizontal className="h-4 w-4 text-dysaccess-text opacity-50" />
      </div>
      
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
    </div>
  );
};

export default BuddyMascot;
