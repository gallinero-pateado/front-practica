import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PostulacionPractica = () => {
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { practicaId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const response = await axios.post(`/api/postular/${practicaId}`, { mensaje }, {
                headers: {
                    'Content-Type': 'application/json',
                    // Asume que el token de autenticación está en localStorage
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                setSuccess(true);
                setTimeout(() => navigate('/mis-postulaciones'), 3000);
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Ocurrió un error al procesar tu postulación');
            } else {
                setError('No se pudo conectar con el servidor');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Postular a Práctica</h2>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert className="mb-4">
                    <AlertDescription>Postulación enviada con éxito. Redirigiendo...</AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">
                        Mensaje de Postulación
                    </label>
                    <textarea
                        id="mensaje"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        rows="4"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Enviar Postulación
                </button>
            </form>
        </div>
    );
};

export default PostulacionPractica;