import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        fotoPerfil: '',
        nombres: '',
        apellidos: '',
        email: '',
        fecha_nacimiento: '',
        ano_ingreso: '',
        id_carrera: '',
    });

    const uid = localStorage.getItem('uid'); // Asegúrate de que el UID esté disponible

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/usuarios/${uid}`);
                setProfileData({
                    fotoPerfil: response.data.Foto_Perfil || '',
                    nombres: response.data.Nombres || '',
                    apellidos: response.data.Apellidos || '',
                    email: response.data.Correo || '',
                    fecha_nacimiento: response.data.Fecha_Nacimiento || '',
                    ano_ingreso: response.data.Ano_Ingreso || '',
                    id_carrera: response.data.Id_carrera || '',
                });
            } catch (error) {
                console.error('Error al obtener datos del perfil:', error);
            }
        };

        if (uid) {
            fetchProfileData();
        }
    }, [uid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Realiza la llamada PUT a tu API
            await axios.put(`http://localhost:8080/usuarios/${uid}`, profileData);
            alert('Perfil actualizado exitosamente');
            navigate('/user-profile'); // Redirigir después de actualizar
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            alert('No se pudo actualizar el perfil. Verifica los datos e intenta nuevamente.'); // Muestra un mensaje de error
        }
    };

    return (
        <main className="flex-grow">
            <div className="max-w-3xl mx-auto p-4">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Editar Perfil</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Nombres:</label>
                            <input
                                type="text"
                                name="nombres"
                                value={profileData.nombres}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Apellidos:</label>
                            <input
                                type="text"
                                name="apellidos"
                                value={profileData.apellidos}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Correo electrónico:</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                value={profileData.fecha_nacimiento}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Año de Ingreso:</label>
                            <input
                                type="text"
                                name="ano_ingreso"
                                value={profileData.ano_ingreso}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">ID de Carrera:</label>
                            <input
                                type="text"
                                name="id_carrera"
                                value={profileData.id_carrera}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0092BC] hover:bg-[#A3D9D3] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default EditProfile;
