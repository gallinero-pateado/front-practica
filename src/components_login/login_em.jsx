import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginEm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/login', { email, password });
            const { token } = response.data.Data;

            localStorage.setItem('authToken', token);

            // ir al perfil de usuario es decir user-profile de empresa
            navigate('/user-profile');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.Message || 'Error al iniciar sesión');
            } else {
                setError('Error de conexión');
            }
        }
    };

    const handleForgotPasswordClick = () => {
        navigate('/password_recovery');
    };

    const handleLoginAsStudent = () => {
        navigate('/'); // Redirige a la ruta de login como estudiante
    };

    return (
        <div className="min-h-screen bg-[#A3D9D3] flex flex-col items-center justify-center font-ubuntu">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md">
                <h2 className="text-5xl font-bold mb-12 text-[#0092BC] text-center">Iniciar Sesión</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-12">
                    <label className="block text-[#0092BC] text-xl font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded-lg w-full py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Ingresa tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-12">
                    <label className="block text-[#0092BC] text-xl font-bold mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        className="shadow appearance-none border rounded-lg w-full py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="******************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <hr className="border-t-2 border-gray-300 my-8" />

                <div className="flex justify-center mb-8">
                    <button
                        type="button"
                        className="bg-white text-[#0092BC] font-bold hover:underline focus:outline-none"
                        onClick={handleForgotPasswordClick}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>
            </form>

            <div className="w-full max-w-4xl flex flex-col items-center">
                <button
                    className="bg-[#0092BC] hover:bg-[#007B9C] text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 mb-4"
                    onClick={handleSubmit}
                >
                    Iniciar Sesión
                </button>

                <button
                    className="bg-[#DAEDF2] hover:bg-[#A3D9D3] text-[#0092BC] font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                    onClick={handleLoginAsStudent}
                >
                    Iniciar como Estudiante
                </button>
            </div>
        </div>
    );
};

export default LoginEm;
