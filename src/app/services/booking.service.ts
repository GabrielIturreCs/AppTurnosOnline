import { Injectable } from "@angular/core"
import type { Booking } from "../models/booking"

@Injectable({
  providedIn: "root",
})
export class BookingService {
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
