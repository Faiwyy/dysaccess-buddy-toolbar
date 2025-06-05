
import React from "react";
import { LucideIcon } from "lucide-react";
import { iconRegistry } from "@/lib/iconRegistry";
import { colorRegistry } from "@/lib/colorRegistry";

interface AppShortcutProps {
  name: string;
  icon: string | LucideIcon; // Support both string and LucideIcon
  onClick: () => void;
  bgColor?: string;
}

const AppShortcut: React.FC<AppShortcutProps> = ({ 
  name, 
  icon, 
  onClick, 
  bgColor = "bg-dysaccess-blue"
}) => {
  // Handle both string icon names and direct LucideIcon components
  const IconComponent = typeof icon === 'string' ? iconRegistry[icon] || iconRegistry['FileText'] : icon;
  
  // Handle both string color names and direct color classes
  const colorClass = typeof bgColor === 'string' && bgColor.startsWith('bg-') 
    ? bgColor 
    : colorRegistry[bgColor as string] || colorRegistry['Bleu'] || "bg-dysaccess-blue";

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-dysaccess-purple focus:ring-opacity-50"
      aria-label={`Ouvrir ${name}`}
    >
      <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
        <IconComponent className="h-6 w-6 text-white" />
      </div>
      <span className="mt-1 text-xs font-medium text-dysaccess-text dyslexic-friendly">
        {name}
      </span>
    </button>
  );
};

export default AppShortcut;
