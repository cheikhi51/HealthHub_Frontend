import { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaTrash } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";

function HistoriqueUtilisateur({ getAuthHeaders, userId }) {
    const [historiques, setHistoriques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historiqueCountByUser, setHistoriqueCountByUser] = useState({});
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [actionTypeFilter, setActionTypeFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const itemsPerPage = 5;

    // Filtres avancés
    const filtredHistoriques = historiques.filter(hist => {
        const query = searchName.toLowerCase();
        const matchesSearch = 
            hist.actionType.toLowerCase().includes(query) ||
            hist.details.toLowerCase().includes(query) ||
            hist.dateAction.toLowerCase().includes(query);

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
        if (userId) {
            fetchHistorqueByUserId(userId);
        }
    }, [userId]);

    const fetchHistorqueByUserId = async (userId) => {
        setLoading(true);
        setError(null); 
        try {
            const headers = getAuthHeaders();
            const [utilisateurHistRes, historiqueCountByUseRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/historiques/utilisateur/${userId}`, { headers }),
                axios.get(`http://localhost:8080/api/historiques/utilisateur/${userId}/count`, { headers })
            ]);
            
            setHistoriques(utilisateurHistRes.data);
            setHistoriqueCountByUser(historiqueCountByUseRes.data);
        } catch (err) {
            console.error("Erreur lors de la récupération de l'historique:", err);
            setError("Erreur lors de la récupération de l'historique.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHistorique = async (historiqueId) => {
        try {
            const headers = getAuthHeaders();
            await axios.delete(`http://localhost:8080/api/historiques/${historiqueId}`, { headers });
            
            // Retirer l'historique de la liste locale
            setHistoriques(historiques.filter(h => h.id !== historiqueId));
            setSuccessMessage("Historique supprimé avec succès");
            
            // Mettre à jour le compteur
            setHistoriqueCountByUser(prev => ({
                ...prev,
                nombreActions: prev.nombreActions - 1
            }));
            
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            setError("Erreur lors de la suppression de l'historique.");
        }
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

    const handleSearch = (e) => {
        setSearchName(e.target.value);
        setCurrentPage(1);
    };

    // Calculer les statistiques pour les 7 derniers jours
    const actionsRecentes = historiques.filter(hist => {
        const histDate = new Date(hist.dateAction);
        const now = new Date();
        const diffDays = Math.floor((now - histDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    });

    if (loading) {
        return <div className="loading-container">Chargement d'historique...</div>;
    }

    return ( 
        <div className="user-management-section">
            <h1 className="section-title">Mon Historique</h1>
            <h2 className="section-subtitle">Consultez toutes vos actions</h2>

            {/* Statistiques personnelles */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1, padding: '20px', background: '#f0f9ff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#0369a1', fontSize: '1em' }}>Total de mes actions</h3>
                    <p style={{ fontSize: '2.5em', margin: 0, fontWeight: 'bold', color: '#0369a1' }}>
                        {historiqueCountByUser.nombreActions || 0}
                    </p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: '#f0fdf4', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#15803d', fontSize: '1em' }}>Actions cette semaine</h3>
                    <p style={{ fontSize: '2.5em', margin: 0, fontWeight: 'bold', color: '#15803d' }}>
                        {actionsRecentes.length}
                    </p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: '#fef3c7', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#a16207', fontSize: '1em' }}>Types d'actions</h3>
                    <p style={{ fontSize: '2.5em', margin: 0, fontWeight: 'bold', color: '#a16207' }}>
                        {uniqueActionTypes.length}
                    </p>
                </div>
            </div>

            {/* Filtres avancés */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="user-search-container" style={{ flex: 1, minWidth: '250px' }}>
                    <div className="search-container">
                        <IoSearchSharp className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher par type d'action ou détails..."
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
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                        <option value="all">Toutes les actions</option>
                        {uniqueActionTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select 
                        value={dateFilter}
                        onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                        <option value="all">Toutes les dates</option>
                        <option value="today">Aujourd'hui</option>
                        <option value="week">7 derniers jours</option>
                        <option value="month">30 derniers jours</option>
                    </select>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div style={{ 
                    color: '#15803d', 
                    padding: '12px', 
                    margin: '10px 0', 
                    background: '#f0fdf4', 
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{successMessage}</span>
                    <button 
                        onClick={() => setSuccessMessage(null)} 
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            fontSize: '24px', 
                            cursor: 'pointer',
                            color: '#15803d'
                        }}
                    >×</button>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div style={{ 
                    color: '#dc2626', 
                    padding: '12px', 
                    margin: '10px 0', 
                    background: '#fee', 
                    borderRadius: '6px',
                    border: '1px solid #fecaca',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{error}</span>
                    <button 
                        onClick={() => setError(null)} 
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            fontSize: '24px', 
                            cursor: 'pointer',
                            color: '#dc2626'
                        }}
                    >×</button>
                </div>
            )}

            {/* Résultats de recherche */}
            <p style={{ marginBottom: '15px', color: '#64748b', fontWeight: '500' }}>
                {filtredHistoriques.length} résultat(s) trouvé(s)
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Date d'action</th>
                            <th>Type d'action</th>
                            <th>Détails</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentHistoriques.length > 0 ? (
                            currentHistoriques.map((hist) => (
                                <tr key={hist.id}>
                                    <td>{formatDate(hist.dateAction)}</td>
                                    <td>
                                        <span style={{ 
                                            padding: '6px 12px', 
                                            borderRadius: '6px', 
                                            background: '#e0f2fe',
                                            color: '#0369a1',
                                            fontSize: '0.9em',
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {hist.actionType}
                                        </span>
                                    </td>
                                    <td style={{ maxWidth: '300px' }}>
                                        <span title={hist.details}>
                                            {hist.details.length > 100 
                                                ? hist.details.substring(0, 100) + '...' 
                                                : hist.details}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="ubtn btn-delete"
                                            onClick={() => {
                                                if (window.confirm('Êtes-vous sûr de vouloir supprimer cet historique ?')) {
                                                    handleDeleteHistorique(hist.id);
                                                }
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <FaTrash /> Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                    Aucun historique trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                        <TbPlayerTrackPrevFilled/>
                    </button>
                    <span>Page {currentPage} sur {totalPages}</span>
                    <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                        <TbPlayerTrackNextFilled/>
                    </button>
                </div>
            )}
        </div>
    );
}

export default HistoriqueUtilisateur;