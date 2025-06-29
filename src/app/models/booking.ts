export interface Booking {
  id: number
  clientId: number
  serviceId: number
  professionalId: number
  date: string
  time: string
  status: "confirmed" | "pending" | "cancelled"
  calmaMode: boolean
  preferences: string
  createdAt: string
}
