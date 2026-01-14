'use client';

import { Bell, Search, User } from 'lucide-react';

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div className="flex items-center">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="h-9 w-64 rounded-md border border-gray-200 pl-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-500 hover:text-gray-700">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
            </div>
        </header>
    );
}
