'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveCentre, generateId } from '@/lib/storage';
import type { HealthcareCentre, CentreType, RentalPeriod, DayOfWeek } from '@/lib/types';
import {
  CENTRE_TYPE_LABELS, DAYS_OF_WEEK, SPECIALITIES,
  FACILITIES, INDIAN_STATES, CAMP_FREQUENCY_LABELS,
} from '@/lib/constants';
import { CheckCircle2, Building2 } from 'lucide-react';

const STEPS = ['Centre Info', 'Space & Rates', 'Availability', 'Facilities', 'Contact'];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i < current ? 'bg-forest-600 text-white' :
            i === current ? 'bg-forest-700 text-white ring-4 ring-forest-200' :
            'bg-gray-200 text-gray-500'
          }`}>
            {i < current ? <CheckCircle2 size={16} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-8 h-0.5 ${i < current ? 'bg-forest-600' : 'bg-gray-200'}`} />
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
    className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 transition-all placeholder:text-gray-400 ${props.className ?? ''}`}
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

export default function RegisterCentrePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '', type: 'single_clinic' as CentreType,
    address: '', city: '', pincode: '', state: 'Delhi',
    registrationNo: '', description: '',
    totalRooms: 1,
    rentalModel: [] as RentalPeriod[],
    hourlyRate: '', dailyRate: '', monthlyRate: '',
    availableDays: [] as DayOfWeek[],
    timingStart: '09:00', timingEnd: '18:00',
    specialitiesAvailable: [] as string[],
    facilities: [] as string[],
    contactName: '', contactPhone: '', contactEmail: '',
    isRemote: false, isMonthlyClinc: false, isHealthCamp: false,
    campFrequency: 'monthly', campLocations: '',
  });

  const update = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const toggleArr = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const handleSubmit = () => {
    setSubmitting(true);
    const centre: HealthcareCentre = {
      id: generateId('c'),
      name: form.name,
      type: form.type,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      state: form.state,
      registrationNo: form.registrationNo,
      description: form.description,
      totalRooms: form.totalRooms,
      specialitiesAvailable: form.specialitiesAvailable,
      rentalModel: form.rentalModel,
      hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
      dailyRate: form.dailyRate ? Number(form.dailyRate) : undefined,
      monthlyRate: form.monthlyRate ? Number(form.monthlyRate) : undefined,
      availableDays: form.availableDays,
      availableTimings: [{ start: form.timingStart, end: form.timingEnd }],
      facilities: form.facilities,
      contactName: form.contactName,
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail,
      verified: false,
      createdAt: new Date().toISOString(),
      isRemote: form.isRemote,
      isMonthlyClinc: form.isMonthlyClinc,
      isHealthCamp: form.isHealthCamp,
      campFrequency: form.isHealthCamp ? form.campFrequency : undefined,
      campLocations: form.isHealthCamp && form.campLocations ? form.campLocations.split(',').map(l => l.trim()) : undefined,
    };
    saveCentre(centre);
    setSuccess(true);
    setTimeout(() => router.push('/centres'), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 text-center shadow-lg max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-forest-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Centre Registered!</h2>
          <p className="text-gray-500 text-sm">Redirecting to centres directory…</p>
        </div>
      </div>
    );
  }

  const isRemoteType = form.type === 'remote_clinic';
  const isHealthCampType = form.type === 'health_camp';

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-ink text-white py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">Register Healthcare Centre</h1>
              <p className="text-white/60 text-sm">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
            </div>
          </div>
          <StepIndicator current={step} total={STEPS.length} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* Step 0: Centre Info */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <Label req>Centre Name</Label>
                <Input placeholder="e.g. Medicity Polyclinic" value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div>
                <Label req>Centre Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(CENTRE_TYPE_LABELS) as [CentreType, string][]).map(([type, label]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update('type', type)}
                      className={`p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                        form.type === type
                          ? 'border-forest-600 bg-forest-50 text-forest-800'
                          : 'border-gray-200 text-gray-600 hover:border-forest-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {!isRemoteType && !isHealthCampType && (
                <>
                  <div>
                    <Label req>Address</Label>
                    <Input placeholder="Flat/Plot, Street, Locality" value={form.address} onChange={e => update('address', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <Label req>City</Label>
                      <Input placeholder="New Delhi" value={form.city} onChange={e => update('city', e.target.value)} />
                    </div>
                    <div>
                      <Label req>Pincode</Label>
                      <Input placeholder="110001" maxLength={6} value={form.pincode} onChange={e => update('pincode', e.target.value)} />
                    </div>
                    <div>
                      <Label req>State</Label>
                      <Select value={form.state} onChange={e => update('state', e.target.value)}>
                        {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                      </Select>
                    </div>
                  </div>
                </>
              )}
              {isRemoteType && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-800">Remote clinics operate via telemedicine. Address and pincode are not required.</p>
                </div>
              )}
              {isHealthCampType && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <p className="text-xs text-green-800">Health camps operate at multiple community locations. Main office details can be provided.</p>
                </div>
              )}
              <div>
                <Label>Registration Number</Label>
                <Input placeholder="e.g. DH-2021-4521" value={form.registrationNo} onChange={e => update('registrationNo', e.target.value)} />
              </div>
              <div>
                <Label>Brief Description</Label>
                <textarea
                  rows={3}
                  placeholder="Describe your centre, infrastructure, and unique features…"
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 1: Space & Rates */}
          {step === 1 && (
            <div className="space-y-5">
              {!isRemoteType && !isHealthCampType && (
                <div>
                  <Label req>Total OPD Rooms Available</Label>
                  <Input type="number" min={1} max={50} value={form.totalRooms} onChange={e => update('totalRooms', Number(e.target.value))} />
                </div>
              )}
              <div>
                <Label req>Rental Models Offered</Label>
                <div className="flex gap-3">
                  {(['hourly', 'daily', 'monthly'] as RentalPeriod[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        if (isRemoteType || isHealthCampType) {
                          if (r === 'monthly') {
                            update('rentalModel', [r]);
                          }
                        } else {
                          update('rentalModel', toggleArr(form.rentalModel, r));
                        }
                      }}
                      disabled={isRemoteType || isHealthCampType ? r !== 'monthly' : false}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${
                        form.rentalModel.includes(r)
                          ? 'border-forest-600 bg-forest-50 text-forest-800'
                          : 'border-gray-200 text-gray-500 hover:border-forest-300'
                      } ${(isRemoteType || isHealthCampType) && r !== 'monthly' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              {form.rentalModel.includes('hourly') && (
                <div>
                  <Label>Hourly Rate (₹)</Label>
                  <Input type="number" placeholder="e.g. 800" value={form.hourlyRate} onChange={e => update('hourlyRate', e.target.value)} />
                </div>
              )}
              {form.rentalModel.includes('daily') && (
                <div>
                  <Label>Daily / Session Rate (₹)</Label>
                  <Input type="number" placeholder="e.g. 3000" value={form.dailyRate} onChange={e => update('dailyRate', e.target.value)} />
                </div>
              )}
              {form.rentalModel.includes('monthly') && (
                <div>
                  <Label>Monthly Rate (₹)</Label>
                  <Input type="number" placeholder={isRemoteType ? "e.g. 15000" : isHealthCampType ? "e.g. 8000" : "e.g. 30000"} value={form.monthlyRate} onChange={e => update('monthlyRate', e.target.value)} />
                </div>
              )}
              <div>
                <Label req>Specialities You Can Accommodate</Label>
                <p className="text-xs text-gray-500 mb-2">Select all specialities for which space/setup is available</p>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {SPECIALITIES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => update('specialitiesAvailable', toggleArr(form.specialitiesAvailable, s))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        form.specialitiesAvailable.includes(s)
                          ? 'bg-forest-600 border-forest-600 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-forest-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Availability */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label req>Available Days</Label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS_OF_WEEK.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => update('availableDays', toggleArr(form.availableDays, d))}
                      className={`day-btn ${form.availableDays.includes(d) ? 'selected' : ''}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label req>Available Time Window</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Opens at</p>
                    <Input type="time" value={form.timingStart} onChange={e => update('timingStart', e.target.value)} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Closes at</p>
                    <Input type="time" value={form.timingEnd} onChange={e => update('timingEnd', e.target.value)} />
                  </div>
                </div>
              </div>
              {isHealthCampType && (
                <div>
                  <Label>Camp Frequency</Label>
                  <Select value={form.campFrequency} onChange={e => update('campFrequency', e.target.value)}>
                    {Object.entries(CAMP_FREQUENCY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </Select>
                </div>
              )}
              {isHealthCampType && (
                <div>
                  <Label>Camp Locations (comma-separated)</Label>
                  <Input placeholder="e.g. Sector 8, Dwarka Market, Rohini Square" value={form.campLocations} onChange={e => update('campLocations', e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Facilities */}
          {step === 3 && (
            <div>
              <Label>Available Facilities & Equipment</Label>
              <p className="text-xs text-gray-500 mb-3">Select all that are available at your centre</p>
              <div className="flex flex-wrap gap-2">
                {FACILITIES.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => update('facilities', toggleArr(form.facilities, f))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      form.facilities.includes(f)
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <Label req>Contact Person Name</Label>
                <Input placeholder="Full name" value={form.contactName} onChange={e => update('contactName', e.target.value)} />
              </div>
              <div>
                <Label req>Phone Number</Label>
                <Input type="tel" placeholder="10-digit mobile" maxLength={10} value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} />
              </div>
              <div>
                <Label req>Email Address</Label>
                <Input type="email" placeholder="contact@yourcentre.in" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} />
              </div>
              <div className="p-4 rounded-xl bg-forest-50 border border-forest-200">
                <p className="text-xs text-forest-800 font-medium">
                  By registering, your centre will be listed in OPDLink's directory and made available for doctor matching.
                  Verification typically completes within 48 hours.
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
                className="px-6 py-2.5 rounded-xl bg-forest-700 text-white text-sm font-bold hover:bg-forest-600 transition-colors"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-400 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Registering…' : 'Register Centre ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
