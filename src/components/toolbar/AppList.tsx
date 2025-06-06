
import React from "react";
import { useToolbar } from "@/contexts/ToolbarContext";
import AppShortcut from "../AppShortcut";
import ToolbarButton from "./ToolbarButton";

const AppList: React.FC = () => {
  const { apps, openApp, removeApp, editApp, isEditing } = useToolbar();

  console.log('AppList render:', { appsCount: apps.length, isEditing, apps });

  return (
    <>
      {apps.map((app) => (
        <div key={app.id} className="relative group">
          <AppShortcut 
            name={app.name} 
            icon={app.icon} 
            bgColor={app.color}
            onClick={() => openApp(app)}
          />
          
          {isEditing && (
            <>
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
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default AppList;
