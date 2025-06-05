
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),
  openLocalApp: (appPath: string) => ipcRenderer.invoke('open-local-app', appPath),
  openAddShortcutWindow: (appData?: any) => ipcRenderer.invoke('open-add-shortcut-window', appData),
  closeAddShortcutWindow: () => ipcRenderer.invoke('close-add-shortcut-window'),
  getApps: () => ipcRenderer.invoke('get-apps'),
  addApp: async (app: any) => {
    console.log('=== PRELOAD: addApp called ===');
    console.log('App data being sent:', JSON.stringify(app, null, 2));
    try {
      const result = await ipcRenderer.invoke('add-app', app);
      console.log('=== PRELOAD: addApp result ===', result);
      return result;
    } catch (error) {
      console.error('=== PRELOAD: addApp error ===');
      console.error('Error details:', error);
      throw error;
    }
  },
  updateApp: async (app: any) => {
    console.log('=== PRELOAD: updateApp called ===');
    console.log('App data being sent:', JSON.stringify(app, null, 2));
    try {
      const result = await ipcRenderer.invoke('update-app', app);
      console.log('=== PRELOAD: updateApp result ===', result);
      return result;
    } catch (error) {
      console.error('=== PRELOAD: updateApp error ===');
      console.error('Error details:', error);
      throw error;
    }
  }
});

// Listen for add app event from add shortcut window
ipcRenderer.on('add-app', (_event, app) => {
  console.log('=== PRELOAD: add-app event received ===');
  console.log('App data from main process:', JSON.stringify(app, null, 2));
  document.dispatchEvent(new CustomEvent('add-app', { detail: app }));
  console.log("Add app event dispatched to document");
});

// Listen for update app event from add shortcut window
ipcRenderer.on('update-app', (_event, app) => {
  console.log('=== PRELOAD: update-app event received ===');
  console.log('App data from main process:', JSON.stringify(app, null, 2));
  document.dispatchEvent(new CustomEvent('update-app', { detail: app }));
  console.log("Update app event dispatched to document");
});
