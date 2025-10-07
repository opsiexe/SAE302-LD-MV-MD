<script setup>
import { ref } from 'vue'
import SearchBar from './searchBar.vue'

const isOpen = ref(false)
const searchValue = ref('')

const toggleDashboard = () => {
  isOpen.value = !isOpen.value
}

const handleSearchClick = () => {
  if (!isOpen.value) {
    isOpen.value = true
  }
}
</script>

<template>
  <!-- Conteneur principal avec carte en arrière-plan -->
  <div class="relative w-screen h-screen overflow-hidden">
    
    <!-- Carte (arrière-plan) -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-green-800">
      <div class="w-full h-full flex items-center justify-center text-white/20 text-4xl">
        Votre carte interactive ici
      </div>
    </div>

    <!-- Barre de recherche qui s'agrandit en dashboard -->
    <div 
      :class="[
        'fixed z-50 flex flex-col rounded-2xl shadow-xl/50 transition-all duration-500 bg-main',
        isOpen 
          ? 'top-1/2 left-1/2 w-[90vw] max-w-6xl h-[70vh] backdrop-blur-xl'
          : 'bottom-8 left-8 w-auto'
      ]"
      :style="isOpen ? 'transform: translate(-50%, -50%);' : ''"
    >
      <!-- En-tête avec flèche et barre de recherche -->
      <div 
        :class="[
          'flex items-center transition-all duration-500',
          isOpen ? 'justify-between p-6 pb-4 border-b border-gray-700' : 'flex-col'
        ]"
      >
        <!-- Flèche -->
        <div :class="isOpen ? 'order-1' : 'flex justify-center w-full mt-2'">
          <font-awesome-icon
            :icon="isOpen ? 'chevron-down' : 'chevron-up'"
            :class="[
              'text-2xl font-bold cursor-pointer transition-all duration-300',
              isOpen ? 'text-white/70 hover:text-white' : 'text-black hover:text-text'
            ]"
            @click="toggleDashboard"
          />
        </div>

        <!-- Barre de recherche -->
        <div 
          :class="[
            'transition-all duration-500',
            isOpen ? 'flex-1 order-0' : ''
          ]"
          @click="handleSearchClick"
        >
          <SearchBar 
            v-model="searchValue"
            placeholder="Rechercher une ville"
            :class="isOpen ? 'pointer-events-auto' : ''"
          />
        </div>

        <!-- Titre (visible uniquement quand ouvert) -->
        <transition name="fade-title">
          <h2 v-if="isOpen" class="text-2xl font-bold text-white order-2 mx-4">
            {{ searchValue || 'Météo Dashboard' }}
          </h2>
        </transition>

        <!-- Bouton fermer (visible uniquement quand ouvert) -->
        <transition name="fade-title">
          <button 
            v-if="isOpen"
            @click="toggleDashboard"
            class="text-white/70 hover:text-white transition-colors p-2 order-3"
          >
            <font-awesome-icon icon="times" class="text-2xl" />
          </button>
        </transition>
      </div>

      <!-- Contenu du dashboard (visible uniquement quand ouvert) -->
      <transition name="fade-content">
        <div v-if="isOpen" class="p-6 pt-4 h-[calc(100%-100px)] overflow-hidden">
          <!-- Grille du dashboard -->
          <div class="grid grid-cols-3 gap-4 h-full">
            <!-- Carte / Données météo (2 colonnes) -->
            <div class="col-span-2 rounded-xl p-4 overflow-hidden" style="background-color: var(--color-card);">
              <h3 class="text-lg font-semibold mb-3 text-white">Carte / Données météo</h3>
              <div class="w-full h-[calc(100%-40px)] bg-slate-400 rounded-lg flex items-center justify-center">
                <p class="text-slate-700">Carte météo détaillée</p>
              </div>
            </div>

            <!-- Widget météo (1 colonne) -->
            <div class="rounded-xl p-4 bg-card">
              <h3 class="text-lg font-semibold mb-3 text-white">Widget météo</h3>
              <div class="space-y-4">
                <div class="text-center">
                  <div class="text-5xl font-bold text-white">22°C</div>
                  <p class="text-slate-200 mt-2">Partiellement nuageux</p>
                </div>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="bg-card rounded p-2">
                    <p class="text-slate-700">Humidité</p>
                    <p class="font-semibold text-white">65%</p>
                  </div>
                  <div class="bg-card rounded p-2">
                    <p class="text-slate-700">Vent</p>
                    <p class="font-semibold text-white">12 km/h</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Prévision 1 -->
            <div class="rounded-xl p-4" style="background-color: var(--color-card);">
              <h3 class="text-lg font-semibold mb-3 text-white">Aujourd'hui</h3>
              <div class="flex flex-col items-center justify-center h-[calc(100%-40px)]">
                <div class="text-3xl font-bold mb-2 text-white">24°C</div>
                <p class="text-slate-200">Max: 26°C</p>
                <p class="text-slate-200">Min: 18°C</p>
              </div>
            </div>

            <!-- Prévision 2 -->
            <div class="rounded-xl p-4" style="background-color: var(--color-card);">
              <h3 class="text-lg font-semibold mb-3 text-white">Demain</h3>
              <div class="flex flex-col items-center justify-center h-[calc(100%-40px)]">
                <div class="text-3xl font-bold mb-2 text-white">23°C</div>
                <p class="text-slate-200">Max: 25°C</p>
                <p class="text-slate-200">Min: 17°C</p>
              </div>
            </div>

            <!-- Prévision 3 -->
            <div class="rounded-xl p-4" style="background-color: var(--color-card);">
              <h3 class="text-lg font-semibold mb-3 text-white">Après-demain</h3>
              <div class="flex flex-col items-center justify-center h-[calc(100%-40px)]">
                <div class="text-3xl font-bold mb-2 text-white">25°C</div>
                <p class="text-slate-200">Max: 27°C</p>
                <p class="text-slate-200">Min: 19°C</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Overlay sombre quand le dashboard est ouvert -->
    <transition name="fade-overlay">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="toggleDashboard"
      ></div>
    </transition>
  </div>
</template>

<style scoped>
/* Animation du contenu du dashboard */
.fade-content-enter-active {
  transition: opacity 0.4s ease 0.3s;
}

.fade-content-leave-active {
  transition: opacity 0.2s ease;
}

.fade-content-enter-from,
.fade-content-leave-to {
  opacity: 0;
}

/* Animation du titre et bouton fermer */
.fade-title-enter-active {
  transition: opacity 0.3s ease 0.4s;
}

.fade-title-leave-active {
  transition: opacity 0.2s ease;
}

.fade-title-enter-from,
.fade-title-leave-to {
  opacity: 0;
}

/* Animation de l'overlay */
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.4s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}
</style>