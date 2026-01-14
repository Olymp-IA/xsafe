import { z } from 'zod';

export const createOrderSchema = z.object({
    customerName: z.string().min(2, 'Nombre del cliente requerido'),
    motorcycleModel: z.string().min(1, 'Modelo requerido'),
    productType: z.enum(['FRAME', 'ENGINE', 'SUSPENSION', 'EXHAUST', 'OTHER']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    dueDate: z.string().datetime(),
    notes: z.string().optional(),
    items: z.array(z.object({
        sku: z.string(),
        quantity: z.number().min(1),
    })).optional(),
});
