import React, { useState } from 'react';
import { Reply, Send, X } from 'lucide-react';

const ReplyComment = ({ temaId, comentarioPadreId, onComentarioCreado }) => {
    const [contenido, setContenido] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contenido.trim()) {
            setError('La respuesta no puede estar vacía');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No estás autenticado');
            }

            const response = await fetch(`http://localhost:8080/comentarios/${temaId}/respuesta?comentario_padre_id=${comentarioPadreId}`, {
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

    return (
        <div className="bg-[#DAEDF2] rounded-lg border-l-2 border-[#A3D9D3]">
            <form onSubmit={handleSubmit} className="space-y-3 p-3">
                <div className="flex items-center gap-2 text-sm text-[#1D4157]">
                    <Reply className="w-4 h-4" />
                    <span>Responder al comentario</span>
                </div>

                <div className="relative">
                    <textarea
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        placeholder="Escribe tu respuesta aquí..."
                        className="w-full p-2 border rounded-lg bg-white text-[#1D4157] focus:ring-1 focus:ring-[#0092BC] focus:border-[#0092BC] text-sm"
                        rows={3}
                    />
                    {contenido && (
                        <button
                            type="button"
                            onClick={() => setContenido('')}
                            className="absolute top-2 right-2 text-[#A3D9D3] hover:text-[#0092BC]"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
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
                        className="flex items-center gap-1 px-3 py-1 bg-[#7B4B94] text-white text-sm rounded disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-3 h-3" />
                        {loading ? 'Enviando...' : 'Responder'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReplyComment;