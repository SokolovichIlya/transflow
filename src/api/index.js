import axios from 'axios'

export const BASE_URL = axios.create({
    baseURL: 'https://220.transflow.ru/api',
})