import React from 'react';
import {
  Gauge,
  Fuel,
  BatteryCharging,
  Activity,
  AlertCircle,
  CheckCircle2,
  Wrench,
  ShieldAlert,
  Wind,
  Zap,
} from 'lucide-react';
import { VehicleHealthStatus } from '../../types';

interface AmbulanceVehicleHealthViewProps {
  health: VehicleHealthStatus;
}

export const AmbulanceVehicleHealthView: React.FC<AmbulanceVehicleHealthViewProps> = ({
  health,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-600 rounded-xl">
            <Gauge className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black tracking-tight text-white">
                Vehicle Health & Mechanical Telemetry
              </h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                SYSTEM OPTIMAL
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Unit: {health.registrationNo} • Last Serviced: {health.lastServiceDate} • Next Maintenance: {health.nextMaintenanceDue}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Engine Health</span>
            <span className="text-sm font-black text-emerald-400">{health.engineStatus}</span>
          </div>
        </div>
      </div>

      {/* Main Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Fuel & Battery */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <Fuel className="w-4 h-4 text-emerald-600" />
            <span>Fuel & Auxiliary Power</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Diesel Tank Fuel Level</span>
                <span className="text-emerald-700 font-mono">{health.fuelLevelPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${health.fuelLevelPercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Dual Auxiliary Batteries</span>
                <span className="text-sky-700 font-mono">{health.batteryPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all"
                  style={{ width: `${health.batteryPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Oxygen & Life Support Power */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <Wind className="w-4 h-4 text-sky-600" />
            <span>Oxygen & Medical Power</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-700">Main O₂ Cylinder Bar Pressure</span>
              <span className="font-mono font-black text-sky-700 text-sm">{health.oxygenCylinderBar} Bar</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-700">Portable Ventilator Status</span>
              <span className="font-bold text-emerald-700">{health.ventilatorStatus}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-700">Defibrillator Readiness</span>
              <span className="font-bold text-emerald-700">{health.defibrillatorStatus}</span>
            </div>
          </div>
        </div>

        {/* Tyre Pressures & Mechanicals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <Wrench className="w-4 h-4 text-slate-700" />
            <span>Tyre Pressure Diagnostics (PSI)</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono font-bold">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">Front Left</span>
              <span className="text-emerald-700 text-sm">{health.tyrePressurePsi.frontLeft} PSI</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">Front Right</span>
              <span className="text-emerald-700 text-sm">{health.tyrePressurePsi.frontRight} PSI</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">Rear Left</span>
              <span className="text-emerald-700 text-sm">{health.tyrePressurePsi.rearLeft} PSI</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">Rear Right</span>
              <span className="text-emerald-700 text-sm">{health.tyrePressurePsi.rearRight} PSI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
