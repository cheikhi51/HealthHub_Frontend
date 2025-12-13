import { useState, useEffect } from "react";
import axios from "axios";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaTrash } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { FaEye, FaFilter } from "react-icons/fa";

function HistoriqueAdmin({ getAuthHeaders, userId }) {
    const [historiques, setHistoriques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historiqueByUser, setHistoriqueByUser] = useState([]);
    const [historiqueCountByUser, setHistoriqueCountByUser] = useState({});
    const [error, setError] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [actionTypeFilter, setActionTypeFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const itemsPerPage = 5;

    // Filtres avancés
    const filtredHistoriques = historiques.filter(hist => {
        const query = searchName.toLowerCase();
        const matchesSearch = 
            hist.actionType.toLowerCase().includes(query) ||
            hist.details.toLowerCase().includes(query) ||
            hist.dateAction.toLowerCase().includes(query) ||
            hist.utilisateur.nom.toLowerCase().includes(query) ||
            hist.utilisateur.email.toLowerCase().includes(query) ||
            hist.utilisateur.role.toLowerCase().includes(query);

        const matchesActionType = actionTypeFilter === "all" || hist.actionType === actionTypeFilter;

        let matchesDate = true;
        if (dateFilter !== "all") {
            const histDate = new Date(hist.dateAction);
            const now = new Date();
            const diffDays = Math.floor((now - histDate) / (1000 * 60 * 60 * 24));
            
            if (dateFilter === "today") matchesDate = diffDays === 0;
            else if (dateFilter === "week") matchesDate = diffDays <= 7;
            else if (dateFilter === "month") matchesDate = diffDays <= 30;
        }

        return matchesSearch && matchesActionType && matchesDate;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentHistoriques = filtredHistoriques.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtredHistoriques.length / itemsPerPage);

    // Récupérer les types d'actions uniques
    const uniqueActionTypes = [...new Set(historiques.map(h => h.actionType))];

    useEffect(() => {
        fetchHistorque();
    }, []);

    const fetchHistorque = async () => {
        setLoading(true);
        try {
            const headers = getAuthHeaders();
            const res = await axios.get("http://localhost:8080/api/historiques", { headers });
            setHistoriques(res.data); 
        } catch (err) {
            console.error("Erreur lors de la récupération de l'historique:", err);
            setError("Erreur lors de la récupération de l'historique.");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistorqueByUserId = async (userId) => {
        try {
            const headers = getAuthHeaders();
            const [utilisateurHistRes, historiqueCountByUseRes, recentRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/historiques/utilisateur/${userId}`, { headers }),
                axios.get(`http://localhost:8080/api/historiques/utilisateur/${userId}/count`, { headers }),
                axios.get(`http://localhost:8080/api/historiques/utilisateur/${userId}/recent`, { headers })
            ]);
            
            setHistoriqueCountByUser(historiqueCountByUseRes.data);
            setHistoriqueByUser(utilisateurHistRes.data);
            
            // Afficher le modal avec les détails
            const user = historiques.find(h => h.utilisateur.id === userId)?.utilisateur;
            setSelectedUser({
                ...user,
                historique: utilisateurHistRes.data,
                nombreActions: historiqueCountByUseRes.data.nombreActions,
                actionsRecentes: recentRes.data
            });
            setShowUserModal(true);
        } catch (err) {
            console.error("Erreur lors de la récupération de l'historique de l'utilisateur:", err);
            setError("Erreur lors de la récupération de l'historique.");
        }
    };

    const handleDeleteHistorique = async (histId) => {
        try{
            const headers = getAuthHeaders();
            await axios.delete(`http://localhost:8080/api/historiques/${histId}`, { headers });
            fetchHistorque();
        } catch (err) {
            console.error("Erreur lors de la suppression de l'historique:", err);
            setError("Erreur lors de la suppression de l'historique.");     
        }
    };

    const handleSearch = (e) => {
        setSearchName(e.target.value);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading-container">Chargement d'historique...</div>;
    }

    return ( 
        <div className="user-management-section">
            <h1 className="section-title">Historique des utilisateurs</h1>

            {/* Statistiques globales */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1, padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>Total Actions</h3>
                    <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold' }}>{historiques.length}</p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: '#f0fdf4', borderRadius: '8px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#15803d' }}>Utilisateurs Actifs</h3>
                    <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold' }}>
                        {new Set(historiques.map(h => h.utilisateur.id)).size}
                    </p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#a16207' }}>Types d'actions</h3>
                    <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold' }}>{uniqueActionTypes.length}</p>
                </div>
            </div>

            {/* Filtres avancés */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                <div className="user-search-container" style={{ flex: 1 }}>
                    <div className="search-container">
                        <IoSearchSharp className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email, rôle, action..."
                            className="search-input"
                            value={searchName}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <FaFilter style={{ color: '#64748b' }} />
                    <select 
                        value={actionTypeFilter}
                        onChange={(e) => { setActionTypeFilter(e.target.value); setCurrentPage(1); }}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="all">Toutes les actions</option>
                        {uniqueActionTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select 
                        value={dateFilter}
                        onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="all">Toutes les dates</option>
                        <option value="today">Aujourd'hui</option>
                        <option value="week">7 derniers jours</option>
                        <option value="month">30 derniers jours</option>
                    </select>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="admin-dashboard-error fade-in" style={{ color: 'red', padding: '10px', margin: '10px 0', background: '#fee', borderRadius: '6px' }}>
                    {error}
                    <button onClick={() => setError(null)} style={{ marginLeft: '10px', color: 'red', background: 'transparent', border: 'none', fontSize: '30px', cursor: 'pointer' }}>×</button>
                </div>
            )}

            {/* Résultats de recherche */}
            <p style={{ marginBottom: '10px', color: '#64748b' }}>
                {filtredHistoriques.length} résultat(s) trouvé(s)
            </p>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date d'action</th>
                        <th>Type d'action</th>
                        <th>Détails</th>
                        <th>Utilisateur</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentHistoriques.map((hist) => (
                        <tr key={hist.id}>
                            <td>{hist.id}</td>
                            <td>{formatDate(hist.dateAction)}</td>
                            <td>
                                <span style={{ 
                                    padding: '4px 8px', 
                                    borderRadius: '4px', 
                                    background: '#e0f2fe',
                                    color: '#0369a1',
                                    fontSize: '0.9em'
                                }}>
                                    {hist.actionType}
                                </span>
                            </td>
                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {hist.details}
                            </td>
                            <td>{hist.utilisateur.nom} {hist.utilisateur.prenom}</td>
                            <td>{hist.utilisateur.email}</td>
                            <td>
                                <span className={`role-badge ${
                                hist.utilisateur.role === 'ADMIN' ? 'role-admin' :
                                hist.utilisateur.role === 'PATIENT' ? 'role-patient' :
                                'role-medecin'
                                }`}>
                                    {hist.utilisateur.role}
                                </span>
                            </td>
                            <td>
                                <button 
                                    onClick={() => fetchHistorqueByUserId(hist.utilisateur.id)}
                                    className="ubtn btn-complete"
                                >
                                    <FaEye /> Détails
                                </button>
                                <button className="ubtn btn-delete"
                                onClick={() => {
                                if (window.confirm('Êtes-vous sûr de vouloir supprimer cet historique ?')) {
                                    handleDeleteHistorique(hist.id);
                                }}}>
                                    <FaTrash /> Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

            {/* Modal détails utilisateur */}
            {showUserModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        maxWidth: '800px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        width: '90%'
                    }}>
                        <h2 style={{ marginTop: 0 }}>Détails de l'utilisateur</h2>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>Nom:</strong> {selectedUser.nom} {selectedUser.prenom}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Rôle:</strong> {selectedUser.role}</p>
                            <p><strong>Nombre total d'actions:</strong> {selectedUser.nombreActions}</p>
                        </div>

                        <h3>Actions récentes (7 derniers jours)</h3>
                        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                            {selectedUser.actionsRecentes.map((action, index) => (
                                <div key={index} style={{ 
                                    padding: '10px', 
                                    margin: '10px 0', 
                                    background: '#f8fafc', 
                                    borderRadius: '6px',
                                    borderLeft: '4px solid #3b82f6'
                                }}>
                                    <p style={{ margin: '5px 0' }}>
                                        <strong>{action.actionType}</strong> - {formatDate(action.dateAction)}
                                    </p>
                                    <p style={{ margin: '5px 0', color: '#64748b', fontSize: '0.9em' }}>
                                        {action.details}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => setShowUserModal(false)}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                background: '#64748b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HistoriqueAdmin;