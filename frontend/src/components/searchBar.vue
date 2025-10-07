<script setup>
import { ref } from 'vue'

// Props pour personnaliser le composant
const props = defineProps({
    placeholder: {
        type: String,
        default: 'Rechercher une ville'
    },
    modelValue: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: 'w-96'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

// Événements émis par le composant
const emit = defineEmits(['update:modelValue', 'search', 'input', 'focus', 'blur'])

// État local
const inputValue = ref(props.modelValue)

// Méthodes
const handleInput = (event) => {
    inputValue.value = event.target.value
    emit('update:modelValue', event.target.value)
    emit('input', event.target.value)
}

const handleSearch = () => {
    emit('search', inputValue.value)
}

const handleKeyup = (event) => {
    if (event.key === 'Enter') {
        handleSearch()
    }
}

const handleFocus = (event) => {
    emit('focus', event)
}

const handleBlur = (event) => {
    emit('blur', event)
}
</script>

<template>
    <div class="relative m-2" :class="width">
        <!-- Icône loupe -->
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-secon text-xl font-bold cursor-pointer"
            @click="handleSearch">
            <font-awesome-icon icon="magnifying-glass" />
        </span>

        <!-- Input -->
        <input type="search" :value="inputValue" @input="handleInput" @keyup="handleKeyup" @focus="handleFocus"
            @blur="handleBlur" :placeholder="props.placeholder" :disabled="props.disabled"
            class="w-full h-12 bg-secondary rounded-xl shadow-inner custom-inset-shadow pl-12 pr-3 py-2 placeholder-text text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" />
    </div>
</template>

<style scoped>
/* Personnalisation du bouton de suppression (X) de l'input search */
input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    height: 16px;
    width: 16px;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cline x1='18' y1='6' x2='6' y2='18'%3e%3c/line%3e%3cline x1='6' y1='6' x2='18' y2='18'%3e%3c/line%3e%3c/svg%3e");
    background-size: 16px 16px;
    cursor: pointer;
}

input[type="search"]::-webkit-search-cancel-button:hover {
    opacity: 0.6;
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transition: all 0.2s ease-in-out;
}

input[type="search"]::-webkit-search-cancel-button {
    transition: all 0.2s ease-in-out;
}

/* Ombre intérieure personnalisée plus prononcée */
.custom-inset-shadow {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.20), inset 0 1px 2px 0 rgba(0, 0, 0, 0.15);
}
</style>