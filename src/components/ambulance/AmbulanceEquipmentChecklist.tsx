import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  AlertCircle,
  Wrench,
  RefreshCw,
  Plus,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { MedicalEquipmentItem } from '../../types';

export const AmbulanceEquipmentChecklist: React.FC = () => {
  const [items, setItems] = useState<MedicalEquipmentItem[]>([
    {
      id: 'eq-101',
      name: 'Hamilton-T1 Portable Transport Ventilator',
      category: 'LIFE_SUPPORT',
      serialNo: 'HT1-2026-901',
      status: 'CHECKED_IN',
      batteryOrLevelPercent: 98,
      lastCheckedBy: 'Paramedic Nitin Somkuwar',
      lastCheckedTimestamp: '08:00 AM',
    },
    {
      id: 'eq-102',
      name: 'ZOLL X Series Advanced Defibrillator / Monitor',
      category: 'LIFE_SUPPORT',
      serialNo: 'ZLX-2025-412',
      status: 'CHECKED_IN',
      batteryOrLevelPercent: 100,
      lastCheckedBy: 'Paramedic Nitin Somkuwar',
      lastCheckedTimestamp: '08:00 AM',
    },
    {
      id: 'eq-103',
      name: '12-Lead Diagnostic Portable ECG Machine',
      category: 'DIAGNOSTICS',
      serialNo: 'ECG-12L-881',
      status: 'CHECKED_IN',
      batteryOrLevelPercent: 92,
      lastCheckedBy: 'Paramedic Nitin Somkuwar',
      lastCheckedTimestamp: '08:00 AM',
    },
    {
      id: 'eq-104',
      name: 'Laerdal Compact Suction Unit (LCSU 4)',
      category: 'AIRWAY',
      serialNo: 'SUC-L4-102',
      status: 'CHECKED_IN',
      batteryOrLevelPercent: 95,
      lastCheckedBy: 'Paramedic Nitin Somkuwar',
      lastCheckedTimestamp: '08:00 AM',
    },
    {
      id: 'eq-105',
      name: 'Main D-Type Oxygen Cylinder (1320 Liters)',
      category: 'AIRWAY',
      serialNo: 'O2-CYL-552',
      status: 'CHECKED_IN',
      batteryOrLevelPercent: 96,
      lastCheckedBy: 'Paramedic Nitin Somkuwar',
      lastCheckedTimestamp: '08:00 AM',
    },
    {
      id: 'eq-106',
      name: 'Emergency ALS Drug Kit (Adrenaline, Atropine, Morphine)',
      category: 'MEDICATIONS',
      serialNo: 'DRG-KIT-2026',
      status: 'CHECKED_IN',
      batteryOrLevelPercent: 100,
      lastCheckedBy: 'Paramedic Nitin Somkuwar',
      lastCheckedTimestamp: '08:00 AM',
    },
    {
      id: 'eq-107',
      name: 'Dual-Channel Micro-Infusion Syringe Pump',
      category: 'LIFE_SUPPORT',
      serialNo: 'INF-PMP-301',
      status: 'CHECKED_IN',
      batteryOrLevelPercent: 88,
      lastCheckedBy: 'Paramedic Nitin Somkuwar',
      lastCheckedTimestamp: '08:00 AM',
    },
    {
      id: 'eq-108',
      name: 'Level 1 Mass Trauma & Splinting Pack',
      category: 'TRAUMA',
      serialNo: 'TRM-PCK-009',
      status: 'CHECKED_IN',
      batteryOrLevelPercent: 100,
      lastCheckedBy: 'Paramedic Nitin Somkuwar',
      lastCheckedTimestamp: '08:00 AM',
    },
  ]);

  const toggleItemStatus = (id: string, newStatus: MedicalEquipmentItem['status']) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus, lastCheckedTimestamp: 'Just now' } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 rounded-xl">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Medical Equipment Inventory & Checklist
            </h2>
            <p className="text-xs text-slate-300">
              Shift Check-In / Check-Out Log • All critical life support gear verified
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Checklist verified and submitted to Fleet Manager.')}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase shadow"
        >
          Verify & Sign Shift Checklist
        </button>
      </div>

      {/* Equipment List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
          <span>Equipment Name & Serial No</span>
          <span>Category</span>
          <span>Power / Capacity</span>
          <span>Action Status</span>
        </div>

        <div className="divide-y divide-slate-200">
          {items.map((it) => (
            <div key={it.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-extrabold text-slate-900">{it.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  S/N: {it.serialNo} • Checked by: {it.lastCheckedBy} ({it.lastCheckedTimestamp})
                </div>
              </div>

              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-bold font-mono text-[10px] w-max">
                {it.category}
              </span>

              <span className="font-mono font-bold text-emerald-700">
                {it.batteryOrLevelPercent ? `${it.batteryOrLevelPercent}% Ready` : 'Ready'}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleItemStatus(it.id, 'CHECKED_IN')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] ${
                    it.status === 'CHECKED_IN'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Check In
                </button>

                <button
                  onClick={() => toggleItemStatus(it.id, 'MAINTENANCE_REQUIRED')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] ${
                    it.status === 'MAINTENANCE_REQUIRED'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Maintenance
                </button>

                <button
                  onClick={() => toggleItemStatus(it.id, 'REPLACEMENT_REQUESTED')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] ${
                    it.status === 'REPLACEMENT_REQUESTED'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Request Replace
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
