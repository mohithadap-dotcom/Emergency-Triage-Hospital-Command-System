import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
} from 'lucide-react';
import { FleetAnalyticsMetrics } from '../../types';

export const AmbulanceFleetAnalyticsView: React.FC = () => {
  const metrics: FleetAnalyticsMetrics = {
    avgResponseTimeMin: 6.8,
    avgTravelTimeMin: 14.2,
    missionSuccessRatePercent: 99.4,
    fuelUsageLitersTotal: 412,
    vehicleUtilizationPercent: 88,
    equipmentAvailabilityPercent: 98,
    districtCoveragePercent: 100,
    driverPerformanceScore: 96,
    paramedicPerformanceScore: 98,
    districtBreakdown: [
      { districtId: 'nagpur', districtName: 'Nagpur', totalMissions: 24, avgResponseTime: 6.2, activeFleet: 4 },
      { districtId: 'pune', districtName: 'Pune', totalMissions: 28, avgResponseTime: 7.1, activeFleet: 4 },
      { districtId: 'mumbai', districtName: 'Mumbai', totalMissions: 32, avgResponseTime: 7.8, activeFleet: 3 },
      { districtId: 'nashik', districtName: 'Nashik', totalMissions: 18, avgResponseTime: 6.5, activeFleet: 2 },
      { districtId: 'wardha', districtName: 'Wardha', totalMissions: 12, avgResponseTime: 5.9, activeFleet: 2 },
      { districtId: 'amravati', districtName: 'Amravati', totalMissions: 15, avgResponseTime: 6.1, activeFleet: 2 },
      { districtId: 'chandrapur', districtName: 'Chandrapur', totalMissions: 10, avgResponseTime: 6.4, activeFleet: 1 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white text-stone-900 p-5 rounded-2xl border border-stone-200 shadow-lg shadow-stone-300/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 rounded-xl">
            <BarChart3 className="w-6 h-6 text-stone-900" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-stone-900">
              Statewide 108 EMS Fleet Analytics & KPI Performance
            </h2>
            <p className="text-xs text-stone-600">
              Operational response metrics, hospital ER turnaround times, and fuel efficiency
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">Avg Response Time</span>
          <span className="text-3xl font-black text-emerald-600 font-mono">{metrics.avgResponseTimeMin} Mins</span>
          <span className="text-[10px] text-emerald-400 font-bold block">✓ Target &lt; 8.0 Mins</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">Avg Travel Time</span>
          <span className="text-3xl font-black text-sky-600 font-mono">{metrics.avgTravelTimeMin} Mins</span>
          <span className="text-[10px] text-sky-400 font-bold block">Green Corridor Optimized</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">Mission Success Rate</span>
          <span className="text-3xl font-black text-stone-900 font-mono">{metrics.missionSuccessRatePercent}%</span>
          <span className="text-[10px] text-stone-500 font-bold block">Zero Critical Delay</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">Fuel Usage Today</span>
          <span className="text-3xl font-black text-amber-600 font-mono">{metrics.fuelUsageLitersTotal} L</span>
          <span className="text-[10px] text-amber-400 font-bold block">Diesel Fleet Total</span>
        </div>
      </div>

      {/* District Breakdown Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-cream border-b border-stone-200 font-extrabold text-xs text-stone-800 uppercase">
          District-Wise 108 Fleet Performance Breakdown
        </div>

        <div className="divide-y divide-stone-200 text-xs">
          {metrics.districtBreakdown.map((d, i) => (
            <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-stone-900 text-sm">{d.districtName} District</span>
                <span className="block text-[10px] text-stone-500 font-mono">
                  Total Dispatches: {d.totalMissions} • Active Fleet Units: {d.activeFleet}
                </span>
              </div>

              <div className="flex items-center space-x-4 font-mono font-bold">
                <span className="text-emerald-400">Avg Response: {d.avgResponseTime} mins</span>
                <span className="bg-emerald-50 text-emerald-400 px-2.5 py-1 rounded border border-emerald-200 text-[10px]">
                  Optimal
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
