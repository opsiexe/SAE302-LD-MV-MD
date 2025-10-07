<template>
  <button @click="getLocation" title="Me localiser" class="fixed top-4 right-4 z-50 flex items-center justify-center 
           w-12 h-12 rounded-full bg-main hover:bg-main-200 shadow-xl/50 transition-colors duration-200">
    <font-awesome-icon icon="location-arrow" class="text-black text-2xl inset-shadow-xl"
      style="transform: translateX(-1px);" />
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
