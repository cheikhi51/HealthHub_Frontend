import { useEffect } from "react";
function Service() {

    useEffect(()=>{
  const servicesAnimation = document.querySelectorAll('.fade-up-element');
  const servicesObserver = new IntersectionObserver((entities)=>{
    entities.forEach(entry =>{
      if (entry.isIntersecting){
        entry.target.classList.add('fade-up');
      }
    });
  },{ threshold: 0.1 });

    servicesAnimation.forEach(element=>{
      servicesObserver.observe(element);
    });

  return ()=>{
    servicesAnimation.forEach(element => servicesObserver.unobserve(element));
   };

  }, []);

    return (
        <div className="service-container" id="services">
            <h2 className="section-title fade-up-element">Nos Services</h2>
            <p className="service-intro fade-up-element">
                Découvrez notre gamme complète de services médicaux pour prendre soin de votre santé
            </p>
            
            <div className="services-grid">
                <div className="service-card fade-up-element">
                    <div className="service-icon"><img src="/medicalIcon.svg" alt="general medicin image"/></div>
                    <h3 className="service-name">Médecine Générale</h3>
                    <p className="service-description">
                        Consultations pour le suivi médical général, diagnostics et prescriptions
                    </p>
                    <ul className="service-list">
                        <li>Bilans de santé</li>
                        <li>Vaccinations</li>
                        <li>Suivi médical</li>
                    </ul>
                    <button className="service-button">Prendre RDV</button>
                </div>

                <div className="service-card fade-up-element">
                    <div className="service-icon"><img src="/heartIcon.svg" alt="heart image"/></div>
                    <h3 className="service-name">Cardiologie</h3>
                    <p className="service-description">
                        Spécialistes du cœur et des maladies cardiovasculaires
                    </p>
                    <ul className="service-list">
                        <li>Électrocardiogramme</li>
                        <li>Échographies cardiaques</li>
                        <li>Suivi hypertension</li>
                    </ul>
                    <button className="service-button">Prendre RDV</button>
                </div>

                <div className="service-card fade-up-element">
                    <div className="service-icon"><img src="/bonesIcon.svg" alt="orthopedics image"/></div>
                    <h3 className="service-name">Orthopédie</h3>
                    <p className="service-description">
                        Traitement des troubles musculo-squelettiques et traumatismes
                    </p>
                    <ul className="service-list">
                        <li>Fractures</li>
                        <li>Arthrose</li>
                        <li>Rééducation</li>
                    </ul>
                    <button className="service-button">Prendre RDV</button>
                </div>

                <div className="service-card fade-up-element">
                    <div className="service-icon"><img src="/babyIcon.svg" alt="baby image"/></div>
                    <h3 className="service-name">Pédiatrie</h3>
                    <p className="service-description">
                        Soins médicaux spécialisés pour les nourrissons, enfants et adolescents
                    </p>
                    <ul className="service-list">
                        <li>Suivi de croissance</li>
                        <li>Vaccinations infantiles</li>
                        <li>Maladies infantiles</li>
                    </ul>
                    <button className="service-button">Prendre RDV</button>
                </div>

                <div className="service-card fade-up-element">
                    <div className="service-icon"><img src="/eyeIcon.svg" alt="eye image"/></div>
                    <h3 className="service-name">Ophtalmologie</h3>
                    <p className="service-description">
                        Examens de la vue et traitement des pathologies oculaires
                    </p>
                    <ul className="service-list">
                        <li>Tests de vision</li>
                        <li>Lunettes et lentilles</li>
                        <li>Glaucome et cataracte</li>
                    </ul>
                    <button className="service-button">Prendre RDV</button>
                </div>

                <div className="service-card fade-up-element">
                    <div className="service-icon"><img src="/teethIcon.svg" alt="dentistry image"/></div>
                    <h3 className="service-name">Dentisterie</h3>
                    <p className="service-description">
                        Soins dentaires complets pour toute la famille
                    </p>
                    <ul className="service-list">
                        <li>Détartrage</li>
                        <li>Soins des caries</li>
                        <li>Orthodontie</li>
                    </ul>
                    <button className="service-button">Prendre RDV</button>
                </div>
            </div>

            <div className="service-footer fade-up-element">
                <p className="footer-text">
                    Vous ne trouvez pas la spécialité que vous cherchez ?
                </p>
                <button className="footer-button">Voir toutes les spécialités</button>
            </div>
        </div>
    );
}

export default Service;