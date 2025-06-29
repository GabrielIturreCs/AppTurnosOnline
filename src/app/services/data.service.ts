import { Injectable } from "@angular/core"
import type { Service } from "../models/service"
import type { Client } from "../models/client"
import type { Professional } from "../models/professional"

@Injectable({
  providedIn: "root",
})
export class DataService {
  services: Service[] = [
    { id: 1, name: "Corte de Cabello Femenino", duration: 60, price: 50, category: "Peluquería" },
    { id: 2, name: "Barbería Clásica", duration: 45, price: 35, category: "Barbería" },
    { id: 3, name: "Manicura Completa", duration: 40, price: 25, category: "Estética" },
    { id: 4, name: "Masaje Relajante", duration: 50, price: 70, category: "Spa" },
    { id: 5, name: "Coloración y Peinado", duration: 120, price: 110, category: "Peluquería" },
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
      totalSpent: 75,
      calmaMode: false,
      preferences: "",
    },
  ]

  professionals: Professional[] = [
    { id: 1, name: "Cualquiera" },
    { id: 2, name: "Lucía Méndez" },
    { id: 3, name: "Javier Solís" },
    { id: 4, name: "Sofía Reyes" },
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

  updateService(id: number, updates: Partial<Service>): Service | null {
    const index = this.services.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.services[index] = { ...this.services[index], ...updates }
      return this.services[index]
    }
    return null
  }

  deleteService(id: number): boolean {
    const index = this.services.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.services.splice(index, 1)
      return true
    }
    return false
  }
}
