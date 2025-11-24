import { TbLogout } from "react-icons/tb";
import { useState } from "react";
import Logout from "./Logout";
function DashboardMedecin({setAuthToken}) {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="dashboard-medecin">
      {showLogout &&
        <Logout setAuthToken={setAuthToken} setShowLogout={setShowLogout} />
      }
      <h1>Bienvenue sur le tableau de bord du médecin</h1>
      <button className="logout-button" onClick={() => setShowLogout(true)}><TbLogout color='red' /></button>
    </div>
  );
}

export default DashboardMedecin;