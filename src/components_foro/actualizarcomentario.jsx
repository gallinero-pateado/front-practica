// CommentEdit.jsx
import React, { useState } from 'react';
import { Pencil, Save, X, AlertCircle } from 'lucide-react';

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
            const response = await fetch(`http://localhost:8080/comentarios/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    contenido: content,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
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
        <div className="relative">
            {isEditing ? (
                <div className="space-y-2">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded-md resize-y min-h-[100px]"
                        disabled={isLoading}
                    />

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={handleEdit}
                            disabled={isLoading}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                            <Save size={16} />
                            <span>Guardar</span>
                        </button>

                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                        >
                            <X size={16} />
                            <span>Cancelar</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-2">
                    <p className="flex-1">{content}</p>
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600"
                    >
                        <Pencil size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentEdit;