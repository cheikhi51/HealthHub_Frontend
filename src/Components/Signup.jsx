import { useState } from 'react';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
function Signup() {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        telephone: '',
        dateNaissance: '',
        role: ''
    });
    const navigate = useNavigate();


    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);
            console.log('Données du formulaire soumises:', formData);

            
            navigate('/login');

        }catch(error){
            console.error('Erreur lors de l\'inscription:', error);
        }
    };

    useEffect(()=>{
        const signupAnimation = document.querySelectorAll('.fade-in-element');
        const signupObserver = new IntersectionObserver((entities)=>{
            entities.forEach(entry =>{
            if (entry.isIntersecting){
                entry.target.classList.add('fade-in');
            }
            });
        },{ threshold: 0.1 });
    
            signupAnimation.forEach(element=>{
            signupObserver.observe(element);
            });
    
        return ()=>{
            signupAnimation.forEach(element => signupObserver.unobserve(element));
        };
    
      }, []);

    return (
        <div className="signup-page">
            <div className="signup-container fade-in-element">
                {/* Left Side - Form */}
                <div className="signup-form-section">
                    <div className="signup-header">
                        <Link to="/" className="back-home">
                            ← Retour à l'accueil
                        </Link>
                        <h1>Bienvenue sur HealthHub</h1>
                        <p>Créez votre compte et prenez le contrôle de votre parcours de santé</p>
                    </div>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nom">Nom</label>
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    placeholder="Entrer votre nom "
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="prenom">Prénom</label>
                                <input
                                    type="text"
                                    id="prenom"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    placeholder="Entrer votre prénom "
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Entrer votre email"
                                required
                            />
                        </div>
                            <div className="form-group">
                                <label htmlFor="telephone">Numéro de téléphone</label>
                                <input
                                    type="tel"
                                    id="telephone"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    placeholder="+212 (6) 000-0000"
                                />
                            </div>
                            </div>
                            <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="dateNaissance">Date de naissance</label>
                                <input
                                    type="date"
                                    id="dateNaissance"
                                    name="dateNaissance"
                                    value={formData.dateNaissance}
                                    onChange={handleChange}
                                />
                            </div>
                        

                        <div className="form-group">
                            <label htmlFor="motDePasse">Mot de passe</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="motDePasse"
                                name="motDePasse"
                                value={formData.motDePasse}
                                onChange={handleChange}
                                placeholder="Créer un mot de passe"
                                required
                            />
                            <button type="button"
                            onClick={handleShowPassword}
                            className='show-password'>
                            {showPassword ?
                                (<span style={{color:"black"}}><GoEye/></span>)
                                :
                                (<span style={{color:"black"}}><GoEyeClosed /></span>)
                            }
                            </button>
                           
                        </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='role'>Je suis un(e) :</label>
                            <select name="role" id="role" value={formData.role} onChange={handleChange} required>
                                <option value="" disabled>-- Sélectionnez votre rôle --</option>
                                <option value="PATIENT">Patient</option>
                                <option value="MEDCIN">Médecin</option>
                            </select>
                        </div>
                        <button type="submit" className="signup-submit-btn">
                            Créer Votre Compte
                        </button>

                        <div className="divider">
                            <span>ou s'inscrire avec</span>
                        </div>

                        <div className="social-signup">
                            <button type="button" className="social-btn google-btn">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                        </div>

                        <div className="login-link">
                            Vous avez déjè un compte? <Link to="/login" className="login-link-btn">Se connecter</Link>
                        </div>
                    </form>
                </div>

                {/* Right Side - HealthHub Branding */}
                <div className="signup-branding">
                    <div className="branding-content">
                        <div className="medical-icon">
                            <svg viewBox="0 0 100 100" width="80" height="80">
                                <circle cx="50" cy="50" r="45" fill="var(--primary-green-pale)" stroke="var(--primary-green)" strokeWidth="2"/>
                                <path d="M35 50 L65 50 M50 35 L50 65" stroke="var(--primary-green)" strokeWidth="4" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h2>Commencez Votre Parcours Santé</h2>
                        <p>Rejoignez des milliers d'utilisateurs qui font confiance à HealthHub pour leurs besoins médicaux et leur parcours de bien-être.</p>
                        <div className="benefits-list">
                            <div className="benefit">
                                <span className="benefit-icon">📊</span>
                                <div className="benefit-text">
                                    <strong>Suivi de la Santé</strong>
                                    <span>Surveillez vos signes vitaux et vos indicateurs de santé</span>
                                </div>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">🩺</span>
                                <div className="benefit-text">
                                    <strong>Consultations d'Experts</strong>
                                    <span>Connectez-vous avec des professionnels de santé certifiés</span>
                                </div>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">🔒</span>
                                <div className="benefit-text">
                                    <strong>Sécurisé & Privé</strong>
                                    <span>Vos données de santé sont cryptées et protégées</span>
                                </div>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">💊</span>
                                <div className="benefit-text">
                                    <strong>Gestion des Médicaments</strong>
                                    <span>Ne manquez jamais une dose grâce aux rappels intelligents</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;