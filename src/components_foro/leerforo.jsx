import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Trash2,
  Edit,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CrearTemaForm from "./creartema";
import CommentEdit from "./actualizarcomentario";
import CrearComentario from "./crearcomentario";
import ReplyComment from "./respondercomentario";
import Cookies from "js-cookie";
import axios from "axios";

const formatDate = (dateString) => {
  try {
    const timestamp =
      typeof dateString === "number" ? dateString * 1000 : dateString;
    const date = new Date(timestamp);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return "Fecha no disponible";
    }

    // Opciones de formateo más legibles
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha no disponible";
  }
};

const themeColors = {
  light: {
    background: "bg-[#DAEDF2]",
    text: "text-[#1D4157]",
    cardBackground: "bg-white",
    cardBorder: "border-gray-200",
    cardShadow: "hover:shadow-md",
    commentBackground: "bg-white hover:bg-[#DAEDF2]/10",
    commentText: "text-[#1D4157]", // Dark text for light mode
    buttonBackground: "bg-white",
    buttonText: "text-[#1D4157]",
    accentText: "text-[#6B46C1]",
    dateText: "text-[#1D4157]/80",
    emptyCommentText: "text-[#1D4157]/60",
  },
  dark: {
    background: "bg-gray-900",
    text: "text-gray-200",
    cardBackground: "bg-gray-800",
    cardBorder: "border-gray-700",
    cardShadow: "hover:shadow-xl",
    commentBackground: "bg-gray-800 hover:bg-gray-700",
    commentText: "text-gray-200", // Light text for dark mode
    buttonBackground: "bg-gray-700",
    buttonText: "text-gray-200",
    accentText: "text-purple-400",
    dateText: "text-gray-400",
    emptyCommentText: "text-gray-400",
  },
};

const Comentario = ({
  comentario,
  onEliminar,
  onResponder,
  onUpdateSuccess,
  nivel = 0,
  temaId,
  theme,
}) => {
  const [mostrarRespuestas, setMostrarRespuestas] = useState(true);
  const [mostrarFormRespuesta, setMostrarFormRespuesta] = useState(false);
  const currentTheme = themeColors[theme];

  const handleResponderClick = (e) => {
    e.stopPropagation();
    setMostrarFormRespuesta(!mostrarFormRespuesta);
  };

  return (
    <div className="w-full">
      <div
        className={`
                rounded-lg 
                ${nivel > 0 ? "ml-8 mt-2" : "mt-2"}
                ${nivel > 0 ? "border-l-2 border-[#A3D9D3]" : ""}
            `}
      >
        <div
          className={`
                    p-3 rounded-lg transition-colors
                    ${currentTheme.commentBackground}
                    ${currentTheme.commentText}
                `}
        >
          <div className="mb-2">
            <p
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-[#1D4157]/70"
              }`}
            >
              {formatDate(comentario.fechaCreacion)}
            </p>
          </div>

          <div className={`mt-2 ${currentTheme.commentText} break-words`}>
            <CommentEdit
              commentId={comentario.id}
              initialContent={comentario.contenido}
              onUpdateSuccess={onUpdateSuccess}
              theme={theme} // Pass the theme prop
            />
          </div>

          <div className="flex gap-2 justify-end mt-2 items-center">
            <button
              onClick={handleResponderClick}
              className={`p-1 rounded-full transition-colors 
                                ${
                                  theme === "dark"
                                    ? "bg-gray-700 hover:bg-gray-600 text-purple-400 hover:text-purple-300"
                                    : "bg-white text-[#6B46C1] hover:text-[#6B46C1]/80 hover:bg-[#6B46C1]/10"
                                }`}
              title="Responder"
            >
              <Reply className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => onEliminar(e, comentario.id)}
              className={`p-1 rounded-full transition-colors 
                                ${
                                  theme === "dark"
                                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400 hover:text-yellow-300"
                                    : "bg-white text-[#FFD166] hover:text-[#FFD166]/80 hover:bg-[#FFD166]/10"
                                }`}
              title="Eliminar"
            >
              <Trash2 className="w-6 h-6" />
            </button>
            {comentario.respuestas?.length > 0 && (
              <button
                onClick={() => setMostrarRespuestas(!mostrarRespuestas)}
                className={`p-1 rounded-full transition-colors 
                                    ${
                                      theme === "dark"
                                        ? "bg-gray-700 hover:bg-gray-600 text-blue-400 hover:text-blue-300"
                                        : "bg-white text-[#0092BC] hover:text-[#0092BC]/80 hover:bg-[#0092BC]/10"
                                    }`}
                title={
                  mostrarRespuestas
                    ? "Ocultar respuestas"
                    : "Mostrar respuestas"
                }
              >
                {mostrarRespuestas ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {mostrarFormRespuesta && (
          <div className="ml-8 mt-2">
            <div
              className={`p-3 rounded-lg shadow-sm ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <ReplyComment
                temaId={temaId}
                comentarioPadreId={comentario.id}
                onComentarioCreado={(nuevoComentario) => {
                  onResponder(temaId, nuevoComentario, comentario.id);
                  setMostrarFormRespuesta(false);
                }}
              />
            </div>
          </div>
        )}
        {mostrarRespuestas &&
          comentario.respuestas &&
          comentario.respuestas.length > 0 && (
            <div className="w-full">
              {comentario.respuestas.map((respuesta) => (
                <Comentario
                  key={respuesta.id}
                  comentario={respuesta}
                  onEliminar={onEliminar}
                  onResponder={onResponder}
                  onUpdateSuccess={onUpdateSuccess}
                  nivel={nivel + 1}
                  temaId={temaId}
                  theme={theme}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

const TemasList = () => {
  const [temas, setTemas] = useState([]);
  const [comentariosPorTema, setComentariosPorTema] = useState({});
  const [temasExpandidos, setTemasExpandidos] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  const cookieOptions = {
    expires: 7,
    secure: window.location.protocol === "https:",
    sameSite: "Lax",
    path: "/",
  };

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = Cookies.get("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  useEffect(() => {
    const savedTheme = Cookies.get("theme") || "light";
    setTheme(savedTheme);

    // Observar cambios en el atributo data-theme del documento
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const newTheme = Cookies.get("theme") || "light";
          setTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const organizarComentarios = (comentarios) => {
    const comentariosPorId = new Map();
    comentarios.forEach((comentario) => {
      comentariosPorId.set(comentario.id, {
        ...comentario,
        respuestas: [],
      });
    });

    const comentariosRaiz = [];
    comentarios.forEach((comentario) => {
      const comentarioActual = comentariosPorId.get(comentario.id);
      if (comentario.parentId) {
        const padre = comentariosPorId.get(comentario.parentId);
        if (padre) {
          padre.respuestas.push(comentarioActual);
        }
      } else {
        comentariosRaiz.push(comentarioActual);
      }
    });

    const ordenarRespuestasPorFecha = (comentario) => {
      if (comentario.respuestas && comentario.respuestas.length > 0) {
        comentario.respuestas.sort(
          (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
        );
        comentario.respuestas.forEach(ordenarRespuestasPorFecha);
      }
    };

    comentariosRaiz.sort(
      (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
    );
    comentariosRaiz.forEach(ordenarRespuestasPorFecha);

    return comentariosRaiz;
  };

  const fetchTemas = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/temas`);
      if (!response.ok) {
        throw new Error("Error al cargar los temas");
      }
      let data = await response.json();
      data.sort(
        (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      );
      setTemas(data);
    } catch (err) {
      setError(err.message);
      alert("Error al cargar los temas: " + err.message); // Mostrar mensaje de error
    } finally {
      setLoading(false);
    }
  };

  const cargarComentarios = async (temaId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/temas/${temaId}/comentarios`);
      if (!response.ok) {
        throw new Error("Error al cargar los comentarios");
      }
      let data = await response.json();
      const comentariosOrganizados = organizarComentarios(data);

      setComentariosPorTema((prev) => ({
        ...prev,
        [temaId]: comentariosOrganizados,
      }));
    } catch (err) {
      setComentariosPorTema((prev) => ({
        ...prev,
        [temaId]: [],
      }));
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTemas();
  }, []);

  const toggleComentarios = async (e, temaId) => {
    e.stopPropagation();
    if (!temasExpandidos[temaId]) {
      await cargarComentarios(temaId);
    }
    setTemasExpandidos((prev) => ({
      ...prev,
      [temaId]: !prev[temaId],
    }));
  };

  const handleEliminar = async (e, comentarioId) => {
    e.stopPropagation();
    try {
      // Obtener el token de las cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          return parts.pop().split(";").shift();
        }
        return null;
      };

      const token = getCookie("authToken");
      if (!token) {
        throw new Error("No estás autenticado");
      }

      // Realizar la petición DELETE
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/comentarios/${comentarioId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // Incluir credenciales para cookies
        credentials: "include",
      });

      // Manejar respuesta no exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al eliminar el comentario");
      }

      // Recargar comentarios solo si la eliminación fue exitosa
      if (temasExpandidos) {
        Object.entries(temasExpandidos).forEach(([temaId, expandido]) => {
          if (expandido) {
            cargarComentarios(temaId);
          }
        });
      }

      alert("Comentario eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      setError(err.message);
      alert("Error al eliminar comentario: " + err.message); // Mostrar mensaje de error
    }
  };

  const handleResponder = async (temaId) => {
    await cargarComentarios(temaId);
  };

  const handleComentarioActualizado = async (temaId) => {
    await cargarComentarios(temaId);
  };

  const handleTemaCreado = (nuevoTema) => {
    setTemas((prev) => [nuevoTema, ...prev]);
  };

  const handleComentarioCreado = async (temaId) => {
    await cargarComentarios(temaId);
  };

  const currentTheme = themeColors[theme];

  if (loading)
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${currentTheme.background}`}
      >
        <p className={`${currentTheme.text} text-lg`}>Cargando temas...</p>
      </div>
    );
  if (error)
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${currentTheme.background}`}
      >
        <p className="text-red-500">Error:{error}</p>
      </div>
    );

  return (
    <main className={`min-h-screen ${currentTheme.background}`}>
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 ${currentTheme.text}`}
        >
          Foro de Discusión
        </h1>
        <CrearTemaForm
          onClose={() => {}}
          onTemaCreado={handleTemaCreado}
          theme={theme}
          className="w-full"
        />
        <div className="grid grid-cols-1 gap-4 mt-6">
          {temas.map((tema) => (
            <div
              key={tema.id}
              className={`border rounded-lg p-3 sm:p-4 transition-all duration-300
                                ${currentTheme.cardBackground} 
                                ${currentTheme.cardBorder} 
                                ${currentTheme.cardShadow}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <h2
                    className={`text-lg sm:text-xl font-semibold ${currentTheme.text} break-words`}
                    style={{ wordBreak: "break-word" }}
                  >
                    {tema.titulo}
                  </h2>
                  <p className={`${currentTheme.dateText} mt-1 text-sm`}>
                    {tema.descripcion}
                  </p>
                  <p className={`text-xs ${currentTheme.dateText} mt-1`}>
                    Creado el: {formatDate(tema.fechaCreacion)}
                  </p>
                </div>
                <button
                  onClick={(e) => toggleComentarios(e, tema.id)}
                  className={`
                                        p-2 rounded-full transition-colors 
                                        ${currentTheme.buttonBackground} 
                                        ${currentTheme.buttonText}

                                        hover:bg-opacity-80
                                        self-end sm:self-auto
                                    `}
                  title="Ver comentarios"
                >
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {temasExpandidos[tema.id] && (
                <div className="mt-4 space-y-3">
                  <CrearComentario
                    temaId={tema.id}
                    theme={theme}
                    onComentarioCreado={(nuevoComentario) =>
                      handleComentarioCreado(tema.id, nuevoComentario)
                    }
                  />

                  {comentariosPorTema[tema.id]?.length > 0 ? (
                    <div className="space-y-4">
                      {comentariosPorTema[tema.id].map((comentario) => (
                        <Comentario
                          key={comentario.id}
                          comentario={comentario}
                          onEliminar={handleEliminar}
                          onResponder={handleResponder}
                          onUpdateSuccess={() =>
                            handleComentarioActualizado(tema.id)
                          }
                          temaId={tema.id}
                          theme={theme}
                        />
                      ))}
                    </div>
                  ) : (
                    <p
                      className={`text-center py-4 text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-[#1D4157]/60"
                      }`}
                    >
                      No hay comentarios en este tema.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TemasList;
