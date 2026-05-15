'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCentres, getDoctors } from '@/lib/storage';
import { matchDoctorToCentres, matchCentreToDoctors, buildMatchContext } from '@/lib/matching';
import type { Doctor, HealthcareCentre, MatchResult } from '@/lib/types';
import { SPECIALITIES, CENTRE_TYPE_LABELS, RENTAL_LABELS, DAYS_OF_WEEK } from '@/lib/constants';
import MatchCard from '@/components/MatchCard';
import {
  Zap, Search, ArrowLeftRight, Sparkles, AlertCircle, RefreshCw, SlidersHorizontal
} from 'lucide-react';

type Mode = 'doctor-to-centre' | 'centre-to-doctor';

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">{children}</label>
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select
    {...props}
    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-forest-300"
  >
    {props.children}
  </select>
);

const MultiDay = ({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) => (
  <div className="flex flex-wrap gap-1.5">
    {DAYS_OF_WEEK.map(d => (
      <button
        key={d}
        type="button"
        onClick={() => onChange(value.includes(d) ? value.filter(x => x !== d) : [...value, d])}
        className={`w-9 h-9 rounded-full text-xs font-bold border-2 transition-all ${
          value.includes(d) ? 'bg-forest-700 border-forest-700 text-white' : 'border-gray-300 text-gray-500 hover:border-forest-400'
        }`}
      >
        {d.slice(0,2)}
      </button>
    ))}
  </div>
);

function MatchesContent() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>('doctor-to-centre');
  const [centres, setCentres] = useState<HealthcareCentre[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [minScore, setMinScore] = useState(0);

  // Doctor requirements form
  const [doctorForm, setDoctorForm] = useState({
    selectedDoctorId: '',
    speciality: 'Cardiology',
    requiredDays: [] as string[],
    timingStart: '09:00',
    timingEnd: '13:00',
    rentalPreference: 'daily',
    expectedRent: '',
  });

  // Centre form
  const [centreForm, setCentreForm] = useState({
    selectedCentreId: '',
  });

  useEffect(() => {
    const cs = getCentres();
    const ds = getDoctors();
    setCentres(cs);
    setDoctors(ds);

    const docId = searchParams.get('doctorId');
    const ctrId = searchParams.get('centreId');

    if (docId) {
      const doc = ds.find(d => d.id === docId);
      if (doc) {
        setMode('doctor-to-centre');
        setDoctorForm(f => ({
          ...f,
          selectedDoctorId: docId,
          speciality: doc.speciality,
          requiredDays: doc.requiredDays,
          timingStart: doc.requiredTimings.start,
          timingEnd: doc.requiredTimings.end,
          rentalPreference: doc.rentalPreference,
          expectedRent: String(doc.expectedRent),
        }));
      }
    }
    if (ctrId) {
      setMode('centre-to-doctor');
      setCentreForm({ selectedCentreId: ctrId });
    }
  }, [searchParams]);

  const updateDoctor = (k: string, v: unknown) =>
    setDoctorForm(f => ({ ...f, [k]: v }));

  // Pre-fill from selected doctor
  useEffect(() => {
    if (doctorForm.selectedDoctorId) {
      const doc = doctors.find(d => d.id === doctorForm.selectedDoctorId);
      if (doc) {
        setDoctorForm(f => ({
          ...f,
          speciality: doc.speciality,
          requiredDays: doc.requiredDays,
          timingStart: doc.requiredTimings.start,
          timingEnd: doc.requiredTimings.end,
          rentalPreference: doc.rentalPreference,
          expectedRent: String(doc.expectedRent),
        }));
      }
    }
  }, [doctorForm.selectedDoctorId, doctors]);

  const runMatch = useCallback(async () => {
    setLoading(true);
    setHasSearched(true);
    setResults([]);

    let raw: MatchResult[] = [];

    if (mode === 'doctor-to-centre') {
      // Build a synthetic doctor for matching
      const selectedDoc = doctors.find(d => d.id === doctorForm.selectedDoctorId);
      const syntheticDoctor: Doctor = selectedDoc
        ? { ...selectedDoc }
        : {
            id: 'temp',
            salutation: 'Dr.',
            name: 'Search Query',
            registrationNo: '',
            speciality: doctorForm.speciality,
            qualification: [],
            experienceYears: 0,
            city: '',
            pincode: '',
            state: '',
            preferredCentreTypes: [],
            requiredDays: doctorForm.requiredDays as any,
            requiredTimings: { start: doctorForm.timingStart, end: doctorForm.timingEnd },
            sessionsPerDay: 1,
            rentalPreference: doctorForm.rentalPreference as any,
            expectedRent: Number(doctorForm.expectedRent) || 0,
            phone: '',
            email: '',
            verified: false,
            createdAt: '',
          };
      raw = matchDoctorToCentres(syntheticDoctor, centres, minScore);
    } else {
      const centre = centres.find(c => c.id === centreForm.selectedCentreId);
      if (!centre) { setLoading(false); return; }
      raw = matchCentreToDoctors(centre, doctors, minScore);
    }

    setResults(raw);
    setLoading(false);

    // Fetch AI summaries for top 3
    if (raw.length > 0) {
      setAiLoading(true);
      const top3 = raw.slice(0, 3);
      const withSummaries = [...raw];

      await Promise.all(
        top3.map(async (r, i) => {
          try {
            const ctx = buildMatchContext(r);
            const res = await fetch('/api/match', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ context: ctx }),
            });
            if (res.ok) {
              const { summary } = await res.json();
              withSummaries[i] = { ...withSummaries[i], aiSummary: summary };
            }
          } catch {/* silently skip */}
        })
      );

      setResults([...withSummaries]);
      setAiLoading(false);
    }
  }, [mode, doctorForm, centreForm, centres, doctors, minScore]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-ink text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={28} className="text-gold-400" />
            <h1 className="font-display text-4xl font-bold">Smart Matching Engine</h1>
          </div>
          <p className="text-white/60 max-w-xl">
            Weighted multi-criteria scoring across specialty fit, schedule, rent compatibility,
            and timing — with AI summaries powered by Claude.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Query panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
              <div className="bg-forest-700 text-white px-4 py-3 flex items-center gap-2">
                <Search size={16} />
                <span className="font-bold text-sm">Match Criteria</span>
              </div>

              <div className="p-4 space-y-4">
                {/* Mode toggle */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200">
                  <button
                    onClick={() => { setMode('doctor-to-centre'); setHasSearched(false); }}
                    className={`flex-1 py-2 text-xs font-bold transition-all ${
                      mode === 'doctor-to-centre' ? 'bg-forest-700 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Doctor → Centres
                  </button>
                  <button
                    onClick={() => { setMode('centre-to-doctor'); setHasSearched(false); }}
                    className={`flex-1 py-2 text-xs font-bold transition-all ${
                      mode === 'centre-to-doctor' ? 'bg-forest-700 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Centre → Doctors
                  </button>
                </div>

                {mode === 'doctor-to-centre' ? (
                  <>
                    {doctors.length > 0 && (
                      <div>
                        <Label>Load Registered Doctor</Label>
                        <Select
                          value={doctorForm.selectedDoctorId}
                          onChange={e => updateDoctor('selectedDoctorId', e.target.value)}
                        >
                          <option value="">— Manual entry below —</option>
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>
                              Dr. {d.name} ({d.speciality})
                            </option>
                          ))}
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label>Specialty</Label>
                      <Select value={doctorForm.speciality} onChange={e => updateDoctor('speciality', e.target.value)}>
                        {SPECIALITIES.map(s => <option key={s}>{s}</option>)}
                      </Select>
                    </div>
                    <div>
                      <Label>Required Days</Label>
                      <MultiDay
                        value={doctorForm.requiredDays}
                        onChange={v => updateDoctor('requiredDays', v)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>From</Label>
                        <input type="time" value={doctorForm.timingStart}
                          onChange={e => updateDoctor('timingStart', e.target.value)}
                          className="w-full px-2 py-2 rounded-xl border border-gray-200 text-sm" />
                      </div>
                      <div>
                        <Label>To</Label>
                        <input type="time" value={doctorForm.timingEnd}
                          onChange={e => updateDoctor('timingEnd', e.target.value)}
                          className="w-full px-2 py-2 rounded-xl border border-gray-200 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label>Rental Type</Label>
                      <Select value={doctorForm.rentalPreference} onChange={e => updateDoctor('rentalPreference', e.target.value)}>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily / Session</option>
                        <option value="monthly">Monthly</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Expected Rent (₹)</Label>
                      <input type="number" placeholder="0" value={doctorForm.expectedRent}
                        onChange={e => updateDoctor('expectedRent', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    </div>
                  </>
                ) : (
                  <div>
                    <Label>Select Centre</Label>
                    {centres.length === 0 ? (
                      <p className="text-xs text-gray-400">No centres registered yet.</p>
                    ) : (
                      <Select
                        value={centreForm.selectedCentreId}
                        onChange={e => setCentreForm({ selectedCentreId: e.target.value })}
                      >
                        <option value="">— Select a centre —</option>
                        {centres.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({CENTRE_TYPE_LABELS[c.type]})
                          </option>
                        ))}
                      </Select>
                    )}
                  </div>
                )}

                {/* Min score filter */}
                <div>
                  <Label>Minimum Score: {minScore}</Label>
                  <input type="range" min={0} max={70} step={5} value={minScore}
                    onChange={e => setMinScore(Number(e.target.value))}
                    className="w-full accent-forest-700" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>All</span><span>≥40 Fair</span><span>≥60 Good</span>
                  </div>
                </div>

                <button
                  onClick={runMatch}
                  disabled={loading || (mode === 'centre-to-doctor' && !centreForm.selectedCentreId)}
                  className="w-full py-3 rounded-xl bg-saffron-500 text-white font-bold text-sm hover:bg-saffron-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                  {loading ? 'Matching…' : 'Run Match'}
                </button>
              </div>
            </div>
          </div>

          {/* Results panel */}
          <div className="lg:col-span-2">
            {!hasSearched ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-2xl bg-forest-50 border-2 border-forest-200 flex items-center justify-center mb-4">
                  <ArrowLeftRight size={28} className="text-forest-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">
                  Configure & Run Match
                </h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Set your criteria on the left and click "Run Match" to see ranked results with AI analysis.
                </p>
              </div>
            ) : loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-40 rounded-2xl shimmer" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle size={40} className="text-gray-300 mb-3" />
                <h3 className="font-display text-xl font-semibold text-gray-600 mb-2">No matches found</h3>
                <p className="text-gray-400 text-sm">
                  Try lowering the minimum score or broadening your criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-ink">
                      {results.length} Match{results.length !== 1 ? 'es' : ''} Found
                    </h2>
                    <p className="text-sm text-gray-500">
                      Ranked by composite score · Top 3 include AI analysis
                    </p>
                  </div>
                  {aiLoading && (
                    <div className="flex items-center gap-1.5 text-xs text-forest-700 bg-forest-50 border border-forest-200 rounded-full px-3 py-1.5">
                      <Sparkles size={12} className="animate-pulse" />
                      Generating AI summaries…
                    </div>
                  )}
                </div>

                {/* Score legend */}
                <div className="flex gap-3 mb-4 flex-wrap">
                  {[
                    { label: 'Excellent ≥80', color: '#1a6b42' },
                    { label: 'Good ≥60', color: '#339966' },
                    { label: 'Fair ≥40', color: '#f0b429' },
                    { label: 'Low <40', color: '#e05c1a' },
                  ].map(t => (
                    <div key={t.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.label}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {results.map((r, i) => (
                    <div key={`${r.centre.id}-${r.doctor.id}`} className="stagger-card">
                      <MatchCard result={r} mode={mode} rank={i + 1} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <RefreshCw size={32} className="animate-spin text-forest-600" />
      </div>
    }>
      <MatchesContent />
    </Suspense>
  );
}
