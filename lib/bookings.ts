'use client';

import type { Booking, BookingStatus } from './types';

const BOOKINGS_KEY = 'opdlink_bookings';

function isBrowser() {
  return typeof window !== 'undefined';
}

// ── Bookings ─────────────────────────────────────────────────────────

export function getBookings(): Booking[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

export function getBookingsByDoctor(doctorId: string): Booking[] {
  return getBookings().filter(b => b.doctorId === doctorId);
}

export function getBookingsByCentre(centreId: string): Booking[] {
  return getBookings().filter(b => b.centreId === centreId);
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find(b => b.id === id);
}

export function saveBooking(booking: Booking): void {
  if (!isBrowser()) return;
  const existing = getBookings();
  const idx = existing.findIndex(b => b.id === booking.id);
  if (idx >= 0) {
    existing[idx] = booking;
  } else {
    existing.push(booking);
  }
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(existing));
}

export function updateBookingStatus(id: string, status: BookingStatus): void {
  if (!isBrowser()) return;
  const booking = getBookingById(id);
  if (booking) {
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    saveBooking(booking);
  }
}

export function deleteBooking(id: string): void {
  if (!isBrowser()) return;
  const existing = getBookings().filter(b => b.id !== id);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(existing));
}

// ── Helpers ──────────────────────────────────────────────────────────

export function generateBookingId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
