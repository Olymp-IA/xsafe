import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    sku: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column('decimal')
    price: number;

    @Column('decimal')
    cost: number;

    @Column('decimal')
    stock: number;

    @Column({ default: 0 })
    minStock: number;

    @Column({ nullable: true })
    location: string;

    @Column({ default: false })
    isSynced: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    orderNumber: string;

    @Column()
    customerName: string;

    @Column()
    status: string; // PENDING, IN_PROGRESS, COMPLETED

    @Column({ type: 'text', nullable: true }) // SQLite stores JSON as TEXT
    items: string; // JSON string of items

    @CreateDateColumn()
    createdAt: Date;
}

@Entity()
export class InventoryItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}

@Entity()
export class SyncQueue {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
