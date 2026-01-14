import { Menu, MenuItemConstructorOptions, BrowserWindow, shell, app } from 'electron';

export const createMenu = (mainWindow: BrowserWindow) => {
    const template: MenuItemConstructorOptions[] = [
        {
            label: 'Archivo',
            submenu: [
                { label: 'Sincronizar ahora', click: () => mainWindow.webContents.send('menu:sync') },
                { type: 'separator' },
                { role: 'quit', label: 'Salir' }
            ]
        },
        {
            label: 'Ver',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: 'Documentación',
                    click: async () => {
                        await shell.openExternal('https://docs.xsafe-erp.com');
                    }
                },
                {
                    label: 'Reportar problema',
                    click: async () => {
                        await shell.openExternal('mailto:support@xsafe-erp.com');
                    }
                },
                { type: 'separator' },
                {
                    label: `Versión ${app.getVersion()}`,
                    enabled: false
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};
