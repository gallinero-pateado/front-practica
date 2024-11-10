import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Obtener el uid del localStorage
  const uid = localStorage.getItem('uid');

  useEffect(() => {
    // Validar que el uid exista antes de proceder
    if (!uid) {
      console.error("No UID found in localStorage");
      return;
    }

    // Establece la URL del WebSocket con el UID y verifica su valor
    const wsUrl = `ws://localhost:8080/ws/${uid}`;
    console.log("Connecting to WebSocket at:", wsUrl); // Verifica la URL en consola
    const ws = new WebSocket(wsUrl);

    // Manejar mensajes recibidos
    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
      setHasNewNotifications(true);
    };

    // Manejo de errores en la conexión WebSocket
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Manejo de cierre de la conexión WebSocket
    ws.onclose = (event) => {
      console.log("WebSocket Closed:", event);
    };

    // Limpiar al desmontar el componente
    return () => {
      ws.close();
    };
  }, [uid]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (hasNewNotifications) {
      setHasNewNotifications(false);
    }
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.ID_remitente !== id));
  };

  return (
    <div className="relative">
      <button 
        onClick={handleBellClick}
        className="relative bg-[#1D4157] border border-[#DAEDF2] rounded-full p-2"
        style={{ width: '40px', height: '40px' }}
      >
        <BellIcon className={`h-6 w-6 ${showNotifications ? 'text-[#FFD166]' : 'text-gray-200'}`} />
        {hasNewNotifications && notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-[#FFD166] text-[#1D4157] font-bold text-xs flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg overflow-y-auto max-h-64">
          <ul>
            {notifications.map((notification) => (
              <li key={notification.ID_remitente} className="p-2 border-b border-gray-200 text-black flex justify-between items-center">
                <span>{notification.Contenido}</span>
                <button 
                  onClick={() => handleDeleteNotification(notification.ID_remitente)}
                  className="bg-[#1D4157] rounded-full p-1 flex items-center justify-center"
                  style={{ width: '24px', height: '24px' }}
                >
                  <span className="text-[#FFD166] font-bold">&times;</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

