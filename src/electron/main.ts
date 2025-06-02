import { app, BrowserWindow, shell, ipcMain, dialog, Tray, Menu, nativeImage, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { exec } from 'child_process';
import * as os from 'os';
import * as fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keep a global reference of the window object to prevent garbage collection
let mainWindow: BrowserWindow | null = null;
let addShortcutWindow: BrowserWindow | null = null;
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
  // Get icon path for window
  const appIconPath = path.join(
    process.env.NODE_ENV === 'development' ? __dirname : app.getAppPath(),
    process.env.NODE_ENV === 'development' ? '../public/lovable-uploads/63ea3245-8d78-4d36-88ee-8f100c443668.png' : 'build/resources/icon.png'
  );

  // Calculate center position
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: displayWidth, height: displayHeight } = primaryDisplay.workAreaSize;
  const windowWidth = 1200;
  const windowHeight = 100;

  const x = Math.round((displayWidth - windowWidth) / 2);
  const y = Math.round((displayHeight - windowHeight) / 2);

  // Create the browser window
  mainWindow = new BrowserWindow({
    x,
    y,
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // Permet l'accès aux API web comme Speech Recognition
      allowRunningInsecureContent: true // Aide avec les API web
    },
    icon: appIconPath,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    resizable: false
  });

  // Set the window to be always on top with highest level
  mainWindow.setAlwaysOnTop(true, 'floating');
  
  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    const htmlPath = path.join(app.getAppPath(), 'dist', 'index.html');
    mainWindow.loadFile(htmlPath);
  }

  // Show window once ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.setAlwaysOnTop(true, 'floating');
  });

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
  
  // Ensure the window stays on top when focus changes
  mainWindow.on('blur', () => {
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(true, 'floating');
    }
  });
  
  // Create tray icon
  createTray();
}

// Function to create add shortcut window
function createAddShortcutWindow() {
  if (addShortcutWindow) {
    addShortcutWindow.focus();
    return;
  }

  const appIconPath = path.join(
    process.env.NODE_ENV === 'development' ? __dirname : app.getAppPath(),
    process.env.NODE_ENV === 'development' ? '../public/lovable-uploads/63ea3245-8d78-4d36-88ee-8f100c443668.png' : 'build/resources/icon.png'
  );

  addShortcutWindow = new BrowserWindow({
    width: 600,
    height: 800,
    minWidth: 500,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    parent: mainWindow,
    modal: true,
    show: false,
    frame: true,
    transparent: false,
    resizable: false,
    icon: appIconPath,
    title: 'Ajouter un raccourci - DysAccess Buddy'
  });

  // Load the add shortcut page
  if (process.env.NODE_ENV === 'development') {
    addShortcutWindow.loadURL('http://localhost:8080/#/add-shortcut');
  } else {
    const htmlPath = path.join(app.getAppPath(), 'dist', 'index.html');
    addShortcutWindow.loadFile(htmlPath, { hash: 'add-shortcut' });
  }

  addShortcutWindow.once('ready-to-show', () => {
    addShortcutWindow?.show();
  });

  addShortcutWindow.on('closed', () => {
    addShortcutWindow = null;
  });
}

// Function to create tray icon
function createTray() {
  const trayIconPath = path.join(
    process.env.NODE_ENV === 'development' ? __dirname : app.getAppPath(),
    process.env.NODE_ENV === 'development' ? '../public/lovable-uploads/63ea3245-8d78-4d36-88ee-8f100c443668.png' : 'build/resources/icon.png'
  );
  const trayIcon = nativeImage.createFromPath(trayIconPath);
  
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
  console.log('Attempting to open application at path:', appPath);
  const platform = os.platform();

  try {
    if (platform === 'win32') {
      exec(`start "${appPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          dialog.showErrorBox('Erreur de lancement', `Échec du lancement : ${error.message}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    } else if (platform === 'darwin') {
      exec(`open "${appPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          dialog.showErrorBox('Erreur de lancement', `Échec du lancement : ${error.message}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    } else if (platform === 'linux') {
      exec(`xdg-open "${appPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          dialog.showErrorBox('Erreur de lancement', `Échec du lancement : ${error.message}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    } else {
      dialog.showErrorBox('Error', `Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error('Error in openLocalApplication:', error);
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
    if (mainWindow) {
      mainWindow.webContents.send('toggle-speech-recognition');
    }
    return true;
  });

  // New handler for opening add shortcut window
  ipcMain.handle('open-add-shortcut-window', async () => {
    createAddShortcutWindow();
    return true;
  });

  // Handler for closing add shortcut window
  ipcMain.handle('close-add-shortcut-window', async () => {
    if (addShortcutWindow) {
      addShortcutWindow.close();
    }
    return true;
  });

  // Handler for getting apps from main window
  ipcMain.handle('get-apps', async () => {
    if (mainWindow) {
      return await mainWindow.webContents.executeJavaScript('window.getApps && window.getApps()');
    }
    return [];
  });

  // Handler for adding app to main window
  ipcMain.handle('add-app', async (_event, app) => {
    if (mainWindow) {
      mainWindow.webContents.send('add-app', app);
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
