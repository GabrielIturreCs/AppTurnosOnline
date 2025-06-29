import { Injectable } from "@angular/core"
import type { Service } from "../models/service"
import type { Client } from "../models/client"
import type { Professional } from "../models/professional"
import type { MockBooking, MockClosure } from "../models/booking-types"

@Injectable({
  providedIn: "root",
})
export class DataService {
  services: Service[] = [
    { id: 1, name: "Corte de Cabello Femenino", duration: 60, price: 50, category: "Peluquería", icon: "scissors" },
    { id: 2, name: "Barbería Clásica", duration: 45, price: 35, category: "Barbería", icon: "scissors" },
    { id: 3, name: "Manicura Completa", duration: 40, price: 25, category: "Estética", icon: "palette" },
    { id: 4, name: "Masaje Relajante", duration: 50, price: 70, category: "Spa", icon: "heart-pulse" },
    { id: 5, name: "Coloración y Peinado", duration: 120, price: 110, category: "Peluquería", icon: "palette" },
  ]

  clients: Client[] = [
    {
      id: 1,
      name: "Elena Rodriguez",
      email: "elena.r@example.com",
      lastVisit: "2024-06-15",
      totalSpent: 450,
      calmaMode: true,
      preferences: "Prefiere no hablar durante el corte. Solo lo necesario.",
    },
    {
      id: 2,
      name: "Carlos Gomez",
      email: "carlos.g@example.com",
      lastVisit: "2024-06-20",
      totalSpent: 120,
      calmaMode: false,
      preferences: "Le gusta conversar sobre deportes.",
    },
    {
      id: 3,
      name: "Ana Torres",
      email: "ana.t@example.com",
      lastVisit: "2024-05-30",
      totalSpent: 890,
      calmaMode: true,
      preferences: "Música relajante. Evitar temas personales.",
    },
    {
      id: 4,
      name: "Javier Fernandez",
      email: "javier.f@example.com",
      lastVisit: "2024-06-22",
      totalSpent: 180,
      calmaMode: false,
      preferences: "",
    },
  ]

  professionals: Professional[] = [
    { id: 1, name: "Cualquiera", specialties: [1, 2, 3, 4, 5] }, // Puede realizar cualquier servicio
    { id: 2, name: "Lucía Méndez", specialties: [1, 3, 5] }, // Corte Femenino, Manicura, Coloración
    { id: 3, name: "Javier Solís", specialties: [2] }, // Barbería Clásica
    { id: 4, name: "Sofía Reyes", specialties: [1, 4] }, // Corte Femenino, Masaje Relajante
  ]

  // Simulación de citas ocupadas
  mockBookings: MockBooking[] = [
    { professionalId: 2, date: '2025-06-28', startTime: '10:00', endTime: '11:00' },
    { professionalId: 3, date: '2025-06-29', startTime: '14:00', endTime: '14:45' },
    { professionalId: 4, date: '2025-06-28', startTime: '09:30', endTime: '10:30' },
  ]

  // Simulación de días de cierre
  mockClosures: MockClosure[] = [
    { date: '2025-07-04', allDay: true }, // Cierre de todo el salón
    { professionalId: 2, date: '2025-07-01', allDay: true } // Lucía no trabaja
  ]

  // Horarios base disponibles
  availableBaseTimes: string[] = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ]

  constructor() {}

  getServices(): Service[] {
    return this.services
  }

  getClients(): Client[] {
    return this.clients
  }

  getProfessionals(): Professional[] {
    return this.professionals
  }

  getAvailableTimes(): string[] {
    return this.availableBaseTimes
  }

  getMockBookings(): MockBooking[] {
    return this.mockBookings
  }

  getMockClosures(): MockClosure[] {
    return this.mockClosures
  }

  // Método para filtrar profesionales por servicio
  getProfessionalsForService(serviceId: number): Professional[] {
    return this.professionals.filter(prof =>
      prof.id === 1 || // Siempre incluye "Cualquiera"
      prof.specialties.includes(serviceId)
    )
  }

  addService(service: Omit<Service, "id">): Service {
    const newService = {
      ...service,
      id: Math.max(...this.services.map((s) => s.id)) + 1,
    }
    this.services.push(newService)
    return newService
  }

  addClient(client: Omit<Client, "id">): Client {
    const newClient = {
      ...client,
      id: Math.max(...this.clients.map((c) => c.id)) + 1,
    }
    this.clients.push(newClient)
    return newClient
  }

  updateClient(id: number, updates: Partial<Client>): Client | null {
    const index = this.clients.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.clients[index] = { ...this.clients[index], ...updates }
      return this.clients[index]
    }
    return null
  }

  deleteClient(id: number): boolean {
    const index = this.clients.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.clients.splice(index, 1)
      return true
    }
    return false
  }
}
