import Logout from "./Logout";
import { TbLogout } from "react-icons/tb";
import { useState } from "react";
function DashboardAdmin({ setAuthToken }) {
  const [showLogout, setShowLogout] = useState(false);
  return (
    <div className="dashboard-admin">
      {showLogout &&
        <Logout setAuthToken={setAuthToken} setShowLogout={setShowLogout} />
      }
      <h1>Bienvenue sur le tableau de bord de l'administrateur</h1>
      <button className="header-button" onClick={() => setShowLogout(true)}><TbLogout color='red' /></button>
    </div>
  );
}

export default DashboardAdmin;