import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Upractica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Titulo: '',
    Descripcion: '',
    Id_Empresa: '',
    Ubicacion: '',
    Fecha_inicio: '',
    Fecha_fin: '',
    Requisitos: '',
    Fecha_expiracion: '',
    Id_estado_practica: '',
    Modalidad: '',
    Area_practica: '',
    Jornada: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPractica = async () => {
      try {
        const response = await axios.get(`/api/practicas/${id}`);
        const practicaData = response.data;
        setFormData({
          Titulo: practicaData.Titulo,
          Descripcion: practicaData.Descripcion,
          Id_Empresa: practicaData.Id_empresa,
          Ubicacion: practicaData.Ubicacion,
          Fecha_inicio: new Date(practicaData.Fecha_inicio).toISOString().split('T')[0],
          Fecha_fin: new Date(practicaData.Fecha_fin).toISOString().split('T')[0],
          Requisitos: practicaData.Requisitos,
          Fecha_expiracion: new Date(practicaData.Fecha_expiracion).toISOString().split('T')[0],
          Id_estado_practica: practicaData.Id_estado_practica,
          Modalidad: practicaData.Modalidad,
          Area_practica: practicaData.Area_practica,
          Jornada: practicaData.Jornada,
        });
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos de la práctica');
        setLoading(false);
      }
    };

    fetchPractica();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/practicas/${id}`, formData);
      alert('Práctica actualizada con éxito');
      navigate('/practicas'); // Asumiendo que tienes una ruta para listar las prácticas
    } catch (err) {
      setError('Error al actualizar la práctica');
    }
  };

  if (loading) return <div className="text-center py-4">Cargando...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Actualizar Práctica</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="Titulo" className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="Titulo"
            id="Titulo"
            value={formData.Titulo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="Descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="Descripcion"
            id="Descripcion"
            value={formData.Descripcion}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="Ubicacion" className="block text-sm font-medium text-gray-700">Ubicación</label>
          <input
            type="text"
            name="Ubicacion"
            id="Ubicacion"
            value={formData.Ubicacion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="Fecha_inicio" className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
          <input
            type="date"
            name="Fecha_inicio"
            id="Fecha_inicio"
            value={formData.Fecha_inicio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="Fecha_fin" className="block text-sm font-medium text-gray-700">Fecha de fin</label>
          <input
            type="date"
            name="Fecha_fin"
            id="Fecha_fin"
            value={formData.Fecha_fin}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="Requisitos" className="block text-sm font-medium text-gray-700">Requisitos</label>
          <textarea
            name="Requisitos"
            id="Requisitos"
            value={formData.Requisitos}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="Fecha_expiracion" className="block text-sm font-medium text-gray-700">Fecha de expiración</label>
          <input
            type="date"
            name="Fecha_expiracion"
            id="Fecha_expiracion"
            value={formData.Fecha_expiracion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="Modalidad" className="block text-sm font-medium text-gray-700">Modalidad</label>
          <input
            type="text"
            name="Modalidad"
            id="Modalidad"
            value={formData.Modalidad}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="Area_practica" className="block text-sm font-medium text-gray-700">Área de práctica</label>
          <input
            type="text"
            name="Area_practica"
            id="Area_practica"
            value={formData.Area_practica}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="Jornada" className="block text-sm font-medium text-gray-700">Jornada</label>
          <input
            type="text"
            name="Jornada"
            id="Jornada"
            value={formData.Jornada}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Actualizar Práctica
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upractica;