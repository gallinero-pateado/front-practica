import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const uid = localStorage.getItem('uid');
  const ws = useRef(null);
  const retryInterval = useRef(null);

  // Función para manejar WebSocket y reconexión
  const handleWebSocket = () => {
    if (!uid) {
      console.error("No UID found in localStorage");
      return;
    }

    const wsUrl = `ws://localhost:8080/ws/${uid}`;
    console.log("Attempting WebSocket connection to:", wsUrl);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
        setHasNewNotifications(true);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.current.onclose = (event) => {
      if (event.code !== 1000) { // Código 1000 es cierre limpio
        console.warn("WebSocket closed unexpectedly, reconnecting...");
        retryInterval.current = setTimeout(handleWebSocket, 3000);
      } else {
        console.log("WebSocket closed cleanly");
      }
    };
  };

  useEffect(() => {
    handleWebSocket();

    // Limpiar intervalos de reconexión y cerrar WebSocket al desmontar el componente
    return () => {
      clearTimeout(retryInterval.current);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [uid]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (hasNewNotifications) {
      setHasNewNotifications(false);
    }
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) => prevNotifications.filter(notification => notification.ID_remitente !== id));
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



