import React, { useState } from 'react';
import { Send } from 'lucide-react';

const CrearComentario = ({ temaId, onComentarioCreado }) => {
    const [contenido, setContenido] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('authToken');

            if (!token) {
                throw new Error('No estás autenticado');
            }

            const response = await fetch(`http://localhost:8080/temas/${temaId}/comentarios`, {
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

    return (
        <div className="mt-4 mb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                    <textarea
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        placeholder="Escribe tu comentario..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-y bg-white"
                        disabled={isSubmitting}
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !contenido.trim()}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              ${isSubmitting || !contenido.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }
              transition-colors
            `}
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