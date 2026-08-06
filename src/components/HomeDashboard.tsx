import React, { useMemo } from 'react';
import {
  ArrowRight,
  BedDouble,
  Building2,
  ChevronRight,
  Flame,
  MapPin,
  Radio,
  ShieldAlert,
  Truck,
} from 'lucide-react';
import { District, EocSummaryMetrics, Hospital, Incident, SystemHealth } from '../types';
import { DistrictOverview } from './DistrictOverview';
import { KPICards } from './KPICards';
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
  const scopedDistrict = districts.find((district) => district.id === selectedDistrict);
  const scopeLabel = selectedDistrict === 'all' ? 'Statewide command' : `${scopedDistrict?.name} district`;
  const latestIncidents = incidents.slice(0, 4);

  const topHospitalsWithIcu = useMemo(
    () =>
      hospitals
        .filter((hospital) => selectedDistrict === 'all' || hospital.districtId === selectedDistrict)
        .sort((a, b) => b.availableIcuBeds - a.availableIcuBeds)
        .slice(0, 4),
    [hospitals, selectedDistrict],
  );

  const lastSyncTime = systemHealth.lastCheckTimestamp
    ? new Date(systemHealth.lastCheckTimestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Live';

  const severityClass = (severity: Incident['severity']) => {
    if (severity === 'CRITICAL') return 'bg-rose-50 text-rose-700';
    if (severity === 'MAJOR') return 'bg-amber-50 text-amber-800';
    return 'bg-stone-100 text-stone-600';
  };

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6 xl:p-7">
          <div className="min-w-0">
            <div className="label mb-3">Maharashtra State Emergency Operations Center</div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-950 md:text-4xl xl:text-5xl">
              Operational command without the noise.
            </h1>
            <p className="mt-3 max-w-5xl text-sm leading-6 text-stone-600">
              Live incident triage, ICU capacity, hospital readiness, and 108 ambulance dispatch across the pilot districts.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-cyan-50 px-3 font-semibold text-cyan-800">
                <MapPin className="h-4 w-4" />
                {scopeLabel}
              </span>
              <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-50 px-3 font-semibold text-emerald-800">
                <Radio className="h-4 w-4" />
                Last sync {lastSyncTime}
              </span>
              <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-rose-50 px-3 font-semibold text-rose-700">
                <Flame className="h-4 w-4" />
                {metrics.criticalIncidents} critical
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              onClick={() => onNavigateTab('gis')}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-cyan-700 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-cyan-800"
            >
              <MapPin className="h-4 w-4" />
              <span>Open GIS</span>
            </button>
            <button
              onClick={() => onNavigateTab('incidents')}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-800 transition-colors duration-200 hover:border-cyan-300 hover:text-cyan-800"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Live Incidents</span>
            </button>
          </div>
        </div>
      </section>

      <KPICards
        metrics={metrics}
        onFilterClick={(type) => {
          if (type === 'active_emergencies' || type === 'critical_incidents') onNavigateTab('incidents');
          else if (type === 'available_icu') onNavigateTab('hospitals');
          else if (type === 'available_ambulances') onNavigateTab('fleet');
          else if (type === 'system_health') onNavigateTab('observability');
        }}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(420px,0.85fr)] 2xl:grid-cols-[minmax(0,2.35fr)_minmax(460px,0.8fr)]">
        <MaharashtraMapVisualizer
          districts={districts}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={onSelectDistrict}
        />

        <aside className="card p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <div className="label">Operational Queue</div>
              <h2 className="mt-1 text-lg font-bold text-stone-950">What needs attention</h2>
            </div>
            <button
              onClick={() => onNavigateTab('incidents')}
              className="flex h-9 cursor-pointer items-center gap-1 rounded-lg px-2 text-sm font-semibold text-cyan-800 transition-colors duration-200 hover:bg-cyan-50"
            >
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {latestIncidents.map((incident) => (
              <button
                key={incident.id}
                onClick={() => onNavigateTab('incidents')}
                className="w-full cursor-pointer rounded-lg border border-stone-200 bg-white p-3 text-left transition-colors duration-200 hover:border-cyan-200 hover:bg-cyan-50/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-semibold text-stone-500">{incident.code}</div>
                    <div className="mt-1 truncate text-sm font-semibold text-stone-950">{incident.title}</div>
                    <div className="mt-1 truncate text-xs text-stone-500">
                      {incident.districtName} - {incident.locationName}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${severityClass(incident.severity)}`}>
                    {incident.severity}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="my-5 h-px bg-stone-200" />

          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="label">Receiving Capacity</div>
              <h2 className="mt-1 text-lg font-bold text-stone-950">ICU availability</h2>
            </div>
            <button
              onClick={() => onNavigateTab('hospitals')}
              className="flex h-9 cursor-pointer items-center gap-1 rounded-lg px-2 text-sm font-semibold text-cyan-800 transition-colors duration-200 hover:bg-cyan-50"
            >
              <span>Hospitals</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {topHospitalsWithIcu.map((hospital) => (
              <div
                key={hospital.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white p-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-stone-950">{hospital.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {hospital.districtName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5" />
                      {hospital.traumaLevel}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-semibold text-stone-950">{hospital.availableIcuBeds}</div>
                  <div className="text-[11px] font-semibold text-stone-500">
                    {hospital.availableVentilators} ventilators
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
            <div className="flex items-center gap-2 font-semibold">
              <Truck className="h-4 w-4" />
              {metrics.availableAmbulances} ambulances ready statewide
            </div>
          </div>
        </aside>
      </div>

      <DistrictOverview
        districts={districts}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={onSelectDistrict}
        onNavigateToHospitals={(districtId) => {
          onSelectDistrict(districtId);
          onNavigateTab('hospitals');
        }}
      />
    </div>
  );
};
