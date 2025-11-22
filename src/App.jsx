import { useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import LogoIcon from '/HealthHubIcon.png';
import Landingpage from './Landingpage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import './App.css';

function App() {

  const [loading,setLoading] = useState (true);
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
          
          {/* Separate routes for auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
        </Routes>
        </BrowserRouter>  
      </div>
    
  )
}

export default App
