
import React from "react";
import { useToolbar } from "@/contexts/ToolbarContext";
import AppShortcut from "../AppShortcut";
import ToolbarButton from "./ToolbarButton";

const AppList: React.FC = () => {
  const { apps, openApp, removeApp } = useToolbar();

  return (
    <>
      {apps.map((app) => (
        <div key={app.id} className="relative">
          <AppShortcut 
            name={app.name} 
            icon={app.icon} 
            bgColor={app.color}
            onClick={() => openApp(app)}
          />
          
          <ToolbarButton 
            type="delete" 
            onClick={() => removeApp(app.id)} 
            appId={app.id}
            appName={app.name}
          />
        </div>
      ))}
    </>
  );
};

export default AppList;
