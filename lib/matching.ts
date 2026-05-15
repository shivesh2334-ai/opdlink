import type {
  Doctor,
  HealthcareCentre,
  MatchBreakdown,
  MatchResult,
  RentalPeriod,
  DayOfWeek,
} from './types';

// ── Time utilities ──────────────────────────────────────────────────────────

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

function calculateTimingOverlapHours(
  doctorStart: string,
  doctorEnd: string,
  centreStart: string,
  centreEnd: string
): number {
  const ds = toMinutes(doctorStart);
  const de = toMinutes(doctorEnd);
  const cs = toMinutes(centreStart);
  const ce = toMinutes(centreEnd);
  const overlap = Math.max(0, Math.min(de, ce) - Math.max(ds, cs));
  return overlap / 60;
}

function getDoctorRequiredHours(doctor: Doctor): number {
  const start = toMinutes(doctor.requiredTimings.start);
  const end = toMinutes(doctor.requiredTimings.end);
  return Math.max(0, (end - start)) / 60;
}

// ── Rate helpers ────────────────────────────────────────────────────────────

function getCentreRateForPreference(
  centre: HealthcareCentre,
  pref: RentalPeriod
): number | null {
  switch (pref) {
    case 'hourly': return centre.hourlyRate ?? null;
    case 'daily':  return centre.dailyRate  ?? null;
    case 'monthly': return centre.monthlyRate ?? null;
    default: return null;
  }
}

// ── Core Scoring ────────────────────────────────────────────────────────────
//
// ALGORITHM: Weighted Multi-Criteria Decision Analysis (MCDA)
//
// Weights are chosen to reflect clinical marketplace priorities:
//   35 pts  Specialty availability  — non-negotiable clinical fit
//   25 pts  Days overlap            — schedule compatibility
//   20 pts  Rent fit                — financial viability
//   15 pts  Timing overlap          — operational compatibility
//    5 pts  Rental type             — preference alignment
// ──────────────────────────────────────────────────────────────────────────

export function scoreDoctorCentrePair(
  doctor: Doctor,
  centre: HealthcareCentre
): {
  score: number;
  breakdown: MatchBreakdown;
  matchedDays: DayOfWeek[];
  timingOverlapHours: number;
  rentDifference: number;
} {
  const breakdown: MatchBreakdown = {
    specialty: 0,
    daysOverlap: 0,
    rentFit: 0,
    timing: 0,
    rentalType: 0,
  };

  // 1. SPECIALTY MATCH (35 pts) — binary hard filter
  const specialtyMatch = centre.specialitiesAvailable
    .map(s => s.toLowerCase())
    .includes(doctor.speciality.toLowerCase());
  if (specialtyMatch) breakdown.specialty = 35;

  // 2. DAYS OVERLAP (25 pts) — proportional to % of required days covered
  const matchedDays = doctor.requiredDays.filter(d =>
    (centre.availableDays as string[]).includes(d)
  ) as DayOfWeek[];
  breakdown.daysOverlap =
    doctor.requiredDays.length > 0
      ? (matchedDays.length / doctor.requiredDays.length) * 25
      : 12.5;

  // 3. RENT FIT (20 pts) — inverse of relative deviation
  const centreRate = getCentreRateForPreference(centre, doctor.rentalPreference);
  let rentDifference = 0;
  if (centreRate !== null && doctor.expectedRent > 0) {
    rentDifference = centreRate - doctor.expectedRent;
    const relDev =
      Math.abs(rentDifference) / Math.max(centreRate, doctor.expectedRent);
    // Full score at 0% dev, zero score at ≥67% dev
    breakdown.rentFit = Math.max(0, 1 - relDev * 1.5) * 20;
  } else if (centreRate === null) {
    breakdown.rentFit = 5; // partial credit if rental type not offered
  }

  // 4. TIMING OVERLAP (15 pts) — hours overlap / required hours
  const requiredHours = getDoctorRequiredHours(doctor);
  let totalOverlapHours = 0;

  if (centre.availableTimings.length > 0) {
    for (const slot of centre.availableTimings) {
      totalOverlapHours += calculateTimingOverlapHours(
        doctor.requiredTimings.start,
        doctor.requiredTimings.end,
        slot.start,
        slot.end
      );
    }
    breakdown.timing =
      requiredHours > 0
        ? Math.min(1, totalOverlapHours / requiredHours) * 15
        : 7.5;
  } else {
    breakdown.timing = 7.5; // neutral if centre hasn't specified
  }

  // 5. RENTAL TYPE MATCH (5 pts) — binary
  if ((centre.rentalModel as string[]).includes(doctor.rentalPreference)) {
    breakdown.rentalType = 5;
  }

  const score = Math.round(
    breakdown.specialty +
    breakdown.daysOverlap +
    breakdown.rentFit +
    breakdown.timing +
    breakdown.rentalType
  );

  return {
    score: Math.min(100, score),
    breakdown,
    matchedDays,
    timingOverlapHours: totalOverlapHours,
    rentDifference,
  };
}

// ── Bulk matching ───────────────────────────────────────────────────────────

export function matchDoctorToCentres(
  doctor: Doctor,
  centres: HealthcareCentre[],
  minScore = 0
): MatchResult[] {
  return centres
    .map(centre => {
      const result = scoreDoctorCentrePair(doctor, centre);
      return {
        centre,
        doctor,
        ...result,
      } as MatchResult;
    })
    .filter(r => r.score >= minScore)
    .sort((a, b) => b.score - a.score);
}

export function matchCentreToDoctors(
  centre: HealthcareCentre,
  doctors: Doctor[],
  minScore = 0
): MatchResult[] {
  return doctors
    .map(doctor => {
      const result = scoreDoctorCentrePair(doctor, centre);
      return {
        centre,
        doctor,
        ...result,
      } as MatchResult;
    })
    .filter(r => r.score >= minScore)
    .sort((a, b) => b.score - a.score);
}

// ── Match explanation builder ───────────────────────────────────────────────

export function buildMatchContext(result: MatchResult): string {
  const { doctor, centre, score, breakdown, matchedDays, rentDifference } = result;
  const rentSign = rentDifference > 0 ? 'higher' : rentDifference < 0 ? 'lower' : 'equal';

  return `
Doctor: ${doctor.name}, ${doctor.speciality} specialist, ${doctor.experienceYears} years experience.
Centre: ${centre.name} (${centre.type.replace(/_/g, ' ')}), ${centre.city}.
Match Score: ${score}/100.
Specialty match: ${breakdown.specialty === 35 ? 'Yes' : 'No'}.
Days overlap: ${matchedDays.join(', ')} (${Math.round((breakdown.daysOverlap / 25) * 100)}% of required days).
Rent: Doctor expects ₹${doctor.expectedRent.toLocaleString('en-IN')} per ${doctor.rentalPreference}; centre charges ₹${(getCentreRateForPreference(centre, doctor.rentalPreference) ?? 0).toLocaleString('en-IN')} — ${Math.abs(rentDifference).toLocaleString('en-IN')} ${rentSign}.
Timing overlap: ${result.timingOverlapHours.toFixed(1)} hours.
Centre facilities: ${centre.facilities.slice(0, 5).join(', ')}.
`.trim();
}
