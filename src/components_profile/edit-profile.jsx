import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const EditProfile = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');
    const [profileData, setProfileData] = useState({
        fecha_nacimiento: '',
        ano_ingreso: '',
        id_carrera: '',
    });

    const cookieOptions = {
        expires: 7,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
        path: '/'
    };

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        const handleThemeChange = () => {
            const newTheme = Cookies.get('theme') || 'light';
            setTheme(newTheme);
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    handleThemeChange();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        axios.interceptors.request.use((config) => {
            const token = Cookies.get('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    Cookies.remove('authToken', { path: '/' });
                    Cookies.remove('uid', { path: '/' });
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
    }, [navigate]);

    const themeColors = {
        light: {
            background: 'bg-white',
            text: 'text-black',
            accent: 'text-[#0092BC]',
            inputBg: 'bg-white',
            inputText: 'text-black',
            inputBorder: 'border-gray-300',
            card: 'bg-white'
        },
        dark: {
            background: 'bg-gray-800',
            text: 'text-white',
            accent: 'text-[#A3D9D3]',
            inputBg: 'bg-gray-700',
            inputText: 'text-white',
            inputBorder: 'border-gray-600',
            card: 'bg-gray-800',
            formWrapper: 'bg-gray-900'
        }
    };

    const currentTheme = themeColors[theme];

    useEffect(() => {
        const fetchProfileData = async () => {
            const uid = Cookies.get('uid');
            if (!uid) {
                console.error('UID no encontrado');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/usuarios/${uid}`);
                setProfileData({
                    fecha_nacimiento: response.data.Fecha_Nacimiento || '',
                    ano_ingreso: response.data.Ano_Ingreso || '',
                    id_carrera: response.data.Id_carrera || '',
                });
            } catch (error) {
                console.error('Error al obtener datos del perfil:', error);
                if (error.response && error.response.status === 401) {
                    Cookies.remove('authToken', { path: '/' });
                    Cookies.remove('uid', { path: '/' });
                    navigate('/login');
                }
            }
        };

        fetchProfileData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fecha_nacimiento') {
            // Ajustar la fecha para manejar el timezone
            const date = new Date(value);
            // Ajustar a la zona horaria local
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            const formattedDate = date.toISOString().split('T')[0];
            setProfileData(prevData => ({
                ...prevData,
                [name]: formattedDate,
            }));
        } else {
            setProfileData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data according to the backend's expected format
        const updatedData = {};
        if (profileData.fecha_nacimiento) {
            // Asegurarse de que la fecha se envíe en el formato correcto
            const date = new Date(profileData.fecha_nacimiento);
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            updatedData.fecha_nacimiento = date.toISOString().split('T')[0];
        }
        if (profileData.ano_ingreso) updatedData.ano_ingreso = profileData.ano_ingreso;
        if (profileData.id_carrera) updatedData.id_carrera = parseInt(profileData.id_carrera);

        try {
            await axios.patch('http://localhost:8080/edit-profile', updatedData);
            alert('Perfil actualizado exitosamente');
            navigate('/user-profile');
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            if (error.response && error.response.status === 401) {
                Cookies.remove('authToken', { path: '/' });
                Cookies.remove('uid', { path: '/' });
                navigate('/login');
            } else {
                alert('No se pudo actualizar el perfil. Verifica los datos e intenta nuevamente.');
            }
        }
    };

    return (
        <main className="flex-grow p-4">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6 transition-colors duration-300`}>
                    <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#1D4157]'}`}>
                        Editar Perfil
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { label: 'Fecha de Nacimiento:', name: 'fecha_nacimiento', type: 'date' },
                            { label: 'Año de Ingreso:', name: 'ano_ingreso', type: 'text' },
                            { label: 'ID de Carrera:', name: 'id_carrera', type: 'number' },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D4157]'}`}>
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={profileData[field.name]}
                                    onChange={handleChange}
                                    className={`border rounded w-full p-2 transition-colors duration-300 ${theme === 'dark'
                                        ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                                        : 'bg-white text-[#1D4157] border-gray-300 focus:border-blue-500'
                                        }`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white 
                                     bg-[#0092BC] hover:bg-[#A3D9D3] 
                                     transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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