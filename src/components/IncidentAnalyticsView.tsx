import React from 'react';
import {
  PieChart,
  BarChart2,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Incident, District } from '../types';

interface IncidentAnalyticsProps {
  incidents: Incident[];
  districts: District[];
}

export const IncidentAnalyticsView: React.FC<IncidentAnalyticsProps> = ({
  incidents,
  districts,
}) => {
  const total = incidents.length;
  const redCount = incidents.filter((i) => i.priority === 'RED').length;
  const orangeCount = incidents.filter((i) => i.priority === 'ORANGE').length;
  const yellowCount = incidents.filter((i) => i.priority === 'YELLOW').length;
  const greenCount = incidents.filter((i) => i.priority === 'GREEN').length;

  const overrideCount = incidents.filter((i) => i.overrideAudit).length;
  const aiAccuracyRate = total > 0 ? Number(((1 - overrideCount / total) * 100).toFixed(1)) : 96.4;

  const totalPatients = incidents.reduce(
    (acc, i) => acc + (i.patientCount || i.affectedCount || 1),
    0
  );

  return (
    <div className="space-y-4 text-slate-900">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
              AI Operations Metrics
            </span>
            <span className="text-xs text-slate-400">Maharashtra Emergency Operations Center</span>
          </div>
          <h2 className="text-lg font-extrabold text-white mt-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            AI Triage Engine & Emergency Response Analytics
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">AI Triage Speed</span>
            <span className="font-extrabold text-emerald-400 text-base">412 ms / request</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">AI Recommendation Accuracy</span>
            <span className="font-extrabold text-sky-400 text-base">{aiAccuracyRate}%</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
            Total Emergencies Managed
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{total}</span>
          <span className="text-[11px] text-slate-600 font-medium">Across 7 Pilot Districts</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 block">
            Critical Red Incidents
          </span>
          <span className="text-2xl font-black text-rose-700 mt-1 block">{redCount}</span>
          <span className="text-[11px] text-rose-600 font-bold">Immediate Level 1 ICU Dispatch</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
            Total Triage Patients
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalPatients}</span>
          <span className="text-[11px] text-slate-600 font-medium">Multi-casualty casualties</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
            Human Officer Overrides
          </span>
          <span className="text-2xl font-black text-amber-800 mt-1 block">{overrideCount}</span>
          <span className="text-[11px] text-slate-600 font-medium">Audited & logged in SEOC</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority Breakdown Bar */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center space-x-1.5">
            <PieChart className="w-4 h-4 text-sky-600" />
            <span>Priority Color Breakdown</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-rose-700">🔴 RED (Immediate)</span>
                <span>{redCount} ({total > 0 ? Math.round((redCount / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-600 h-full rounded-full"
                  style={{ width: `${total > 0 ? (redCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-amber-700">🟠 ORANGE (Very Urgent)</span>
                <span>{orangeCount} ({total > 0 ? Math.round((orangeCount / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${total > 0 ? (orangeCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-yellow-700">🟡 YELLOW (Urgent)</span>
                <span>{yellowCount} ({total > 0 ? Math.round((yellowCount / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full"
                  style={{ width: `${total > 0 ? (yellowCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-emerald-700">🟢 GREEN (Stable)</span>
                <span>{greenCount} ({total > 0 ? Math.round((greenCount / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${total > 0 ? (greenCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* District Wise Distribution */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center space-x-1.5">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <span>Pilot District Incident Distribution</span>
          </h3>

          <div className="space-y-2 text-xs">
            {districts.map((d) => {
              const count = incidents.filter((i) => i.districtId === d.id).length;
              return (
                <div key={d.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center space-x-2">
                    <span>{d.name} ({d.marathiName})</span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                      {count} Incidents
                    </span>
                    <span className="text-[11px] text-slate-500">{d.avgResponseTimeMin} min avg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
