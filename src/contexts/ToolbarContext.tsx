
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
  { id: "1", name: "LibreOffice", icon: iconRegistry.FileText, color: "bg-dysaccess-blue", type: "app", localPath: "/Applications/LibreOffice.app" },
  { id: "2", name: "Navigateur", icon: iconRegistry.Globe, color: "bg-orange-400", type: "web", url: "https://www.google.fr" },
  { id: "3", name: "Lexibar", icon: iconRegistry.Keyboard, color: "bg-dysaccess-purple", type: "app", localPath: "/Applications/Lexibar.app" },
  { id: "4", name: "AsTeRICS", icon: iconRegistry.Grid, color: "bg-dysaccess-light-blue", type: "web", url: "https://grid.asterics.eu" }
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
  };

  // Edit an application
  const editApp = (app: AppShortcutData) => {
    if (isElectron() && window.electronAPI) {
      window.electronAPI.openAddShortcutWindow(app);
    } else {
      console.log('Edit app:', app);
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
