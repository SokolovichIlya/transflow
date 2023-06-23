<template>
	<div class="home">
		<template v-if="!isLoadingRoutes">
			<HomeSidebarComponent
				@changeSelectedRow="changeSelectedRow"
				@changeViewTypeData="changeViewTypeData"
				:routes="routes" 
				:viewTypeData="viewTypeData"
				:activeRouteID="activeRouteID"
				:activeStopID="activeStopID"
			/>

			<MapComponent
				@changeSelectedRow="changeSelectedRow"
				:routes="routes" 
				:viewTypeData="viewTypeData" 
				:activeRouteID="activeRouteID"
				:activeStopID="activeStopID"
			/>
		</template>
	</div>
</template>

<script>
import { getRoutes } from '@/api/urls'

import MapComponent from './components/MapComponent.vue'
import HomeSidebarComponent from './components/HomeSidebarComponent.vue'

export default {
	name: 'HomeView',

	components: {
		MapComponent,
		HomeSidebarComponent,
	},

	data: () => ({
		isLoadingRoutes: true,

		routes: [],

		viewTypeData: 'routes',

		activeRouteID: null,
		activeStopID: null,
	}),

	created() {
		this.getRoutesData()
	},

	methods: {
		async getRoutesData() {
			try {
				this.isLoadingRoutes = true

				const params = {
					key: '012345678abc',
				}

				const { data } = await getRoutes(params)

				this.routes = data

				this.isLoadingRoutes = false
			} catch (error) {
				console.error(error)
			}
		},

		changeViewTypeData(type) {
			this.viewTypeData = type
		},

		changeSelectedRow(id) {
			if (this.viewTypeData === 'routes') {
				this.activeRouteID = id
				this.activeStopID = null
			} else {
				this.activeStopID = id
				this.activeRouteID = null
			}
		},
	},
}
</script>
