import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const PostulantesList = ({ practicaId, theme = 'light' }) => {
    const [postulantes, setPostulantes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const themeColors = {
        light: {
            background: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-800',
            headerBg: 'bg-[#0092BC]',
            headerText: 'text-white',
            rowHover: 'hover:bg-[#DAEDF2]',
            error: 'text-red-600',
            loading: 'text-gray-600'
        },
        dark: {
            background: 'bg-gray-800',
            border: 'border-gray-700',
            text: 'text-gray-200',
            headerBg: 'bg-[#0092BC]',
            headerText: 'text-white',
            rowHover: 'hover:bg-gray-700',
            error: 'text-red-400',
            loading: 'text-gray-400'
        }
    };

    const currentTheme = themeColors[theme];

    useEffect(() => {
        const fetchPostulantes = async () => {
            try {
                const token = Cookies.get('authToken');

                if (!token) {
                    setError('No se encontró token de autenticación');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:8080/practicas/${practicaId}/postulaciones`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los postulantes');
                }

                const data = await response.json();
                setPostulantes(data.postulaciones);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (practicaId) {
            fetchPostulantes();
        }
    }, [practicaId]);

    if (loading) {
        return (
            <div className={`flex justify-center items-center p-8 ${currentTheme.loading}`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-4 rounded-lg bg-red-100 ${currentTheme.error}`}>
                {error}
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className={`text-xl font-bold mb-4 ${currentTheme.text}`}>
                Postulantes a la Práctica
            </h2>

            {postulantes.length === 0 ? (
                <p className={`p-4 text-center ${currentTheme.text} bg-opacity-50 rounded-lg ${currentTheme.background}`}>
                    No hay postulantes para esta práctica todavía
                </p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className={`min-w-full ${currentTheme.background}`}>
                        <thead className={currentTheme.headerBg}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme.headerText}`}>
                                    Nombre
                                </th>
                                <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme.headerText}`}>
                                    Correo
                                </th>
                                <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme.headerText}`}>
                                    Mensaje
                                </th>
                                <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme.headerText}`}>
                                    Fecha de Postulación
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {postulantes.map((postulante, index) => (
                                <tr
                                    key={index}
                                    className={`${currentTheme.rowHover} transition-colors duration-150`}
                                >
                                    <td className={`px-6 py-4 text-sm ${currentTheme.text}`}>
                                        {postulante.nombre_estudiante}
                                    </td>
                                    <td className={`px-6 py-4 text-sm ${currentTheme.text}`}>
                                        {postulante.correo}
                                    </td>
                                    <td className={`px-6 py-4 text-sm ${currentTheme.text}`}>
                                        {postulante.mensaje}
                                    </td>
                                    <td className={`px-6 py-4 text-sm ${currentTheme.text}`}>
                                        {new Date(postulante.fecha_postulacion).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PostulantesList;