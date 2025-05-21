
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),
  openLocalApp: (appPath: string) => ipcRenderer.invoke('open-local-app', appPath),
  toggleSpeechRecognition: () => ipcRenderer.invoke('toggle-speech-recognition')
});

// Listen for speech recognition toggle from main process
ipcRenderer.on('toggle-speech-recognition', () => {
  // Dispatch a custom event that the React app can listen for
  document.dispatchEvent(new CustomEvent('toggle-speech-recognition'));
});
