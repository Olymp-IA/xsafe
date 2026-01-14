import { BrowserWindow, BrowserWindowConstructorOptions, screen } from 'electron';
import path from 'path';

// Helper simple para detectar dev mode
const isDev = process.env.NODE_ENV === 'development';

const iconPath = path.join(__dirname, '../../build/icons/icon.png');

export const createMainWindow = (): BrowserWindow => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const windowOptions: BrowserWindowConstructorOptions = {
        width: Math.min(1440, width - 100),
        height: Math.min(900, height - 100),
        minWidth: 1024,
        minHeight: 768,
        show: false,
        frame: true,
        autoHideMenuBar: true,
        icon: iconPath,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
            spellcheck: false,
        },
    };

    const mainWindow = new BrowserWindow(windowOptions);

    // Cargar la aplicación
    if (isDev && process.env.ELECTRON_RENDERER_URL) {
        mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    } else {
        // En producción cargamos el index.html del renderer compilado
        mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'));
    }

    // Mostrar ventana cuando esté lista
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();

        // Abrir DevTools en desarrollo
        if (isDev) {
            mainWindow.webContents.openDevTools({ mode: 'right' });
        }
    });

    // Manejar eventos de navegación
    mainWindow.webContents.on('will-navigate', (event, url) => {
        // Prevenir navegación no deseada
        if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
            event.preventDefault();
        }
    });

    return mainWindow;
};
