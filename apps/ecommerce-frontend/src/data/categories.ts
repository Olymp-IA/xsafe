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
            // Industrial Red / Safety Red (Restrained)
            primary: '#C62828',
            secondary: '#121212', // Charcoal
            background: '#080808', // Deep Black
            text: '#E0E0E0',       // Light Steel
            brandingX: '#C62828',
        },
        motion: {
            rotationMultiplier: 1.0,
            inertia: 0.8,
            rhythm: 'heavy',
            anticipationScale: 1.0,
        }
    },
    {
        id: 'sliders',
        name: 'SLIDERS',
        description: 'Polímeros de ingeniería para absorción de impacto.',
        cta: 'VER ESPECIFICACIONES',
        colors: {
            // Deep Amber / Warning
            primary: '#F57F17',
            secondary: '#121212',
            background: '#080808',
            text: '#E0E0E0',
            brandingX: '#F57F17',
        },
        motion: {
            rotationMultiplier: 1.0,
            inertia: 0.8,
            rhythm: 'smooth',
            anticipationScale: 1.0,
        }
    },
    {
        id: 'guardamotor',
        name: 'GUARDAMOTOR',
        description: 'Blindaje inferior de aleación ligera. Protección crítica.',
        cta: 'VER ESPECIFICACIONES',
        colors: {
            // Steel / Raw Metal
            primary: '#90A4AE',
            secondary: '#121212',
            background: '#080808',
            text: '#E0E0E0',
            brandingX: '#90A4AE',
        },
        motion: {
            rotationMultiplier: 1.0,
            inertia: 0.8,
            rhythm: 'solid',
            anticipationScale: 1.0,
        }
    },
    {
        id: 'alarmas',
        name: 'ALARMAS',
        description: 'Sistemas electrónicos de vigilancia activa.',
        cta: 'VER ESPECIFICACIONES',
        colors: {
            // Petroleum Blue / Tech
            primary: '#607D8B',
            secondary: '#121212',
            background: '#080808',
            text: '#E0E0E0',
            brandingX: '#607D8B',
        },
        motion: {
            rotationMultiplier: 1.0,
            inertia: 0.8,
            rhythm: 'nervous',
            anticipationScale: 1.0,
        }
    },
    {
        id: 'gps',
        name: 'GPS TRACKER',
        description: 'Telemetría y rastreo satelital de precisión.',
        cta: 'VER ESPECIFICACIONES',
        colors: {
            // Signal Green (Muted)
            primary: '#2E7D32',
            secondary: '#121212',
            background: '#080808',
            text: '#E0E0E0',
            brandingX: '#2E7D32',
        },
        motion: {
            rotationMultiplier: 1.0,
            inertia: 0.8,
            rhythm: 'precise',
            anticipationScale: 1.0,
        }
    },
];
