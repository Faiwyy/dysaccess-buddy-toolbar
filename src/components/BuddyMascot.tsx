
import React from "react";

const BuddyMascot: React.FC = () => {
  return (
    <div className="buddy-mascot relative">
      <div className="w-10 h-10 rounded-full overflow-hidden buddy-bounce">
        <img 
          src="/lovable-uploads/8a379d47-69d0-4475-a518-11b31a0b64e1.png" 
          alt="Buddy - Assistant DysAccess" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default BuddyMascot;
