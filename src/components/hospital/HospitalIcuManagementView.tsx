import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  HeartPulse,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Lock,
  UserCheck,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Hospital } from '../../types';

interface HospitalIcuManagementViewProps {
  hospital: Hospital;
  onAuditLog?: (action: string, details: string) => void;
}

export const HospitalIcuManagementView: React.FC<HospitalIcuManagementViewProps> = ({
  hospital,
  onAuditLog,
}) => {
  const [icuCategories, setIcuCategories] = useState([
    {
      name: 'Trauma & Surgical ICU',
      total: 30,
      occupied: 26,
      available: 4,
      criticalVentilated: 18,
      status: 'HIGH_DEMAND',
      headDoctor: 'Dr. Anand Mahajan',
    },
    {
      name: 'Cardiac Care Unit (CCU / CICU)',
      total: 20,
      occupied: 16,
      available: 4,
      criticalVentilated: 10,
      status: 'STABLE',
      headDoctor: 'Dr. Meera Kulkarni',
    },
    {
      name: 'Neuro Intensive Care Unit (NICU)',
      total: 15,
      occupied: 14,
      available: 1,
      criticalVentilated: 9,
      status: 'NEAR_CAPACITY',
      headDoctor: 'Dr. Rahul Verma',
    },
    {
      name: 'Pediatric ICU (PICU)',
      total: 10,
      occupied: 6,
      available: 4,
      criticalVentilated: 3,
      status: 'STABLE',
      headDoctor: 'Dr. Sunita Deshmukh',
    },
    {
      name: 'Isolation & Infection ICU',
      total: 10,
      occupied: 5,
      available: 5,
      criticalVentilated: 2,
      status: 'OPTIMAL',
      headDoctor: 'Dr. S. K. Patil',
    },
    {
      name: 'Burn Critical Care Unit',
      total: 8,
      occupied: 7,
      available: 1,
      criticalVentilated: 4,
      status: 'HIGH_DEMAND',
      headDoctor: 'Dr. V. N. Rao',
    },
  ]);

  const totalIcuBeds = icuCategories.reduce((acc, c) => acc + c.total, 0);
  const totalOccupied = icuCategories.reduce((acc, c) => acc + c.occupied, 0);
  const totalAvailable = icuCategories.reduce((acc, c) => acc + c.available, 0);
  const occupancyRate = Math.round((totalOccupied / totalIcuBeds) * 100);

  return (
    <div className="space-y-6">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Hospital ICU Capacity
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{totalIcuBeds}</span>
            <span className="text-xs font-bold text-slate-500">Beds Installed</span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Available ICU Beds
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-700">{totalAvailable}</span>
            <span className="text-xs font-bold text-emerald-600">Immediate Ready</span>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            Occupied Critical Beds
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-rose-700">{totalOccupied}</span>
            <span className="text-xs font-bold text-rose-600">{occupancyRate}% Occupancy</span>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
            ICU Ventilator Support
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-sky-800">
              {icuCategories.reduce((acc, c) => acc + c.criticalVentilated, 0)}
            </span>
            <span className="text-xs font-bold text-sky-600">Active Ventilations</span>
          </div>
        </div>
      </div>

      {/* ICU Categories Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <span>Specialized ICU Units Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live capacity monitoring across Trauma, Cardiac, Neuro, Pediatric, Isolation & Burn ICUs
            </p>
          </div>

          <button
            onClick={() => {
              if (onAuditLog) onAuditLog('ICU_MANAGEMENT', 'Refreshed live ICU sensors & occupancy telemetry');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync ICU Sensors</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {icuCategories.map((cat) => {
            const catOccupancy = Math.round((cat.occupied / cat.total) * 100);
            return (
              <div
                key={cat.name}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">In-Charge: {cat.headDoctor}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      catOccupancy >= 90
                        ? 'bg-rose-100 text-rose-800'
                        : catOccupancy >= 75
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {catOccupancy}% Occupied
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      catOccupancy >= 90 ? 'bg-rose-600' : catOccupancy >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${catOccupancy}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-1 text-[11px] font-bold pt-1">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-400 block uppercase">Total</span>
                    <span className="text-slate-900">{cat.total}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[9px] text-emerald-600 block uppercase">Available</span>
                    <span className="text-emerald-700">{cat.available}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[9px] text-sky-600 block uppercase">Ventilated</span>
                    <span className="text-sky-800">{cat.criticalVentilated}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
