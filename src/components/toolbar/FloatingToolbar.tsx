
import React from "react";
import { useToolbar } from "@/contexts/ToolbarContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BuddyMascot from "../BuddyMascot";
import ToolbarButton from "./ToolbarButton";
import AppList from "./AppList";

interface FloatingToolbarProps {
  onAddClick: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ onAddClick }) => {
  const { 
    dragPosition, 
    isDragging, 
    setIsDragging,
    toggleEditMode,
    toggleCollapse,
    isEditing,
    isCollapsed
  } = useToolbar();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) {
      setIsDragging(true);
    }
  };

  return (
    <div 
      className="float-toolbar rounded-2xl p-3 flex items-center transition-all duration-300 toolbar-shadow"
      style={{ 
        position: "absolute",
        left: `${dragPosition.x}px`, 
        top: `${dragPosition.y}px`,
        transition: isDragging ? 'none' : 'all 0.2s ease',
        width: isCollapsed ? 'auto' : 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Buddy Mascot (always visible and draggable) */}
      <div className="mr-3 cursor-move" onMouseDown={handleMouseDown} style={{ WebkitAppRegion: 'drag' } as any}>
        <BuddyMascot />
      </div>
      
      {/* Collapsible content */}
      {!isCollapsed && (
        <>
          {/* App shortcuts with add button */}
          <div className="flex space-x-4 items-center">
            <AppList />
            {isEditing && (
              <ToolbarButton 
                type="add" 
                onClick={onAddClick}
              />
            )}
          </div>
          
          {/* Configuration button */}
          <div className="ml-4 mr-2">
            <ToolbarButton
              type="config"
              onClick={toggleEditMode}
            />
          </div>
        </>
      )}

      {/* Collapse/Expand button - moved to the right */}
      <div>
        <button
          onClick={toggleCollapse}
          className="w-8 h-8 bg-dysaccess-blue hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
          aria-label={isCollapsed ? "Étendre la barre" : "Rétracter la barre"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-white" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default FloatingToolbar;
