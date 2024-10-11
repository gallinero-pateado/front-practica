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
        if (!formData.Titulo) tempErrors.Titulo = "El título es requerido";
        if (!formData.Descripcion) tempErrors.Descripcion = "La descripción es requerida";
        if (!formData.Id_Empresa) tempErrors.Id_Empresa = "El ID de la empresa es requerido";
        if (!formData.Ubicacion) tempErrors.Ubicacion = "La ubicación es requerida";
        if (!formData.Fecha_inicio) tempErrors.Fecha_inicio = "La fecha de inicio es requerida";
        if (!formData.Fecha_fin) tempErrors.Fecha_fin = "La fecha de fin es requerida";
        if (!formData.Requisitos) tempErrors.Requisitos = "Los requisitos son requeridos";
        if (!formData.Fecha_expiracion) tempErrors.Fecha_expiracion = "La fecha de expiración es requerida";
        if (!formData.Area_practica) tempErrors.Area_practica = "El área de práctica es requerida";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await axios.post('http://localhost:8080/Cpractica', formData);
                setSubmitMessage({ type: 'success', text: `Práctica creada exitosamente con ID: ${response.data.id_practica}` });
            } catch (error) {
                setSubmitMessage({ type: 'error', text: 'Error al crear la práctica: ' + (error.response?.data?.message || error.message) });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nueva Práctica</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <select
                        id="Modalidad"
                        name="Modalidad"
                        value={formData.Modalidad}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Seleccionar modalidad</option>
                        <option value="remoto">Remoto</option>
                        <option value="presencial">Presencial</option>
                        <option value="hibrido">Híbrido</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="Area_practica" className="block text-sm font-medium text-gray-700">Área de Práctica:</label>
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
                    <select
                        id="Jornada"
                        name="Jornada"
                        value={formData.Jornada}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Seleccionar jornada</option>
                        <option value="completa">Jornada Completa</option>
                        <option value="parcial">Media Jornada</option>
                    </select>
                </div>

                {submitMessage && (
                    <div className={`p-4 rounded-md ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {submitMessage.text}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Crear Práctica
                </button>
            </form>
        </div>
    );
};

export default Cpractica;