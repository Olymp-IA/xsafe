// apps/erp-mobile/src/services/storage/database.ts
import SQLite from 'react-native-sqlite-storage';

class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;

    async init() {
        this.db = await SQLite.openDatabase({
            name: 'xSafeERP.db',
            location: 'default',
        });

        await this.createTables();
    }

    private async createTables() {
        // Tabla de órdenes de producción
        await this.db?.executeSql(`
      CREATE TABLE IF NOT EXISTS production_orders (
        id TEXT PRIMARY KEY,
        order_number TEXT NOT NULL,
        customer_name TEXT,
        motorcycle_model TEXT,
        product_type TEXT,
        status TEXT,
        priority TEXT,
        due_date TEXT,
        started_at TEXT,
        completed_at TEXT,
        notes TEXT,
        is_synced BOOLEAN DEFAULT 0,
        created_at TEXT,
        updated_at TEXT
      );
    `);

        // Tabla de etapas de producción
        await this.db?.executeSql(`
      CREATE TABLE IF NOT EXISTS production_stages (
        id TEXT PRIMARY KEY,
        order_id TEXT,
        stage_type TEXT,
        status TEXT,
        assigned_to TEXT,
        machine_id TEXT,
        started_at TEXT,
        completed_at TEXT,
        estimated_hours REAL,
        actual_hours REAL,
        is_synced BOOLEAN DEFAULT 0,
        FOREIGN KEY (order_id) REFERENCES production_orders (id)
      );
    `);

        // Tabla de inventario
        await this.db?.executeSql(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id TEXT PRIMARY KEY,
        sku TEXT NOT NULL,
        name TEXT,
        type TEXT,
        quantity REAL,
        unit TEXT,
        min_quantity REAL,
        location TEXT,
        last_updated TEXT,
        is_synced BOOLEAN DEFAULT 0
      );
    `);

        // Tabla de movimientos de inventario
        await this.db?.executeSql(`
      CREATE TABLE IF NOT EXISTS inventory_movements (
        id TEXT PRIMARY KEY,
        item_id TEXT,
        type TEXT,
        quantity REAL,
        reference_type TEXT,
        reference_id TEXT,
        notes TEXT,
        created_at TEXT,
        is_synced BOOLEAN DEFAULT 0,
        FOREIGN KEY (item_id) REFERENCES inventory_items (id)
      );
    `);

        // Tabla de sincronización pendiente
        await this.db?.executeSql(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_name TEXT,
        record_id TEXT,
        operation TEXT, -- CREATE, UPDATE, DELETE
        data TEXT,
        created_at TEXT,
        attempts INTEGER DEFAULT 0
      );
    `);
    }

    async executeQuery<T>(sql: string, params: any[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db?.transaction((tx) => {
                tx.executeSql(
                    sql,
                    params,
                    (_, results) => {
                        const items: T[] = [];
                        for (let i = 0; i < results.rows.length; i++) {
                            items.push(results.rows.item(i));
                        }
                        resolve(items);
                    },
                    (_, error) => {
                        reject(error);
                        return true;
                    }
                );
            });
        });
    }

    async executeUpdate(sql: string, params: any[] = []): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db?.transaction((tx) => {
                tx.executeSql(
                    sql,
                    params,
                    (_, results) => {
                        resolve(results.rowsAffected);
                    },
                    (_, error) => {
                        reject(error);
                        return true;
                    }
                );
            });
        });
    }

    async addToSyncQueue(table: string, operation: string, data: any) {
        const sql = `
      INSERT INTO sync_queue (table_name, record_id, operation, data, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;

        await this.executeUpdate(sql, [
            table,
            data.id,
            operation,
            JSON.stringify(data),
            new Date().toISOString(),
        ]);
    }

    async getPendingSyncItems(): Promise<any[]> {
        return this.executeQuery<any>(`
      SELECT * FROM sync_queue 
      WHERE attempts < 3 
      ORDER BY created_at ASC 
      LIMIT 50
    `);
    }

    async markAsSynced(queueId: number) {
        await this.executeUpdate(
            'DELETE FROM sync_queue WHERE id = ?',
            [queueId]
        );
    }

    async markSyncFailed(queueId: number) {
        await this.executeUpdate(
            'UPDATE sync_queue SET attempts = attempts + 1 WHERE id = ?',
            [queueId]
        );
    }
}

export const database = new DatabaseService();
