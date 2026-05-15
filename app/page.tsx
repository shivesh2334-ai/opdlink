import Link from 'next/link';
import {
  Building2, Stethoscope, Zap, ShieldCheck, ArrowRight,
  MapPin, CheckCircle, Clock, IndianRupee
} from 'lucide-react';
import { CENTRE_TYPE_LABELS, CENTRE_TYPE_DESCRIPTIONS } from '@/lib/constants';

const STATS = [
  { value: '500+', label: 'Healthcare Centres' },
  { value: '1,200+', label: 'Verified Doctors' },
  { value: '94%', label: 'Match Satisfaction' },
  { value: '48h', label: 'Avg. Placement Time' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Register',
    desc: 'Centres list available OPD space with timings and rates. Doctors register with specialty and requirements.',
    icon: Building2,
    color: 'bg-forest-600',
  },
  {
    step: '02',
    title: 'Algorithm Matches',
    desc: 'Our weighted scoring engine ranks centres by specialty fit, schedule overlap, rent compatibility and more.',
    icon: Zap,
    color: 'bg-saffron-500',
  },
  {
    step: '03',
    title: 'AI Validates',
    desc: 'Claude AI reviews top matches and provides a plain-English summary of fit and any caveats.',
    icon: ShieldCheck,
    color: 'bg-indigo-600',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink overflow-hidden relative">
        <div className="absolute inset-0 bg-mesh-green opacity-70" />
        <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            India's OPD Space Marketplace
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Your OPD Space,<br />
            <span className="text-forest-400">Perfectly Matched</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect verified doctors with healthcare centres — single clinics, polyclinics,
            nursing homes, and hospital OPDs — using AI-powered matching.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-saffron-500 text-white rounded-xl font-bold text-base hover:bg-saffron-400 transition-colors shadow-lg"
            >
              Find Your Match <ArrowRight size={18} />
            </Link>
            <Link
              href="/centres/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 border border-white/30 text-white rounded-xl font-bold text-base hover:bg-white/20 transition-colors"
            >
              List OPD Space
            </Link>
            <Link
              href="/doctors/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 border border-white/30 text-white rounded-xl font-bold text-base hover:bg-white/20 transition-colors"
            >
              Join as Doctor
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-white">{s.value}</div>
                <div className="text-white/60 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Centre types */}
      <section className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-ink mb-3">
              Every Type of OPD Space
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              From compact single clinics to large hospital OPDs — we support all models with
              hourly, daily, and monthly rental options.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {(Object.entries(CENTRE_TYPE_LABELS) as [string, string][]).map(([type, label]) => (
              <div key={type} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-forest-300 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center group-hover:bg-forest-100 transition-colors">
                    <Building2 size={22} className="text-forest-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink text-lg mb-1">{label}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {CENTRE_TYPE_DESCRIPTIONS[type as keyof typeof CENTRE_TYPE_DESCRIPTIONS]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-ink mb-3">
              How Matching Works
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              A transparent, explainable algorithm — not a black box.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="text-center">
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <step.icon size={26} className="text-white" />
                </div>
                <div className="text-xs font-bold text-gray-400 tracking-widest mb-1">{step.step}</div>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Scoring breakdown */}
          <div className="bg-ink rounded-2xl p-8 text-white">
            <h3 className="font-display text-2xl font-semibold mb-2 text-center">Matching Score Criteria</h3>
            <p className="text-white/60 text-sm text-center mb-6">
              Every match is scored 0–100 across five weighted criteria
            </p>
            <div className="grid sm:grid-cols-5 gap-4">
              {[
                { label: 'Specialty Fit',    pts: 35, color: '#1a6b42', icon: Stethoscope },
                { label: 'Days Overlap',     pts: 25, color: '#339966', icon: CheckCircle },
                { label: 'Rent Compatibility', pts: 20, color: '#f0b429', icon: IndianRupee },
                { label: 'Timing Overlap',   pts: 15, color: '#3b82f6', icon: Clock },
                { label: 'Rental Type',      pts:  5, color: '#8b5cf6', icon: MapPin },
              ].map(c => (
                <div key={c.label} className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: `${c.color}33` }}
                  >
                    <c.icon size={20} style={{ color: c.color }} />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: c.color }}>{c.pts}</div>
                  <div className="text-xs text-white/50 mt-0.5 font-medium">pts</div>
                  <div className="text-xs text-white/70 mt-1 leading-tight">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-forest-700">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready to find your match?
          </h2>
          <p className="text-white/70 mb-8">
            Join thousands of doctors and healthcare centres already on OPDLink.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/matches"
              className="px-8 py-3.5 bg-white text-forest-800 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Find Matches Now
            </Link>
            <Link
              href="/centres/register"
              className="px-8 py-3.5 bg-white/10 border border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
            >
              Register Your Centre
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
