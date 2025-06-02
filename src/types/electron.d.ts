
export interface ElectronAPI {
  openUrl: (url: string) => Promise<void>;
  openLocalApp: (appPath: string) => Promise<void>;
  toggleSpeechRecognition: () => Promise<boolean>;
  openAddShortcutWindow: () => Promise<boolean>;
  closeAddShortcutWindow: () => Promise<boolean>;
  getApps: () => Promise<any[]>;
  addApp: (app: any) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
