import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: '',
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

        // Comprobar coincidencia en las contraseñas
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/register', {
                email: formData.email,
                password: formData.password,
                nombres: formData.nombres,
                apellidos: formData.apellidos,
            });
            setSuccess('Usuario registrado correctamente');
        } catch (error) {
            if (error.response) {
                console.error(error.response);
                setError(error.response.data.Message || 'Error al registrar el usuario');
            } else {
                setError('Error de conexión');
            }
        }
    };

    // Para registrarse como empresa, lleva a otra ruta
    const handleRegisterAsCompany = () => {
        navigate('/register_em');
    };

    return (
        <div className="min-h-screen bg-[#DAEDF2] flex flex-col items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md">
                <h2 className="text-4xl font-bold mb-8 text-[#0092BC] text-center">Registro</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Nombres */}
                    <div className="mb-6">
                        <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="nombres">
                            Nombres
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                            id="nombres"
                            name="nombres"
                            type="text"
                            placeholder=""
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Apellidos */}
                    <div className="mb-6">
                        <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="apellidos">
                            Apellidos
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                            id="apellidos"
                            name="apellidos"
                            type="text"
                            placeholder=""
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                        <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="mb-6">
                        <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="******************"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="mb-6">
                        <label className="block text-[#0092BC] text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirmar Contraseña
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="******************"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center mt-3 w-full max-w-md">
                        <button
                            className="bg-[#A3D9D3] hover:bg-[#0092BC] text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300 mb-2"
                            type="submit"
                        >
                            Registrarse
                        </button>

                        <button
                            className="bg-[#0092BC] hover:bg-[#A3D9D3] text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                            onClick={handleRegisterAsCompany}
                        >
                            Registrarse como Empresa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
