import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { api } from '../boot/axios.js'
import axios from 'axios'

const id = new URL(location.href).searchParams.get('id') || window.location.pathname.split('/').pop() || 'demo'

api.defaults.timeout = 30000

// Interceptory na api instanciu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized – token zmazaný, získavam nový a reloadujem...')

      localStorage.removeItem('accessToken')
      delete api.defaults.headers.common.Authorization

      const store = useLongPollingStore()
      await store.fetchAccessToken()

      location.reload()
    }

    return Promise.reject(error)
  }
)

// NOVÝ connectApi - čistá axios inštancia pre connect
const connectApi = axios.create({
  baseURL: '/', // alebo rovnaký base ak potrebuješ
  timeout: 30000,
  headers: { common: { 'X-Requested-With': 'sk.nov.weblock' } }
})

export const useLongPollingStore = defineStore('longPolling', {
  state: () => ({
    events: []
  }),

  actions: {
    async start() {
      await this.ensureAccessToken()
      this.runCommand()
    },

    async ensureAccessToken() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`
        return
      }
      await this.fetchAccessToken()
    },

    async fetchAccessToken() {
      try {
        const res = await connectApi.get(`/connect?id=${id}`)
        const token = res?.data?.accessToken
        if (!token) throw new Error('Token is undefined')

        localStorage.setItem('accessToken', token)
        api.defaults.headers.common.Authorization = `Bearer ${token}`
        console.log('Token získaný, pokračujem...')
      } catch (err) {
        console.warn('Získavanie tokenu zlyhalo. Skúšam znova o 10s...')
        await new Promise((resolve) => setTimeout(resolve, 10000))
        await this.fetchAccessToken()
      }
    },

    async runCommand() {
      const op = { timeout: 30000 }
      try {
        const res = await api.get(`${id}?timestamp=${dayjs().unix()}`, op)
        this.events = res.data.events.map((event) => ({ ...event }))
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          console.log('runCommand timeout')
        }
      } finally {
        // Delay medzi requestami (napríklad 2 sekundy)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        this.runCommand()
      }
    }
  }
})
