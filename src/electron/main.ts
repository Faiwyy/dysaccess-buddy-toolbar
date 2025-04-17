import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { exec } from 'child_process';
import * as os from 'os';

// Keep a global reference of the window object to prevent garbage collection
let mainWindow: BrowserWindow | null = null;

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
    icon: path.join(__dirname, '../public/favicon.ico')
  });

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

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
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
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers();

  app.on('activate', () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (mainWindow === null) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
