import { useEffect } from 'react';
import { MdEventAvailable, MdLocalHospital, MdSecurity, MdSupport } from 'react-icons/md';
function About() {
    useEffect(()=>{
  const aboutAnimation = document.querySelectorAll('.fade-up-element');
  const aboutObserver = new IntersectionObserver((entities)=>{
    entities.forEach(entry =>{
      if (entry.isIntersecting){
        entry.target.classList.add('fade-up');
      }
    });
  },{ threshold: 0.1 });

    aboutAnimation.forEach(element=>{
      aboutObserver.observe(element);
    });

  return ()=>{
    aboutAnimation.forEach(element => aboutObserver.unobserve(element));
   };

  }, []);
    return (
        <div className="about-container" id="about">
            <h2 className="section-title fade-up-element">À propos de HealthHub</h2>
            <p className="about-description fade-up-element">
                HealthHub est une plateforme innovante dédiée à la simplification de votre parcours de santé.
                Nous facilitons la prise de rendez-vous avec des professionnels qualifiés, tout en garantissant
                un suivi personnalisé et des consultations de qualité avec nos médecins experts.
            </p>
            
            <div className="about-features">
                <div className="feature-card fade-up-element">
                    <div className="feature-icon"><MdEventAvailable /></div>
                    <h3 className="feature-title">Réservation simplifiée</h3>
                    <p className="feature-text">
                        Prenez rendez-vous en quelques clics avec le spécialiste de votre choix
                    </p>
                </div>
                
                <div className="feature-card fade-up-element">
                    <div className="feature-icon"><MdLocalHospital /></div>
                    <h3 className="feature-title">Médecins experts</h3>
                    <p className="feature-text">
                        Accédez à un réseau de professionnels qualifiés et expérimentés
                    </p>
                </div>
                
                <div className="feature-card fade-up-element">
                    <div className="feature-icon"><MdSecurity /></div>
                    <h3 className="feature-title">Sécurité garantie</h3>
                    <p className="feature-text">
                        Vos données médicales sont protégées et totalement confidentielles
                    </p>
                </div>
                
                <div className="feature-card fade-up-element">
                    <div className="feature-icon"><MdSupport /></div>
                    <h3 className="feature-title">Support disponible</h3>
                    <p className="feature-text">
                        Notre équipe est à votre écoute pour répondre à toutes vos questions
                    </p>
                </div>
            </div>
            
            <div className="about-cta fade-up-element">
                <p className="cta-text">Une question ? Nous sommes là pour vous aider</p>
                <button className="cta-button">Nous contacter</button>
            </div>
        </div>
    );
}

export default About;