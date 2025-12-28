import { MdEmail } from "react-icons/md";
import {FaWhatsapp } from "react-icons/fa"; 
import { FaFacebook } from "react-icons/fa";
import logoImage from '/healthhub_logo.png';
import { useEffect } from "react";
function Footer() {
    useEffect(()=>{
  const footerAnimation = document.querySelectorAll('.pop-in-element');
  const footerObserver = new IntersectionObserver((entities)=>{
    entities.forEach(entry =>{
      if (entry.isIntersecting){
        entry.target.classList.add('pop-in');
      }
    });
  },{ threshold: 0.1 });

    footerAnimation.forEach(element=>{
      footerObserver.observe(element);
    });

  return ()=>{
    footerAnimation.forEach(element => footerObserver.unobserve(element));
   };

  }, []);
    return (
        <div className="footer-container" id='#footer'>
            <img className="logo-image pop-in-element" src={logoImage} alt="logo image"/>
            <div className="footer-wrapper">
                
                <h3 className='pop-in-element'>© Copyright HealthHub — Tous droits réservés</h3>
                <div className="quick-links pop-in-element">
                    <a href="#home">Accueil</a>
                    <a href="#about">À propos</a>
                    <a href="#services">Nos Services</a>
                    <a href='#faq'>FAQ</a>
                    <a href="#contact">Contacter-nous</a>
                </div>
                <div className="footer-info pop-in-element">
                    <p>Email : contact@healthhub.com</p>
                    <p>Téléphone : +212 5 22 50 43 23</p>
                    <p>Adresse : Casablanca, Maroc</p>
                </div>

                <div className='social-media-fonts pop-in-element'>
                    <MdEmail className='social-media-font'/>
                    <FaFacebook  className='social-media-font'/>
                    <FaWhatsapp  className='social-media-font'/>
                </div>
            </div>
            
        </div>
    );
}
export default Footer;