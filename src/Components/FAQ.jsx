import { useState ,useEffect} from "react";

function FAQ() {
    
    const [openQuestions, setOpenQuestions] = useState({});
    
    
    const toggleQuestion = (questionId) => {
        setOpenQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    }
    

    const questions = [
        {
            "id": 1,
            "question": "Comment faire une réservation d'un rendez-vous ?",
            "answer": "Il faut d'abord créer un compte, puis vous aurez accès à un espace Patient où vous pourrez réserver vos rendez-vous en toute simplicité."
        },
        {
            "id": 2,
            "question": "Quelles sont les spécialités que vous avez ?",
            "answer": "Nous proposons plusieurs spécialités médicales. Consultez la section 'Nos Services' pour plus d'informations détaillées."
        },
        {
            "id": 3,
            "question": "Est-ce que votre application est bien sécurisée ?",
            "answer": "Oui, HealthHub garantit la sécurité totale des informations concernant nos patients grâce à un chiffrement de bout en bout."
        },
        {
            "id": 4,
            "question": "Quels sont les modes de paiement ?",
            "answer": "Vous pouvez payer sur place en espèces ou par carte bancaire. Le choix vous appartient."
        }
    ];
    
    useEffect(()=>{
        const faqAnimation = document.querySelectorAll('.fade-up-element');
        const faqObserver = new IntersectionObserver((entities)=>{
            entities.forEach(entry =>{
            if (entry.isIntersecting){
                entry.target.classList.add('fade-up');
            }
            });
        },{ threshold: 0.1 });

            faqAnimation.forEach(element=>{
            faqObserver.observe(element);
            });

        return ()=>{
            faqAnimation.forEach(element => faqObserver.unobserve(element));
        };

    }, []);

    return (
        <div className="faq-wrapper" id="faq">
            <h2 className="section-title fade-up-element">Questions Fréquentes</h2>
            <p className="faq-intro fade-up-element">Trouvez rapidement les réponses à vos questions</p>
            
            <div className="faq-container fade-up-element">
                {questions.map(question => (
                    <div 
                        key={question.id} 
                        className={`faq-card ${openQuestions[question.id] ? 'open' : ''}`}
                    >
                        <div 
                            className="faq-header"
                            onClick={() => toggleQuestion(question.id)}
                        >
                            <h3 className="faq-question">{question.question}</h3>
                            <button className="faq-toggle">
                                {openQuestions[question.id] ? '−' : '+'}
                            </button>
                        </div>
                        
                        <div className={`faq-answer-wrapper ${openQuestions[question.id] ? 'active' : ''}`}>
                            <p className="faq-answer">{question.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FAQ;