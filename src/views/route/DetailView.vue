<template>
	<div class="route">
        <div class="route__block route-info">
            <p class="route-info__text"><b>Имя маршрута</b> - {{ detailRoute.Name }}</p>
            <p class="route-info__text"><b>Описание</b> - {{ detailRoute.Description }}</p>
            <p class="route-info__text"><b>Кол-во остановок:</b></p>
            <p class="route-info__text">В прямом направлении - {{ getForwardStops.length }}</p>
            <p class="route-info__text">В обратном направлении - {{ getUnforwardStops.length }}</p>
			<router-link :to="{ name: 'home' }" class="route-info__link">Назад</router-link>
        </div>
        <div class="route__block route-stops">
			<div class="route-stops__block">
				<p class="route-stops__block__title">Прямое направление</p>
				<ul class="route-stops__list">
					<li v-for="(stop, index) in getForwardStops" :key="stop.ID" class="stop stop--blue">
						<span class="stop__number">{{ index + 1 }}</span>
						<span class="stop__name">{{ stop.Name }}</span>
					</li>
				</ul>
			</div>
			<div class="route-stops__block">
				<p class="route-stops__block__title">Обратное направление</p>
				<ul class="route-stops__list">
					<li v-for="(stop, index) in getUnforwardStops" :key="stop.ID" class="stop stop--red">
						<span class="stop__number">{{ index + 1 }}</span>
						<span class="stop__name">{{ stop.Name }}</span>
					</li>
				</ul>
			</div>
        </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'DetailView',

	computed: {
		...mapState({
			detailRoute: 'detailRoute',
		}),

		getForwardStops() {
			return this.detailRoute.Stops.filter(stop => stop.Forward)
		},

		getUnforwardStops() {
			return this.detailRoute.Stops.filter(stop => !stop.Forward)
		},
	},

	async created() {
		if (!this.detailRoute) {
			await this.$router.push({ name: 'home' })
		}
	},

	beforeDestroy() {
		this.$store.dispatch('setDetailRoute', null)
	}
}
</script>
