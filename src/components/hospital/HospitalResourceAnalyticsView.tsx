import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Activity,
  BedDouble,
  Droplet,
  ShieldAlert,
  Building2,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

interface AnalyticsData {
  totalBeds: number;
  availableBeds: number;
  occupancyPercent: number;
  totalIcu: number;
  availableIcu: number;
  icuOccupancyPercent: number;
  totalVentilators: number;
  availableVentilators: number;
  ventilatorUtilizationPercent: number;
  totalBloodUnits: number;
  activeShortageAlerts: number;
  activeReservationsCount: number;
  activeTransfersCount: number;
  districtBreakdown: {
    district: string;
    hospitalsCount: number;
    totalIcu: number;
    availableIcu: number;
    icuOccupancyPercent: number;
  }[];
}

export const HospitalResourceAnalyticsView: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hospital-analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-stone-500 font-mono text-xs">
        Compiling statewide medical resource telemetry analytics...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total ICU Beds */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Statewide ICU Beds</span>
            <BedDouble className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {data.availableIcu} / {data.totalIcu} Free
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-stone-500 font-medium">Occupancy</span>
            <span className="font-extrabold text-amber-400 bg-amber-100 px-1.5 py-0.5 rounded">
              {data.icuOccupancyPercent}% Occupied
            </span>
          </div>
        </div>

        {/* Mechanical Ventilators */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Ventilator Utilization</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {data.availableVentilators} Ready
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-stone-500 font-medium">Active In Use</span>
            <span className="font-extrabold text-emerald-400 bg-emerald-100 px-1.5 py-0.5 rounded">
              {data.ventilatorUtilizationPercent}% Utilization
            </span>
          </div>
        </div>

        {/* Blood Bank Reserves */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>State Blood Bank Stock</span>
            <Droplet className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {data.totalBloodUnits} Units
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-stone-500 font-medium">Pilot Coverage</span>
            <span className="font-extrabold text-rose-400 bg-rose-100 px-1.5 py-0.5 rounded">
              7 Pilot Districts
            </span>
          </div>
        </div>

        {/* Active Bed Locks & Transfers */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Active Reservations & Transfers</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {data.activeReservationsCount} Locks • {data.activeTransfersCount} Transfers
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-stone-500 font-medium">Unresolved Alerts</span>
            <span className="font-extrabold text-rose-400 bg-rose-100 px-1.5 py-0.5 rounded">
              {data.activeShortageAlerts} Critical Alerts
            </span>
          </div>
        </div>
      </div>

      {/* District ICU Pressure Table */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-stone-600" />
            District-Level ICU Bed Capacity & Pressure Heatmap
          </h3>
          <button
            onClick={fetchAnalytics}
            className="p-1 bg-stone-100 hover:bg-stone-100 rounded text-stone-500 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {data.districtBreakdown.map((dist, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  {dist.district} District ({dist.hospitalsCount} Hospitals)
                </span>
                <span className="font-mono text-stone-500">
                  {dist.availableIcu} / {dist.totalIcu} ICU Beds Available ({dist.icuOccupancyPercent}% Occupied)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200 flex">
                <div
                  className={`h-full transition-all duration-500 ${
                    dist.icuOccupancyPercent > 85
                      ? 'bg-rose-600'
                      : dist.icuOccupancyPercent > 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${dist.icuOccupancyPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
