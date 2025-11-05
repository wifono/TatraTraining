import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { api } from '../boot/axios.js'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

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

          const now = dayjs()

          const newEvents = res.data[0].events
            .map((event) => {
              const [startStr, endStr] = event.start.split('/').map((s) => s.trim())

              const start = dayjs(startStr, 'HH:mm D.M.YYYY')
              const end = dayjs(endStr, 'HH:mm D.M.YYYY')

              return {
                ...event,
                start,
                end
              }
            })
            .sort((a, b) => {
              const aKey = String(a.location || '').toLowerCase()
              const bKey = String(b.location || '').toLowerCase()
              return aKey.localeCompare(bKey, undefined, { sensitivity: 'base' })
            })

          // odstránenie duplikátov podľa ID
          const uniqueEventsMap = new Map()
          newEvents.forEach((e) => {
            if (!uniqueEventsMap.has(e.id)) {
              uniqueEventsMap.set(e.id, e)
            }
          })
          const uniqueEvents = Array.from(uniqueEventsMap.values())

          // vyber najbližšiu alebo prebiehajúcu udalosť pre každú miestnosť
          const eventsByLocation = new Map()

          uniqueEvents.forEach((event) => {
            const loc = event.location || '---'

            if (!eventsByLocation.has(loc)) {
              eventsByLocation.set(loc, event)
              return
            }

            const current = eventsByLocation.get(loc)

            const isCurrentActive = now.isBetween(current.start, current.end, null, '[)')
            const isNewActive = now.isBetween(event.start, event.end, null, '[)')

            if (isNewActive && !isCurrentActive) {
              eventsByLocation.set(loc, event)
            } else if (!isCurrentActive && !isNewActive) {
              // obe sú v budúcnosti – vyber bližšiu
              if (event.start.isAfter(now) && event.start.isBefore(current.start)) {
                eventsByLocation.set(loc, event)
              }
            }
          })

          // prevedieme späť do formátu aký očakáva UI
          this.events = Array.from(eventsByLocation.values()).map((e) => ({
            ...e,
            start: `${e.start.format('HH:mm D.M.YYYY')} / ${e.end.format('HH:mm D.M.YYYY')}`
          }))
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
    }
  }
})
