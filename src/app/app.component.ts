import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { DataService } from "./services/data.service"
import { AvailabilityService } from "./services/availability.service"
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
  availabilityService = inject(AvailabilityService)
  themeService = inject(ThemeService)
  router = inject(Router)

  // View state
  currentView: "client" | "admin" = "client"

  // Client booking flow - 6 steps to match React flow
  clientStep = 1
  totalSteps = 6
  steps = ["Tu Nombre", "Servicio", "Profesional", "Fecha y Hora", "Confirmación", "Pago"]
  selectedService: Service | null = null
  selectedTime: string | null = null
  selectedDate: Date | null = null
  selectedProfessional: any = null
  selectedCategory: string = "Todos"
  
  // Client info form
  clientInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    calmMode: false
  }

  // Payment info
  paymentInfo = {
    isProcessing: false,
    isConfirmed: false,
    message: '',
    partialAmount: 0
  }

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

  // Calendar navigation
  currentMonth = new Date().getMonth()
  currentYear = new Date().getFullYear()
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  dayNames = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

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
      professional: this.selectedProfessional,
      clientInfo: this.clientInfo,
    })
    this.clientStep = 5 // Go to confirmation step
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
    this.selectedDate = null
    this.selectedProfessional = null
    this.clientInfo = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
      calmMode: false
    }
    this.paymentInfo = {
      isProcessing: false,
      isConfirmed: false,
      message: '',
      partialAmount: 0
    }
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

  // Client booking methods
  getServiceCategories(): string[] {
    const categories = ["Todos", ...new Set(this.dataService.getServices().map(s => s.category))]
    return categories
  }

  getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      "Todos": "grid",
      "Peluquería": "scissors",
      "Barbería": "scissors",
      "Estética": "palette",
      "Spa": "heart-pulse"
    }
    return iconMap[category] || "star"
  }

  getFilteredServices(): Service[] {
    const services = this.dataService.getServices()
    if (this.selectedCategory === "Todos") {
      return services
    }
    return services.filter(service => service.category === this.selectedCategory)
  }

  selectService(service: Service) {
    this.selectedService = service
  }

  nextStep() {
    if (this.clientStep < 4) {
      this.clientStep++
    }
  }

  previousStep() {
    if (this.clientStep > 1) {
      this.clientStep--
    }
  }

  // Date and time methods
  selectDate(date: Date) {
    this.selectedDate = date
    this.selectedTime = null // Reset time when date changes
  }

  isDateDisabled(day: number): boolean {
    // Add logic to disable past dates or closed days
    const today = new Date().getDate()
    return day < today
  }

  getAvailableTimesForDate(): string[] {
    if (!this.selectedDate || !this.selectedService || !this.selectedProfessional) {
      return []
    }
    
    const dateString = this.selectedDate.toISOString().split('T')[0]
    return this.availabilityService.getAvailableTimesForProfessional(
      this.selectedProfessional.id,
      dateString,
      this.selectedService.duration
    )
  }

  getAvailableProfessionals(): any[] {
    if (!this.selectedService) {
      return []
    }
    return this.dataService.getProfessionalsForService(this.selectedService.id)
  }

  selectProfessional(professional: any) {
    this.selectedProfessional = professional
  }

  // Client info validation
  isClientInfoValid(): boolean {
    return !!(
      this.clientInfo.firstName.trim() &&
      this.clientInfo.lastName.trim() &&
      this.clientInfo.email.trim() &&
      this.clientInfo.phone.trim()
    )
  }

  // Booking completion methods
  addToCalendar() {
    // Implement calendar integration
    console.log('Adding to calendar...')
  }

  resetBooking() {
    this.clientStep = 1
    this.selectedService = null
    this.selectedDate = null
    this.selectedTime = null
    this.selectedProfessional = null
    this.selectedCategory = "Todos"
    this.clientInfo = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
      calmMode: false
    }
    this.paymentInfo = {
      isProcessing: false,
      isConfirmed: false,
      message: '',
      partialAmount: 0
    }
  }

  // Payment methods
  processPayment() {
    if (!this.selectedService) return
    
    this.paymentInfo.isProcessing = true
    this.paymentInfo.partialAmount = this.selectedService.price / 2
    this.paymentInfo.message = 'Procesando pago...'
    
    // Simulate payment processing
    setTimeout(() => {
      this.paymentInfo.isProcessing = false
      this.paymentInfo.isConfirmed = true
      this.paymentInfo.message = `¡Pago de $${this.paymentInfo.partialAmount} confirmado con éxito!`
    }, 1500)
  }

  // Calendar helper methods
  getCurrentMonthDays(): Date[] {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    
    const days: Date[] = []
    for (let day = new Date(firstDay); day <= lastDay; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day))
    }
    return days
  }

  isDateInPast(date: Date): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  isDateSelected(date: Date): boolean {
    return this.selectedDate ? date.toDateString() === this.selectedDate.toDateString() : false
  }

  formatSelectedDate(): string {
    if (!this.selectedDate) return ''
    return this.selectedDate.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // Step navigation methods
  handleConfirmName() {
    if (this.clientInfo.firstName.trim() && this.clientInfo.lastName.trim()) {
      this.clientStep = 2
    }
  }

  handleSelectService(service: Service) {
    this.selectedService = service
    this.clientStep = 3
  }

  handleSelectProfessional(professional: any) {
    this.selectedProfessional = professional
    this.clientStep = 4
  }

  handleConfirmDateTime() {
    if (this.selectedDate && this.selectedTime) {
      this.clientStep = 5
    }
  }

  handleConfirmBooking(bookingDetails?: any) {
    console.log("Final booking confirmed:", {
      clientInfo: this.clientInfo,
      service: this.selectedService,
      professional: this.selectedProfessional,
      date: this.selectedDate,
      time: this.selectedTime,
      payment: this.paymentInfo,
      ...bookingDetails
    })
    this.clientStep = 6
  }

  // Calendar methods
  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11
      this.currentYear--
    } else {
      this.currentMonth--
    }
    this.selectedDate = null
    this.selectedTime = null
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0
      this.currentYear++
    } else {
      this.currentMonth++
    }
    this.selectedDate = null
    this.selectedTime = null
  }

  isCurrentMonthAndYear(): boolean {
    const today = new Date()
    return this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear()
  }

  getDaysInCurrentMonth(): Date[] {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1)
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)
    const days: Date[] = []
    
    for (let day = new Date(firstDay); day <= lastDay; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day))
    }
    return days
  }

  getFirstDayOfMonthPadding(): number[] {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1)
    const dayOfWeek = firstDay.getDay()
    const padding = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    return Array.from({ length: padding }, (_, i) => i)
  }

  isDateDisabledOrClosed(date: Date): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Check if date is in the past
    if (date < today) return true
    
    // Check for closures from data service
    const closures = this.dataService.getMockClosures()
    const dateString = date.toISOString().split('T')[0]
    
    return closures.some(closure => {
      if (closure.allDay && closure.date === dateString) {
        return !closure.professionalId || closure.professionalId === this.selectedProfessional?.id
      }
      return false
    })
  }

  // Helper methods for templates
  getTodayDateString(): string {
    return new Date().toDateString()
  }
}
