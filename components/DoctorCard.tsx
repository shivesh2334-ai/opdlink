import type { Doctor } from '@/lib/types';
import { RENTAL_LABELS } from '@/lib/constants';
import { User2, MapPin, Clock, IndianRupee, CheckCircle2, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Props {
  doctor: Doctor;
  compact?: boolean;
}

export default function DoctorCard({ doctor, compact = false }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header accent */}
      <div className="h-1.5 bg-gradient-to-r from-saffron-500 to-gold-400" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-saffron-50 border-2 border-saffron-200 flex items-center justify-center shrink-0">
            <User2 size={22} className="text-saffron-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              {doctor.verified && (
                <span className="badge bg-green-100 text-green-700">
                  <CheckCircle2 size={10} /> NMC Verified
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-semibold text-ink leading-tight">
              {doctor.salutation} {doctor.name}
            </h3>
            <p className="text-sm text-saffron-600 font-semibold">{doctor.speciality}</p>
          </div>
        </div>

        {/* Qualifications */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {doctor.qualification.map(q => (
            <span key={q} className="badge bg-indigo-50 text-indigo-700 border border-indigo-200">
              {q}
            </span>
          ))}
          <span className="badge bg-gray-100 text-gray-600">
            {doctor.experienceYears}y exp
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin size={13} />
          <span>{doctor.city}, {doctor.state} – {doctor.pincode}</span>
        </div>

        {!compact && (
          <>
            {/* Required days */}
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={13} className="text-gray-400 shrink-0" />
              <div className="flex gap-1 flex-wrap">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <span
                    key={d}
                    className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                      doctor.requiredDays.includes(d as any)
                        ? 'bg-saffron-100 text-saffron-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Timing */}
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
              <Clock size={13} className="text-gray-400" />
              <span className="bg-gray-100 rounded px-2 py-0.5 text-xs font-medium">
                {doctor.requiredTimings.start} – {doctor.requiredTimings.end}
              </span>
              {doctor.sessionsPerDay > 1 && (
                <span className="text-xs text-gray-500">
                  {doctor.sessionsPerDay} sessions/day
                </span>
              )}
            </div>
          </>
        )}

        {/* Rent expectation */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
            <IndianRupee size={12} className="text-amber-700" />
            <span className="text-xs font-bold text-amber-800">
              {doctor.expectedRent.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-amber-600">
              {RENTAL_LABELS[doctor.rentalPreference]}
            </span>
          </div>
          {!compact && doctor.preferredCentreTypes.length > 0 && (
            <span className="text-xs text-gray-500">
              Prefers: {doctor.preferredCentreTypes.length} centre type{doctor.preferredCentreTypes.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            Reg: {doctor.registrationNo}
          </div>
          <Link
            href={`/matches?doctorId=${doctor.id}`}
            className="text-sm font-bold text-saffron-600 hover:text-saffron-500 transition-colors"
          >
            Find Spaces →
          </Link>
        </div>
      </div>
    </div>
  );
}
