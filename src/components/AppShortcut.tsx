
import React from "react";
import { LucideIcon } from "lucide-react";

interface AppShortcutProps {
  name: string;
  icon: LucideIcon;
  onClick: () => void;
  bgColor?: string;
}

const AppShortcut: React.FC<AppShortcutProps> = ({ 
  name, 
  icon: Icon, 
  onClick, 
  bgColor = "bg-dysaccess-blue"
}) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-dysaccess-purple focus:ring-opacity-50"
      aria-label={`Ouvrir ${name}`}
    >
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="mt-1 text-xs font-medium text-dysaccess-text dyslexic-friendly">
        {name}
      </span>
    </button>
  );
};

export default AppShortcut;
