import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <h1 className="text-3xl font-bold mb-4">xSafe ERP Desktop</h1>
                <p className="mb-4">Bienvenido a la versión de escritorio.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Estado del Sistema</h2>
                        <div className="text-sm text-gray-400">
                            <p>Electron: {(window as any).versions?.electron}</p>
                            <p>Chrome: {(window as any).versions?.chrome}</p>
                            <p>Node: {(window as any).versions?.node}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
