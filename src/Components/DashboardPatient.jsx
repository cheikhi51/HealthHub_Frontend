import { useState } from "react";
import { TbLogout } from "react-icons/tb";
import Logout from "./Logout";
function DashboardPatient({setAuthToken}) {
  const [showLogout, setShowLogout] = useState(false);
  return (
    <div className="dashboard-patient">
      {showLogout &&
        <Logout setAuthToken={setAuthToken} setShowLogout={setShowLogout} />
      }
      <h1>Bienvenue sur le tableau de bord du patient</h1>
      <button className="logout-button" onClick={() => setShowLogout(true)}><TbLogout color='red' /></button>
    </div>
  );
}

export default DashboardPatient;