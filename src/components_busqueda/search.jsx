import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import PostulacionPractica from '../components_postulacion/postulacion_practica';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

const Regiones_Chile = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana de Santiago',
    'Libertador General Bernardo O\'Higgins',
    'Maule',
    'Ñuble',
    'Biobío',
    'La Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén del General Carlos Ibáñez del Campo',
    'Magallanes y de la Antártica Chilena'
];

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
    const [expandedPracticas, setExpandedPracticas] = useState({});
    const [currentTheme, setCurrentTheme] = useState(Cookies.get('theme') || 'light');

    const cookieOptions = {
        expires: 7,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
        path: '/'
    };

    useEffect(() => {
        const handleThemeChange = () => {
            const newTheme = Cookies.get('theme') || 'light';
            setCurrentTheme(newTheme);
        };

        handleThemeChange();
        const interval = setInterval(handleThemeChange, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchPracticas();
    }, []);

    const fetchPracticas = async () => {
        try {
            setLoading(true);
            let url = `${API_URL}/Get-practicas`;
            const queryParams = new URLSearchParams(Object.entries(filters).filter(([_, v]) => v !== '')).toString();
            if (queryParams) {
                url += `?${queryParams}`;
            }

            const token = Cookies.get('authToken');
            const config = {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            };

            const response = await axios.get(url, config);
            setPracticas(response.data.practicas || response.data);
            setLoading(false);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                Cookies.remove('authToken', { path: '/' });
                Cookies.remove('uid', { path: '/' });
                navigate('/login');
            }
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
    const handleApply = async (practicaId) => {
        const token = Cookies.get('authToken');
        if (!token) {
            navigate('/login');
            return;
        }
        setSelectedPracticaId(practicaId);
        setShowPostulacion(true);
    };

    const handlePostulacionExitosa = () => {
        setShowPostulacion(false);
        fetchPracticas();
    };

    const toggleDescription = (id) => {
        setExpandedPracticas((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const filteredPracticas = practicas.filter(practica => {
        const matchesSearch =
            (practica.Titulo && practica.Titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (practica.Descripcion && practica.Descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilters = Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const practicaValue = practica[key] || practica[key.charAt(0).toUpperCase() + key.slice(1)];
            if (key === 'area_practica' || key === 'ubicacion') {
                return practicaValue && practicaValue.toLowerCase() === value.toLowerCase();
            } else if (key === 'fecha_publicacion') {
                const practicaDate = new Date(practicaValue);
                const filterMonth = parseInt(value, 10);
                return practicaDate.getMonth() + 1 === filterMonth;
            } else if (key === 'jornada' || key === 'modalidad') {
                return practicaValue && practicaValue.toLowerCase() === value.toLowerCase();
            } else {
                return practicaValue && practicaValue.toLowerCase().includes(value.toLowerCase());
            }
        });

        return matchesSearch && matchesFilters;
    });

    if (loading) {
        return <div className="text-center py-4">Cargando prácticas...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-600 font-semibold">{error}</div>;
    }

    return (
        <div className={`container mx-auto p-4 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-[#DAEDF2]'}`}>
            <h1 className={`text-2xl font-bold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-[#1D4157]'}`}>
                Prácticas Disponibles
            </h1>

            <div className="flex flex-col lg:flex-row">
                {/* Search and Filters Section */}
                <div className="lg:w-1/3 mb-4 lg:mb-0 mr-4 w-full">
                    <div className={`${currentTheme === 'dark' ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-md'} rounded-lg p-4`}>
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4 w-full">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar prácticas..."
                                className={`flex-grow w-full p-2 border rounded-lg text-lg font-ubuntu 
                                         ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-300' :
                                        'bg-white text-[#1D4157] placeholder-gray-400'}`}
                            />
                            <div className="flex space-x-2 w-full sm:w-auto">
                                <button
                                    type="submit"
                                    className={`p-2 w-full sm:w-auto rounded-lg
                                             ${currentTheme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' :
                                            'bg-white text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <Search className="w-6 h-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center bg-[#0092BC] text-white p-2 rounded-lg w-full sm:w-auto hover:bg-[#007a9e]"
                                >
                                    <Filter className="w-6 h-6" />
                                    <ChevronDown className="ml-1 w-6 h-6" />
                                </button>
                            </div>
                        </form>

                        {showFilters && (
                            <form onSubmit={applyFilters} className="mb-4">
                                <h3 className={`font-bold mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-[#1D4157]'}`}>
                                    Filtros
                                </h3>
                                <div className="space-y-2">
                                    {Object.entries({
                                        'area_practica': 'Área de práctica:',
                                        'ubicacion': 'Ubicación:',
                                        'jornada': 'Jornada:',
                                        'modalidad': 'Modalidad:',
                                    }).map(([key, label]) => (
                                        <div key={key}>
                                            <label className={`block mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-[#1D4157]'}`}>
                                                {label}
                                            </label>
                                            {key === 'ubicacion' ? (
                                                <select
                                                    name={key}
                                                    value={filters[key]}
                                                    onChange={handleFilterChange}
                                                    className={`w-full p-2 border rounded
                                                             ${currentTheme === 'dark' ?
                                                            'bg-gray-700 border-gray-600 text-white' :
                                                            'bg-white text-[#1D4157]'}`}
                                                >
                                                    {Regiones_Chile.map((region) => (
                                                        <option key={region.value} value={region.value}>
                                                            {region.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={filters[key]}
                                                    onChange={handleFilterChange}
                                                    className={`w-full p-2 border rounded
                                                             ${currentTheme === 'dark' ?
                                                            'bg-gray-700 border-gray-600 text-white placeholder-gray-300' :
                                                            'bg-white text-[#1D4157] placeholder-gray-400'}`}
                                                    placeholder={key === 'jornada' ? 'Ej. Part-time' : key === 'modalidad' ? 'Ej. Remoto' : ''}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div>
                                        <label className={`block mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-[#1D4157]'}`}>
                                            Mes de publicación (1-12):
                                        </label>
                                        <input
                                            type="number"
                                            name="fecha_publicacion"
                                            value={filters.fecha_publicacion}
                                            onChange={handleFilterChange}
                                            min="1"
                                            max="12"
                                            className={`w-full p-2 border rounded
                                                     ${currentTheme === 'dark' ?
                                                    'bg-gray-700 border-gray-600 text-white' :
                                                    'bg-white text-[#1D4157]'}`}
                                            placeholder="Ej. 10 (para octubre)"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#0092BC] hover:bg-[#007a9e] text-white p-2 rounded-lg mt-4 
                                             transition-colors duration-200"
                                >
                                    Aplicar Filtros
                                </button>
                            </form>
                        )}

                        <div className="mt-4">
                            <h3 className={`font-bold mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-[#1D4157]'}`}>
                                Historial de búsquedas
                            </h3>
                            {searchHistory.length > 0 ? (
                                <ul className="space-y-2">
                                    {searchHistory.map((term, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            <span className={currentTheme === 'dark' ? 'text-gray-300' : 'text-[#1D4157]'}>
                                                {term}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveSearchTerm(term)}
                                                className={`${currentTheme === 'dark' ? 'text-red-400 hover:text-red-300' :
                                                    'text-red-500 hover:text-red-700'} 
                                                         p-0 bg-transparent border-none outline-none cursor-pointer`}
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-red-600 dark:text-red-400">No hay búsquedas recientes.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Results Section */}
                <div className="lg:w-2/3 space-y-4 w-full">
                    {filteredPracticas.length > 0 ? (
                        filteredPracticas.map((practica) => (
                            <div key={practica.Id} className={`${currentTheme === 'dark' ?
                                'bg-gray-800 shadow-gray-700' : 'bg-white shadow-md'} rounded-lg p-4`}>
                                <h2 className={`text-xl font-semibold mb-2 ${currentTheme === 'dark' ?
                                    'text-white' : 'text-[#1D4157]'}`}>
                                    {practica.Titulo || 'Título no disponible'}
                                </h2>
                                <p className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                    Empresa: {practica.Id_Empresa || 'Empresa no disponible'}
                                </p>

                                <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                                    {expandedPracticas[practica.Id] || (practica.Descripcion || '').length <= 300
                                        ? practica.Descripcion
                                        : `${practica.Descripcion.slice(0, 300)}...`}
                                    {(practica.Descripcion || '').length > 300 && (
                                        <button
                                            onClick={() => toggleDescription(practica.Id)}
                                            className={`${currentTheme === 'dark' ?
                                                'text-[#A3D9D3]' : 'text-[#0092BC]'} 
                                                hover:underline cursor-pointer p-0 bg-transparent border-none 
                                                outline-none ml-2`}
                                        >
                                            {expandedPracticas[practica.Id] ? 'Ver menos' : 'Ver más'}
                                        </button>
                                    )}
                                </p>

                                <div className={`grid grid-cols-2 gap-2 text-sm ${currentTheme === 'dark' ?
                                    'text-gray-400' : 'text-gray-500'}`}>
                                    {practica.Area_practica && <p>Área: {practica.Area_practica}</p>}
                                    {practica.Ubicacion && <p>Ubicación: {practica.Ubicacion}</p>}
                                    {practica.Jornada && <p>Jornada: {practica.Jornada}</p>}
                                    {practica.Modalidad && <p>Modalidad: {practica.Modalidad}</p>}
                                    {practica.Fecha_publicacion && (
                                        <p>Publicado: {new Date(practica.Fecha_publicacion).toLocaleDateString()}</p>
                                    )}
                                </div>

                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => handleApply(practica.Id)}
                                        className="mt-4 bg-[#0092BC] hover:bg-[#A3D9D3] active:bg-[#A3D9D3] 
                                                 dark:bg-[#0092BC] dark:hover:bg-[#007a9e] dark:active:bg-[#006a8e]
                                                 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                    >
                                        Solicitar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-red-600 dark:text-red-400">
                            No se encontraron prácticas que coincidan con los filtros.
                        </p>
                    )}
                </div>
            </div>

            {/* Postulation Modal */}
            {showPostulacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className={`${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg max-w-md w-full`}>
                        <PostulacionPractica
                            practicaId={selectedPracticaId}
                            onPostulacionExitosa={handlePostulacionExitosa}
                        />
                        <button
                            onClick={() => setShowPostulacion(false)}
                            className={`mt-4 ${currentTheme === 'dark' ?
                                'bg-gray-700 hover:bg-gray-600 text-white' :
                                'bg-gray-300 hover:bg-gray-400 text-black'} 
                                font-bold py-2 px-4 rounded w-full transition-colors duration-200`}
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