import { config } from '../config.js';

const API_BASE_URL = config.apiBaseUrl;

class WeatherAPI {
  /**
   * Récupère la météo actuelle pour des coordonnées données
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Données météo actuelles
   */
  static async getCurrentWeather(lat, lon) {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/current?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Météo actuelle récupérée:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la météo actuelle:', error);
      throw error;
    }
  }

  /**
   * Récupère les prévisions horaires
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Prévisions horaires
   */
  static async getHourlyForecast(lat, lon) {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/hourly?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Prévisions horaires récupérées:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des prévisions horaires:', error);
      throw error;
    }
  }

  /**
   * Récupère les prévisions journalières
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Prévisions journalières
   */
  static async getDailyForecast(lat, lon) {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/daily?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Prévisions journalières récupérées:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des prévisions journalières:', error);
      throw error;
    }
  }

  /**
   * Recherche les coordonnées d'une ville (géocodage direct)
   * @param {string} cityName - Nom de la ville à rechercher
   * @returns {Promise<Object>} Coordonnées de la ville {lat, lon, name}
   */
  static async searchCity(cityName) {
    try {
      const response = await fetch(`${API_BASE_URL}/geocoding?city=${encodeURIComponent(cityName)}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Résultats de recherche ville:', data);
      
      // Retourne les coordonnées si trouvées
      if (data && data.length > 0) {
        const location = data[0];
        return {
          lat: location.lat,
          lon: location.lon,
          name: location.name,
          country: location.country,
          state: location.state
        };
      }
      
      throw new Error(`Ville "${cityName}" non trouvée`);
    } catch (error) {
      console.error('Erreur lors de la recherche de ville:', error);
      throw error;
    }
  }

  /**
   * Récupère le nom de la ville à partir des coordonnées (géocodage inverse)
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<string>} Nom de la ville
   */
  static async getCityName(lat, lon) {
    try {
      const response = await fetch(`${API_BASE_URL}/geocoding/reverse?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Données de géocodage récupérées:', data);
      
      // Retourne le nom de la ville ou un fallback si pas trouvé
      if (data && data.length > 0) {
        const location = data[0];
        // Construction du nom avec ville, état/région et pays si disponibles
        const parts = [];
        if (location.name) parts.push(location.name);
        if (location.state) parts.push(location.state);
        if (location.country) parts.push(location.country);
        
        return parts.join(', ') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      }
      
      return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    } catch (error) {
      console.error('Erreur lors du géocodage inverse:', error);
      // Retourne les coordonnées en cas d'erreur
      return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    }
  }

  /**
   * Récupère toutes les données météo (actuelle + prévisions)
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Toutes les données météo
   */
  static async getAllWeatherData(lat, lon) {
    try {
      const [current, hourly, daily] = await Promise.all([
        this.getCurrentWeather(lat, lon),
        this.getHourlyForecast(lat, lon),
        this.getDailyForecast(lat, lon)
      ]);

      return {
        current,
        hourly,
        daily,
        coordinates: { lat, lon }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les données météo:', error);
      throw error;
    }
  }

}

export default WeatherAPI;