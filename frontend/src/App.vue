<script setup>
import searchBar from './components/searchBar.vue';
import GeoLocationButton from './components/GeoLocationButton.vue'
import WeatherDashboard from './components/WeatherDashboard.vue';

// Fonction déclenchée quand on reçoit les coordonnées du bouton
const handleGeoLocation = ({ lat, lon }) => {
  console.log('🌍 Position utilisateur :', lat, lon)
  alert(`Latitude: ${lat}\nLongitude: ${lon}`)
}
</script>

<template>
  <searchBar />
  <GeoLocationButton @get-location="handleGeoLocation" />
  <WeatherDashboard />
</template>