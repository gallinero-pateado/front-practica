import React, { useState } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        publishDate: '',
        area: '',
        location: '',
        schedule: '',
        modality: '',
    });
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Implementa la lógica para manejar la búsqueda aquí
        setSearchTerm('');
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilters({ ...filters, [e.target.name]: value });
    };

    const applyFilters = () => {
        setShowFilters(false);
        // Implementa la lógica para aplicar filtros aquí
    };

    const handleRemoveSearchTerm = (termToRemove) => {
        setSearchHistory((prevHistory) => prevHistory.filter(term => term !== termToRemove));
    };

    return (
        <main className="flex-grow p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-4 flex flex-col">
                    <div className="bg-white p-6 rounded-lg shadow mb-4 flex-grow">
                        <div className="flex items-center mb-4">
                            <form onSubmit={handleSearch} className="flex-grow mr-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar prácticas..."
                                        className="w-full p-2 pl-10 pr-4 border rounded-lg text-lg font-ubuntu"
                                    />
                                    <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Search />
                                    </button>
                                </div>
                            </form>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center bg-[#0092bc] text-white px-4 py-2 rounded-lg"
                            >
                                <Filter className="mr-2" />
                                Filtros
                                <ChevronDown className="ml-2" />
                            </button>
                        </div>

                        {/* Historial de búsquedas */}
                        <h3 className="font-bold mt-4">Historial de búsquedas</h3>
                        {searchHistory.length > 0 ? (
                            <ul>
                                {searchHistory.map((term, index) => (
                                    <li key={index} className="flex justify-between items-center mb-2">
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

                        {/* Filtros */}
                        {showFilters && (
                            <div className="mt-4">
                                <h3 className="font-bold">Filtros</h3>
                                <div className="mb-2">
                                    <label className="block mb-1">Fecha de publicación:</label>
                                    <input
                                        type="date"
                                        name="publishDate"
                                        value={filters.publishDate}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Área:</label>
                                    <input
                                        type="text"
                                        name="area"
                                        value={filters.area}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="Ej. Tecnología"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Ubicación:</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="Ej. Santiago"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Horario:</label>
                                    <input
                                        type="text"
                                        name="schedule"
                                        value={filters.schedule}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="Ej. Part-time"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Modalidad:</label>
                                    <input
                                        type="text"
                                        name="modality"
                                        value={filters.modality}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="Ej. Remoto"
                                    />
                                </div>
                                <button onClick={applyFilters} className="bg-[#0092bc] text-white px-4 py-2 rounded">
                                    Aplicar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-12 md:col-span-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-bold">Resultados de búsqueda</h3>
                        {searchResults.length > 0 ? (
                            <ul>
                                {searchResults.map((result, index) => (
                                    <li key={index} className="py-2 border-b last:border-b-0">
                                        {result}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No se encontraron resultados.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SearchComponent;
