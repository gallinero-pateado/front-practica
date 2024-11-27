import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const CompleteProfileEmpresa = () => {
    const [formData, setFormData] = useState({
        sector: '',
        descripcion: '',
        direccion: '',
        persona_contacto: '',
        correo_contacto: '',
        telefono_contacto: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();

    const COOKIE_CONFIG = {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newTheme = Cookies.get('theme') || 'light';
                    setTheme(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = Cookies.get('authToken');
            if (!token) {
                setError('No se encontró el token de autenticación');
                navigate('/login');
                return;
            }

            // Convertir el teléfono a número
            const telefono = parseInt(formData.telefono_contacto);
            if (isNaN(telefono)) {
                setError('El teléfono debe ser un número válido');
                setLoading(false);
                return;
            }

            const profileFormData = {
                Sector: formData.sector,
                Descripcion: formData.descripcion,
                Direccion: formData.direccion,
                Persona_contacto: formData.persona_contacto,
                Correo_contacto: formData.correo_contacto,
                Telefono_contacto: telefono,
                Estado_verificacion: 1
            };
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await axios.post(
                `${API_URL}/complete-profile/empresa`,
                profileFormData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('Respuesta del servidor:', response.data);

            if (response.data.message === "Perfil actualizado correctamente") {
                navigate('/gpracticas');
            } else {
                setError('Error al actualizar el perfil: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error completo:', error);

            if (error.response) {
                setError(error.response.data.error || 'Error del servidor');
            } else if (error.request) {
                setError('Error de conexión. Verifica tu conexión a internet.');
            } else {
                setError('Error al procesar la solicitud');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center font-Ubuntu ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#DAEDF2]'} transition-colors duration-300`}>
            <form
                onSubmit={handleSubmit}
                className={`${currentTheme.background} shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md transition-colors duration-300`}
            >
                <h2 className={`text-4xl font-Rubik font-bold mb-8 ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-center`}>
                    Perfil Empresarial
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Sector Empresarial
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText}`}
                        name="sector"
                        type="text"
                        value={formData.sector}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Descripción
                    </label>
                    <textarea
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText}`}
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        rows="4"
                    />
                </div>

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Dirección
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText}`}
                        name="direccion"
                        type="text"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Persona de Contacto
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText}`}
                        name="persona_contacto"
                        type="text"
                        value={formData.persona_contacto}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Correo de Contacto
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText}`}
                        name="correo_contacto"
                        type="email"
                        value={formData.correo_contacto}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Teléfono de Contacto
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText}`}
                        name="telefono_contacto"
                        type="tel"
                        value={formData.telefono_contacto}
                        onChange={handleChange}
                        required
                        pattern="[0-9]*"
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        className={`${theme === 'dark' ? 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-gray-800' : 'bg-[#0092BC] hover:bg-[#007a9a] text-white'} font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Completar Perfil'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompleteProfileEmpresa;