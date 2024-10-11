import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dpractica = () => {
    const [practicas, setPracticas] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetchPracticas();
    }, []);

    const fetchPracticas = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Dpracticas');
            setPracticas(response.data);
        } catch (err) {
            setError('Error al cargar las prácticas');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/Dpractica/${id}`);
            setSuccessMessage('La práctica fue eliminada exitosamente');
            fetchPracticas(); // Recargar la lista después de eliminar
        } catch (err) {
            setError('Error al eliminar la práctica');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Prácticas</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                    {successMessage}
                </div>
            )}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Título</th>
                        <th className="border p-2">Empresa</th>
                        <th className="border p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {practicas.map((practica) => (
                        <tr key={practica.Id} className="hover:bg-gray-100">
                            <td className="border p-2">{practica.Id}</td>
                            <td className="border p-2">{practica.Titulo}</td>
                            <td className="border p-2">{practica.Id_empresa}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleDelete(practica.Id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dpractica;
