
import React from "react";
import { ToolbarProvider } from "@/contexts/ToolbarContext";
import FloatingToolbar from "./toolbar/FloatingToolbar";

const ToolbarManager: React.FC = () => {
  const handleAddClick = async () => {
    if (window.electronAPI) {
      await window.electronAPI.openAddShortcutWindow();
    }
  };
  
  return (
    <ToolbarProvider>
      <FloatingToolbar onAddClick={handleAddClick} />
    </ToolbarProvider>
  );
};

export default ToolbarManager;
