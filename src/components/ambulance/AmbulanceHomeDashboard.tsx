import React from 'react';
import {
  Truck,
  Activity,
  MapPin,
  Clock,
  User,
  Shield,
  Zap,
  AlertTriangle,
  Hospital,
  Sparkles,
  CheckCircle2,
  Navigation,
  Heart,
  Gauge,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import { AmbulanceUserSession, AmbulanceMission, VehicleHealthStatus } from '../../types';

interface AmbulanceHomeDashboardProps {
  session: AmbulanceUserSession;
  activeMission: AmbulanceMission | null;
  vehicleHealth: VehicleHealthStatus;
  todayCompletedCount: number;
  onNavigateTab: (tab: string) => void;
  onUpdateMissionStage: (stage: string) => Promise<void>;
}

export const AmbulanceHomeDashboard: React.FC<AmbulanceHomeDashboardProps> = ({
  session,
  activeMission,
  vehicleHealth,
  todayCompletedCount,
  onNavigateTab,
  onUpdateMissionStage,
}) => {
  const user = session.user;

  return (
    <div className="space-y-5">
      {/* Top Banner - Vehicle & Shift Status */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-stone-900 flex items-center justify-center font-black text-xl shadow">
            108
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-stone-900 font-mono">
                {user.vehicleCallsign} ({user.vehicleRegNo})
              </h2>
              <span className="bg-emerald-100 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                ON DUTY
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Base Station: {user.districtName} District Headquarters • Shift: {user.shiftName}
            </p>
          </div>
        </div>

        {/* Quick Shift Stats */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-200 text-center">
            <span className="text-stone-500 block text-[10px] uppercase font-sans font-bold">Today's Missions</span>
            <span className="text-lg font-black text-stone-900">{todayCompletedCount + (activeMission ? 1 : 0)}</span>
          </div>
          <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-200 text-center">
            <span className="text-stone-500 block text-[10px] uppercase font-sans font-bold">Fuel Level</span>
            <span className="text-lg font-black text-emerald-400">{vehicleHealth.fuelLevelPercent}%</span>
          </div>
          <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-200 text-center">
            <span className="text-stone-500 block text-[10px] uppercase font-sans font-bold">O₂ Reserve</span>
            <span className="text-lg font-black text-sky-400">{vehicleHealth.oxygenCylinderBar} Bar</span>
          </div>
        </div>
      </div>

      {/* Active Mission Highlight Card */}
      {activeMission ? (
        <div className="bg-white text-stone-900 border-2 border-rose-500/80 rounded-2xl shadow-lg shadow-stone-300/40 overflow-hidden">
          <div className="bg-rose-600 px-5 py-2.5 flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-100 animate-pulse" />
              <span>ACTIVE EMERGENCY MISSION DISPATCHED</span>
            </div>
            <span className="bg-white text-rose-950 px-2 py-0.5 rounded font-black">
              PRIORITY: {activeMission.priority}
            </span>
          </div>

          <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Mission Info */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <div className="text-xs text-rose-400 font-mono font-bold mb-1">
                  Code: {activeMission.missionCode} • Incident ID: {activeMission.incidentCode}
                </div>
                <h3 className="text-2xl font-black tracking-tight text-stone-900">
                  {activeMission.incidentTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-stone-100/90 p-3 rounded-lg border border-stone-300">
                  <div className="text-stone-500 font-bold mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Incident Pickup Location</span>
                  </div>
                  <div className="font-semibold text-stone-900">{activeMission.incidentLocation}</div>
                </div>

                <div className="bg-stone-100/90 p-3 rounded-lg border border-stone-300">
                  <div className="text-stone-500 font-bold mb-1 flex items-center gap-1.5">
                    <Hospital className="w-3.5 h-3.5 text-sky-400" />
                    <span>Assigned Destination Hospital</span>
                  </div>
                  <div className="font-semibold text-stone-900">{activeMission.hospitalName}</div>
                </div>
              </div>

              {/* Workflow stage button bar */}
              <div className="bg-cream p-3.5 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Current Stage</span>
                  <span className="text-sm font-black text-amber-400 font-mono">{activeMission.status}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigateTab('maps')}
                    className="bg-sky-600 hover:bg-sky-500 text-stone-900 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open Navigation</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab('current_mission')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow"
                  >
                    <span>Manage Workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Telemetry Metrics */}
            <div className="lg:col-span-4 bg-cream/80 p-4 rounded-xl border border-stone-200 flex flex-col justify-between space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white p-3 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-500 block font-mono">DISTANCE</span>
                  <span className="text-xl font-black text-emerald-400">{activeMission.totalDistanceKm} km</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-500 block font-mono">ESTIMATED ETA</span>
                  <span className="text-xl font-black text-amber-400">{activeMission.estimatedEtaMin} Mins</span>
                </div>
              </div>

              <div className="bg-white/90 p-3 rounded-lg border border-stone-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Green Corridor:</span>
                  <span className={activeMission.greenCorridorActive ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                    {activeMission.greenCorridorActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Patient Count:</span>
                  <span className="font-bold text-stone-900">{activeMission.patientCount} Patient(s)</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Condition:</span>
                  <span className="font-semibold text-rose-300 truncate max-w-[140px]">
                    {activeMission.patientCondition}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('vitals')}
                className="w-full bg-rose-600 hover:bg-rose-500 text-stone-900 font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-2"
              >
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Stream IoT Patient Vitals</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-stone-900">
            Ambulance {user.vehicleCallsign} Available for Dispatch
          </h3>
          <p className="text-xs text-stone-500 max-w-lg mx-auto">
            Vehicle status is live on Government Command Center & Hospital networks. Standing by for emergency alerts.
          </p>
        </div>
      )}

      {/* Grid of Crew & Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Crew Info */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Assigned Crew Members</span>
            </h4>
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono font-bold">
              2 Personnel
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 bg-cream rounded-lg">
              <div>
                <span className="text-[10px] text-stone-500 font-bold block uppercase">Driver</span>
                <span className="font-bold text-stone-900">{session.user.name}</span>
              </div>
              <a href={`tel:${session.user.phone}`} className="p-1.5 bg-emerald-100 text-emerald-400 rounded hover:bg-emerald-200">
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center justify-between p-2 bg-cream rounded-lg">
              <div>
                <span className="text-[10px] text-stone-500 font-bold block uppercase">Paramedic</span>
                <span className="font-bold text-stone-900">Paramedic Nitin Somkuwar</span>
              </div>
              <a href="tel:+919822110802" className="p-1.5 bg-emerald-100 text-emerald-400 rounded hover:bg-emerald-200">
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Vehicle Health Overview */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-sky-600" />
              <span>Vehicle Diagnostics</span>
            </h4>
            <button onClick={() => onNavigateTab('vehicle')} className="text-[10px] text-sky-600 font-bold hover:underline">
              Full Health →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-cream rounded-lg">
              <span className="text-[10px] text-stone-500 block font-medium">Engine Status</span>
              <span className="font-extrabold text-emerald-400">{vehicleHealth.engineStatus}</span>
            </div>
            <div className="p-2 bg-cream rounded-lg">
              <span className="text-[10px] text-stone-500 block font-medium">Battery Level</span>
              <span className="font-extrabold text-stone-900">{vehicleHealth.batteryPercent}%</span>
            </div>
            <div className="p-2 bg-cream rounded-lg">
              <span className="text-[10px] text-stone-500 block font-medium">O₂ Cylinder Pressure</span>
              <span className="font-extrabold text-sky-400">{vehicleHealth.oxygenCylinderBar} Bar</span>
            </div>
            <div className="p-2 bg-cream rounded-lg">
              <span className="text-[10px] text-stone-500 block font-medium">Tyre Pressure</span>
              <span className="font-extrabold text-stone-900">35 PSI Avg</span>
            </div>
          </div>
        </div>

        {/* AI EMS Recommendations */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-stone-900 p-4 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-indigo-800 pb-2">
            <h4 className="text-xs font-black text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Gemini AI EMS Assistant</span>
            </h4>
            <button onClick={() => onNavigateTab('ai_assistant')} className="text-[10px] text-indigo-300 font-bold hover:underline">
              Open AI →
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-indigo-100 text-[11px] leading-relaxed">
              "Optimal route via Samruddhi Corridor recommended. Traffic signals cleared. Prepare portable suction unit & cervical collar."
            </p>
            <div className="pt-2 border-t border-indigo-800/80 flex items-center justify-between text-[11px] font-mono text-indigo-300">
              <span>Transport Risk: Low-Moderate</span>
              <span className="text-emerald-400 font-bold">98% Confidence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
