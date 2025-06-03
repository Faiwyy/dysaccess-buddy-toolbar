
export interface ElectronAPI {
  openUrl: (url: string) => Promise<void>;
  openLocalApp: (appPath: string) => Promise<void>;
  openAddShortcutWindow: (appData?: any) => Promise<boolean>;
  closeAddShortcutWindow: () => Promise<boolean>;
  getApps: () => Promise<any[]>;
  addApp: (app: any) => Promise<boolean>;
  updateApp: (app: any) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
