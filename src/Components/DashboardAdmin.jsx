import Logout from "./Logout";
import { use, useEffect } from "react";
import {Users,Settings , User,BriefcaseBusiness} from "lucide-react";
import { TbLogout } from "react-icons/tb";
import { useState } from "react";
import Utilisateurs from "./Utilisateurs";
import RendezVous from "./RendezVous";
import Statistiques from "./Statistiques";
import Chatbot from "./Chatbot";
import AdminSidebar from "./AdminSidebar";
import HistoriqueAdmin from "./HistoriqueAdmin";
import RendezVousChart from "./RendezVousChart";
import UserBarChart from "./UsersBarChart";
import axios from "axios";
function DashboardAdmin({ setAuthToken }) {
  const [showLogout, setShowLogout] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [statistiques,setStatistiques] = useState({
    nombreTotalPatients: 0,
    nombreTotalMedecins: 0,
    nombreTotalUtilisateurs: 0,
    nombreTotalRendezVous: 0,
    nombreRendezVousEnAttente : 0,
    nombreRendezVousConfirmes : 0,
    nombreRendezVousAnnules : 0,
    nombreRendezVousTermines : 0,
    nombreRendezVousRefuses : 0
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

    useEffect(() => {
    fetchStats();
  }, []);


    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = getAuthHeaders();
        const utilisateursRes = await axios.get("http://localhost:8080/api/utilisateurs", { headers });
        const rendezVousRes = await axios.get("http://localhost:8080/api/administrateurs/rendez-vous", { headers });
        const statistiqueRes = await axios.get("http://localhost:8080/api/administrateurs/statistiques", { headers });
        setStatistiques({
          nombreTotalUtilisateurs: statistiqueRes.data.nombreTotalUtilisateurs,
          nombreTotalPatients: statistiqueRes.data.nombreTotalPatients,
          nombreTotalMedecins: statistiqueRes.data.nombreTotalMedecins,
          nombreTotalRendezVous: statistiqueRes.data.nombreTotalRendezVous,
          nombreRendezVousEnAttente : statistiqueRes.data.nombreRendezVousEnAttente,
          nombreRendezVousConfirmes : statistiqueRes.data.nombreRendezVousConfirmes,
          nombreRendezVousAnnules : statistiqueRes.data.nombreRendezVousAnnules,
          nombreRendezVousTermines : statistiqueRes.data.nombreRendezVousTermines,
          nombreRendezVousRefuses : statistiqueRes.data.nombreRendezVousRefuses
        });
      }catch (err) {  
        console.error("Erreur lors de la récupération des statistiques:", err);
      }finally { 
        setLoading(false);
      }
    };


  useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get("http://localhost:8080/api/me", { headers });
      setCurrentUser(res.data); 
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur:", err);
    }
  };

  fetchCurrentUser();
}, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false); 
  };

  const adminStats=[
    {
      title: 'Total Utilisateurs',
      value: statistiques.nombreTotalUtilisateurs,
      icon: Users,
      colorClass: 'stat-card-violet',
      isPositive: true
    },
    {
      title: 'Total Patients',
      value: statistiques.nombreTotalPatients,
      icon: User,
      colorClass: 'stat-card-cyan',
      isPositive: true
    },
    { 
      title: 'Total Medecins',
      value: statistiques.nombreTotalMedecins,
      icon: User,
      colorClass: 'stat-card-indigo',
      isPositive: true
    },
    {
      title: "Total Rendez-Vous",
      value: statistiques.nombreTotalRendezVous,
      icon: BriefcaseBusiness,
      colorClass: 'stat-card-blue',
      isPositive: true
    }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'utilisateurs':
        return <Utilisateurs getAuthHeaders={getAuthHeaders} fetchStats={fetchStats} />;
      case 'rendez-vous':
        return <RendezVous getAuthHeaders={getAuthHeaders} fetchStats={fetchStats}></RendezVous>;
      case 'statistiques':
        return <Statistiques getAuthHeaders={getAuthHeaders}></Statistiques>;
      case 'historique':
        return <HistoriqueAdmin getAuthHeaders={getAuthHeaders} userId={currentUser.id} />;
      case 'assistant-ia':
        return <Chatbot getAuthHeaders={getAuthHeaders} userId={currentUser.id} />;
      default:
        return (
          <>
            {/* Stat Cards */}
            <div className="stats-grid">
              {adminStats.map((adminStat, index) => {
                const Icon = adminStat.icon;
                return (
                  <div key={index} className={`stat-card ${adminStat.colorClass}`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}>
                    <div className="stat-card-overlay"></div>
                    <div className="stat-card-content">
                      <div className="stat-card-header">
                        <div className="stat-icon"><Icon /></div>
                      </div>
                      <h3 className="stat-title">{adminStat.title}</h3>
                      <p className="stat-value">{adminStat.value}</p>
                    </div>
                    <div className={`stat-shine ${hoveredCard === index ? 'active' : ''}`}></div>
                  </div>
                );
              })}
            </div>
            {/* Dashboard Overview */}
            <div className="dashboard-wrapper">
           <div className="dashboard-box">
              <h3 className="dashboard-box-title">Répartition des rendez-vous</h3>
              <RendezVousChart statistiques={statistiques} />
            </div>
            <div className="dashboard-box">
              <h3 className="dashboard-box-title">Répartition des utilisateurs</h3>
              <UserBarChart statistiques={statistiques} />
            </div>
            </div>
          </>
        );
    }
  };

  if (loading) {
    return <div className="dashboard-admin">Chargement...</div>;
  }

  return (
    <div className="dashboard-admin">
      {showLogout &&
        <Logout setAuthToken={setAuthToken} setShowLogout={setShowLogout} />
      }
      <h1>Bienvenue, {currentUser.nom} {currentUser.prenom}</h1>
      <button className="header-button" onClick={() => setIsSidebarOpen(true)}><Settings /></button>
      <button className="logout-button" onClick={() => setShowLogout(true)}><TbLogout color='red' /></button>

      {/* Sidebar */}
        {isSidebarOpen && (
          <AdminSidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            onSectionChange={handleSectionChange}
            activeSection={activeSection}
          />
        )}
         {/* Error Display */}
        {error && (
          <div className="admin-dashboard-error fade-in" style={{color: 'red', padding: '10px', margin: '10px 0'}}>
            {error}
            <button onClick={() => setError(null)} style={{marginLeft: '10px'}}>×</button>
          </div>
        )}
      {/* Dynamic Content */}
        {renderContent()}
    </div>
  );
}

export default DashboardAdmin;