<!-- filepath: c:\Users\Mathis Vila\Cours\SAE302-LD-MV-MD\frontend\src\components\DailyWeatherCard.vue -->
<template>
  <div class="daily-weather-card bg-card rounded-2xl flex flex-col items-center justify-center w-full h-full">
    <h3 class="text-2xl font-semibold text-white mb-6">Jour {{ dayIndex + 1 }}</h3>
    <div class="weather-icon mb-6 flex items-center justify-center w-full">
      <font-awesome-icon icon="cloud-sun" class="super-icon" />
    </div>
    <div class="temperature text-4xl font-bold text-white mb-3">
      18°C
    </div>
    <div class="description text-secon text-2xl text-center">
      Partiellement nuageux
    </div>
  </div>
</template>

<script setup>
defineProps({
  dayIndex: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.daily-weather-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s;
  min-height: 400px;
  min-width: 0;
  height: 100%;
  width: 100%;
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.08);
  padding: 0;
}
.daily-weather-card:hover {
  background: rgba(255,255,255,0.08);
  transform: translateY(-2px) scale(1.03);
}
.weather-icon {
  width: 100%;
  height: 100%;
  min-height: 320px;
  min-width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.super-icon {
  font-size: 14vw;
  max-width: 90%;
  max-height: 60vh;
  color: var(--color-secon, #fbbf24);
  filter: drop-shadow(0 0 32px rgba(251,191,36,0.25));
}
@media (max-width: 900px) {
  .super-icon {
    font-size: 28vw;
    min-width: 180px;
    min-height: 180px;
  }
  .weather-icon {
    min-height: 180px;
    min-width: 180px;
  }
}
</style>