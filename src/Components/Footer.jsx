import { MdEmail } from "react-icons/md";
import {FaWhatsapp } from "react-icons/fa"; 
import { FaFacebook } from "react-icons/fa";
import logoImage from '/healthhub_logo.png';
function Footer() {
    return (
        <div className="footer-container" id='#footer'>
            <img className="logo-image pop-up-element" src={logoImage} alt="logo image"/>
            <div className="footer-wrapper">
                
                <h3 className='pop-up-element'>© Copyright HealthHub — Tous droits réservés</h3>
                <div className="quick-links pop-up-element">
                    <a href="#home">Accueil</a>
                    <a href="#about">À propos</a>
                    <a href="#services">Nos Services</a>
                    <a href='#faq'>FAQ</a>
                    <a href="#contact">Contacter-nous</a>
                </div>
                <div className="footer-info pop-up-element">
                    <p>Email : contact@healthhub.com</p>
                    <p>Téléphone : +212 5 22 50 43 23</p>
                    <p>Adresse : Casablanca, Maroc</p>
                </div>

                <div className='social-media-fonts pop-up-element'>
                    <MdEmail className='social-media-font'/>
                    <FaFacebook  className='social-media-font'/>
                    <FaWhatsapp  className='social-media-font'/>
                </div>
            </div>
            
        </div>
    );
}
export default Footer;