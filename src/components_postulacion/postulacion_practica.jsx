import React, { useState } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';


const PostulacionPractica = ({ practicaId, onPostulacionExitosa }) => {
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(`http://localhost:8080/postulacion-practicas/${practicaId}`, {
                mensaje
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                setSuccess('Postulación enviada con éxito');
                setMensaje('');
                setTimeout(() => {
                    onPostulacionExitosa();
                }, 2000); // Espera 2 segundos antes de cerrar
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setError('No estás autorizado. Por favor, inicia sesión nuevamente.');
                        break;
                    case 409:
                        setError('Ya has postulado a esta práctica anteriormente.');
                        break;
                    default:
                        setError(error.response.data.error || 'Error al enviar la postulación');
                }
            } else if (error.request) {
                setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else {
                setError('Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">Postular a Práctica</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
                <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Escribe tu mensaje de postulación aquí"
                    required
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                    rows="4"
                />
                {error && (
                    <div className="mt-2 flex items-center text-red-500">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mt-2 flex items-center text-green-500">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>{success}</span>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-4 w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        'Enviando...'
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            Enviar Postulación
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default PostulacionPractica;