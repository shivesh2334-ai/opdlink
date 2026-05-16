export type CentreType = 'single_clinic' | 'polyclinic' | 'opd_nursing_home' | 'hospital_opd' | 'remote_clinic' | 'health_camp';
export type RentalPeriod = 'hourly' | 'daily' | 'monthly';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "17:00"
}

export interface HealthcareCentre {
  id: string;
  name: string;
  type: CentreType;
  address: string;
  city: string;
  pincode: string;
  state: string;
  specialitiesAvailable: string[];
  rentalModel: RentalPeriod[];
  hourlyRate?: number;
  dailyRate?: number;
  monthlyRate?: number;
  availableDays: DayOfWeek[];
  availableTimings: TimeSlot[];
  totalRooms: number;
  facilities: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  registrationNo?: string;
  verified: boolean;
  createdAt: string;
  description?: string;
  isRemote?: boolean;
  isMonthlyClinc?: boolean;
  isHealthCamp?: boolean;
  campFrequency?: string; // e.g., "weekly", "bi-weekly", "monthly"
  campLocations?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  salutation: 'Dr.' | 'Prof. Dr.' | 'Dr. (Prof.)';
  registrationNo: string;
  speciality: string;
  qualification: string[];
  experienceYears: number;
  city: string;
  pincode: string;
  state: string;
  preferredCentreTypes: CentreType[];
  requiredDays: DayOfWeek[];
  requiredTimings: TimeSlot;
  sessionsPerDay: number;
  rentalPreference: RentalPeriod;
  expectedRent: number;
  phone: string;
  email: string;
  verified: boolean;
  createdAt: string;
  bio?: string;
  openToRemote?: boolean;
  openToHealthCamps?: boolean;
}

export interface MatchBreakdown {
  specialty: number;    // 0-35
  daysOverlap: number; // 0-25
  rentFit: number;     // 0-20
  timing: number;      // 0-15
  rentalType: number;  // 0-5
}

export interface MatchResult {
  centre: HealthcareCentre;
  doctor: Doctor;
  score: number; // 0-100
  breakdown: MatchBreakdown;
  matchedDays: DayOfWeek[];
  timingOverlapHours: number;
  rentDifference: number; // positive = centre is more expensive
  aiSummary?: string;
}

export interface Booking {
  id: string;
  doctorId: string;
  centreId: string;
  matchId?: string; // reference to the match that led to this booking
  status: BookingStatus;
  bookedDate: string; // ISO format date when booking was made
  startDate: string; // ISO format date when OPD space starts
  endDate?: string; // ISO format date when OPD space ends (for time-bound bookings)
  rentalPeriod: RentalPeriod;
  totalCost?: number; // calculated cost based on rental period
  notes?: string; // any special notes or requirements
  createdAt: string;
  updatedAt: string;
}
