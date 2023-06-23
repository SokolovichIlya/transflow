<template>
    <l-marker 
        :lat-lng="[stop.Lat, stop.Lon]"
    >
        <l-icon
            :icon-url="getMarker"
            :icon-size="dynamicSize"
            :icon-anchor="dynamicAnchor"
        ></l-icon>
        <l-tooltip>{{ stop.Name }}</l-tooltip>
    </l-marker>
</template>

<script>
import { 
    LMarker, 
    LIcon,
    LTooltip,
} from 'vue2-leaflet'

export default {
    name: 'MapMarker',

    components: {
        LMarker, 
        LIcon,
        LTooltip,
    },

    props: {
        stop: {
            type: Object,
            required: true,
        },
    },

    data: () => ({
        iconSize: 32,
    }),

    computed: {
        getMarker() {
            return this.stop.Forward ? require('@/assets/markerBlue.svg') : require('@/assets/markerRed.svg')
        },

        dynamicSize () {
            return [this.iconSize, this.iconSize]
        },

        dynamicAnchor () {
            return [this.iconSize / 2, this.iconSize * 0.5]
        }
    },
}
</script>