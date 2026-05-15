'use client';

import type { MatchResult } from '@/lib/types';
import { CENTRE_TYPE_LABELS, RENTAL_LABELS, getScoreTier } from '@/lib/constants';
import { MapPin, CheckCircle2, AlertCircle, Clock, IndianRupee, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
  result: MatchResult;
  mode: 'doctor-to-centre' | 'centre-to-doctor';
  rank: number;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const tier = getScoreTier(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#e8e2d9" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={tier.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          className="score-ring-fill"
          style={{ '--target-offset': `${offset}` } as React.CSSProperties}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold" style={{ color: tier.color }}>{score}</span>
        <span className="text-xs text-gray-400 font-medium">/100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-gray-700">{Math.round(value)}/{max}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function MatchCard({ result, mode, rank }: Props) {
  const { centre, doctor, score, breakdown, matchedDays, rentDifference, timingOverlapHours, aiSummary } = result;
  const [expanded, setExpanded] = useState(false);
  const tier = getScoreTier(score);

  const centreRate = mode === 'doctor-to-centre'
    ? (doctor.rentalPreference === 'hourly' ? centre.hourlyRate
       : doctor.rentalPreference === 'daily' ? centre.dailyRate
       : centre.monthlyRate)
    : null;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
      rank === 1 ? 'border-gold-400 ring-1 ring-gold-400/30' : 'border-gray-100'
    }`}>
      {/* Top bar */}
      <div
        className="h-1.5"
        style={{ background: `linear-gradient(to right, ${tier.color}, ${tier.color}88)` }}
      />

      <div className="p-5">
        {/* Rank badge */}
        {rank <= 3 && (
          <div className="flex justify-end mb-2">
            <span className={`badge ${rank === 1 ? 'bg-gold-400/20 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'} #{rank} Match
            </span>
          </div>
        )}

        {/* Main content */}
        <div className="flex gap-4">
          {/* Score ring */}
          <div className="shrink-0">
            <ScoreRing score={score} />
            <p className="text-center text-xs font-semibold mt-1" style={{ color: tier.color }}>
              {tier.label}
            </p>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {mode === 'doctor-to-centre' ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge bg-purple-100 text-purple-700">
                    {CENTRE_TYPE_LABELS[centre.type]}
                  </span>
                  {centre.verified && (
                    <span className="badge bg-green-100 text-green-700">
                      <CheckCircle2 size={10} /> Verified
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-1">{centre.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin size={12} /> {centre.city}, {centre.state}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge bg-orange-100 text-orange-700">{doctor.speciality}</span>
                  {doctor.verified && (
                    <span className="badge bg-green-100 text-green-700">
                      <CheckCircle2 size={10} /> Verified
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-1">
                  {doctor.salutation} {doctor.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin size={12} /> {doctor.city} · {doctor.experienceYears}y exp
                </div>
              </>
            )}

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-3 text-xs">
              {matchedDays.length > 0 && (
                <div className="flex items-center gap-1 text-forest-700">
                  <CheckCircle2 size={11} />
                  <span>{matchedDays.join(', ')}</span>
                </div>
              )}
              {timingOverlapHours > 0 && (
                <div className="flex items-center gap-1 text-blue-700">
                  <Clock size={11} />
                  <span>{timingOverlapHours.toFixed(1)}h overlap</span>
                </div>
              )}
              {centreRate !== undefined && centreRate !== null && (
                <div className={`flex items-center gap-1 ${Math.abs(rentDifference) < centreRate * 0.1 ? 'text-green-700' : 'text-amber-700'}`}>
                  <IndianRupee size={11} />
                  <span>
                    ₹{centreRate.toLocaleString('en-IN')} {RENTAL_LABELS[doctor.rentalPreference]}
                    {rentDifference !== 0 && (
                      <span className={rentDifference > 0 ? ' text-red-500' : ' text-green-600'}>
                        {' '}({rentDifference > 0 ? '+' : ''}₹{Math.abs(rentDifference).toLocaleString('en-IN')})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Summary */}
        {aiSummary && (
          <div className="mt-3 p-3 rounded-xl bg-forest-50 border border-forest-100 flex gap-2">
            <Sparkles size={14} className="text-forest-600 mt-0.5 shrink-0" />
            <p className="text-sm text-forest-800 leading-relaxed">{aiSummary}</p>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? 'Hide' : 'Show'} score breakdown
        </button>

        {/* Breakdown */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <ScoreBar label="Specialty Match"  value={breakdown.specialty}    max={35}  color="#1a6b42" />
            <ScoreBar label="Days Coverage"    value={breakdown.daysOverlap} max={25}  color="#339966" />
            <ScoreBar label="Rent Compatibility" value={breakdown.rentFit}   max={20}  color="#f0b429" />
            <ScoreBar label="Timing Overlap"   value={breakdown.timing}      max={15}  color="#3b82f6" />
            <ScoreBar label="Rental Type"      value={breakdown.rentalType}  max={5}   color="#8b5cf6" />
            <div className="pt-2 border-t border-gray-100">
              {breakdown.specialty < 35 && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5">
                  <AlertCircle size={12} />
                  Specialty not listed — contact centre to confirm availability
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
