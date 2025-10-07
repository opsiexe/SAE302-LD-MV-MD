<script setup>
import { ref } from 'vue';
import SearchBar from './components/Dashboard.vue';
import GeoLocationButton from './components/GeoLocationButton.vue';
import Map from './components/map.vue';

// Référence au composant Map
const mapRef = ref(null);

// Fonction déclenchée quand on reçoit les coordonnées du bouton
const handleGeoLocation = ({ lat, lon }) => {
  console.log('🌍 Position utilisateur :', lat, lon)
  alert(`Latitude: ${lat}\nLongitude: ${lon}`)
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
    <Map ref="mapRef" />
    <SearchBar />
    <GeoLocationButton @get-location="handleGeoLocation" @reset-bearing="handleResetBearing" />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>