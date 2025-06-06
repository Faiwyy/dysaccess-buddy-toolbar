
import React from "react";

const BuddyMascot: React.FC = () => {
  return (
    <div className="buddy-mascot relative">
      <div className="w-10 h-10 rounded-full overflow-hidden buddy-bounce">
        <div className="w-full h-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center relative shadow-lg">
          {/* Eyes */}
          <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
          <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
          
          {/* Smile - using a curved border */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-2 border-b-2 border-white rounded-full opacity-90"></div>
          </div>
          
          {/* Subtle highlight for depth */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-white opacity-20 rounded-full blur-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default BuddyMascot;
