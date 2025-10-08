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

        // Récupération des données météo actuelles, horaires et du nom de la ville
        const [current, hourly, cityNameResult] = await Promise.all([
            WeatherAPI.getCurrentWeather(props.weatherCoords.lat, props.weatherCoords.lon),
            WeatherAPI.getHourlyForecast(props.weatherCoords.lat, props.weatherCoords.lon),
            WeatherAPI.getCityName(props.weatherCoords.lat, props.weatherCoords.lon)
        ])

        currentWeather.value = current
        hourlyWeather.value = hourly
        cityName.value = cityNameResult

        console.log('✅ Données météo récupérées:', { current, hourly, cityName: cityNameResult })
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

// Prévisions horaires formatées
const hourlyForecast = computed(() => {
    if (!hourlyWeather.value) return []

    return hourlyWeather.value.hourly.slice(0, 24).map((hour, index) => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit' }),
        temperature: Math.round(hour.temp),
        condition: translateCondition(hour.weather[0].description),
        icon: getWeatherIcon(hour.weather[0].icon),
        isCurrentHour: index === 0
    }))
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
    <div class="weather-card bg-card rounded-2xl p-5 ml-1">
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

        <!-- En-tête avec condition météo -->
        <div v-else class="weather-header mb-4">
            <h3 class="text-xl font-semibold text-white mb-2">Météo actuelle à {{ displayData.city }}</h3>
        </div>

        <!-- Section principale avec température, heures de soleil, humidité -->
        <div v-if="currentWeather" class="weather-main-section flex gap-4 mb-4">
            <!-- Température -->
            <div class="weather-card-temp bg-card-secon rounded-2xl p-4">
                <div class="temperature-display text-center flex flex-col items-center">
                    <font-awesome-icon icon="temperature-half" class="text-secon text-2xl mb-1" />
                    <span class="font-bold text-secon">Température</span>
                    <span class="text-2xl font-bold text-white">{{ displayData.temperature }}°C</span>
                </div>
            </div>

            <!-- Lever du soleil -->
            <div class="weather-card-sunrise bg-card-secon rounded-2xl p-4">
                <div class="sunrise-display text-center flex flex-col items-center">
                    <font-awesome-icon icon="circle-up" class="text-secon text-2xl mb-2" />
                    <span class="font-bold text-secon">Lever de soleil</span>
                    <span class="text-2xl font-bold text-white">{{ displayData.sunrise }}</span>
                </div>
            </div>

            <!-- Coucher du soleil -->
            <div class="weather-card-sunset bg-card-secon rounded-2xl p-4">
                <div class="sunset-display text-center flex flex-col items-center">
                    <font-awesome-icon icon="circle-down" class="text-secon text-2xl mb-2" />
                    <span class="font-bold text-secon">Coucher de soleil</span>
                    <span class="text-2xl font-bold text-white">{{ displayData.sunset }}</span>
                </div>
            </div>

            <div class="weather-card-humidity bg-card-secon rounded-2xl p-4">
                <div class="humidity-display text-center flex flex-col items-center">
                    <font-awesome-icon icon="droplet" class="text-secon text-2xl mb-2" />
                    <span class="font-bold text-secon">Taux d'humidité</span>
                    <span class="text-2xl font-bold text-white">{{ displayData.humidity }}%</span>
                </div>
            </div>
        </div>

        <!-- Section météo horaire -->
        <div v-if="hourlyWeather && hourlyForecast.length > 0" class="weather-hourly-section mb-4">
            <h4 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <font-awesome-icon icon="clock" class="text-secon" />
                Prévisions horaires (24h)
            </h4>

            <div class="hourly-forecast-container bg-card-secon rounded-2xl p-4">
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
                                <span class="text-lg font-bold text-white">{{ forecast.temperature }}°</span>
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
    </div>
</template>

<style scoped>
.weather-card {
    min-width: 50rem;
    min-height: fit-content;
    max-width: 320px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.weather-main-section {
    justify-content: space-between;
}

.weather-card-temp,
.weather-card-sunrise,
.weather-card-sunset,
.weather-card-humidity {
    flex: 1;
    min-height: 5rem;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Animation d'apparition */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.weather-card {
    animation: fadeInUp 0.6s ease-out;
}

/* Styles pour la section météo horaire */
.weather-hourly-section {
    width: 100%;
}

.hourly-forecast-container {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.hourly-scroll-container {
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.hourly-scroll-container::-webkit-scrollbar {
    height: 6px;
}

.hourly-scroll-container::-webkit-scrollbar-track {
    background: transparent;
}

.hourly-scroll-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

.hourly-items-grid {
    display: flex;
    gap: 1rem;
    padding: 0.5rem 0;
    min-width: max-content;
}

.hourly-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 0.75rem;
    border-radius: 1rem;
    min-width: 10rem;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.hourly-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.hourly-item.current-hour {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: rgba(176, 176, 176, 0.86);
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
    transition: all 0.3s ease;
}

.hourly-item:hover .weather-icon {
    transform: scale(1.1);
}

.temperature {
    text-align: center;
}

.condition {
    text-align: center;
    max-width: 70px;
    line-height: 1.2;
}

/* Responsive */
@media (max-width: 640px) {
    .weather-card {
        min-width: 260px;
        max-width: 100%;
        padding: 1rem;
    }

    .grid-cols-2 {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .hourly-item {
        min-width: 70px;
        padding: 0.75rem 0.5rem;
    }

    .condition {
        max-width: 60px;
        font-size: 0.7rem;
    }
}
</style>