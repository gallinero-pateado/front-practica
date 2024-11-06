import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CompleteProfile = () => {

    ///LISTADO CON CARRERAS DE LA UTEM///

    const carrerasList = [
        { id: 1, nombre: "Ingeniería en Informatica" },
        { id: 2, nombre: "Ingeniería Civil Biomedica" },
        { id: 3, nombre: "Bachillerato en Ciencias de la Ingenieria" },
        { id: 4, nombre: "Ingenieria Civil en Computacion, mencion Informatica" },
        { id: 5, nombre: "Ingenieria Civil Industrial" },
        { id: 6, nombre: "Ingenieria Civil en Ciencias de Datos" },
        { id: 7, nombre: "Ingenieria Civil en Electronica" },
        { id: 8, nombre: "Ingenieria Civil en Mecanica" },
        { id: 9, nombre: "Ingenieria en Geomensura" },
        { id: 10, nombre: "Ingenieria Industrial" },
        { id: 11, nombre: "Dibujante Proyectista" },
        { id: 12, nombre: "Diseño en Comunicacion Visual" },
        { id: 13, nombre: "Diseño Industrial" },
        { id: 14, nombre: "Trabajo Social" },
        { id: 15, nombre: "Ingenieria Civil Quimica" },
        { id: 16, nombre: "Ingeniería Civil Matematica" },
        { id: 17, nombre: "Quimica y Farmacia" },
        { id: 18, nombre: "Ingenieria en Biotecnologia" },
        { id: 19, nombre: "Ingenieria en Alimentos" },
        { id: 20, nombre: "Quimica Industrial" },
        { id: 21, nombre: "Arquitectura" },
        { id: 22, nombre: "Ingenieria Civil en Obras Civiles" },
        { id: 23, nombre: "Ingenieria en Construccion" },
        { id: 24, nombre: "Ingenieria Civil en Prevencion de Riesgos y Medioambiente" },
        { id: 25, nombre: "Administracion Publica" },
        { id: 26, nombre: "Bibliotecologia y Documentacion" },
        { id: 27, nombre: "Contador Publico y Auditor" },
        { id: 28, nombre: "Ingenieria Comercial" },
        { id: 29, nombre: "Ingenieria en Comercio Internacional" },
        { id: 30, nombre: "Ingenieria en Gestion Turistica" },
        { id: 31, nombre: "Derecho" },
        { id: 32, nombre: "Psicologia" }
    ];


    const [formData, setFormData] = useState({
        fecha_nacimiento: '',
        ano_ingreso: '',
        id_carrera: '',
        fotoPerfil: null
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    // Verificar si el perfil está completo al cargar el componente
    useEffect(() => {
        const checkProfileCompletion = async () => {
            try {
                const response = await axios.get('http://localhost:8080/profile-status', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.data.perfil_completado) {
                    navigate('/search');
                }
            } catch (error) {
                console.error('Error al verificar la completación del perfil:', error);
            }
        };

        checkProfileCompletion();
    }, [navigate]);

    const handleChange = (e) => {
        if (e.target.name === 'fotoPerfil') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let fotoPerfilUrl = '';

            if (formData.fotoPerfil) {
                const imageFormData = new FormData();
                imageFormData.append('file', formData.fotoPerfil);

                const uploadResponse = await axios.post('http://localhost:8080/upload-image', imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                fotoPerfilUrl = uploadResponse.data.url;
            }

            const profileFormData = {
                fecha_nacimiento: formData.fecha_nacimiento,
                ano_ingreso: formData.ano_ingreso,
                id_carrera: parseInt(formData.id_carrera),
                foto_perfil: fotoPerfilUrl || ''
            };

            const response = await axios.post('http://localhost:8080/complete-profile', profileFormData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.data.message === "Perfil actualizado correctamente") {
                navigate('/search');
            } else {
                setError('Error al completar el perfil: ' + response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'Error al completar el perfil');
            } else {
                setError('Error al completar el perfil');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#DAEDF2] flex items-center justify-center font-Ubuntu">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md">
                <h2 className="text-4xl font-Rubik font-bold mb-8 text-[#0092BC] text-center">Completar Perfil</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-6">
                    <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="fecha_nacimiento">
                        Fecha de Nacimiento
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="ano_ingreso">
                        Año de Ingreso Universitario
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        id="ano_ingreso"
                        name="ano_ingreso"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.ano_ingreso}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="id_carrera">
                        Carrera
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        id="id_carrera"
                        name="id_carrera"
                        value={formData.id_carrera}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione una carrera</option>
                        {carrerasList.map((carrera) => (
                            <option key={carrera.id} value={carrera.id}>
                                {carrera.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="fotoPerfil">
                        Foto de Perfil
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        id="fotoPerfil"
                        name="fotoPerfil"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        className="bg-[#0092BC] hover:bg-[#007a9a] text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300"
                        type="submit"
                    >
                        Terminar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompleteProfile;