import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Building2,
  AlertTriangle,
  Send,
  BedDouble,
  Sparkles,
} from 'lucide-react';
import { BedMatrixEntity, Hospital, Incident } from '../../types';

interface BedReservationModalProps {
  bed: BedMatrixEntity | null;
  hospital: Hospital | null;
  incidents: Incident[];
  onClose: () => void;
  onReservationSuccess: () => void;
}

export const BedReservationModal: React.FC<BedReservationModalProps> = ({
  bed,
  hospital,
  incidents,
  onClose,
  onReservationSuccess,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [patientName, setPatientName] = useState('Prakash Rao (Severe Trauma)');
  const [officerName, setOfficerName] = useState('Inspector Vijay Gaikwad');
  const [doctorNotified, setDoctorNotified] = useState(
    hospital?.emergencyCoordinatorName || 'Dr. Rajesh Patil (Senior Registrar)'
  );
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeInc = incidents.find((i) => i.id === selectedIncidentId);

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bed || !hospital) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyId: activeInc?.id || 'inc-0101',
          emergencyCode: activeInc?.code || 'INC-2026-NGP-089',
          hospitalId: hospital.id,
          bedId: bed.id,
          bedNumber: bed.bedNumber,
          department: bed.department,
          bedType: bed.bedType,
          patientName,
          reservedByOfficer: officerName,
          attendingDoctorNotified: doctorNotified,
          durationMinutes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Double booking conflict detected or server error.');
      } else {
        onReservationSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Network error performing bed reservation');
    } finally {
      setLoading(false);
    }
  };

  if (!bed || !hospital) return null;

  return (
    <div className="fixed inset-0 bg-white/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full border border-stone-200 shadow-lg shadow-stone-300/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-white text-stone-900 p-4 flex items-center justify-between border-b border-stone-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <BedDouble className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block">
                Automatic Emergency Bed Reservation
              </span>
              <h3 className="text-base font-extrabold text-stone-900">
                Lock & Pre-Alert Reservation Gateway
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-900 font-extrabold text-sm p-1 rounded hover:bg-stone-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-600 p-3 text-xs text-rose-900 font-bold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-xs text-rose-400 underline font-bold">
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleCreateReservation} className="p-5 space-y-4">
          {/* Target Facility Summary Card */}
          <div className="bg-cream border border-stone-200 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-400" />
                {hospital.name} ({hospital.districtName})
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-400 border border-emerald-300 px-2 py-0.5 rounded">
                Target Bed: {bed.bedNumber} ({bed.bedType})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 border-t border-stone-200 pt-2 font-medium">
              <div>
                <span className="text-stone-500 font-bold block text-[10px]">Location</span>
                {bed.building} • {bed.floor} • {bed.ward}
              </div>
              <div>
                <span className="text-stone-500 font-bold block text-[10px]">Trauma Level</span>
                {hospital.traumaLevel} ({hospital.emergencyDeptStatus} ER)
              </div>
            </div>
          </div>

          {/* Active Emergency Incident Selector */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              Link to Emergency Incident Code:
            </label>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-200 text-stone-900 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  [{inc.code}] {inc.title} ({inc.districtName} — {inc.priority} Priority)
                </option>
              ))}
            </select>
          </div>

          {/* Patient Details & Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Patient Name & Primary Diagnosis:
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Suresh Patil (Multiple Rib Fractures)"
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 text-stone-900 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Reserving Dispatch Officer:
              </label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 text-stone-900 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Attending Doctor & Expiry Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Attending Doctor Notified (Pre-Alert):
              </label>
              <input
                type="text"
                required
                value={doctorNotified}
                onChange={(e) => setDoctorNotified(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 text-stone-900 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Reservation Hold Timer (Minutes):
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 text-stone-900 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
              >
                <option value={15}>15 Minutes (Critical Speed)</option>
                <option value={30}>30 Minutes (Standard Golden Hour)</option>
                <option value={45}>45 Minutes (Inter-District Transport)</option>
                <option value={60}>60 Minutes (Long Corridor)</option>
              </select>
            </div>
          </div>

          {/* Guarantee Lock Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 font-medium flex items-start space-x-2">
            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block text-amber-950">
                Lock Guarantee & Automatic Expiration:
              </span>
              Reserving this bed instantly locks status to <span className="font-bold">Reserved</span> in the state matrix for {durationMinutes} minutes. An automated pre-alert signal will trigger at the hospital casualty desk.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 border-t border-stone-200 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-100 rounded border border-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-extrabold text-stone-900 bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {loading ? (
                'Reserving & Sending Pre-Alert...'
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Confirm 30-Min Bed Reservation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
