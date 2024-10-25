import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline'; 

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  useEffect(() => {
    const mockData = [
      { id: 1, nom_estado_postulacion: 'Nueva postulación recibida' },
      { id: 2, nom_estado_postulacion: 'Postulación aprobada' },
      { id: 3, nom_estado_postulacion: 'Postulación rechazada' },
      { id: 4, nom_estado_postulacion: 'Documentos pendientes' },
      { id: 5, nom_estado_postulacion: 'Entrevista programada' }
    ];
    
    setNotifications(mockData);
  }, []);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (hasNewNotifications) {
      setHasNewNotifications(false);
    }
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    setNotificationToDelete(null);
  };

  return (
    <div className="relative">
      <button 
        onClick={handleBellClick}
        className="relative"
      >
        <BellIcon className={`h-6 w-6 ${showNotifications ? 'text-white' : 'text-gray-500'}`} />
        {hasNewNotifications && notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg overflow-y-auto max-h-64">
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="p-2 border-b border-gray-200 text-black flex justify-between items-center">
                <span>{notification.nom_estado_postulacion}</span>
                <button 
                  onClick={() => setNotificationToDelete(notification.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &#x22EE; 
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {notificationToDelete !== null && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-black mb-4">Eliminar notificación</p>
          <button 
            onClick={() => handleDeleteNotification(notificationToDelete)}
            className="bg-red-600 text-white px-3 py-2 rounded font-bold text-lg hover:bg-red-700 transition duration-300"
          >
            Confirmar
          </button>
          <button 
            onClick={() => setNotificationToDelete(null)}
            className="ml-2 bg-gray-300 text-black px-3 py-2 rounded font-bold text-lg hover:bg-gray-400 transition duration-300"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;