import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        fotoPerfil: null,
        nombres: '',
        apellidos: '',
        email: '',
        fecha_nacimiento: '',
        ano_ingreso: '',
        id_carrera: null,
    });

    // Suponiendo que obtienes el UID de alguna parte (por ejemplo, Firebase Authentication)
    const uid = 'user-uid'; // Reemplaza esto con la lógica adecuada para obtener el UID

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/usuarios/${uid}`);
                console.log('Profile Response:', response.data); // Aquí se mostrará la respuesta completa
                setProfileData({
                    fotoPerfil: response.data.fotoPerfil || null,
                    nombres: response.data.nombres || '',
                    apellidos: response.data.apellidos || '',
                    email: response.data.email || '',
                    fecha_nacimiento: response.data.fecha_nacimiento || '',
                    ano_ingreso: response.data.ano_ingreso || '',
                    id_carrera: parseInt(response.data.id_carrera) || null,
                });
            } catch (error) {
                console.error('Error al obtener datos del perfil:', error);
            }
        };

        fetchProfileData();
    }, [uid]);


    return (
        <main className="flex-grow">
            <div className="max-w-3xl mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center mb-6">
                        {profileData.fotoPerfil ? (
                            <img src={profileData.fotoPerfil} alt="avatar" className="w-32 h-32 rounded-full border border-gray-300" />
                        ) : (
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <span className="text-gray-400 text-4xl">📷</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Información Personal</h3>
                            <p><span className="font-medium">Nombres:</span> {profileData.nombres}</p>
                            <p><span className="font-medium">Apellidos:</span> {profileData.apellidos}</p>
                            <p><span className="font-medium">Correo electrónico:</span> {profileData.email}</p>
                            <p><span className="font-medium">Fecha de Nacimiento:</span> {profileData.fecha_nacimiento}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Información Académica</h3>
                            <p><span className="font-medium">Año de Ingreso:</span> {profileData.ano_ingreso}</p>
                            <p><span className="font-medium">ID de Carrera:</span> {profileData.id_carrera}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => navigate('/edit-profile')}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Editar Perfil
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UserProfile;
