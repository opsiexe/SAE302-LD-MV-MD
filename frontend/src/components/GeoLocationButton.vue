<template>
  <button class="geo-btn" @click="getLocation" title="Me localiser">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  </button>
</template>

<script setup>
const emit = defineEmits(['get-location'])

const getLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        emit('get-location', { lat: latitude, lon: longitude })
      },
      (err) => {
        alert('Erreur de géolocalisation : ' + err.message)
      }
    )
  } else {
    alert('La géolocalisation n’est pas supportée sur ce navigateur.')
  }
}
</script>

<style scoped>
.geo-btn {
  background-color: #d3d3d3; /* gris clair */
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;
}
.geo-btn:hover {
  background-color: #bfbfbf;
}
</style>
