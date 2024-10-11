import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Hacer la solicitud de inicio de sesión
            const response = await axios.post('http://localhost:8080/login', { email, password });
            const { token, uid } = response.data;

            // Guardar el token y el UID en localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('uid', uid);

            // Solo proceder si el token está disponible
            if (token) {
                // Verificar el estado del perfil
                const profileResponse = await axios.get('http://localhost:8080/profile-status', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Redirigir según el estado del perfil
                if (profileResponse.data.PerfilCompletado) {  // Asegurarse de que el campo coincida con el del backend
                    navigate('/user-profile'); // Ruta del perfil completo
                } else {
                    navigate('/complete_profile'); // Ruta para completar perfil
                }
            } else {
                setError('No se ha recibido un token de autenticación.');
            }
        } catch (error) {
            // Manejar errores de la solicitud
            if (error.response) {
                setError(error.response.data.error || 'Error al iniciar sesión');
            } else {
                setError('Error de conexión');
            }
        }
    };

    const handleForgotPasswordClick = () => {
        navigate('/password_recovery');
    };

    const handleLoginAsCompany = () => {
        navigate('/login_em');
    };

    return (
        <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md">
                <h2 className="text-5xl font-bold mb-12 text-blue-800 text-center">Iniciar Sesión</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-12">
                    <label className="block text-blue-700 text-xl font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded-lg w-full py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
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
                    <label className="block text-blue-700 text-xl font-bold mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        className="shadow appearance-none border rounded-lg w-full py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
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
                        className="bg-white text-blue-500 font-bold hover:underline focus:outline-none"
                        onClick={handleForgotPasswordClick}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </form>

            <div className="w-full max-w-4xl flex flex-col items-center">
                <button
                    className="bg-sky-500 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                    onClick={handleLoginAsCompany}
                >
                    Iniciar como Empresa
                </button>
            </div>
        </div>
    );
};

export default Login;
