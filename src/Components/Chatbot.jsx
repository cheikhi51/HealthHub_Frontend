import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  IoSend, 
  IoReload, 
  IoDownload,
  IoTime,
  IoPerson,
  IoCalendar,
  IoStatsChart,
  IoHelpCircle
} from "react-icons/io5";
import { 
  FaRobot, 
  FaUser, 
  FaStethoscope,
  FaHospital,
  FaClinicMedical 
} from "react-icons/fa";
import { 
  MessageCircle, 
  Zap, 
  Brain, 
  Shield,
  Clock
} from "lucide-react";

function Chatbot({ getAuthHeaders, userId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Message de bienvenue initial
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "👋 Bonjour ! Je suis votre assistant HealthHub IA. Je peux vous aider avec :\n\n• 📊 Les statistiques de la plateforme\n• 👥 La gestion des utilisateurs\n• 📅 Les rendez-vous et planning\n• 🏥 Les informations médicales\n• ⚙️ Le support technique\n\nComment puis-je vous assister aujourd'hui ?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'welcome'
        }
      ]);
    }
  }, []);

  // Suggestions rapides
  const quickSuggestions = [
    "Afficher les statistiques d'aujourd'hui",
    "Combien de rendez-vous en attente ?",
    "Nouveaux patients ce mois-ci",
    "Problèmes techniques courants",
    "Guide d'utilisation du dashboard"
  ];

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const headers = getAuthHeaders();
      const response = await axios.post('http://localhost:8080/api/chatbot', {
        message: textToSend,
        userId: userId,
        context: 'admin_dashboard'
      }, { headers });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
        type: 'response'
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Sauvegarder dans l'historique
      setConversationHistory(prev => [...prev, {
        question: textToSend,
        answer: response.data.response,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Erreur chatbot:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Je rencontre des difficultés techniques. Veuillez réessayer ou contacter le support.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "👋 Conversation réinitialisée ! Comment puis-je vous aider ?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'welcome'
      }
    ]);
  };

  const exportConversation = () => {
    const conversationText = messages.map(msg => 
      `${msg.sender === 'user' ? 'Vous' : 'Assistant'}: ${msg.text}\n${new Date(msg.timestamp).toLocaleString('fr-FR')}\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-healthhub-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    return today.toDateString() === messageDate.toDateString();
  };

  return (
    <div className="chatbot-page">
      {/* En-tête de la page */}
      <div className="chatbot-page-header">
        <div className="chatbot-page-title">
          <div className="chatbot-page-icon">
            <FaRobot />
          </div>
          <div>
            <h1>Assistant HealthHub IA</h1>
            <p>Votre assistant intelligent pour la gestion médicale</p>
          </div>
        </div>
        <div className="chatbot-page-actions">
          <button 
            className="chatbot-page-btn secondary"
            onClick={clearChat}
            title="Nouvelle conversation"
          >
            <IoReload />
            Nouvelle conversation
          </button>
          <button 
            className="chatbot-page-btn secondary"
            onClick={exportConversation}
            title="Exporter la conversation"
          >
            <IoDownload />
            Exporter
          </button>
        </div>
      </div>

      <div className="chatbot-page-content">
        {/* Sidebar des fonctionnalités */}
        <div className="chatbot-sidebar">
          <div className="sidebar-section">
            <h3>Fonctionnalités</h3>
            <div className="feature-list">
              <div className="feature-item">
                <IoStatsChart />
                <span>Statistiques</span>
              </div>
              <div className="feature-item">
                <IoPerson />
                <span>Gestion Utilisateurs</span>
              </div>
              <div className="feature-item">
                <IoCalendar />
                <span>Rendez-vous</span>
              </div>
              <div className="feature-item">
                <FaStethoscope />
                <span>Médecins</span>
              </div>
              <div className="feature-item">
                <FaHospital />
                <span>Patients</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Suggestions rapides</h3>
            <div className="suggestions-list">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-btn"
                  onClick={() => handleQuickSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Capacités de l'IA</h3>
            <div className="capabilities-list">
              <div className="capability">
                <Zap size={16} />
                <span>Réponses instantanées</span>
              </div>
              <div className="capability">
                <Brain size={16} />
                <span>Analyse des données</span>
              </div>
              <div className="capability">
                <Shield size={16} />
                <span>Sécurisé et privé</span>
              </div>
              <div className="capability">
                <Clock size={16} />
                <span>Disponible 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone principale de chat */}
        <div className="chatbot-main">
          {/* Zone des messages */}
          <div className="chatbot-messages-container">
            {messages.map((message, index) => {
              const showDate = index === 0 || 
                !isToday(message.timestamp) && 
                !isToday(messages[index - 1].timestamp);
              
              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="message-date-divider">
                      {isToday(message.timestamp) ? "Aujourd'hui" : formatDate(message.timestamp)}
                    </div>
                  )}
                  
                  <div 
                    className={`message ${message.sender} ${message.isError ? 'error' : ''} ${message.type || ''}`}
                  >
                    <div className="message-avatar">
                      {message.sender === 'user' ? <FaUser /> : <FaRobot />}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="message bot">
                <div className="message-avatar">
                  <FaRobot />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="chatbot-input-section">
            <div className="chatbot-input-wrapper">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question à l'assistant HealthHub IA..."
                rows="3"
                className="chatbot-input"
                disabled={isLoading}
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="chatbot-send-btn primary"
              >
                <IoSend />
                Envoyer
              </button>
            </div>
            <div className="chatbot-hint">
              <IoHelpCircle />
              Appuyez sur Entrée pour envoyer, Maj+Entrée pour un saut de ligne
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;