import React, { useState, useEffect } from 'react';
import {
  Building2,
  BedDouble,
  Activity,
  Droplet,
  BrainCircuit,
  BellRing,
  ArrowLeftRight,
  Columns3,
  BarChart3,
  Search,
  Filter,
  PhoneCall,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Hospital, District, Incident, BedMatrixEntity, BedReservation } from '../types';
import { BedMatrixView } from './hospital/BedMatrixView';
import { BedReservationModal } from './hospital/BedReservationModal';
import { AiResourceAllocationModal } from './hospital/AiResourceAllocationModal';
import { InterHospitalTransferView } from './hospital/InterHospitalTransferView';
import { HospitalComparisonView } from './hospital/HospitalComparisonView';
import { ResourceShortageAlertsView } from './hospital/ResourceShortageAlertsView';
import { HospitalResourceAnalyticsView } from './hospital/HospitalResourceAnalyticsView';
import { HospitalAdminDashboardView } from './hospital/HospitalAdminDashboardView';
import { StateHospitalCommandCenterView } from './hospital/StateHospitalCommandCenterView';

interface HospitalNetworkProps {
  hospitals: Hospital[];
  districts: District[];
  incidents?: Incident[];
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  onSwitchPortal?: (portal: 'GOVERNMENT' | 'HOSPITAL' | 'AMBULANCE' | 'DOCTOR_WORKSPACE') => void;
}

export const HospitalNetworkView: React.FC<HospitalNetworkProps> = ({
  hospitals,
  districts,
  incidents = [],
  selectedDistrict,
  onSelectDistrict,
  onSwitchPortal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'COORDINATION_NETWORK' | 'HOSPITAL_ADMIN' | 'REGISTRY' | 'BED_MATRIX' | 'RESERVATIONS' | 'TRANSFERS' | 'SHORTAGE_ALERTS' | 'COMPARISON' | 'ANALYTICS'
  >('COORDINATION_NETWORK');


  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [erFilter, setErFilter] = useState<string>('all');
  const [traumaFilter, setTraumaFilter] = useState<string>('all');

  // Modals
  const [showAiModal, setShowAiModal] = useState(false);
  const [reservationModalBed, setReservationModalBed] = useState<BedMatrixEntity | null>(null);
  const [reservationModalHospital, setReservationModalHospital] = useState<Hospital | null>(null);

  // Active Reservations Store Feed
  const [reservations, setReservations] = useState<BedReservation[]>([]);

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleOpenReservationModalForHospital = (hospital: Hospital) => {
    // Construct dummy bed matrix object if specific bed not picked from matrix
    const tempBed: BedMatrixEntity = {
      id: `bed-quick-${Date.now()}`,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      building: 'Emergency Casualty Block',
      floor: 'Ground Floor',
      ward: 'Red Resuscitation Bay',
      department: 'Emergency Medicine',
      roomNumber: 'BAY-101',
      bedNumber: `BAY-${Math.floor(Math.random() * 8) + 1}`,
      bedType: 'ICU',
      status: 'Available',
      lastUpdated: 'Just now',
    };
    setReservationModalBed(tempBed);
    setReservationModalHospital(hospital);
  };

  const handleUpdateReservationAction = async (id: string, action: 'CONFIRM' | 'CANCEL') => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchReservations();
      }
    } catch (err) {
      console.error('Failed updating reservation:', err);
    }
  };

  const filteredHospitals = hospitals.filter((h) => {
    const matchesDistrict = selectedDistrict === 'all' || h.districtId === selectedDistrict;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || h.type === typeFilter;
    const matchesEr = erFilter === 'all' || h.emergencyDeptStatus === erFilter;
    const matchesTrauma = traumaFilter === 'all' || h.traumaLevel === traumaFilter;
    return matchesDistrict && matchesSearch && matchesType && matchesEr && matchesTrauma;
  });

  const getErBadge = (status: Hospital['emergencyDeptStatus']) => {
    switch (status) {
      case 'FULL':
        return 'bg-rose-600 text-stone-900 font-extrabold animate-pulse';
      case 'DIVERTING':
        return 'bg-amber-600 text-stone-900 font-extrabold';
      default:
        return 'bg-emerald-100 text-emerald-400 border-emerald-300 font-bold';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 space-y-4">
      {/* Top Banner & Module Navigation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-sky-100 text-sky-400 border border-sky-300 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              Phase 3 Statewide Resource Command Center
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              {hospitals.length} Participating Hospitals Online
            </span>
          </div>

          <h2 className="text-xl font-black text-stone-900 flex items-center gap-2 mt-1">
            <Building2 className="w-6 h-6 text-sky-400" />
            Maharashtra Multi-Hospital Resource Operations Platform
          </h2>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-stone-900 font-extrabold text-xs px-3.5 py-2 rounded-lg shadow flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-100 fill-amber-300" />
            Gemini AI Resource Allocation Engine
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center space-x-1 border-b border-stone-200 overflow-x-auto pb-1 text-xs font-bold text-stone-600">
        <button
          onClick={() => setActiveSubTab('COORDINATION_NETWORK')}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'COORDINATION_NETWORK'
              ? 'bg-white text-stone-900 border-b-2 border-sky-400'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Statewide Hospital Coordination Network</span>
          <span className="bg-emerald-500 text-stone-900 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
            Phase 10 Live
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('HOSPITAL_ADMIN')}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'HOSPITAL_ADMIN'
              ? 'bg-white text-stone-900 border-b-2 border-sky-400'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Hospital Admin Portal</span>
          <span className="bg-sky-500 text-stone-900 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
            Phase 9
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('REGISTRY')}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'REGISTRY'
              ? 'bg-white text-stone-900 border-b-2 border-sky-400'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Network Registry ({filteredHospitals.length})
        </button>

        <button
          onClick={() => setActiveSubTab('BED_MATRIX')}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'BED_MATRIX'
              ? 'bg-white text-stone-900 border-b-2 border-sky-400'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <BedDouble className="w-3.5 h-3.5" />
          Interactive Bed Matrix
        </button>

        <button
          onClick={() => setActiveSubTab('RESERVATIONS')}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'RESERVATIONS'
              ? 'bg-white text-stone-900 border-b-2 border-sky-400'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Bed Reservations ({reservations.filter((r) => r.status === 'RESERVED').length})
        </button>

        <button
          onClick={() => setActiveSubTab('TRANSFERS')}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'TRANSFERS'
              ? 'bg-white text-stone-900 border-b-2 border-sky-400'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Inter-Hospital Transfers
        </button>

        <button
          onClick={() => setActiveSubTab('SHORTAGE_ALERTS')}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'SHORTAGE_ALERTS'
              ? 'bg-white text-stone-900 border-b-2 border-sky-400'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          Shortage Alerts
        </button>

        <button
          onClick={() => setActiveSubTab('COMPARISON')}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'COMPARISON'
              ? 'bg-white text-stone-900 border-b-2 border-sky-400'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Columns3 className="w-3.5 h-3.5" />
          Hospital Comparison Matrix
        </button>

        <button
          onClick={() => setActiveSubTab('ANALYTICS')}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'ANALYTICS'
              ? 'bg-white text-stone-900 border-b-2 border-sky-400'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Resource Analytics
        </button>
      </div>

      {/* SUB-TAB -1: STATEWIDE MULTI-HOSPITAL COORDINATION NETWORK (PHASE 10) */}
      {activeSubTab === 'COORDINATION_NETWORK' && (
        <StateHospitalCommandCenterView
          hospitals={hospitals}
          districts={districts}
          incidents={incidents}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={onSelectDistrict}
        />
      )}

      {/* SUB-TAB 0: INDEPENDENT HOSPITAL ADMIN PORTAL BANNER */}
      {activeSubTab === 'HOSPITAL_ADMIN' && (
        <div className="bg-white text-stone-900 rounded-2xl p-6 shadow-lg shadow-stone-300/40 border border-stone-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 px-3 py-1 rounded-full uppercase">
                Enterprise Multi-Portal Architecture
              </span>
              <h3 className="text-xl font-black tracking-tight text-stone-900">
                Independent Hospital Operational Resource Portal
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                In strict compliance with state security guidelines, Government EOC Officers and Hospital Administrators operate on completely separated applications sharing real-time synchronized backend APIs (`/api/hospital/*`).
              </p>
            </div>

            {onSwitchPortal && (
              <button
                onClick={() => onSwitchPortal('HOSPITAL')}
                className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 shrink-0 border border-sky-300"
              >
                <Building2 className="w-4 h-4" />
                <span>Launch Standalone Hospital Portal</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium border-t border-stone-200 pt-4">
            <div className="bg-stone-100/60 p-4 rounded-xl border border-stone-300/60 space-y-1">
              <strong className="text-sky-400 font-bold block">1. Independent Auth & RBAC</strong>
              <p className="text-stone-600 text-[11px]">
                Hospital staff log in via isolated hospital portals with hardware MFA & 5 distinct role permissions.
              </p>
            </div>

            <div className="bg-stone-100/60 p-4 rounded-xl border border-stone-300/60 space-y-1">
              <strong className="text-emerald-400 font-bold block">2. Operational Resource Control</strong>
              <p className="text-stone-600 text-[11px]">
                Hospitals manage 6-level bed matrices, ICU beds, ventilator fleets, medical equipment & staff duty rosters.
              </p>
            </div>

            <div className="bg-stone-100/60 p-4 rounded-xl border border-stone-300/60 space-y-1">
              <strong className="text-amber-400 font-bold block">3. State Real-Time Sync</strong>
              <p className="text-stone-600 text-[11px]">
                Single-save resource updates instantly synchronize across State EOC, Ambulance Dispatch & Gemini AI Routing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: NETWORK REGISTRY (CARDS + DETAILED TABLE) */}
      {activeSubTab === 'REGISTRY' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-cream border border-stone-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search input */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium text-stone-900 w-full"
                />
              </div>

              {/* District Filter */}
              <select
                value={selectedDistrict}
                onChange={(e) => onSelectDistrict(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded font-bold text-stone-800"
              >
                <option value="all">All Pilot Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded font-bold text-stone-800"
              >
                <option value="all">All Facility Types</option>
                <option value="GOVERNMENT">Government Hospitals</option>
                <option value="EMPANELLED_PRIVATE">Empanelled Private</option>
              </select>

              {/* ER Status Filter */}
              <select
                value={erFilter}
                onChange={(e) => setErFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded font-bold text-stone-800"
              >
                <option value="all">All Emergency Statuses</option>
                <option value="OPEN">OPEN for Triage</option>
                <option value="FULL">FULL / Diverting</option>
                <option value="DIVERTING">DIVERTING Non-Red</option>
              </select>

              {/* Trauma Level Filter */}
              <select
                value={traumaFilter}
                onChange={(e) => setTraumaFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded font-bold text-stone-800"
              >
                <option value="all">All Trauma Levels</option>
                <option value="Level 1 Trauma">Level 1 Trauma</option>
                <option value="Level 2 Trauma">Level 2 Trauma</option>
                <option value="Level 3 Trauma">Level 3 Trauma</option>
              </select>
            </div>
          </div>

          {/* Hospital Network Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm hover:border-sky-300 transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        hosp.operationalStatus === 'GREEN'
                          ? 'bg-emerald-100 text-emerald-400 border-emerald-300'
                          : hosp.operationalStatus === 'YELLOW'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-rose-100 text-rose-400 border-rose-200'
                      }`}
                    >
                      {hosp.operationalStatus} STATUS
                    </span>

                    <span className={`text-[10px] px-2 py-0.5 rounded border ${getErBadge(hosp.emergencyDeptStatus)}`}>
                      ER {hosp.emergencyDeptStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-stone-900 mt-2">{hosp.name}</h3>
                  <div className="text-[11px] text-stone-500 font-medium">
                    {hosp.districtName} District • {hosp.traumaLevel}
                  </div>
                </div>

                {/* Live Resource Counters */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-cream p-2.5 rounded-lg border border-stone-200">
                  <div>
                    <span className="text-stone-500 font-bold block text-[10px]">ICU Beds</span>
                    <span className="font-black text-stone-900">
                      {hosp.availableIcuBeds} / {hosp.totalIcuBeds} Free
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 font-bold block text-[10px]">Ventilators</span>
                    <span className="font-black text-stone-900">
                      {hosp.availableVentilators} Ready
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 font-bold block text-[10px]">Emergency Beds</span>
                    <span className="font-black text-stone-900">
                      {hosp.availableEmergencyBeds} Ready
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 font-bold block text-[10px]">Doctors On Duty</span>
                    <span className="font-bold text-stone-900">
                      {hosp.doctorsOnDuty} Staff
                    </span>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                  <a
                    href={`tel:${hosp.emergencyPhone}`}
                    className="text-stone-500 hover:text-stone-900 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-stone-500" />
                    {hosp.emergencyPhone}
                  </a>

                  <button
                    onClick={() => handleOpenReservationModalForHospital(hosp)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold px-3 py-1 rounded text-[11px] transition-colors"
                  >
                    Reserve Bed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INTERACTIVE BED MATRIX */}
      {activeSubTab === 'BED_MATRIX' && (
        <BedMatrixView
          hospitals={hospitals}
          districts={districts}
          selectedDistrict={selectedDistrict}
          onReserveBedRequest={(bed) => {
            const h = hospitals.find((item) => item.id === bed.hospitalId) || hospitals[0];
            setReservationModalBed(bed);
            setReservationModalHospital(h);
          }}
        />
      )}

      {/* SUB-TAB 3: BED RESERVATIONS FEED */}
      {activeSubTab === 'RESERVATIONS' && (
        <div className="space-y-4">
          <div className="bg-white text-stone-900 rounded-lg p-3.5 border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Active Emergency Bed Reservations Registry
              </h3>
              <p className="text-[11px] text-stone-500">
                Lock status tracking with 30-minute expiration countdowns and attending physician notifications.
              </p>
            </div>
            <button
              onClick={fetchReservations}
              className="p-1.5 bg-stone-100 hover:bg-slate-700 border border-stone-300 text-stone-600 rounded transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="p-3">Hospital & Bed</th>
                  <th className="p-3">Emergency Code</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Reserved By</th>
                  <th className="p-3">Doctor Notified</th>
                  <th className="p-3">Expires At</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-medium text-stone-800">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-500 text-xs">
                      No active bed reservations currently recorded.
                    </td>
                  </tr>
                ) : (
                  reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-cream transition-colors">
                      <td className="p-3 font-extrabold text-stone-900">
                        {r.hospitalName}
                        <span className="block text-[10px] font-mono text-sky-400 font-normal">
                          {r.bedNumber} ({r.bedType})
                        </span>
                      </td>

                      <td className="p-3 font-mono font-bold text-stone-600">{r.emergencyCode}</td>

                      <td className="p-3 font-bold text-stone-900">{r.patientName}</td>

                      <td className="p-3 text-stone-500">{r.reservedByOfficer}</td>

                      <td className="p-3 text-stone-500">{r.attendingDoctorNotified}</td>

                      <td className="p-3 font-mono text-amber-400 font-bold">
                        {new Date(r.expiresAt).toLocaleTimeString()}
                      </td>

                      <td className="p-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                            r.status === 'RESERVED'
                              ? 'bg-amber-100 text-amber-900 border-amber-200 animate-pulse'
                              : r.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-400 border-emerald-300'
                              : 'bg-stone-100 text-stone-500 border-stone-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        {r.status === 'RESERVED' && (
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleUpdateReservationAction(r.id, 'CONFIRM')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold px-2 py-1 rounded text-[10px]"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateReservationAction(r.id, 'CANCEL')}
                              className="bg-stone-100 hover:bg-stone-100 text-stone-800 font-bold px-2 py-1 rounded text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INTER-HOSPITAL TRANSFERS */}
      {activeSubTab === 'TRANSFERS' && (
        <InterHospitalTransferView
          hospitals={hospitals}
          incidents={incidents}
          selectedDistrict={selectedDistrict}
        />
      )}

      {/* SUB-TAB 5: SHORTAGE ALERTS */}
      {activeSubTab === 'SHORTAGE_ALERTS' && (
        <ResourceShortageAlertsView districts={districts} selectedDistrict={selectedDistrict} />
      )}

      {/* SUB-TAB 6: COMPARISON MATRIX */}
      {activeSubTab === 'COMPARISON' && <HospitalComparisonView hospitals={hospitals} />}

      {/* SUB-TAB 7: RESOURCE ANALYTICS */}
      {activeSubTab === 'ANALYTICS' && <HospitalResourceAnalyticsView />}

      {/* AI Allocation Engine Modal */}
      {showAiModal && (
        <AiResourceAllocationModal
          incidents={incidents}
          hospitals={hospitals}
          selectedDistrict={selectedDistrict}
          onClose={() => setShowAiModal(false)}
          onSelectHospitalForReservation={(hospId) => {
            const targetHosp = hospitals.find((h) => h.id === hospId);
            if (targetHosp) {
              handleOpenReservationModalForHospital(targetHosp);
            }
          }}
        />
      )}

      {/* Bed Reservation Modal */}
      {reservationModalBed && reservationModalHospital && (
        <BedReservationModal
          bed={reservationModalBed}
          hospital={reservationModalHospital}
          incidents={incidents}
          onClose={() => {
            setReservationModalBed(null);
            setReservationModalHospital(null);
          }}
          onReservationSuccess={() => {
            fetchReservations();
          }}
        />
      )}
    </div>
  );
};
