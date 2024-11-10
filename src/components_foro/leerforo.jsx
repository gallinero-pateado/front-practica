import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Edit, Reply } from 'lucide-react';
import CrearTemaForm from './creartema';

const TemasList = () => {
    const [temas, setTemas] = useState([]);
    const [comentariosPorTema, setComentariosPorTema] = useState({});
    const [temasExpandidos, setTemasExpandidos] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Obtener los temas y ordenarlos de más reciente a más antiguo
    const fetchTemas = async () => {
        try {
            const response = await fetch('http://localhost:8080/temas');
            if (!response.ok) throw new Error('Error al cargar los temas');
            const data = await response.json();
            // Ordenar los temas por la fecha de creación, del más reciente al más antiguo
            data.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
            setTemas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemas();
    }, []);

    // Obtener los comentarios de un tema y ordenarlos del más antiguo al más reciente
    const cargarComentarios = async (temaId) => {
        if (comentariosPorTema[temaId]) return;

        try {
            const response = await fetch(`http://localhost:8080/temas/${temaId}/comentarios`);
            if (!response.ok) throw new Error('Error al cargar los comentarios');
            const data = await response.json();
            // Ordenar los comentarios del más antiguo al más reciente
            data.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));
            setComentariosPorTema(prev => ({
                ...prev,
                [temaId]: data
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    // Alternar la visibilidad de los comentarios
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

    const handleEliminar = (e, comentarioId) => {
        e.stopPropagation();
        console.log('Eliminar comentario:', comentarioId);
    };

    const handleEditar = (e, comentarioId) => {
        e.stopPropagation();
        console.log('Editar comentario:', comentarioId);
    };

    const handleResponder = (e, comentarioId) => {
        e.stopPropagation();
        console.log('Responder a comentario:', comentarioId);
    };

    const handleTemaCreado = (nuevoTema) => {
        setTemas(prev => [nuevoTema, ...prev]);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg">Cargando temas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Foro de Discusión</h1>

            <CrearTemaForm
                onClose={() => { }}
                onTemaCreado={handleTemaCreado}
            />

            <div className="space-y-4">
                {temas.map(tema => (
                    <div
                        key={tema.id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
                    >
                        <div className="flex items-center">
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold">{tema.titulo}</h2>
                                <p className="text-gray-600 mt-1">{tema.descripcion}</p>
                            </div>
                            <button
                                onClick={(e) => toggleComentarios(e, tema.id)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <MessageSquare className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {temasExpandidos[tema.id] && (
                            <div className="mt-4 space-y-3">
                                {comentariosPorTema[tema.id]?.length > 0 ? (
                                    comentariosPorTema[tema.id].map(comentario => (
                                        <div
                                            key={comentario.id}
                                            className="bg-gray-50 p-3 rounded-lg"
                                        >
                                            <p className="text-sm text-gray-600 mb-1">
                                                Por: {comentario.autor}
                                            </p>
                                            <p className="mb-3">{comentario.contenido}</p>
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={(e) => handleResponder(e, comentario.id)}
                                                    className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                                                >
                                                    <Reply className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleEditar(e, comentario.id)}
                                                    className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleEliminar(e, comentario.id)}
                                                    className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No hay comentarios en este tema.</p>
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
