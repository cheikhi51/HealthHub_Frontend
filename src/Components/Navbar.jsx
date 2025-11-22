import image from '/healthhub_logo.png'
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react';
function Navbar() {
     const [isScrolled,setIsScrolled] = useState(null);
    const [isMenuOpen , setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    const handleLoginNavigation = () => {
        navigate("/login");
    }
    const handleSignupNavigation = () => {
        navigate("/signup");
    }
   useEffect(() => {
        const handleScroll = () => {
        const isScrolled = window.scrollY > 10;
        setIsScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const toggleMenu = ()=>{
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(()=>{
  const navAnimation = document.querySelectorAll('.pop-up-element');
  const navObserver = new IntersectionObserver((entities)=>{
    entities.forEach(entry =>{
      if (entry.isIntersecting){
        entry.target.classList.add('pop-up');
      }
    });
  },{ threshold: 0.1 });

    navAnimation.forEach(element=>{
      navObserver.observe(element);
    });

  return ()=>{
    navAnimation.forEach(element => navObserver.unobserve(element));
   };

  }, []);
    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
            <div className="logo-container pop-up-element">
                <img className="logo-image" src={image} alt="Logo image" />
            </div>
            
                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li className="nav-item pop-up-element">
                        <a href="#home" className="nav-link">Accueil</a>
                    </li>
                    <li className="nav-item pop-up-element">
                        <a href="#about" className="nav-link">À propos</a>
                    </li>
                    <li className="nav-item pop-up-element">
                        <a href="#services" className="nav-link">Services</a>
                    </li>
                    <li className="nav-item pop-up-element">
                        <a href="#faq" className="nav-link">FAQ</a>
                    </li>
                    <li className="nav-item pop-up-element">
                        <a href="#contact" className="nav-link">Contacter-nous</a>
                    </li>
                    <li className="nav-item pop-up-element">
                        <button className="login-btn" onClick={handleLoginNavigation}>Se connecter</button>
                    </li>
                    <li className="nav-item pop-up-element">
                        <button className="sign-up-btn" onClick={handleSignupNavigation}>Créer un compte</button>
                    </li>
                </ul>
            <div className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
                    
        </div>
        </nav>
    );
}
export default Navbar;