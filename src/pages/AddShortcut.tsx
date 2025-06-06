import React, { useState, useEffect } from "react";
import { iconRegistry } from "@/lib/iconRegistry";
import { colorRegistry } from "@/lib/colorRegistry";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface App {
  id: string;
  name: string;
  icon: string; // Changed to string instead of React component
  color: string;
  type: "app" | "web";
  url?: string;
  localPath?: string;
  iconName?: string;
}

const AddShortcut: React.FC = () => {
  const [newAppName, setNewAppName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("FileText");
  const [selectedColor, setSelectedColor] = useState<string>("Bleu");
  const [appType, setAppType] = useState<"app" | "web">("app");
  const [webUrl, setWebUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('=== ADD SHORTCUT COMPONENT MOUNTED ===');
    console.log('Current URL:', window.location.href);
    console.log('Hash:', window.location.hash);
    
    // Check if we're editing an existing app
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const editData = urlParams.get('edit');
    
    console.log('URL params:', window.location.hash.split('?')[1]);
    console.log('Edit data string:', editData);
    
    if (editData) {
      try {
        const appData = JSON.parse(decodeURIComponent(editData));
        console.log('=== EDIT MODE DETECTED ===');
        console.log('Parsed app data for editing:', appData);
        
        setEditingApp(appData);
        setIsEditing(true);
        setNewAppName(appData.name);
        setAppType(appData.type);
        
        // Use iconName if available, otherwise try to find it
        let iconName = appData.iconName || "FileText";
        if (!appData.iconName) {
          iconName = Object.keys(iconRegistry).find(key => 
            iconRegistry[key] === appData.icon
          ) || "FileText";
        }
        setSelectedIcon(iconName);
        console.log('Set icon to:', iconName);
        
        // Find the color name from the registry
        const colorName = Object.keys(colorRegistry).find(key => 
          colorRegistry[key] === appData.color
        ) || "Bleu";
        setSelectedColor(colorName);
        console.log('Set color to:', colorName);
        
        if (appData.type === "web") {
          setWebUrl(appData.url || "");
          console.log('Set web URL to:', appData.url);
        } else {
          setLocalPath(appData.localPath || "");
          console.log('Set local path to:', appData.localPath);
        }
        
        console.log('=== FORM INITIALIZED FOR EDITING ===');
      } catch (error) {
        console.error("Error parsing edit data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'application à modifier.",
          variant: "destructive"
        });
      }
    } else {
      console.log('=== ADD MODE (no edit data) ===');
    }
  }, [toast]);

  const saveApp = async () => {
    console.log('=== SAVE APP CLICKED ===');
    console.log('Is editing:', isEditing);
    console.log('Form data:', {
      name: newAppName,
      type: appType,
      icon: selectedIcon,
      color: selectedColor,
      webUrl,
      localPath
    });

    if (newAppName.trim() === "") {
      console.log('ERROR: Empty app name');
      toast({
        title: "Erreur",
        description: "Le nom de l'application ne peut pas être vide.",
        variant: "destructive"
      });
      return;
    }

    if (appType === "web" && !webUrl.trim()) {
      console.log('ERROR: Empty web URL');
      toast({
        title: "Erreur",
        description: "L'URL du site web ne peut pas être vide.",
        variant: "destructive"
      });
      return;
    }

    if (appType === "app" && !localPath.trim()) {
      console.log('ERROR: Empty local path');
      toast({
        title: "Erreur",
        description: "Le chemin d'accès de l'application ne peut pas être vide.",
        variant: "destructive"
      });
      return;
    }

    // MODIFICATION CLÉ: Simplifier l'objet appData pour éviter l'erreur de clonage
    const appData: App = {
      id: isEditing ? editingApp!.id : Date.now().toString(),
      name: newAppName,
      icon: selectedIcon, // Envoyer directement le nom de l'icône (string)
      color: selectedColor, // Envoyer directement le nom de la couleur (string)
      type: appType,
      iconName: selectedIcon, // Conserver pour compatibilité
      ...(appType === "web" ? { url: webUrl } : { localPath: localPath })
    };

    console.log('=== FINAL APP DATA TO SAVE (SIMPLIFIED) ===');
    console.log('App data:', JSON.stringify(appData, null, 2));

    // Send the app data to the main window via IPC
    if (window.electronAPI) {
      try {
        console.log('=== ELECTRON API AVAILABLE ===');
        
        if (isEditing) {
          console.log('=== CALLING UPDATE APP ===');
          console.log('About to call updateApp with:', appData);
          const result = await window.electronAPI.updateApp(appData);
          console.log('Update app result received:', result);
          
          if (result) {
            console.log('=== UPDATE SUCCESS ===');
            toast({
              title: "Application modifiée",
              description: `${newAppName} a été modifié avec succès.`
            });
          } else {
            console.log('=== UPDATE FAILED ===');
            throw new Error('Update app returned false');
          }
        } else {
          console.log('=== CALLING ADD APP ===');
          console.log('About to call addApp with:', appData);
          const result = await window.electronAPI.addApp(appData);
          console.log('Add app result received:', result);
          
          if (result) {
            console.log('=== ADD SUCCESS ===');
            toast({
              title: "Application ajoutée",
              description: `${newAppName} a été ajouté à la barre d'outils.`
            });
          } else {
            console.log('=== ADD FAILED ===');
            throw new Error('Add app returned false');
          }
        }
        
        // Close this window
        console.log('=== CLOSING WINDOW ===');
        await window.electronAPI.closeAddShortcutWindow();
      } catch (error) {
        console.error('=== ERROR SAVING APP ===');
        console.error('Error type:', typeof error);
        console.error('Error message:', error?.message || 'Unknown error');
        console.error('Error details:', error);
        console.error('Stack trace:', error?.stack || 'No stack trace available');
        
        toast({
          title: "Erreur",
          description: `Une erreur s'est produite lors de la sauvegarde: ${error?.message || 'Erreur inconnue'}`,
          variant: "destructive"
        });
      }
    } else {
      console.error('=== ELECTRON API NOT AVAILABLE ===');
      console.error('Running in web mode - this should not happen for adding apps');
      toast({
        title: "Erreur",
        description: "Interface Electron non disponible.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = async () => {
    console.log('=== CANCEL CLICKED ===');
    if (window.electronAPI) {
      await window.electronAPI.closeAddShortcutWindow();
    }
  };

  console.log('Rendering AddShortcut component');
  console.log('Current state:', { isEditing, newAppName, selectedIcon, selectedColor, appType });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 dyslexic-friendly">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center dyslexic-friendly">
              {isEditing ? "Modifier le raccourci" : "Ajouter un raccourci"}
            </CardTitle>
            <CardDescription className="text-center dyslexic-friendly">
              {isEditing ? "Modifiez les informations de votre raccourci" : "Choisissez entre une application installée ou un site web"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs value={appType} onValueChange={(value) => setAppType(value as "app" | "web")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="app" className="dyslexic-friendly">Application</TabsTrigger>
                <TabsTrigger value="web" className="dyslexic-friendly">Site Web</TabsTrigger>
              </TabsList>
              
              <TabsContent value="app" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name" className="dyslexic-friendly">
                    Nom de l'application
                  </Label>
                  <Input
                    id="app-name"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    placeholder="Nom de l'application"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="app-path" className="dyslexic-friendly">
                    Chemin d'accès
                  </Label>
                  <Input
                    id="app-path"
                    value={localPath}
                    onChange={(e) => setLocalPath(e.target.value)}
                    placeholder="C:\Program Files\Application\app.exe"
                    className="w-full"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="web" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="web-name" className="dyslexic-friendly">
                    Nom du site web
                  </Label>
                  <Input
                    id="web-name"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    placeholder="Nom du site web"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="web-url" className="dyslexic-friendly">
                    URL du site web
                  </Label>
                  <Input
                    id="web-url"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    placeholder="https://exemple.com"
                    className="w-full"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="dyslexic-friendly">Icône</Label>
                <Select onValueChange={setSelectedIcon} value={selectedIcon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une icône" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <div className="grid grid-cols-3 gap-2 p-2">
                      {Object.keys(iconRegistry).map((iconName) => (
                        <SelectItem key={iconName} value={iconName} className="flex flex-col items-center p-3 cursor-pointer">
                          <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center mb-1">
                            {React.createElement(iconRegistry[iconName], { className: "h-5 w-5" })}
                          </div>
                          <span className="text-xs text-center">{iconName}</span>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="dyslexic-friendly">Couleur</Label>
                <RadioGroup 
                  value={selectedColor} 
                  onValueChange={setSelectedColor}
                  className="flex flex-wrap gap-3"
                >
                  {Object.entries(colorRegistry).map(([colorName, colorClass]) => (
                    <div key={colorName} className="flex items-center">
                      <RadioGroupItem 
                        value={colorName} 
                        id={`color-${colorName}`} 
                        className="sr-only peer"
                      />
                      <Label
                        htmlFor={`color-${colorName}`}
                        className={`w-10 h-10 rounded-full ${colorClass} cursor-pointer border-2 border-transparent peer-data-[state=checked]:border-gray-800 hover:scale-110 transition-transform`}
                      >
                        <span className="sr-only">{colorName}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                onClick={saveApp}
                className="flex-1"
              >
                {isEditing ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddShortcut;
