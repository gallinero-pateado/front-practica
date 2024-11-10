import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Edit, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import CrearTemaForm from './creartema';
import CommentEdit from './actualizarcomentario';
import CrearComentario from './crearcomentario';

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

    // Ordenar las respuestas por fecha de creación (más antiguas primero)
    const respuestasOrdenadas = comentario.respuestas?.sort(
        (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
    );

    return (
        <div className={`rounded-lg ${nivel > 0 ? 'ml-6 mt-2' : ''}`}>
            <div className={`bg-gray-50 p-3 rounded-lg ${nivel > 0 ? 'border-l-2 border-blue-200' : ''}`}>
                <div className="mb-2">
                    <p className="text-sm text-gray-600">
                        Por: {comentario.autor}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(comentario.fechaCreacion).toLocaleString()}
                    </p>
                </div>

                <CommentEdit
                    commentId={comentario.id}
                    initialContent={comentario.contenido}
                    onUpdateSuccess={onUpdateSuccess}
                />

                <div className="flex gap-2 justify-end mt-2">
                    <button
                        onClick={handleResponderClick}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                        title="Responder"
                    >
                        <Reply className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => onEliminar(e, comentario.id)}
                        className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    {respuestasOrdenadas?.length > 0 && (
                        <button
                            onClick={() => setMostrarRespuestas(!mostrarRespuestas)}
                            className="p-1 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-50"
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
                <div className="ml-6 mt-2">
                    <CrearComentario
                        temaId={temaId}
                        parentId={comentario.id}
                        onComentarioCreado={(nuevoComentario) => {
                            onResponder(temaId, nuevoComentario, comentario.id);
                            setMostrarFormRespuesta(false);
                        }}
                    />
                </div>
            )}

            {mostrarRespuestas && respuestasOrdenadas?.length > 0 && (
                <div className="space-y-2">
                    {respuestasOrdenadas.map(respuesta => (
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
    );
};

const TemasList = () => {
    const [temas, setTemas] = useState([]);
    const [comentariosPorTema, setComentariosPorTema] = useState({});
    const [temasExpandidos, setTemasExpandidos] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const organizarComentarios = (comentarios) => {
        // Primero ordenamos todos los comentarios por fecha (más antiguos primero)
        const comentariosOrdenados = [...comentarios].sort(
            (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
        );

        // Crear un mapa de todos los comentarios por ID
        const comentariosPorId = {};
        comentariosOrdenados.forEach(comentario => {
            comentariosPorId[comentario.id] = {
                ...comentario,
                respuestas: []
            };
        });

        // Organizar los comentarios en su estructura jerárquica
        const comentariosRaiz = [];
        comentariosOrdenados.forEach(comentario => {
            if (comentario.parentId) {
                const padre = comentariosPorId[comentario.parentId];
                if (padre) {
                    // Mantener el orden cronológico en las respuestas
                    padre.respuestas.push(comentariosPorId[comentario.id]);
                    padre.respuestas.sort((a, b) =>
                        new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
                    );
                }
            } else {
                comentariosRaiz.push(comentariosPorId[comentario.id]);
            }
        });

        // Ordenar los comentarios raíz por fecha (más antiguos primero)
        comentariosRaiz.sort((a, b) =>
            new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
        );

        return comentariosRaiz;
    };

    const fetchTemas = async () => {
        try {
            const response = await fetch('http://localhost:8080/temas');
            if (!response.ok) {
                throw new Error('Error al cargar los temas');
            }
            let data = await response.json();
            // Ordenar temas por fecha de creación (más recientes primero)
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

            // Recargar los comentarios del tema actual para mantener la sincronización
            Object.keys(comentariosPorTema).forEach(temaId => {
                cargarComentarios(temaId);
            });

            alert('Comentario eliminado exitosamente');
        } catch (err) {
            setError(err.message);
            alert(err.message);
        }
    };

    const handleResponder = (temaId, nuevoComentario, parentId) => {
        cargarComentarios(temaId);
    };

    const handleComentarioActualizado = (temaId, comentarioActualizado) => {
        cargarComentarios(temaId);
    };

    const handleTemaCreado = (nuevoTema) => {
        setTemas(prev => [nuevoTema, ...prev]);
    };

    const handleComentarioCreado = (temaId, nuevoComentario) => {
        cargarComentarios(temaId);
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><p className="text-lg">Cargando temas...</p></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen"><p className="text-red-500">Error: {error}</p></div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Foro de Discusión</h1>

            <CrearTemaForm
                onClose={() => { }}
                onTemaCreado={handleTemaCreado}
            />

            <div className="space-y-4 mt-6">
                {temas.map(tema => (
                    <div
                        key={tema.id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold">{tema.titulo}</h2>
                                <p className="text-gray-600 mt-1">{tema.descripcion}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Creado el: {new Date(tema.fechaCreacion).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={(e) => toggleComentarios(e, tema.id)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Ver comentarios"
                            >
                                <MessageSquare className="w-5 h-5 text-gray-500" />
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
                                                onUpdateSuccess={(comentarioActualizado) =>
                                                    handleComentarioActualizado(tema.id, comentarioActualizado)
                                                }
                                                temaId={tema.id}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">
                                        No hay comentarios en este tema.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemasList;