
interface ElectronAPI {
  openUrl: (url: string) => Promise<void>;
  openLocalApp: (appPath: string) => Promise<void>;
  toggleSpeechRecognition: () => Promise<boolean>;
}

interface Window {
  electronAPI?: ElectronAPI;
}
