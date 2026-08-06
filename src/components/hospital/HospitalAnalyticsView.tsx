import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Clock,
  BedDouble,
  HeartPulse,
} from 'lucide-react';
import { Hospital } from '../../types';

interface HospitalAnalyticsViewProps {
  hospital: Hospital;
}

export const HospitalAnalyticsView: React.FC<HospitalAnalyticsViewProps> = ({ hospital }) => {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            <span>Hospital Emergency Performance & Resource Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical response times, bed occupancy trends, doctor workloads, and emergency admissions for {hospital.name}
          </p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Door-to-Doctor Time</span>
            <span className="text-2xl font-black text-slate-900">8.4 Mins</span>
            <span className="text-[10px] text-emerald-600 font-bold block">↓ 1.2 mins faster than state avg</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">ICU Turnover Rate</span>
            <span className="text-2xl font-black text-sky-700">92.6%</span>
            <span className="text-[10px] text-sky-600 font-bold block">Optimal patient flow</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Emergency Admissions (24h)</span>
            <span className="text-2xl font-black text-rose-700">34 Patients</span>
            <span className="text-[10px] text-rose-600 font-bold block">14 STEMI / Polytrauma cases</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Ventilator Utilization Rate</span>
            <span className="text-2xl font-black text-indigo-700">85.0%</span>
            <span className="text-[10px] text-indigo-600 font-bold block">6 Units currently available</span>
          </div>
        </div>
      </div>
    </div>
  );
};
