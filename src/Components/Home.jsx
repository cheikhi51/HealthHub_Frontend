import { FaAngleDoubleUp } from 'react-icons/fa';
import { useState , useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
function Home() {

    const [isShowScrollTop , setIsShowScrollTop] = useState (false);
    const navigate = useNavigate();
    useEffect(()=>{
        const handleShowUpButton = ()=>{
            const showBtn = window.scrollY  >= 200;
            setIsShowScrollTop(showBtn); 
        }
        window.addEventListener('scroll',handleShowUpButton);
        return ()=>{
            window.removeEventListener('scroll',handleShowUpButton);
        }
    },[window.scrollY])

    const handleLoginPage = ()=>{
        navigate("/login");
    }
    const moveToSection = (sectionId) => {  
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
    return (
        <div className="home-container" id="home">
            <h1 className="hero-title">Bienvenue chez HealthHub</h1>
            <h3 className="hero-subtitle">Réservez, consultez, suivez votre santé en un seul endroit</h3>
            <div className="hero-buttons">
                <button className="hero-button" onClick={handleLoginPage}>Se connecter</button>
                <button className="hero-button-secondary" onClick={()=>{moveToSection("contact")}}>En savoir plus</button>       
            </div>
            {isShowScrollTop &&
                <div className='scrollTopButton slide-in-right'>
                    <FaAngleDoubleUp onClick={()=>{moveToSection("home")}} />
                </div>
                
            }
            
        </div>
    );
}
export default Home;