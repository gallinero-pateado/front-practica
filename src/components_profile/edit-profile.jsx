import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        image: null,
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        yearOfEntry: '',
        careerName: '',
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const registerResponse = await axios.get('http://localhost:8080/register');
                const profileResponse = await axios.get('http://localhost:8080/complete-profile');

                setProfileData({
                    ...registerResponse.data,
                    ...profileResponse.data,
                });
            } catch (error) {
                console.error('Error al obtener datos del perfil:', error);
            }
        };

        fetchProfileData();
    }, []);

    const handleInputChange = (field, value) => {
        setProfileData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData((prevData) => ({
                    ...prevData,
                    image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put('/api/user/profile', profileData);
            console.log('Datos del perfil guardados:', profileData);
            navigate('/user-profile');
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };

    return (
        <main className="flex-grow bg-[#DAEDF2]"> {/* Color de fondo */}
            <div className="max-w-3xl mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center mb-6">
                        <label className="cursor-pointer">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100">
                                {profileData.image ? (
                                    <img src={profileData.image} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-4xl">📷</span>
                                )}
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Rubik' }}>Información Personal</h3>
                            {['firstName', 'lastName', 'email', 'dateOfBirth'].map((field) => (
                                <div key={field} className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700" style={{ fontFamily: 'Ubuntu' }}>
                                        {field === 'firstName' ? 'Nombre' :
                                            field === 'lastName' ? 'Apellido' :
                                                field === 'email' ? 'Correo electrónico' :
                                                    'Fecha de Nacimiento'}
                                    </label>
                                    <input
                                        type={field === 'dateOfBirth' ? 'date' : 'text'}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        value={profileData[field]}
                                        onChange={(e) => handleInputChange(field, e.target.value)}
                                        style={{ fontFamily: 'Inter' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Rubik' }}>Información Académica</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" style={{ fontFamily: 'Ubuntu' }}>Año de Ingreso</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    value={profileData.yearOfEntry}
                                    onChange={(e) => handleInputChange('yearOfEntry', e.target.value)}
                                    style={{ fontFamily: 'Inter' }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" style={{ fontFamily: 'Ubuntu' }}>Carrera</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    value={profileData.careerName}
                                    onChange={(e) => handleInputChange('careerName', e.target.value)}
                                    style={{ fontFamily: 'Inter' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveChanges}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0092BC] hover:bg-[#A3D9D3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EditProfile;
