<template>
    <div class="fixed flex flex-col justify-end items-center bottom-0 left-0 m-5 w-100 bg-main rounded-2xl">

        <!-- Chevron-Up centré, un peu plus bas -->
        <div class="flex justify-center w-full mt-2">
            <font-awesome-icon icon="chevron-up" class="text-black text-2xl font-bold hover:text-gray-700" />
        </div>

        <!-- Wrapper relatif pour l'input et l'icône -->
        <div class="relative w-96 m-2">
            <!-- Icône loupe -->
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-black text-xl font-bold">
                <font-awesome-icon icon="magnifying-glass" />
            </span>

            <!-- Input -->
            <input type="search" class="w-full h-12 bg-secondary rounded-xl shadow-2xl pl-12 pr-3 py-2 placeholder-text"
                placeholder="Rechercher une ville" />
        </div>

    </div>
</template>
