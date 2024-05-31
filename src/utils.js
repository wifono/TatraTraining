import dayjs from 'dayjs'

function rnd(min, max) {
  return min + Math.floor(Math.random() * (1 + max - min))
}

function rndItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function meetingFixtures(m) {
  const start = dayjs.unix(m.reservationStart)
  m.from = start.hour() + start.minute() / 60
  m.len = (m.reservationEnd - m.reservationStart) / 3600
  m.start = dayjs.unix(m.reservationStart).format('HH:mm')
  m.end = dayjs.unix(m.reservationEnd).format('HH:mm')
}

export { rnd, rndItem, meetingFixtures }
