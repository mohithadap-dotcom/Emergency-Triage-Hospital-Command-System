import React, { useState } from 'react';
import {
  BedDouble,
  Building2,
  ChevronRight,
  PhoneCall,
  Search,
  ShieldAlert,
  Timer,
  Truck,
} from 'lucide-react';
import { District } from '../types';

interface DistrictOverviewProps {
  districts: District[];
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  onNavigateToHospitals: (districtId: string) => void;
}

export const DistrictOverview: React.FC<DistrictOverviewProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  onNavigateToHospitals,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = districts.filter(
    (district) =>
      district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const riskBadgeClass = (level: District['riskLevel']) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-600 text-white';
      case 'HIGH':
        return 'bg-rose-50 text-rose-700';
      case 'ELEVATED':
        return 'bg-amber-50 text-amber-800';
      default:
        return 'bg-emerald-50 text-emerald-800';
    }
  };

  const statusBadgeClass = (status: District['operationalStatus']) => {
    switch (status) {
      case 'STRESS':
        return 'text-rose-700';
      case 'HEAVY_LOAD':
      case 'ALERT':
        return 'text-amber-800';
      default:
        return 'text-emerald-800';
    }
  };

  return (
    <section className="card p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="label">District Network</div>
          <h2 className="mt-1 text-xl font-bold text-stone-950">Pilot district readiness</h2>
          <p className="mt-1 text-sm text-stone-500">
            One row per command district, tuned for quick scan and fast routing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search district"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-10 w-64 rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-sm font-medium text-stone-900 placeholder:text-stone-400"
            />
          </div>
          {selectedDistrict !== 'all' && (
            <button
              onClick={() => onSelectDistrict('all')}
              className="h-10 cursor-pointer rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 transition-colors duration-200 hover:border-cyan-300 hover:text-cyan-800"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <div className="hidden grid-cols-[1.35fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-stone-200 bg-stone-50 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500 lg:grid">
          <span>District</span>
          <span>Risk</span>
          <span>Emergencies</span>
          <span>ICU</span>
          <span>Fleet</span>
          <span className="text-right">Action</span>
        </div>

        <div className="divide-y divide-stone-200">
          {filteredDistricts.map((district) => {
            const isSelected = selectedDistrict === district.id;
            const icuPercentAvailable = Math.round(
              (district.availableIcuBeds / district.totalIcuBeds) * 100,
            );

            return (
              <div
                key={district.id}
                className={`grid gap-4 px-4 py-4 transition-colors duration-200 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr_auto] lg:items-center ${
                  isSelected ? 'bg-cyan-50/70' : 'bg-white hover:bg-stone-50'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-stone-950">{district.name}</h3>
                    <span className="rounded bg-stone-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-stone-600">
                      {district.code}
                    </span>
                    {isSelected && (
                      <span className="rounded bg-cyan-700 px-2 py-0.5 text-[11px] font-bold text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <a
                    href={`tel:${district.controlCenterPhone}`}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-mono text-stone-500 transition-colors duration-200 hover:text-cyan-800"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    {district.controlCenterPhone}
                  </a>
                </div>

                <div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${riskBadgeClass(district.riskLevel)}`}>
                    {district.riskLevel}
                  </span>
                  <div className={`mt-1 text-xs font-semibold ${statusBadgeClass(district.operationalStatus)}`}>
                    {district.operationalStatus.replace('_', ' ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                  <div>
                    <div className="font-mono text-lg font-semibold text-stone-950">
                      {district.currentEmergencies}
                    </div>
                    <div className="text-xs text-stone-500">{district.criticalIncidents} critical</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <BedDouble className="h-4 w-4 text-cyan-700" />
                    <span className="font-mono text-lg font-semibold text-stone-950">
                      {district.availableIcuBeds}/{district.totalIcuBeds}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full ${icuPercentAvailable < 12 ? 'bg-rose-600' : 'bg-cyan-700'}`}
                      style={{ width: `${Math.min(100, icuPercentAvailable)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-emerald-700" />
                  <div>
                    <div className="font-mono text-lg font-semibold text-stone-950">
                      {district.availableAmbulances}/{district.totalAmbulances}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <Timer className="h-3.5 w-3.5" />
                      {district.avgResponseTimeMin}m avg
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:justify-end">
                  <button
                    onClick={() => onSelectDistrict(district.id)}
                    className="h-9 cursor-pointer rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 transition-colors duration-200 hover:border-cyan-300 hover:text-cyan-800"
                  >
                    Focus
                  </button>
                  <button
                    onClick={() => onNavigateToHospitals(district.id)}
                    className="flex h-9 cursor-pointer items-center gap-1 rounded-lg bg-cyan-700 px-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-cyan-800"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>{district.hospitalsCount}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
