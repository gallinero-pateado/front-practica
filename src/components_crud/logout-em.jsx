import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imagen2 from '../imagen/imagen2.png';

const LogoutEm = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Tokens antes de eliminar:', {
            authToken: localStorage.getItem('authToken'),
            uid: localStorage.getItem('uid')
        });

        localStorage.removeItem('authToken');
        localStorage.removeItem('uid');

        console.log('Tokens después de eliminar:', {
            authToken: localStorage.getItem('authToken'),
            uid: localStorage.getItem('uid')
        });

        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#DAEDF2]"> {/* Color de fondo */}
            <img
                src={imagen2}
                alt="Descripción de la imagen"
                className="mb-6 w-1/3 h-auto rounded-md shadow-md" // Añadido estilo para bordes redondeados y sombra
            />
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Rubik' }}>Has cerrado sesión</h2>
            <p className="mb-4" style={{ fontFamily: 'Ubuntu' }}>Gracias por usar ULINK. Esperamos verte pronto.</p>
            <button
                onClick={() => navigate('/')} // Redirección inmediata al hacer clic
                className="px-6 py-2 bg-[#0092BC] text-white rounded-md hover:bg-[#A3D9D3] transition-colors shadow-sm" // Color y estilo consistente
            >
                Volver al inicio
            </button>
        </div>
    );
};

export default LogoutEm;
