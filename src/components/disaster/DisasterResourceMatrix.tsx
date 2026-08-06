import React from 'react';
import {
  Truck,
  Droplet,
  Wind,
  Shield,
  Activity,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { DisasterIncident, Hospital } from '../../types';

interface DisasterResourceMatrixProps {
  disaster: DisasterIncident;
  hospitals: Hospital[];
}

export const DisasterResourceMatrix: React.FC<DisasterResourceMatrixProps> = ({
  disaster,
  hospitals,
}) => {
  const { resources } = disaster;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-600" />
            Command Resource Deployment & Allocation Matrix
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time status tracking for ambulances, blood units, oxygen reserves, hazmat gear, and surgical teams.
          </p>
        </div>

        <button className="bg-sky-600 hover:bg-sky-500 text-stone-900 font-extrabold text-xs px-4 py-2.5 rounded-lg shadow flex items-center gap-1.5 transition-all">
          <Plus className="w-4 h-4" />
          <span>REQUEST EMERGENCY STATE RE-ALLOCATION</span>
        </button>
      </div>

      {/* Resource Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Ambulances */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-sky-100 p-2 rounded-lg text-sky-400">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Disaster Ambulance Fleet</h3>
            </div>
            <span className="bg-sky-50 text-sky-400 text-xs font-bold px-2.5 py-1 rounded">
              ALS / BLS Units
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2">
            <span className="text-xs text-stone-500 font-bold">Units Dispatched:</span>
            <span className="text-2xl font-black text-stone-900">
              {resources.ambulancesDispatched} / {resources.ambulancesNeeded}
            </span>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(100, (resources.ambulancesDispatched / resources.ambulancesNeeded) * 100)}%`,
              }}
            ></div>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>ALS Vehicles: 14</span>
            <span>BLS Vehicles: 7</span>
          </div>
        </div>

        {/* 2. Blood Supplies */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-rose-100 p-2 rounded-lg text-rose-400">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Universal Blood Reserve (O-)</h3>
            </div>
            <span className="bg-rose-50 text-rose-400 text-xs font-bold px-2.5 py-1 rounded">
              PRBC Units
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2">
            <span className="text-xs text-stone-500 font-bold">Units Dispatched:</span>
            <span className="text-2xl font-black text-rose-950">
              {resources.bloodUnitsDispatched} / {resources.bloodUnitsNeeded}
            </span>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(100, (resources.bloodUnitsDispatched / resources.bloodUnitsNeeded) * 100)}%`,
              }}
            ></div>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Sassoon Blood Bank: 28 Units</span>
            <span>Ruby Hall: 14 Units</span>
          </div>
        </div>

        {/* 3. Oxygen Reserves */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-400">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Portable Oxygen Reserves</h3>
            </div>
            <span className="bg-emerald-50 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded">
              High-Flow Cylinders
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2">
            <span className="text-xs text-stone-500 font-bold">Cylinders Dispatched:</span>
            <span className="text-2xl font-black text-emerald-950">
              {resources.oxygenCylindersDispatched} / {resources.oxygenCylindersNeeded}
            </span>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(100, (resources.oxygenCylindersDispatched / resources.oxygenCylindersNeeded) * 100)}%`,
              }}
            ></div>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Field Camp A: 20 Cylinders</span>
            <span>Field Camp B: 15 Cylinders</span>
          </div>
        </div>

        {/* 4. Hazmat Gear */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Hazmat Chemical Protection</h3>
            </div>
            <span className="bg-amber-50 text-amber-900 text-xs font-bold px-2.5 py-1 rounded">
              Level A Suits
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2">
            <span className="text-xs text-stone-500 font-bold">Kits Deployed:</span>
            <span className="text-2xl font-black text-amber-950">
              {resources.hazmatKitsDispatched} / {resources.hazmatKitsNeeded}
            </span>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-2.5 rounded-full"
              style={{
                width: `${Math.min(100, (resources.hazmatKitsDispatched / resources.hazmatKitsNeeded) * 100)}%`,
              }}
            ></div>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>NDRF Squad 4: 5 Suits</span>
            <span>Chemical Team: 3 Suits</span>
          </div>
        </div>

        {/* 5. Trauma ICU Beds */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Trauma ICU Beds</h3>
            </div>
            <span className="bg-purple-50 text-purple-900 text-xs font-bold px-2.5 py-1 rounded">
              Statewide Reserve
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2">
            <span className="text-xs text-stone-500 font-bold">Beds Reserved:</span>
            <span className="text-2xl font-black text-purple-950">
              {resources.icuBedsReserved} / {resources.icuBedsNeeded}
            </span>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(100, (resources.icuBedsReserved / resources.icuBedsNeeded) * 100)}%`,
              }}
            ></div>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Sassoon ICU: 6 Beds</span>
            <span>Ruby Hall ICU: 6 Beds</span>
          </div>
        </div>

        {/* 6. On-Call Surgical Teams */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Trauma Surgeons</h3>
            </div>
            <span className="bg-indigo-50 text-indigo-900 text-xs font-bold px-2.5 py-1 rounded">
              Emergency OT
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2">
            <span className="text-xs text-stone-500 font-bold">Surgeons Assigned:</span>
            <span className="text-2xl font-black text-indigo-950">
              {resources.traumaSurgeonsAssigned} / {resources.traumaSurgeonsNeeded}
            </span>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(100, (resources.traumaSurgeonsAssigned / resources.traumaSurgeonsNeeded) * 100)}%`,
              }}
            ></div>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>On OT Duty: 4 Doctors</span>
            <span>Triage Field: 1 Doctor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
