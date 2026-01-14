import React, { useState, useEffect } from 'react';
import { Card, Badge, StatusIndicator } from '@xsafe/ui-kit';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock Data
const PRODUCTION_DATA = [
    { name: '08:00', produced: 12, target: 15 },
    { name: '10:00', produced: 14, target: 15 },
    { name: '12:00', produced: 10, target: 15 },
    { name: '14:00', produced: 16, target: 15 },
    { name: '16:00', produced: 18, target: 15 },
];

const MACHINES = [
    { id: '1', name: 'CNC Cutter A1', status: 'active', temp: 65 },
    { id: '2', name: 'Welding Bot B2', status: 'warning', temp: 82 },
    { id: '3', name: 'Paint Booth C1', status: 'active', temp: 45 },
    { id: '4', name: 'Assembly Line', status: 'error', temp: 0 },
] as const;

function App() {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen p-8 flex flex-col gap-8">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        XSafe Factory Monitor
                    </h1>
                    <p className="text-slate-400 text-xl mt-1">Línea de Producción: Defensas Moto</p>
                </div>
                <div className="text-right">
                    <div className="text-6xl font-mono font-light">{time}</div>
                    <Badge variant="success">SISTEMA EN LINEA</Badge>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1">
                {/* Main Stats Area */}
                <div className="col-span-8 flex flex-col gap-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-6">
                        <Card className="bg-slate-800 border-slate-700">
                            <div className="text-slate-400 text-lg mb-2">OEE Global</div>
                            <div className="text-5xl font-bold text-green-400">87%</div>
                            <div className="text-sm text-slate-500 mt-2">↑ 2% vs ayer</div>
                        </Card>
                        <Card className="bg-slate-800 border-slate-700">
                            <div className="text-slate-400 text-lg mb-2">Producción Actual</div>
                            <div className="text-5xl font-bold text-blue-400">142</div>
                            <div className="text-sm text-slate-500 mt-2">Objetivo: 180</div>
                        </Card>
                        <Card className="bg-slate-800 border-slate-700">
                            <div className="text-slate-400 text-lg mb-2">Tasa de Rechazo</div>
                            <div className="text-5xl font-bold text-yellow-400">0.8%</div>
                            <div className="text-sm text-slate-500 mt-2">Dentro de tolerancia</div>
                        </Card>
                    </div>

                    {/* Chart */}
                    <Card className="bg-slate-800 border-slate-700 flex-1 flex flex-col" title="Rendimiento por Hora">
                        <div className="flex-1 w-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={PRODUCTION_DATA}>
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    />
                                    <Bar dataKey="produced" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                        {PRODUCTION_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.produced >= entry.target ? '#22c55e' : '#eab308'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Status */}
                <div className="col-span-4 flex flex-col gap-6">
                    <Card className="bg-slate-800 border-slate-700" title="Estado de Maquinaria">
                        <div className="flex flex-col gap-4">
                            {MACHINES.map((machine) => (
                                <div key={machine.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                    <div>
                                        <div className="font-medium text-lg">{machine.name}</div>
                                        <div className="text-sm text-slate-500">Temp: {machine.temp}°C</div>
                                    </div>
                                    <StatusIndicator status={machine.status} />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-red-900/20 border-red-900/50 flex-1 border-2 animate-pulse" title="¡ALERTAS ACTIVAS!">
                        <div className="space-y-4">
                            <div className="p-4 bg-red-900/40 rounded border border-red-500/30">
                                <div className="font-bold text-red-200 text-lg">⚠️ Assembly Line Detenida</div>
                                <div className="text-red-300">Fallo sensor de proximidad en sector 4.</div>
                                <div className="mt-2 text-sm text-red-400">Hace 12 minutos</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default App;
