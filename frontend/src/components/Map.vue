<template>
    <div ref="mapContainer" class="h-full w-full"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1Ijoib3BzaSIsImEiOiJjbWZnaHJsbXUwMTEwMmlxcWR0bGE3dDdmIn0.DT0bU9R5XM8zTgiT_5rhlQ";

const emit = defineEmits(['click-coord']);
const mapContainer = ref(null);
const map = ref(null);

// Fonction pour réinitialiser l'orientation de la carte
const resetBearing = () => {
    if (map.value) {
        map.value.easeTo({
            bearing: 0,
            pitch: 0,
            duration: 1000
        });
    }
};

onMounted(() => {
    nextTick(() => {
        const mapInstance = new mapboxgl.Map({
            container: mapContainer.value,
            style: "mapbox://styles/mapbox/standard",
            center: [2.3522, 48.8566], // Coordonnées par défaut (Paris)
            zoom: 8,
            attributionControl: false
        });

        mapInstance.on('load', () => {
            // Supprimer tous les noms de routes
            mapInstance.getStyle().layers.forEach((layer) => {
                if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
                    // Cible uniquement les couches contenant "road" dans leur id
                    if (layer.id.toLowerCase().includes('road')) {
                        mapInstance.setLayoutProperty(layer.id, 'text-field', '');
                    }
                }
            });

            // Fog léger
            mapInstance.setFog({
                range: [3, 10],
                "horizon-blend": 0.02,
                "star-intensity": 1
            });

            // Décalage du centre visuel vers la droite
            mapInstance.panBy([-200, 0], { duration: 0 });

            console.log('🗺️ Carte Mapbox chargée avec succès');
        });

        mapInstance.on('click', (e) => {
            const coords = e.lngLat; // { lng, lat }
            console.log('Clicked coordinates:', coords);
            emit('click-coord', coords);
        });

        // Gestion des erreurs
        mapInstance.on('error', (e) => {
            console.error('❌ Erreur Mapbox:', e);
        });

        map.value = mapInstance;
    });
});

onBeforeUnmount(() => {
    if (map.value) {
        map.value.remove();
        map.value = null;
    }
});

// Exposer la fonction resetBearing pour qu'elle soit accessible depuis le parent
defineExpose({
    resetBearing
});
</script>
