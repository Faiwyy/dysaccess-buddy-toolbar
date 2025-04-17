
import React, { useState } from "react";
import { ToolbarProvider } from "@/contexts/ToolbarContext";
import FloatingToolbar from "./toolbar/FloatingToolbar";
import AddAppDialog from "./toolbar/AddAppDialog";

const ToolbarManager: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  return (
    <ToolbarProvider>
      <FloatingToolbar onAddClick={() => setIsAddDialogOpen(true)} />
      <AddAppDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
    </ToolbarProvider>
  );
};

export default ToolbarManager;
