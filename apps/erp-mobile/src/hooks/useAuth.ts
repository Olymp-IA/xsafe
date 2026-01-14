// apps/erp-mobile/src/hooks/useAuth.ts
import { create } from 'zustand';

interface AuthState {
    user: any | null;
    token: string | null;
    login: (user: any, token: string) => void;
    logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    user: { firstName: 'Admin', role: 'MANAGER' }, // Mock user for now
    token: 'mock-token',
    login: (user, token) => set({ user, token }),
    logout: () => set({ user: null, token: null }),
}));


// apps/erp-mobile/src/hooks/useProduction.ts
import { create } from 'zustand';
import { database } from '../services/storage/database';

interface ProductionStore {
    loading: boolean;
    orders: any[];
    loadOrders: () => Promise<void>;
}

export const useProduction = create<ProductionStore>((set) => ({
    loading: false,
    orders: [],
    loadOrders: async () => {
        set({ loading: true });
        try {
            const orders = await database.executeQuery('SELECT * FROM production_orders ORDER BY created_at DESC');
            set({ orders });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
}));
