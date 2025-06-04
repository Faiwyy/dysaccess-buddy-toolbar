
import React from "react";
import { ToolbarProvider } from "@/contexts/ToolbarContext";
import FloatingToolbar from "./toolbar/FloatingToolbar";

const ToolbarManager: React.FC = () => {
  const handleAddClick = async () => {
    console.log('=== ADD BUTTON CLICKED ===');
    console.log('ElectronAPI available:', !!window.electronAPI);
    
    if (window.electronAPI) {
      try {
        console.log('Calling electronAPI.openAddShortcutWindow...');
        const result = await window.electronAPI.openAddShortcutWindow();
        console.log('Result from openAddShortcutWindow:', result);
      } catch (error) {
        console.error('Error opening add shortcut window:', error);
      }
    } else {
      console.log('ElectronAPI not available - running in web mode');
    }
  };
  
  return (
    <ToolbarProvider>
      <FloatingToolbar onAddClick={handleAddClick} />
    </ToolbarProvider>
  );
};

export default ToolbarManager;
