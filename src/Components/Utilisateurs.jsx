import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearchSharp } from "react-icons/io5";
import { MdPublishedWithChanges, MdDelete, MdCancel, MdCreateNewFolder } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";

function Utilisateurs({ getAuthHeaders, fetchStats }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ nom: "", email: "", mot_de_passe: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filtrage avant pagination
  const filteredUsers = users.filter(user => {
    const query = searchName.toLowerCase();
    return (
      user.nom.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const usersRes = await axios.get("http://localhost:8080/api/utilisateurs", { headers });
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
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

  const handleDelete = async (id) => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`http://localhost:8080/api/utilisateurs/${id}`, { headers });
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(`Erreur lors de la suppression: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUpdate = async () => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`http://localhost:8080/api/utilisateurs/${editingUser.id}`, editingUser, { headers });
      setEditingUser(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error("Error updating user:", err);
      setError(`Erreur lors de la mise à jour: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCreate = async () => {
    try {
      const headers = getAuthHeaders();
      await axios.post("http://localhost:8080/api/utilisateurs", newUser, { headers });
      setNewUser({ nom: "", email: "", mot_de_passe: "", role: "" });
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error("Error creating user:", err);
      setError(`Erreur lors de la création: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSearch = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1); // Réinitialiser à la page 1 après une recherche
  };

  if (loading) {
    return <div className="loading-container">Chargement des utilisateurs...</div>;
  }

  return (
    <div className="user-management-section">
      <div className="section-header">
        <h2 className="section-title">Gestion des Utilisateurs</h2>
        <p className="section-subtitle">Gérez facilement tous vos utilisateurs système</p>
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
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <td>{user.id}</td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      className="edit-input"
                      value={editingUser.nom}
                      onChange={e => setEditingUser({ ...editingUser, nom: e.target.value })}
                      placeholder="Nom complet"
                    />
                  ) : user.nom}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      className="edit-input"
                      type="email"
                      value={editingUser.email}
                      onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                      placeholder="Email"
                    />
                  ) : user.email}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <select
                      className="edit-input"
                      value={editingUser.role}
                      onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    >
                      <option value="ADMIN">Administrateur</option>
                      <option value="MEDCIN">Médecin</option>
                      <option value="PATIENT">Patient</option>
                    </select>
                  ) : (
                    <span className={`role-badge ${
                      user.role === 'ADMIN' ? 'role-admin' :
                      user.role === 'PATIENT' ? 'role-patient' :
                      'role-medecin'
                    }`}>
                      {user.role === 'ADMIN' ? 'Admin' :
                       user.role === 'MEDCIN' ? 'Médecin' :
                       'Patient'}
                    </span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingUser?.id === user.id ? (
                      <>
                        <button className="ubtn btn-save" onClick={handleUpdate}>
                          <FaRegCheckCircle /> Sauvegarder
                        </button>
                        <button className="ubtn btn-annuler" onClick={() => setEditingUser(null)}>
                          <MdCancel /> Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="ubtn btn-edit" onClick={() => setEditingUser(user)}>
                          <MdPublishedWithChanges /> Modifier
                        </button>
                        <button className="ubtn btn-delete" onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                            handleDelete(user.id);
                          }
                        }}>
                          <MdDelete /> Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>
                  {users.length === 0 ? 'Aucun utilisateur trouvé.' : 'Aucun utilisateur ne correspond à la recherche.'}
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

      {/* Add New User Form */}
      <div className="add-user-section">
        <h3 className="add-user-title">Ajouter un nouvel utilisateur</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-lebel" style={{ color: "#003f82" }}>Nom complet</label>
            <input
              type="text"
              className="form-input"
              placeholder="Entrez le nom complet"
              value={newUser.nom}
              onChange={e => setNewUser({ ...newUser, nom: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-lebel" style={{ color: "#003f82" }}>Adresse Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="utilisateur@example.com"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-lebel" style={{ color: "#003f82" }}>Mot de passe</label>
            <input
              type="password"
              className="form-input"
              placeholder="Entrez le mot de passe"
              value={newUser.mot_de_passe}
              onChange={e => setNewUser({ ...newUser, mot_de_passe: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-lebel" style={{ color: "#003f82" }}>Rôle</label>
            <select
              className="form-input"
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="">Sélectionner un rôle</option>
              <option value="ADMIN">Administrateur</option>
              <option value="MAITREOUVRAGE">Maître d'ouvrage</option>
              <option value="CONCURRENT">Concurrent</option>
            </select>
          </div>
        </div>
        <button className="btn-create" onClick={handleCreate}>
          <MdCreateNewFolder /> Créer l'utilisateur
        </button>
      </div>
    </div>
  );
}

export default Utilisateurs;