import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { DataService } from "./services/data.service"
import { ThemeService } from "./services/theme.service"
import type { Service } from "./models/service"
import type { Client } from "./models/client"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css", "./app.component.dark.css"],
})
export class AppComponent implements OnInit {
  Math = Math

  // Injected services
  dataService = inject(DataService)
  themeService = inject(ThemeService)
  router = inject(Router)

  // View state
  currentView: "client" | "admin" = "client"

  // Client booking flow
  clientStep = 1
  steps = ["Servicio", "Fecha y Hora", "Confirmación"]
  selectedService: Service | null = null
  selectedTime: string | null = null
  calmaMode = true
  preferences = ""

  // Admin view
  adminPage = "dashboard"
  sidebarOpen = true
  showClientModal = false
  selectedClient: Client | null = null

  // Calendar data
  calendarDays = Array.from({ length: 30 }, (_, i) => i + 1)
  availableTimes = ["09:00", "09:45", "10:30", "11:15", "14:00", "14:45", "15:30", "16:15"]
  weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  workingHours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)

  // Menu items
  menuItems = [
    { page: "dashboard", label: "Panel", icon: "bi bi-house" },
    { page: "agenda", label: "Agenda", icon: "bi bi-calendar" },
    { page: "clientes", label: "Clientes", icon: "bi bi-people" },
    { page: "servicios", label: "Servicios", icon: "bi bi-bag" },
    { page: "reportes", label: "Reportes", icon: "bi bi-bar-chart" },
    { page: "marketing", label: "Marketing", icon: "bi bi-megaphone" },
  ]

  // KPI Data
  kpiData = [
    { title: "Tasa de Ausentismo", value: "8%", change: -2, changeType: "positive", icon: "bi bi-people" },
    { title: "Retención de Clientes", value: "75%", change: 5, changeType: "positive", icon: "bi bi-bar-chart" },
    { title: "Satisfacción Cliente", value: "4.8/5", change: 0.1, changeType: "positive", icon: "bi bi-star" },
    { title: "Ingresos del Mes", value: "$5,500", change: -300, changeType: "negative", icon: "bi bi-currency-dollar" },
  ]

  ngOnInit() {
    this.themeService.initTheme()
  }

  // View switching
  switchView(view: "client" | "admin") {
    this.currentView = view
    if (view === "client") {
      this.resetClientFlow()
    }
  }

  // Client booking flow methods
  selectService(service: Service) {
    this.selectedService = service
    this.clientStep = 2
  }

  selectDate(day: number) {
    console.log("Selected date:", day)
    // Date selection logic
  }

  selectTime(time: string) {
    this.selectedTime = time
  }

  confirmDateTime() {
    if (this.selectedTime) {
      this.clientStep = 3
    }
  }

  confirmBooking() {
    console.log("Booking confirmed:", {
      service: this.selectedService,
      time: this.selectedTime,
      calmaMode: this.calmaMode,
      preferences: this.preferences,
    })
    this.clientStep = 4
  }

  goBackStep() {
    if (this.clientStep > 1) {
      this.clientStep--
    }
  }

  resetClientFlow() {
    this.clientStep = 1
    this.selectedService = null
    this.selectedTime = null
    this.calmaMode = true
    this.preferences = ""
  }

  // Admin methods
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen
  }

  setAdminPage(page: string) {
    this.adminPage = page
  }

  viewClient(client: Client) {
    this.selectedClient = client
    this.showClientModal = true
  }

  closeClientModal() {
    this.showClientModal = false
    this.selectedClient = null
  }

  addAppointment(day: string, hour: string) {
    console.log("Adding appointment for", day, "at", hour)
  }
}
