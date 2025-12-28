import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import axios from 'axios';
function Login({setAuthToken}) {
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            localStorage.setItem('jwtToken', response.data.token);
            setAuthToken(response.data.token);
            const role = response.data.role;
            localStorage.setItem('userRole', role);
            switch(role) {
                case 'PATIENT':
                    navigate('/DashboardPatient');
                    break;
                case 'MEDCIN':
                    navigate('/DashboardMedecin');
                    break;
                case 'ADMIN':
                    navigate('/DashboardAdmin');
                    break;
                default: navigate('/');
            }
        }
        catch (error) {
            console.error('Informations incorrectes: ', error);
        }
    
    };

    useEffect(()=>{
    const loginAnimation = document.querySelectorAll('.fade-in-element');
    const loginObserver = new IntersectionObserver((entities)=>{
        entities.forEach(entry =>{
        if (entry.isIntersecting){
            entry.target.classList.add('fade-in');
        }
        });
    },{ threshold: 0.1 });

        loginAnimation.forEach(element=>{
        loginObserver.observe(element);
        });

    return ()=>{
        loginAnimation.forEach(element => loginObserver.unobserve(element));
    };

  }, []);
    return (
        <div className="login-page">
            <div className="login-container fade-in-element">
                {/* Left Side - Form */}
                <div className="login-form-section">
                    <div className="login-header">
                        <Link to="/" className="back-home">
                            ← Retour à l'accueil
                        </Link>
                        <h1>Bienvenue</h1>
                        <p>Connectez-vous à votre compte HealthHub</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Adresse Email</label>
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
                            <label htmlFor="motDePasse">Mot de passe</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="motDePasse"
                                name="motDePasse"
                                value={formData.motDePasse}
                                onChange={handleChange}
                                placeholder="Entrer votre mot de passe"
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

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#forgot" className="forgot-password">
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" className="login-submit-btn">
                            Sign In
                        </button>

                        <div className="divider">
                            <span>Or continue with</span>
                        </div>

                        <div className="social-login">
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

                        <div className="signup-link">
                            Don't have an account? <Link to="/signup" className="signup-link-btn">Sign up</Link>
                        </div>
                    </form>
                </div>

                {/* Right Side - HealthHub Branding */}
                <div className="login-branding">
                    <div className="branding-content">
                        <div className="medical-icon">
                            <svg viewBox="0 0 100 100" width="80" height="80">
                                <circle cx="50" cy="50" r="45" fill="var(--primary-green-pale)" stroke="var(--primary-green)" strokeWidth="2"/>
                                <path d="M35 50 L65 50 M50 35 L50 65" stroke="var(--primary-green)" strokeWidth="4" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h2>Votre Santé, Notre Priorité</h2>
                        <p>Accédez à vos dossiers médicaux, prenez des rendez-vous et connectez-vous avec des professionnels de santé en toute simplicité avec HealthHub.</p>
                        <div className="brand-features">
                            <div className="feature">
                                <span className="feature-icon-circle">⚕️</span>
                                <span>Dossiers Médicaux</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon-circle">📅</span>
                                <span>Prise de Rendez-vous</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon-circle">👨‍⚕️</span>
                                <span>Consultations Médicales</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;