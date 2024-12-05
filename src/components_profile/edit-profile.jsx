import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const EditProfile = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');

    // Carreras list from the previous component
    const carrerasList = [
        { id: 1, nombre: "Ingeniería en Informática" },
        { id: 2, nombre: "Ingeniería Civil Biomédica" },
        { id: 3, nombre: "Bachillerato en Ciencias de la Ingeniería" },
        { id: 4, nombre: "Ingeniería Civil en Computación, mención Informática" },
        { id: 5, nombre: "Ingeniería Civil Industrial" },
        { id: 6, nombre: "Ingeniería Civil en Ciencias de Datos" },
        { id: 7, nombre: "Ingeniería Civil en Electrónica" },
        { id: 8, nombre: "Ingeniería Civil en Mecánica" },
        { id: 9, nombre: "Ingeniería en Geomensura" },
        { id: 10, nombre: "Ingeniería Industrial" },
        { id: 11, nombre: "Dibujante Proyectista" },
        { id: 12, nombre: "Diseño en Comunicación Visual" },
        { id: 13, nombre: "Diseño Industrial" },
        { id: 14, nombre: "Trabajo Social" },
        { id: 15, nombre: "Ingeniería Civil Química" },
        { id: 16, nombre: "Ingeniería Civil Matemática" },
        { id: 17, nombre: "Química y Farmacia" },
        { id: 18, nombre: "Ingeniería en Biotecnología" },
        { id: 19, nombre: "Ingeniería en Alimentos" },
        { id: 20, nombre: "Química Industrial" },
        { id: 21, nombre: "Arquitectura" },
        { id: 22, nombre: "Ingeniería Civil en Obras Civiles" },
        { id: 23, nombre: "Ingeniería en Construcción" },
        { id: 24, nombre: "Ingeniería Civil en Prevención de Riesgos y Medioambiente" },
        { id: 25, nombre: "Administración Pública" },
        { id: 26, nombre: "Bibliotecología y Documentación" },
        { id: 27, nombre: "Contador Público y Auditor" },
        { id: 28, nombre: "Ingeniería Comercial" },
        { id: 29, nombre: "Ingeniería en Comercio Internacional" },
        { id: 30, nombre: "Ingeniería en Gestión Turística" },
        { id: 31, nombre: "Derecho" },
        { id: 32, nombre: "Psicología" }
    ];

    const [profileData, setProfileData] = useState({
        fotoPerfil: null,
        nombres: '',
        apellidos: '',
        email: '',
        fecha_nacimiento: '',
        ano_ingreso: '',
        id_carrera: null,
        cv: null
    });

    const [formData, setFormData] = useState({
        fecha_nacimiento: '',
        ano_ingreso: '',
        id_carrera: null
    });

    const [profileImage, setProfileImage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [errors, setErrors] = useState({});

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
        const fetchProfileData = async () => {
            const uid = Cookies.get('uid');
            if (!uid) {
                console.error('UID no encontrado');
                navigate('/login');
                return;
            }

            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${API_URL}/usuarios/${uid}`);

                const userData = response.data;
                setProfileData({
                    fotoPerfil: userData.Foto_Perfil || null,
                    nombres: userData.Nombres || '',
                    apellidos: userData.Apellidos || '',
                    email: userData.Correo || '',
                    fecha_nacimiento: userData.Fecha_Nacimiento || '',
                    ano_ingreso: userData.Ano_Ingreso || '',
                    id_carrera: parseInt(userData.Id_carrera) || null,
                    cv: userData.CV || null
                });

                // Initialize form data with existing profile data
                setFormData({
                    fecha_nacimiento: userData.Fecha_Nacimiento || '',
                    ano_ingreso: userData.Ano_Ingreso || '',
                    id_carrera: parseInt(userData.Id_carrera) || null
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    const handlePDFChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            alert('Por favor, seleccione un archivo PDF válido');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate fecha_nacimiento (optional)
        if (formData.fecha_nacimiento) {
            const birthDate = new Date(formData.fecha_nacimiento);
            const today = new Date();
            if (birthDate > today) {
                newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';
            }
        }

        // Validate ano_ingreso (optional)
        if (formData.ano_ingreso) {
            const currentYear = new Date().getFullYear();
            const yearEntered = parseInt(formData.ano_ingreso);
            if (yearEntered > currentYear) {
                newErrors.ano_ingreso = 'El año de ingreso no puede ser futuro';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        const API_URL = import.meta.env.VITE_API_URL;
        const uid = Cookies.get('uid');
        const token = Cookies.get('authToken');

        try {
            // Update profile data
            if (formData.fecha_nacimiento || formData.ano_ingreso || formData.id_carrera) {
                const updateResponse = await axios.patch(`${API_URL}/edit-profile`, {
                    fecha_nacimiento: formData.fecha_nacimiento || undefined,
                    ano_ingreso: formData.ano_ingreso || undefined,
                    id_carrera: formData.id_carrera || undefined
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            // Upload profile image if selected
            if (profileImage) {
                const imageFormData = new FormData();
                imageFormData.append('file', profileImage);

                await axios.post(`${API_URL}/update-image`, imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            // Upload PDF if selected
            if (pdfFile) {
                const pdfFormData = new FormData();
                pdfFormData.append('file', pdfFile);

                await axios.post(`${API_URL}/upload-pdf`, pdfFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            // Navigate back to profile page
            navigate('/user-profile');

        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Hubo un error al actualizar el perfil. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <main className="flex-grow">
            <div className="max-w-3xl mx-auto p-4">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-4 md:p-6 transition-colors duration-300`}>
                    <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-center`}>
                        Editar Perfil
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                {profileData.fotoPerfil || profileImage ? (
                                    <img
                                        src={profileImage ? URL.createObjectURL(profileImage) : profileData.fotoPerfil}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full border-4 border-[#0092BC] object-cover"
                                    />
                                ) : (
                                    <div className={`w-32 h-32 rounded-full border-4 border-[#0092BC] flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <span className="text-gray-400 text-4xl">📷</span>
                                    </div>
                                )}
                                <label
                                    htmlFor="profileImage"
                                    className="absolute bottom-0 right-0 bg-[#0092BC] text-white rounded-full p-2 cursor-pointer hover:bg-[#007a9a] transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <input
                                        type="file"
                                        id="profileImage"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3
                                    className="text-lg font-semibold text-[#0092BC] mb-4"
                                    style={{ fontFamily: 'Rubik' }}
                                >
                                    Información Personal
                                </h3>

                                <div>
                                    <label
                                        htmlFor="fecha_nacimiento"
                                        className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                    >
                                        Fecha de Nacimiento
                                    </label>
                                    <input
                                        type="date"
                                        id="fecha_nacimiento"
                                        name="fecha_nacimiento"
                                        value={formData.fecha_nacimiento}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 rounded-md border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.inputText} focus:outline-none focus:ring-2 focus:ring-[#0092BC]`}
                                    />
                                    {errors.fecha_nacimiento && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fecha_nacimiento}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div>
                            <label
                                htmlFor="ano_ingreso"
                                className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                                Año de Ingreso
                            </label>
                            <input
                                type="number"
                                id="ano_ingreso"
                                name="ano_ingreso"
                                value={formData.ano_ingreso}
                                onChange={handleInputChange}
                                min="1900"
                                max={new Date().getFullYear()}
                                className={`w-full p-2 rounded-md border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.inputText} focus:outline-none focus:ring-2 focus:ring-[#0092BC]`}
                            />
                            {errors.ano_ingreso && (
                                <p className="text-red-500 text-sm mt-1">{errors.ano_ingreso}</p>
                            )}
                        </div>

                        <div className="mt-4">
                            <label
                                htmlFor="id_carrera"
                                className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                                Carrera
                            </label>
                            <select
                                id="id_carrera"
                                name="id_carrera"
                                value={formData.id_carrera || ''}
                                onChange={(e) => {
                                    const value = e.target.value ? parseInt(e.target.value) : null;
                                    setFormData(prev => ({
                                        ...prev,
                                        id_carrera: value
                                    }));
                                }}
                                className={`w-full p-2 rounded-md border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.inputText} focus:outline-none focus:ring-2 focus:ring-[#0092BC]`}
                            >
                                <option value="">Selecciona tu carrera</option>
                                {carrerasList.map((carrera) => (
                                    <option key={carrera.id} value={carrera.id}>
                                        {carrera.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* CV Upload Section */}
                        <div className="mt-6">
                            <h3
                                className="text-lg font-semibold text-[#0092BC] mb-4"
                                style={{ fontFamily: 'Rubik' }}
                            >
                                Curriculum Vitae
                            </h3>
                            <div className="flex items-center justify-between">
                                <div className="flex-grow mr-4">
                                    <label
                                        htmlFor="cvUpload"
                                        className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                    >
                                        Subir CV (PDF)
                                    </label>
                                    <input
                                        type="file"
                                        id="cvUpload"
                                        accept=".pdf"
                                        onChange={handlePDFChange}
                                        className={`w-full p-2 rounded-md border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.inputText} focus:outline-none focus:ring-2 focus:ring-[#0092BC]`}
                                    />
                                </div>
                                {(profileData.cv || pdfFile) && (
                                    <a
                                        href={pdfFile ? URL.createObjectURL(pdfFile) : profileData.cv}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#0092BC] hover:underline"
                                    >
                                        {pdfFile ? pdfFile.name : 'Ver CV actual'}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8">
                            <button
                                type="submit"
                                className={`w-full py-3 rounded-md transition-colors duration-300 
                                ${theme === 'dark'
                                        ? 'bg-[#A3D9D3] text-gray-900 hover:bg-[#8BC6C0]'
                                        : 'bg-[#0092BC] text-white hover:bg-[#007a9a]'}`}
                            >
                                Guardar Cambios
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    );
};

export default EditProfile;
