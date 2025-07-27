
import React, { createContext, useContext, useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { iconRegistry } from "@/lib/iconRegistry";
import { colorRegistry } from "@/lib/colorRegistry";

// Types for the app shortcuts
export interface AppShortcutData {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  type: "app" | "web";
  url?: string;
  localPath?: string;
}

// Default applications
export const defaultApps: AppShortcutData[] = [
  { id: "1", name: "LibreOffice", icon: iconRegistry.FileText, color: "bg-[hsl(201_74%_78%)]", type: "app", localPath: "/Applications/LibreOffice.app" },
  { id: "2", name: "Navigateur", icon: iconRegistry.Globe, color: "bg-orange-400", type: "web", url: "https://www.google.fr" },
  { id: "3", name: "Lexibar", icon: iconRegistry.Keyboard, color: "bg-[hsl(300_24%_85%)]", type: "app", localPath: "/Applications/Lexibar.app" },
  { id: "4", name: "AsTeRICS", icon: iconRegistry.Grid, color: "bg-[hsl(202_58%_85%)]", type: "web", url: "https://grid.asterics.eu" }
];

interface ToolbarContextType {
  apps: AppShortcutData[];
  isEditing: boolean;
  showTip: boolean;
  isCollapsed: boolean;
  dragPosition: { x: number; y: number };
  isDragging: boolean;
  setApps: React.Dispatch<React.SetStateAction<AppShortcutData[]>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTip: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setDragPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  openApp: (app: AppShortcutData) => void;
  removeApp: (id: string) => void;
  editApp: (app: AppShortcutData) => void;
  toggleEditMode: () => void;
  toggleCollapse: () => void;
}

export const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export const ToolbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AppShortcutData[]>(defaultApps);
  const [isEditing, setIsEditing] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dragPosition, setDragPosition] = useState(() => {
    // Position initiale centrée sur l'écran
    const centerX = window.innerWidth / 2 - 125; // Largeur approximative de la barre d'outils divisée par 2
    const centerY = window.innerHeight / 2 - 30; // Hauteur approximative de la barre d'outils divisée par 2
    return { x: centerX, y: centerY };
  });
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  // Function to detect if we're in Electron
  const isElectron = () => {
    return window.navigator.userAgent.indexOf('Electron') !== -1;
  };

  // Add event listeners for IPC communication
  useEffect(() => {
    const handleAddApp = (event: CustomEvent) => {
      const appData = event.detail;
      console.log('Adding new app from IPC:', appData);
      
      // Convert icon string back to LucideIcon if needed
      let iconComponent = iconRegistry.FileText; // default fallback
      if (appData.iconName && iconRegistry[appData.iconName]) {
        iconComponent = iconRegistry[appData.iconName];
      } else if (typeof appData.icon === 'string' && iconRegistry[appData.icon]) {
        iconComponent = iconRegistry[appData.icon];
      }
      
      const newApp: AppShortcutData = {
        ...appData,
        icon: iconComponent,
        id: appData.id || Date.now().toString()
      };
      
      console.log('Processed app data:', newApp);
      setApps(prevApps => [...prevApps, newApp]);
      toast({
        title: `${newApp.name} ajouté`,
        description: "L'application a été ajoutée à la barre d'outils.",
      });
    };

    const handleUpdateApp = (event: CustomEvent) => {
      const appData = event.detail;
      console.log('Updating app from IPC:', appData);
      
      // Convert icon string back to LucideIcon if needed
      let iconComponent = iconRegistry.FileText; // default fallback
      if (appData.iconName && iconRegistry[appData.iconName]) {
        iconComponent = iconRegistry[appData.iconName];
      } else if (typeof appData.icon === 'string' && iconRegistry[appData.icon]) {
        iconComponent = iconRegistry[appData.icon];
      }
      
      const updatedApp: AppShortcutData = {
        ...appData,
        icon: iconComponent
      };
      
      console.log('Processed updated app data:', updatedApp);
      setApps(prevApps => 
        prevApps.map(app => 
          app.id === updatedApp.id ? updatedApp : app
        )
      );
      toast({
        title: `${updatedApp.name} modifié`,
        description: "L'application a été mise à jour.",
      });
    };

    document.addEventListener('add-app', handleAddApp as EventListener);
    document.addEventListener('update-app', handleUpdateApp as EventListener);

    return () => {
      document.removeEventListener('add-app', handleAddApp as EventListener);
      document.removeEventListener('update-app', handleUpdateApp as EventListener);
    };
  }, [toast]);

  // Handle mouse movement for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setDragPosition({
          x: e.clientX - 100,
          y: e.clientY - 25
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Open an application
  const openApp = (app: AppShortcutData) => {
    console.log('Attempting to open application:', app);
    
    if (app.type === "web" && app.url) {
      if (isElectron() && window.electronAPI) {
        window.electronAPI.openUrl(app.url);
      } else {
        window.open(app.url, '_blank');
      }
      
      toast({
        title: `Ouverture de ${app.name}`,
        description: `Navigation vers ${app.url}`,
      });
    } else if (app.type === "app" && app.localPath) {
      if (isElectron() && window.electronAPI) {
        console.log('Opening local app with path:', app.localPath);
        window.electronAPI.openLocalApp(app.localPath);
        toast({
          title: `Ouverture de ${app.name}`,
          description: `Lancement de l'application locale`,
        });
      } else {
        toast({
          title: `Ouverture de ${app.name}`,
          description: "Cette action ouvrirait l'application en version desktop.",
        });
      }
    }
  };

  // Remove an application
  const removeApp = (id: string) => {
    setApps(apps.filter(app => app.id !== id));
    toast({
      title: "Application supprimée",
      description: "L'application a été retirée de la barre d'outils.",
    });
  };

  // Edit an application
  const editApp = (app: AppShortcutData) => {
    console.log('=== EDIT APP CLICKED ===');
    console.log('App data to edit:', app);
    
    if (isElectron() && window.electronAPI) {
      console.log('Calling electronAPI.openAddShortcutWindow with app data');
      
      // Create a serializable version of the app data
      const editData = {
        id: app.id,
        name: app.name,
        color: app.color,
        type: app.type,
        url: app.url,
        localPath: app.localPath,
        // Convert icon to string for serialization
        iconName: Object.keys(iconRegistry).find(key => iconRegistry[key] === app.icon) || "FileText"
      };
      
      console.log('Serialized edit data:', editData);
      
      window.electronAPI.openAddShortcutWindow(editData)
        .then(() => {
          console.log('Edit window opened successfully');
        })
        .catch((error) => {
          console.error('Error opening edit window:', error);
        });
    } else {
      console.log('Edit app (web mode):', app);
      toast({
        title: `Modification de ${app.name}`,
        description: "Cette action ouvrirait l'éditeur d'application en version desktop.",
      });
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setShowTip(false);
  };

  // Toggle collapse mode
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setShowTip(false);
  };

  return (
    <ToolbarContext.Provider
      value={{
        apps,
        isEditing,
        showTip,
        isCollapsed,
        dragPosition,
        isDragging,
        setApps,
        setIsEditing,
        setShowTip,
        setIsCollapsed,
        setDragPosition,
        setIsDragging,
        openApp,
        removeApp,
        editApp,
        toggleEditMode,
        toggleCollapse
      }}
    >
      {children}
    </ToolbarContext.Provider>
  );
};

export const useToolbar = () => {
  const context = useContext(ToolbarContext);
  if (context === undefined) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }
  return context;
};
