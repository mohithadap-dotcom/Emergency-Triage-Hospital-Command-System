import React, { useState } from 'react';
import {
  Columns3,
  Building2,
  BedDouble,
  Activity,
  Heart,
  Droplet,
  UserCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Hospital } from '../../types';

interface HospitalComparisonViewProps {
  hospitals: Hospital[];
}

export const HospitalComparisonView: React.FC<HospitalComparisonViewProps> = ({ hospitals }) => {
  const [selectedHospitalIds, setSelectedHospitalIds] = useState<string[]>([
    hospitals[0]?.id || '',
    hospitals[1]?.id || '',
  ]);

  const handleSelectHospital = (index: number, id: string) => {
    const updated = [...selectedHospitalIds];
    updated[index] = id;
    setSelectedHospitalIds(updated);
  };

  const handleAddComparisonSlot = () => {
    if (selectedHospitalIds.length < 4) {
      const unused = hospitals.find((h) => !selectedHospitalIds.includes(h.id));
      if (unused) {
        setSelectedHospitalIds([...selectedHospitalIds, unused.id]);
      }
    }
  };

  const handleRemoveComparisonSlot = (index: number) => {
    if (selectedHospitalIds.length > 2) {
      setSelectedHospitalIds(selectedHospitalIds.filter((_, idx) => idx !== index));
    }
  };

  const comparedHospitals = selectedHospitalIds
    .map((id) => hospitals.find((h) => h.id === id))
    .filter((h): h is Hospital => h !== undefined);

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="bg-slate-900 text-white rounded-lg p-3.5 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <Columns3 className="w-4 h-4 text-amber-400" />
            Side-by-Side Multi-Hospital Resource Comparison Matrix
          </h3>
          <p className="text-[11px] text-slate-400">
            Compare live telemetry across ICU capacity, mechanical ventilators, operating theatres, liquid oxygen tanks, and specialist staffing.
          </p>
        </div>

        {selectedHospitalIds.length < 4 && (
          <button
            onClick={handleAddComparisonSlot}
            className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-black px-3 py-1.5 rounded text-xs transition-colors"
          >
            + Add Hospital Slot
          </button>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <div
          className={`grid gap-3 min-w-[700px]`}
          style={{
            gridTemplateColumns: `repeat(${comparedHospitals.length}, minmax(240px, 1fr))`,
          }}
        >
          {comparedHospitals.map((hosp, slotIdx) => (
            <div
              key={slotIdx}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4 flex flex-col justify-between"
            >
              {/* Header Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                    Facility #{slotIdx + 1}
                  </span>
                  {selectedHospitalIds.length > 2 && (
                    <button
                      onClick={() => handleRemoveComparisonSlot(slotIdx)}
                      className="text-slate-400 hover:text-rose-600 font-bold text-xs"
                    >
                      Remove ✕
                    </button>
                  )}
                </div>

                <select
                  value={hosp.id}
                  onChange={(e) => handleSelectHospital(slotIdx, e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.districtName})
                    </option>
                  ))}
                </select>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                      hosp.operationalStatus === 'GREEN'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : hosp.operationalStatus === 'YELLOW'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {hosp.operationalStatus} STATUS
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {hosp.traumaLevel}
                  </span>
                </div>
              </div>

              {/* Resource Metrics List */}
              <div className="space-y-2.5 text-xs border-t border-slate-200 pt-3">
                {/* ICU Beds */}
                <div className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">ICU Capacity</span>
                    <span className="font-black text-slate-900 text-sm">
                      {hosp.availableIcuBeds} / {hosp.totalIcuBeds} Free
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      hosp.availableIcuBeds > 10
                        ? 'text-emerald-700 bg-emerald-100'
                        : 'text-rose-700 bg-rose-100'
                    }`}
                  >
                    {Math.round(((hosp.totalIcuBeds - hosp.availableIcuBeds) / hosp.totalIcuBeds) * 100)}% Full
                  </span>
                </div>

                {/* Ventilators */}
                <div className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Mechanical Ventilators</span>
                    <span className="font-black text-slate-900 text-sm">
                      {hosp.availableVentilators} / {hosp.totalVentilators} Ready
                    </span>
                  </div>
                  <Activity className="w-4 h-4 text-sky-600" />
                </div>

                {/* Operating Theatres */}
                <div className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Operating Theatres</span>
                    <span className="font-bold text-slate-900">
                      {hosp.operatingTheatresAvailable} / {hosp.operatingTheatresTotal} Active
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                {/* Liquid Oxygen */}
                <div className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Liquid Oxygen Tank</span>
                    <span className="font-bold text-slate-900">
                      {hosp.liquidOxygenTankLevelPercent}% ({hosp.oxygenCylindersAvailable} Cylinders)
                    </span>
                  </div>
                  <Flame className="w-4 h-4 text-cyan-600" />
                </div>

                {/* Staffing */}
                <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px]">Staff On Duty</span>
                  <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                    <span>Doctors: {hosp.doctorsOnDuty}</span>
                    <span>Nurses: {hosp.nursesOnDuty}</span>
                  </div>
                  <div className="text-[10px] text-indigo-700 font-bold">
                    Critical Care Specialists: {hosp.criticalCareSpecialistsOnDuty}
                  </div>
                </div>

                {/* Emergency Dept Status */}
                <div className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Emergency Dept Status</span>
                    <span className="font-black text-slate-900">{hosp.emergencyDeptStatus}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    Avg Acceptance: {hosp.averagePatientAcceptanceTimeMin} min
                  </span>
                </div>
              </div>

              {/* Footer Coordinator */}
              <div className="border-t border-slate-100 pt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>Coord: {hosp.emergencyCoordinatorName}</span>
                <span>{hosp.emergencyPhone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
