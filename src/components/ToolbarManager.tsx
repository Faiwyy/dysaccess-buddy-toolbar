
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
      } catch (error) {
        console.error('Error opening add shortcut window:', error);
        // Fallback to modal dialog if Electron API fails
        setIsAddDialogOpen(true);
      }
    } else {
      console.log('ElectronAPI not available - running in web mode, opening modal dialog');
      // In web mode, open the modal dialog instead
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
