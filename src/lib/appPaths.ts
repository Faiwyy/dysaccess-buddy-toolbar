
// Configuration des chemins d'applications par plateforme
export const APP_PATHS = {
  lexibar: {
    mac: '/Applications/Lexibar.app',
    win: 'C:\\Program Files\\Lexibar\\Lexibar.exe',
    linux: '/usr/bin/lexibar'
  },
  // Ajouter d'autres applications si nécessaire
  wordpad: {
    mac: '/System/Applications/TextEdit.app',
    win: 'C:\\Program Files\\Windows NT\\Accessories\\wordpad.exe',
    linux: '/usr/bin/gedit'
  }
};

// Fonction utilitaire pour obtenir le chemin selon la plateforme
export const getAppPath = (appName: keyof typeof APP_PATHS): string => {
  const platform = navigator.platform.toLowerCase();
  
  if (platform.includes('mac')) {
    return APP_PATHS[appName].mac;
  } else if (platform.includes('win')) {
    return APP_PATHS[appName].win;
  } else {
    return APP_PATHS[appName].linux;
  }
};
