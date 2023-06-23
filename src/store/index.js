import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
		detailRoute: null,
    },

    mutations: {
		SET_DETAIL_ROUTE (state, route) {
			state.detailRoute = route
		},
    },

    actions: {
		setDetailRoute({ commit }, route) {
			commit('SET_DETAIL_ROUTE', route)
		},
    },
})
