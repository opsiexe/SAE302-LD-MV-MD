<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import WeatherAPI from '../services/weatherAPI.js'

// Props pour recevoir les coordonnées météo
const props = defineProps({
    weatherCoords: {
        type: Object,
        default: () => ({ lat: null, lon: null })
    }
})

// État des données météo
const currentWeather = ref(null)
const hourlyWeather = ref(null)
const dailyWeather = ref(null)
const weatherAlerts = ref([])
const cityName = ref('')
const isLoading = ref(false)
const error = ref(null)

// Fonction pour récupérer les données météo
const fetchWeatherData = async () => {
    if (!props.weatherCoords.lat || !props.weatherCoords.lon) {
        return
    }

    isLoading.value = true
    error.value = null

    try {
        console.log('🌤️ Récupération météo pour:', props.weatherCoords)

        // Récupération de toutes les données météo
        const [current, hourly, daily, cityNameResult] = await Promise.all([
            WeatherAPI.getCurrentWeather(props.weatherCoords.lat, props.weatherCoords.lon),
            WeatherAPI.getHourlyForecast(props.weatherCoords.lat, props.weatherCoords.lon),
            WeatherAPI.getDailyForecast(props.weatherCoords.lat, props.weatherCoords.lon),
            WeatherAPI.getCityName(props.weatherCoords.lat, props.weatherCoords.lon)
        ])

        currentWeather.value = current
        hourlyWeather.value = hourly
        dailyWeather.value = daily
        cityName.value = cityNameResult

        // Extraction des alertes météo si présentes
        if (hourly.alerts && hourly.alerts.length > 0) {
            weatherAlerts.value = hourly.alerts
        } else if (daily.alerts && daily.alerts.length > 0) {
            weatherAlerts.value = daily.alerts
        } else {
            weatherAlerts.value = []
        }

        console.log('✅ Données météo récupérées:', { current, hourly, daily, alerts: weatherAlerts.value, cityName: cityNameResult })
    } catch (err) {
        console.error('❌ Erreur récupération météo:', err)
        error.value = err.message
    } finally {
        isLoading.value = false
    }
}

// Fonctions utilitaires pour le formatage
const formatTime = (timestamp, timezoneOffset = null) => {
    // Si on a un offset de fuseau horaire, on l'utilise pour l'heure locale
    if (timezoneOffset !== null) {
        // timezoneOffset est en secondes depuis UTC
        const date = new Date((timestamp + timezoneOffset) * 1000)
        return date.toUTCString().slice(17, 22) // Extraire HH:MM du format UTC
    }

    // Sinon, utiliser l'heure locale du navigateur
    return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getWeatherIcon = (weatherCode) => {
    // Mapping des codes météo OpenWeather vers FontAwesome
    const iconMap = {
        '01d': 'sun', '01n': 'moon',
        '02d': 'cloud-sun', '02n': 'cloud-moon',
        '03d': 'cloud', '03n': 'cloud',
        '04d': 'cloud', '04n': 'cloud',
        '09d': 'cloud-rain', '09n': 'cloud-rain',
        '10d': 'cloud-rain', '10n': 'cloud-rain',
        '11d': 'bolt', '11n': 'bolt',
        '13d': 'snowflake', '13n': 'snowflake',
        '50d': 'smog', '50n': 'smog'
    }
    return iconMap[weatherCode] || 'cloud'
}

const translateCondition = (description) => {
    // Traduction basique des conditions météo
    const translations = {
        'clear sky': 'Ciel dégagé',
        'few clouds': 'Quelques nuages',
        'scattered clouds': 'Nuages épars',
        'broken clouds': 'Nuageux',
        'overcast clouds': 'Couvert',
        'light rain': 'Pluie légère',
        'moderate rain': 'Pluie modérée',
        'heavy rain': 'Pluie forte',
        'thunderstorm': 'Orage',
        'snow': 'Neige',
        'mist': 'Brume'
    }
    return translations[description.toLowerCase()] || description
}

// Données calculées pour l'affichage
const displayData = computed(() => {
    if (!currentWeather.value) {
        return {
            city: 'Localisation inconnue',
            temperature: '--',
            sunrise: '--:--',
            sunset: '--:--',
            condition: 'Chargement...',
            humidity: '--',
            windSpeed: '--'
        }
    }

    const weather = currentWeather.value
    return {
        city: cityName.value || `${weather.lat.toFixed(2)}°, ${weather.lon.toFixed(2)}°`,
        temperature: Math.round(weather.current.temp),
        sunrise: formatTime(weather.current.sunrise, weather.timezone_offset),
        sunset: formatTime(weather.current.sunset, weather.timezone_offset),
        condition: translateCondition(weather.current.weather[0].description),
        humidity: weather.current.humidity,
        windSpeed: Math.round(weather.current.wind_speed * 3.6) // m/s vers km/h
    }
})

// Prévisions horaires formatées (6h optimisé)
const hourlyForecast = computed(() => {
    if (!hourlyWeather.value) return []

    return hourlyWeather.value.hourly.slice(0, 6).map((hour, index) => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit' }),
        temperature: Math.round(hour.temp),
        condition: translateCondition(hour.weather[0].description),
        icon: getWeatherIcon(hour.weather[0].icon),
        isCurrentHour: index === 0
    }))
})

// Prévisions journalières formatées (7 jours)
const dailyForecast = computed(() => {
    if (!dailyWeather.value) return []

    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

    return dailyWeather.value.daily.slice(0, 7).map((day, index) => {
        const date = new Date(day.dt * 1000)
        const dayName = index === 0 ? 'Aujourd\'hui' : days[date.getDay()]

        return {
            day: dayName,
            date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            tempMax: Math.round(day.temp.max),
            tempMin: Math.round(day.temp.min),
            condition: translateCondition(day.weather[0].description),
            icon: getWeatherIcon(day.weather[0].icon),
            pop: Math.round((day.pop || 0) * 100), // Probabilité de précipitation en %
            humidity: day.humidity,
            windSpeed: Math.round(day.wind_speed * 3.6),
            isToday: index === 0
        }
    })
})

// Watcher pour les changements de coordonnées
watch(() => props.weatherCoords, (newCoords) => {
    if (newCoords.lat && newCoords.lon) {
        fetchWeatherData()
    }
}, { deep: true, immediate: true })

// Chargement initial si les coordonnées sont déjà présentes
onMounted(() => {
    if (props.weatherCoords.lat && props.weatherCoords.lon) {
        fetchWeatherData()
    }
})
</script>

<template>
    <div class="weather-card bg-card rounded-2xl">
        <!-- Message d'état -->
        <div v-if="isLoading" class="weather-header mb-4 text-center">
            <h3 class="text-xl font-semibold text-white mb-2">Chargement...</h3>
            <font-awesome-icon icon="spinner" spin class="text-secon text-2xl" />
        </div>

        <div v-else-if="error" class="weather-header mb-4 text-center">
            <h3 class="text-xl font-semibold text-red-400 mb-2">Erreur</h3>
            <p class="text-secon">{{ error }}</p>
        </div>

        <div v-else-if="!currentWeather" class="weather-header mb-4 text-center">
            <h3 class="text-xl font-semibold text-white mb-2">Cliquez sur la carte</h3>
            <p class="text-secon">Sélectionnez un lieu pour voir la météo</p>
        </div>

        <!-- Layout en 2 colonnes -->
        <div v-else class="weather-layout">
            <!-- Colonne gauche : Infos ville + Horaires + Alertes -->
            <div class="weather-left-column">
                <!-- En-tête avec condition météo -->
                <div class="weather-header mb-2">
                    <h3 class="text-lg font-semibold text-white mb-1">{{ displayData.city }}</h3>
                </div>

                <!-- Section principale avec température, heures de soleil, humidité -->
                <div class="weather-main-section flex gap-3 mb-2">
                    <!-- Température -->
                    <div class="weather-card-temp bg-card-secon rounded-2xl">
                        <div class="temperature-display text-center flex flex-col items-center">
                            <font-awesome-icon icon="temperature-half" class="text-secon text-xl mb-1" />
                            <span class="text-sm font-bold text-secon">Température</span>
                            <span class="text-xl font-bold text-white">{{ displayData.temperature }}°C</span>
                        </div>
                    </div>

                    <!-- Lever du soleil -->
                    <div class="weather-card-sunrise bg-card-secon rounded-2xl">
                        <div class="sunrise-display text-center flex flex-col items-center">
                            <font-awesome-icon icon="circle-up" class="text-secon text-xl mb-1" />
                            <span class="text-sm font-bold text-secon">Lever</span>
                            <span class="text-xl font-bold text-white">{{ displayData.sunrise }}</span>
                        </div>
                    </div>

                    <!-- Coucher du soleil -->
                    <div class="weather-card-sunset bg-card-secon rounded-2xl">
                        <div class="sunset-display text-center flex flex-col items-center">
                            <font-awesome-icon icon="circle-down" class="text-secon text-xl mb-1" />
                            <span class="text-sm font-bold text-secon">Coucher</span>
                            <span class="text-xl font-bold text-white">{{ displayData.sunset }}</span>
                        </div>
                    </div>

                    <div class="weather-card-humidity bg-card-secon rounded-2xl">
                        <div class="humidity-display text-center flex flex-col items-center">
                            <font-awesome-icon icon="droplet" class="text-secon text-xl mb-1" />
                            <span class="text-sm font-bold text-secon">Humidité</span>
                            <span class="text-xl font-bold text-white">{{ displayData.humidity }}%</span>
                        </div>
                    </div>
                </div>

                <!-- Section météo horaire -->
                <div v-if="hourlyWeather && hourlyForecast.length > 0" class="weather-hourly-section mb-2">
                    <h4 class="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                        <font-awesome-icon icon="clock" class="text-secon" />
                        Aujourd'hui
                    </h4>

                    <div class="hourly-forecast-container bg-card-secon rounded-2xl">
                        <div class="hourly-scroll-container">
                            <div class="hourly-items-grid">
                                <div v-for="(forecast, index) in hourlyForecast" :key="index" :class="[
                                    'hourly-item',
                                    { 'current-hour': forecast.isCurrentHour }
                                ]">
                                    <!-- Heure -->
                                    <div class="hour-time">
                                        <span class="text-sm font-medium">{{ forecast.time }}</span>
                                        <span v-if="forecast.isCurrentHour" class="current-indicator">Maintenant</span>
                                    </div>

                                    <!-- Icône météo -->
                                    <div class="weather-icon-container">
                                        <font-awesome-icon :icon="forecast.icon" :class="[
                                            'weather-icon text-2xl',
                                            forecast.isCurrentHour ? 'text-secon' : 'text-secon'
                                        ]" />
                                    </div>

                                    <!-- Température -->
                                    <div class="temperature">
                                        <span class="text-lg font-bold text-white">{{ forecast.temperature
                                            }}°</span>
                                    </div>

                                    <!-- Condition -->
                                    <div class="condition">
                                        <span class="text-xs text-secon text-center">{{ forecast.condition }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section alertes météo -->
                <div v-if="weatherAlerts.length > 0" class="weather-alerts-section">
                    <h4 class="text-base font-semibold text-white mb-2 flex items-center gap-2">
                        <font-awesome-icon icon="triangle-exclamation" class="text-red-400" />
                        Alertes météo
                    </h4>

                    <div class="alerts-container">
                        <div v-for="(alert, index) in weatherAlerts" :key="index"
                            class="alert-item bg-card-secon rounded-2xl">
                            <div class="alert-header flex items-start gap-3 mb-2">
                                <font-awesome-icon icon="circle-exclamation"
                                    class="text-2xl text-red-400 shrink-0 mt-1" />
                                <div class="alert-content flex-1">
                                    <h5 class="text-base font-bold text-white mb-1">{{ alert.event }}</h5>
                                    <p class="text-sm text-secon">{{ alert.sender_name }}</p>
                                </div>
                            </div>
                            <p class="text-sm text-white leading-relaxed alert-description">{{ alert.description }}
                            </p>
                            <div class="alert-dates flex gap-4 mt-3 text-xs text-secon">
                                <div class="flex items-center gap-1">
                                    <font-awesome-icon icon="clock" />
                                    <span>Début: {{ new Date(alert.start * 1000).toLocaleString('fr-FR') }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <font-awesome-icon icon="clock" />
                                    <span>Fin: {{ new Date(alert.end * 1000).toLocaleString('fr-FR') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Colonne droite : Prévisions journalières -->
            <div class="weather-right-column">
                <!-- Section prévisions sur 5 jours -->
                <div v-if="dailyWeather && dailyForecast.length > 0" class="weather-daily-section">
                    <h4 class="text-base font-semibold text-white mb-2 flex items-center gap-2">
                        <font-awesome-icon icon="calendar-days" class="text-secon" />
                        Prochains jours
                    </h4>

                    <div class="daily-forecast-container bg-card-secon rounded-2xl">
                        <div class="daily-items-grid">
                            <div v-for="(forecast, index) in dailyForecast" :key="index" :class="[
                                'daily-item',
                                { 'today': forecast.isToday }
                            ]">
                                <!-- Jour et date -->
                                <div class="day-info">
                                    <span class="text-sm font-bold text-white">{{ forecast.day }}</span>
                                    <span class="text-xs text-secon">{{ forecast.date }}</span>
                                </div>

                                <!-- Icône météo -->
                                <div class="weather-icon-container-daily">
                                    <font-awesome-icon :icon="forecast.icon"
                                        class="weather-icon-daily text-2xl text-secon" />
                                </div>

                                <!-- Températures -->
                                <div class="temperatures">
                                    <div class="temp-range">
                                        <span class="temp-max text-white font-bold">{{ forecast.tempMax }}°</span>
                                        <span class="temp-separator text-secon">/</span>
                                        <span class="temp-min text-secon">{{ forecast.tempMin }}°</span>
                                    </div>
                                </div>

                                <!-- Condition et probabilité de pluie -->
                                <div class="daily-details">
                                    <span class="text-xs text-secon text-center condition-text">{{
                                        forecast.condition }}</span>
                                    <div v-if="forecast.pop > 0"
                                        class="precipitation flex items-center gap-1 justify-center">
                                        <font-awesome-icon icon="droplet" class="text-xs text-blue-400" />
                                        <span class="text-xs text-blue-400">{{ forecast.pop }}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.weather-card {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    padding: 1rem !important;
}

/* Layout en 2 colonnes */
.weather-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    height: 100%;
    overflow: hidden;
}

/* Colonne gauche avec scroll */
.weather-left-column {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 0.25rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.weather-left-column::-webkit-scrollbar {
    width: 6px;
}

.weather-left-column::-webkit-scrollbar-track {
    background: transparent;
}

.weather-left-column::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.weather-left-column::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Colonne droite avec scroll */
.weather-right-column {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 0.25rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.weather-right-column::-webkit-scrollbar {
    width: 6px;
}

.weather-right-column::-webkit-scrollbar-track {
    background: transparent;
}

.weather-right-column::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.weather-right-column::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

.weather-card:hover {
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
}

.weather-main-section {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.weather-card-temp,
.weather-card-sunrise,
.weather-card-sunset,
.weather-card-humidity {
    flex: 1 1 calc(25% - 0.5rem);
    min-width: 100px;
    min-height: 3.5rem;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    padding: 0.5rem;
}

.weather-card-temp:hover,
.weather-card-sunrise:hover,
.weather-card-sunset:hover,
.weather-card-humidity:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.05);
}

/* Animation d'apparition */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.weather-card {
    animation: fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Styles pour la section météo horaire */
.weather-hourly-section {
    width: 100%;
}

.hourly-forecast-container {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
    padding: 0.5rem;
}

.hourly-forecast-container:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hourly-scroll-container {
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE et Edge */
}

.hourly-scroll-container::-webkit-scrollbar {
    display: none;
}

.hourly-items-grid {
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem 0;
    min-width: max-content;
}

.hourly-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.375rem;
    border-radius: 0.75rem;
    min-width: 7rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
}

.hourly-item:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.hourly-item.current-hour {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
    border-color: rgba(176, 176, 176, 0.4);
    box-shadow: 0 4px 12px rgba(176, 176, 176, 0.2);
}

.hour-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.hour-time span:first-child {
    color: white;
}

.current-indicator {
    font-size: 0.7rem;
    color: #ffffff;
    font-weight: bold;
    text-transform: uppercase;
}

.weather-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
}

.weather-icon {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.hourly-item:hover .weather-icon {
    transform: scale(1.2) rotate(10deg);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

.temperature {
    text-align: center;
}

.condition {
    text-align: center;
    max-width: 70px;
    line-height: 1.2;
}

/* Styles pour les prévisions journalières */
.weather-daily-section {
    width: 100%;
}

.daily-forecast-container {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
    padding: 0.5rem;
}

.daily-forecast-container:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.daily-items-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.daily-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.5rem;
    border-radius: 0.75rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
    background: rgba(255, 255, 255, 0.03);
}

.daily-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.daily-item.today {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
    border-color: rgba(176, 176, 176, 0.4);
    box-shadow: 0 4px 12px rgba(176, 176, 176, 0.2);
}

.day-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.125rem;
    min-width: 80px;
}

.weather-icon-container-daily {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 50px;
}

.weather-icon-daily {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

.daily-item:hover .weather-icon-daily {
    transform: scale(1.15) rotate(-5deg);
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
}

.temperatures {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.temp-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
}

.temp-max {
    font-weight: bold;
}

.temp-min {
    font-weight: normal;
}

.temp-separator {
    font-weight: normal;
    opacity: 0.6;
}

.daily-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    min-width: 100px;
}

.condition-text {
    max-width: 120px;
    line-height: 1.3;
}

.precipitation {
    margin-top: 0.25rem;
}

/* Styles pour les alertes météo */
.weather-alerts-section {
    width: 100%;
}

.alerts-container {
    display: flex;
    flex-direction: column;
}

.alert-item {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 100, 100, 0.3);
    background: linear-gradient(135deg, rgba(255, 50, 50, 0.1) 0%, rgba(255, 100, 100, 0.05) 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0.75rem;
    margin-bottom: 0.5rem;
}

@keyframes alertPulse {

    0%,
    100% {
        box-shadow: 0 4px 12px rgba(255, 100, 100, 0.2);
    }

    50% {
        box-shadow: 0 6px 20px rgba(255, 100, 100, 0.4);
    }
}

.alert-item:hover {
    transform: translateX(4px);
    border-color: rgba(255, 100, 100, 0.5);
    box-shadow: 0 8px 24px rgba(255, 100, 100, 0.4);
    animation: none;
}

.alert-header {
    margin-bottom: 0.75rem;
}

.alert-content {
    flex: 1;
}

.alert-description {
    border-left: 3px solid rgba(255, 100, 100, 0.5);
    padding-left: 1rem;
    margin-left: 0.5rem;
}

.alert-dates {
    flex-wrap: wrap;
    opacity: 0.8;
}

/* Responsive Tablettes */
@media (max-width: 1024px) {
    .weather-card {
        padding: 0.75rem;
    }

    .weather-layout {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .weather-left-column,
    .weather-right-column {
        padding: 0;
        overflow-y: visible;
    }

    .weather-main-section {
        gap: 0.5rem;
    }

    .weather-card-temp,
    .weather-card-sunrise,
    .weather-card-sunset,
    .weather-card-humidity {
        flex: 1 1 calc(50% - 0.5rem);
        min-width: 100px;
        min-height: 3.5rem;
    }

    .daily-items-grid {
        gap: 0.5rem;
    }

    .daily-item {
        padding: 0.625rem 0.5rem;
    }
}

/* Responsive Mobiles */
@media (max-width: 640px) {
    .weather-card {
        padding: 0.5rem;
        margin-left: 0;
    }

    .weather-layout {
        grid-template-columns: 1fr;
    }

    .weather-header h3 {
        font-size: 0.9rem;
    }

    .weather-main-section {
        gap: 0.375rem;
    }

    .weather-card-temp,
    .weather-card-sunrise,
    .weather-card-sunset,
    .weather-card-humidity {
        flex: 1 1 calc(50% - 0.375rem);
        min-width: 85px;
        min-height: 3rem;
        padding: 0.5rem;
    }

    .weather-card-temp .temperature-display span:first-of-type,
    .weather-card-sunrise .sunrise-display span:first-of-type,
    .weather-card-sunset .sunset-display span:first-of-type,
    .weather-card-humidity .humidity-display span:first-of-type {
        font-size: 0.75rem;
    }

    .weather-card-temp .temperature-display span:last-child,
    .weather-card-sunrise .sunrise-display span:last-child,
    .weather-card-sunset .sunset-display span:last-child,
    .weather-card-humidity .humidity-display span:last-child {
        font-size: 1rem;
    }

    .hourly-item {
        min-width: 70px;
        padding: 0.5rem 0.375rem;
        gap: 0.375rem;
    }

    .condition {
        max-width: 60px;
        font-size: 0.6rem;
    }

    .weather-hourly-section h4,
    .weather-daily-section h4,
    .weather-alerts-section h4 {
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }

    .daily-items-grid {
        gap: 0.375rem;
    }

    .daily-item {
        padding: 0.5rem 0.375rem;
        gap: 0.75rem;
        grid-template-columns: auto 1fr auto;
    }

    .day-info {
        min-width: 60px;
    }

    .day-info span:first-child {
        font-size: 0.8rem;
    }

    .day-info span:last-child {
        font-size: 0.7rem;
    }

    .weather-icon-daily {
        font-size: 1.5rem !important;
    }

    .temp-range {
        font-size: 0.875rem;
    }

    .daily-details {
        min-width: 80px;
    }

    .condition-text {
        font-size: 0.65rem;
    }

    .alert-item {
        padding: 0.5rem;
        margin-bottom: 0.375rem;
    }

    .alert-description {
        font-size: 0.75rem;
    }
}

/* Responsive petits mobiles */
@media (max-width: 380px) {
    .weather-card {
        padding: 0.375rem;
    }

    .weather-layout {
        grid-template-columns: 1fr;
    }

    .weather-header h3 {
        font-size: 0.8rem;
    }

    .weather-main-section {
        gap: 0.25rem;
    }

    .weather-card-temp,
    .weather-card-sunrise,
    .weather-card-sunset,
    .weather-card-humidity {
        flex: 1 1 calc(50% - 0.25rem);
        min-width: 75px;
        min-height: 2.75rem;
        padding: 0.375rem;
    }

    .weather-card-temp .temperature-display span:first-of-type,
    .weather-card-sunrise .sunrise-display span:first-of-type,
    .weather-card-sunset .sunset-display span:first-of-type,
    .weather-card-humidity .humidity-display span:first-of-type {
        font-size: 0.7rem;
    }

    .weather-card-temp .temperature-display span:last-child,
    .weather-card-sunrise .sunrise-display span:last-child,
    .weather-card-sunset .sunset-display span:last-child,
    .weather-card-humidity .humidity-display span:last-child {
        font-size: 0.9rem;
    }

    .hourly-item {
        min-width: 60px;
        padding: 0.375rem 0.25rem;
        gap: 0.25rem;
    }

    .condition {
        max-width: 50px;
        font-size: 0.55rem;
    }

    .daily-items-grid {
        gap: 0.25rem;
    }

    .daily-item {
        padding: 0.375rem 0.25rem;
        gap: 0.5rem;
    }

    .day-info {
        min-width: 50px;
    }

    .weather-icon-daily {
        font-size: 1.25rem !important;
    }

    .temp-range {
        font-size: 0.75rem;
    }

    .day-info span:first-child {
        font-size: 0.7rem;
    }

    .day-info span:last-child {
        font-size: 0.6rem;
    }

    .daily-details {
        min-width: 70px;
    }

    .condition-text {
        font-size: 0.6rem;
    }

    .alert-item {
        padding: 0.375rem;
        margin-bottom: 0.25rem;
    }

    .alert-description {
        font-size: 0.7rem;
    }

    .alert-dates {
        font-size: 0.6rem;
    }
}
</style>