
import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Settings, 
  X, 
  Save,
  FileText,
  Globe,
  Keyboard,
  Grid,
  Image,
  Video,
  Music,
  BookOpen,
  PenLine,
  Calculator,
  Scissors,
  LucideIcon
} from "lucide-react";
import AppShortcut from "./AppShortcut";
import BuddyMascot from "./BuddyMascot";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Types pour les raccourcis d'applications
export interface AppShortcutData {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

// Icônes disponibles pour la personnalisation
const availableIcons: Record<string, LucideIcon> = {
  FileText,
  Globe,
  Keyboard,
  Grid,
  Image,
  Video,
  Music,
  BookOpen,
  PenLine,
  Calculator,
  Scissors
};

// Couleurs disponibles pour la personnalisation
const availableColors: Record<string, string> = {
  "Bleu": "bg-dysaccess-blue",
  "Jaune": "bg-dysaccess-yellow",
  "Violet": "bg-dysaccess-purple",
  "Bleu clair": "bg-dysaccess-light-blue",
  "Jaune clair": "bg-dysaccess-light-yellow",
  "Violet clair": "bg-dysaccess-light-purple"
};

// Applications par défaut
const defaultApps: AppShortcutData[] = [
  { id: "1", name: "LibreOffice", icon: FileText, color: "bg-dysaccess-blue" },
  { id: "2", name: "Navigateur", icon: Globe, color: "bg-dysaccess-yellow" },
  { id: "3", name: "Lexibar", icon: Keyboard, color: "bg-dysaccess-purple" },
  { id: "4", name: "AsTeRICS", icon: Grid, color: "bg-dysaccess-light-blue" }
];

const ToolbarManager: React.FC = () => {
  // États pour la gestion des applications et du mode d'édition
  const [apps, setApps] = useState<AppShortcutData[]>(defaultApps);
  const [isEditing, setIsEditing] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("FileText");
  const [selectedColor, setSelectedColor] = useState<string>("Bleu");
  const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  // Gestion du déplacement de la barre d'outils
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setDragPosition({
        x: e.clientX - 100, // Ajustement pour centrer
        y: e.clientY - 25
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Ajouter les gestionnaires d'événements pour le déplacement
  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Simuler l'ouverture d'une application
  const openApp = (app: AppShortcutData) => {
    toast({
      title: `Ouverture de ${app.name}`,
      description: "Cette action ouvrirait l'application dans un environnement réel.",
    });
  };

  // Supprimer une application
  const removeApp = (id: string) => {
    setApps(apps.filter(app => app.id !== id));
  };

  // Ajouter une nouvelle application
  const addNewApp = () => {
    if (newAppName.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le nom de l'application ne peut pas être vide.",
        variant: "destructive"
      });
      return;
    }

    const newApp: AppShortcutData = {
      id: Date.now().toString(),
      name: newAppName,
      icon: availableIcons[selectedIcon],
      color: availableColors[selectedColor]
    };

    setApps([...apps, newApp]);
    setNewAppName("");
    setIsAddDialogOpen(false);
    
    toast({
      title: "Application ajoutée",
      description: `${newAppName} a été ajouté à la barre d'outils.`
    });
  };

  // Activer/désactiver le mode d'édition
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setShowTip(false);
  };

  return (
    <>
      {/* Barre d'outils flottante */}
      <div 
        className="float-toolbar toolbar-shadow rounded-2xl bg-white p-3 border border-gray-100 flex items-center"
        style={{ 
          left: `${dragPosition.x}px`, 
          top: `${dragPosition.y}px`,
          transition: isDragging ? 'none' : 'all 0.2s ease'
        }}
      >
        {/* Mascotte Buddy (toujours à gauche) */}
        <div className="mr-3 cursor-pointer" onMouseDown={handleMouseDown}>
          <BuddyMascot showTip={showTip} />
        </div>
        
        {/* Raccourcis d'applications */}
        <div className="flex space-x-3 items-center">
          {apps.map((app) => (
            <div key={app.id} className="relative">
              <AppShortcut 
                name={app.name} 
                icon={app.icon} 
                bgColor={app.color}
                onClick={() => openApp(app)}
              />
              
              {/* Bouton de suppression (visible uniquement en mode édition) */}
              {isEditing && (
                <button
                  onClick={() => removeApp(app.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                  aria-label={`Supprimer ${app.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          
          {/* Bouton d'ajout (visible uniquement en mode édition) */}
          {isEditing && (
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="w-12 h-12 bg-dysaccess-light-purple rounded-xl flex items-center justify-center hover:bg-dysaccess-purple transition-colors"
              aria-label="Ajouter une application"
            >
              <Plus className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
        
        {/* Bouton de configuration */}
        <div className="ml-3">
          <button
            onClick={toggleEditMode}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isEditing ? "bg-dysaccess-yellow text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            aria-label={isEditing ? "Terminer la configuration" : "Configurer la barre d'outils"}
          >
            {isEditing ? <Save className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Dialogue d'ajout d'application */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="dyslexic-friendly">Ajouter un raccourci</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-name" className="text-right dyslexic-friendly">
                Nom
              </Label>
              <Input
                id="app-name"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                className="col-span-3"
                placeholder="Nom de l'application"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-icon" className="text-right dyslexic-friendly">
                Icône
              </Label>
              <Select onValueChange={setSelectedIcon} defaultValue={selectedIcon}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Choisir une icône" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(availableIcons).map((iconName) => (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center">
                        {React.createElement(availableIcons[iconName], { className: "h-4 w-4 mr-2" })}
                        {iconName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-color" className="text-right dyslexic-friendly">
                Couleur
              </Label>
              <Select onValueChange={setSelectedColor} defaultValue={selectedColor}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Choisir une couleur" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(availableColors).map((colorName) => (
                    <SelectItem key={colorName} value={colorName}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${availableColors[colorName]} mr-2`}></div>
                        {colorName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={addNewApp}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ToolbarManager;
