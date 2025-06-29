import { Injectable, inject } from "@angular/core"
import { DataService } from "./data.service"
import type { Professional } from "../models/professional"

@Injectable({
  providedIn: "root",
})
export class AvailabilityService {
  private dataService = inject(DataService)

  constructor() {}

  // Obtener horarios disponibles para un profesional y fecha específica
  getAvailableTimesForProfessional(
    professionalId: number,
    date: string,
    serviceDuration: number
  ): string[] {
    const baseTimes = this.dataService.getAvailableTimes()
    const bookings = this.dataService.getMockBookings()
    const closures = this.dataService.getMockClosures()

    // Verificar si hay cierre general ese día
    const generalClosure = closures.find(
      closure => closure.date === date && closure.allDay && !closure.professionalId
    )
    if (generalClosure) {
      return []
    }

    // Verificar si el profesional específico tiene cierre ese día
    const professionalClosure = closures.find(
      closure => closure.date === date && closure.professionalId === professionalId
    )
    if (professionalClosure) {
      return []
    }

    // Filtrar horarios ocupados por citas existentes
    const professionalBookings = bookings.filter(
      booking => booking.professionalId === professionalId && booking.date === date
    )

    return baseTimes.filter(time => {
      // Verificar si el horario está libre
      const timeSlotEnd = this.addMinutesToTime(time, serviceDuration)
      
      return !professionalBookings.some(booking => {
        return this.timesOverlap(time, timeSlotEnd, booking.startTime, booking.endTime)
      })
    })
  }

  // Obtener todos los profesionales disponibles para un servicio, fecha y hora específica
  getAvailableProfessionals(
    serviceId: number,
    date: string,
    time: string,
    serviceDuration: number
  ): Professional[] {
    const allProfessionals = this.dataService.getProfessionalsForService(serviceId)
    
    return allProfessionals.filter(professional => {
      const availableTimes = this.getAvailableTimesForProfessional(
        professional.id,
        date,
        serviceDuration
      )
      return availableTimes.includes(time)
    })
  }

  // Verificar si dos rangos de tiempo se superponen
  private timesOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    const start1Minutes = this.timeToMinutes(start1)
    const end1Minutes = this.timeToMinutes(end1)
    const start2Minutes = this.timeToMinutes(start2)
    const end2Minutes = this.timeToMinutes(end2)

    return start1Minutes < end2Minutes && end1Minutes > start2Minutes
  }

  // Convertir tiempo en formato "HH:MM" a minutos
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Agregar minutos a un tiempo en formato "HH:MM"
  private addMinutesToTime(time: string, minutes: number): string {
    const totalMinutes = this.timeToMinutes(time) + minutes
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // Generar horarios disponibles para múltiples días
  getAvailableTimesForDateRange(
    professionalId: number,
    startDate: Date,
    endDate: Date,
    serviceDuration: number
  ): Record<string, string[]> {
    const result: Record<string, string[]> = {}
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      result[dateStr] = this.getAvailableTimesForProfessional(
        professionalId,
        dateStr,
        serviceDuration
      )
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }
}
