<template>
  <button
    @click="getLocation"
    title="Me localiser"
    class="fixed top-4 right-4 z-50 flex items-center justify-center 
           w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 
           shadow-md transition-colors duration-200"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6"
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
