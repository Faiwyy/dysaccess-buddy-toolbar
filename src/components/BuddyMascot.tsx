
import React from "react";

const BuddyMascot: React.FC = () => {
  return (
    <div className="buddy-mascot relative">
      <div className="w-10 h-10 rounded-full overflow-hidden buddy-bounce">
        <img 
          src="/lovable-uploads/63ea3245-8d78-4d36-88ee-8f100c443668.png" 
          alt="Buddy - Assistant DysAccess" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default BuddyMascot;
