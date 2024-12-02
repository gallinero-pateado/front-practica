import { Reply, Send, X } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const ReplyComment = ({ temaId, comentarioPadreId, onComentarioCreado }) => {
    const [contenido, setContenido] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const maxCaracteres = 80;

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        // Escuchar cambios en el tema
        const handleThemeChange = () => {
            const currentTheme = Cookies.get('theme') || 'light';
            setTheme(currentTheme);
        };

        const interval = setInterval(handleThemeChange, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contenido.trim()) {
            setError('La respuesta no puede estar vacía');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Retrieve token from cookies instead of localStorage
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('No estás autenticado');
            }
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(`${API_URL}/comentarios/${temaId}/respuesta?comentario_padre_id=${comentarioPadreId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    contenido: contenido
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al responder al comentario');
            }

            const nuevaRespuesta = await response.json();
            setContenido('');
            setError('');

            if (onComentarioCreado) {
                onComentarioCreado(nuevaRespuesta);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // New function to handle login and token storage
    const handleLogin = (token) => {
        // Set secure, SameSite cookie with appropriate configurations
        Cookies.set('authToken', token, {
            expires: 7, // Token expires in 7 days
            secure: true, // Only send cookie over HTTPS
            sameSite: 'strict' // Prevent CSRF attacks
        });
    };

    // New function to handle logout
    const handleLogout = () => {
        // Remove the authentication cookie
        Cookies.remove('authToken');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 p-3 sm:p-6">
            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D4157]'
                }`}>
                <Reply className="w-4 h-4" />
                <span>Responder al comentario</span>
            </div>

            <div className="relative">
                <textarea
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    maxLength={maxCaracteres} // Límite de caracteres
                    className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#0092BC] focus:border-[#0092BC] text-sm transition-colors duration-300
                ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                            : 'bg-white border-gray-300 text-[#1D4157] placeholder-gray-500'
                        }
                sm:text-base sm:p-3`}
                    rows={3}
                />
                {contenido && (
                    <button
                        type="button"
                        onClick={() => setContenido('')}
                        className={`absolute top-2 right-2 ${theme === 'dark'
                            ? 'text-gray-400 hover:text-gray-300'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
                <div className="text-right text-xs mt-1 text-gray-500 dark:text-gray-400">
                    {contenido.length}/{maxCaracteres} caracteres
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-xs">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-1 px-3 py-1 text-white text-sm rounded
                disabled:opacity-50 transition-colors
                bg-[#7B4B94] hover:bg-[#6a417f]`}
                >
                    <Send className="w-3 h-3" />
                    {loading ? 'Enviando...' : 'Responder'}
                </button>
            </div>
        </form>
    );
};

export default ReplyComment;