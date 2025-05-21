
import React, { useState } from "react";
import { useToolbar } from "@/contexts/ToolbarContext";
import { iconRegistry } from "@/lib/iconRegistry";
import { colorRegistry } from "@/lib/colorRegistry";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddAppDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddAppDialog: React.FC<AddAppDialogProps> = ({ isOpen, onOpenChange }) => {
  const [newAppName, setNewAppName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("FileText");
  const [selectedColor, setSelectedColor] = useState<string>("Bleu");
  const [appType, setAppType] = useState<"app" | "web">("app");
  const [webUrl, setWebUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const { setApps, apps } = useToolbar();
  const { toast } = useToast();

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

    if (appType === "app" && !localPath.trim()) {
      toast({
        title: "Erreur",
        description: "Le chemin d'accès de l'application ne peut pas être vide.",
        variant: "destructive"
      });
      return;
    }

    const newApp = {
      id: Date.now().toString(),
      name: newAppName,
      icon: iconRegistry[selectedIcon],
      color: colorRegistry[selectedColor],
      type: appType,
      ...(appType === "web" ? { url: webUrl } : { localPath: localPath })
    };

    setApps([...apps, newApp]);
    setNewAppName("");
    setWebUrl("");
    setLocalPath("");
    onOpenChange(false);
    
    toast({
      title: "Application ajoutée",
      description: `${newAppName} a été ajouté à la barre d'outils.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="app-path" className="text-right dyslexic-friendly">
                  Chemin
                </Label>
                <Input
                  id="app-path"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  className="col-span-3"
                  placeholder="C:\Program Files\Application\app.exe"
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
                    {Object.keys(iconRegistry).map((iconName) => (
                      <SelectItem key={iconName} value={iconName} className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded cursor-pointer">
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
              {Object.entries(colorRegistry).map(([colorName, colorClass]) => (
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
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={addNewApp}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppDialog;
