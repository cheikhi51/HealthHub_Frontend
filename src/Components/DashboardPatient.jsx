import Logout from "./Logout";
import { useEffect } from "react";
import {Settings ,BriefcaseBusiness, Stethoscope, BellDotIcon, List} from "lucide-react";
import { TbLogout } from "react-icons/tb";
import { useState } from "react";
import Notifications from "./Notifications";
import Chatbot from "./Chatbot";
import axios from "axios";
import SidebarPatient from "./SidebarPatient";
import RendezVousPatient from "./RendezVousPatient";
import HistoriqueUtilisateur from "./HistoriqueUtilisateur";
import Medecins from "./Medecins";
function DashboardPatient({ setAuthToken }) {
  const [showLogout, setShowLogout] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [statistiques,setStatistiques] = useState({
    nombreTotalSpecialistes:0,
    nombreTotalNotifications:0,
    nombreTotalRendezVous:0,
    nombreTotalMedecins:0
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

    useEffect(() => {
    if (currentUser.id) {
      fetchStats();
    }
  }, [currentUser.id]);
    
    
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = getAuthHeaders();
        const notificationsRes = await axios.get(`http://localhost:8080/api/patients/${currentUser.id}/notifications`, { headers });
        const rendezVousRes = await axios.get(`http://localhost:8080/api/patients/${currentUser.id}/rendez-vous`, { headers });
        const medecinsRes = await axios.get("http://localhost:8080/api/patients/medecins", { headers });
        const specialistesRes = await axios.get("http://localhost:8080/api/patients/specialites", { headers });
        setStatistiques({
          nombreTotalNotifications: notificationsRes.data.length,
          nombreTotalRendezVous : rendezVousRes.data.length,
          nombreTotalMedecins: medecinsRes.data.length,
          nombreTotalSpecialistes: specialistesRes.data.length
        });
      }catch (err) {  
        console.error("Erreur lors de la récupération des statistiques:", err);
      }finally { 
        setLoading(false);
      }
    };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false); 
  };

  const adminStats=[
    {
      title: 'Total Specialistés',
      value: statistiques.nombreTotalSpecialistes,
      icon: List,
      colorClass: 'stat-card-violet',
      isPositive: true
    },
    {
      title: 'Total Notifications',
      value: statistiques.nombreTotalNotifications,
      icon: BellDotIcon,
      colorClass: 'stat-card-cyan',
      isPositive: true
    },
    { 
      title: 'Total Medecins',
      value: statistiques.nombreTotalMedecins,
      icon: Stethoscope,
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
      case 'notifications':
        return <Notifications getAuthHeaders={getAuthHeaders} fetchStats={fetchStats} userId={currentUser.id} ></Notifications>;
      case 'rendez-vous':
        return <RendezVousPatient getAuthHeaders={getAuthHeaders} fetchStats={fetchStats} userId={currentUser.id}></RendezVousPatient>;
      case 'medecins':
        return <Medecins getAuthHeaders={getAuthHeaders}></Medecins>;
      case 'Historique':
        return <HistoriqueUtilisateur getAuthHeaders={getAuthHeaders} userId={currentUser.id}></HistoriqueUtilisateur>;
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
          <SidebarPatient 
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

export default DashboardPatient;