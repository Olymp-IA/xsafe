import { Tray, Menu, BrowserWindow, app } from 'electron';
import path from 'path';

let tray: Tray | null = null;

export const createTray = (mainWindow: BrowserWindow) => {
    const iconPath = path.join(__dirname, '../../build/icons/icon.png');

    // En un caso real, verificaríamos que el icono existe antes de crear el tray
    // Para este scaffold, asumimos que el path es correcto o Electron manejará el error/fallback
    try {
        tray = new Tray(iconPath);

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Abrir xSafe ERP',
                click: () => mainWindow.show()
            },
            { type: 'separator' },
            {
                label: 'Sincronizar',
                click: () => mainWindow.webContents.send('menu:sync')
            },
            { type: 'separator' },
            {
                label: 'Salir',
                click: () => app.quit()
            }
        ]);

        tray.setToolTip('xSafe ERP Desktop');
        tray.setContextMenu(contextMenu);

        tray.on('double-click', () => {
            mainWindow.show();
        });
    } catch (error) {
        console.warn('Failed to create tray icon (likely missing asset in dev mode):', error);
    }
};
