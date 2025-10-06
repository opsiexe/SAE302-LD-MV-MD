<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <!-- Search Bar intégrée en haut -->
    <SearchBar @search="fetchWeatherData" />

    <!-- Dashboard météo -->
    <div
      v-if="weatherData"
      class="mt-6 bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto space-y-6"
    >
      <!-- En-tête -->
      <h2 class="text-2xl font-bold text-gray-800">
        Météo à {{ cityName }}
      </h2>

      <!-- Données météo principales -->
      <div class="grid grid-cols-2 gap-6 text-gray-700">
        <div>
          <p class="text-sm text-gray-500">🌡️ Température</p>
          <p class="text-xl font-semibold">{{ weatherData.temp }}°C</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">🤒 Ressenti</p>
          <p class="text-xl font-semibold">{{ weatherData.feels_like }}°C</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">💧 Humidité</p>
          <p class="text-xl font-semibold">{{ weatherData.humidity }}%</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">💨 Vent</p>
          <p class="text-xl font-semibold">{{ weatherData.wind_speed }} km/h</p>
        </div>
      </div>

      <!-- Description météo -->
      <div class="mt-4 text-gray-600 italic">
        <p>Conditions : {{ weatherData.description }}</p>
      </div>
    </div>

    <!-- Message si pas encore de données -->
    <div v-else class="mt-10 text-center text-gray-500">
      Recherchez une ville pour afficher la météo.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import SearchBar from './SearchBar.vue'

const weatherData = ref(null)
const cityName = ref('')

// Fonction pour récupérer les données météo depuis ton backend
async function fetchWeatherData(city) {
  cityName.value = city

  try {
    // Appel au backend pour obtenir les coordonnées (via API geocoding)
    const geo = await axios.get(`http://localhost:5000/api/geo?city=${city}`)
    const { lat, lon } = geo.data

    // Appel au backend pour les données météo
    const response = await axios.get(
      `http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`
    )
    const data = response.data

    // Mise à jour des données à afficher
    weatherData.value = {
      temp: data.current.temp,
      feels_like: data.current.feels_like,
      humidity: data.current.humidity,
      wind_speed: data.current.wind_speed,
      description: data.current.weather[0].description,
    }
  } catch (err) {
    console.error('Erreur lors de la récupération météo:', err)
    weatherData.value = null
  }
}
</script>
