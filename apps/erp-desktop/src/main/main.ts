import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { createMainWindow } from './windows/mainWindow';
import { createMenu } from './menu';
import { createTray } from './tray';
import { autoUpdater } from './updater';
import { initializeDatabase } from './database';
import { registerIpcHandlers } from './ipcHandlers';

// Manejar múltiples instancias (evitar en macOS)
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
    app.quit();
    process.exit(0);
}

// Inicializar la aplicación
app.on('ready', async () => {
    // Inicializar base de datos local
    await initializeDatabase();

    // Crear ventana principal
    const mainWindow = createMainWindow();

    // Crear menú de aplicación
    createMenu(mainWindow);

    // Crear icono en la bandeja del sistema
    createTray(mainWindow);

    // Configurar auto-actualizaciones
    if (process.env.NODE_ENV === 'production') {
        autoUpdater(mainWindow);
    }

    // Registrar manejadores de IPC
    registerIpcHandlers(mainWindow);

    // Abrir enlaces externos en el navegador por defecto
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
});

// Salir cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Activar aplicación en macOS al hacer clic en el dock
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

// Manejar argumentos de línea de comandos (para protocolos personalizados)
app.on('open-url', (event, url) => {
    event.preventDefault();
    // Manejar URL personalizada (ej: xsafe://order/123)
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
        mainWindow.webContents.send('custom-protocol', url);
    }
});

// Configurar protocolo personalizado (opcional)
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('xsafe', process.execPath, [process.argv[1]]);
    }
} else {
    app.setAsDefaultProtocolClient('xsafe');
}
