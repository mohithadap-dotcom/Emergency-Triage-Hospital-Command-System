import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { HospitalResourceForecast } from '../../types';

interface HospitalForecastingViewProps {
  forecasts: HospitalResourceForecast[];
}

export const HospitalForecastingView: React.FC<HospitalForecastingViewProps> = ({ forecasts }) => {
  const [selectedHospital, setSelectedHospital] = useState<HospitalResourceForecast | null>(forecasts[0] || null);
  const [forecastHorizon, setForecastHorizon] = useState<'30m' | '1h' | '2h' | '6h' | '24h'>('1h');
  const [chartGranularity, setChartGranularity] = useState<'HOURLY' | 'DAILY' | 'WEEKLY'>('HOURLY');

  const currentHospital = selectedHospital || forecasts[0];

  const getHorizonData = (h: HospitalResourceForecast) => {
    switch (forecastHorizon) {
      case '30m':
        return h.horizon30m;
      case '1h':
        return h.horizon1h;
      case '2h':
        return h.horizon2h;
      case '6h':
        return h.horizon6h;
      case '24h':
      default:
        return h.horizon24h;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-black text-white tracking-wide">Multi-Hospital AI Capacity Forecasting Engine</h3>
            <span className="text-[10px] bg-sky-950 text-sky-300 font-mono px-2 py-0.5 rounded border border-sky-700">
              PREDICTIVE HORIZONS: 30M TO 24H
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous predictive modeling for ICU occupancy, mechanical ventilator demand, emergency admissions, OT load & doctor shortages.
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs font-bold">
          {(['30m', '1h', '2h', '6h', '24h'] as const).map((hz) => (
            <button
              key={hz}
              onClick={() => setForecastHorizon(hz)}
              className={`px-2.5 py-1 rounded transition ${
                forecastHorizon === hz ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {hz.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Hospital Selection Cards */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center justify-between border-b pb-2">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-600" />
              State Tertiary Hospitals ({forecasts.length})
            </span>
          </h4>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {forecasts.map((h) => {
              const isSelected = currentHospital?.hospitalId === h.hospitalId;
              const hData = getHorizonData(h);
              const isShortage = h.predictedShortages.icuExhaustion || h.predictedShortages.ventilatorShortage;

              return (
                <div
                  key={h.hospitalId}
                  onClick={() => setSelectedHospital(h)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected ? 'border-sky-600 bg-sky-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-black text-slate-900 block text-sm">{h.hospitalName}</span>
                      <span className="text-[11px] text-slate-500 block">{h.district} District</span>
                    </div>

                    {isShortage ? (
                      <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded text-[10px] font-black animate-pulse">
                        CRITICAL SHORTAGE
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        CAPACITY STABLE
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t border-slate-100 text-center text-[10px]">
                    <div className="bg-slate-50 p-1 rounded">
                      <span className="text-slate-400 block">ICU Occupancy</span>
                      <span className={`font-black ${hData.icuOccupancy > 90 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {hData.icuOccupancy}%
                      </span>
                    </div>

                    <div className="bg-slate-50 p-1 rounded">
                      <span className="text-slate-400 block">Ventilators</span>
                      <span className="font-bold text-slate-800">{hData.ventilatorDemand} Needed</span>
                    </div>

                    <div className="bg-slate-50 p-1 rounded">
                      <span className="text-slate-400 block">Exhaustion</span>
                      <span className="font-black text-amber-600">{h.timeToExhaustionMin || 60}m</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Forecast Dashboard */}
        {currentHospital && (
          <div className="lg:col-span-2 space-y-4">
            {/* Hospital Overview Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900">{currentHospital.hospitalName}</h3>
                  <p className="text-xs text-slate-500">
                    District: <strong>{currentHospital.district}</strong> • Target Horizon: <strong>{forecastHorizon.toUpperCase()}</strong>
                  </p>
                </div>

                {currentHospital.timeToExhaustionMin && (
                  <div className="bg-rose-950 text-rose-100 px-3 py-1.5 rounded-lg border border-rose-800 text-right">
                    <span className="text-[10px] text-rose-300 block font-mono uppercase">ICU Exhaustion Time</span>
                    <span className="text-sm font-black text-rose-400 flex items-center gap-1 justify-end animate-pulse">
                      <Clock className="w-4 h-4 text-rose-400" />
                      {currentHospital.timeToExhaustionMin} MINUTES
                    </span>
                  </div>
                )}
              </div>

              {/* Horizon Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Predicted ICU Occupancy</span>
                  <span className="text-xl font-black text-rose-400 mt-1 block">
                    {getHorizonData(currentHospital).icuOccupancy}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">High Overload Risk</span>
                </div>

                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Ventilator Demand</span>
                  <span className="text-xl font-black text-amber-400 mt-1 block">
                    {getHorizonData(currentHospital).ventilatorDemand} Units
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Mechanical Ventilation</span>
                </div>

                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">OT Demand</span>
                  <span className="text-xl font-black text-sky-400 mt-1 block">
                    {getHorizonData(currentHospital).otDemand} Theatres
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Emergency Surgeries</span>
                </div>

                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Emergency Admissions</span>
                  <span className="text-xl font-black text-emerald-400 mt-1 block">
                    +{getHorizonData(currentHospital).emergencyVolume} Patients
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Predicted Surge</span>
                </div>
              </div>

              {/* Resource Shortages Status Matrix */}
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Resource Shortage Warning System</span>
                  <span className="text-[10px] font-mono text-slate-500">AI DETECTED RISKS</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div
                    className={`p-2 rounded border flex items-center gap-2 ${
                      currentHospital.predictedShortages.icuExhaustion
                        ? 'bg-rose-100 border-rose-300 text-rose-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <div>
                      <span className="block text-[11px]">ICU Beds</span>
                      <span className="text-[10px] font-black">{currentHospital.predictedShortages.icuExhaustion ? 'EXHAUSTION' : 'ADEQUATE'}</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded border flex items-center gap-2 ${
                      currentHospital.predictedShortages.ventilatorShortage
                        ? 'bg-rose-100 border-rose-300 text-rose-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <div>
                      <span className="block text-[11px]">Ventilators</span>
                      <span className="text-[10px] font-black">{currentHospital.predictedShortages.ventilatorShortage ? 'DEFICIT' : 'ADEQUATE'}</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded border flex items-center gap-2 ${
                      currentHospital.predictedShortages.bloodShortage
                        ? 'bg-rose-100 border-rose-300 text-rose-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <div>
                      <span className="block text-[11px]">O- Blood Units</span>
                      <span className="text-[10px] font-black">{currentHospital.predictedShortages.bloodShortage ? 'CRITICAL LOW' : 'STABLE'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Charts Granularity Toggle */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 tracking-wide flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-sky-600" />
                    <span>Resource Demand Forecast Charts</span>
                  </h4>

                  <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-[11px] font-bold">
                    {(['HOURLY', 'DAILY', 'WEEKLY'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setChartGranularity(g)}
                        className={`px-2 py-0.5 rounded transition ${
                          chartGranularity === g ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Chart Data */}
                {chartGranularity === 'HOURLY' && (
                  <div className="bg-slate-900 text-white p-3 rounded-md border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-400 block font-mono">HOURLY EMERGENCY ADMISSIONS & ICU DEMAND</span>
                    <div className="grid grid-cols-6 gap-2 text-center text-xs">
                      {currentHospital.hourlyForecast.map((item, idx) => (
                        <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-800">
                          <span className="text-[10px] text-sky-400 block font-bold">{item.hour}</span>
                          <span className="text-xs font-black text-amber-300 block">+{item.admissions} Adm</span>
                          <span className="text-[10px] text-rose-400 block">ICU {item.icuOccupancy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {chartGranularity === 'DAILY' && (
                  <div className="bg-slate-900 text-white p-3 rounded-md border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-400 block font-mono">7-DAY DAILY DOCTOR & NURSE STAFFING DEMAND</span>
                    <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                      {currentHospital.dailyForecast.map((item, idx) => (
                        <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-800">
                          <span className="text-[10px] text-slate-300 block font-bold">{item.day}</span>
                          <span className="text-xs font-black text-sky-300 block">{item.admissions} Adm</span>
                          <span className="text-[10px] text-emerald-400 block">{item.doctorDemand} Docs</span>
                          <span className="text-[10px] text-purple-300 block">{item.nurseDemand} Nurses</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {chartGranularity === 'WEEKLY' && (
                  <div className="bg-slate-900 text-white p-3 rounded-md border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-400 block font-mono">MONTHLY 4-WEEK EMERGENCY VOLUME TREND</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {currentHospital.weeklyForecast.map((item, idx) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded border border-slate-800">
                          <span className="text-[10px] text-amber-400 block font-extrabold">{item.week}</span>
                          <span className="text-sm font-black text-sky-300 block">{item.emergencyVolume} Cases</span>
                          <span className="text-[10px] text-rose-400 block">Avg ICU {item.icuOccupancy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
