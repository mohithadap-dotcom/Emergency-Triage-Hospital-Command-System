import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Hospital,
  Shield,
  Zap,
  RotateCw,
  AlertCircle,
  Eye,
  Compass,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { AmbulanceMission } from '../../types';

interface AmbulanceGoogleMapsViewProps {
  mission: AmbulanceMission | null;
  onUpdateLocation?: (lat: number, lng: number, speed: number, heading: number) => Promise<void>;
}

export const AmbulanceGoogleMapsView: React.FC<AmbulanceGoogleMapsViewProps> = ({
  mission,
  onUpdateLocation,
}) => {
  const [trafficLevel, setTrafficLevel] = useState<'MODERATE' | 'HEAVY' | 'GREEN_CORRIDOR_CLEAR'>('GREEN_CORRIDOR_CLEAR');
  const [useAlternativeRoute, setUseAlternativeRoute] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [vehicleOffset, setVehicleOffset] = useState({ latOffset: 0, lngOffset: 0 });

  // Simulated movement along route
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setVehicleOffset((prev) => ({
        latOffset: (prev.latOffset + 0.0004) % 0.008,
        lngOffset: (prev.lngOffset + 0.0004) % 0.008,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const originCoords = mission?.incidentCoords || { lat: 18.5204, lng: 73.8567 };
  const destCoords = mission?.hospitalCoords || { lat: 18.5284, lng: 73.8732 };

  const currentLat = originCoords.lat + vehicleOffset.latOffset;
  const currentLng = originCoords.lng + vehicleOffset.lngOffset;

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl font-bold">
            <Navigation className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black tracking-tight text-white">
                Live Google Maps GIS Navigation & Corridor
              </h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                GPS LIVE TRANSMITTING
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Corridor Signals: Green Light Override Active • Speed: 68 km/h • Heading: 045° NE
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setTrafficLevel(trafficLevel === 'GREEN_CORRIDOR_CLEAR' ? 'MODERATE' : 'GREEN_CORRIDOR_CLEAR')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition ${
              trafficLevel === 'GREEN_CORRIDOR_CLEAR'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-amber-500 text-slate-950 border-amber-400'
            }`}
          >
            Corridor: {trafficLevel === 'GREEN_CORRIDOR_CLEAR' ? 'GREEN CLEAR' : 'HEAVY TRAFFIC'}
          </button>

          <button
            onClick={() => setUseAlternativeRoute(!useAlternativeRoute)}
            className={`px-3 py-1.5 rounded-lg border font-bold transition ${
              useAlternativeRoute
                ? 'bg-sky-500 text-slate-950 border-sky-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {useAlternativeRoute ? 'Route B (Bypass)' : 'Route A (Direct)'}
          </button>
        </div>
      </div>

      {/* Main Map Visual Canvas Area */}
      <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[480px] flex flex-col justify-between">
        {/* Top Floating Map Telemetry Overlay */}
        <div className="p-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent">
          <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-xs text-white space-y-1">
            <div className="font-bold text-amber-400 font-mono">
              Current GPS: {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
            </div>
            <div className="text-[11px] text-slate-300">
              Heading to: <strong className="text-white">{mission?.hospitalName || 'Ruby Hall Clinic'}</strong>
            </div>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <div className="bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">Distance Remaining</span>
              <span className="text-base font-black text-emerald-400">
                {mission ? (mission.totalDistanceKm - 1.2).toFixed(1) : '4.2'} km
              </span>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">Estimated ETA</span>
              <span className="text-base font-black text-amber-400">
                {mission ? Math.max(1, mission.estimatedEtaMin - 1) : '5'} Mins
              </span>
            </div>
          </div>
        </div>

        {/* Center Graphic Simulation of Navigation Map */}
        <div className="absolute inset-0 flex items-center justify-center p-8 opacity-90 pointer-events-none">
          <div className="w-full h-full max-w-4xl border border-emerald-500/20 rounded-2xl relative bg-slate-900/40 p-6 flex flex-col justify-between">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

            {/* Route Line Graphic */}
            <svg className="absolute inset-0 w-full h-full stroke-emerald-400 stroke-[3] fill-none" style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}>
              <path
                d={
                  useAlternativeRoute
                    ? 'M 100 320 C 250 180, 450 380, 700 120'
                    : 'M 100 320 Q 350 200, 700 120'
                }
                strokeDasharray="8 6"
                className="animate-pulse"
              />
            </svg>

            {/* Start Node: Incident Scene */}
            <div className="absolute left-[10%] bottom-[20%] bg-rose-600 text-white p-2.5 rounded-xl shadow-xl border border-rose-400 flex items-center space-x-2 text-xs font-bold">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Incident Scene</span>
            </div>

            {/* Moving Animated Vehicle Pin */}
            <div
              className="absolute bg-emerald-500 text-slate-950 p-3 rounded-full shadow-2xl border-2 border-white flex items-center justify-center transition-all duration-700 font-black text-xs z-20"
              style={{
                left: useAlternativeRoute ? '45%' : '48%',
                top: useAlternativeRoute ? '42%' : '48%',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.8)',
              }}
            >
              <Navigation className="w-5 h-5 fill-slate-950 animate-bounce" />
            </div>

            {/* Destination Node: Hospital */}
            <div className="absolute right-[10%] top-[15%] bg-sky-600 text-white p-2.5 rounded-xl shadow-xl border border-sky-400 flex items-center space-x-2 text-xs font-bold">
              <Hospital className="w-4 h-4 text-white" />
              <span>{mission?.hospitalName || 'Ruby Hall Clinic'}</span>
            </div>

            {/* Green Corridor Signals Indicator */}
            <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-emerald-500/40 p-3 rounded-xl text-xs text-emerald-300 space-y-1 font-mono">
              <div className="flex items-center space-x-2 font-bold text-white">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Green Corridor Signal Automation</span>
              </div>
              <div>Intersections 1 to 6 overridden to GREEN. Traffic diverted.</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quick Route Details */}
        <div className="p-4 z-10 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 font-mono">
          <div className="flex items-center space-x-4">
            <span>Route: <strong className="text-white">{useAlternativeRoute ? 'NH-48 Katraj Bypass (6.8 km)' : 'Direct Expressway Corridor (5.2 km)'}</strong></span>
            <span>Speed: <strong className="text-emerald-400">68 km/h</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">✓ Live Sync with Hospital ER</span>
          </div>
        </div>
      </div>
    </div>
  );
};
