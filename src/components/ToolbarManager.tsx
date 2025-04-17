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
  FileAudio,
  Gamepad,
  Book,
  Palette,
  Ear,
  Brain,
  Speech,
  Clock,
  Sparkles,
  Puzzle,
  BarChart,
  Hand,
  Pencil,
  Headphones,
  Eye,
  Map,
  Stethoscope,
  MessageSquare,
  Smartphone,
  Bot,
  Film,
  Mail,
  Speaker,
  LucideIcon
} from "lucide-react";
import AppShortcut from "./AppShortcut";
import BuddyMascot from "./BuddyMascot";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Types pour les raccourcis d'applications
export interface AppShortcutData {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  type: "app" | "web";
  url?: string;
  localPath?: string;
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
  Scissors,
  FileAudio,
  Gamepad,
  Book,
  Palette,
  Ear,
  Brain,
  Speech,
  Clock,
  Sparkles,
  Puzzle,
  BarChart,
  Hand,
  Pencil,
  Headphones,
  Eye,
  Map,
  Stethoscope,
  MessageSquare,
  Smartphone,
  Bot,
  Film,
  Mail,
  Speaker
};

// Couleurs disponibles pour la personnalisation
const availableColors: Record<string, string> = {
  "Bleu": "bg-dysaccess-blue",
  "Orange": "bg-orange-400",
  "Violet": "bg-dysaccess-purple",
  "Vert": "bg-green-400",
  "Rose": "bg-pink-400",
  "Bleu clair": "bg-dysaccess-light-blue",
  "Violet clair": "bg-dysaccess-light-purple",
  "Vert pastel": "bg-dysaccess-soft-green",
  "Jaune pastel": "bg-dysaccess-soft-yellow",
  "Orange pastel": "bg-dysaccess-soft-orange",
  "Violet pastel": "bg-dysaccess-soft-purple",
  "Rose pastel": "bg-dysaccess-soft-pink",
  "Pêche pastel": "bg-dysaccess-soft-peach",
  "Bleu pastel": "bg-dysaccess-soft-blue",
  "Gris pastel": "bg-dysaccess-soft-gray"
};

// Applications par défaut
const defaultApps: AppShortcutData[] = [
  { id: "1", name: "LibreOffice", icon: FileText, color: "bg-dysaccess-blue", type: "app", localPath: "libreoffice" },
  { id: "2", name: "Navigateur", icon: Globe, color: "bg-orange-400", type: "web", url: "https://www.google.fr" },
  { id: "3", name: "Lexibar", icon: Keyboard, color: "bg-dysaccess-purple", type: "app", localPath: "lexibar" },
  { id: "4", name: "AsTeRICS", icon: Grid, color: "bg-dysaccess-light-blue", type: "web", url: "https://grid.asterics.eu" }
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
  const [appType, setAppType] = useState<"app" | "web">("app");
  const [webUrl, setWebUrl] = useState("");
  const { toast } = useToast();

  // Fonction pour détecter si on est dans Electron
  const isElectron = () => {
    return window.navigator.userAgent.indexOf('Electron') !== -1;
  };

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
    if (app.type === "web" && app.url) {
      if (isElectron()) {
        window.open(app.url, '_blank');
      } else {
        window.open(app.url, '_blank');
      }
      
      toast({
        title: `Ouverture de ${app.name}`,
        description: `Navigation vers ${app.url}`,
      });
    } else if (app.type === "app" && app.localPath) {
      if (isElectron()) {
        console.log(`Launching local application: ${app.localPath}`);
        toast({
          title: `Ouverture de ${app.name}`,
          description: `Lancement de l'application locale ${app.localPath}`,
        });
      } else {
        toast({
          title: `Ouverture de ${app.name}`,
          description: "Cette action ouvrirait l'application en version desktop.",
        });
      }
    }
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

    if (appType === "web" && !webUrl.trim()) {
      toast({
        title: "Erreur",
        description: "L'URL du site web ne peut pas être vide.",
        variant: "destructive"
      });
      return;
    }

    const newApp: AppShortcutData = {
      id: Date.now().toString(),
      name: newAppName,
      icon: availableIcons[selectedIcon],
      color: availableColors[selectedColor],
      type: appType,
      ...(appType === "web" && { url: webUrl })
    };

    setApps([...apps, newApp]);
    setNewAppName("");
    setWebUrl("");
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
        <div className="mr-3 cursor-move" onMouseDown={handleMouseDown}>
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
              isEditing ? "bg-green-500 text-white" : "bg-dysaccess-purple bg-opacity-80 text-white hover:bg-opacity-100"
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
            <DialogDescription className="dyslexic-friendly">
              Choisissez entre une application installée ou un site web
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="app" onValueChange={(value) => setAppType(value as "app" | "web")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="app" className="dyslexic-friendly">Application</TabsTrigger>
              <TabsTrigger value="web" className="dyslexic-friendly">Site Web</TabsTrigger>
            </TabsList>
            
            <TabsContent value="app">
              <div className="grid gap-4 py-2">
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
              </div>
            </TabsContent>
            
            <TabsContent value="web">
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="web-name" className="text-right dyslexic-friendly">
                    Nom
                  </Label>
                  <Input
                    id="web-name"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="col-span-3"
                    placeholder="Nom du site web"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="web-url" className="text-right dyslexic-friendly">
                    URL
                  </Label>
                  <Input
                    id="web-url"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    className="col-span-3"
                    placeholder="https://exemple.com"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-icon" className="text-right dyslexic-friendly">
                Icône
              </Label>
              <div className="col-span-3">
                <Select onValueChange={setSelectedIcon} defaultValue={selectedIcon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une icône" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    <div className="grid grid-cols-4 gap-2 p-2">
                      {Object.keys(availableIcons).map((iconName) => (
                        <SelectItem key={iconName} value={iconName} className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                          <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center mb-1">
                            {React.createElement(availableIcons[iconName], { className: "h-5 w-5" })}
                          </div>
                          <span className="text-xs text-center">{iconName}</span>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-color" className="text-right dyslexic-friendly">
                Couleur
              </Label>
              <RadioGroup 
                defaultValue={selectedColor} 
                onValueChange={setSelectedColor}
                className="col-span-3 flex flex-wrap gap-2"
              >
                {Object.entries(availableColors).map(([colorName, colorClass]) => (
                  <div key={colorName} className="flex items-center">
                    <RadioGroupItem 
                      value={colorName} 
                      id={`color-${colorName}`} 
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor={`color-${colorName}`}
                      className={`w-8 h-8 rounded-full ${colorClass} cursor-pointer peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-offset-background peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-offset-2 peer-data-[state=checked]:ring-offset-background peer-data-[state=checked]:ring-dysaccess-purple`}
                    >
                      <span className="sr-only">{colorName}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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
