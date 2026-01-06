import { useState, useEffect } from 'react';
import api from '../api/axios';
import { IoSearchSharp } from "react-icons/io5";
import { MdCheck } from "react-icons/md";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
function RendezVousMedecin({getAuthHeaders, fetchStats,userId}) {

    const [rendezVous, setRendezVous] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const itemsPerPage = 4;

  // Filtrage avant pagination
  const filteredRendezVous = rendezVous.filter(rd => {
    const query = searchName.toLowerCase();
    return (
      rd.dateDebut.toLowerCase().includes(query) ||
      rd.dateFin.toLowerCase().includes(query) ||
      rd.motif.toLowerCase().includes(query) ||
      rd.statut.toLowerCase().includes(query) ||
      rd.patient.nom.toLowerCase().includes(query) ||
      rd.patient.prenom.toLowerCase().includes(query) ||
      rd.medecin.nom.toLowerCase().includes(query) ||
      rd.medecin.prenom.toLowerCase().includes(query)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRendezVous = filteredRendezVous.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRendezVous.length / itemsPerPage);

  useEffect(() => {
    fetchRendezVous();
  }, []);

  const fetchRendezVous = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const rendezVousRes = await api.get(`/medecins/${userId}/rendez-vous`, { headers });
      setRendezVous(rendezVousRes.data);
    } catch (err) {
      console.error("Erreur lors du chargement des rendez vous : ", err);
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

  const validerRendezvous = async (id) => {
    try {
      const headers = getAuthHeaders();
      await api.put(`/medecins/${userId}/rendez-vous/${id}/valider`, {rendezVous},{ headers });
      fetchRendezVous();
      fetchStats();
    } catch (err) {
      console.error("Error Validating rendez-vous :", err);
      setError(`Erreur lors de validation du rendez-vous: ${err.response?.data?.message || err.message}`);
    }
  };
  
  const refuserRendezvous = async (id) => {
    try {
      const headers = getAuthHeaders();
      await api.put(`/medecins/${userId}/rendez-vous/${id}/refuser`, {rendezVous},{ headers });
      fetchRendezVous();
      fetchStats();
    } catch (err) {
      console.error("Error deleting rendez-vous :", err);
      setError(`Erreur lors de la suppression: ${err.response?.data?.message || err.message}`);
    }
  };

  const completerRendezvous = async (id) => {
    try {
      const headers = getAuthHeaders();
      await api.put(`/medecins/${userId}/rendez-vous/${id}/completer`,{rendezVous}, { headers });
      fetchRendezVous();
      fetchStats();
    } catch (err) {
      console.error("Error deleting rendez-vous :", err);
      setError(`Erreur lors de la suppression: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const headers = getAuthHeaders();
      await api.put(`/administrateurs/rendez-vous/${id}/statut`, 
        { statut: newStatus }, 
        { headers }
      );
      fetchRendezVous();
      fetchStats();
      setEditingId(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
      setError(`Erreur: ${err.response?.data?.message || err.message}`);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'EN_ATTENTE': 'En attente',
      'CONFIRME': 'Confirmé',
      'TERMINE': 'Terminé',
      'ANNULE': 'Annulé',
      'REFUSE': 'Refusé'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'EN_ATTENTE': 'waiting',
      'CONFIRME': 'confirmed',
      'TERMINE': 'completed',
      'ANNULE': 'cancelled',
      'REFUSE': 'refused'
    };
    return statusMap[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'EN_ATTENTE': '⏳',
      'CONFIRME': '✅',
      'TERMINE': '🎯',
      'ANNULE': '❌',
      'REFUSE': '🚫'
    };
    return iconMap[status] || '📄';
  };

  const handleSearch = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };
    
      if (loading) {
        return <div className="loading-container">Chargement des rendez vous...</div>;
      }
    
      return (
        <div className="user-management-section">
          <div className="section-header">
            <h2 className="section-title">Gestion des Rendez Vous</h2>
            <p className="section-subtitle">Voici la liste des rendez vous</p>
          </div>
    
          {/* Search Bar */}
          <div className="user-search-container">
            <div className="search-container">
              <IoSearchSharp className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher par nom du Patient ,nom du Médecin, motif , email ou rôle..."
                className="search-input"
                value={searchName}
                onChange={handleSearch}
              />
            </div>
          </div>
    
          {/* Error Display */}
          {error && (
            <div className="admin-dashboard-error fade-in" style={{ color: 'red', padding: '10px', margin: '10px 0' }}>
              {error}
              <button onClick={() => setError(null)} style={{ marginLeft: '10px',color: 'red',background: 'transparent', border: 'none', fontSize: '30px', cursor: 'pointer' }}>×</button>
            </div>
          )}
    
          {/* RendezVous Table */}
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Médecin</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Statut</th>
                  <th>Motif</th>
                  <th >Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRendezVous.map((rd, index) => (
                  <tr key={rd.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <td>{rd.id}</td>
                    <td>{rd.patient.nom + " " + rd.patient.prenom}</td>
                    <td>{rd.medecin.nom + " " + rd.medecin.prenom}</td>
                    <td>{rd.dateDebut}</td>
                    <td>{rd.dateFin}</td>
                    <td>
                      {editingId === rd.id ? (
                        <select
                          className="status-edit-select"
                          value={rd.statut}
                          onChange={(e) => handleStatusChange(rd.id, e.target.value)}
                          autoFocus
                        >
                          <option value="EN_ATTENTE">⏳ En attente</option>
                          <option value="CONFIRME">✅ Confirmé</option>
                          <option value="TERMINE">🎯 Terminé</option>
                          <option value="ANNULE">❌ Annulé</option>
                          <option value="REFUSE">🚫 Refusé</option>
                        </select>
                      ) : (
                        <div 
                          className={`status-pill ${getStatusClass(rd.statut)}`}
                          onClick={() => setEditingId(rd.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {getStatusIcon(rd.statut)}
                          <span>{getStatusLabel(rd.statut)}</span>
                        </div>
                      )}
                    </td>
                    <td>{rd.motif}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="ubtn btn-save" 
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir valider ce rendez-vous ?')) {
                              validerRendezvous(rd.id);
                            }
                          }}
                        >
                          <MdCheck /> Valider
                        </button>
                        <button 
                          className="ubtn btn-delete" 
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir refuser ce rendez-vous ?')) {
                              refuserRendezvous(rd.id);
                            }
                          }}
                        >
                          <MdCheck /> Refuser
                        </button>
                        <button 
                          className="ubtn btn-complete" 
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir completer ce rendez-vous ?')) {
                              completerRendezvous(rd.id);
                            }
                          }}
                        >
                          <MdCheck /> Completer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRendezVous.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>
                      {rendezVous.length === 0 ? 'Aucun rendez-vous trouvé.' : 'Aucun rendez-vous ne correspond à la recherche.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
    
          {/* Pagination Controls */}
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              <TbPlayerTrackPrevFilled/>
            </button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              <TbPlayerTrackNextFilled/>
            </button>
          </div>
    </div>
    );
}
export default RendezVousMedecin;