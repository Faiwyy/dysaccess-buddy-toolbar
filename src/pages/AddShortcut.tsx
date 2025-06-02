
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
  icon: any;
  color: string;
  type: "app" | "web";
  url?: string;
  localPath?: string;
}

const AddShortcut: React.FC = () => {
  const [newAppName, setNewAppName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("FileText");
  const [selectedColor, setSelectedColor] = useState<string>("Bleu");
  const [appType, setAppType] = useState<"app" | "web">("app");
  const [webUrl, setWebUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const { toast } = useToast();

  const addNewApp = async () => {
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

    if (appType === "app" && !localPath.trim()) {
      toast({
        title: "Erreur",
        description: "Le chemin d'accès de l'application ne peut pas être vide.",
        variant: "destructive"
      });
      return;
    }

    const newApp: App = {
      id: Date.now().toString(),
      name: newAppName,
      icon: iconRegistry[selectedIcon],
      color: colorRegistry[selectedColor],
      type: appType,
      ...(appType === "web" ? { url: webUrl } : { localPath: localPath })
    };

    // Send the new app to the main window via IPC
    if (window.electronAPI) {
      await window.electronAPI.addApp(newApp);
      toast({
        title: "Application ajoutée",
        description: `${newAppName} a été ajouté à la barre d'outils.`
      });
      
      // Close this window
      await window.electronAPI.closeAddShortcutWindow();
    }
  };

  const handleCancel = async () => {
    if (window.electronAPI) {
      await window.electronAPI.closeAddShortcutWindow();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 dyslexic-friendly">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center dyslexic-friendly">
              Ajouter un raccourci
            </CardTitle>
            <CardDescription className="text-center dyslexic-friendly">
              Choisissez entre une application installée ou un site web
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs defaultValue="app" onValueChange={(value) => setAppType(value as "app" | "web")}>
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
                <Select onValueChange={setSelectedIcon} defaultValue={selectedIcon}>
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
                  defaultValue={selectedColor} 
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
                onClick={addNewApp}
                className="flex-1"
              >
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddShortcut;
