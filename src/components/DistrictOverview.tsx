import React, { useState } from 'react';
import {
  Building2,
  BedDouble,
  Truck,
  Timer,
  AlertTriangle,
  PhoneCall,
  ChevronRight,
  ShieldAlert,
  Search,
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
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.marathiName.includes(searchTerm) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskBadge = (level: District['riskLevel']) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-600 text-white font-extrabold animate-pulse';
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'ELEVATED':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
    }
  };

  const getStatusBadge = (status: District['operationalStatus']) => {
    switch (status) {
      case 'STRESS':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'HEAVY_LOAD':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'ALERT':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-700" />
            Maharashtra Pilot District Emergency Network (7 Districts)
          </h2>
          <p className="text-xs text-slate-500">
            Real-time emergency monitoring, hospital bed allocation status & dispatch latency across pilot centers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 font-medium"
            />
          </div>
          {selectedDistrict !== 'all' && (
            <button
              onClick={() => onSelectDistrict('all')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-md border border-slate-300"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredDistricts.map((district) => {
          const isSelected = selectedDistrict === district.id;
          const icuPercentAvailable = Math.round(
            (district.availableIcuBeds / district.totalIcuBeds) * 100
          );

          return (
            <div
              key={district.id}
              className={`bg-slate-50 rounded-lg border p-3.5 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-600 ring-2 ring-sky-500/20 bg-sky-50/40 shadow'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Card Title Bar */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-base font-black text-slate-900">
                        {district.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        ({district.marathiName})
                      </span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-1 rounded">
                        {district.code}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${getRiskBadge(
                          district.riskLevel
                        )}`}
                      >
                        Risk: {district.riskLevel}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${getStatusBadge(
                          district.operationalStatus
                        )}`}
                      >
                        {district.operationalStatus}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectDistrict(district.id)}
                    className="text-xs text-sky-700 hover:text-sky-900 font-bold bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs"
                  >
                    Select
                  </button>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                      Active Emergencies
                    </span>
                    <div className="flex items-baseline space-x-1 mt-0.5">
                      <span className="text-base font-extrabold text-rose-700 font-mono">
                        {district.currentEmergencies}
                      </span>
                      <span className="text-[10px] text-rose-600">
                        ({district.criticalIncidents} Critical)
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                      ICU Availability
                    </span>
                    <div className="flex items-baseline space-x-1 mt-0.5">
                      <span className="text-base font-extrabold text-sky-800 font-mono">
                        {district.availableIcuBeds}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        / {district.totalIcuBeds}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full ${
                          icuPercentAvailable < 12 ? 'bg-rose-600' : 'bg-sky-600'
                        }`}
                        style={{ width: `${Math.min(100, icuPercentAvailable)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                      108 Ambulances
                    </span>
                    <div className="flex items-baseline space-x-1 mt-0.5">
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        {district.availableAmbulances}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        / {district.totalAmbulances} free
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                      Avg Response
                    </span>
                    <div className="flex items-baseline space-x-1 mt-0.5">
                      <span className="text-sm font-extrabold text-emerald-700 font-mono">
                        {district.avgResponseTimeMin}m
                      </span>
                      <span className="text-[10px] text-slate-400">target &lt;12m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <a
                  href={`tel:${district.controlCenterPhone}`}
                  className="text-[11px] text-slate-600 font-mono hover:text-sky-700 flex items-center space-x-1"
                >
                  <PhoneCall className="w-3 h-3 text-sky-600" />
                  <span>{district.controlCenterPhone}</span>
                </a>

                <button
                  onClick={() => onNavigateToHospitals(district.id)}
                  className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-0.5"
                >
                  <span>{district.hospitalsCount} Hospitals</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
