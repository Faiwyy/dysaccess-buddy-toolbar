
import React from "react";

const BuddyMascot: React.FC = () => {
  return (
    <div className="buddy-mascot relative">
      <div className="w-10 h-10 rounded-full overflow-hidden buddy-bounce">
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center relative">
          {/* Eyes */}
          <div className="absolute top-3 left-2.5 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-3 right-2.5 w-1 h-1 bg-white rounded-full"></div>
          
          {/* Smile */}
          <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-1.5 border-b-2 border-white rounded-full border-t-0 border-l-0 border-r-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddyMascot;
