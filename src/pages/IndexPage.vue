<template>
  <div id="wrap">
    <div class="tb-head">
      <div class="status-bar">
        <div class="info">
          <div class="status-item free">{{ freeCount }}</div>
          <div class="status-item occupied">{{ occupiedCount }}</div>
        </div>
        <div class="datetime-left">
          <div class="time-left">{{ currentTime }}</div>
          <div class="date-left">{{ currentDate }}</div>
        </div>
      </div>
    </div>

    <div class="schedule">
      <div class="room-labels">
        <div v-for="room in uniqueRooms" :key="room.name" class="room-label">
          <q-icon :name="room.tvArrow" color="white" class="room-icon" />
          <span>{{ room.name }}</span>
        </div>
      </div>

      <div class="event-grid">
        <div v-for="room in uniqueRooms" :key="room.name" class="room-row">
          <template v-if="getEventSlots(room).length === 0">
            <div class="event-slot full free">
              <div class="event-details">Free</div>
            </div>
          </template>
          <template v-else>
            <template v-for="slot in getEventSlots(room).slice(0, 4)" :key="slot.id || `${slot.start}-${slot.end}`">
              <div class="event-slot" :class="slot.type === 'free' ? 'free' : 'occupied'">
                <div class="event-details">
                  <template v-if="slot.type === 'occupied'">
                    <div class="event-title">{{ slot.subject }}</div>
                    <div class="event-time">{{ formatTime(slot.start) }} - {{ formatTime(slot.end) }}</div>
                  </template>
                  <template v-else> Free </template>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLongPollingStore } from '../stores/LongPollingStore.js'

export default {
  name: 'EventList',

  setup() {
    const longPollingStore = useLongPollingStore()

    const state = reactive({
      currentTime: '',
      currentDate: '',
      currentDateOnly: ''
    })

    const updateDateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      state.currentTime = `${hours}:${minutes}`

      const options = { day: 'numeric', month: 'long', year: 'numeric' }
      state.currentDate = now.toLocaleDateString('sk-SK', options)

      state.currentDateOnly = now.toISOString().split('T')[0]
    }

    let intervalId

    onMounted(() => {
      updateDateTime()
      intervalId = setInterval(updateDateTime, 30000)
      longPollingStore.start()
    })

    onBeforeUnmount(() => {
      clearInterval(intervalId)
    })

    const toMinutes = (time) => {
      if (typeof time === 'string' && /^\d+$/.test(time)) {
        const date = new Date(Number(time) * 1000)
        return date.getHours() * 60 + date.getMinutes()
      } else if (typeof time === 'number') {
        const date = new Date(time * 1000)
        return date.getHours() * 60 + date.getMinutes()
      } else if (typeof time === 'string' && time.includes(':')) {
        const [h, m] = time.split(':').map(Number)
        return h * 60 + m
      }
      return 0
    }

    const uniqueRooms = computed(() => {
      if (!longPollingStore.events) return []
      const rooms = []
      longPollingStore.events.forEach((e) => {
        if (!rooms.find((r) => r.name === e.location)) {
          rooms.push({ name: e.location, tvArrow: e.tvArrow })
        }
      })
      console.log(rooms)

      return rooms
    })

    const getRoomEvents = (room) => {
      const nowDate = state.currentDateOnly
      const nowTimestamp = Math.floor(Date.now() / 1000)

      return (longPollingStore.events || [])
        .filter((e) => e.location === room.name)
        .filter((e) => {
          const eventDate = new Date((Number(e.start) - 7200) * 1000).toISOString().split('T')[0]
          return eventDate === nowDate
        })
        .filter((e) => {
          return nowTimestamp <= Number(e.end) - 7200
        })
        .sort((a, b) => Number(a.start) - 7200 - (Number(b.start) - 7200))
    }

    // console.log('EVENTY DOPI4E', getRoomEvents(uniqueRooms))

    const isBeforeEvent = (room) => {
      const events = getRoomEvents(room)
      if (events.length === 0) return false
      const now = toMinutes(state.currentTime)
      const start = toMinutes(events[0].start)
      return now < start - 30
    }

    const isRoomOccupied = (room) => {
      const events = getRoomEvents(room)
      const now = toMinutes(state.currentTime)
      return events.some((event) => {
        const start = toMinutes(event.start)
        const end = toMinutes(event.end)
        return now >= start - 30 && now <= end
      })
    }

    const getEventSlots = (room) => {
      const nowDate = state.currentDateOnly
      const nowTimestamp = Math.floor(Date.now() / 1000)

      const events = (longPollingStore.events || [])
        .filter((e) => e.location === room.name)
        .filter((e) => {
          const eventDate = new Date((Number(e.start) - 7200) * 1000).toISOString().split('T')[0]
          return eventDate === nowDate
        })
        .filter((e) => {
          return nowTimestamp <= Number(e.end) - 7200
        })
        .sort((a, b) => Number(a.start) - 7200 - (Number(b.start) - 7200))

      const result = []
      let lastEnd = null

      events.forEach((event, index) => {
        const start = Number(event.start) - 7200
        const end = Number(event.end) - 7200

        // Ak je to prvý event a začína neskôr ako teraz, pridaj voľný slot od teraz
        if (index === 0) {
          const now = Math.floor(Date.now() / 1000)
          if (start > now) {
            result.push({
              type: 'free',
              start: now,
              end: start
            })
          }
        }

        // Ak je medzi predchádzajúcim koncom a týmto začiatkom medzera, pridaj free slot
        if (lastEnd && start > lastEnd) {
          result.push({
            type: 'free',
            start: lastEnd,
            end: start
          })
        }

        result.push({
          type: 'occupied',
          ...event,
          start,
          end
        })

        lastEnd = end
      })

      return result
    }

    const freeCount = computed(() => {
      return uniqueRooms.value.filter((room) => {
        const events = getRoomEvents(room)
        if (events.length === 0) return true
        return !isRoomOccupied(room)
      }).length
    })

    const occupiedCount = computed(() => {
      return uniqueRooms.value.filter((room) => isRoomOccupied(room)).length
    })

    const formatTime = (timestamp) => {
      const date = new Date(Number(timestamp) * 1000)
      const h = date.getHours().toString().padStart(2, '0')
      const m = date.getMinutes().toString().padStart(2, '0')
      return `${h}:${m}`
    }

    return {
      ...toRefs(state),
      longPollingStore,
      uniqueRooms,
      getRoomEvents,
      isBeforeEvent,
      freeCount,
      occupiedCount,
      formatTime,
      getEventSlots
    }
  }
}
</script>

<style lang="scss" scoped>
#wrap {
  font-family: Arial, sans-serif;
  background-color: black;
  color: white;
  min-height: 100vh;
}

.tb-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
}

.status-bar {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.status-item {
  width: 3em;
  height: 3em;
  font-size: 20px;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 4px;
}

.datetime-left {
  display: flex;
  flex-direction: column;
  font-size: 2em;
  padding-right: 1em;
}

.date-left {
  font-size: 0.6em;
}

.schedule {
  display: flex;
  width: 100%;
  gap: 0.15em;
}

.room-labels {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
}

.room-label {
  border-radius: 0.3em;
  height: 10vh;
  width: 230px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: rgb(39, 125, 255);
  color: white;
  font-weight: bold;

  span {
    padding-left: 0.5em;
    font-size: 1.2em;
  }
}

.room-icon {
  padding-left: 1em;
  font-size: 2em;
}

.event-grid {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.15em;
}

.room-row {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  gap: 0.15em;
  height: 10vh;
}

.event-slot {
  flex: 1 1 auto;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 1em;
  position: relative;
}

.free {
  background-color: green;
  border-radius: 0.3em;
}

.event-slot.free .event-details {
  font-size: 20px;
  padding-left: 0.5em;
  color: white;
}

.occupied {
  border-radius: 0.3em;
  background-color: rgb(231, 0, 0);
  color: white;
}

.event-details {
  top: 5px;
  left: 5px;
  font-size: 1.2em;
}

.event-title {
  font-size: 1.25em;
}

.event-time {
  font-size: 10px;
  font-size: 1em;
}

.info {
  display: flex;
}
</style>
