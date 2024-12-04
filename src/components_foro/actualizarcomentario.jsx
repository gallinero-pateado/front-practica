import React, { useState } from 'react';
import { Pencil, Save, X, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const MAX_CHARS = 70;

const CommentEdit = ({ commentId, initialContent, onUpdateSuccess, theme }) => {
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
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(`${API_URL}/comentarios/${commentId}`, {
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
        <div className={`rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 transition-colors duration-300
            ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-[#A3D9D3]'}`}>
            {isEditing ? (
                <form className="space-y-4">
                    <div>
                        <label
                            className={`block text-sm font-medium mb-1 transition-colors
                                ${theme === 'dark' ? 'text-gray-300' : 'text-[#1D4157]'}`}>
                            Comentario ({content.length}/{MAX_CHARS})
                        </label>
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            maxLength={MAX_CHARS}
                            disabled={isLoading}
                            className={`w-full p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-[#0092BC] min-h-[100px] resize-y transition-colors duration-300
                                ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-[#1D4157]'}`}
                            placeholder="Escribe tu comentario aquí..."
                            style={{ wordBreak: 'break-word' }}
                        />
                        <div className={`text-right text-sm mt-1 ${getCharacterCountColor()}`}>
                            {content.length}/{MAX_CHARS} caracteres
                        </div>
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
                            type="button"
                            onClick={handleEdit}
                            disabled={isLoading || content.length > MAX_CHARS}
                            className="flex items-center gap-2 px-4 py-2 bg-[#7B4B94] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-md transition-colors
                                ${theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                    : 'bg-gray-100 text-[#1D4157] hover:bg-gray-200'}`}
                        >
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex items-start gap-2">
                    <p className={`flex-1 transition-colors break-words
                        ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D4157]'}`}
                        style={{ wordBreak: 'break-word' }}>
                        {content}
                    </p>
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 px-2 py-1
                                 text-[#7B4B94] hover:text-opacity-80
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