'use client';

import { Booking, BookingStatus } from '@/lib/types';
import { Calendar, Clock, DollarSign, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  doctorName?: string;
  centreName?: string;
  onStatusChange?: (bookingId: string, status: BookingStatus) => void;
}

export default function BookingCard({
  booking,
  doctorName = 'Doctor',
  centreName = 'Centre',
  onStatusChange,
}: BookingCardProps) {
  const statusConfig: Record<BookingStatus, { color: string; icon: React.ReactNode; label: string }> = {
    pending: {
      color: 'bg-amber-100 border-amber-300 text-amber-800',
      icon: <AlertCircle size={18} />,
      label: 'Pending Confirmation',
    },
    confirmed: {
      color: 'bg-green-100 border-green-300 text-green-800',
      icon: <CheckCircle2 size={18} />,
      label: 'Confirmed',
    },
    cancelled: {
      color: 'bg-red-100 border-red-300 text-red-800',
      icon: <XCircle size={18} />,
      label: 'Cancelled',
    },
    completed: {
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      icon: <CheckCircle2 size={18} />,
      label: 'Completed',
    },
  };

  const status = statusConfig[booking.status];
  const startDate = new Date(booking.startDate).toLocaleDateString('en-IN');
  const endDate = booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-IN') : 'Ongoing';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with status */}
      <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${status.color}`}>
        <div className="flex items-center gap-2">
          {status.icon}
          <span className="font-semibold text-sm">{status.label}</span>
        </div>
        <span className="text-xs font-mono text-gray-600 bg-white/40 px-2.5 py-1 rounded">{booking.id.slice(0, 8)}</span>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Parties */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Doctor</p>
            <p className="text-sm font-semibold text-gray-900">{doctorName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Healthcare Centre</p>
            <p className="text-sm font-semibold text-gray-900">{centreName}</p>
          </div>
        </div>

        {/* Booking details grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Start Date */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2.5">
            <Calendar size={16} className="text-forest-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Start Date</p>
              <p className="text-sm font-semibold text-gray-900">{startDate}</p>
            </div>
          </div>

          {/* End Date */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2.5">
            <Calendar size={16} className="text-forest-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">End Date</p>
              <p className="text-sm font-semibold text-gray-900">{endDate}</p>
            </div>
          </div>

          {/* Time Slot */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2.5">
            <Clock size={16} className="text-saffron-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Time Slot</p>
              <p className="text-sm font-semibold text-gray-900">{booking.timingStart} - {booking.timingEnd}</p>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2.5">
            <DollarSign size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Rental Type</p>
              <p className="text-sm font-semibold text-gray-900 capitalize">{booking.rentalPeriod}</p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-saffron-50 border border-saffron-200 rounded-lg p-4 mb-6">
          <p className="text-xs text-saffron-700 font-semibold uppercase tracking-wide mb-1">Booking Amount</p>
          <p className="text-2xl font-bold text-saffron-700">₹{booking.amount.toLocaleString('en-IN')}</p>
        </div>

        {/* Days */}
        {booking.requiredDays.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Days of Week</p>
            <div className="flex flex-wrap gap-1.5">
              {booking.requiredDays.map(day => (
                <span key={day} className="bg-forest-100 text-forest-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-500 font-semibold mb-1">Notes</p>
            <p className="text-sm text-gray-700">{booking.notes}</p>
          </div>
        )}

        {/* Actions */}
        {booking.status === 'pending' && onStatusChange && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(booking.id, 'confirmed')}
              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => onStatusChange(booking.id, 'cancelled')}
              className="flex-1 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Meta info */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
          <span>Created: {new Date(booking.createdAt).toLocaleDateString('en-IN')}</span>
          {booking.confirmedAt && <span>Confirmed: {new Date(booking.confirmedAt).toLocaleDateString('en-IN')}</span>}
        </div>
      </div>
    </div>
  );
}
