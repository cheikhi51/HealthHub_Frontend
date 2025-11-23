import { useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import LogoIcon from '/HealthHubIcon.png';
import Landingpage from './Landingpage';
import { Navigate } from 'react-router-dom';
import DashboardAdmin from './Components/DashboardAdmin';
import DashboardMedecin from './Components/DashboardMedecin';
import DashboardPatient from './Components/DashboardPatient';
import Login from './Components/Login';
import Signup from './Components/Signup';
import './App.css';

function App() {

  const [loading,setLoading] = useState (true);
  const [authToken, setAuthToken] = useState(localStorage.getItem('jwtToken') || null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const PrivateRoute = ({ element }) => {
    return authToken ? element : <Navigate to="/login" replace />;
  };


  const getRedirectPathByRole = () => {
    const role = localStorage.getItem('userRole');
    switch (role) {
      case 'ADMIN':
        return '/DashboardAdmin';
      case 'MEDCIN':
        return '/DashboardMedecin';
      case 'PATIENT':
        return '/DashboardPatient';
      default:
        return '/';
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  if (loading){
    return (
      <div className='logo-loader'>
        <img src={LogoIcon} alt="HealthHub logo" className='logo-heart'/>
        <div className="logo-text"><span className='first-part'>Health</span><span className='second-part'>Hub</span></div>
      </div>
    )
  }
  return (
    
      <div className='App'>
        <BrowserRouter>
        <Routes>
          {/* Main route shows all sections as single page */}
          <Route path="/" element={<Landingpage />} />
            <Route
            path='/DashboardAdmin'
            element={<PrivateRoute element={<DashboardAdmin setAuthToken={setAuthToken} />} />}
          />
          <Route
            path='/DashboardMedecin'
            element={<PrivateRoute element={<DashboardMedecin setAuthToken={setAuthToken} />} />}
          />
          <Route
            path='/DashboardPatient'
            element={<PrivateRoute element={<DashboardPatient setAuthToken={setAuthToken} />} />}
          />
          {/* Separate routes for auth pages */}
          <Route
            path="/login"
            element={
              authToken ? (
                <Navigate to={getRedirectPathByRole()} replace />
              ) : (
                <Login setAuthToken={setAuthToken} />
              )
            }
          />

          <Route
            path="/signup"
            element={
              authToken ? (
                <Navigate to={getRedirectPathByRole()} replace />
              ) : (
                <Signup setAuthToken={setAuthToken} />
              )
            }
          />
          
        </Routes>
        </BrowserRouter>  
      </div>
    
  )
}

export default App
