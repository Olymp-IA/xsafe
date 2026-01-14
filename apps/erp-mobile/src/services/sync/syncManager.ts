// apps/erp-mobile/src/services/sync/syncManager.ts
import NetInfo from '@react-native-community/netinfo';
import { database } from '../storage/database';
import { apiClient } from '../api/apiClient';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SyncManager {
    private isSyncing = false;
    private syncInterval: NodeJS.Timeout | null = null; // Changed from NodeJS.Timer to NodeJS.Timeout

    async initialize() {
        // Inicializar base de datos
        await database.init();

        // Configurar listener de conexión
        NetInfo.addEventListener((state) => {
            if (state.isConnected && !this.isSyncing) {
                this.syncAll();
            }
        });

        // Sincronización periódica cada 5 minutos
        this.syncInterval = setInterval(() => {
            this.syncAll();
        }, 5 * 60 * 1000);

        // Sincronización inicial
        this.syncAll();
    }

    async syncAll() {
        if (this.isSyncing) return;

        this.isSyncing = true;
        try {
            // 1. Sincronizar datos pendientes locales → servidor
            await this.syncLocalChanges();

            // 2. Sincronizar datos del servidor → local
            await this.syncFromServer();

            // 3. Sincronizar archivos multimedia
            await this.syncMediaFiles();
        } catch (error) {
            console.error('Sync error:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    private async syncLocalChanges() {
        const pendingItems = await database.getPendingSyncItems();

        for (const item of pendingItems) {
            try {
                const data = JSON.parse(item.data);

                switch (item.table_name) {
                    case 'production_orders':
                        if (item.operation === 'CREATE') {
                            await apiClient.createOrder(data);
                        } else if (item.operation === 'UPDATE') {
                            await apiClient.updateOrder(data.id, data);
                        }
                        break;

                    case 'inventory_movements':
                        await apiClient.createInventoryMovement(data);
                        break;

                    case 'production_stages':
                        if (item.operation === 'UPDATE') {
                            await apiClient.updateProductionStage(data.id, data);
                        }
                        break;
                }

                await database.markAsSynced(item.id);
            } catch (error) {
                console.error(`Sync failed for item ${item.id}:`, error);
                await database.markSyncFailed(item.id);
            }
        }
    }

    private async syncFromServer() {
        try {
            // Obtener últimas actualizaciones del servidor
            const lastSync = await this.getLastSyncTimestamp();

            // Sincronizar órdenes
            const orders = await apiClient.getOrders({ since: lastSync });
            await this.syncOrdersToLocal(orders);

            // Sincronizar inventario
            const inventory = await apiClient.getInventory({ since: lastSync });
            await this.syncInventoryToLocal(inventory);

            // Actualizar timestamp de última sincronización
            await this.updateLastSyncTimestamp();
        } catch (error) {
            console.error('Sync from server error:', error);
        }
    }

    private async syncOrdersToLocal(orders: any[]) {
        for (const order of orders) {
            const exists = await database.executeQuery<any>(
                'SELECT id FROM production_orders WHERE id = ?',
                [order.id]
            );

            if (exists.length > 0) {
                // Actualizar
                await database.executeUpdate(
                    `UPDATE production_orders SET 
            order_number = ?, customer_name = ?, motorcycle_model = ?,
            product_type = ?, status = ?, priority = ?, due_date = ?,
            started_at = ?, completed_at = ?, notes = ?, is_synced = 1,
            updated_at = ?
           WHERE id = ?`,
                    [
                        order.order_number,
                        order.customer_name,
                        order.motorcycle_model,
                        order.product_type,
                        order.status,
                        order.priority,
                        order.due_date,
                        order.started_at,
                        order.completed_at,
                        order.notes,
                        new Date().toISOString(),
                        order.id,
                    ]
                );
            } else {
                // Insertar
                await database.executeUpdate(
                    `INSERT INTO production_orders 
            (id, order_number, customer_name, motorcycle_model,
             product_type, status, priority, due_date, started_at,
             completed_at, notes, is_synced, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
                    [
                        order.id,
                        order.order_number,
                        order.customer_name,
                        order.motorcycle_model,
                        order.product_type,
                        order.status,
                        order.priority,
                        order.due_date,
                        order.started_at,
                        order.completed_at,
                        order.notes,
                        new Date().toISOString(),
                        new Date().toISOString(),
                    ]
                );
            }
        }
    }

    private async syncInventoryToLocal(inventory: any[]) {
        for (const item of inventory) {
            const exists = await database.executeQuery<any>(
                'SELECT id FROM inventory_items WHERE id = ?',
                [item.id]
            );

            if (exists.length > 0) {
                await database.executeUpdate(
                    `UPDATE inventory_items SET 
            sku = ?, name = ?, type = ?, quantity = ?,
            unit = ?, min_quantity = ?, location = ?,
            last_updated = ?, is_synced = 1
           WHERE id = ?`,
                    [
                        item.sku,
                        item.name,
                        item.type,
                        item.quantity,
                        item.unit,
                        item.min_quantity,
                        item.location,
                        new Date().toISOString(),
                        item.id,
                    ]
                );
            } else {
                await database.executeUpdate(
                    `INSERT INTO inventory_items 
            (id, sku, name, type, quantity, unit, 
             min_quantity, location, last_updated, is_synced)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                    [
                        item.id,
                        item.sku,
                        item.name,
                        item.type,
                        item.quantity,
                        item.unit,
                        item.min_quantity,
                        item.location,
                        new Date().toISOString(),
                    ]
                );
            }
        }
    }

    private async syncMediaFiles() {
        // Implementar sincronización de fotos, documentos, etc.
    }

    private async getLastSyncTimestamp(): Promise<string> {
        // Obtener de AsyncStorage
        const lastSync = await AsyncStorage.getItem('last_sync_timestamp');
        return lastSync || '2024-01-01T00:00:00Z';
    }

    private async updateLastSyncTimestamp() {
        await AsyncStorage.setItem(
            'last_sync_timestamp',
            new Date().toISOString()
        );
    }

    async manualSync() {
        Alert.alert(
            'Sincronización',
            '¿Deseas sincronizar todos los datos ahora?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sincronizar',
                    onPress: async () => {
                        await this.syncAll();
                        Alert.alert('Éxito', 'Sincronización completada');
                    },
                },
            ]
        );
    }
}

export const syncManager = new SyncManager();
