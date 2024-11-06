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
        <div className="container mx-auto p-4 bg-[#DAEDF2] font-ubuntu max-w-lg md:max-w-2xl lg:max-w-3xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">Gestión de Prácticas</h1>
            <div className="mb-4 flex flex-col md:flex-row justify-center">
                <button
                    onClick={() => setActiveComponent('lista')}
                    className="mr-0 md:mr-2 mb-2 md:mb-0 px-4 py-2 bg-[#0092BC] text-white rounded transition-colors duration-300 hover:bg-[#A3D9D3] focus:outline-none focus:ring-2 focus:ring-[#005F7F]"
                >
                    Ver Prácticas
                </button>
                <button
                    onClick={() => setActiveComponent('crear')}
                    className="px-4 py-2 bg-[#A3D9D3] text-white rounded transition-colors duration-300 hover:bg-[#0092BC] focus:outline-none focus:ring-2 focus:ring-[#005F7F]"
                >
                    Crear Práctica
                </button>
            </div>
            <div className="w-full">{renderComponent()}</div>
        </div>
    );
};

export default Gpracticas;
