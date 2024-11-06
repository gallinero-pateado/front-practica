import React, { useState } from 'react';
import axios from 'axios';

const Cpractica = () => {
    const [formData, setFormData] = useState({
        Titulo: '',
        Descripcion: '',
        Id_Empresa: '',
        Ubicacion: '',
        Fecha_inicio: '',
        Fecha_fin: '',
        Requisitos: '',
        Fecha_expiracion: '',
        Modalidad: '',
        Area_practica: '',
        Jornada: ''
    });
    const [errors, setErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let tempErrors = {};
        const { Fecha_inicio, Fecha_fin, Fecha_expiracion } = formData;

        if (!formData.Titulo) tempErrors.Titulo = "El título es requerido";
        if (!formData.Descripcion) tempErrors.Descripcion = "La descripción es requerida";
        if (!formData.Id_Empresa) tempErrors.Id_Empresa = "El ID de la empresa es requerido";
        if (!formData.Ubicacion) tempErrors.Ubicacion = "La ubicación es requerida";
        if (!Fecha_inicio) tempErrors.Fecha_inicio = "La fecha de inicio es requerida";
        if (!Fecha_fin) tempErrors.Fecha_fin = "La fecha de fin es requerida";
        if (!formData.Requisitos) tempErrors.Requisitos = "Los requisitos son requeridos";
        if (!Fecha_expiracion) tempErrors.Fecha_expiracion = "La fecha de expiración es requerida";
        if (!formData.Area_practica) tempErrors.Area_practica = "El área de práctica es requerida";

        // Validar que las fechas sean válidas
        const today = new Date();
        if (Fecha_inicio && new Date(Fecha_inicio) < today) {
            tempErrors.Fecha_inicio = "La fecha de inicio no puede ser anterior a hoy.";
        }
        if (Fecha_fin && new Date(Fecha_fin) < new Date(Fecha_inicio)) {
            tempErrors.Fecha_fin = "La fecha de fin no puede ser anterior a la fecha de inicio.";
        }
        if (Fecha_expiracion && new Date(Fecha_expiracion) < new Date(Fecha_fin)) {
            tempErrors.Fecha_expiracion = "La fecha de expiración no puede ser anterior a la fecha de fin.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                // Obtener el token desde localStorage
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setSubmitMessage({ type: 'error', text: 'No se encontró el token de autenticación.' });
                    return;
                }

                // Formatear fechas
                const formattedData = {
                    ...formData,
                    Id_Empresa: parseInt(formData.Id_Empresa, 10),
                    Fecha_inicio: new Date(formData.Fecha_inicio).toISOString(),
                    Fecha_fin: new Date(formData.Fecha_fin).toISOString(),
                    Fecha_expiracion: new Date(formData.Fecha_expiracion).toISOString(),
                };

                // Realizar la solicitud POST con el token en el encabezado
                const response = await axios.post(
                    'http://localhost:8080/Create-practicas',
                    formattedData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}` // Aquí se incluye el token
                        }
                    }
                );

                setSubmitMessage({ type: 'success', text: `Práctica creada exitosamente con ID: ${response.data.id_practica}` });

                // Limpiar formulario
                setFormData({
                    Titulo: '',
                    Descripcion: '',
                    Id_Empresa: '',
                    Ubicacion: '',
                    Fecha_inicio: '',
                    Fecha_fin: '',
                    Requisitos: '',
                    Fecha_expiracion: '',
                    Modalidad: '',
                    Area_practica: '',
                    Jornada: ''
                });
            } catch (error) {
                setSubmitMessage({ type: 'error', text: 'Error al crear la práctica: ' + (error.response?.data?.error || error.message) });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl font-ubuntu">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nueva Práctica</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos del formulario */}
                <div>
                    <label htmlFor="Titulo" className="block text-sm font-medium text-gray-700">Título:</label>
                    <input
                        type="text"
                        id="Titulo"
                        name="Titulo"
                        value={formData.Titulo}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.Titulo && <span className="text-red-500 text-xs">{errors.Titulo}</span>}
                </div>

                <div>
                    <label htmlFor="Descripcion" className="block text-sm font-medium text-gray-700">Descripción:</label>
                    <textarea
                        id="Descripcion"
                        name="Descripcion"
                        value={formData.Descripcion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.Descripcion && <span className="text-red-500 text-xs">{errors.Descripcion}</span>}
                </div>

                <div>
                    <label htmlFor="Id_Empresa" className="block text-sm font-medium text-gray-700">ID de la Empresa:</label>
                    <input
                        type="number"
                        id="Id_Empresa"
                        name="Id_Empresa"
                        value={formData.Id_Empresa}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.Id_Empresa && <span className="text-red-500 text-xs">{errors.Id_Empresa}</span>}
                </div>

                <div>
                    <label htmlFor="Ubicacion" className="block text-sm font-medium text-gray-700">Ubicación:</label>
                    <input
                        type="text"
                        id="Ubicacion"
                        name="Ubicacion"
                        value={formData.Ubicacion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        maxLength={30}
                    />
                    {errors.Ubicacion && <span className="text-red-500 text-xs">{errors.Ubicacion}</span>}
                </div>

                <div>
                    <label htmlFor="Fecha_inicio" className="block text-sm font-medium text-gray-700">Fecha de inicio:</label>
                    <input
                        type="date"
                        id="Fecha_inicio"
                        name="Fecha_inicio"
                        value={formData.Fecha_inicio}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.Fecha_inicio && <span className="text-red-500 text-xs">{errors.Fecha_inicio}</span>}
                </div>

                <div>
                    <label htmlFor="Fecha_fin" className="block text-sm font-medium text-gray-700">Fecha de fin:</label>
                    <input
                        type="date"
                        id="Fecha_fin"
                        name="Fecha_fin"
                        value={formData.Fecha_fin}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.Fecha_fin && <span className="text-red-500 text-xs">{errors.Fecha_fin}</span>}
                </div>

                <div>
                    <label htmlFor="Requisitos" className="block text-sm font-medium text-gray-700">Requisitos:</label>
                    <textarea
                        id="Requisitos"
                        name="Requisitos"
                        value={formData.Requisitos}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.Requisitos && <span className="text-red-500 text-xs">{errors.Requisitos}</span>}
                </div>

                <div>
                    <label htmlFor="Fecha_expiracion" className="block text-sm font-medium text-gray-700">Fecha de expiración:</label>
                    <input
                        type="date"
                        id="Fecha_expiracion"
                        name="Fecha_expiracion"
                        value={formData.Fecha_expiracion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.Fecha_expiracion && <span className="text-red-500 text-xs">{errors.Fecha_expiracion}</span>}
                </div>

                <div>
                    <label htmlFor="Modalidad" className="block text-sm font-medium text-gray-700">Modalidad:</label>
                    <input
                        type="text"
                        id="Modalidad"
                        name="Modalidad"
                        value={formData.Modalidad}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>

                <div>
                    <label htmlFor="Area_practica" className="block text-sm font-medium text-gray-700">Área de práctica:</label>
                    <input
                        type="text"
                        id="Area_practica"
                        name="Area_practica"
                        value={formData.Area_practica}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.Area_practica && <span className="text-red-500 text-xs">{errors.Area_practica}</span>}
                </div>

                <div>
                    <label htmlFor="Jornada" className="block text-sm font-medium text-gray-700">Jornada:</label>
                    <input
                        type="text"
                        id="Jornada"
                        name="Jornada"
                        value={formData.Jornada}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 rounded-md font-semibold text-white transition-colors duration-300"
                    style={{ backgroundColor: '#0092BC', borderColor: '#0092BC' }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#A3D9D3'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#0092BC'}
                >
                    Crear Práctica
                </button>

                {submitMessage && (
                    <div className={`mt-4 text-center ${submitMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {submitMessage.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Cpractica;
