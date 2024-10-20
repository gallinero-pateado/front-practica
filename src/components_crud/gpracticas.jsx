import React, { useState } from 'react';
import Cpractica from './cpractica';
import Dpractica from './dpractica';

const Gpracticas = () => {
    const [activeComponent, setActiveComponent] = useState('lista'); // "lista", "crear"

    const renderComponent = () => {
        switch (activeComponent) {
            case 'crear':
                return <Cpractica />;
            case 'lista':
            default:
                return <Dpractica />;
        }
    };

    return (
        <div className="container mx-auto p-4 bg-[#DAEDF2] font-ubuntu">
            <h1 className="text-3xl font-bold mb-4">Gestión de Prácticas</h1>
            <div className="mb-4">
                <button
                    onClick={() => setActiveComponent('lista')}
                    className="mr-2 px-4 py-2 bg-[#0092BC] text-white rounded transition-colors duration-300 hover:bg-[#A3D9D3]"
                >
                    Ver Prácticas
                </button>
                <button
                    onClick={() => setActiveComponent('crear')}
                    className="px-4 py-2 bg-[#A3D9D3] text-white rounded transition-colors duration-300 hover:bg-[#0092BC]"
                >
                    Crear Práctica
                </button>
            </div>
            {renderComponent()}
        </div>
    );
};

export default Gpracticas;
