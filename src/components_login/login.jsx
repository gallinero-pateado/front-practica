import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carga
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Iniciar carga

        try {
            const loginResponse = await axios.post('http://localhost:8080/login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Respuesta del inicio de sesión:', loginResponse.data);

            const { token, uid } = loginResponse.data;

            if (!token || !uid) {
                throw new Error('No se recibieron las credenciales necesarias');
            }

            localStorage.setItem('authToken', token);
            localStorage.setItem('uid', uid);

            console.log('Token y UID guardados:', { token, uid });

            // Verificar estado del perfil
            const profileResponse = await axios.get('http://localhost:8080/profile-status', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Estado del perfil:', profileResponse.data);

            if (profileResponse.data.PerfilCompletado) {
                navigate('/search');
            } else {
                navigate('/complete_profile');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            if (error.response) {
                setError(error.response.data.error || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('Error de conexión');
            }
            localStorage.removeItem('authToken');
            localStorage.removeItem('uid');
        } finally {
            setLoading(false); // Terminar carga
        }
    };

    return (
        <div className="min-h-screen bg-[#DAEDF2] flex flex-col items-center justify-center font-ubuntu">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md">
                <h2 className="text-4xl font-bold mb-8 text-[#0092BC] text-center">Iniciar Sesión</h2>

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
                        onClick={() => navigate('/password_recovery')}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <div className="flex flex-col items-center mb-4">
                    <button
                        type="submit"
                        className={`bg-[#0092BC] hover:bg-[#007a9a] text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 mb-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading} // Deshabilitar el botón si está cargando
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                    <button
                        type="button"
                        className="bg-[#A3D9D3] hover:bg-[#8ec3c0] text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                        onClick={() => navigate('/login_em')}
                    >
                        Iniciar como Empresa
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
