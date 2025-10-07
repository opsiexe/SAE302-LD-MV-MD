<script setup>
// Props pour recevoir les données météo (pas encore utilisé)
const props = defineProps({
    temperature: {
        type: Number,
        default: 22
    },
    sunrise: {
        type: String,
        default: '6:00'
    },
    sunset: {
        type: String,
        default: '21:00'
    },
    condition: {
        type: String,
        default: 'Ensoleillé'
    },
    humidity: {
        type: Number,
        default: 65
    },
    windSpeed: {
        type: Number,
        default: 12
    }
})
</script>

<template>
    <div class="weather-card bg-card rounded-2xl p-5 ml-1 shadow-xl/20">
        <!-- En-tête avec condition météo -->
        <div class="weather-header mb-4">
            <h3 class="text-xl font-semibold text-white mb-2">Météo actuelle</h3>
            <p class="text-secon">{{ condition }}</p>
        </div>

        <!-- Section principale avec température et heures de soleil -->
        <div class="weather-main-section flex gap-4 mb-4">
            <!-- Température -->
            <div class="weather-card-temp bg-card-secon rounded-2xl p-4 inset-shadow-neutral-50">
                <div class="temperature-display text-center flex flex-col items-center">
                    <font-awesome-icon icon="temperature-half" class="text-secon text-2xl mb-2" />
                    <span class="text-2xl font-bold text-white">{{ temperature }}°C</span>
                </div>
            </div>

            <!-- Lever du soleil -->
            <div class="weather-card-sunrise bg-card-secon rounded-2xl p-4 inset-shadow-neutral-50">
                <div class="sunrise-display text-center flex flex-col items-center">
                    <font-awesome-icon icon="circle-up" class="text-secon text-2xl mb-2" />
                    <span class="text-lg font-bold text-white">{{ sunrise }}H</span>
                </div>
            </div>

            <!-- Coucher du soleil -->
            <div class="weather-card-sunset bg-card-secon rounded-2xl p-4 inset-shadow-neutral-50">
                <div class="sunset-display text-center flex flex-col items-center">
                    <font-awesome-icon icon="circle-down" class="text-secon text-2xl mb-2" />
                    <span class="text-lg font-bold text-white">{{ sunset }}H</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.weather-card {
    min-width: 50rem;
    min-height: fit-content;
    max-width: 320px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.weather-main-section {
    justify-content: space-between;
}

.weather-card-temp,
.weather-card-sunrise,
.weather-card-sunset {
    flex: 1;
    min-height: 5rem;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Animation d'apparition */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.weather-card {
    animation: fadeInUp 0.6s ease-out;
}

/* Responsive */
@media (max-width: 640px) {
    .weather-card {
        min-width: 260px;
        max-width: 100%;
        padding: 1rem;
    }

    .grid-cols-2 {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
}
</style>