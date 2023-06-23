import { BASE_URL } from './index'

export async function getRoutes(params) {
    return await BASE_URL.get('/public/v1/routes_data', { params })
}