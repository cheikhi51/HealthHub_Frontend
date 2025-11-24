import { Link } from 'react-router-dom';

const NoPage = () => {
  return (
    <div className='no-page-container'>
      <h1 className='error-code'>404</h1>
      <h2 className='error-title'>Page Introuvable</h2>
      <p className='error-message-no-page'>
        Désolé, la page que vous cherchez n'existe pas. Elle a peut-être été déplacée ou supprimée.
      </p>
      <Link to='/' className='return-home-btn'>
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NoPage;