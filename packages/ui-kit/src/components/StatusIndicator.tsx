import React from 'react';

interface StatusIndicatorProps {
    status: 'active' | 'inactive' | 'error' | 'warning';
    label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
    const colors = {
        active: 'bg-green-500',
        inactive: 'bg-slate-300',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
    };

    return (
        <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${colors[status]} animate-pulse`} />
            {label && <span className="text-sm font-medium text-slate-600">{label}</span>}
        </div>
    );
};
