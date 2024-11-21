import React, { useState } from 'react';
import { Pencil, Save, X, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const CommentEdit = ({ commentId, initialContent, onUpdateSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Retrieve token from cookies instead of localStorage
            const token = Cookies.get('authToken');

            if (!token) {
                throw new Error('No estás autenticado');
            }

            const response = await fetch(`http://localhost:8080/comentarios/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    contenido: content,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                // Handle unauthorized access by removing token
                if (response.status === 401) {
                    Cookies.remove('authToken');
                    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                }

                throw new Error(errorData.error || 'Error al actualizar el comentario');
            }

            const updatedComment = await response.json();
            setIsEditing(false);
            if (onUpdateSuccess) {
                onUpdateSuccess(updatedComment);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
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

    const handleCancel = () => {
        setIsEditing(false);
        setContent(initialContent);
        setError('');
    };

    return (
        <div className="relative">
            {isEditing ? (
                <div className="space-y-2">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 border rounded-lg resize-y min-h-[100px]
                                 transition-colors duration-300
                                 bg-white dark:bg-gray-800
                                 text-black dark:text-white
                                 border-gray-300 dark:border-gray-600
                                 focus:ring-2 focus:ring-[#0092BC] focus:border-[#0092BC]
                                 dark:focus:ring-[#0092BC] dark:focus:border-[#0092BC]"
                        disabled={isLoading}
                    />

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={handleEdit}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg
                                      transition-colors duration-300
                                      ${isLoading
                                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                                    : 'bg-[#0092BC] hover:bg-[#007a9e] dark:bg-[#0092BC] dark:hover:bg-[#007a9e]'
                                }
                                      text-white disabled:opacity-50`}
                        >
                            <Save size={16} />
                            <span>Guardar</span>
                        </button>

                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg
                                      transition-colors duration-300
                                      bg-gray-200 dark:bg-gray-700
                                      text-gray-700 dark:text-gray-200
                                      hover:bg-gray-300 dark:hover:bg-gray-600
                                      disabled:opacity-50`}
                        >
                            <X size={16} />
                            <span>Cancelar</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-2">
                    <p className="flex-1 text-black dark:text-white transition-colors duration-300">
                        {content}
                    </p>
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 px-2 py-1
                                 text-[#0092BC] dark:text-[#0092BC]
                                 hover:text-[#007a9e] dark:hover:text-[#007a9e]
                                 transition-colors duration-300
                                 bg-transparent border-none outline-none shadow-none"
                    >
                        <Pencil size={19} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentEdit;