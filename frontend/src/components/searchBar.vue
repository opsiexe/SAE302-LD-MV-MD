<template>
  <div class="fixed flex flex-col justify-end items-center bottom-0 left-0 m-4 w-100 h-22 bg-main rounded-2xl">
    <!-- Wrapper relatif pour l'input et l'icône -->
    <div class="relative w-96 m-2">
      <!-- Icône dans un wrapper absolu -->
      <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
        <font-awesome-icon icon="magnifying-glass" />
      </span>

      <!-- Input -->
      <input 
        type="search" 
        class="w-full h-12 bg-secondary rounded-xl shadow-2xl pl-10 pr-3 py-2"
        placeholder="Rechercher une ville" 
      />
    </div>
  </div>
</template>
