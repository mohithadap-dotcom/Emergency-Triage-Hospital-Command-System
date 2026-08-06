import React from 'react';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  Users,
  Building2,
  Truck,
  Activity,
  CheckCircle2,
  Zap,
  Radio,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  HeartPulse,
} from 'lucide-react';
import {
  DisasterIncident,
  DisasterTriageVictim,
  FieldHospital,
  IcsRole,
  Hospital,
  AiDisasterRecommendation,
} from '../../types';

interface DisasterIcsOverviewProps {
  disaster: DisasterIncident;
  activeIcsRole: IcsRole;
  victims: DisasterTriageVictim[];
  fieldHospitals: FieldHospital[];
  hospitals: Hospital[];
  aiRecommendations: AiDisasterRecommendation[];
  onExecuteAiRecommendation: (id: string) => void;
  onNavigateSubTab: (tab: string) => void;
  onTriggerDemoScenario: () => void;
}

export const DisasterIcsOverview: React.FC<DisasterIcsOverviewProps> = ({
  disaster,
  activeIcsRole,
  victims,
  fieldHospitals,
  hospitals,
  aiRecommendations,
  onExecuteAiRecommendation,
  onNavigateSubTab,
  onTriggerDemoScenario,
}) => {
  const redCount = victims.filter((v) => v.category === 'RED').length || disaster.triageBreakdown.red;
  const yellowCount = victims.filter((v) => v.category === 'YELLOW').length || disaster.triageBreakdown.yellow;
  const greenCount = victims.filter((v) => v.category === 'GREEN').length || disaster.triageBreakdown.green;
  const blackCount = victims.filter((v) => v.category === 'BLACK').length || disaster.triageBreakdown.black;
  const totalTriage = redCount + yellowCount + greenCount + blackCount;

  return (
    <div className="space-y-6">
      {/* 1. Top Incident Status Banner */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded flex items-center gap-1 shadow animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                {disaster.severity}
              </span>
              <span className="bg-slate-800 text-amber-400 font-mono text-xs px-2.5 py-1 rounded border border-slate-700 font-bold">
                CODE: {disaster.code}
              </span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-400" />
                {disaster.districtName} District
              </span>
              {disaster.greenCorridorActive && (
                <span className="bg-emerald-950 text-emerald-400 text-xs px-2.5 py-1 rounded border border-emerald-800 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  GREEN CORRIDOR ACTIVE
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {disaster.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">{disaster.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:self-start">
            <button
              onClick={onTriggerDemoScenario}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>RUN PUNE DEMO SCENARIO</span>
            </button>
            <button
              onClick={() => onNavigateSubTab('setup')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 transition-colors"
            >
              Declare New Event
            </button>
          </div>
        </div>

        {/* Hazards pill strip */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Special Hazards:
          </span>
          {disaster.specialHazards.map((hz, idx) => (
            <span
              key={idx}
              className="bg-slate-800 text-amber-200 border border-amber-500/30 px-2.5 py-0.5 rounded text-[11px] font-medium"
            >
              • {hz}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Mass Casualty START Triage Scorecard */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            START / Jump Multi-Casualty Triage Scorecard ({totalTriage} Victims Tagged)
          </h3>
          <button
            onClick={() => onNavigateSubTab('triage')}
            className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
          >
            <span>Manage All Casualties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* RED */}
          <div className="bg-rose-50 border-2 border-rose-500 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center space-x-1.5 text-rose-700 font-extrabold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                <span>RED — Immediate</span>
              </div>
              <div className="text-3xl font-black text-rose-950 mt-1">{redCount}</div>
              <div className="text-[11px] text-rose-800 font-medium">Life-Threatening / Evacuate Now</div>
            </div>
            <div className="bg-rose-600 text-white font-black text-xs p-2 rounded-lg shadow">
              PRIORITY 1
            </div>
          </div>

          {/* YELLOW */}
          <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center space-x-1.5 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>YELLOW — Delayed</span>
              </div>
              <div className="text-3xl font-black text-amber-950 mt-1">{yellowCount}</div>
              <div className="text-[11px] text-amber-800 font-medium">Serious / Stable for 1-2 Hours</div>
            </div>
            <div className="bg-amber-500 text-slate-950 font-black text-xs p-2 rounded-lg shadow">
              PRIORITY 2
            </div>
          </div>

          {/* GREEN */}
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center space-x-1.5 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>GREEN — Minor</span>
              </div>
              <div className="text-3xl font-black text-emerald-950 mt-1">{greenCount}</div>
              <div className="text-[11px] text-emerald-800 font-medium">Walking Wounded / Field Clinic</div>
            </div>
            <div className="bg-emerald-600 text-white font-black text-xs p-2 rounded-lg shadow">
              PRIORITY 3
            </div>
          </div>

          {/* BLACK */}
          <div className="bg-slate-100 border-2 border-slate-700 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center space-x-1.5 text-slate-700 font-extrabold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
                <span>BLACK — Deceased</span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1">{blackCount}</div>
              <div className="text-[11px] text-slate-600 font-medium">Expectant / Mortuary Hold</div>
            </div>
            <div className="bg-slate-800 text-white font-black text-xs p-2 rounded-lg shadow">
              EXPECTANT
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Resource Command Matrix & AI Disaster Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Resource Allocation Matrix (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600" />
              Resource Deployment Matrix ({disaster.districtName} Sector)
            </h3>
            <button
              onClick={() => onNavigateSubTab('resources')}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
            >
              <span>Manage Deployment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[11px] font-bold text-slate-500">Ambulance Fleet</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {disaster.resources.ambulancesDispatched} / {disaster.resources.ambulancesNeeded}
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-sky-600 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (disaster.resources.ambulancesDispatched / disaster.resources.ambulancesNeeded) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[11px] font-bold text-slate-500">Trauma ICU Beds</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {disaster.resources.icuBedsReserved} / {disaster.resources.icuBedsNeeded}
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (disaster.resources.icuBedsReserved / disaster.resources.icuBedsNeeded) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[11px] font-bold text-slate-500">Oxygen Cylinders</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {disaster.resources.oxygenCylindersDispatched} / {disaster.resources.oxygenCylindersNeeded}
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (disaster.resources.oxygenCylindersDispatched / disaster.resources.oxygenCylindersNeeded) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[11px] font-bold text-slate-500">Blood Units (O-ve)</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {disaster.resources.bloodUnitsDispatched} / {disaster.resources.bloodUnitsNeeded}
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-rose-600 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (disaster.resources.bloodUnitsDispatched / disaster.resources.bloodUnitsNeeded) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[11px] font-bold text-slate-500">Hazmat Response Kits</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {disaster.resources.hazmatKitsDispatched} / {disaster.resources.hazmatKitsNeeded}
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-600 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (disaster.resources.hazmatKitsDispatched / disaster.resources.hazmatKitsNeeded) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[11px] font-bold text-slate-500">Trauma Surgeons</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {disaster.resources.traumaSurgeonsAssigned} / {disaster.resources.traumaSurgeonsNeeded}
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (disaster.resources.traumaSurgeonsAssigned / disaster.resources.traumaSurgeonsNeeded) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Forward Field Camps Quick Status */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 mb-2">Active Forward Field Hospitals ({fieldHospitals.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fieldHospitals.map((fh) => (
                <div key={fh.id} className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-950 block">{fh.name}</span>
                    <span className="text-[11px] text-amber-800">
                      Beds: {fh.occupiedBeds}/{fh.totalCapacity} • Oxygen: {fh.oxygenSupplyPercent}%
                    </span>
                  </div>
                  <span className="bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                    {fh.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Disaster Commander Action Feed (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                AI Commander Advisory
              </h3>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                Gemini 2.5 Flash
              </span>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {aiRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    rec.status === 'EXECUTED'
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-70'
                      : 'bg-slate-800 border-amber-500/40 text-slate-100 shadow'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-amber-300 text-[11px] mb-1">
                    <span>{rec.category}</span>
                    <span className="font-mono text-[10px] text-slate-400">{rec.timestamp}</span>
                  </div>

                  <h4 className="font-bold text-white mb-1">{rec.title}</h4>
                  <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">{rec.rationale}</p>

                  <div className="bg-slate-950 p-2 rounded border border-slate-800 mb-2 font-mono text-[11px] text-sky-300">
                    Impact: {rec.impactMetric}
                  </div>

                  {rec.status === 'PENDING' ? (
                    <button
                      onClick={() => onExecuteAiRecommendation(rec.id)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-1.5 rounded shadow flex items-center justify-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Apply AI Directive
                    </button>
                  ) : (
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Executed & Synchronized
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateSubTab('ai')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded border border-slate-700 text-center block transition-colors"
          >
            Open Complete AI Commander Intelligence Desk
          </button>
        </div>
      </div>
    </div>
  );
};
