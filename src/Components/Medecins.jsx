import { useState,useEffect } from "react";
import api from "../api/axios";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
function Medecins({getAuthHeaders}) {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    useEffect(() => {
        const fetchMedecins = async () => {
            const headers = getAuthHeaders();
            try{
                const medecinsRes = await api.get("/patients/medecins", { headers });
                setMedecins(medecinsRes.data);
                setLoading(false);
                console.log(medecinsRes.data);
            }
            catch(err){
                console.error("Erreur lors de la récupération des médecins:", err);
                setLoading(false);
            }
        };

        fetchMedecins();
    }, []);

    const totalPages = Math.ceil(medecins.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMedecins = medecins.slice(indexOfFirstItem, indexOfLastItem);
    const getDisponibilite = (disponibilite) => {
        return disponibilite ? "Disponible" : "Indisponible";
    }
     const getDisponibiliteBadge = (disponibilite) => {
    if (disponibilite) {
      return <span className="badge disponible">Disponible</span>;
    } else {
      return <span className="badge non-disponible">Indisponible</span>;
    }
  };
    return (
        <div className="user-management-section">
            <h2 className="section-title">Liste des Médecins</h2>
            {loading ? (
                <p>Chargement des médecins...</p>
            ) : ( 
                <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Spécialité</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Disponibilité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMedecins.map((medecin) => (
                            <tr key={medecin.id}>
                                <td>{medecin.nom}</td>
                                <td>{medecin.prenom}</td>
                                <td>{medecin.specialite}</td>
                                <td>{medecin.email}</td>
                                <td>{medecin.telephone}</td>
                                <td>{getDisponibiliteBadge(medecin.disponibilite)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>

            )}
            {/* Pagination Controls */}
                  <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}><TbPlayerTrackPrevFilled/></button>
                    <span>Page {currentPage} sur {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}><TbPlayerTrackNextFilled/></button>
            </div>
        </div>
    )
}
export default Medecins;      