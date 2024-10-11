import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rpractica = () => {
    const [practicas, setPracticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchPracticas = async () => {
            try {
                const response = await axios.get('http://localhost:8080/Rpracticas');
                setPracticas(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al obtener las prácticas');
                setLoading(false);
            }
        };

        fetchPracticas();
    }, []);

    const handleApply = async (practicaId) => {
        try {
            await axios.post(`http://localhost:8080/Rpracticas/${practicaId}/apply`);
            alert('Solicitud enviada con éxito');
            // Aquí podrías actualizar el estado de la práctica si es necesario
        } catch (err) {
            alert('Error al enviar la solicitud');
        }
    };

    const filteredPracticas = practicas.filter(practica =>
        practica.Titulo.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-4">Cargando prácticas...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Prácticas Disponibles</h1>
            <input
                type="text"
                placeholder="Buscar prácticas..."
                className="w-full p-2 mb-4 border rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            {filteredPracticas.length === 0 ? (
                <p className="text-center py-4">No hay prácticas disponibles que coincidan con tu búsqueda.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPracticas.map((practica) => (
                        <div key={practica.ID} className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">{practica.Titulo}</h2>
                            <p className="text-gray-600 mb-2">Empresa: {practica.Id_empresa}</p>
                            <p className="text-gray-600 mb-4">Descripción: {practica.Descripcion || 'No disponible'}</p>
                            <button
                                onClick={() => handleApply(practica.ID)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Solicitar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Rpractica;
