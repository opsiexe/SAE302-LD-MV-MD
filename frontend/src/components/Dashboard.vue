<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SearchBar from './SearchBar.vue'
import CurrentWeatherCard from './CurrentWeatherCard.vue'
import DailyWeatherCard from './DailyWeatherCard.vue' // Ajout de l'import
import WeatherAPI from '../services/weatherAPI.js'

// Props pour recevoir les coordonnées météo
const props = defineProps({
  weatherCoords: {
    type: Object,
    default: () => ({ lat: null, lon: null })
  }
})

// Émissions d'événements
const emit = defineEmits(['update-coords'])

const isOpen = ref(false)
const searchValue = ref('')

const toggleDashboard = () => {
  isOpen.value = !isOpen.value
}

const openDashboard = () => {
  isOpen.value = true
}

const handleSearchClick = () => {
  if (!isOpen.value) {
    isOpen.value = true
  }
}

// Gestion de la recherche de ville
const handleCitySearch = async (cityName) => {
  if (!cityName || cityName.trim() === '') {
    return
  }

  try {
    console.log('🔍 Recherche de ville:', cityName)

    // Rechercher les coordonnées de la ville
    const cityData = await WeatherAPI.searchCity(cityName.trim())

    console.log('📍 Ville trouvée:', cityData)

    // Émettre les nouvelles coordonnées vers le parent (App.vue)
    emit('update-coords', {
      lat: cityData.lat,
      lon: cityData.lon
    })

    // Ouvrir le dashboard si fermé
    if (!isOpen.value) {
      isOpen.value = true
    }

  } catch (error) {
    console.error('❌ Erreur recherche ville:', error)
    alert(`Erreur: ${error.message}`)
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Exposer les méthodes pour le composant parent
defineExpose({
  openDashboard,
  toggleDashboard
})

// Navigation pour DailyWeatherCard
const selectedDayIndex = ref(0)
const maxDayIndex = 4 // 5 jours (0 à 4)

const prevDay = () => {
  if (selectedDayIndex.value > 0) selectedDayIndex.value--
}
const nextDay = () => {
  if (selectedDayIndex.value < maxDayIndex) selectedDayIndex.value++
}
</script>

<template>
  <!-- Conteneur principal avec carte en arrière-plan -->
  <div class="relative w-screen h-screen overflow-hidden">

    <!-- Barre de recherche qui s'agrandit en dashboard -->
    <div class="dashboard-container bg-main" :class="{ 'is-open': isOpen }">
      <!-- En-tête avec flèche et barre de recherche -->
      <div :class="[
        'flex flex-col flex-shrink-0',
        'transition-all duration-500 ease-out',
        isOpen ? 'pt-1 pl-1 pr-3 sm:pr-6 pb-4 sm:pb-6 justify-start' : 'h-20 sm:h-24 p-1 justify-center'
      ]">
        <!-- Flèche (toujours en haut) -->
        <transition name="chevron-delay">
          <div v-if="!isOpen" :class="[
            'transition-all duration-500 ease-out flex w-full justify-center mb-0'
          ]">
            <font-awesome-icon icon="chevron-up" :class="[ 'text-xl sm:text-2xl font-bold cursor-pointer transition-all duration-300 text-secon hover:text-text' ]" @click="toggleDashboard" />
          </div>
        </transition>

        <!-- Barre de recherche (en dessous) -->
        <div :class="[
          'transition-all duration-500 ease-out flex w-full items-center justify-start'
        ]" @click="handleSearchClick">
          <SearchBar v-model="searchValue" placeholder="Rechercher une ville"
            :class="isOpen ? 'pointer-events-auto' : ''" @search="handleCitySearch" />
        </div>
      </div>

      <!-- Contenu du dashboard qui apparaît après l'animation d'ouverture -->
      <transition name="slide-in-content" mode="out-in">
        <div v-if="isOpen" class="dashboard-content flex-1 overflow-hidden px-1 sm:px-3 pb-4 sm:pb-6">
          <div class="content-scroll h-full overflow-y-auto">
            <!-- Ligne principale : CurrentWeatherCard à gauche, DailyWeatherCard unique à droite avec navigation -->
            <div class="flex flex-row gap-6 mb-6 items-start">
              <CurrentWeatherCard :weather-coords="props.weatherCoords" />
              <div class="flex flex-col items-center">
                <div class="flex flex-row items-center gap-2">
                  <button
                    class="nav-arrow rounded-full bg-card-secon text-secon hover:bg-secon hover:text-main p-3 transition text-2xl"
                    @click="prevDay"
                    :disabled="selectedDayIndex === 0"
                  >
                    <font-awesome-icon icon="chevron-left" />
                  </button>
                  <DailyWeatherCard :day-index="selectedDayIndex" />
                  <button
                    class="nav-arrow rounded-full bg-card-secon text-secon hover:bg-secon hover:text-main p-3 transition text-2xl"
                    @click="nextDay"
                    :disabled="selectedDayIndex === maxDayIndex"
                  >
                    <font-awesome-icon icon="chevron-right" />
                  </button>
                </div>
                <div class="mt-2 text-xs text-secon">
                  Jour {{ selectedDayIndex + 1 }} / {{ maxDayIndex + 1 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Overlay sombre quand le dashboard est ouvert -->
    <transition name="fade-overlay">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-40" @click="toggleDashboard"></div>
    </transition>
  </div>
</template>

<style scoped>
/* Animation séquentielle : étape 1 - Redimensionnement + SearchBar (500ms) */
/* Animation séquentielle : étape 2 - Contenu qui apparaît après (délai 500ms + durée 400ms) */

/* Container du dashboard avec animations CSS pures pour éviter les glitches */
.dashboard-container {
  position: fixed;
  z-index: 50;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  bottom: 2rem;
  left: 2rem;
  width: 25rem;
  height: 6rem;
  max-width: 25rem;
  transition: width 0.5s ease-out, height 0.5s ease-out, max-width 0.5s ease-out;
  transform-origin: bottom left;
  overflow: hidden;
  backface-visibility: hidden;
  will-change: width, height, max-width;
}

.dashboard-container.is-open {
  width: calc(100vw - 4rem);
  max-width: 95rem;
  height: calc(90vh);
}

/* Responsive pour tablettes */
@media (max-width: 768px) {
  .dashboard-container {
    bottom: 1.5rem;
    left: 1.5rem;
    width: 20rem;
    max-width: 20rem;
  }

  .dashboard-container.is-open {
    width: calc(100vw - 3rem);
    height: calc(90vh);
  }
}

/* Responsive pour mobiles */
@media (max-width: 480px) {
  .dashboard-container {
    bottom: 1rem;
    left: 1rem;
    width: calc(100vw - 2rem);
    max-width: calc(100vw - 2rem);
    border-radius: 0.75rem;
  }

  .dashboard-container.is-open {
    width: calc(100vw - 2rem);
    height: calc(88vh);
    bottom: 1rem;
    left: 1rem;
  }
}

/* Responsive pour très petits écrans */
@media (max-width: 360px) {
  .dashboard-container {
    bottom: 0.75rem;
    left: 0.75rem;
    width: calc(100vw - 1.5rem);
    max-width: calc(100vw - 1.5rem);
    border-radius: 0.5rem;
  }

  .dashboard-container.is-open {
    width: calc(100vw - 1.5rem);
    height: calc(86vh);
    bottom: 0.75rem;
    left: 0.75rem;
  }
}

/* Animation du contenu du dashboard - Apparaît APRÈS le redimensionnement */
.slide-in-content-enter-active {
  transition: all 0.4s ease 0.5s;
  /* Délai de 500ms pour attendre la fin du redimensionnement */
}

.slide-in-content-leave-active {
  transition: all 0.1s ease;
  /* Sort très rapidement pour éviter la scrollbar */
  overflow: hidden !important;
}

.slide-in-content-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-in-content-leave-to {
  opacity: 0;
  transform: translateY(10px);
  overflow: hidden !important;
}

/* Classes spécifiques pour masquer le scroll pendant les animations */
.dashboard-content {
  overflow: hidden !important;
}

.slide-in-content-leave-active .content-scroll {
  overflow: hidden !important;
}

.slide-in-content-leave-to .content-scroll {
  overflow: hidden !important;
}

/* Animation du titre et bouton fermer - Apparaît avec le redimensionnement */
.slide-in-title-enter-active {
  transition: all 0.3s ease 0.3s;
  /* Apparaît pendant le redimensionnement */
}

.slide-in-title-leave-active {
  transition: all 0.15s ease;
  /* Sort très rapidement pour éviter les glitches */
}

.slide-in-title-enter-from {
  opacity: 0;
  transform: translateX(-5px);
}

.slide-in-title-leave-to {
  opacity: 0;
  transform: translateX(-5px);
}

/* Animation de l'overlay - Synchronisé avec le redimensionnement */
.fade-overlay-enter-active {
  transition: opacity 0.5s ease;
}

.fade-overlay-leave-active {
  transition: opacity 0.5s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

/* Animation du chevron - Apparaît après la fermeture */
.chevron-delay-enter-active {
  transition: opacity 0.2s ease 0.5s;
  /* Délai de 500ms pour attendre la fin de la fermeture */
}

.chevron-delay-leave-active {
  transition: opacity 0.1s ease;
  /* Sort rapidement */
}

.chevron-delay-enter-from,
.chevron-delay-leave-to {
  opacity: 0;
}
</style>