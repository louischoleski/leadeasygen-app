export type SessionStat = {
  value: string
  delta: string
  dir: 'up' | 'down'
  label: string
  updated: string
}

export const sessionStats: SessionStat[] = [
  { value: '206', delta: '+20%', dir: 'up', label: '% New Sessions', updated: '10:22pm' },
  { value: '140', delta: '5%', dir: 'down', label: 'Total visitors', updated: '9:10am' },
  { value: '262', delta: '+56%', dir: 'up', label: 'Total users', updated: '05:42pm' },
  { value: '62%', delta: '+18%', dir: 'up', label: 'Bounce Rate', updated: '04:00am' },
]

export const visitorSpark = [20, 34, 43, 43, 35, 44, 32, 44, 52, 45]

export const trafficSpark = [-8, 2, 4, 3, 5, 4, 3, 5, 5, 6, 3, 9, 7, 3, 5, 6, 9, 5, 6, 7, 2, 3, 9, 6, 6, 7, 8, 10, 15, 16, 17, 15]

export const downloadsSpark = [10, 34, 13, 33, 35, 24, 32, 24, 52, 35]

const previousUsers = [16, 24, 11, 7, 10, 15, 24, 30]
const currentUsers = [26, 44, 31, 27, 36, 46, 56, 66]

export const activeUsers = previousUsers.map((previous, x) => ({
  x,
  previous,
  current: currentUsers[x],
}))

export type Customer = {
  name: string
  phone: string
  address: string
  share: [number, number]
  city: string
}

export const customers: Customer[] = [
  { name: 'Abraham', phone: '076 9477 4896', address: '294-318 Duis Ave', share: [4, 2], city: 'Vosselaar' },
  { name: 'Phelan', phone: '0500 034548', address: '680-1097 Mi Rd.', share: [4, 1], city: 'Lavoir' },
  { name: 'Raya', phone: '(01315) 27698', address: 'Ap #289-8161 In Avenue', share: [1, 3], city: 'Santomenna' },
  { name: 'Azalia', phone: '0500 854198', address: '226-4861 Augue. St.', share: [3, 5], city: 'Newtown' },
]
