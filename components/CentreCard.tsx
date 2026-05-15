import type { HealthcareCentre } from '@/lib/types';
import { CENTRE_TYPE_LABELS, RENTAL_LABELS } from '@/lib/constants';
import {
  MapPin, Phone, CheckCircle2, Building2, Clock, IndianRupee, Layers,
} from 'lucide-react';
import Link from 'next/link';

const TYPE_COLORS: Record<string, string> = {
  single_clinic:    'bg-blue-100 text-blue-800',
  polyclinic:       'bg-purple-100 text-purple-800',
  opd_nursing_home: 'bg-teal-100 text-teal-800',
  hospital_opd:     'bg-orange-100 text-orange-800',
};

interface Props {
  centre: HealthcareCentre;
  compact?: boolean;
}

export default function CentreCard({ centre, compact = false }: Props) {
  const rates = [
    centre.hourlyRate  && { label: RENTAL_LABELS.hourly,  value: centre.hourlyRate  },
    centre.dailyRate   && { label: RENTAL_LABELS.daily,   value: centre.dailyRate   },
    centre.monthlyRate && { label: RENTAL_LABELS.monthly, value: centre.monthlyRate },
  ].filter(Boolean) as { label: string; value: number }[];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Header strip */}
      <div className="h-1.5 bg-gradient-to-r from-forest-600 to-forest-400" />

      <div className="p-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`badge ${TYPE_COLORS[centre.type] || 'bg-gray-100 text-gray-700'}`}>
                {CENTRE_TYPE_LABELS[centre.type]}
              </span>
              {centre.verified && (
                <span className="badge bg-green-100 text-green-700">
                  <CheckCircle2 size={10} /> Verified
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-semibold text-ink leading-tight">
              {centre.name}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
            <Building2 size={22} className="text-forest-700" />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin size={13} />
          <span className="truncate">{centre.address}, {centre.city} – {centre.pincode}</span>
        </div>

        {/* Specialities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {centre.specialitiesAvailable.slice(0, compact ? 3 : 5).map(s => (
            <span key={s} className="badge bg-forest-50 text-forest-700 border border-forest-200">
              {s}
            </span>
          ))}
          {centre.specialitiesAvailable.length > (compact ? 3 : 5) && (
            <span className="badge bg-gray-100 text-gray-600">
              +{centre.specialitiesAvailable.length - (compact ? 3 : 5)} more
            </span>
          )}
        </div>

        {!compact && (
          <>
            {/* Days */}
            <div className="flex items-center gap-2 mb-3">
              <Clock size={13} className="text-gray-400 shrink-0" />
              <div className="flex gap-1 flex-wrap">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <span
                    key={d}
                    className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                      centre.availableDays.includes(d as any)
                        ? 'bg-forest-100 text-forest-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Timings */}
            {centre.availableTimings.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                <Clock size={13} className="text-gray-400" />
                {centre.availableTimings.map((t, i) => (
                  <span key={i} className="bg-gray-100 rounded px-2 py-0.5 text-xs font-medium">
                    {t.start}–{t.end}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* Rates */}
        <div className="flex flex-wrap gap-2 mb-4">
          {rates.map(r => (
            <div key={r.label} className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
              <IndianRupee size={12} className="text-amber-700" />
              <span className="text-xs font-bold text-amber-800">
                {r.value.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-amber-600">{r.label}</span>
            </div>
          ))}
        </div>

        {/* Facilities preview */}
        {!compact && centre.facilities.length > 0 && (
          <div className="flex items-start gap-1.5 mb-4">
            <Layers size={13} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-500">{centre.facilities.slice(0, 4).join(' · ')}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Phone size={12} />
            <span className="font-medium">{centre.contactName}</span>
          </div>
          <Link
            href={`/matches?centreId=${centre.id}`}
            className="text-sm font-bold text-forest-700 hover:text-forest-600 transition-colors"
          >
            Find Doctors →
          </Link>
        </div>
      </div>
    </div>
  );
}
