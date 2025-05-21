import { app, BrowserWindow, shell, ipcMain, dialog, Tray, Menu, nativeImage } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { exec } from 'child_process';
import * as os from 'os';
import * as fs from 'fs';

// Keep a global reference of the window object to prevent garbage collection
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuiting = false;

// Function to check if app should be launched at startup
const getAutoLaunchValue = (): boolean => {
  try {
    const userDataPath = app.getPath('userData');
    const configPath = path.join(userDataPath, 'config.json');
    
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return configData.autoLaunch === true;
    }
    return false;
  } catch (error) {
    console.error('Error reading autolaunch config:', error);
    return false;
  }
};

// Function to set auto launch
const setAutoLaunch = (enabled: boolean): void => {
  try {
    const userDataPath = app.getPath('userData');
    const configPath = path.join(userDataPath, 'config.json');
    
    let configData = {};
    if (fs.existsSync(configPath)) {
      configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    configData = { ...configData, autoLaunch: enabled };
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    
    // Set auto launch for the application
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: app.getPath('exe')
    });
    
  } catch (error) {
    console.error('Error setting autolaunch:', error);
  }
};

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../public/favicon.ico'),
    frame: false,
    transparent: true,
    alwaysOnTop: true, // Always show on top of other windows
    skipTaskbar: true  // Hide from taskbar
  });

  // Set the window to be always on top
  mainWindow.setAlwaysOnTop(true, 'floating');
  
  // Load the app
  if (process.env.NODE_ENV === 'development') {
    // Load from dev server in development mode
    mainWindow.loadURL('http://localhost:8080');
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // Load local file in production mode
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // Handle external links (open in default browser)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Prevent the window from being closed, hide it instead
  mainWindow.on('close', (event) => {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow?.hide();
      return false;
    }
    return true;
  });
  
  // Create tray icon
  createTray();
}

// Function to create tray icon
function createTray() {
  const iconPath = path.join(__dirname, '../public/favicon.ico');
  const trayIcon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Afficher DysAccess', 
      click: () => {
        mainWindow?.show();
      }
    },
    { 
      label: 'Toujours au premier plan',
      type: 'checkbox',
      checked: true,
      click: (menuItem) => {
        if (mainWindow) {
          mainWindow.setAlwaysOnTop(menuItem.checked);
        }
      }
    },
    { 
      label: 'Lancer au démarrage',
      type: 'checkbox',
      checked: getAutoLaunchValue(),
      click: (menuItem) => {
        setAutoLaunch(menuItem.checked);
      } 
    },
    { type: 'separator' },
    { 
      label: 'Quitter', 
      click: () => {
        isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('DysAccess Buddy');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });
}

// Function to open a local application
function openLocalApplication(appPath: string) {
  const platform = os.platform();

  try {
    if (platform === 'win32') {
      exec(`start ${appPath}`);
    } else if (platform === 'darwin') {
      exec(`open ${appPath}`);
    } else if (platform === 'linux') {
      exec(`xdg-open ${appPath}`);
    } else {
      dialog.showErrorBox('Error', `Unsupported platform: ${platform}`);
    }
  } catch (error) {
    dialog.showErrorBox('Error', `Failed to open application: ${error}`);
  }
}

// Register IPC handlers
function registerIpcHandlers() {
  ipcMain.handle('open-url', async (_event, url) => {
    return shell.openExternal(url);
  });

  ipcMain.handle('open-local-app', async (_event, appPath) => {
    return openLocalApplication(appPath);
  });
  
  ipcMain.handle('toggle-speech-recognition', async () => {
    // This is handled by the renderer process since speech recognition
    // is implemented with the Web Speech API
    if (mainWindow) {
      mainWindow.webContents.send('toggle-speech-recognition');
    }
    return true;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers();

  app.on('activate', () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (mainWindow === null) createWindow();
  });
  
  // Check and set autolaunch configuration
  if (getAutoLaunchValue()) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath('exe')
    });
  }
});

// When quitting
app.on('before-quit', () => {
  isQuiting = true;
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
