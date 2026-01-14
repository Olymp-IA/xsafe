import { QuickStats } from './components/QuickStats';
import { ProductionChart } from './components/ProductionChart';
import { RecentOrders } from './components/RecentOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Welcome header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Buenos días, <span className="text-primary">Juan Pérez</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Aquí tienes el resumen de producción de hoy.
                </p>
            </div>

            <QuickStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5" />
                            Producción esta semana
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ProductionChart />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Órdenes Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentOrders />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
