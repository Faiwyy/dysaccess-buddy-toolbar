
import React from "react";
import { X, Plus, Settings, Save, Edit } from "lucide-react";
import { useToolbar } from "@/contexts/ToolbarContext";

interface ToolbarButtonProps {
  type: "add" | "config" | "delete" | "edit";
  onClick: () => void;
  appId?: string;
  appName?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ type, onClick, appId, appName }) => {
  const { isEditing } = useToolbar();

  if ((type === "delete" || type === "edit") && !isEditing) return null;

  const handleClick = () => {
    console.log(`ToolbarButton clicked: ${type}`);
    onClick();
  };

  return (
    <>
      {type === "add" && (
        <button
          onClick={handleClick}
          className="w-12 h-12 bg-dysaccess-light-purple rounded-xl flex items-center justify-center hover:bg-dysaccess-purple transition-colors"
          aria-label="Ajouter une application"
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      )}

      {type === "delete" && (
        <button
          onClick={handleClick}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-20 opacity-0 group-hover:opacity-100"
          aria-label={`Supprimer ${appName}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {type === "edit" && (
        <button
          onClick={handleClick}
          className="absolute -top-1 -left-1 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors z-20 opacity-0 group-hover:opacity-100"
          aria-label={`Modifier ${appName}`}
        >
          <Edit className="h-3 w-3" />
        </button>
      )}

      {type === "config" && (
        <button
          onClick={handleClick}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isEditing ? "bg-green-500 text-white" : "bg-dysaccess-purple bg-opacity-80 text-white hover:bg-opacity-100"
          }`}
          aria-label={isEditing ? "Terminer la configuration" : "Configurer la barre d'outils"}
        >
          {isEditing ? <Save className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
        </button>
      )}
    </>
  );
};

export default ToolbarButton;
