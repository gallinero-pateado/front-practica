import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import PostulacionPractica from '../components_postulacion/postulacion_practica';

const PracticasList = () => {
    const [practicas, setPracticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        modalidad: '',
        area_practica: '',
        jornada: '',
        ubicacion: '',
        fecha_publicacion: '',
    });
    const [searchHistory, setSearchHistory] = useState([]);
    const [selectedPracticaId, setSelectedPracticaId] = useState();
    const [showPostulacion, setShowPostulacion] = useState(false);

    useEffect(() => {
        fetchPracticas();
    }, []);

    const fetchPracticas = async () => {
        try {
            setLoading(true);
            let url = 'http://localhost:8080/Get-practicas';
            const queryParams = new URLSearchParams(Object.entries(filters).filter(([_, v]) => v !== '')).toString();
            if (queryParams) {
                url += `?${queryParams}`;
            }
            console.log('Fetching URL:', url);
            const response = await axios.get(url);
            console.log('Practicas cargadas:', response.data);
            setPracticas(response.data.practicas || response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error al obtener las prácticas:', err);
            setError('Error al obtener las prácticas');
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            setSearchHistory((prevHistory) => [...new Set([searchTerm, ...prevHistory])]);
            fetchPracticas();
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        setShowFilters(false);
        fetchPracticas();
    };

    const handleRemoveSearchTerm = (termToRemove) => {
        setSearchHistory((prevHistory) => prevHistory.filter(term => term !== termToRemove));
        setSearchTerm('');
        fetchPracticas();
    };

    const handleApply = (practicaId) => {
        setSelectedPracticaId(practicaId);
        setShowPostulacion(true);
    };

    const handlePostulacionExitosa = () => {
        setShowPostulacion(false);
        fetchPracticas();
    };

    const filteredPracticas = practicas.filter(practica => {
        const matchesSearch =
            (practica.Titulo && practica.Titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (practica.Descripcion && practica.Descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilters = Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // Skip empty filters
            const practicaValue = practica[key] || practica[key.charAt(0).toUpperCase() + key.slice(1)];

            console.log('Valores de práctica:', practica); // Debugging
            console.log('Valor del filtro:', value); // Debugging

            if (key === 'area_practica' || key === 'ubicacion') {
                return practicaValue && practicaValue.toLowerCase() === value.toLowerCase();
            } else if (key === 'fecha_publicacion') {
                const practicaDate = new Date(practicaValue);
                const filterMonth = parseInt(value, 10);
                return practicaDate.getMonth() + 1 === filterMonth;
            } else if (key === 'jornada' || key === 'modalidad') {
                return practicaValue && practicaValue.toLowerCase() === value.toLowerCase(); // Asegurando comparación correcta
            } else {
                return practicaValue && practicaValue.toLowerCase().includes(value.toLowerCase());
            }
        });

        return matchesSearch && matchesFilters;
    });

    console.log('Filtered practicas:', filteredPracticas);

    if (loading) {
        return <div className="text-center py-4">Cargando prácticas...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Prácticas Disponibles</h1>

            <div className="flex flex-col lg:flex-row">
                {/* Sección de búsqueda y filtros */}
                <div className="lg:w-1/3 mb-4 lg:mb-0 mr-4">
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4 w-full">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar prácticas..."
                                className="flex-grow w-full p-2 border rounded-lg text-lg font-ubuntu"
                            />
                            <div className="flex space-x-2 w-full sm:w-auto">
                                <button type="submit" className="text-gray-400 p-2 w-full sm:w-auto">
                                    <Search className="w-6 h-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center bg-[#0092BC] text-white p-2 rounded-lg w-full sm:w-auto"
                                >
                                    <Filter className="w-6 h-6" />
                                    <ChevronDown className="ml-1 w-6 h-6" />
                                </button>
                            </div>
                        </form>

                        {showFilters && (
                            <form onSubmit={applyFilters} className="mb-4">
                                <h3 className="font-bold mb-2">Filtros</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block mb-1">Área de práctica:</label>
                                        <input
                                            type="text"
                                            name="area_practica"
                                            value={filters.area_practica}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="Ej. TI"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Ubicación:</label>
                                        <input
                                            type="text"
                                            name="ubicacion"
                                            value={filters.ubicacion}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="Ej. Santiago"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Jornada:</label>
                                        <input
                                            type="text"
                                            name="jornada"
                                            value={filters.jornada}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="Ej. Part-time"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Modalidad:</label>
                                        <input
                                            type="text"
                                            name="modalidad"
                                            value={filters.modalidad}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="Ej. Remoto"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Mes de publicación (1-12):</label>
                                        <input
                                            type="number"
                                            name="fecha_publicacion"
                                            value={filters.fecha_publicacion}
                                            onChange={handleFilterChange}
                                            min="1"
                                            max="12"
                                            className="w-full p-2 border rounded"
                                            placeholder="Ej. 10 (para octubre)"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#0092BC] text-white p-2 rounded-lg mt-4"
                                >
                                    Aplicar Filtros
                                </button>
                            </form>
                        )}

                        <div className="mt-4">
                            <h3 className="font-bold mb-2">Historial de búsquedas</h3>
                            {searchHistory.length > 0 ? (
                                <ul className="space-y-2">
                                    {searchHistory.map((term, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            <span>{term}</span>
                                            <button
                                                onClick={() => handleRemoveSearchTerm(term)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay búsquedas recientes.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sección de resultados de búsqueda */}
                <div className="lg:w-2/3 space-y-4">
                    {filteredPracticas.length > 0 ? (
                        filteredPracticas.map((practica) => (
                            <div key={practica.ID} className="bg-white shadow-md rounded-lg p-4">
                                <h2 className="text-xl font-semibold mb-2">{practica.Titulo || 'Título no disponible'}</h2>
                                <p className="text-gray-600 mb-2">Empresa: {practica.Id_Empresa || 'Empresa no disponible'}</p>
                                <p className="text-gray-600 mb-4">Descripción: {practica.Descripcion || 'Descripción no disponible'}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                                    {practica.Area_practica && <p>Área: {practica.Area_practica}</p>}
                                    {practica.Ubicacion && <p>Ubicación: {practica.Ubicacion}</p>}
                                    {practica.Jornada && <p>Jornada: {practica.Jornada}</p>}
                                    {practica.Modalidad && <p>Modalidad: {practica.Modalidad}</p>}
                                    {practica.Fecha_publicacion && <p>Publicado: {new Date(practica.Fecha_publicacion).toLocaleDateString()}</p>}
                                </div>
                                <button
                                    onClick={() => handleApply(practica.ID)}
                                    className="mt-4 bg-[#0092BC] hover:bg-[#A3D9D3] active:bg-[#A3D9D3] text-white font-bold py-2 px-4 rounded"
                                >
                                    Solicitar
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4">No se encontraron prácticas que coincidan con los criterios de búsqueda.</div>
                    )}
                </div>
            </div>

            {/* Modal de Postulación */}
            {showPostulacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-md w-full">
                        <PostulacionPractica
                            practicaId={selectedPracticaId}
                            onPostulacionExitosa={handlePostulacionExitosa}
                        />
                        <button
                            onClick={() => setShowPostulacion(false)}
                            className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded w-full"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PracticasList;