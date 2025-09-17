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
  state: () => ({
    events: [],
    isRunning: false,
    lastRequestId: 0
  }),

  actions: {
    start() {
      if (!this.isRunning) {
        this.isRunning = true
        this.runCommand()
      }
    },

    runCommand() {
      const requestId = ++this.lastRequestId
      const op = {
        timeout: 30000,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        }
      }

      api
        .get(`${id}?timestamp=${dayjs().unix()}`, op)
        .then((res) => {
          if (requestId !== this.lastRequestId) {
            console.warn('Ignorujem starú odpoveď')
            return
          }

          const newEvents = res.data[0].events
            .map((event) => {
              const dateRegex = /\d{1,2}\.\d{1,2}\.\d{4}/
              const dateMatch = event.start.match(dateRegex)
              const startDate = dateMatch ? dateMatch[0] : ''
              const startTime = event.start.replace(startDate, '').trim()

              return {
                ...event,
                start: startTime
              }
            })
            .sort((a, b) => {
              const aKey = String(a.location || '').toLowerCase()
              const bKey = String(b.location || '').toLowerCase()
              return aKey.localeCompare(bKey, undefined, { sensitivity: 'base' })
            })

          const uniqueEventsMap = new Map()
          newEvents.forEach((e) => {
            if (!uniqueEventsMap.has(e.id)) {
              uniqueEventsMap.set(e.id, e)
            }
          })

          this.events = Array.from(uniqueEventsMap.values())
        })
        .catch((error) => {
          if (error.code === 'ECONNABORTED') {
            console.log('runCommand timeout')
          } else {
            console.error('runCommand error:', error)
          }
        })
        .finally(() => {
          setTimeout(() => this.runCommand(), 30000)
        })

      this.events = [
        {
          id: 'test',
          start: '19.08.2025 12:00',
          location: 'LALALA',
          subject: 'Test'
        }
      ]
    }
  }
})
