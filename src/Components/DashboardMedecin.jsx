import Logout from "./Logout";
import { use, useEffect } from "react";
import {Users,Settings , User,BriefcaseBusiness} from "lucide-react";
import { TbLogout } from "react-icons/tb";
import { useState } from "react";
import Utilisateurs from "./Utilisateurs";
import RendezVousMedecin from "./RendezVousMedecin";
import Statistiques from "./Statistiques";
import Chatbot from "./Chatbot";
import SidebarMedecin from "./SidebarMedecin ";
import axios from "axios";
import Patient from "../Patient";
function DashboardMedecin({ setAuthToken }) {
  const [showLogout, setShowLogout] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [statistiques,setStatistiques] = useState({
    nombreTotalRendezVous:0,
    nombreRendezVousEnAttente:0,
    nombreRendezVousConfirmes:0,
    nombreRendezVousTermines:0,
    nombreRendezVousAnnules:0,
    nombrePatientsUniques:0
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
      if(currentUser.id) {
        fetchStats();
      }
  }, [currentUser.id]);


    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = getAuthHeaders();
        const statistiqueRes = await axios.get(`http://localhost:8080/api/medecins/${currentUser.id}/statistiques`, { headers });
        setStatistiques({
          nombreTotalRendezVous: statistiqueRes.data.nombreTotalRendezVous,
          nombreRendezVousEnAttente: statistiqueRes.data.nombreRendezVousEnAttente,
          nombreRendezVousConfirmes: statistiqueRes.data.nombreRendezVousConfirmes,
          nombreRendezVousTermines: statistiqueRes.data.nombreRendezVousTermines,
          nombreRendezVousAnnules: statistiqueRes.data.nombreRendezVousAnnules,
          nombrePatientsUniques: statistiqueRes.data.nombrePatientsUniques
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

  const medecinStats=[
    {
      title: 'Total Patients Uniques',
      value: statistiques.nombrePatientsUniques,
      icon: Users,
      colorClass: 'stat-card-violet',
      isPositive: true
    },
    {
      title: 'Total Rendez-Vous',
      value: statistiques.nombreTotalRendezVous,
      icon: User,
      colorClass: 'stat-card-cyan',
      isPositive: true
    },
    { 
      title: 'Total Rendez-Vous Confirmés',
      value: statistiques.nombreRendezVousConfirmes,
      icon: User,
      colorClass: 'stat-card-indigo',
      isPositive: true
    },
    {
      title: "Total Rendez-Vous en Attente",
      value: statistiques.nombreRendezVousEnAttente,
      icon: BriefcaseBusiness,
      colorClass: 'stat-card-blue',
      isPositive: true
    }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'patients':
        return <Patient getAuthHeaders={getAuthHeaders} fetchStats={fetchStats} userId={currentUser.id}/>;
      case 'rendez-vous':
        return <RendezVousMedecin getAuthHeaders={getAuthHeaders} fetchStats={fetchStats} userId={currentUser.id}></RendezVousMedecin>;
      case 'statistiques':
        return <Statistiques getAuthHeaders={getAuthHeaders}></Statistiques>;
      case 'assistant-ia':
        return <Chatbot getAuthHeaders={getAuthHeaders} userId={currentUser.id} />;
      default:
        return (
          <>
            {/* Stat Cards */}
            <div className="stats-grid">
              {medecinStats.map((medecinStat, index) => {
                const Icon = medecinStat.icon;
                return (
                  <div key={index} className={`stat-card ${medecinStat.colorClass}`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}>
                    <div className="stat-card-overlay"></div>
                    <div className="stat-card-content">
                      <div className="stat-card-header">
                        <div className="stat-icon"><Icon /></div>
                      </div>
                      <h3 className="stat-title">{medecinStat.title}</h3>
                      <p className="stat-value">{medecinStat.value}</p>
                    </div>
                    <div className={`stat-shine ${hoveredCard === index ? 'active' : ''}`}></div>
                  </div>
                );
              })}
            </div>
            {/* Dashboard Overview */}
           
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
          <SidebarMedecin 
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

export default DashboardMedecin;