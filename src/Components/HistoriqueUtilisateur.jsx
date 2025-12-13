import { useEffect } from "react";

function HistoriqueUtilisateur({ getAuthHeaders }) {
    const [historique, setHistorique] = useState([]);

    useEffect(() => {
        fetchHistorque();
    }, []);

    const fetchHistorque = async () => {
        try {
            const headers = getAuthHeaders();
            const res = await axios.get("http://localhost:8080/api/historique", { headers });
            setHistorique(res.data); 
        } catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur courant:", err);
        }
    };
    return ( 
        <div>
        <h1>Historique des utilisateurs</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date d'action</th>
                    <th>Type d'action</th>
                    <th>Détails</th>
                    <th>Utilisateur</th>
                </tr>
            </thead>
            <tbody>
                {historique.map((hist) => (
                    <tr key={hist.id}>
                        <td>{hist.id}</td>
                        <td>{hist.dateAction}</td>
                        <td>{hist.actionType}</td>
                        <td>{hist.details}</td>
                        <td>{hist.utilisateur.nom} {hist.utilisateur.prenom}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}
export default HistoriqueUtilisateur;