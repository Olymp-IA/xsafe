import { contextBridge, ipcRenderer } from 'electron';

// Exponer APIs seguras al proceso de renderizado
contextBridge.exposeInMainWorld('electronAPI', {
    // Sistema de archivos
    selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
    saveFile: (data: any) => ipcRenderer.invoke('file:save', data),

    // Base de datos
    executeQuery: (query: string, params: any[]) =>
        ipcRenderer.invoke('database:executeQuery', query, params),

    // Sincronización
    syncNow: () => ipcRenderer.invoke('sync:now'),
    getSyncStatus: () => ipcRenderer.invoke('sync:status'),

    // Aplicación
    getAppVersion: () => ipcRenderer.invoke('app:version'),
    restartApp: () => ipcRenderer.invoke('app:restart'),
    openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),

    // Eventos
    onUpdateProgress: (callback: (progress: any) => void) =>
        ipcRenderer.on('update-progress', (_, progress) => callback(progress)),

    // Configuración
    getConfig: (key: string) => ipcRenderer.invoke('config:get', key),
    setConfig: (key: string, value: any) => ipcRenderer.invoke('config:set', key, value),
});

// Exponer versión de Node y otros datos útiles
contextBridge.exposeInMainWorld('versions', {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
});
