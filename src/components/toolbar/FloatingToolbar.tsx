
import React from "react";
import { useToolbar } from "@/contexts/ToolbarContext";
import BuddyMascot from "../BuddyMascot";
import ToolbarButton from "./ToolbarButton";
import AppList from "./AppList";
import VoiceDictation from "./VoiceDictation";

interface FloatingToolbarProps {
  onAddClick: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ onAddClick }) => {
  const { 
    dragPosition, 
    isDragging, 
    setIsDragging,
    showTip,
    toggleEditMode,
    isEditing
  } = useToolbar();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) {
      setIsDragging(true);
    }
  };

  return (
    <div 
      className="float-toolbar toolbar-shadow rounded-2xl bg-white p-3 border border-gray-100 flex items-center"
      style={{ 
        position: "absolute",
        left: `${dragPosition.x}px`, 
        top: `${dragPosition.y}px`,
        transition: isDragging ? 'none' : 'all 0.2s ease'
      }}
    >
      {/* Buddy Mascot (always on the left) */}
      <div className="mr-3 cursor-move" onMouseDown={handleMouseDown}>
        <BuddyMascot showTip={showTip} />
      </div>
      
      {/* App shortcuts with add button */}
      <div className="flex space-x-3 items-center">
        <AppList />
        {isEditing && (
          <ToolbarButton 
            type="add" 
            onClick={onAddClick}
          />
        )}
      </div>
      
      {/* Voice dictation button */}
      <div className="ml-3 mr-3">
        <VoiceDictation />
      </div>
      
      {/* Configuration button */}
      <div>
        <ToolbarButton
          type="config"
          onClick={toggleEditMode}
        />
      </div>
    </div>
  );
};

export default FloatingToolbar;
