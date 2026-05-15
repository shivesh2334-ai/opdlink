import type { CentreType, DayOfWeek } from './types';

export const CENTRE_TYPE_LABELS: Record<CentreType, string> = {
  single_clinic: 'Single Clinic',
  polyclinic: 'Polyclinic',
  opd_nursing_home: 'OPD at Nursing Home',
  hospital_opd: 'Hospital OPD',
};

export const CENTRE_TYPE_DESCRIPTIONS: Record<CentreType, string> = {
  single_clinic: 'Independent consultation room for single-specialty practice',
  polyclinic: 'Multi-specialty facility with shared infrastructure',
  opd_nursing_home: 'OPD space within an operational nursing home',
  hospital_opd: 'Outpatient department within a registered hospital',
};

export const DAYS_OF_WEEK: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const SPECIALITIES = [
  'Cardiology', 'Dermatology', 'Endocrinology', 'ENT', 'Gastroenterology',
  'General Medicine', 'General Surgery', 'Gynaecology & Obstetrics', 'Haematology',
  'Hepatology', 'Internal Medicine', 'Nephrology', 'Neurology', 'Neurosurgery',
  'Oncology', 'Ophthalmology', 'Orthopaedics', 'Paediatrics', 'Psychiatry',
  'Pulmonology', 'Radiology', 'Rheumatology', 'Urology', 'Vascular Surgery',
  'Aesthetic Medicine', 'Pain Management', 'Sports Medicine', 'Diabetology',
  'Geriatrics', 'Emergency Medicine',
];

export const FACILITIES = [
  'ECG Machine', 'Echo/USG', 'Waiting Area', 'Receptionist', 'Pharmacy',
  'Pathology Lab', 'X-Ray', 'Digital X-Ray', 'Blood Pressure Monitor',
  'Pulse Oximeter', 'Glucometer', 'IV Infusion Setup', 'Minor OT',
  'Procedure Room', 'Nebulisation', 'AC Consultation Room', 'Parking',
  'Lift Access', 'Ground Floor', 'Wheelchair Access', 'CCTV', 'WiFi',
  'EMR System', 'Billing Counter', 'Nursing Staff', 'Ward Boys',
];

export const QUALIFICATIONS = [
  'MBBS', 'MD', 'MS', 'DM', 'MCh', 'DNB', 'FRCP', 'MRCP', 'FRCS',
  'PGDC', 'PGDE', 'Fellowship (AIIMS)', 'Fellowship (PGI)', 'PhD',
  'FAMS', 'FIAMS', 'FICM', 'FIAE',
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

export const RENTAL_LABELS = {
  hourly: 'Per Hour',
  daily: 'Per Day (Session)',
  monthly: 'Monthly',
};

export const SCORE_TIERS = {
  excellent: { min: 80, label: 'Excellent Match', color: '#1a6b42' },
  good: { min: 60, label: 'Good Match', color: '#339966' },
  fair: { min: 40, label: 'Fair Match', color: '#f0b429' },
  low: { min: 0, label: 'Low Match', color: '#e05c1a' },
};

export function getScoreTier(score: number) {
  if (score >= 80) return SCORE_TIERS.excellent;
  if (score >= 60) return SCORE_TIERS.good;
  if (score >= 40) return SCORE_TIERS.fair;
  return SCORE_TIERS.low;
}

// Seed demo data
export const DEMO_CENTRES = [
  {
    id: 'demo-c1',
    name: 'Medicity Polyclinic',
    type: 'polyclinic' as CentreType,
    address: 'Plot 14, Sector 12, Dwarka',
    city: 'New Delhi',
    pincode: '110075',
    state: 'Delhi',
    specialitiesAvailable: ['Cardiology', 'General Medicine', 'Endocrinology', 'Diabetology'],
    rentalModel: ['daily', 'monthly'] as any,
    dailyRate: 2500,
    monthlyRate: 35000,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as DayOfWeek[],
    availableTimings: [{ start: '09:00', end: '14:00' }, { start: '17:00', end: '21:00' }],
    totalRooms: 6,
    facilities: ['ECG Machine', 'Echo/USG', 'AC Consultation Room', 'Receptionist', 'Parking', 'EMR System'],
    contactName: 'Rajiv Sharma',
    contactPhone: '9876543210',
    contactEmail: 'rajiv@medicity.in',
    registrationNo: 'DH-2019-4521',
    verified: true,
    createdAt: new Date().toISOString(),
    description: 'Premium multi-specialty polyclinic with modern facilities in Dwarka.',
  },
  {
    id: 'demo-c2',
    name: 'Apollo Nursing Home OPD',
    type: 'opd_nursing_home' as CentreType,
    address: '7A Ring Road, Lajpat Nagar',
    city: 'New Delhi',
    pincode: '110024',
    state: 'Delhi',
    specialitiesAvailable: ['Cardiology', 'Orthopaedics', 'Gynaecology & Obstetrics', 'Paediatrics'],
    rentalModel: ['hourly', 'daily'] as any,
    hourlyRate: 800,
    dailyRate: 4000,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'] as DayOfWeek[],
    availableTimings: [{ start: '10:00', end: '13:00' }, { start: '18:00', end: '20:00' }],
    totalRooms: 3,
    facilities: ['ECG Machine', 'Nursing Staff', 'Waiting Area', 'Billing Counter', 'CCTV'],
    contactName: 'Sunita Mehra',
    contactPhone: '9123456789',
    contactEmail: 'sunita@apollonh.in',
    verified: true,
    createdAt: new Date().toISOString(),
    description: 'Well-established nursing home with dedicated OPD block.',
  },
  {
    id: 'demo-c3',
    name: 'HealthFirst Single Clinic',
    type: 'single_clinic' as CentreType,
    address: 'B-12, Green Park Extension',
    city: 'New Delhi',
    pincode: '110016',
    state: 'Delhi',
    specialitiesAvailable: ['Dermatology', 'General Medicine', 'Aesthetic Medicine'],
    rentalModel: ['hourly', 'daily', 'monthly'] as any,
    hourlyRate: 600,
    dailyRate: 3000,
    monthlyRate: 28000,
    availableDays: ['Tue', 'Thu', 'Sat', 'Sun'] as DayOfWeek[],
    availableTimings: [{ start: '11:00', end: '19:00' }],
    totalRooms: 1,
    facilities: ['AC Consultation Room', 'Waiting Area', 'Pharmacy', 'Parking'],
    contactName: 'Priya Nair',
    contactPhone: '9988776655',
    contactEmail: 'priya@healthfirst.in',
    verified: true,
    createdAt: new Date().toISOString(),
    description: 'Modern single-specialty clinic with fully equipped consultation room.',
  },
];
