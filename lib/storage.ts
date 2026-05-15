'use client';

import type { HealthcareCentre, Doctor } from './types';
import { DEMO_CENTRES } from './constants';

const CENTRES_KEY = 'opdlink_centres';
const DOCTORS_KEY = 'opdlink_doctors';

function isBrowser() {
  return typeof window !== 'undefined';
}

// ── Centres ────────────────────────────────────────────────────────────────

export function getCentres(): HealthcareCentre[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CENTRES_KEY);
    if (!raw) {
      // seed demo data on first load
      const seeded = DEMO_CENTRES as HealthcareCentre[];
      localStorage.setItem(CENTRES_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as HealthcareCentre[];
  } catch {
    return [];
  }
}

export function saveCentre(centre: HealthcareCentre): void {
  if (!isBrowser()) return;
  const existing = getCentres();
  const idx = existing.findIndex(c => c.id === centre.id);
  if (idx >= 0) {
    existing[idx] = centre;
  } else {
    existing.push(centre);
  }
  localStorage.setItem(CENTRES_KEY, JSON.stringify(existing));
}

export function deleteCentre(id: string): void {
  if (!isBrowser()) return;
  const existing = getCentres().filter(c => c.id !== id);
  localStorage.setItem(CENTRES_KEY, JSON.stringify(existing));
}

// ── Doctors ────────────────────────────────────────────────────────────────

export function getDoctors(): Doctor[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(DOCTORS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Doctor[];
  } catch {
    return [];
  }
}

export function saveDoctor(doctor: Doctor): void {
  if (!isBrowser()) return;
  const existing = getDoctors();
  const idx = existing.findIndex(d => d.id === doctor.id);
  if (idx >= 0) {
    existing[idx] = doctor;
  } else {
    existing.push(doctor);
  }
  localStorage.setItem(DOCTORS_KEY, JSON.stringify(existing));
}

export function deleteDoctor(id: string): void {
  if (!isBrowser()) return;
  const existing = getDoctors().filter(d => d.id !== id);
  localStorage.setItem(DOCTORS_KEY, JSON.stringify(existing));
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
