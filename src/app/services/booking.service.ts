import { Injectable } from "@angular/core"
import { DataService } from './data.service'
import type { Booking } from "../models/booking"
import type { MockBooking, MockClosure } from '../models/booking-types'

@Injectable({
  providedIn: "root",
})
export class BookingService {
  constructor(private dataService: DataService) {}

  // Helper para parsear horas y minutos de un string "HH:MM"
  parseTime(timeString: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number)
    return { hours, minutes }
  }

  // Helper para obtener un objeto Date con la fecha y hora específicas
  getDateTime(date: Date, timeString: string): Date {
    const { hours, minutes } = this.parseTime(timeString)
    const dt = new Date(date)
    dt.setHours(hours, minutes, 0, 0)
    return dt
  }

  // Helper para comprobar si dos intervalos de tiempo se solapan
  intervalsOverlap(intervalA: [Date, Date], intervalB: [Date, Date]): boolean {
    const [startA, endA] = intervalA
    const [startB, endB] = intervalB
    return startA < endB && startB < endA
  }

  // Función para determinar si un slot está disponible
  isSlotAvailable(date: Date, timeString: string, professionalId: number, serviceDuration: number): boolean {
    const proposedStart = this.getDateTime(date, timeString)
    const proposedEnd = new Date(proposedStart.getTime() + serviceDuration * 60 * 1000)

    const mockBookings = this.dataService.getMockBookings()

    // Comprobar solapamiento con mockBookings para el profesional o "Cualquiera"
    const isBooked = mockBookings.some(booking => {
      const bookingDate = this.getDateTime(new Date(booking.date), booking.startTime)
      if (bookingDate.toDateString() !== proposedStart.toDateString()) return false

      const bookingStart = this.getDateTime(new Date(booking.date), booking.startTime)
      const bookingEnd = this.getDateTime(new Date(booking.date), booking.endTime)
      const bookingInterval: [Date, Date] = [bookingStart, bookingEnd]

      // Comprueba si el ID del profesional coincide o si es "Cualquiera" (ID 1)
      const isForThisProfessional = (professionalId === booking.professionalId) || (professionalId === 1)
      
      return isForThisProfessional && this.intervalsOverlap([proposedStart, proposedEnd], bookingInterval)
    })

    return !isBooked
  }

  // Comprobar si el día está cerrado
  isClosedDay(date: Date, professionalId: number): boolean {
    const mockClosures = this.dataService.getMockClosures()
    
    return mockClosures.some(closure => {
      const closureDate = this.getDateTime(new Date(closure.date), "00:00")
      const isForThisProf = !closure.professionalId || closure.professionalId === professionalId
      return isForThisProf && closureDate.toDateString() === date.toDateString()
    })
  }

  // Verificar si es hora pasada del día actual
  isPastTimeToday(date: Date, timeString: string): boolean {
    const today = new Date()
    const slotHour = this.parseTime(timeString).hours
    const slotMinute = this.parseTime(timeString).minutes
    
    return date.toDateString() === today.toDateString() && 
           (slotHour < today.getHours() || (slotHour === today.getHours() && slotMinute <= today.getMinutes()))
  }

  // Obtener días del mes
  getDaysInMonth(month: number, year: number): Date[] {
    const date = new Date(year, month, 1)
    const days: Date[] = []
    while (date.getMonth() === month) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  // Obtener horarios disponibles para una fecha específica
  getAvailableTimesForDate(date: Date, professionalId: number, serviceDuration: number): string[] {
    const availableTimes = this.dataService.getAvailableTimes()
    
    return availableTimes.filter(time => {
      const isPast = this.isPastTimeToday(date, time)
      const isAvailable = this.isSlotAvailable(date, time, professionalId, serviceDuration)
      return !isPast && isAvailable
    })
  }
  private bookings: Booking[] = [
    {
      id: 1,
      clientId: 1,
      serviceId: 1,
      professionalId: 2,
      date: "2024-06-26",
      time: "10:30",
      status: "confirmed",
      calmaMode: true,
      preferences: "Prefiere música relajante",
      createdAt: "2024-06-20T10:00:00Z",
    },
    {
      id: 2,
      clientId: 2,
      serviceId: 2,
      professionalId: 3,
      date: "2024-06-26",
      time: "14:00",
      status: "confirmed",
      calmaMode: false,
      preferences: "",
      createdAt: "2024-06-21T15:30:00Z",
    },
  ]

  constructor() {}

  createBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
    const newBooking: Booking = {
      ...booking,
      id: this.bookings.length + 1,
      createdAt: new Date().toISOString(),
    }
    this.bookings.push(newBooking)
    return newBooking
  }

  getBookings(): Booking[] {
    return this.bookings
  }

  getBookingsByDate(date: string): Booking[] {
    return this.bookings.filter((booking) => booking.date === date)
  }

  getBookingsByClient(clientId: number): Booking[] {
    return this.bookings.filter((booking) => booking.clientId === clientId)
  }

  getBookingsByProfessional(professionalId: number): Booking[] {
    return this.bookings.filter((booking) => booking.professionalId === professionalId)
  }

  updateBookingStatus(id: number, status: Booking["status"]): boolean {
    const booking = this.bookings.find((b) => b.id === id)
    if (booking) {
      booking.status = status
      return true
    }
    return false
  }

  updateBooking(id: number, updates: Partial<Booking>): Booking | null {
    const index = this.bookings.findIndex((b) => b.id === id)
    if (index !== -1) {
      this.bookings[index] = { ...this.bookings[index], ...updates }
      return this.bookings[index]
    }
    return null
  }

  cancelBooking(id: number): boolean {
    return this.updateBookingStatus(id, "cancelled")
  }

  deleteBooking(id: number): boolean {
    const index = this.bookings.findIndex((b) => b.id === id)
    if (index !== -1) {
      this.bookings.splice(index, 1)
      return true
    }
    return false
  }

  getAvailableSlots(date: string, serviceId: number): string[] {
    const allSlots = ["09:00", "09:45", "10:30", "11:15", "14:00", "14:45", "15:30", "16:15"]

    const bookedSlots = this.getBookingsByDate(date)
      .filter((booking) => booking.status !== "cancelled")
      .map((booking) => booking.time)

    return allSlots.filter((slot) => !bookedSlots.includes(slot))
  }

  isSlotAvailable(date: string, time: string, professionalId?: number): boolean {
    const conflictingBookings = this.bookings.filter(
      (booking) =>
        booking.date === date &&
        booking.time === time &&
        booking.status !== "cancelled" &&
        (professionalId ? booking.professionalId === professionalId : true),
    )

    return conflictingBookings.length === 0
  }

  getBookingsByDateRange(startDate: string, endDate: string): Booking[] {
    return this.bookings.filter((booking) => booking.date >= startDate && booking.date <= endDate)
  }
}
