// apps/erp-mobile/src/services/api/apiClient.ts
import axios from 'axios';
import { database } from '../storage/database';

// Replace with your actual API URL
const API_URL = 'http://10.0.2.2:3000/api'; // Android emulator localhost

export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    // Add auth token here from storage if needed
    return config;
});

export const apiClient = {
    // Production Orders
    getOrders: async (params: any) => {
        const response = await api.get('/production/orders', { params });
        return response.data;
    },

    createOrder: async (data: any) => {
        const response = await api.post('/production/orders', data);
        return response.data;
    },

    updateOrder: async (id: string, data: any) => {
        const response = await api.patch(`/production/orders/${id}`, data);
        return response.data;
    },

    updateProductionStage: async (id: string, data: any) => {
        const response = await api.patch(`/production/stages/${id}`, data);
        return response.data;
    },

    // Inventory
    getInventory: async (params: any) => {
        const response = await api.get('/inventory', { params });
        return response.data;
    },

    createInventoryMovement: async (data: any) => {
        const response = await api.post('/inventory/movements', data);
        return response.data;
    },
};
