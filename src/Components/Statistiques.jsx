import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUsers, 
  FaUserMd, 
  FaUserInjured, 
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaChartLine
} from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";

function Statistiques({ getAuthHeaders }) {
  const [statsGlobales, setStatsGlobales] = useState(null);
  const [statsRendezVous, setStatsRendezVous] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistiques();
  }, []);

  const fetchStatistiques = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      
      // Récupérer les statistiques globales
      const statsGlobalesRes = await axios.get(
        "http://localhost:8080/api/administrateurs/statistiques",
        { headers }
      );
      setStatsGlobales(statsGlobalesRes.data);

      // Récupérer les statistiques des rendez-vous
      const statsRdvRes = await axios.get(
        "http://localhost:8080/api/administrateurs/statistiques/rendez-vous",
        { headers }
      );
      setStatsRendezVous(statsRdvRes.data);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
      setError(`Erreur: ${err.response?.data?.message || err.message}`);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userRole");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchStatistiques} className="btn-retry">
          Réessayer
        </button>
      </div>
    );
  }

  const stats = statsGlobales || {};
  const totalRdv = stats.nombreTotalRendezVous || 0;

  return (
    <div className="user-management-section">
      {/* Header Section */}
      <div className="section-header">
        <h2 className="section-title">
          Statistiques
        </h2>
        <p className="section-subtitle">Vue d'ensemble des données de la plateforme HealthHub</p>
      </div>

      {/* Statistiques Générales */}
      <div className="stats-section">
        <h3 className="stats-section-title">Statistiques Générales</h3>
        <div className="stats-grid">
          {/* Total Utilisateurs */}
          <div className="stat-card card-purple">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h4>Total Utilisateurs</h4>
              <p className="stat-number">{stats.nombreTotalUtilisateurs || 0}</p>
              <span className="stat-label">Utilisateurs inscrits</span>
            </div>
          </div>

          {/* Total Patients */}
          <div className="stat-card card-green">
            <div className="stat-icon">
              <FaUserInjured />
            </div>
            <div className="stat-content">
              <h4>Patients</h4>
              <p className="stat-number">{stats.nombreTotalPatients || 0}</p>
              <span className="stat-label">Patients enregistrés</span>
            </div>
          </div>

          {/* Total Médecins */}
          <div className="stat-card card-blue">
            <div className="stat-icon">
              <FaUserMd />
            </div>
            <div className="stat-content">
              <h4>Médecins</h4>
              <p className="stat-number">{stats.nombreTotalMedecins || 0}</p>
              <span className="stat-label">Médecins disponibles</span>
            </div>
          </div>

          {/* Total Rendez-vous */}
          <div className="stat-card card-orange">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h4>Rendez-vous</h4>
              <p className="stat-number">{stats.nombreTotalRendezVous || 0}</p>
              <span className="stat-label">Total des rendez-vous</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques des Rendez-vous */}
      <div className="stats-section">
        <h3 className="stats-section-title">Répartition des Rendez-vous par Statut</h3>
        <div className="stats-grid-rdv">
          {/* En Attente */}
          <div className="stat-card-rdv card-waiting">
            <div className="stat-rdv-header">
              <MdPendingActions className="stat-rdv-icon" />
              <span className="stat-rdv-title">En Attente</span>
            </div>
            <div className="stat-rdv-body">
              <p className="stat-rdv-number">{stats.nombreRendezVousEnAttente || 0}</p>
              <div className="stat-progress-bar">
                <div 
                  className="stat-progress-fill bg-warning"
                  style={{ width: `${calculatePercentage(stats.nombreRendezVousEnAttente, totalRdv)}%` }}
                ></div>
              </div>
              <span className="stat-percentage">
                {calculatePercentage(stats.nombreRendezVousEnAttente, totalRdv)}% du total
              </span>
            </div>
          </div>

          {/* Confirmés */}
          <div className="stat-card-rdv card-confirmed">
            <div className="stat-rdv-header">
              <FaClock className="stat-rdv-icon" />
              <span className="stat-rdv-title">Confirmés</span>
            </div>
            <div className="stat-rdv-body">
              <p className="stat-rdv-number">{stats.nombreRendezVousConfirmes || 0}</p>
              <div className="stat-progress-bar">
                <div 
                  className="stat-progress-fill bg-info"
                  style={{ width: `${calculatePercentage(stats.nombreRendezVousConfirmes, totalRdv)}%` }}
                ></div>
              </div>
              <span className="stat-percentage">
                {calculatePercentage(stats.nombreRendezVousConfirmes, totalRdv)}% du total
              </span>
            </div>
          </div>

          {/* Terminés */}
          <div className="stat-card-rdv card-completed">
            <div className="stat-rdv-header">
              <FaCheckCircle className="stat-rdv-icon" />
              <span className="stat-rdv-title">Terminés</span>
            </div>
            <div className="stat-rdv-body">
              <p className="stat-rdv-number">{stats.nombreRendezVousTermines || 0}</p>
              <div className="stat-progress-bar">
                <div 
                  className="stat-progress-fill bg-success"
                  style={{ width: `${calculatePercentage(stats.nombreRendezVousTermines, totalRdv)}%` }}
                ></div>
              </div>
              <span className="stat-percentage">
                {calculatePercentage(stats.nombreRendezVousTermines, totalRdv)}% du total
              </span>
            </div>
          </div>

          {/* Annulés */}
          <div className="stat-card-rdv card-cancelled">
            <div className="stat-rdv-header">
              <FaTimesCircle className="stat-rdv-icon" />
              <span className="stat-rdv-title">Annulés</span>
            </div>
            <div className="stat-rdv-body">
              <p className="stat-rdv-number">{stats.nombreRendezVousAnnules || 0}</p>
              <div className="stat-progress-bar">
                <div 
                  className="stat-progress-fill bg-danger"
                  style={{ width: `${calculatePercentage(stats.nombreRendezVousAnnules, totalRdv)}%` }}
                ></div>
              </div>
              <span className="stat-percentage">
                {calculatePercentage(stats.nombreRendezVousAnnules, totalRdv)}% du total
              </span>
            </div>
          </div>

          {/* Refusés */}
          <div className="stat-card-rdv card-refused">
            <div className="stat-rdv-header">
              <FaBan className="stat-rdv-icon" />
              <span className="stat-rdv-title">Refusés</span>
            </div>
            <div className="stat-rdv-body">
              <p className="stat-rdv-number">{stats.nombreRendezVousRefuses || 0}</p>
              <div className="stat-progress-bar">
                <div 
                  className="stat-progress-fill bg-dark"
                  style={{ width: `${calculatePercentage(stats.nombreRendezVousRefuses, totalRdv)}%` }}
                ></div>
              </div>
              <span className="stat-percentage">
                {calculatePercentage(stats.nombreRendezVousRefuses, totalRdv)}% du total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé Global */}
      <div className="stats-section">
        <h3 className="stats-section-title">Résumé Global</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Taux d'Occupation</h4>
            <p className="summary-value">
              {stats.nombreTotalMedecins > 0 
                ? ((stats.nombreTotalRendezVous / stats.nombreTotalMedecins) * 10).toFixed(1)
                : 0}%
            </p>
            <span className="summary-label">Rendez-vous par médecin</span>
          </div>

          <div className="summary-card">
            <h4>Taux de Complétion</h4>
            <p className="summary-value">
              {calculatePercentage(stats.nombreRendezVousTermines, totalRdv)}%
            </p>
            <span className="summary-label">Rendez-vous terminés</span>
          </div>

          <div className="summary-card">
            <h4>Taux d'Annulation</h4>
            <p className="summary-value">
              {calculatePercentage(
                (stats.nombreRendezVousAnnules || 0) + (stats.nombreRendezVousRefuses || 0),
                totalRdv
              )}%
            </p>
            <span className="summary-label">Annulés + Refusés</span>
          </div>

          <div className="summary-card">
            <h4>Rendez-vous Actifs</h4>
            <p className="summary-value">
              {(stats.nombreRendezVousEnAttente || 0) + (stats.nombreRendezVousConfirmes || 0)}
            </p>
            <span className="summary-label">En attente + Confirmés</span>
          </div>
        </div>
      </div>

      {/* Bouton de rafraîchissement */}
      <div className="refresh-section">
        <button onClick={fetchStatistiques} className="btn-refresh">
          <FaChartLine style={{ marginRight: '8px' }} />
          Actualiser les statistiques
        </button>
      </div>
    </div>
  );
}

export default Statistiques;