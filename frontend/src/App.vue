<script setup>
import searchBar from './components/searchBar.vue';
import HelloWorld from './components/HelloWorld.vue'
import GeoLocationButton from './components/GeoLocationButton.vue'

// Fonction déclenchée quand on reçoit les coordonnées du bouton
const handleGeoLocation = ({ lat, lon }) => {
  console.log('🌍 Position utilisateur :', lat, lon)
  alert(`Latitude: ${lat}\nLongitude: ${lon}`)
}
</script>

<template>
  <searchBar />
  <div class="container">
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>

    <HelloWorld msg="Vite + Vue" />

    <!-- Bouton de géolocalisation -->
    <GeoLocationButton @get-location="handleGeoLocation" />
  </div>
</template>

<style scoped>
.container {
  position: relative;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* Position du bouton en bas à droite */
.geo-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
