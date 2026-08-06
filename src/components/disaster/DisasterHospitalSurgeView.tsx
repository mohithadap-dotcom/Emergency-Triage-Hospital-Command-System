import React from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Zap,
  Activity,
  Sparkles,
} from 'lucide-react';
import { Hospital, DisasterIncident } from '../../types';

interface DisasterHospitalSurgeViewProps {
  disaster: DisasterIncident;
  hospitals: Hospital[];
}

export const DisasterHospitalSurgeView: React.FC<DisasterHospitalSurgeViewProps> = ({
  disaster,
  hospitals,
}) => {
  const affectedHospitals = hospitals.filter((h) => h.districtId === disaster.districtId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Inter-Hospital Disaster Network & Surge Balancing
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Surge capacity monitoring across regional trauma hospitals to prevent emergency department bottlenecks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="bg-indigo-50 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Surge Balancing Active
          </span>
        </div>
      </div>

      {/* Regional Hospital Capacity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {affectedHospitals.map((h) => {
          const occupancy = Math.round(((h.totalBeds - h.availableGeneralBeds) / h.totalBeds) * 100);
          const isCritical = occupancy > 90;

          return (
            <div
              key={h.id}
              className={`bg-white border rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden ${
                isCritical ? 'border-2 border-rose-500 bg-rose-50/20' : 'border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                    {h.traumaLevel}
                  </span>
                  <h3 className="font-bold text-stone-900 text-base mt-1">{h.name}</h3>
                  <span className="text-xs text-stone-500">{h.districtName} Sector</span>
                </div>

                <div
                  className={`text-right font-black text-xl ${
                    occupancy > 90 ? 'text-rose-600' : occupancy > 80 ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {occupancy}%
                  <span className="block text-[10px] text-stone-500 font-normal">Surge Occupancy</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    occupancy > 90 ? 'bg-rose-600' : occupancy > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${occupancy}%` }}
                ></div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-cream p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[10px] text-stone-500 block">ICU BEDS FREE</span>
                  <span className="font-bold text-stone-900">{h.availableIcuBeds} Beds</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">VENTILATORS</span>
                  <span className="font-bold text-stone-900">{h.availableVentilators} Available</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">DOCTORS ON DUTY</span>
                  <span className="font-bold text-stone-900">{h.doctorsOnDuty} Specialists</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">ER STATUS</span>
                  <span
                    className={`font-bold ${
                      h.emergencyDeptStatus === 'SURGE' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {h.emergencyDeptStatus}
                  </span>
                </div>
              </div>

              {isCritical && (
                <div className="bg-rose-100 border border-rose-200 text-rose-950 text-xs p-2.5 rounded-lg font-bold flex items-center justify-between">
                  <span>⚠️ AI Recommendation: Divert Non-Critical Traffic</span>
                  <button className="bg-rose-600 text-stone-900 text-[10px] px-2 py-1 rounded shadow">
                    EXECUTE DIVERT
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Surge Redistribution Matrix Box */}
      <div className="bg-white text-stone-900 rounded-xl p-5 shadow-lg shadow-stone-300/40 space-y-4 border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
            AI Automated Casualty Redistribution Recommendations
          </h3>
          <span className="bg-stone-100 text-stone-600 text-[10px] font-mono px-2 py-0.5 rounded">
            Updated 1 min ago
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-stone-100 border border-stone-300 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-stone-900 text-sm">
                Sassoon General Hospital ➔ Sahyadri Super Speciality
              </div>
              <p className="text-stone-600 text-xs mt-0.5">
                Re-route 6 YELLOW (Delayed) casualties currently staged at Toll Plaza Camp to Sahyadri Hospital (8 mins ETA) to preserve Sassoon Trauma Bay 1 for RED polytrauma cases.
              </p>
            </div>
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3 py-2 rounded text-xs shadow whitespace-nowrap">
              Approve Diversion
            </button>
          </div>

          <div className="bg-stone-100 border border-stone-300 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-stone-900 text-sm">
                Ruby Hall Clinic ➔ Jehangir Hospital Surge Mutual Aid
              </div>
              <p className="text-stone-600 text-xs mt-0.5">
                Transfer 4 portable ventilators and 10 O-negative blood units from Jehangir Supply Hub to Ruby Hall Trauma Ward.
              </p>
            </div>
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3 py-2 rounded text-xs shadow whitespace-nowrap">
              Approve Mutual Aid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
