import React from 'react';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { District, Hospital } from '../types';

interface AnalyticsProps {
  districts: District[];
  hospitals: Hospital[];
}

export const AnalyticsView: React.FC<AnalyticsProps> = ({ districts, hospitals }) => {
  // Chart 1 Data: District Emergencies vs ICU Availability
  const districtChartData = districts.map((d) => ({
    name: d.name,
    emergencies: d.currentEmergencies,
    icuBedsFree: d.availableIcuBeds,
    totalIcu: d.totalIcuBeds,
    responseTime: d.avgResponseTimeMin,
  }));

  // Chart 2 Data: Response Time trend across hours
  const responseTimeTrend = [
    { hour: '04:00', avgMin: 14.2 },
    { hour: '05:00', avgMin: 13.5 },
    { hour: '06:00', avgMin: 12.8 },
    { hour: '07:00', avgMin: 11.9 },
    { hour: '08:00', avgMin: 11.2 },
    { hour: '09:00', avgMin: 10.8 },
  ];

  // Chart 3 Data: Hospital Type Distribution
  const typeCounts = hospitals.reduce((acc: Record<string, number>, h) => {
    acc[h.type] = (acc[h.type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(typeCounts).map((type) => ({
    name: type,
    value: typeCounts[type],
  }));

  const COLORS = ['#0284C7', '#D97706', '#16A34A', '#7C3AED'];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-sky-700" />
          State Emergency Analytics & Response Intelligence
        </h2>
        <p className="text-xs text-slate-500">
          Statewide comparative analysis of response times, ICU bed occupancy ratios & healthcare capacity stress factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* District Active Emergencies vs ICU Availability Bar Chart */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-700" />
            District Active Emergencies vs Available ICU Beds
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="emergencies" name="Emergencies" fill="#DC2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="icuBedsFree" name="Available ICU Beds" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 108 Fleet Response Time Trend Line Chart */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            MEMS 108 Average Dispatch Response Time (Minutes)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[8, 16]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="avgMin"
                  name="Avg Response Time (Min)"
                  stroke="#16A34A"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#16A34A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
