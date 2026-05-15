'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Stethoscope } from 'lucide-react';

const NAV_LINKS = [
  { href: '/centres', label: 'Centres' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/matches', label: '✦ Find Match' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center group-hover:bg-forest-500 transition-colors">
            <Stethoscope size={18} className="text-white" />
          </div>
          <span className="font-display text-2xl text-white font-semibold tracking-tight">
            OPD<span className="text-forest-400">Link</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                pathname.startsWith(link.href)
                  ? 'bg-forest-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-white/20 mx-2" />
          <Link
            href="/centres/register"
            className="px-4 py-2 rounded-lg bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-400 transition-colors"
          >
            List Space
          </Link>
          <Link
            href="/doctors/register"
            className="px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors ml-1"
          >
            Join as Doctor
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-ink border-t border-white/10 px-4 pb-4 flex flex-col gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold ${
                pathname.startsWith(link.href)
                  ? 'bg-forest-600 text-white'
                  : 'text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <Link
            href="/centres/register"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-lg bg-saffron-500 text-white text-sm font-bold text-center"
          >
            List Your Space
          </Link>
          <Link
            href="/doctors/register"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-lg border border-white/30 text-white text-sm font-semibold text-center"
          >
            Join as Doctor
          </Link>
        </div>
      )}
    </nav>
  );
}
