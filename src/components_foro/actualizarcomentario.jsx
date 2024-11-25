import React, { useState } from 'react';
import { Pencil, Save, X, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const MAX_CHARS = 70;

const CommentEdit = ({ commentId, initialContent, onUpdateSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const getCharacterCountColor = () => {
        if (content.length > MAX_CHARS) return 'text-red-500';
        if (content.length > MAX_CHARS * 0.9) return 'text-yellow-500';
        return 'text-gray-500';
    };

    const handleEdit = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
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

    const handleCancel = () => {
        setIsEditing(false);
        setContent(initialContent);
        setError('');
    };

    return (
        <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg">
            {isEditing ? (
                <div className="space-y-2">
                    <div className="relative">
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            className="w-full p-3 border rounded-lg resize-y min-h-[100px]
                                     bg-white dark:bg-gray-700
                                     text-gray-900 dark:text-gray-100
                                     border-gray-300 dark:border-gray-600
                                     focus:ring-2 focus:ring-[#0092BC] focus:border-[#0092BC]
                                     placeholder-gray-500 dark:placeholder-gray-400"
                            disabled={isLoading}
                            maxLength={MAX_CHARS + 1}
                            placeholder="Escribe tu comentario aquí..."
                        />
                        <div className={`text-right text-sm mt-1 ${getCharacterCountColor()}`}>
                            {content.length}/{MAX_CHARS} caracteres
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={handleEdit}
                            disabled={isLoading || content.length > MAX_CHARS}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg
                                     bg-[#0092BC] hover:bg-[#007a9e]
                                     text-white disabled:opacity-50
                                     disabled:bg-gray-300 dark:disabled:bg-gray-600"
                        >
                            <Save size={16} />
                            <span>Guardar</span>
                        </button>

                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg
                                     bg-gray-100 dark:bg-gray-700
                                     text-gray-700 dark:text-gray-200
                                     hover:bg-gray-200 dark:hover:bg-gray-600
                                     disabled:opacity-50"
                        >
                            <X size={16} />
                            <span>Cancelar</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-2 p-2">
                    <p className="flex-1 text-gray-900 dark:text-gray-100">
                        {content}
                    </p>
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 px-2 py-1
                                 text-[#0092BC] hover:text-[#007a9e]
                                 transition-colors duration-300
                                 bg-transparent border-none outline-none"
                        aria-label="Editar comentario"
                    >
                        <Pencil size={19} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentEdit;