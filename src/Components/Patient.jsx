import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearchSharp } from "react-icons/io5";

import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";

function Patient({ getAuthHeaders, fetchStats ,userId}) {
  const [patient, setPatient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filtrage avant pagination
  const filteredPatients = patient.filter(p => {
    const query = searchName.toLowerCase();
    return (
      p.nom.toLowerCase().includes(query) ||
      p.prenom.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.role.toLowerCase().includes(query)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  useEffect(() => {
    fetchStats();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const patientsRes = await axios.get(`http://localhost:8080/api/medecins/${userId}/patients`, { headers });
      setPatient(patientsRes.data);
    } catch (err) {
      console.error("Erreur lors du chargement des patients:", err);
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

  
  const handleSearch = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1); // Réinitialiser à la page 1 après une recherche
  };

  if (loading) {
    return <div className="loading-container">Chargement des patients...</div>;
  }

  return (
    <div className="user-management-section">
      <div className="section-header">
        <h2 className="section-title">Liste des Patients</h2>
        <p className="section-subtitle">Voir les patients associés à vous</p>
      </div>

      {/* Search Bar */}
      <div className="user-search-container">
        <div className="search-container">
          <IoSearchSharp className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou rôle..."
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

      {/* Users Table */}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient, index) => (
              <tr key={patient.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <td>{patient.id}</td>
                <td>
                  {patient.nom}
                </td>
                <td>
                  {patient.prenom}
                </td>
                <td>
                  {patient.email}
                </td>
                <td>
                  { patient.telephone}
                </td>
                <td>
                  {
                    <span className={`role-badge ${
                      patient.role === 'ADMIN' ? 'role-admin' :
                      patient.role === 'PATIENT' ? 'role-patient' :
                      'role-medecin'
                    }`}>
                      {patient.role === 'ADMIN' ? 'Admin' :
                       patient.role === 'MEDCIN' ? 'Médecin' :
                       'Patient'}
                    </span>
                  }
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>
                  {patient.length === 0 ? 'Aucun patient trouvé.' : 'Aucun patient ne correspond à la recherche.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}><TbPlayerTrackPrevFilled/></button>
        <span>Page {currentPage} sur {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}><TbPlayerTrackNextFilled/></button>
      </div>
    </div>
  );
}

export default Patient;