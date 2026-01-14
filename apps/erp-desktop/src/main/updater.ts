import { autoUpdater as electronUpdater, UpdateInfo } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';
import log from 'electron-log';

electronUpdater.logger = log;
electronUpdater.autoDownload = false;

export const autoUpdater = (mainWindow: BrowserWindow) => {
    // Verificar actualizaciones al inicio
    electronUpdater.checkForUpdates().catch((err) => {
        log.error('Error checking for updates:', err);
    });

    // Evento: actualización disponible
    electronUpdater.on('update-available', (info: UpdateInfo) => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Actualización disponible',
            message: `Versión ${info.version} está disponible. ¿Deseas descargarla ahora?`,
            buttons: ['Descargar', 'Más tarde'],
            defaultId: 0,
            cancelId: 1,
        }).then((result) => {
            if (result.response === 0) {
                electronUpdater.downloadUpdate();
            }
        });
    });

    // Evento: error
    electronUpdater.on('error', (err) => {
        log.error('Error in auto-updater:', err);
    });

    // Evento: descarga completada
    electronUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Actualización lista',
            message: 'La actualización se ha descargado. ¿Deseas reiniciar la aplicación ahora?',
            buttons: ['Reiniciar', 'Más tarde'],
            defaultId: 0,
            cancelId: 1,
        }).then((result) => {
            if (result.response === 0) {
                electronUpdater.quitAndInstall();
            }
        });
    });

    // Evento: progreso de descarga
    electronUpdater.on('download-progress', (progressObj) => {
        mainWindow.webContents.send('update-progress', progressObj);
    });
};
