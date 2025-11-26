import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';

const CASCallback = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("Traitement de l'authentification...");

  useEffect(() => {
    // S'assurer que la page est chargée côté client
    if (!router.isReady) return;

    const { ticket } = router.query;

    if (!ticket) {
      setStatus('error');
      setMessage("Aucun ticket d'authentification trouvé.");
      return;
    }

    // Simuler la validation du ticket
    // Dans une application réelle, vous feriez une requête au serveur pour valider ce ticket
    const validateTicket = async () => {
      try {
        // Simulation d'un appel API pour la validation du ticket CAS
        // Dans un vrai scénario, il faudrait appeler votre backend qui validera le ticket auprès du serveur CAS
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simuler un succès
        setStatus('success');
        setMessage("Authentification réussie");
        
        // Stocker l'information d'authentification dans le localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify({
            name: 'Utilisateur de Centrale Méditerranée',
            email: 'user@centrale-med.fr',
            loggedInAt: new Date().toISOString()
          }));
        }
        
        // Rediriger vers la page d'accueil après un délai
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        setStatus('error');
        setMessage("Erreur lors de l'authentification. Veuillez réessayer.");
      }
    };

    validateTicket();
  }, [router.isReady, router.query, router]);

  return (
    <Layout>
      <Head>
        <title>Authentification | Idea Box</title>
        <meta name="description" content="Traitement de l'authentification" />
      </Head>
      
      <section className="pt-32 pb-20 bg-brand-light min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {status === 'loading' && (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-12 w-12 text-brand-primary mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Authentification en cours</h2>
                <p className="text-brand-secondary">Veuillez patienter pendant la validation de votre connexion...</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Authentification réussie</h2>
                <p className="text-brand-secondary">Vous allez être redirigé vers la page d'accueil...</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Échec de l'authentification</h2>
                <p className="text-brand-secondary mb-6">{message}</p>
                <button 
                  onClick={() => router.push('/')}
                  className="bg-brand-primary hover:bg-blue-800 text-white font-medium rounded-full px-6 py-2"
                >
                  Retour à l'accueil
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CASCallback; 