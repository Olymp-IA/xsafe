import type { Category } from '../types';

/**
 * Category color palettes and MOTION IDENTITIES for X-SAFE Ecommerce
 * Refined Industrial Palette: Charcoal, Steel, Graphite, Intenstional Accents.
 */
export const categories: Category[] = [
    {
        id: 'defensas',
        name: 'DEFENSAS',
        description: 'Protección estructural de acero de alta resistencia.',
        cta: 'VER ESPECIFICACIONES',
        colors: {
            primary: '#C62828', // Red
            secondary: '#121212',
            background: '#080808',
            text: '#E0E0E0',
            brandingX: '#C62828',
        },
        motion: { rotationMultiplier: 1.0, inertia: 0.8, rhythm: 'heavy', anticipationScale: 1.0 }
    },
    {
        id: 'cubre-carter',
        name: 'CUBRE CARTER',
        description: 'Blindaje inferior de aleación ligera. Protección crítica.',
        cta: 'VER ESPECIFICACIONES',
        colors: {
            primary: '#90A4AE', // Steel
            secondary: '#121212',
            background: '#080808',
            text: '#E0E0E0',
            brandingX: '#90A4AE',
        },
        motion: { rotationMultiplier: 1.0, inertia: 0.8, rhythm: 'solid', anticipationScale: 1.0 }
    },
    {
        id: 'soporte-alforjas',
        name: 'SOPORTE DE ALFORJAS',
        description: 'Estructuras laterales robustas para transporte de equipaje.',
        cta: 'VER ESPECIFICACIONES',
        colors: {
            primary: '#F57F17', // Amber
            secondary: '#121212',
            background: '#080808',
            text: '#E0E0E0',
            brandingX: '#F57F17',
        },
        motion: { rotationMultiplier: 1.0, inertia: 0.8, rhythm: 'smooth', anticipationScale: 1.0 }
    },
    {
        id: 'parrillas',
        name: 'PARRILLAS',
        description: 'Sistemas de carga posterior para viajes largos.',
        cta: 'VER ESPECIFICACIONES',
        colors: {
            primary: '#607D8B', // Blue Grey
            secondary: '#121212',
            background: '#080808',
            text: '#E0E0E0',
            brandingX: '#607D8B',
        },
        motion: { rotationMultiplier: 1.0, inertia: 0.8, rhythm: 'precise', anticipationScale: 1.0 }
    },
    {
        id: 'nosotros',
        name: 'NOSOTROS',
        description: 'Expertos en protección y seguridad para motociclistas.',
        cta: 'CONOCER MÁS',
        colors: {
            primary: '#2E7D32', // Green
            secondary: '#121212',
            background: '#080808',
            text: '#E0E0E0',
            brandingX: '#2E7D32',
        },
        motion: { rotationMultiplier: 1.0, inertia: 0.8, rhythm: 'nervous', anticipationScale: 1.0 }
    },
];
