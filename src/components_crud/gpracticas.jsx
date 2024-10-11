import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Gpracticas = () => {
    const [practicas, setPracticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPracticas = async () => {
            try {
                const response = await axios.get('http://localhost:8080/gpracticas');
                setPracticas(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las prácticas');
                setLoading(false);
            }
        };

        fetchPracticas();
    }, []);

    if (loading) return <div className="text-center py-4">Cargando prácticas...</div>;
    if (error) return <div className="text-center py-4 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Prácticas</h1>
            <Link to="/cpractica" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block mb-4">
                Crear Nueva Práctica
            </Link>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">Título</th>
                            <th className="py-2 px-4 border-b">Empresa</th>
                            <th className="py-2 px-4 border-b">Fecha Inicio</th>
                            <th className="py-2 px-4 border-b">Fecha Fin</th>
                            <th className="py-2 px-4 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {practicas.map((practica) => (
                            <tr key={practica.ID} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{practica.Titulo}</td>
                                <td className="py-2 px-4 border-b">{practica.Id_empresa}</td>
                                <td className="py-2 px-4 border-b">{new Date(practica.Fecha_inicio).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{new Date(practica.Fecha_fin).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">
                                    <Link to={`/upractica/${practica.ID}`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                                        Editar
                                    </Link>
                                    <Link to={`/dpractica/${practica.ID}`} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                                        Eliminar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Gpracticas;