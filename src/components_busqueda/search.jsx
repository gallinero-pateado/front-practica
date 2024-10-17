import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

const PracticasList = () => {
    const [practicas, setPracticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        fecha_publicacion: '',
        area_practica: '',
        ubicacion: '',
        jornada: '',
        modalidad: '',
    });
    const [searchHistory, setSearchHistory] = useState([]);
    const [filteredPracticas, setFilteredPracticas] = useState([]);

    useEffect(() => {
        const fetchPracticas = async () => {
            try {
                const response = await axios.get('http://localhost:8080/Get-practicas');
                setPracticas(response.data);
                setFilteredPracticas(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al obtener las prácticas');
                setLoading(false);
            }
        };
        fetchPracticas();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchHistory((prevHistory) => [...prevHistory, searchTerm]);
        filterPracticas();
        setSearchTerm('');
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const applyFilters = () => {
        setShowFilters(false);
        filterPracticas();
    };

    const handleRemoveSearchTerm = (termToRemove) => {
        setSearchHistory((prevHistory) => prevHistory.filter(term => term !== termToRemove));
    };

    const filterPracticas = () => {
        const filtered = practicas.filter(practica => {
            const matchesSearchTerm =
                practica.Titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                practica.Descripcion.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilters =
                (!filters.area_practica || practica.area_practica.toLowerCase().includes(filters.area_practica.toLowerCase())) &&
                (!filters.modalidad || practica.modalidad.toLowerCase().includes(filters.modalidad.toLowerCase())) &&
                (!filters.jornada || practica.jornada.toLowerCase().includes(filters.jornada.toLowerCase())) &&
                (!filters.ubicacion || practica.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase())) &&
                (!filters.fecha_publicacion || new Date(practica.fecha_publicacion).getMonth() + 1 === parseInt(filters.fecha_publicacion));

            return matchesSearchTerm && matchesFilters;
        });
        setFilteredPracticas(filtered);
    };

    if (loading) {
        return <div className="text-center py-4">Cargando prácticas...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-4">Búsqueda de Prácticas</h1>

            <div className="flex flex-col md:flex-row gap-20">
                {/* Sección de búsqueda, filtros e historial a la izquierda */}
                <div className="md:w-1/3">
                    <div className="bg-white shadow-md rounded-lg p-4 sticky top-4">

                        <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4 flex-wrap">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar..."
                                className="flex-grow p-1 border rounded-lg text-lg font-ubuntu"
                                style={{ minWidth: '150px' }}
                            />
                            <button type="submit" className="text-gray-400 p-1">
                                <Search />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center bg-[#0092BC] text-white p-1 rounded-lg"
                            >
                                <Filter className="mr-1" />
                                <ChevronDown className="ml-1" />
                            </button>
                        </form>

                        {showFilters && (
                            <div className="mb-4">
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
                                            placeholder="Ej. Tecnología"
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
                                        <label className="block mb-1">Mes de publicación:</label>
                                        <input
                                            type="number"
                                            name="fecha_publicacion"
                                            value={filters.fecha_publicacion}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="1 (Enero) a 12 (Diciembre)"
                                            min="1"
                                            max="12"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={applyFilters}
                                    className="w-full bg-[#0092BC] text-white p-2 rounded-lg mt-4"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
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
                                                className="text-red-500 hover:underline"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay búsquedas previas.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sección de resultados de búsqueda a la derecha */}
                <div className="md:w-2/3 space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Prácticas Disponibles</h2>
                    {filteredPracticas.length > 0 ? (
                        filteredPracticas.map((practica) => (
                            <div key={practica.ID} className="bg-white shadow-md rounded-lg p-4">
                                <h2 className="text-xl font-semibold mb-2">{practica.Titulo || 'Título no disponible'}</h2>
                                <p className="text-gray-600 mb-2">Empresa: {practica.Id_empresa || 'Empresa no disponible'}</p>
                                <p className="text-gray-600 mb-4">Descripción: {practica.Descripcion || 'Descripción no disponible'}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                                    {practica.area_practica && <p>Área: {practica.area_practica}</p>}
                                    {practica.ubicacion && <p>Ubicación: {practica.ubicacion}</p>}
                                    {practica.jornada && <p>Jornada: {practica.jornada}</p>}
                                    {practica.modalidad && <p>Modalidad: {practica.modalidad}</p>}
                                    {practica.fecha_publicacion && <p>Publicado: {new Date(practica.fecha_publicacion).toLocaleDateString()}</p>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4">No se encontraron prácticas que coincidan con los criterios de búsqueda.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticasList;
