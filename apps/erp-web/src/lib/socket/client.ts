import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

class SocketClient {
    private socket: Socket | null = null;
    private listeners: Map<string, Function[]> = new Map();

    connect(token: string) {
        if (this.socket?.connected) return;

        this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.setupEventListeners();
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
            this.emit('listen', {
                channels: ['production', 'inventory', 'quality', 'machines'],
            });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                this.socket?.connect();
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        this.socket.on('production:order-created', (data: any) => {
            this.notifyListeners('production:order-created', data);
            toast.success(`Nueva orden creada: #${data.orderNumber}`);
        });

        this.socket.on('production:order-updated', (data: any) => {
            this.notifyListeners('production:order-updated', data);
            toast.info(`Orden actualizada: #${data.orderNumber}`);
        });

        this.socket.on('inventory:low-stock', (data: any) => {
            this.notifyListeners('inventory:low-stock', data);
            toast.warning(`Stock bajo: ${data.itemName} (${data.quantity} restantes)`);
        });
    }

    emit(event: string, data: any) {
        this.socket?.emit(event, data);
    }

    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);

        // También escuchar directamente del socket
        this.socket?.on(event, callback as any);
    }

    off(event: string, callback?: Function) {
        if (callback) {
            const listeners = this.listeners.get(event);
            if (listeners) {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            }
            this.socket?.off(event, callback as any);
        } else {
            this.listeners.delete(event);
            this.socket?.off(event);
        }
    }

    private notifyListeners(event: string, data: any) {
        const listeners = this.listeners.get(event);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const socketClient = new SocketClient();
