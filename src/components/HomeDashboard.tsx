import React from 'react';
import {
  ShieldAlert,
  Building2,
  Flame,
  BedDouble,
  Truck,
  Activity,
  ArrowRight,
  Radio,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  MapPin,
  Box,
  BarChart3,
  Users,
} from 'lucide-react';
import { District, Hospital, Incident, EocSummaryMetrics, SystemHealth } from '../types';
import { KPICards } from './KPICards';
import { DistrictOverview } from './DistrictOverview';
import { MaharashtraMapVisualizer } from './MaharashtraMapVisualizer';
import { NavTab } from './Navbar';

interface HomeProps {
  metrics: EocSummaryMetrics;
  districts: District[];
  hospitals: Hospital[];
  incidents: Incident[];
  systemHealth: SystemHealth;
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const HomeDashboard: React.FC<HomeProps> = ({
  metrics,
  districts,
  hospitals,
  incidents,
  systemHealth,
  selectedDistrict,
  onSelectDistrict,
  onNavigateTab,
}) => {
  const latestIncidents = incidents.slice(0, 4);

  const topHospitalsWithIcu = hospitals
    .filter((h) => selectedDistrict === 'all' || h.districtId === selectedDistrict)
    .sort((a, b) => b.availableIcuBeds - a.availableIcuBeds)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* 1. Government Branding Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>MAHARASHTRA STATE EMERGENCY OPERATIONS CENTER (SEOC)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Operational Command Center — Pilot Network
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Centralized multi-hospital coordination, real-time ICU bed tracking & 108 emergency dispatch platform serving Nagpur, Pune, Mumbai, Nashik, Wardha, Amravati, and Chandrapur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('ops')}
            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-md shadow-md flex items-center space-x-1.5 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Operations</span>
          </button>
          <button
            onClick={() => onNavigateTab('hospitals')}
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-3.5 py-2 rounded-md shadow flex items-center space-x-1.5 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Hospital Network</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Command Statistics (10 KPI Cards) */}
      <KPICards metrics={metrics} onFilterClick={(type) => {
        if (type === 'active_emergencies' || type === 'critical_incidents') onNavigateTab('incidents');
        else if (type === 'available_icu' || type === 'hospitals_online') onNavigateTab('hospitals');
        else if (type === 'available_ambulances') onNavigateTab('fleet');
        else if (type === 'system_health') onNavigateTab('observability');
      }} />

      {/* 3. Interactive GIS Map Visualizer */}
      <MaharashtraMapVisualizer
        districts={districts}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={onSelectDistrict}
      />

      {/* 4. District Network Grid */}
      <DistrictOverview
        districts={districts}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={onSelectDistrict}
        onNavigateToHospitals={(distId) => {
          onSelectDistrict(distId);
          onNavigateTab('hospitals');
        }}
      />

      {/* 5. Split Section: Latest Incident Feed + Hospital Capacity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest Emergency Feed */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
              Latest Live Incident Stream
            </h2>
            <button
              onClick={() => onNavigateTab('incidents')}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>View All ({incidents.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {latestIncidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-slate-50 p-2.5 rounded border border-slate-200 hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded">
                    {inc.code}
                  </span>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                      inc.severity === 'CRITICAL'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xs">{inc.title}</h3>
                <div className="flex items-center justify-between mt-1 text-slate-500 text-[10px]">
                  <span>{inc.districtName} District • {inc.locationName}</span>
                  <span className="font-bold text-rose-700">{inc.affectedCount} Affected</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Hospital Capacity Summary */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <BedDouble className="w-4 h-4 text-sky-700" />
              Hospital ICU Bed Availability Summary
            </h2>
            <button
              onClick={() => onNavigateTab('hospitals')}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>Explore All ({hospitals.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {topHospitalsWithIcu.map((h) => (
              <div
                key={h.id}
                className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{h.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {h.districtName} • {h.traumaLevel}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-extrabold text-sky-800 text-sm">
                    {h.availableIcuBeds} Free ICU Beds
                  </div>
                  <div className="text-[10px] text-teal-700 font-semibold">
                    {h.availableVentilators} Ventilators Ready
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Navigation Cards for EOC Core Modules */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
          State Emergency Operations Module Access Cards
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            onClick={() => onNavigateTab('ops')}
            className="bg-rose-50 hover:bg-rose-100/80 border border-rose-200 p-3 rounded-lg cursor-pointer transition-all text-xs flex flex-col justify-between"
          >
            <ShieldAlert className="w-5 h-5 text-rose-600 mb-2" />
            <div>
              <span className="font-extrabold text-slate-900 block">Emergency Operations</span>
              <span className="text-[10px] text-rose-700 font-medium">Tactical Dispatch Room</span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('incidents')}
            className="bg-amber-50 hover:bg-amber-100/80 border border-amber-200 p-3 rounded-lg cursor-pointer transition-all text-xs flex flex-col justify-between"
          >
            <Flame className="w-5 h-5 text-amber-600 mb-2" />
            <div>
              <span className="font-extrabold text-slate-900 block">Live Incidents</span>
              <span className="text-[10px] text-amber-700 font-medium">Triage & Mass Casualty</span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('hospitals')}
            className="bg-sky-50 hover:bg-sky-100/80 border border-sky-200 p-3 rounded-lg cursor-pointer transition-all text-xs flex flex-col justify-between"
          >
            <Building2 className="w-5 h-5 text-sky-700 mb-2" />
            <div>
              <span className="font-extrabold text-slate-900 block">Hospital Network</span>
              <span className="text-[10px] text-sky-800 font-medium">ICU Telemetry Index</span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('fleet')}
            className="bg-blue-50 hover:bg-blue-100/80 border border-blue-200 p-3 rounded-lg cursor-pointer transition-all text-xs flex flex-col justify-between"
          >
            <Truck className="w-5 h-5 text-blue-700 mb-2" />
            <div>
              <span className="font-extrabold text-slate-900 block">Ambulance Fleet</span>
              <span className="text-[10px] text-blue-800 font-medium">MEMS 108 GPS Tracker</span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('analytics')}
            className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 p-3 rounded-lg cursor-pointer transition-all text-xs flex flex-col justify-between"
          >
            <BarChart3 className="w-5 h-5 text-emerald-700 mb-2" />
            <div>
              <span className="font-extrabold text-slate-900 block">Analytics</span>
              <span className="text-[10px] text-emerald-800 font-medium">Response Time Intelligence</span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('observability')}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-300 p-3 rounded-lg cursor-pointer transition-all text-xs flex flex-col justify-between"
          >
            <Activity className="w-5 h-5 text-slate-700 mb-2" />
            <div>
              <span className="font-extrabold text-slate-900 block">Observability</span>
              <span className="text-[10px] text-slate-600 font-medium">Postgres & Redis Health</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
