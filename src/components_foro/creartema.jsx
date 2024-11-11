import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';

const CrearTemaForm = ({ onClose, onTemaCreado }) => {
    const [tema, setTema] = useState({
        titulo: '',
        descripcion: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setIsAuthenticated(false);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTema(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const token = localStorage.getItem('authToken');

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
                    localStorage.removeItem('authToken');
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
        <div className="bg-white rounded-lg shadow-sm border border-[#A3D9D3] p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#1D4157]">Crear Nuevo Tema</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-[#1D4157] mb-1">
                        Título
                    </label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={tema.titulo}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-[#A3D9D3] rounded-md text-[#1D4157] focus:outline-none focus:ring-2 focus:ring-[#0092BC]"
                        placeholder="Escribe el título del tema"
                    />
                </div>

                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-[#1D4157] mb-1">
                        Descripción
                    </label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={tema.descripcion}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-[#A3D9D3] rounded-md text-[#1D4157] focus:outline-none focus:ring-2 focus:ring-[#0092BC]"
                        placeholder="Describe el tema"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
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