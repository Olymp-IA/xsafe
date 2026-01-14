# Monitor de Planta (Workshop Monitor)

Aplicación React diseñada para pantallas de gran formato (TVs) ubicadas en la planta de producción. Proporciona visualización en tiempo real de métricas clave (KPIs), estado de maquinaria y alertas críticas.

## Características

*   **Visualización de Alto Contraste**: Diseñada para ser legible a distancia.
*   **Tiempo Real**: Consumo de eventos via Socket.io.
*   **Métricas OEE**: Cálculo y visualización de eficiencia operativa.
*   **Alertas Visuales**: Indicadores de estado de maquinaria claros (Semáforo).

## Stack Tecnológico

*   **Core**: React 18, Vite.
*   **UI**: Tailwind CSS, @xsafe/ui-kit.
*   **Gráficos**: Recharts.
*   **Comunicación**: Socket.io Client.

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Configuración

La aplicación espera conectarse al backend en el puerto `3001` por defecto. Esto puede configurarse mediante variables de entorno `VITE_API_URL`.
