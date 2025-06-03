
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),
  openLocalApp: (appPath: string) => ipcRenderer.invoke('open-local-app', appPath),
  openAddShortcutWindow: (appData?: any) => ipcRenderer.invoke('open-add-shortcut-window', appData),
  closeAddShortcutWindow: () => ipcRenderer.invoke('close-add-shortcut-window'),
  getApps: () => ipcRenderer.invoke('get-apps'),
  addApp: (app: any) => ipcRenderer.invoke('add-app', app),
  updateApp: (app: any) => ipcRenderer.invoke('update-app', app)
});

// Listen for add app event from add shortcut window
ipcRenderer.on('add-app', (_event, app) => {
  document.dispatchEvent(new CustomEvent('add-app', { detail: app }));
  console.log("Add app event received from main process", app);
});

// Listen for update app event from add shortcut window
ipcRenderer.on('update-app', (_event, app) => {
  document.dispatchEvent(new CustomEvent('update-app', { detail: app }));
  console.log("Update app event received from main process", app);
});
