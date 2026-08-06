import React, { useState } from 'react';
import {
  MapPin,
  ShieldAlert,
  Flame,
  Truck,
  Building2,
  Zap,
  Layers,
  Crosshair,
  Navigation,
  Radio,
} from 'lucide-react';
import { DisasterIncident, Hospital, Ambulance, FieldHospital } from '../../types';

interface DisasterGisMapViewProps {
  disaster: DisasterIncident;
  hospitals: Hospital[];
  ambulances: Ambulance[];
  fieldHospitals: FieldHospital[];
}

export const DisasterGisMapView: React.FC<DisasterGisMapViewProps> = ({
  disaster,
  hospitals,
  ambulances,
  fieldHospitals,
}) => {
  const [showExclusionZone, setShowExclusionZone] = useState(true);
  const [showGreenCorridor, setShowGreenCorridor] = useState(true);
  const [showFieldUnits, setShowFieldUnits] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);

  return (
    <div className="space-y-4">
      {/* Top Map Controls Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 text-stone-900 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400 animate-bounce" />
            Disaster Command GIS Spatial Operations Map ({disaster.districtName} Sector)
          </h2>
          <p className="text-xs text-stone-500">
            Real-time tracking of Red Exclusion Zone ({disaster.radiusKm} km radius), Emergency Green Corridor, and Receiving Hospitals.
          </p>
        </div>

        {/* GIS Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowExclusionZone(!showExclusionZone)}
            className={`px-2.5 py-1.5 rounded font-bold border transition-colors ${
              showExclusionZone
                ? 'bg-rose-950 text-rose-300 border-rose-600'
                : 'bg-stone-100 text-stone-500 border-stone-300'
            }`}
          >
            Red Zone ({disaster.radiusKm} km)
          </button>
          <button
            onClick={() => setShowGreenCorridor(!showGreenCorridor)}
            className={`px-2.5 py-1.5 rounded font-bold border transition-colors ${
              showGreenCorridor
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : 'bg-stone-100 text-stone-500 border-stone-300'
            }`}
          >
            Green Corridor
          </button>
          <button
            onClick={() => setShowFieldUnits(!showFieldUnits)}
            className={`px-2.5 py-1.5 rounded font-bold border transition-colors ${
              showFieldUnits
                ? 'bg-amber-950 text-amber-100 border-amber-600'
                : 'bg-stone-100 text-stone-500 border-stone-300'
            }`}
          >
            Field Tents ({fieldHospitals.length})
          </button>
          <button
            onClick={() => setShowAmbulances(!showAmbulances)}
            className={`px-2.5 py-1.5 rounded font-bold border transition-colors ${
              showAmbulances
                ? 'bg-sky-950 text-sky-300 border-sky-600'
                : 'bg-stone-100 text-stone-500 border-stone-300'
            }`}
          >
            Ambulances ({ambulances.length})
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas Container */}
      <div className="relative w-full h-[520px] bg-cream rounded-xl overflow-hidden border border-stone-200 shadow-lg shadow-stone-300/40 flex items-center justify-center">
        {/* Simulated High-Tech Tactical Radar Map Visualizer */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        {/* Circular Exclusion Radius Overlay */}
        {showExclusionZone && (
          <div className="absolute w-72 h-72 rounded-full border-2 border-rose-500 bg-rose-500/10 animate-pulse flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono text-rose-400 font-bold bg-cream/80 px-2 py-0.5 rounded border border-rose-500">
              EXCLUSION ZONE RADIUS ({disaster.radiusKm} KM)
            </span>
          </div>
        )}

        {/* Outer Perimeter Staging Ring */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-amber-500/40 pointer-events-none flex items-start justify-center pt-2">
          <span className="text-[9px] font-mono text-amber-400 font-bold bg-white px-2 py-0.5 rounded">
            STAGING PERIMETER & TRAFFIC DIVERSION LINE
          </span>
        </div>

        {/* Center Disaster Epicenter Pin */}
        <div className="absolute z-20 flex flex-col items-center">
          <div className="bg-rose-600 text-stone-900 p-2.5 rounded-full shadow-lg shadow-stone-300/50 border-2 border-white animate-bounce">
            <Flame className="w-6 h-6 text-stone-900" />
          </div>
          <div className="bg-cream text-amber-400 border border-amber-500 text-xs font-black px-2.5 py-1 rounded shadow mt-1">
            EPICENTER: {disaster.locationName}
          </div>
        </div>

        {/* Green Corridor Vectors */}
        {showGreenCorridor && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Draw emergency line */}
            <svg className="w-full h-full absolute">
              <line
                x1="25%"
                y1="30%"
                x2="50%"
                y2="50%"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
              <line
                x1="50%"
                y1="50%"
                x2="78%"
                y2="75%"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
            </svg>
            <div className="absolute top-[28%] left-[23%] bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
              GREEN CORRIDOR #1: Sassoon Trauma Route
            </div>
            <div className="absolute bottom-[22%] right-[18%] bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
              GREEN CORRIDOR #2: Ruby Hall Expressway Link
            </div>
          </div>
        )}

        {/* Field Hospital Tents */}
        {showFieldUnits &&
          fieldHospitals.map((fh, idx) => (
            <div
              key={fh.id}
              className={`absolute z-10 flex flex-col items-center ${
                idx === 0 ? 'top-[42%] left-[32%]' : 'bottom-[35%] left-[40%]'
              }`}
            >
              <div className="bg-amber-500 text-slate-950 p-1.5 rounded-md shadow border border-white font-bold text-[10px] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>FIELD TENT #{idx + 1}</span>
              </div>
              <span className="text-[9px] text-amber-100 bg-white/90 px-1.5 py-0.5 rounded mt-0.5 font-mono">
                {fh.occupiedBeds}/{fh.totalCapacity} Beds
              </span>
            </div>
          ))}

        {/* Active Ambulances */}
        {showAmbulances &&
          ambulances.slice(0, 5).map((amb, idx) => (
            <div
              key={amb.id}
              className={`absolute z-10 flex flex-col items-center ${
                idx === 0
                  ? 'top-[36%] left-[42%]'
                  : idx === 1
                  ? 'top-[58%] left-[55%]'
                  : idx === 2
                  ? 'top-[65%] left-[68%]'
                  : 'top-[30%] left-[60%]'
              }`}
            >
              <div className="bg-sky-600 text-stone-900 p-1.5 rounded-full shadow-lg border border-sky-300 animate-pulse">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] text-sky-200 bg-cream px-1.5 py-0.5 rounded mt-0.5 font-mono font-bold">
                {amb.registrationNo} (ALS)
              </span>
            </div>
          ))}

        {/* Receiving Trauma Hospitals */}
        {hospitals.slice(0, 3).map((h, idx) => (
          <div
            key={h.id}
            className={`absolute z-10 flex flex-col items-center ${
              idx === 0
                ? 'top-[22%] left-[18%]'
                : idx === 1
                ? 'bottom-[15%] right-[15%]'
                : 'top-[18%] right-[22%]'
            }`}
          >
            <div className="bg-indigo-600 text-stone-900 p-2 rounded-lg shadow-lg shadow-stone-300/40 border-2 border-indigo-300 flex items-center gap-1">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-[11px]">{h.name}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-cream border border-stone-200 px-2 py-0.5 rounded mt-0.5 font-bold">
              {h.availableIcuBeds} ICU Beds Free • ER: {h.emergencyDeptStatus}
            </span>
          </div>
        ))}

        {/* Live Legend Box */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md border border-stone-200 rounded-lg p-3 text-xs text-stone-600 space-y-1.5 shadow-lg shadow-stone-300/40 pointer-events-auto">
          <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wider mb-1 border-b border-stone-200 pb-1">
            GIS Tactical Legend
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-600"></span>
            <span>Disaster Epicenter & Red Exclusion Radius</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Automated Green Corridor Priority Highway Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span>Forward Field Triage Camps & Mobile ICU Tents</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-indigo-600"></span>
            <span>Level-1 / Tier-1 Receiving Trauma Centers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
