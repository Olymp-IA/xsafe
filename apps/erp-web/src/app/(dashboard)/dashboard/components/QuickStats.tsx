'use client';

import { TrendingUp, Users, Package, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function QuickStats() {
    // En un caso real, estos datos vendrían de una API o hook
    const stats = [
        {
            title: "Órdenes Activas",
            value: "24",
            description: "+2 desde ayer",
            icon: TrendingUp,
            color: "text-blue-500",
        },
        {
            title: "Eficiencia General",
            value: "92%",
            description: "+4% mes anterior",
            icon: Users,
            color: "text-green-500",
        },
        {
            title: "Stock Bajo",
            value: "7",
            description: "Items requieren atención",
            icon: AlertCircle,
            color: "text-red-500",
        },
        {
            title: "Producción Total",
            value: "156",
            description: "Unidades este mes",
            icon: Package,
            color: "text-purple-500",
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
