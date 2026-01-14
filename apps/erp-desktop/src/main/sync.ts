// apps/erp-desktop/src/main/sync.ts
import { app } from 'electron';

class SyncManager {
    public isOnline: boolean = true;
    public lastSync: string = new Date().toISOString();

    async syncAll() {
        // Implementación real pendiente
        console.log('Syncing all data...');
        this.lastSync = new Date().toISOString();
        return { success: true };
    }

    async getQueueLength() {
        return 0;
    }
}

export const syncManager = new SyncManager();
