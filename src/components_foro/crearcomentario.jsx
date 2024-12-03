import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Cookies from 'js-cookie';


const CrearComentario = ({ temaId, onComentarioCreado, theme }) => {
    const [contenido, setContenido] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const maxCaracteres = 70;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Retrieve token from cookies instead of localStorage
            const token = Cookies.get('authToken');

            if (!token) {
                throw new Error('No estás autenticado');
            }
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(`${API_URL}/temas/${temaId}/comentarios`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contenido,
                    fechaCreacion: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Handle unauthorized access by removing token
                if (response.status === 401) {
                    Cookies.remove('authToken');
                }
                throw new Error(errorData.error || 'Error al crear el comentario');
            }

            const nuevoComentario = await response.json();
            setContenido('');
            if (onComentarioCreado) {
                onComentarioCreado({
                    ...nuevoComentario,
                    fechaCreacion: new Date()
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = (token) => {
        // Set secure, SameSite cookie with appropriate configurations
        Cookies.set('authToken', token, {
            expires: 7, // Token expires in 7 days
            secure: true, // Only send cookie over HTTPS
            sameSite: 'strict' // Prevent CSRF attacks
        });
    };

    // Helper function to handle logout
    const handleLogout = () => {
        // Remove the authentication cookie
        Cookies.remove('authToken');
    };

    return (
        <div className="mt-4 mb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                    <textarea
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        placeholder="Escribe tu comentario..."
                        maxLength={maxCaracteres} // Límite de caracteres
                        className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-[#0092BC]
                            transition-colors duration-300
                            ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                                : 'bg-white border-gray-300 text-[#1D4157]'}`}
                        disabled={isSubmitting}
                    />
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {contenido.length}/{maxCaracteres} caracteres
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg
                            transition-colors duration-300
                            ${isSubmitting
                                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                                : 'bg-[#0092BC] hover:bg-[#007a9e] dark:bg-[#0092BC] dark:hover:bg-[#007a9e] text-white'
                            }`}
                    >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Enviando...' : 'Enviar comentario'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearComentario;