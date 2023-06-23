<template>
    <aside class="home-sidebar">
        <div class="home-sidebar__wrapper">
            <div class="home-sidebar__buttons">
                <button
                    @click.prevent="changeViewTypeData('routes')"
                    :class="{'home-sidebar__button--active': viewTypeData === 'routes'}"
                    class="home-sidebar__button"
                >Маршруты</button>
                <button
                    @click.prevent="changeViewTypeData('stops')"
                    :class="{'home-sidebar__button--active': viewTypeData === 'stops'}"
                    class="home-sidebar__button"
                >Остановки</button>
            </div>
            <ag-grid-vue
                @grid-ready="onGridReady" 
                @selection-changed="onSelectionChanged"
                @row-double-clicked="goToRoute"
                :columnDefs="getColumnDefs"
                :rowData="getRowsData"
                rowSelection='single'
                class="home-sidebar__grid ag-theme-alpine"
                style="width: 100%; height: 100%;"
            />
        </div>
    </aside>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { AgGridVue } from 'ag-grid-vue'

export default {
    name: 'HomeSidebarComponent',

    components: {
        AgGridVue,
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
        columnDefs: {
            routes: [
                {
                    field: 'Name',
                    headerName: 'Имя',
                    width: 100,
                    flex: 1,
                },
                {
                    field: 'Stops.length',
                    headerName: 'Остановок',
                    width: 100,
                    flex: 1,
                },
            ],

            stops: [
                {
                    field: 'Name',
                    headerName: 'Имя',
                    width: 100,
                    flex: 1,
                },
                {
                    field: 'CountRoutes',
                    headerName: 'Количество маршрутов',
                    width: 100,
                    flex: 1,
                },
                {
                    field: 'Forward',
                    headerName: 'Направление',
                    width: 100,
                    flex: 1,
                },
            ],
        },

        gridApi: null,
        gridColumnApi: null,
    }),

    computed: {
        getRowsData() {
            if (this.viewTypeData === 'routes') {
                return this.routes
            } else {
                return this.routes.reduce(( result, route ) => {
                    return [...result, ...route.Stops.map(stop => ({
                        ID: stop.ID,
                        Name: stop.Name,
                        CountRoutes: this.routes.filter(item => item.Stops.some(_stop => _stop.ID === stop.ID)).length,
                        Forward: stop.Forward ? 'Прямое' : 'Обратное',
                    }))]
                }, [])
            }
        },

        getColumnDefs() {
            return this.columnDefs[this.viewTypeData]
        },  
    },

    methods: {
        onGridReady(params) {
            this.gridApi = params.api
        },

        changeViewTypeData(type) {
            this.$emit('changeViewTypeData', type)
        },

        onSelectionChanged() {
            const selectedRows = this.gridApi.getSelectedRows()

            this.$emit('changeSelectedRow', selectedRows[0].ID)
        },

        async goToRoute({ data }) {
            if (this.viewTypeData === 'routes') {
                await this.$store.dispatch('setDetailRoute', data)
                await this.$router.push({ name: 'route.detail', params: { id: data.ID } })
            } 
        },
    }
}
</script>

<style lang="scss">
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";
</style>