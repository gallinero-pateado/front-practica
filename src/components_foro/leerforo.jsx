import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Edit, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import CrearTemaForm from './creartema';
import CommentEdit from './actualizarcomentario';
import CrearComentario from './crearcomentario';
import ReplyComment from './respondercomentario';

// Función de utilidad para formatear fechas de forma segura
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            return 'Fecha no disponible';
        }
        return date.toLocaleString();
    } catch (error) {
        return 'Fecha no disponible';
    }
};

const Comentario = ({
    comentario,
    onEliminar,
    onResponder,
    onUpdateSuccess,
    nivel = 0,
    temaId
}) => {
    const [mostrarRespuestas, setMostrarRespuestas] = useState(true);
    const [mostrarFormRespuesta, setMostrarFormRespuesta] = useState(false);

    const handleResponderClick = (e) => {
        e.stopPropagation();
        setMostrarFormRespuesta(!mostrarFormRespuesta);
    };

    return (
        <div className="w-full">
            <div className={`
                rounded-lg 
                ${nivel > 0 ? 'ml-8 mt-2' : 'mt-2'}
                ${nivel > 0 ? 'border-l-2 border-[#A3D9D3]' : ''}
            `}>
                <div className="bg-white p-3 rounded-lg hover:bg-[#DAEDF2]/10 transition-colors">
                    <div className="mb-2">
                        <p className="text-sm text-[#1D4157] font-medium">
                            Por: {comentario.autor}
                        </p>
                        <p className="text-xs text-[#1D4157]/70">
                            {formatDate(comentario.fechaCreacion)}
                        </p>
                    </div>

                    <div className="mt-2 text-[#1D4157]">
                        <CommentEdit
                            commentId={comentario.id}
                            initialContent={comentario.contenido}
                            onUpdateSuccess={onUpdateSuccess}
                        />
                    </div>

                    <div className="flex gap-2 justify-end mt-2 items-center">
                        <button
                            onClick={handleResponderClick}
                            className="p-1 text-[#6B46C1] hover:text-[#6B46C1]/80 rounded-full hover:bg-[#6B46C1]/10 transition-colors"
                            title="Responder"
                        >
                            <Reply className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => onEliminar(e, comentario.id)}
                            className="p-1 text-[#FFD166] hover:text-[#FFD166]/80 rounded-full hover:bg-[#FFD166]/10 transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        {comentario.respuestas?.length > 0 && (
                            <button
                                onClick={() => setMostrarRespuestas(!mostrarRespuestas)}
                                className="p-1 text-[#0092BC] hover:text-[#0092BC]/80 rounded-full hover:bg-[#0092BC]/10 transition-colors"
                                title={mostrarRespuestas ? "Ocultar respuestas" : "Mostrar respuestas"}
                            >
                                {mostrarRespuestas ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {mostrarFormRespuesta && (
                    <div className="ml-8 mt-2">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                            <ReplyComment
                                temaId={temaId}
                                comentarioPadreId={comentario.id}
                                onComentarioCreado={(nuevoComentario) => {
                                    onResponder(temaId, nuevoComentario, comentario.id);
                                    setMostrarFormRespuesta(false);
                                }}
                            />
                        </div>
                    </div>
                )}

                {mostrarRespuestas && comentario.respuestas && comentario.respuestas.length > 0 && (
                    <div className="w-full">
                        {comentario.respuestas.map(respuesta => (
                            <Comentario
                                key={respuesta.id}
                                comentario={respuesta}
                                onEliminar={onEliminar}
                                onResponder={onResponder}
                                onUpdateSuccess={onUpdateSuccess}
                                nivel={nivel + 1}
                                temaId={temaId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const TemasList = () => {
    const [temas, setTemas] = useState([]);
    const [comentariosPorTema, setComentariosPorTema] = useState({});
    const [temasExpandidos, setTemasExpandidos] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const organizarComentarios = (comentarios) => {
        // Crear un mapa de todos los comentarios
        const comentariosPorId = new Map();

        // Inicializar cada comentario con un array vacío de respuestas
        comentarios.forEach(comentario => {
            comentariosPorId.set(comentario.id, {
                ...comentario,
                respuestas: []
            });
        });

        // Comentarios raíz (sin padre)
        const comentariosRaiz = [];

        // Organizar la estructura jerárquica
        comentarios.forEach(comentario => {
            const comentarioActual = comentariosPorId.get(comentario.id);

            if (comentario.parentId) {
                // Si tiene padre, agregar como respuesta al padre
                const padre = comentariosPorId.get(comentario.parentId);
                if (padre) {
                    padre.respuestas.push(comentarioActual);
                }
            } else {
                // Si no tiene padre, es un comentario raíz
                comentariosRaiz.push(comentarioActual);
            }
        });

        // Función recursiva para ordenar las respuestas por fecha
        const ordenarRespuestasPorFecha = (comentario) => {
            if (comentario.respuestas && comentario.respuestas.length > 0) {
                comentario.respuestas.sort((a, b) =>
                    new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
                );
                comentario.respuestas.forEach(ordenarRespuestasPorFecha);
            }
        };

        // Ordenar comentarios raíz y sus respuestas
        comentariosRaiz.sort((a, b) =>
            new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
        );
        comentariosRaiz.forEach(ordenarRespuestasPorFecha);

        return comentariosRaiz;
    };

    const fetchTemas = async () => {
        try {
            const response = await fetch('http://localhost:8080/temas');
            if (!response.ok) {
                throw new Error('Error al cargar los temas');
            }
            let data = await response.json();
            data.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
            setTemas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cargarComentarios = async (temaId) => {
        try {
            const response = await fetch(`http://localhost:8080/temas/${temaId}/comentarios`);
            if (!response.ok) {
                throw new Error('Error al cargar los comentarios');
            }
            let data = await response.json();
            const comentariosOrganizados = organizarComentarios(data);

            setComentariosPorTema(prev => ({
                ...prev,
                [temaId]: comentariosOrganizados
            }));
        } catch (err) {
            setComentariosPorTema(prev => ({
                ...prev,
                [temaId]: []
            }));
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchTemas();
    }, []);

    const toggleComentarios = async (e, temaId) => {
        e.stopPropagation();
        if (!temasExpandidos[temaId]) {
            await cargarComentarios(temaId);
        }
        setTemasExpandidos(prev => ({
            ...prev,
            [temaId]: !prev[temaId]
        }));
    };

    const handleEliminar = async (e, comentarioId) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No estás autenticado');
            }

            const response = await fetch(`http://localhost:8080/comentarios/${comentarioId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar el comentario');
            }

            // Recargar los comentarios de todos los temas expandidos
            Object.keys(temasExpandidos).forEach(temaId => {
                if (temasExpandidos[temaId]) {
                    cargarComentarios(temaId);
                }
            });

            alert('Comentario eliminado exitosamente');
        } catch (err) {
            setError(err.message);
            alert(err.message);
        }
    };

    const handleResponder = async (temaId) => {
        await cargarComentarios(temaId);
    };

    const handleComentarioActualizado = async (temaId) => {
        await cargarComentarios(temaId);
    };

    const handleTemaCreado = (nuevoTema) => {
        setTemas(prev => [nuevoTema, ...prev]);
    };

    const handleComentarioCreado = async (temaId) => {
        await cargarComentarios(temaId);
    };
    if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#DAEDF2]"><p className="text-[#1D4157] text-lg">Cargando temas...</p></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen bg-[#DAEDF2]"><p className="text-red-500">Error: {error}</p></div>;

    return (
        <div className="bg-[#DAEDF2] min-h-screen">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-[#1D4157]">Foro de Discusión</h1>
                <CrearTemaForm onClose={() => { }} onTemaCreado={handleTemaCreado} />
                <div className="space-y-4 mt-6">
                    {temas.map(tema => (
                        <div key={tema.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                    <h2 className="text-xl font-semibold text-[#1D4157]">{tema.titulo}</h2>
                                    <p className="text-[#1D4157]/80 mt-1">{tema.descripcion}</p>
                                    <p className="text-xs text-[#1D4157]/60 mt-1">
                                        Creado el: {formatDate(tema.fechaCreacion)}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => toggleComentarios(e, tema.id)}
                                    className="p-2 text-[#0092BC] hover:bg-[#0092BC]/10 rounded-full transition-colors"
                                    title="Ver comentarios"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                </button>
                            </div>

                            {temasExpandidos[tema.id] && (
                                <div className="mt-4 space-y-3">
                                    <CrearComentario
                                        temaId={tema.id}
                                        onComentarioCreado={(nuevoComentario) =>
                                            handleComentarioCreado(tema.id, nuevoComentario)
                                        }
                                    />

                                    {comentariosPorTema[tema.id]?.length > 0 ? (
                                        <div className="space-y-4">
                                            {comentariosPorTema[tema.id].map(comentario => (
                                                <Comentario
                                                    key={comentario.id}
                                                    comentario={comentario}
                                                    onEliminar={handleEliminar}
                                                    onResponder={handleResponder}
                                                    onUpdateSuccess={() => handleComentarioActualizado(tema.id)}
                                                    temaId={tema.id}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[#1D4157]/60 text-center py-4">
                                            No hay comentarios en este tema.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemasList;