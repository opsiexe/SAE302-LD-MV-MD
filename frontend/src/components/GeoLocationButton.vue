<template>
  <div
    class="fixed top-4 right-4 z-50 flex flex-col rounded-full bg-main shadow-xl/50 transition-colors duration-200 w-12 h-20">
    <button @click="getLocation" title="Me localiser" class="flex-1 flex items-center justify-center">
      <font-awesome-icon icon="location-arrow" class="text-secon text-xl inset-shadow-xl hover:text-text"
        style="transform: translateX(-1px);" />
    </button>
    <button class="flex-1 flex items-center justify-center">
      <font-awesome-icon icon="compass" class="text-secon text-xl inset-shadow-xl hover:text-text" />
    </button>
  </div>
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
        console.error('Erreur de géolocalisation : ' + err.message)
      }
    )
  } else {
    alert('La géolocalisation n’est pas supportée sur ce navigateur.')
  }
}
</script>
