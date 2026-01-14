'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { socketClient } from '@/lib/socket/client';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextType {
    isConnected: boolean;
    emit: (event: string, data: any) => void;
    on: (event: string, callback: Function) => void;
    off: (event: string, callback?: Function) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const queryClient = useQueryClient();
    const [isConnected, setIsConnected] = React.useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // @ts-ignore
            const token = session.accessToken as string || 'mock-token';
            socketClient.connect(token);

            socketClient.on('connect', () => setIsConnected(true));
            socketClient.on('disconnect', () => setIsConnected(false));

            // Invalidar consultas cuando se reciban actualizaciones en tiempo real
            socketClient.on('production:order-created', () => {
                queryClient.invalidateQueries({ queryKey: ['production'] });
            });

            socketClient.on('inventory:updated', () => {
                queryClient.invalidateQueries({ queryKey: ['inventory'] });
            });

            return () => {
                socketClient.disconnect();
            };
        }
    }, [session, status, queryClient]);

    const value = {
        isConnected,
        emit: socketClient.emit.bind(socketClient),
        on: socketClient.on.bind(socketClient),
        off: socketClient.off.bind(socketClient),
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
