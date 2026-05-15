'use client';

import { useEffect, useState } from 'react';
import { getDoctors } from '@/lib/storage';
import type { Doctor } from '@/lib/types';
import { SPECIALITIES } from '@/lib/constants';
import DoctorCard from '@/components/DoctorCard';
import Link from 'next/link';
import { Search, Plus, SlidersHorizontal } from 'lucide-react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [rentalFilter, setRentalFilter] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDoctors(getDoctors());
    setMounted(true);
  }, []);

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.speciality.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q);
    const matchSpecialty = specialtyFilter === 'all' || d.speciality === specialtyFilter;
    const matchRental = rentalFilter === 'all' || d.rentalPreference === rentalFilter;
    return matchSearch && matchSpecialty && matchRental;
  });

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold mb-2">Verified Doctors</h1>
              <p className="text-white/60">
                {mounted ? `${doctors.length} doctors registered` : 'Loading…'} — seeking OPD placements
              </p>
            </div>
            <Link
              href="/doctors/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-saffron-500 text-white rounded-xl font-bold hover:bg-saffron-400 transition-colors"
            >
              <Plus size={18} /> Join as Doctor
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, city…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={specialtyFilter}
              onChange={e => setSpecialtyFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700"
            >
              <option value="all">All Specialties</option>
              {SPECIALITIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <select
            value={rentalFilter}
            onChange={e => setRentalFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700"
          >
            <option value="all">Any Rental</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {!mounted ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-64 rounded-2xl shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              {doctors.length === 0 ? 'No doctors registered yet.' : 'No doctors match your criteria.'}
            </p>
            <Link href="/doctors/register" className="text-saffron-600 font-semibold hover:underline">
              Register as a doctor →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing {filtered.length} of {doctors.length} doctors
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(d => (
                <div key={d.id} className="stagger-card">
                  <DoctorCard doctor={d} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
