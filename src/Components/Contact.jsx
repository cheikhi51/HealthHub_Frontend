import { useEffect, useState } from 'react';
import worldMap from '/world_map_spining.gif';
import { MdEmail, MdPhone, MdAccessTime, MdCheckCircle } from 'react-icons/md';

function Contact() {
    const [data, setData] = useState({"nom":"", "prenom":"", "email":"", "message":""});
    const [successMessage, setSuccessMessage] = useState("");
    const handDataChange = (e)=>{
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        setSuccessMessage("Les informations ont été envoyées avec succès !");
        setData({"nom":"", "prenom":"", "email":"", "message":""});
    }

    useEffect(()=>{
        const successInterval =  setInterval(() => {
            setSuccessMessage("");
        }, 3000);
        return () => clearInterval(successInterval);
    })
    return (
        <div className="contact-wrapper" id="contact">
            <h2 className="section-title">Contactez-nous</h2>
            <p className="contact-intro">
                Une question ? Notre équipe est à votre écoute pour vous accompagner
            </p>
            
            <div className="contact-container">
                {/* Section Formulaire */}
                <div className="contact-form-section" >
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nom">Nom</label>
                                <input 
                                    type="text" 
                                    id="nom" 
                                    name="nom"
                                    value={data.nom}
                                    placeholder="Votre nom"
                                    required
                                    onChange={handDataChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="prenom">Prénom</label>
                                <input 
                                    type="text" 
                                    id="prenom" 
                                    name="prenom"
                                    value={data.prenom}
                                    placeholder="Votre prénom"
                                    required
                                    onChange={handDataChange}
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={data.email}
                                placeholder="votre.email@exemple.com"
                                required
                                onChange={handDataChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea 
                                id="message" 
                                name="message"
                                value={data.message}
                                rows="6"
                                placeholder="Décrivez votre demande..."
                                required
                                onChange={handDataChange}
                            ></textarea>
                        </div>
                        
                        <button className="submit-button" type="submit">
                            <span>Envoyer le message</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                        </button>
                        {successMessage && <div className="success-message"><MdCheckCircle />{successMessage}</div>}
                    </form>
                    
                    <div className="contact-info">
                        <div className="info-item">
                            <div className="info-icon"><MdEmail /></div>
                            <div className="info-text">
                                <h4>Email</h4>
                                <p>contact@healthhub.ma</p>
                            </div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon"><MdPhone /></div>
                            <div className="info-text">
                                <h4>Téléphone</h4>
                                <p>+212 5 22 50 43 23</p>
                            </div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon"><MdAccessTime /></div>
                            <div className="info-text">
                                <h4>Horaires</h4>
                                <p>Lun - Ven : 8h - 18h</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Section Globe */}
                <div className="contact-visual-section">
                    <div className="globe-container">
                        <img src={worldMap} alt="HealthHub - Service mondial" className="world-map" />
                    </div>
                    <div className="visual-text">
                        <h3>Une plateforme accessible partout</h3>
                        <p>HealthHub s'engage à rendre les soins de santé accessibles à tous, où que vous soyez</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;