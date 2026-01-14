import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    environment: process.env.NODE_ENV,
    integrations: [
        new Sentry.BrowserTracing({
            tracePropagationTargets: [
                'localhost',
                /^https:\/\/api\.xsafe\.com/,
                /^https:\/\/erp\.xsafe\.com/,
            ],
        }),
        new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampler: (samplingContext) => {
        // Muestrear el 10% de las transacciones en producción
        if (process.env.NODE_ENV === 'production') {
            return 0.1;
        }
        // Muestrear el 100% en desarrollo/staging para debugging
        return 1.0;
    },
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event, hint) {
        // Filtrar eventos sensibles
        if (event.request?.url) {
            // Eliminar tokens de las URLs
            event.request.url = event.request.url.replace(
                /(access_token|token|password)=[^&]+/g,
                '$1=***'
            );
        }

        // Eliminar datos sensibles del contexto del usuario
        if (event.user) {
            delete event.user.ip_address;
        }

        return event;
    },
});

// Función helper para capturar errores en componentes React
export function captureError(error: Error, context?: any) {
    Sentry.captureException(error, {
        extra: context,
    });

    // También registrar en consola en desarrollo
    if (process.env.NODE_ENV === 'development') {
        console.error('Error capturado:', error, context);
    }
}
