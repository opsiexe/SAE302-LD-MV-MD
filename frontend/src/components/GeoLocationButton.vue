<template>
  <div
    class="geo-buttons fixed z-50 flex flex-col rounded-full bg-main shadow-xl transition-all duration-300 glass-effect">
    <button @click="getLocation" title="Me localiser"
      class="flex-1 flex items-center justify-center button-hover button-top">
      <font-awesome-icon icon="location-arrow" class="text-secon button-icon hover:text-text"
        style="transform: translateX(-1px);" />
    </button>
    <div class="button-separator"></div>
    <button @click="resetBearing" title="Réinitialiser l'orientation"
      class="flex-1 flex items-center justify-center button-hover button-bottom">
      <font-awesome-icon icon="compass" class="text-secon button-icon hover:text-text" />
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['get-location', 'reset-bearing'])

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
    alert("La géolocalisation n'est pas supportée sur ce navigateur.")
  }
}

const resetBearing = () => {
  emit('reset-bearing')
}
</script>

<style scoped>
.geo-buttons {
  top: 1rem;
  right: 1rem;
  width: 3rem;
  height: 5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.geo-buttons:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.03);
}

.button-separator {
  width: 60%;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 auto;
}

.button-top {
  border-radius: 9999px 9999px 0 0;
}

.button-bottom {
  border-radius: 0 0 9999px 9999px;
}

.button-icon {
  font-size: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.button-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.button-hover::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.button-hover:hover::before {
  width: 100%;
  height: 100%;
}

.button-hover:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.button-hover:hover .button-icon {
  transform: scale(1.15) rotate(5deg) !important;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

.button-hover:active {
  transform: scale(0.95);
}

.button-hover:active .button-icon {
  transform: scale(1) !important;
}

/* Tablettes */
@media (max-width: 768px) {
  .geo-buttons {
    top: 0.875rem;
    right: 0.875rem;
    width: 2.75rem;
    height: 4.5rem;
  }

  .button-icon {
    font-size: 1.125rem;
  }
}

/* Mobiles */
@media (max-width: 480px) {
  .geo-buttons {
    top: 0.75rem;
    right: 0.75rem;
    width: 2.5rem;
    height: 4rem;
  }

  .button-icon {
    font-size: 1rem;
  }
}

/* Petits mobiles */
@media (max-width: 360px) {
  .geo-buttons {
    top: 0.625rem;
    right: 0.625rem;
    width: 2.25rem;
    height: 3.75rem;
  }

  .button-icon {
    font-size: 0.95rem;
  }
}
</style>
