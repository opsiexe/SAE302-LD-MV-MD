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
    <div class="search-bar-container relative m-2" :class="width">
        <!-- Icône loupe -->
        <span class="search-icon absolute inset-y-0 left-0 flex items-center text-secon font-bold cursor-pointer"
            @click="handleSearch">
            <font-awesome-icon icon="magnifying-glass" />
        </span>

        <!-- Input -->
        <input type="search" :value="inputValue" @input="handleInput" @keyup="handleKeyup" @focus="handleFocus"
            @blur="handleBlur" :placeholder="props.placeholder" :disabled="props.disabled"
            class="search-input w-full bg-secondary rounded-xl shadow-inner custom-inset-shadow placeholder-text text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" />
    </div>
</template>

<style scoped>
.search-bar-container {
    width: 100%;
    max-width: 25rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-icon {
    padding-left: 0.75rem;
    font-size: 1.25rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
}

.search-icon:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.search-input {
    height: 3rem;
    padding-left: 3rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid transparent;
}

.search-input:hover {
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.search-input:focus {
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
}

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
    opacity: 0.8;
    transform: scale(1.2) rotate(90deg);
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

input[type="search"]::-webkit-search-cancel-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ombre intérieure personnalisée plus prononcée */
.custom-inset-shadow {
    box-shadow: inset 0 3px 6px 0 rgba(0, 0, 0, 0.25), inset 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

/* Responsive pour tablettes */
@media (max-width: 1024px) {
    .search-bar-container {
        max-width: 22rem;
    }
}

@media (max-width: 768px) {
    .search-bar-container {
        max-width: 20rem;
    }
}

/* Responsive pour mobiles */
@media (max-width: 640px) {
    .search-bar-container {
        max-width: calc(100vw - 3rem);
    }

    .search-icon {
        padding-left: 0.625rem;
        font-size: 1.125rem;
    }

    .search-input {
        height: 2.75rem;
        padding-left: 2.5rem;
        padding-right: 0.625rem;
        font-size: 0.9rem;
    }

    input[type="search"]::-webkit-search-cancel-button {
        height: 14px;
        width: 14px;
        background-size: 14px 14px;
    }
}

@media (max-width: 480px) {
    .search-bar-container {
        max-width: calc(100vw - 3rem);
    }
}

/* Responsive pour petits mobiles */
@media (max-width: 380px) {
    .search-bar-container {
        max-width: calc(100vw - 2.5rem);
    }

    .search-icon {
        padding-left: 0.5rem;
        font-size: 1rem;
    }

    .search-input {
        height: 2.5rem;
        padding-left: 2.25rem;
        padding-right: 0.5rem;
        font-size: 0.85rem;
    }

    input[type="search"]::-webkit-search-cancel-button {
        height: 12px;
        width: 12px;
        background-size: 12px 12px;
    }
}
</style>