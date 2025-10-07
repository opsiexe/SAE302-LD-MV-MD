const API_BASE_URL = 'http://localhost:5000';

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