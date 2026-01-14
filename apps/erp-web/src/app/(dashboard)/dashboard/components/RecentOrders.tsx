'use client';

// Mock data
const recentOrders = [
    {
        id: 'ORD-202401-0001',
        customer: 'MotoSport X',
        status: 'En Progreso',
        dueDate: '2024-01-20',
        amount: '$1,200',
    },
    {
        id: 'ORD-202401-0002',
        customer: 'Racing Team A',
        status: 'Pendiente',
        dueDate: '2024-01-22',
        amount: '$3,500',
    },
    {
        id: 'ORD-202401-0003',
        customer: 'Distribuidora Norte',
        status: 'Completado',
        dueDate: '2024-01-15',
        amount: '$850',
    },
];

export function RecentOrders() {
    return (
        <div className="space-y-8">
            {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">
                            {order.id}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">{order.amount}</div>
                    <div className={`ml-4 text-xs px-2 py-1 rounded-full ${order.status === 'Completado' ? 'bg-green-100 text-green-700' :
                            order.status === 'En Progreso' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.status}
                    </div>
                </div>
            ))}
        </div>
    );
}
