export interface ClientName {
  firstName: string
  lastName: string
}

export interface DateTime {
  date: Date | null
  time: string | null
}

export interface BookingDetails {
  notes: string
  isPaymentConfirmed: boolean
  paidAmount: number
}

export interface MockBooking {
  professionalId: number
  date: string
  startTime: string
  endTime: string
}

export interface MockClosure {
  date: string
  allDay: boolean
  professionalId?: number
}
