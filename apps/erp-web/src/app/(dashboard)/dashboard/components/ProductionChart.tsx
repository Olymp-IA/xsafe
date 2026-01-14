'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Lun', produccion: 40, objetivo: 45 },
    { name: 'Mar', produccion: 35, objetivo: 45 },
    { name: 'Mie', produccion: 50, objetivo: 45 },
    { name: 'Jue', produccion: 48, objetivo: 45 },
    { name: 'Vie', produccion: 0, objetivo: 45 },
    { name: 'Sab', produccion: 0, objetivo: 30 },
];

export function ProductionChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="produccion" name="Producción Real" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="objetivo" name="Objetivo" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
