<script setup>
import SearchBar from './searchBar.vue';
</script>

<template>
    <div class="fixed flex flex-col justify-end items-center bottom-0 left-0 m-5 w-100 bg-main rounded-2xl">

        <!-- Chevron-Up centré, un peu plus bas -->
        <div class="flex justify-center w-full mt-2">
            <font-awesome-icon icon="chevron-up" class="text-black text-2xl font-bold hover:text-text" />
        </div>
        <SearchBar placeholder="Rechercher une ville" />
    </div>
</template>
