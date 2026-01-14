import { BrowserWindow, ipcMain, dialog, shell, app } from 'electron';
import { getDataSource } from './database';
import Store from 'electron-store';

const store = new Store();

export const registerIpcHandlers = (mainWindow: BrowserWindow) => {
    // Sistema de archivos
    ipcMain.handle('dialog:selectDirectory', async () => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
        });
        return result.filePaths[0];
    });

    ipcMain.handle('file:save', async (_, data) => {
        const result = await dialog.showSaveDialog(mainWindow, {
            defaultPath: `backup-${Date.now()}.json`,
            filters: [{ name: 'JSON', extensions: ['json'] }],
        });
        if (!result.canceled && result.filePath) {
            const fs = require('fs');
            fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2));
            return result.filePath;
        }
    });

    // Base de datos - Ejecutar SQL crudo (Cuidado con inyección, solo permitir select seguros o usar parámetros)
    ipcMain.handle('database:executeQuery', async (_, query: string, params: any[]) => {
        const dataSource = getDataSource();
        return await dataSource.query(query, params);
    });

    // Sincronización (Stub)
    ipcMain.handle('sync:now', async () => {
        // Implementar llamada al syncManager real
        return { success: true, message: 'Sync started' };
    });

    ipcMain.handle('sync:status', async () => {
        return {
            isOnline: true, // Detectar online status real
            queueLength: 0,
            lastSync: new Date().toISOString(),
        };
    });

    // Aplicación
    ipcMain.handle('app:version', () => {
        return app.getVersion();
    });

    ipcMain.handle('app:restart', () => {
        app.relaunch();
        app.exit();
    });

    ipcMain.handle('shell:openExternal', (_, url) => {
        shell.openExternal(url);
    });

    // Configuración
    ipcMain.handle('config:get', (_, key: string) => {
        return store.get(key);
    });

    ipcMain.handle('config:set', (_, key: string, value: any) => {
        store.set(key, value);
    });
};
