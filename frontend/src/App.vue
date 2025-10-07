<script setup>
import SearchBar from './components/Dashboard.vue';
import GeoLocationButton from './components/GeoLocationButton.vue';
import Map from './components/map.vue';

// Fonction déclenchée quand on reçoit les coordonnées du bouton
const handleGeoLocation = ({ lat, lon }) => {
  console.log('🌍 Position utilisateur :', lat, lon)
  alert(`Latitude: ${lat}\nLongitude: ${lon}`)
}
</script>

<template>
  <div id="app" class="h-screen w-screen">
    <Map />
    <SearchBar />
    <GeoLocationButton @get-location="handleGeoLocation" />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>