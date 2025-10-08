// Configuration de l'application
export const config = {
  // Détection automatique de l'URL du backend
  apiBaseUrl: (() => {
    // Si on est sur localhost, on utilise localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    // Sinon on utilise la même IP que le frontend
    return `http://${window.location.hostname}:5000`;
  })(),
  
  // Version manuelle si besoin (décommentez et modifiez l'IP)
  // apiBaseUrl: 'http://192.168.1.100:5000',
};