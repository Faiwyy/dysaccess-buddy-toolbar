
import React, { useState } from "react";
import { ToolbarProvider } from "@/contexts/ToolbarContext";
import FloatingToolbar from "./toolbar/FloatingToolbar";
import AddAppDialog from "./toolbar/AddAppDialog";

const ToolbarManager: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddClick = async () => {
    console.log('=== ADD BUTTON CLICKED ===');
    console.log('ElectronAPI available:', !!window.electronAPI);
    
    if (window.electronAPI) {
      try {
        console.log('Calling electronAPI.openAddShortcutWindow...');
        const result = await window.electronAPI.openAddShortcutWindow();
        console.log('Result from openAddShortcutWindow:', result);
        
        if (!result) {
          console.log('Electron window failed to open, using modal fallback');
          setIsAddDialogOpen(true);
        }
      } catch (error) {
        console.error('Error opening add shortcut window:', error);
        console.log('Using modal dialog fallback due to error');
        setIsAddDialogOpen(true);
      }
    } else {
      console.log('ElectronAPI not available - running in web mode, opening modal dialog');
      setIsAddDialogOpen(true);
    }
  };
  
  return (
    <ToolbarProvider>
      <FloatingToolbar onAddClick={handleAddClick} />
      <AddAppDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </ToolbarProvider>
  );
};

export default ToolbarManager;
