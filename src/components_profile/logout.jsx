import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imagen2 from '../imagen/imagen2.png';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Sesión cerrada');

        // Elimina el token de localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('uid'); // También podrías eliminar el uid si es necesario

        // Redirige a la página de inicio de sesión después de 10 segundos
        const timer = setTimeout(() => {
            navigate('/'); // Redirige a la página de inicio de sesión
        }, 5000);

        return () => clearTimeout(timer); // Limpia el timer al desmontar
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <img
                src={imagen2}
                alt="Descripción de la imagen"
                className="mb-4 w-1/3 h-auto"
            />
            <h2 className="text-3xl font-bold mb-4">Has cerrado sesión</h2>
            <p className="mb-4">Gracias por usar ULINK. Esperamos verte pronto.</p>
            <button
                onClick={() => navigate('/')} // Redirección inmediata al hacer clic
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Volver al inicio
            </button>
        </div>
    );
};

export default Logout;
