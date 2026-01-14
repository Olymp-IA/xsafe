import { app } from 'electron';
import path from 'path';
import { DataSource } from 'typeorm';
import { Product, Order, InventoryItem, SyncQueue } from './entities';

let dataSource: DataSource;

export const initializeDatabase = async (): Promise<DataSource> => {
    const userDataPath = app.getPath('userData');
    const databasePath = path.join(userDataPath, 'xsafe-erp.db');

    dataSource = new DataSource({
        type: 'sqlite',
        database: databasePath,
        synchronize: true, // Auto-crear tablas (solo dev)
        logging: false,
        entities: [Product, Order, InventoryItem, SyncQueue],
        migrations: [],
        subscribers: [],
    });

    await dataSource.initialize();
    console.log('Database initialized at:', databasePath);
    return dataSource;
};

export const getDataSource = (): DataSource => {
    if (!dataSource) {
        throw new Error('Database not initialized');
    }
    return dataSource;
};
