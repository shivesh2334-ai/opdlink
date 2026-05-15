'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveDoctor, generateId } from '@/lib/storage';
import type { Doctor, CentreType, RentalPeriod, DayOfWeek } from '@/lib/types';
import {
  CENTRE_TYPE_LABELS, DAYS_OF_WEEK, SPECIALITIES,
  QUALIFICATIONS, INDIAN_STATES,
} from '@/lib/constants';
import { CheckCircle2, User2 } from 'lucide-react';

const STEPS = ['Personal Details', 'Specialty & Experience', 'OPD Requirements', 'Contact'];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i < current ? 'bg-saffron-500 text-white' :
            i === current ? 'bg-saffron-600 text-white ring-4 ring-saffron-200' :
            'bg-gray-200 text-gray-500'
          }`}>
            {i < current ? <CheckCircle2 size={16} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-8 h-0.5 ${i < current ? 'bg-saffron-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

const Label = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
    {children} {req && <span className="text-red-400">*</span>}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 transition-all ${props.className ?? ''}`}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select
    {...props}
    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800"
  >
    {props.children}
  </select>
);

const toggleArr = <T,>(arr: T[], val: T): T[] =>
  arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

export default function RegisterDoctorPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    salutation: 'Dr.' as Doctor['salutation'],
    name: '',
    registrationNo: '',
    city: '', pincode: '', state: 'Delhi',
    bio: '',
    speciality: 'Cardiology',
    qualification: [] as string[],
    experienceYears: 5,
    preferredCentreTypes: [] as CentreType[],
    requiredDays: [] as DayOfWeek[],
    timingStart: '09:00',
    timingEnd: '13:00',
    sessionsPerDay: 1,
    rentalPreference: 'daily' as RentalPeriod,
    expectedRent: '',
    phone: '',
    email: '',
  });

  const update = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    setSubmitting(true);
    const doctor: Doctor = {
      id: generateId('d'),
      salutation: form.salutation,
      name: form.name,
      registrationNo: form.registrationNo,
      speciality: form.speciality,
      qualification: form.qualification,
      experienceYears: form.experienceYears,
      city: form.city,
      pincode: form.pincode,
      state: form.state,
      bio: form.bio,
      preferredCentreTypes: form.preferredCentreTypes,
      requiredDays: form.requiredDays,
      requiredTimings: { start: form.timingStart, end: form.timingEnd },
      sessionsPerDay: form.sessionsPerDay,
      rentalPreference: form.rentalPreference,
      expectedRent: Number(form.expectedRent),
      phone: form.phone,
      email: form.email,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    saveDoctor(doctor);
    setSuccess(true);
    setTimeout(() => router.push('/matches?doctorId=' + doctor.id), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 text-center shadow-lg max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-saffron-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Profile Registered!</h2>
          <p className="text-gray-500 text-sm">Finding your best OPD matches now…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink text-white py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-saffron-500 flex items-center justify-center">
              <User2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">Join as a Doctor</h1>
              <p className="text-white/60 text-sm">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
            </div>
          </div>
          <StepIndicator current={step} total={STEPS.length} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* Step 0: Personal */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Salutation</Label>
                  <Select value={form.salutation} onChange={e => update('salutation', e.target.value)}>
                    <option>Dr.</option>
                    <option>Prof. Dr.</option>
                    <option>Dr. (Prof.)</option>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label req>Full Name</Label>
                  <Input placeholder="As per NMC registration" value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
              </div>
              <div>
                <Label req>NMC Registration Number</Label>
                <Input placeholder="e.g. DL-2012-11234" value={form.registrationNo} onChange={e => update('registrationNo', e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label req>City</Label>
                  <Input placeholder="New Delhi" value={form.city} onChange={e => update('city', e.target.value)} />
                </div>
                <div>
                  <Label req>Pincode</Label>
                  <Input maxLength={6} placeholder="110001" value={form.pincode} onChange={e => update('pincode', e.target.value)} />
                </div>
                <div>
                  <Label>State</Label>
                  <Select value={form.state} onChange={e => update('state', e.target.value)}>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </Select>
                </div>
              </div>
              <div>
                <Label>Short Bio</Label>
                <textarea
                  rows={3}
                  placeholder="Your clinical focus, notable experience, achievements…"
                  value={form.bio}
                  onChange={e => update('bio', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 1: Specialty */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <Label req>Medical Specialty</Label>
                <Select value={form.speciality} onChange={e => update('speciality', e.target.value)}>
                  {SPECIALITIES.map(s => <option key={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label req>Qualifications</Label>
                <div className="flex flex-wrap gap-2">
                  {QUALIFICATIONS.map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => update('qualification', toggleArr(form.qualification, q))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        form.qualification.includes(q)
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label req>Years of Experience</Label>
                <Input
                  type="number" min={0} max={50}
                  value={form.experienceYears}
                  onChange={e => update('experienceYears', Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Preferred Centre Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(CENTRE_TYPE_LABELS) as [CentreType, string][]).map(([t, l]) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update('preferredCentreTypes', toggleArr(form.preferredCentreTypes, t))}
                      className={`p-2.5 rounded-xl border-2 text-xs font-semibold text-left transition-all ${
                        form.preferredCentreTypes.includes(t)
                          ? 'border-saffron-500 bg-saffron-50 text-saffron-800'
                          : 'border-gray-200 text-gray-600 hover:border-saffron-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: OPD Requirements */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label req>Required OPD Days</Label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS_OF_WEEK.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => update('requiredDays', toggleArr(form.requiredDays, d))}
                      className={`day-btn ${form.requiredDays.includes(d) ? 'selected' : ''}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label req>Required OPD Timing</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Start time</p>
                    <Input type="time" value={form.timingStart} onChange={e => update('timingStart', e.target.value)} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">End time</p>
                    <Input type="time" value={form.timingEnd} onChange={e => update('timingEnd', e.target.value)} />
                  </div>
                </div>
              </div>
              <div>
                <Label>Sessions Per Day</Label>
                <Input
                  type="number" min={1} max={4}
                  value={form.sessionsPerDay}
                  onChange={e => update('sessionsPerDay', Number(e.target.value))}
                />
              </div>
              <div>
                <Label req>Rental Preference</Label>
                <div className="flex gap-3">
                  {(['hourly', 'daily', 'monthly'] as RentalPeriod[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => update('rentalPreference', r)}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${
                        form.rentalPreference === r
                          ? 'border-saffron-500 bg-saffron-50 text-saffron-800'
                          : 'border-gray-200 text-gray-500 hover:border-saffron-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label req>Expected Rent (₹ per {form.rentalPreference})</Label>
                <Input
                  type="number"
                  placeholder={form.rentalPreference === 'hourly' ? 'e.g. 800' : form.rentalPreference === 'daily' ? 'e.g. 3000' : 'e.g. 30000'}
                  value={form.expectedRent}
                  onChange={e => update('expectedRent', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <Label req>Phone Number</Label>
                <Input type="tel" placeholder="10-digit mobile" maxLength={10} value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>
              <div>
                <Label req>Email Address</Label>
                <Input type="email" placeholder="doctor@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
              <div className="p-4 rounded-xl bg-saffron-50 border border-saffron-200">
                <p className="text-xs text-saffron-800 font-medium">
                  Your NMC registration ({form.registrationNo}) will be verified within 48 hours.
                  Upon verification, your profile is visible to healthcare centres.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30"
            >
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-400 transition-colors"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-forest-700 text-white text-sm font-bold hover:bg-forest-600 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Saving…' : 'Register & Find Matches ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
