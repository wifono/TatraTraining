import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { api } from '../boot/axios.js'

const id = new URL(location.href).searchParams.get('id') || window.location.pathname.split('/').pop()

api.defaults.timeout = 30000
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export const useLongPollingStore = defineStore('longPolling', {
  actions: {
    start() {
      this.runCommand(this.dispatch)
    },

    async runCommand(dispatch) {
      const op = { timeout: 30000 }
      try {
        const res = await api.get(id + '?timestamp=' + dayjs().unix(), op)
        console.log(res.data[0])
        this.events = res.data[0].events.map((event) => {
          const dateRegex = /\d{1,2}\.\d{1,2}\.\d{4}/
          const dateMatch = event.start.match(dateRegex)
          const startDate = dateMatch ? dateMatch[0] : ''
          const startTime = event.start.replace(startDate, '').trim()

          return {
            ...event,
            start: startTime
          }
        })
        dispatch('execCommand', res.data)
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          console.log('runCommand timeout')
        }
      } finally {
        setTimeout(() => this.runCommand(dispatch), 30000)
      }
    },

    execCommand({ commit }, data) {
      commit('updateEvents', data)
    }
  }
})
