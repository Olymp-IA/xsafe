import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Toaster } from 'sonner';
import { Providers } from '@/components/providers';
import '@/styles/globals.css';

export const metadata = {
    title: 'xSafe ERP | Dashboard',
    description: 'Sistema de gestión empresarial para producción de motocicletas',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className="bg-gray-50 antialiased font-sans">
                <Providers>
                    <div className="min-h-screen flex">
                        {/* Sidebar */}
                        <Sidebar />

                        {/* Main content */}
                        <div className="flex-1 flex flex-col h-screen overflow-hidden">
                            {/* Header */}
                            <Header />

                            {/* Breadcrumb */}
                            <div className="border-b bg-white">
                                <div className="container mx-auto px-6 py-3">
                                    <Breadcrumb />
                                </div>
                            </div>

                            {/* Page content */}
                            <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                                {children}
                            </main>

                            {/* Footer */}
                            <footer className="border-t bg-white">
                                <div className="container mx-auto px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                © {new Date().getFullYear()} xSafe ERP. Todos los derechos reservados.
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-gray-600">
                                                Versión 1.0.0
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-sm text-gray-600">Conectado</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </div>

                    {/* Toast notifications */}
                    <Toaster
                        position="bottom-right"
                        expand={true}
                        richColors
                        closeButton
                    />
                </Providers>
            </body>
        </html>
    );
}
