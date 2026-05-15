'use client';

import { useEffect, useState } from 'react';
import { getCentres } from '@/lib/storage';
import type { HealthcareCentre, CentreType } from '@/lib/types';
import { CENTRE_TYPE_LABELS } from '@/lib/constants';
import CentreCard from '@/components/CentreCard';
import Link from 'next/link';
import { Search, Plus, SlidersHorizontal } from 'lucide-react';

const ALL_TYPES: CentreType[] = ['single_clinic', 'polyclinic', 'opd_nursing_home', 'hospital_opd'];

export default function CentresPage() {
  const [centres, setCentres] = useState<HealthcareCentre[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<CentreType | 'all'>('all');
  const [rentalFilter, setRentalFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCentres(getCentres());
    setMounted(true);
  }, []);

  const filtered = centres.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.specialitiesAvailable.some(s => s.toLowerCase().includes(q));
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const matchRental = rentalFilter === 'all' || c.rentalModel.includes(rentalFilter as any);
    return matchSearch && matchType && matchRental;
  });

  return (
    <div className="min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-ink text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold mb-2">Healthcare Centres</h1>
              <p className="text-white/60">
                {mounted ? `${centres.length} centres registered` : 'Loading...'} — browse and find OPD spaces
              </p>
            </div>
            <Link
              href="/centres/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-saffron-500 text-white rounded-xl font-bold hover:bg-saffron-400 transition-colors"
            >
              <Plus size={18} /> List Your Space
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-48 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, specialty…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white transition-colors"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:bg-white"
            >
              <option value="all">All Types</option>
              {ALL_TYPES.map(t => (
                <option key={t} value={t}>{CENTRE_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {/* Rental filter */}
          <select
            value={rentalFilter}
            onChange={e => setRentalFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:bg-white"
          >
            <option value="all">All Rental Types</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Results */}
        {!mounted ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 rounded-2xl shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No centres match your criteria.</p>
            <Link href="/centres/register" className="text-forest-700 font-semibold hover:underline">
              Register the first one →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing {filtered.length} of {centres.length} centres
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(c => (
                <div key={c.id} className="stagger-card">
                  <CentreCard centre={c} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
