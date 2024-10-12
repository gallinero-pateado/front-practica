import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterEm = () => {
    const [formData, setFormData] = useState({
        Nombre_empresa: '',
        Email_empresa: '',
        Password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:8080/register_empresa', {
                Email_empresa: formData.Email_empresa,
                Password: formData.Password,
                Nombre_empresa: formData.Nombre_empresa
            });
            setSuccess(response.data.message || 'Usuario registrado correctamente');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || 'Error al registrar el usuario');
            } else {
                setError('Error de conexión');
            }
        }
    };

    const handleRegisterAsStudent = () => {
        // Redirige a la ruta de registro para estudiantes
        navigate('/register');
    };

    return (
        <div className="min-h-screen bg-[#DAEDF2] flex flex-col items-center justify-center py-12">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md">
                <h2 className="text-4xl font-bold mb-8 text-[#0092BC] text-center font-ubuntu">Registro de Empresa</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-[#A3D9D3] text-sm mb-4">{success}</p>}

                {/* Información de la empresa */}
                <div className="mb-6">
                    <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="Nombre_empresa">
                        Nombre de la Empresa
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                        id="Nombre_empresa"
                        name="Nombre_empresa"
                        type="text"
                        placeholder="Nombre de la Empresa"
                        value={formData.Nombre_empresa}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="Email_empresa">
                        Correo de Contacto
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                        id="Email_empresa"
                        name="Email_empresa"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.Email_empresa}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="Password">
                        Contraseña
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                        id="Password"
                        name="Password"
                        type="password"
                        placeholder="******************"
                        value={formData.Password}
                        onChange={handleChange}
                        required
                    />
                </div>
            </form>

            {/* Botones fuera del formulario */}
            <div className="flex flex-col items-center justify-center w-full max-w-md">
                <button
                    className="bg-[#0092BC] hover:bg-[#007B9D] text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300 mb-4 inline-block"
                    type="button"
                    onClick={handleSubmit}
                >
                    Registrarse
                </button>

                <button
                    className="bg-[#A3D9D3] hover:bg-[#92BFB0] text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 inline-block"
                    type="button"
                    onClick={handleRegisterAsStudent}
                >
                    Registrarse como Estudiante
                </button>
            </div>
        </div>
    );
};

export default RegisterEm;
