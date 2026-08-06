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
    <div className="space-y-8">
      {/* 1. Government Branding Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
        <div>
          <div className="label mb-3">
            Maharashtra State Emergency Operations Center
          </div>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-stone-900 leading-tight">
            Operational Command Center
          </h1>
          <p className="text-sm text-stone-500 mt-2 max-w-xl leading-relaxed">
            Centralized multi-hospital coordination, real-time ICU bed tracking & 108 emergency dispatch across Nagpur, Pune, Mumbai, Nashik, Wardha, Amravati, and Chandrapur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('ops')}
            className="bg-white border border-stone-200 hover:border-amber-400/50 text-stone-600 hover:text-amber-400 font-medium text-xs px-4 py-2.5 rounded-md flex items-center gap-2 transition-colors duration-200"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Operations</span>
          </button>
          <button
            onClick={() => onNavigateTab('hospitals')}
            className="bg-white border border-stone-200 hover:border-stone-300 text-stone-500 hover:text-stone-800 font-medium text-xs px-4 py-2.5 rounded-md flex items-center gap-2 transition-colors duration-200"
          >
            <Building2 className="w-4 h-4" />
            <span>Hospital Network</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <KPICards metrics={metrics} onFilterClick={(type) => {
        if (type === 'active_emergencies' || type === 'critical_incidents') onNavigateTab('incidents');
        else if (type === 'available_icu' || type === 'hospitals_online') onNavigateTab('hospitals');
        else if (type === 'available_ambulances') onNavigateTab('fleet');
        else if (type === 'system_health') onNavigateTab('observability');
      }} />

      {/* 3. Interactive GIS Map */}
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

      {/* 5. Split Section: Incidents + Hospital Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Incident Feed */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-stone-800">
              Latest Incidents
            </h2>
            <button
              onClick={() => onNavigateTab('incidents')}
              className="text-xs text-stone-500 hover:text-amber-400 flex items-center gap-1 transition-colors duration-200"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {latestIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-md bg-cream border border-stone-200 hover:border-stone-300 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] text-stone-500">
                    {inc.code}
                  </span>
                  <span
                    className={`text-[10px] font-medium tracking-widest uppercase ${
                      inc.severity === 'CRITICAL'
                        ? 'text-rose-400'
                        : 'text-stone-500'
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-stone-800">{inc.title}</h3>
                <div className="flex items-center justify-between mt-2 text-xs text-stone-500">
                  <span>{inc.districtName} · {inc.locationName}</span>
                  <span className="font-mono">{inc.affectedCount} affected</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Capacity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-stone-800">
              ICU Bed Availability
            </h2>
            <button
              onClick={() => onNavigateTab('hospitals')}
              className="text-xs text-stone-500 hover:text-amber-400 flex items-center gap-1 transition-colors duration-200"
            >
              <span>All hospitals</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {topHospitalsWithIcu.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-md bg-cream border border-stone-200 flex items-center justify-between hover:border-stone-300 transition-colors duration-200"
              >
                <div>
                  <div className="text-sm font-medium text-stone-800">{h.name}</div>
                  <div className="text-xs text-stone-500 mt-1">
                    {h.districtName} · {h.traumaLevel}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-lg font-medium text-stone-900">
                    {h.availableIcuBeds}
                  </div>
                  <div className="text-[10px] text-stone-500 tracking-wider uppercase mt-0.5">
                    ICU free · {h.availableVentilators} vent
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Module Access Cards */}
      <div>
        <div className="label mb-4">
          Operations Modules
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { tab: 'ops' as NavTab, label: 'Emergency Ops', sub: 'Tactical Dispatch', icon: ShieldAlert },
            { tab: 'incidents' as NavTab, label: 'Live Incidents', sub: 'Triage & Casualty', icon: Flame },
            { tab: 'hospitals' as NavTab, label: 'Hospital Network', sub: 'ICU Telemetry', icon: Building2 },
            { tab: 'fleet' as NavTab, label: 'Ambulance Fleet', sub: 'MEMS 108 GPS', icon: Truck },
            { tab: 'analytics' as NavTab, label: 'Analytics', sub: 'Response Intelligence', icon: BarChart3 },
            { tab: 'observability' as NavTab, label: 'System Health', sub: 'Postgres & Redis', icon: Activity },
          ].map((mod) => (
            <div
              key={mod.tab}
              onClick={() => onNavigateTab(mod.tab)}
              className="card p-4 cursor-pointer hover:border-stone-300 transition-colors duration-200 group"
            >
              <mod.icon className="w-5 h-5 text-stone-500 mb-4 group-hover:text-amber-500/70 transition-colors duration-200" />
              <div className="text-sm font-medium text-stone-800">{mod.label}</div>
              <div className="text-[10px] text-stone-500 mt-1">{mod.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
