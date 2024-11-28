import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const PostulacionPractica = ({ practicaId, onPostulacionExitosa }) => {
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);
    }, []);

    // Observar cambios en el atributo data-theme del documento
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    const themeColors = {
        light: {
            background: 'bg-white',
            headerBg: 'bg-gray-50',
            text: 'text-gray-800',
            inputBg: 'bg-white',
            inputText: 'text-gray-700',
            inputBorder: 'border-[#0092BC]',
        },
        dark: {
            background: 'bg-gray-800',
            headerBg: 'bg-gray-900',
            text: 'text-white',
            inputBg: 'bg-gray-700',
            inputText: 'text-white',
            inputBorder: 'border-blue-400',
        }
    };

    const currentTheme = themeColors[theme];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const authToken = Cookies.get('authToken');
            if (!authToken) {
                throw new Error('No se encontró el token de autenticación');
            }
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await axios.post(`${API_URL}/postulacion-practicas/${practicaId}`, {
                mensaje
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 200) {
                setSuccess('Postulación enviada con éxito');
                setMensaje('');
                setTimeout(() => {
                    onPostulacionExitosa();
                }, 2000);
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setError('No estás autorizado. Por favor, inicia sesión nuevamente.');
                        // Limpiar cookies en caso de error de autenticación
                        Cookies.remove('authToken', { path: '/' });
                        Cookies.remove('uid', { path: '/' });
                        break;
                    case 409:
                        setError('Ya has postulado a esta práctica anteriormente.');
                        break;
                    default:
                        setError(error.response.data.error || 'Error al enviar la postulación');
                }
            } else if (error.request) {
                setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else {
                setError('Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${currentTheme.background} rounded-lg overflow-hidden transition-colors duration-300`}>
            <div className={`px-4 py-2 ${currentTheme.headerBg}`}>
                <h2 className={`text-xl font-semibold ${currentTheme.text}`}>Postular a Práctica</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
                <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Escribe tu mensaje de postulación aquí"
                    required
                    maxLength={150}
                    className={`w-full px-3 py-2 ${currentTheme.inputText} ${currentTheme.inputBg} border-2 ${currentTheme.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A3D9D3] transition-all duration-300`}
                    rows="4"
                />
                {error && (
                    <div className="mt-2 flex items-center text-red-500">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mt-2 flex items-center text-green-500">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>{success}</span>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-4 w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${theme === 'dark' ? 'bg-[#0092BC] hover:bg-[#A3D9D3]' : 'bg-[#0092BC] hover:bg-[#A3D9D3]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0092BC] ${loading ? 'opacity-50 cursor-not-allowed' : ''} transition-colors duration-300`}
                >
                    {loading ? (
                        'Enviando...'
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            Enviar Postulación
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default PostulacionPractica;