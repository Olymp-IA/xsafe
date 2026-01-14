'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    Settings,
    Users,
    BarChart,
    Truck,
    ClipboardCheck,
    Factory
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Producción', href: '/production', icon: Factory },
    { name: 'Inventario', href: '/inventory', icon: Package },
    { name: 'Calidad', href: '/quality', icon: ClipboardCheck },
    { name: 'Máquinas', href: '/machines', icon: Settings },
    { name: 'Envíos', href: '/logistics', icon: Truck },
    { name: 'Reportes', href: '/reports', icon: BarChart },
    { name: 'Usuarios', href: '/users', icon: Users },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800">
            <div className="flex h-16 items-center px-6">
                <h1 className="text-xl font-bold text-white">
                    xSafe <span className="text-primary">ERP</span>
                </h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'mr-3 h-5 w-5 flex-shrink-0',
                                    isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-gray-800 p-4">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">JD</span>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Juan Doe</p>
                        <p className="text-xs text-gray-500">Administrador</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
