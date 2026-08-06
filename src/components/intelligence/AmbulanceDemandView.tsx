import React, { useState } from 'react';
import {
  Truck,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { AmbulanceDemandForecast } from '../../types';

interface AmbulanceDemandViewProps {
  forecasts: AmbulanceDemandForecast[];
}

export const AmbulanceDemandView: React.FC<AmbulanceDemandViewProps> = ({ forecasts }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<AmbulanceDemandForecast | null>(forecasts[0] || null);
  const [targetHorizon, setTargetHorizon] = useState<'30m' | '1h' | '2h' | '6h' | '24h'>('1h');

  const currentDist = selectedDistrict || forecasts[0];

  const getHorizonData = (f: AmbulanceDemandForecast) => {
    switch (targetHorizon) {
      case '30m':
        return f.forecast30m;
      case '1h':
        return f.forecast1h;
      case '2h':
        return f.forecast2h;
      case '6h':
        return f.forecast6h;
      case '24h':
      default:
        return f.forecast24h;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white text-stone-900 p-4 rounded-lg border border-stone-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-stone-900 tracking-wide">AI Statewide Ambulance Demand & Fleet Redistribution Engine</h3>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-700">
              REAL-TIME DISPATCH OPTIMIZATION
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Predictive emergency dispatch volume, traffic bottleneck impact, response time forecasting & inter-district fleet re-balancing.
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center space-x-1 bg-cream p-1 rounded border border-stone-200 text-xs font-bold">
          {(['30m', '1h', '2h', '6h', '24h'] as const).map((hz) => (
            <button
              key={hz}
              onClick={() => setTargetHorizon(hz)}
              className={`px-2.5 py-1 rounded transition ${
                targetHorizon === hz ? 'bg-indigo-600 text-stone-900 shadow' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {hz.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* District Fleet List */}
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm space-y-3">
          <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider flex items-center border-b pb-2">
            <Truck className="w-4 h-4 text-indigo-600 mr-1.5" />
            <span>District Fleet Status ({forecasts.length})</span>
          </h4>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {forecasts.map((f) => {
              const isSelected = currentDist?.districtId === f.districtId;
              const hData = getHorizonData(f);

              return (
                <div
                  key={f.districtId}
                  onClick={() => setSelectedDistrict(f)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-stone-200 hover:border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-black text-stone-900 block text-sm">{f.districtName} District</span>
                      <span className="text-[11px] text-stone-500 block">
                        Available: <strong>{f.currentAvailableAmbulances}</strong> • Busy: <strong>{f.currentBusyAmbulances}</strong>
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        f.trafficImpactIndex === 'CONGESTED' || f.trafficImpactIndex === 'HEAVY'
                          ? 'bg-rose-100 text-rose-400 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-400 border border-emerald-300'
                      }`}
                    >
                      {f.trafficImpactIndex} TRAFFIC
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t border-slate-100 text-center text-[10px]">
                    <div className="bg-cream p-1 rounded">
                      <span className="text-stone-500 block">Pred. Busy</span>
                      <span className="font-black text-stone-800">{hData.busyUnits} Units</span>
                    </div>

                    <div className="bg-cream p-1 rounded">
                      <span className="text-stone-500 block">Surge %</span>
                      <span className="font-black text-amber-600">+{hData.demandSurgePercent}%</span>
                    </div>

                    <div className="bg-cream p-1 rounded">
                      <span className="text-stone-500 block">Response ETA</span>
                      <span className="font-black text-sky-600">{hData.responseTimeMin}m</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* District Detail & Redistribution Recommendations */}
        {currentDist && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
                <div>
                  <h3 className="text-base font-black text-stone-900">{currentDist.districtName} District Fleet Intelligence</h3>
                  <p className="text-xs text-stone-500">
                    District Coverage: <strong>{currentDist.districtCoveragePercent}%</strong> • 24h Expected Volume:{' '}
                    <strong>{currentDist.expectedDispatchVolume24h} Dispatches</strong>
                  </p>
                </div>

                <div className="bg-white text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 text-right">
                  <span className="text-[10px] text-stone-500 block uppercase font-mono">Predicted Response Time</span>
                  <span className="text-sm font-black text-amber-400 flex items-center gap-1 justify-end">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {getHorizonData(currentDist).responseTimeMin} MIN
                  </span>
                </div>
              </div>

              {/* Horizon Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white text-stone-900 p-3 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Current Available Units</span>
                  <span className="text-xl font-black text-emerald-400 mt-1 block">
                    {currentDist.currentAvailableAmbulances} Units
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">MEMS 108 Fleet</span>
                </div>

                <div className="bg-white text-stone-900 p-3 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Current Busy / Transmitting</span>
                  <span className="text-xl font-black text-amber-400 mt-1 block">
                    {currentDist.currentBusyAmbulances} Units
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">Active Mission</span>
                </div>

                <div className="bg-white text-stone-900 p-3 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Forecast Busy ({targetHorizon.toUpperCase()})</span>
                  <span className="text-xl font-black text-rose-400 mt-1 block">
                    {getHorizonData(currentDist).busyUnits} Units
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">Predicted Active</span>
                </div>

                <div className="bg-white text-stone-900 p-3 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Demand Surge Spike</span>
                  <span className="text-xl font-black text-sky-400 mt-1 block">
                    +{getHorizonData(currentDist).demandSurgePercent}%
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">Above Baseline</span>
                </div>
              </div>

              {/* Recommended Fleet Redistribution */}
              <div className="bg-indigo-50/70 p-3.5 rounded-md border border-indigo-200 space-y-2">
                <h4 className="text-xs font-black text-indigo-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI Recommended Inter-District Fleet Redistribution
                  </span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-mono">
                    CONFIDENCE 96%
                  </span>
                </h4>

                <div className="space-y-2">
                  {currentDist.recommendedVehicleRedistribution.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border border-indigo-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-stone-900 flex items-center gap-1">
                          Move {item.unitsToMove} {item.vehicleType} Ambulance(s):
                          <span className="text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {item.sourceDistrict}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-emerald-400 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {item.targetDistrict}
                          </span>
                        </span>
                      </div>

                      <p className="text-stone-500 text-[11px] leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
