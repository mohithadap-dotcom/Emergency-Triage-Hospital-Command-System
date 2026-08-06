import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Building2,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertOctagon,
  Wrench,
  Ban,
  Sparkles,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { BedMatrixEntity, Hospital, District, BedType, BedStatus } from '../../types';

interface BedMatrixViewProps {
  hospitals: Hospital[];
  districts: District[];
  selectedDistrict: string;
  onReserveBedRequest?: (bed: BedMatrixEntity) => void;
}

export const BedMatrixView: React.FC<BedMatrixViewProps> = ({
  hospitals,
  districts,
  selectedDistrict,
  onReserveBedRequest,
}) => {
  const [beds, setBeds] = useState<BedMatrixEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('all');
  const [selectedBedType, setSelectedBedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBedForDetail, setSelectedBedForDetail] = useState<BedMatrixEntity | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchBeds = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/beds?district=${selectedDistrict}&hospitalId=${selectedHospitalId}&type=${selectedBedType}&status=${selectedStatus}`
      );
      if (res.ok) {
        const data = await res.json();
        setBeds(data);
      }
    } catch (err) {
      console.error('Failed to load beds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, [selectedDistrict, selectedHospitalId, selectedBedType, selectedStatus]);

  const handleUpdateBedStatus = async (bedId: string, newStatus: BedStatus) => {
    setUpdatingStatus(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/beds/${bedId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          officerName: 'State Dispatch Officer',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Status update failed due to conflict');
      } else {
        fetchBeds();
        if (selectedBedForDetail && selectedBedForDetail.id === bedId) {
          setSelectedBedForDetail(data.bed);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error updating bed status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: BedStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-400 border-emerald-300 font-bold';
      case 'Reserved':
        return 'bg-amber-100 text-amber-900 border-amber-200 font-bold animate-pulse';
      case 'Occupied':
        return 'bg-rose-100 text-rose-400 border-rose-200 font-bold';
      case 'Cleaning':
        return 'bg-sky-100 text-sky-400 border-sky-300 font-medium';
      case 'Maintenance':
        return 'bg-purple-100 text-purple-400 border-purple-300 font-medium';
      case 'Blocked':
        return 'bg-stone-100 text-stone-600 border-stone-200 font-medium';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const filteredBeds = beds.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.hospitalName.toLowerCase().includes(q) ||
      b.building.toLowerCase().includes(q) ||
      b.ward.toLowerCase().includes(q) ||
      b.bedNumber.toLowerCase().includes(q) ||
      b.department.toLowerCase().includes(q) ||
      (b.currentPatientName && b.currentPatientName.toLowerCase().includes(q))
    );
  });

  const filteredHospitalsList =
    selectedDistrict === 'all'
      ? hospitals
      : hospitals.filter((h) => h.districtId === selectedDistrict);

  return (
    <div className="space-y-4">
      {/* Filter Header Toolbar */}
      <div className="bg-white text-stone-900 rounded-lg p-3.5 border border-stone-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-emerald-400" />
            Interactive Multi-Hospital Bed Matrix (Building/Floor/Ward/Bed Telemetry)
          </h3>
          <p className="text-[11px] text-stone-500">
            Real-time visual bed inventory tracking with lock-protection against double booking and instant reservation capabilities.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search ward, bed, patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-stone-100 border border-stone-300 text-stone-900 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 w-full"
            />
          </div>

          {/* Hospital Picker */}
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-stone-100 border border-stone-300 text-stone-900 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 font-semibold"
          >
            <option value="all">All Hospitals ({filteredHospitalsList.length})</option>
            {filteredHospitalsList.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          {/* Bed Type */}
          <select
            value={selectedBedType}
            onChange={(e) => setSelectedBedType(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-stone-100 border border-stone-300 text-stone-900 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 font-semibold"
          >
            <option value="all">All Bed Types</option>
            <option value="ICU">ICU Beds</option>
            <option value="Ventilator">Ventilator Beds</option>
            <option value="Emergency">Emergency Resuscitation</option>
            <option value="General">General Wards</option>
            <option value="Isolation">Isolation / Burn</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-stone-100 border border-stone-300 text-stone-900 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <button
            onClick={fetchBeds}
            className="p-1.5 bg-stone-100 hover:bg-slate-700 border border-stone-300 text-stone-600 rounded transition-colors"
            title="Refresh Bed Matrix"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Conflict Error Message Banner */}
      {errorMsg && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-3 rounded-r-md text-xs text-rose-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="font-bold">{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-xs text-rose-400 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Bed Matrix Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 text-xs font-mono">
          Syncing bed matrix hierarchy from hospital gateways...
        </div>
      ) : filteredBeds.length === 0 ? (
        <div className="p-12 text-center bg-cream border border-stone-200 rounded-lg text-stone-500 text-xs font-medium">
          No beds found matching the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredBeds.map((bed) => (
            <div
              key={bed.id}
              onClick={() => setSelectedBedForDetail(bed)}
              className="bg-white border border-stone-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer relative group flex flex-col justify-between space-y-2.5"
            >
              {/* Header: Hospital & Bed Number */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 truncate max-w-[160px]">
                    {bed.hospitalName}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded border ${getStatusBadge(bed.status)}`}
                  >
                    {bed.status}
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <div className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-stone-500" />
                    <span>{bed.bedNumber}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                    {bed.bedType}
                  </span>
                </div>

                <div className="text-[11px] text-stone-500 font-medium mt-1">
                  {bed.building} • {bed.floor}
                </div>
                <div className="text-[10px] text-stone-500">
                  {bed.ward} ({bed.department})
                </div>
              </div>

              {/* Patient / Reservation Detail */}
              {bed.status === 'Occupied' && (
                <div className="bg-rose-50 border border-rose-200 rounded p-1.5 text-[10px] text-rose-900 font-medium truncate">
                  <span className="font-bold">Patient:</span> {bed.currentPatientName || 'Admitted Patient'}
                </div>
              )}

              {bed.status === 'Reserved' && (
                <div className="bg-amber-50 border border-amber-200 rounded p-1.5 text-[10px] text-amber-900 font-medium">
                  <span className="font-bold">Reserved by:</span> {bed.reservedByOfficer || 'Dispatch Officer'}
                </div>
              )}

              {bed.status === 'Available' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded p-1.5 text-[10px] text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Ready for Dispatch</span>
                  {onReserveBedRequest && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReserveBedRequest(bed);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold px-2 py-0.5 rounded text-[10px] transition-colors"
                    >
                      Reserve Bed
                    </button>
                  )}
                </div>
              )}

              <div className="text-[9px] text-stone-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1.5">
                <span>Room {bed.roomNumber}</span>
                <span>Synced {bed.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bed Detail Modal */}
      {selectedBedForDetail && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-stone-200 shadow-lg shadow-stone-300/40 overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  {selectedBedForDetail.hospitalName}
                </span>
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-sky-400" />
                  {selectedBedForDetail.bedNumber} — {selectedBedForDetail.bedType} Bed
                </h3>
              </div>
              <button
                onClick={() => setSelectedBedForDetail(null)}
                className="text-stone-500 hover:text-stone-500 font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-cream p-3 rounded-lg border border-stone-200">
              <div>
                <span className="text-stone-500 font-bold block text-[10px]">Building & Floor</span>
                <span className="font-semibold text-stone-800">
                  {selectedBedForDetail.building} ({selectedBedForDetail.floor})
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-bold block text-[10px]">Ward & Department</span>
                <span className="font-semibold text-stone-800">
                  {selectedBedForDetail.ward} / {selectedBedForDetail.department}
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-bold block text-[10px]">Room Number</span>
                <span className="font-mono font-bold text-stone-900">
                  {selectedBedForDetail.roomNumber}
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-bold block text-[10px]">Current Status</span>
                <span
                  className={`inline-block text-[10px] px-2 py-0.5 rounded border mt-0.5 ${getStatusBadge(
                    selectedBedForDetail.status
                  )}`}
                >
                  {selectedBedForDetail.status}
                </span>
              </div>
            </div>

            {/* Quick Status Setter */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-900 block">Override Bed Operational Status:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['Available', 'Reserved', 'Occupied', 'Cleaning', 'Maintenance', 'Blocked'] as BedStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      disabled={updatingStatus}
                      onClick={() => handleUpdateBedStatus(selectedBedForDetail.id, st)}
                      className={`px-2.5 py-1.5 rounded border text-xs font-bold transition-all ${
                        selectedBedForDetail.status === st
                          ? 'bg-white text-stone-900 border-stone-200 ring-2 ring-amber-400'
                          : 'bg-cream text-stone-800 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-stone-200 pt-3">
              {selectedBedForDetail.status === 'Available' && onReserveBedRequest && (
                <button
                  onClick={() => {
                    const b = selectedBedForDetail;
                    setSelectedBedForDetail(null);
                    onReserveBedRequest(b);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold px-4 py-2 rounded text-xs transition-colors"
                >
                  Reserve This Bed Now
                </button>
              )}
              <button
                onClick={() => setSelectedBedForDetail(null)}
                className="bg-stone-100 hover:bg-stone-100 text-stone-800 font-bold px-4 py-2 rounded text-xs border border-stone-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
