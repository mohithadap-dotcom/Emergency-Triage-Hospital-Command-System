import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Fuel,
  Activity,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Building2,
  Shield,
  Gauge,
  Phone,
} from 'lucide-react';
import { Ambulance } from '../../types';

interface AmbulanceFleetManagementViewProps {
  ambulances: Ambulance[];
}

export const AmbulanceFleetManagementView: React.FC<AmbulanceFleetManagementViewProps> = ({
  ambulances,
}) => {
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAmbulances = ambulances.filter((a) => {
    if (districtFilter !== 'ALL' && a.districtId !== districtFilter) return false;
    if (typeFilter !== 'ALL' && a.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.registrationNo.toLowerCase().includes(q) ||
        a.driverName.toLowerCase().includes(q) ||
        a.districtName.toLowerCase().includes(q) ||
        a.baseHospital.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white text-stone-900 p-5 rounded-2xl border border-stone-200 shadow-lg shadow-stone-300/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-600 rounded-xl">
            <Truck className="w-6 h-6 text-stone-900" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-stone-900">
              Statewide 108 EMS Fleet Management Directory
            </h2>
            <p className="text-xs text-stone-600">
              Live fleet tracking across Nagpur, Pune, Mumbai, Nashik, Wardha, Amravati, Chandrapur
            </p>
          </div>
        </div>

        <div className="bg-stone-100 px-4 py-2 rounded-xl text-xs font-mono text-emerald-400 font-bold border border-stone-300">
          Total Active Fleet: {ambulances.length} Units
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder="Search by registration, driver name, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-cream border border-stone-200 rounded-lg px-3 py-1.5 font-bold text-stone-800"
          >
            <option value="ALL">All Districts</option>
            <option value="nagpur">Nagpur</option>
            <option value="pune">Pune</option>
            <option value="mumbai">Mumbai</option>
            <option value="nashik">Nashik</option>
            <option value="wardha">Wardha</option>
            <option value="amravati">Amravati</option>
            <option value="chandrapur">Chandrapur</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-cream border border-stone-200 rounded-lg px-3 py-1.5 font-bold text-stone-800"
          >
            <option value="ALL">All Vehicle Types</option>
            <option value="ALS">ALS (Advanced Life Support)</option>
            <option value="BLS">BLS (Basic Life Support)</option>
            <option value="NEONATAL">Neonatal Intensive Care</option>
            <option value="AIR_AMBULANCE">Air Ambulance Helicopter</option>
          </select>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAmbulances.map((amb) => (
          <div key={amb.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <span className="font-mono font-black text-stone-900 text-sm">{amb.registrationNo}</span>
                <span className="block text-[10px] text-stone-500 font-bold uppercase">{amb.districtName} District</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded font-extrabold text-[10px] font-mono ${
                  amb.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-400'
                    : amb.status === 'ON_MISSION'
                    ? 'bg-rose-100 text-rose-400'
                    : 'bg-amber-100 text-amber-400'
                }`}
              >
                {amb.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Vehicle Type:</span>
                <strong className="text-stone-900">{amb.type}</strong>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Base Station:</span>
                <strong className="text-stone-900 truncate max-w-[150px]">{amb.baseHospital}</strong>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Driver:</span>
                <strong className="text-stone-900">{amb.driverName}</strong>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Paramedic:</span>
                <strong className="text-stone-900">{amb.paramedicName}</strong>
              </div>
              <div className="flex justify-between text-stone-500 font-mono">
                <span>Fuel / O₂ Level:</span>
                <strong className="text-emerald-400">{amb.fuelLevel}% Fuel</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between font-mono">
              <span>Ping: {amb.lastPing}</span>
              <a href={`tel:${amb.phone}`} className="text-sky-600 font-bold hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>Call Unit</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
