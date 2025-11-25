import './Sidebar.css';
import { MdDashboard } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { IoIosListBox } from "react-icons/io";
import { ImStatsDots } from "react-icons/im";
import { FaRobot } from "react-icons/fa6";
function AdminSidebar({ isOpen, onClose, onSectionChange, activeSection }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard/> },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: <LuUsers/> },
    { id: 'rendez-vous', label: 'Rendez-Vous', icon: <IoIosListBox /> },
    { id: 'statistiques', label: 'Statistiques', icon: <ImStatsDots /> },
    { id: 'assistant-ia', label: 'Chatbot', icon: <FaRobot/> }
  ];

  const handleItemClick = (sectionId) => {
    onSectionChange(sectionId);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open fade-in' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-settings-title">Navigation</h2>
        <button className="sidebar-close-btn" onClick={onClose}>✖</button>
      </div>
      <div className="sidebar-settings-content">
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.id}
              className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;