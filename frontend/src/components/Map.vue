<template>
    <div ref="mapContainer" class="h-full w-full"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1Ijoib3BzaSIsImEiOiJjbWZnaHJsbXUwMTEwMmlxcWR0bGE3dDdmIn0.DT0bU9R5XM8zTgiT_5rhlQ";

export default {
    name: 'Map',
    emits: ['click-coord'],
    data() {
        return {
            map: null
        }
    },
    methods: {
        resetBearing() {
            if (this.map) {
                this.map.easeTo({
                    bearing: 0,
                    pitch: 0,
                    duration: 1000
                });
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            const map = new mapboxgl.Map({
                container: this.$refs.mapContainer,
                style: "mapbox://styles/mapbox/standard",
                center: [2.3522, 48.8566], // Coordonnées par défaut (Paris)
                zoom: 8,
                attributionControl: false
            });

            map.on('load', () => {
                // Supprimer tous les noms de routes
                map.getStyle().layers.forEach((layer) => {
                    if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
                        // Cible uniquement les couches contenant "road" dans leur id
                        if (layer.id.toLowerCase().includes('road')) {
                            map.setLayoutProperty(layer.id, 'text-field', '');
                        }
                    }
                });

                // Fog léger
                map.setFog({
                    range: [3, 10],
                    "horizon-blend": 0.02,
                    "star-intensity": 1
                });

                // Décalage du centre visuel vers la droite
                map.panBy([-200, 0], { duration: 0 });

                console.log('🗺️ Carte Mapbox chargée avec succès');
            });

            map.on('click', (e) => {
                const coords = e.lngLat; // { lng, lat }
                console.log('Clicked coordinates:', coords);
                this.$emit('click-coord', coords);
            });

            // Gestion des erreurs
            map.on('error', (e) => {
                console.error('❌ Erreur Mapbox:', e);
            });

            this.map = map;
        });
    },
    beforeUnmount() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }
};
</script>
