
interface ElectronAPI {
  openUrl: (url: string) => Promise<void>;
  openLocalApp: (appPath: string) => Promise<void>;
}

interface Window {
  electronAPI?: ElectronAPI;
}
