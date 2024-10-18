import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/password-reset', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#DAEDF2] flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md">
                <h2 className="text-4xl font-bold mb-8 text-[#0092BC] text-center font-ubuntu">Recuperar Contraseña</h2>

                {message && <p className="text-[#A3D9D3] text-sm mb-4">{message}</p>}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-6">
                    <label className="block text-[#0092BC] text-sm font-bold mb-2 font-ubuntu" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC]"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        className="bg-[#0092BC] hover:bg-[#007A9A] text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar Código de Recuperación'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordResetForm;
