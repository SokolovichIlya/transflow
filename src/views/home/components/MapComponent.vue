<template>
    <div class="map-wrapper">
        <l-map
            @ready="setBoundsMap"
            :zoom="zoom"
            :center="center"
            ref="map"
        >
            <l-tile-layer
                :url="tileLayerUrl"
                :attribution="attribution"
            />

            <template v-if="!activeStopID">
                <l-layer-group v-for="route in viewRoutes" :key="`route-${ route.ID }`">
                    <MapMarker 
                        v-for="(stop, index) in route.Stops" 
                        :key="`route-${ route.ID }-stop-${ stop.ID }-${ index }`"
                        :stop="stop"
                    />
                    <l-polyline 
                        v-if="viewTypeData === 'routes'"
                        @click="focusOnRoute(route.ID)" 
                        :lat-lngs="getPolylineRouteLatLng(route)"
                        :ref="`polyline-${ route.ID }`"
                    >
                        <l-tooltip>{{ route.Name }}</l-tooltip>
                    </l-polyline>
                </l-layer-group>
            </template>

            <MapMarker 
                v-if="activeStopID && viewStop"
                :stop="viewStop"
            />
        </l-map>
    </div>
</template>

<script>
import { latLng } from 'leaflet'
import { 
    LMap, 
    LTileLayer, 
    LLayerGroup, 
    LPolyline,
    LTooltip,
} from 'vue2-leaflet'

import MapMarker from './MapMarker.vue'

export default {
    name: 'MapComponent',

    components: {
        LMap,
        LTileLayer,
        LLayerGroup,
        LPolyline,
        LTooltip,
        MapMarker,
    },

    props: {
        routes: {
            type: Array,
            default: () => [],
        },

        viewTypeData: {
            type: String,
            default: 'routes',
        },

        activeRouteID: {
            type: Number,
            default: null,
        },

        activeStopID: {
            type: Number,
            default: null,
        },
    },

    data: () => ({
        tileLayerUrl: process.env.VUE_APP_LEAFLET_TILE_LAYER_URL,
        attribution: process.env.VUE_APP_LEAFLET_TILE_ATTRIBUTION,

        center: latLng(68.88832093950211, 33.04710030555726),
        zoom: 13,

        viewRoutes: [],
        viewStop: null,
    }),

    watch: {
        activeRouteID(id) {
            if (id) {
                this.viewRoutes = this.routes.filter(route => route.ID === this.activeRouteID)
                
                this.$nextTick(() => {
                    const polylineBounds = this.$refs[`polyline-${id}`][0].mapObject.getBounds()

                    if (polylineBounds) {
                        this.$refs.map.mapObject.fitBounds(polylineBounds)
                    }
                })
            } else {
                this.viewRoutes = this.routes
            }
        },

        activeStopID(id) {
            if (id) {
                this.routes.forEach(route => {
                    if (route.Stops.some(stop => stop.ID === id)) {
                        this.viewStop = route.Stops.find(stop => stop.ID === id)
                    }
                })
                
                this.$nextTick(() => {
                    this.setCoordsAndZoomMap(latLng(this.viewStop.Lat, this.viewStop.Lon), 16)
                })
            } else {
                this.viewStop = null
            }
        },
    },

    created() {
        this.viewRoutes = this.routes
    },

    methods: {
        setBoundsMap() {
            this.$refs.map.mapObject.fitBounds(this.$refs[`polyline-${ this.viewRoutes[0].ID }`][0].mapObject.getBounds())
        },

        getPolylineRouteLatLng(route) {
            const coordsArray = route.Points ? 
                                route.Points :
                                route.Stops 

            return coordsArray ? coordsArray.map(item => [ item.Lat, item.Lon ]) : []
        },

        setCoordsAndZoomMap(coords, zoom) {
            this.$refs.map.mapObject.setView(coords)
            this.$refs.map.mapObject.setZoom(zoom)
        },

        focusOnRoute(id) {
            this.$emit('changeSelectedRow', this.activeRouteID === id ? null : id)
        },
    },
}
</script>