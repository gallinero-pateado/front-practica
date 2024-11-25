import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const CrearTemaForm = ({ onClose, onTemaCreado }) => {
    const [tema, setTema] = useState({
        titulo: '',
        descripcion: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [theme, setTheme] = useState('light');

    const MAX_TITULO_LENGTH = 60; // Límite de caracteres para el título
    const MAX_DESCRIPCION_LENGTH = 80; // Límite de caracteres para la descripción

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (!token) {
            setIsAuthenticated(false);
        }

        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        const handleThemeChange = () => {
            const currentTheme = Cookies.get('theme') || 'light';
            setTheme(currentTheme);
        };

        const interval = setInterval(handleThemeChange, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validar límites de caracteres antes de actualizar el estado
        if (name === 'titulo' && value.length > MAX_TITULO_LENGTH) return;
        if (name === 'descripcion' && value.length > MAX_DESCRIPCION_LENGTH) return;

        setTema(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const token = Cookies.get('authToken');

        if (!token) {
            setError('Debes iniciar sesión para crear un tema');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/temas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(tema)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setError('Sesión expirada. Por favor, vuelve a iniciar sesión.');
                    Cookies.remove('authToken');
                    setIsAuthenticated(false);
                } else {
                    throw new Error(data.error || 'Error al crear el tema');
                }
                return;
            }

            if (onTemaCreado) {
                onTemaCreado(data);
            }
            onClose();

            setTema({
                titulo: '',
                descripcion: ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#A3D9D3] p-6 mb-6">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</p>
                    <a
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-[#7B4B94] text-white rounded-md hover:opacity-90 transition-opacity"
                    >
                        Iniciar Sesión
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-lg shadow-sm p-6 mb-6 transition-colors duration-300
            ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-[#A3D9D3]'}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold transition-colors
                    ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D4157]'}`}>
                    Crear Nuevo Tema
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="titulo"
                        className={`block text-sm font-medium mb-1 transition-colors
                            ${theme === 'dark' ? 'text-gray-300' : 'text-[#1D4157]'}`}>
                        Título ({tema.titulo.length}/{MAX_TITULO_LENGTH})
                    </label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={tema.titulo}
                        onChange={handleChange}
                        maxLength={MAX_TITULO_LENGTH}
                        required
                        className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-[#0092BC] min-h-[50px] resize-y transition-colors duration-300
                            ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                                : 'bg-white border-gray-300 text-[#1D4157]'}`}
                        placeholder="Escribe el título del tema"
                    />
                </div>

                <div>
                    <label
                        htmlFor="descripcion"
                        className={`block text-sm font-medium mb-1 transition-colors
                            ${theme === 'dark' ? 'text-gray-300' : 'text-[#1D4157]'}`}>
                        Descripción ({tema.descripcion.length}/{MAX_DESCRIPCION_LENGTH})
                    </label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={tema.descripcion}
                        onChange={handleChange}
                        maxLength={MAX_DESCRIPCION_LENGTH}
                        required
                        rows="4"
                        className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-[#0092BC] min-h-[100px] resize-y transition-colors duration-300
                            ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                                : 'bg-white border-gray-300 text-[#1D4157]'}`}
                        placeholder="Describe el tema"
                    />
                </div>

                {error && (
                    <div className={`text-sm p-2 rounded-md ${theme === 'dark'
                        ? 'bg-red-900/50 text-red-400'
                        : 'bg-red-50 text-red-500'}`}>
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#7B4B94] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <PlusCircle className="w-4 h-4" />
                        {loading ? 'Creando...' : 'Crear Tema'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearTemaForm;
