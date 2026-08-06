import React, { useState } from 'react';
import {
  Truck,
  PhoneCall,
  MapPin,
  Radio,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Plus,
  Zap,
  Activity,
  User,
  Gauge,
  AlertTriangle,
  Flame,
  Building2,
  SlidersHorizontal,
  RefreshCw,
  Navigation,
} from 'lucide-react';
import { Ambulance, District, AmbulanceMission, Incident, Hospital } from '../types';
import { SmartDispatchEngine } from './SmartDispatchEngine';
import { DriverWorkspaceView } from './DriverWorkspaceView';

interface AmbulanceFleetProps {
  ambulances: Ambulance[];
  districts: District[];
  incidents?: Incident[];
  hospitals?: Hospital[];
  missions?: AmbulanceMission[];
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  onRefreshFleet?: () => void;
}

export const AmbulanceFleetView: React.FC<AmbulanceFleetProps> = ({
  ambulances,
  districts,
  incidents = [],
  hospitals = [],
  missions = [],
  selectedDistrict,
  onSelectDistrict,
  onRefreshFleet,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'registry' | 'smart-dispatch' | 'driver-workspace'>('registry');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);

  // New Unit Form State
  const [newRegNo, setNewRegNo] = useState('');
  const [newType, setNewType] = useState<'ALS' | 'BLS' | 'Cardiac Care' | 'Neonatal ICU'>('ALS');
  const [newDistrictId, setNewDistrictId] = useState('nagpur');
  const [newBaseHospital, setNewBaseHospital] = useState('District General Hospital');
  const [newDriverName, setNewDriverName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newParamedicName, setNewParamedicName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filtered List
  const filteredAmbulances = ambulances.filter((a) => {
    const matchesDistrict = selectedDistrict === 'all' || a.districtId === selectedDistrict;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    return matchesDistrict && matchesStatus && matchesType;
  });

  // Calculate Fleet KPIs
  const totalUnits = ambulances.length;
  const availableUnits = ambulances.filter((a) => a.status === 'AVAILABLE').length;
  const dispatchedUnits = ambulances.filter((a) => a.status === 'DISPATCHED' || a.status === 'IN_TRANSIT').length;
  const transportingUnits = ambulances.filter((a) => a.status === 'TRANSPORTING').length;
  const readinessRate = totalUnits > 0 ? Math.round((availableUnits / totalUnits) * 100) : 0;

  const getStatusBadge = (status: Ambulance['status']) => {
    switch (status) {
      case 'DISPATCHED':
        return 'bg-amber-500 text-slate-950 font-black animate-pulse';
      case 'IN_TRANSIT':
        return 'bg-sky-600 text-stone-900 font-black';
      case 'TRANSPORTING':
        return 'bg-purple-600 text-stone-900 font-black animate-pulse';
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-400 border-emerald-300 font-bold';
      case 'MAINTENANCE':
        return 'bg-rose-100 text-rose-400 border-rose-200 font-bold';
      default:
        return 'bg-stone-100 text-stone-600 font-semibold';
    }
  };

  // Register New Unit Handler
  const handleRegisterUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNo: newRegNo,
          type: newType,
          districtId: newDistrictId,
          baseHospital: newBaseHospital,
          driverName: newDriverName || 'Emergency Driver',
          phone: newPhone || '+91 108 108 108',
          paramedicName: newParamedicName || 'Emergency Paramedic',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowRegisterModal(false);
        setNewRegNo('');
        if (onRefreshFleet) onRefreshFleet();
      }
    } catch (err) {
      console.error('Error registering ambulance:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Update Vehicle Status Handler
  const handleUpdateStatus = async (ambulanceId: string, newStatus: Ambulance['status']) => {
    try {
      await fetch(`/api/fleet/${ambulanceId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (onRefreshFleet) onRefreshFleet();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-4 space-y-4">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-400" />
            Maharashtra Emergency Medical Services (MEMS 108) Fleet Command Platform
          </h2>
          <p className="text-xs text-stone-500">
            Real-time GPS telemetry, ALS (Advanced Life Support) ICU units, Gemini AI dispatching & driver navigation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeSubTab === 'registry' && (
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-md shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register New 108 Unit</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center space-x-1 border-b border-stone-200 pb-2 text-xs">
        <button
          onClick={() => setActiveSubTab('registry')}
          className={`px-3 py-1.5 rounded-md font-extrabold flex items-center gap-1.5 ${
            activeSubTab === 'registry'
              ? 'bg-sky-600 text-stone-900 shadow'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Fleet Registry & Status</span>
        </button>

        <button
          onClick={() => setActiveSubTab('smart-dispatch')}
          className={`px-3 py-1.5 rounded-md font-extrabold flex items-center gap-1.5 ${
            activeSubTab === 'smart-dispatch'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Zap className="w-4 h-4 text-slate-950" />
          <span>AI Smart Dispatcher</span>
        </button>

        <button
          onClick={() => setActiveSubTab('driver-workspace')}
          className={`px-3 py-1.5 rounded-md font-extrabold flex items-center gap-1.5 ${
            activeSubTab === 'driver-workspace'
              ? 'bg-emerald-600 text-stone-900 shadow'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>108 Driver Mobile Console</span>
        </button>
      </div>

      {activeSubTab === 'smart-dispatch' && (
        <SmartDispatchEngine
          incidents={incidents}
          ambulances={ambulances}
          hospitals={hospitals}
          districts={districts}
          onDispatchAssigned={() => {
            if (onRefreshFleet) onRefreshFleet();
          }}
        />
      )}

      {activeSubTab === 'driver-workspace' && (
        <DriverWorkspaceView
          missions={missions}
          ambulances={ambulances}
          onMissionStageUpdated={() => {
            if (onRefreshFleet) onRefreshFleet();
          }}
        />
      )}

      {activeSubTab === 'registry' && (
        <>

      {/* Fleet Executive Readiness Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white text-stone-900 p-3.5 rounded-lg">
        <div className="border-r border-stone-200 pr-2">
          <span className="text-[10px] font-bold text-stone-500 font-mono uppercase">Total Registered Units</span>
          <div className="text-xl font-black text-stone-900 font-mono mt-0.5">{totalUnits} Units</div>
          <span className="text-[10px] text-sky-400">Statewide Network</span>
        </div>

        <div className="border-r border-stone-200 pr-2">
          <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase">Available & Ready</span>
          <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">{availableUnits}</div>
          <span className="text-[10px] text-emerald-300">{readinessRate}% Readiness Rate</span>
        </div>

        <div className="border-r border-stone-200 pr-2">
          <span className="text-[10px] font-bold text-amber-400 font-mono uppercase">Dispatched / En-Route</span>
          <div className="text-xl font-black text-amber-400 font-mono mt-0.5">{dispatchedUnits + transportingUnits}</div>
          <span className="text-[10px] text-amber-100">Active Response Runs</span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-sky-400 font-mono uppercase">Avg Dispatch Response</span>
          <div className="text-xl font-black text-sky-300 font-mono mt-0.5">6.8 MIN</div>
          <span className="text-[10px] text-stone-500">Target &lt; 8.0 Min</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-cream p-2.5 rounded-lg border border-stone-200 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-stone-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> District:
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="px-2 py-1 text-xs bg-white border border-stone-200 rounded font-semibold text-stone-800"
            >
              <option value="all">All Pilot Districts</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-stone-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 text-xs bg-white border border-stone-200 rounded font-semibold text-stone-800"
            >
              <option value="all">All Statuses</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="DISPATCHED">DISPATCHED</option>
              <option value="IN_TRANSIT">IN_TRANSIT</option>
              <option value="TRANSPORTING">TRANSPORTING</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-stone-600">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2 py-1 text-xs bg-white border border-stone-200 rounded font-semibold text-stone-800"
            >
              <option value="all">All Types</option>
              <option value="ALS">ALS (Advanced Life Support)</option>
              <option value="BLS">BLS (Basic Life Support)</option>
              <option value="Cardiac Care">Cardiac Care ICU</option>
              <option value="Neonatal ICU">Neonatal ICU</option>
            </select>
          </div>
        </div>

        <span className="text-stone-500 font-mono text-[11px]">
          Showing <strong>{filteredAmbulances.length}</strong> of {totalUnits} ambulances
        </span>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredAmbulances.map((amb) => (
          <div
            key={amb.id}
            className="bg-cream/90 rounded-lg border border-stone-200 p-3.5 flex flex-col justify-between hover:border-sky-500 transition-all shadow-2xs space-y-3"
          >
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-mono font-black text-stone-900 text-sm bg-white px-2 py-0.5 rounded border border-stone-200">
                  {amb.registrationNo}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${getStatusBadge(amb.status)}`}>
                  {amb.status}
                </span>
              </div>

              {/* Fuel Level & Telemetry Bar */}
              <div className="mt-2.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 font-semibold flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-stone-500" /> Fuel Level:
                  </span>
                  <span className="font-mono font-bold text-stone-800">{amb.fuelLevel ?? 100}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      (amb.fuelLevel ?? 100) > 50
                        ? 'bg-emerald-500'
                        : (amb.fuelLevel ?? 100) > 20
                        ? 'bg-amber-500'
                        : 'bg-rose-600 animate-pulse'
                    }`}
                    style={{ width: `${amb.fuelLevel ?? 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-stone-600 pt-1">
                  <span className="text-stone-500">District Base:</span>
                  <span className="font-bold text-sky-400">{amb.districtName}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-500">Vehicle Type:</span>
                  <span className="font-bold text-amber-400 font-mono bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {amb.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-500">Base Station:</span>
                  <span className="font-bold text-stone-900 truncate max-w-[160px]">{amb.baseHospital}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-500">Driver / Phone:</span>
                  <span className="font-semibold text-stone-800">{amb.driverName}</span>
                </div>
                {amb.paramedicName && (
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="text-stone-500">Paramedic:</span>
                    <span className="font-semibold text-stone-800">{amb.paramedicName}</span>
                  </div>
                )}
              </div>

              {/* On-board Medical Equipment Badges */}
              <div className="mt-2.5 pt-2 border-t border-stone-200">
                <span className="text-[10px] text-stone-500 font-mono block mb-1">MEDICAL SUITE:</span>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {amb.equipment?.ventilator && (
                    <span className="bg-sky-100 text-sky-400 font-bold px-1.5 py-0.5 rounded border border-sky-200">
                      Ventilator
                    </span>
                  )}
                  {amb.equipment?.defibrillator && (
                    <span className="bg-emerald-100 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                      Defibrillator
                    </span>
                  )}
                  {amb.equipment?.oxygenReserve && (
                    <span className="bg-blue-100 text-blue-400 font-bold px-1.5 py-0.5 rounded border border-blue-200">
                      O2 Reserve
                    </span>
                  )}
                  {amb.equipment?.syringePump && (
                    <span className="bg-purple-100 text-purple-400 font-bold px-1.5 py-0.5 rounded border border-purple-200">
                      Syringe Pump
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions & Status Changer */}
            <div className="pt-2 mt-2 border-t border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <a
                  href={`tel:${amb.phone}`}
                  className="text-sky-400 hover:text-sky-900 font-bold flex items-center space-x-1"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                  <span>{amb.phone}</span>
                </a>

                <select
                  value={amb.status}
                  onChange={(e) => handleUpdateStatus(amb.id, e.target.value as Ambulance['status'])}
                  className="text-[11px] font-bold bg-white border border-stone-200 rounded px-1.5 py-0.5"
                >
                  <option value="AVAILABLE">Set AVAILABLE</option>
                  <option value="DISPATCHED">Set DISPATCHED</option>
                  <option value="MAINTENANCE">Set MAINTENANCE</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                  <span>Ping: {amb.lastPing}</span>
                </span>
                <span>Speed: {amb.speedKmH || 0} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register Ambulance Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-stone-200 shadow-lg shadow-stone-300/40 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-400" />
                Register New 108 Emergency Vehicle
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-stone-500 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterUnit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-600 mb-1">Vehicle Registration No (RTO)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH-31-EQ-9102"
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Vehicle Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-semibold"
                  >
                    <option value="ALS">ALS (Advanced Support)</option>
                    <option value="BLS">BLS (Basic Support)</option>
                    <option value="Cardiac Care">Cardiac Care ICU</option>
                    <option value="Neonatal ICU">Neonatal ICU</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-600 mb-1">District Base</label>
                  <select
                    value={newDistrictId}
                    onChange={(e) => setNewDistrictId(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-semibold"
                  >
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Base Hospital Station</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AIIMS Hospital Nagpur"
                  value={newBaseHospital}
                  onChange={(e) => setNewBaseHospital(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patil"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-600 mb-1">Driver Hotline</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98230 00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Assigned Medical Paramedic</label>
                <input
                  type="text"
                  placeholder="e.g. Nurse Sunita Deshmukh"
                  value={newParamedicName}
                  onChange={(e) => setNewParamedicName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-3 py-1.5 border border-stone-200 rounded text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded shadow"
                >
                  {submitting ? 'Registering...' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
