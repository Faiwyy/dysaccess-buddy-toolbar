
import React from "react";
import { useToolbar } from "@/contexts/ToolbarContext";
import AppShortcut from "../AppShortcut";
import ToolbarButton from "./ToolbarButton";
import { iconRegistry } from "@/lib/iconRegistry";
import { colorRegistry } from "@/lib/colorRegistry";

const AppList: React.FC = () => {
  const { apps, openApp, removeApp, editApp } = useToolbar();

  return (
    <>
      {apps.map((app) => {
        // Find the icon name by matching the icon component with the registry
        const iconName = Object.keys(iconRegistry).find(key => iconRegistry[key] === app.icon) || 'FileText';
        const colorName = typeof app.color === 'string' ? app.color : 'Bleu';
        
        return (
          <div key={app.id} className="relative group">
            <AppShortcut 
              name={app.name} 
              icon={iconName}
              bgColor={colorName}
              onClick={() => openApp(app)}
            />
            
            <ToolbarButton 
              type="delete" 
              onClick={() => removeApp(app.id)} 
              appId={app.id}
              appName={app.name}
            />

            <ToolbarButton 
              type="edit" 
              onClick={() => editApp(app)} 
              appId={app.id}
              appName={app.name}
            />
          </div>
        );
      })}
    </>
  );
};

export default AppList;
