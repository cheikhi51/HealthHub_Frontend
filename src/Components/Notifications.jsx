import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  IoCheckmarkDone, 
  IoCheckmark, 
  IoTime,
  IoCalendar,
  IoPerson,
  IoTrash,
  IoEye,
  IoEyeOff
} from "react-icons/io5";
import { 
  FaBell, 
  FaRegBell, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";

function Notifications({ getAuthHeaders, fetchStats, userId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`http://localhost:8080/api/patients/${userId}/notifications`, { headers });
      setNotifications(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des notifications:", err);
      setError("Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`http://localhost:8080/api/patients/notifications/${notificationId}/read`, {}, { headers });
      
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, lu: true, dateLecture: new Date().toISOString() }
          : notif
      ));
      
      fetchStats(); // Rafraîchir les stats
    } catch (err) {
      console.error("Erreur lors du marquage comme lu:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const headers = getAuthHeaders();
      await axios.put("http://localhost:8080/api/patients/notifications/read-all", {}, { headers });
      
      setNotifications(prev => prev.map(notif => ({
        ...notif, 
        lu: true, 
        dateLecture: new Date().toISOString()
      })));
      
      fetchStats();
    } catch (err) {
      console.error("Erreur lors du marquage tout comme lu:", err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`http://localhost:8080/api/patients/notifications/${notificationId}`, { headers });
      
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
      fetchStats();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const deleteSelected = async () => {
    try {
      const headers = getAuthHeaders();
      await Promise.all(
        selectedNotifications.map(id => 
          axios.delete(`http://localhost:8080/api/patients/notifications/${id}`, { headers })
        )
      );
      
      setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
      setSelectedNotifications([]);
      fetchStats();
    } catch (err) {
      console.error("Erreur lors de la suppression multiple:", err);
    }
  };

  const toggleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAll = () => {
    const filteredIds = getFilteredNotifications().map(notif => notif.id);
    setSelectedNotifications(filteredIds);
  };

  const deselectAll = () => {
    setSelectedNotifications([]);
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notif => !notif.lu);
      case 'read':
        return notifications.filter(notif => notif.lu);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (notification) => {
    if (notification.message?.includes('confirmé')) {
      return <FaCheckCircle className="notification-icon confirmed" />;
    } else if (notification.message?.includes('refusé')) {
      return <FaExclamationTriangle className="notification-icon cancelled" />;
    } else if (notification.message?.includes('rapport') || notification.message?.includes('résultat')) {
      return <FaInfoCircle className="notification-icon info" />;
    }
    return <FaRegBell className="notification-icon default" />;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(notif => !notif.lu).length;

  if (loading) {
    return (
      <div className="notifications-section">
        <div className="notifications-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-section">
      {/* En-tête */}
      <h2 className="section-title">Mes Notifications</h2>
      <div className="notifications-header">
        <div className="notifications-title">
          <div>
            <p className="section-subtitle">
              {unreadCount > 0 
                ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                : 'Toutes vos notifications sont à jour'
              }
            </p>
          </div>
        </div>
        
        <div className="notifications-actions">
          {selectedNotifications.length > 0 && (
            <button 
              className="btn-delete-selected"
              onClick={deleteSelected}
            >
              <IoTrash />
              Supprimer ({selectedNotifications.length})
            </button>
          )}
          
          {unreadCount > 0 && (
            <button 
              className="btn-mark-all-read"
              onClick={markAllAsRead}
            >
              <IoCheckmarkDone />
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Filtres et actions */}
      <div className="notifications-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({notifications.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Non lues ({unreadCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Lues ({notifications.length - unreadCount})
          </button>
        </div>

        <div className="selection-actions">
          {selectedNotifications.length > 0 ? (
            <>
              <button className="btn-select" onClick={deselectAll}>
                Tout désélectionner
              </button>
              <span className="selection-count">
                {selectedNotifications.length} sélectionné(s)
              </span>
            </>
          ) : (
            <button className="btn-select" onClick={selectAll}>
              Tout sélectionner
            </button>
          )}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="notifications-list">
        {error && (
          <div className="notifications-error">
            <FaExclamationTriangle />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <FaRegBell className="empty-icon" />
            <h3>Aucune notification</h3>
            <p>
              {filter === 'all' 
                ? "Vous n'avez aucune notification pour le moment."
                : filter === 'unread'
                ? "Vous n'avez aucune notification non lue."
                : "Vous n'avez aucune notification lue."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`notification-card ${notification.lu ? 'read' : 'unread'} ${
                selectedNotifications.includes(notification.id) ? 'selected' : ''
              }`}
            >
              {/* Checkbox de sélection */}
              <div className="notification-select">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => toggleSelectNotification(notification.id)}
                  className="selection-checkbox"
                />
              </div>

              {/* Icone */}
              <div className="notification-icon-container">
                {getNotificationIcon(notification)}
              </div>

              {/* Contenu */}
              <div className="notification-content">
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-meta">
                  <span className="notification-time">
                    <IoTime />
                    {getTimeAgo(notification.dateEnvoi)}
                  </span>
                  {notification.dateLecture && (
                    <span className="notification-read-time">
                      <IoCheckmark />
                      Lu {getTimeAgo(notification.dateLecture)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="notification-actions">
                {!notification.lu && (
                  <button
                    className="btn-mark-read"
                    onClick={() => markAsRead(notification.id)}
                    title="Marquer comme lu"
                  >
                    <IoEyeOff />
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => deleteNotification(notification.id)}
                  title="Supprimer"
                >
                  <IoTrash />
                </button>
              </div>

              {/* Indicateur non lu */}
              {!notification.lu && <div className="unread-indicator"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;