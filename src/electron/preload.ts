
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),
  openLocalApp: (appPath: string) => ipcRenderer.invoke('open-local-app', appPath),
  toggleSpeechRecognition: () => ipcRenderer.invoke('toggle-speech-recognition'),
  openAddShortcutWindow: () => ipcRenderer.invoke('open-add-shortcut-window'),
  closeAddShortcutWindow: () => ipcRenderer.invoke('close-add-shortcut-window'),
  getApps: () => ipcRenderer.invoke('get-apps'),
  addApp: (app: any) => ipcRenderer.invoke('add-app', app)
});

// Listen for speech recognition toggle from main process
ipcRenderer.on('toggle-speech-recognition', () => {
  document.dispatchEvent(new CustomEvent('toggle-speech-recognition'));
  console.log("Speech recognition toggle event received from main process");
});

// Listen for add app event from add shortcut window
ipcRenderer.on('add-app', (_event, app) => {
  document.dispatchEvent(new CustomEvent('add-app', { detail: app }));
  console.log("Add app event received from main process", app);
});
