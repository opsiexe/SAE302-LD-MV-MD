<script setup>
import { ref } from 'vue';
import SearchBar from './components/Dashboard.vue';
import GeoLocationButton from './components/GeoLocationButton.vue';
import Map from './components/map.vue';

// Références aux composants
const mapRef = ref(null);
const dashboardRef = ref(null);
// Coordonnées météo actuelles
const weatherCoords = ref({ lat: null, lon: null });

// Fonction déclenchée quand on reçoit les coordonnées du bouton
const handleGeoLocation = ({ lat, lon }) => {
  console.log('🌍 Position utilisateur :', lat, lon)
  weatherCoords.value = { lat, lon };

  // Ouvrir automatiquement le dashboard
  if (dashboardRef.value && dashboardRef.value.openDashboard) {
    dashboardRef.value.openDashboard();
  }
}

// Fonction déclenchée quand on clique sur la carte
const handleMapClick = (coords) => {
  console.log('🗺️ Clic sur la carte :', coords.lat, coords.lng);
  weatherCoords.value = { lat: coords.lat, lon: coords.lng };

  // Ouvrir automatiquement le dashboard
  if (dashboardRef.value && dashboardRef.value.openDashboard) {
    dashboardRef.value.openDashboard();
  }
}

// Fonction déclenchée quand on veut réinitialiser l'orientation
const handleResetBearing = () => {
  if (mapRef.value) {
    mapRef.value.resetBearing();
  }
}
</script>

<template>
  <div id="app" class="h-screen w-screen">
    <Map ref="mapRef" @click-coord="handleMapClick" />
    <SearchBar ref="dashboardRef" :weather-coords="weatherCoords" />
    <GeoLocationButton @get-location="handleGeoLocation" @reset-bearing="handleResetBearing" />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>