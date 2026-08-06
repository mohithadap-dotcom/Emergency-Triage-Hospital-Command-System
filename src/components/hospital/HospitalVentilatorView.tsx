import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Battery,
  BatteryCharging,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  BedDouble,
  User,
  Power,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Hospital, MedicalEquipment } from '../../types';

interface HospitalVentilatorViewProps {
  hospital: Hospital;
  onAuditLog?: (action: string, details: string) => void;
}

export const HospitalVentilatorView: React.FC<HospitalVentilatorViewProps> = ({
  hospital,
  onAuditLog,
}) => {
  const [ventilators, setVentilators] = useState<MedicalEquipment[]>([
    {
      id: 'vent-101',
      hospitalId: hospital.id,
      serialNumber: 'HAM-C6-99201',
      name: 'Hamilton C6 High-End ICU Ventilator',
      category: 'VENTILATOR',
      department: 'Trauma ICU',
      location: 'Tower A - 3rd Floor (Room 301)',
      status: 'Assigned',
      batteryHealthPercent: 98,
      assignedPatientName: 'Rameshwar Tawde',
      assignedBedNumber: 'ICU-BAY-301-A',
      lastServiceDate: '2026-01-15',
      nextServiceDueDate: '2026-07-15',
      notes: 'Operating on Adaptive Support Ventilation (ASV) Mode',
    },
    {
      id: 'vent-102',
      hospitalId: hospital.id,
      serialNumber: 'MIN-SV300-8812',
      name: 'Mindray SV300 ICU Ventilator',
      category: 'VENTILATOR',
      department: 'Trauma ICU',
      location: 'Tower A - 3rd Floor (Room 301)',
      status: 'Available',
      batteryHealthPercent: 100,
      lastServiceDate: '2026-02-01',
      nextServiceDueDate: '2026-08-01',
      notes: 'Fully sanitized & calibrated. Ready for emergency dispatch.',
    },
    {
      id: 'vent-103',
      hospitalId: hospital.id,
      serialNumber: 'DRA-SAV500-1120',
      name: 'Dräger Savina 300 Select Ventilator',
      category: 'VENTILATOR',
      department: 'Cardiac ICU',
      location: 'Tower A - 2nd Floor (CCU Bay 2)',
      status: 'Assigned',
      batteryHealthPercent: 92,
      assignedPatientName: 'Sunil Gavaskar',
      assignedBedNumber: 'CCU-BAY-310-A',
      lastServiceDate: '2025-12-10',
      nextServiceDueDate: '2026-06-10',
    },
    {
      id: 'vent-104',
      hospitalId: hospital.id,
      serialNumber: 'MED-PB980-4411',
      name: 'Medtronic Puritan Bennett 980',
      category: 'VENTILATOR',
      department: 'Emergency Casualty',
      location: 'Main Block B - ER Resuscitation',
      status: 'Available',
      batteryHealthPercent: 95,
      lastServiceDate: '2026-01-20',
      nextServiceDueDate: '2026-07-20',
    },
    {
      id: 'vent-105',
      hospitalId: hospital.id,
      serialNumber: 'PHI-EV300-0091',
      name: 'Philips Respironics V60',
      category: 'VENTILATOR',
      department: 'Pulmonology Ward',
      location: 'Bio-Medical Workshop',
      status: 'Maintenance',
      batteryHealthPercent: 65,
      lastServiceDate: '2025-10-05',
      nextServiceDueDate: '2026-02-10',
      notes: 'Oxygen sensor replacement in progress by BioMed engineer.',
    },
    {
      id: 'vent-106',
      hospitalId: hospital.id,
      serialNumber: 'ZOLL-EMV-2001',
      name: 'ZOLL EMV+ Portable Transport Ventilator',
      category: 'VENTILATOR',
      department: 'Ambulance & Transport',
      location: 'Ambulance Bay ER-1',
      status: 'Available',
      batteryHealthPercent: 100,
      lastServiceDate: '2026-01-28',
      nextServiceDueDate: '2026-07-28',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVentilators = ventilators.filter((v) => {
    if (filterStatus !== 'ALL' && v.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.serialNumber.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) ||
        (v.assignedPatientName && v.assignedPatientName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleToggleStatus = (id: string, newStatus: MedicalEquipment['status']) => {
    setVentilators((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const updated = {
            ...v,
            status: newStatus,
            assignedPatientName: newStatus === 'Available' ? undefined : v.assignedPatientName,
            assignedBedNumber: newStatus === 'Available' ? undefined : v.assignedBedNumber,
          };
          return updated;
        }
        return v;
      })
    );
    if (onAuditLog) {
      onAuditLog('EQUIPMENT', `Ventilator ${id} status changed to ${newStatus}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Hospital Ventilators
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{ventilators.length}</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Available & Calibrated
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {ventilators.filter((v) => v.status === 'Available').length}
          </span>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
            Assigned to Patients
          </span>
          <span className="text-2xl font-black text-sky-800 mt-1 block">
            {ventilators.filter((v) => v.status === 'Assigned').length}
          </span>
        </div>

        <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
            In BioMed Maintenance
          </span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">
            {ventilators.filter((v) => v.status === 'Maintenance' || v.status === 'Fault').length}
          </span>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-sky-600" />
              <span>Ventilator Fleet Management</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking of mechanical ventilators, battery health, calibration dates, and bed assignments
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search serial, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVentilators.map((v) => (
            <div
              key={v.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">{v.serialNumber}</span>
                  <h4 className="font-bold text-slate-900 text-xs mt-0.5">{v.name}</h4>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    v.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : v.status === 'Assigned'
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : 'bg-slate-200 text-slate-800 border border-slate-300'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1">
                <p>
                  <strong>Dept:</strong> {v.department} ({v.location})
                </p>
                {v.assignedPatientName && (
                  <p className="text-sky-900 font-bold bg-sky-50 p-1.5 rounded border border-sky-200">
                    Assigned: {v.assignedPatientName} ({v.assignedBedNumber})
                  </p>
                )}
                {v.notes && <p className="text-[10px] text-slate-500 italic">{v.notes}</p>}
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-200">
                <span className="flex items-center space-x-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Battery {v.batteryHealthPercent}%</span>
                </span>

                <span>Next Service: {v.nextServiceDueDate}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                {v.status === 'Assigned' ? (
                  <button
                    onClick={() => handleToggleStatus(v.id, 'Available')}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-sm transition-colors"
                  >
                    Release to Stock
                  </button>
                ) : v.status === 'Available' ? (
                  <button
                    onClick={() => handleToggleStatus(v.id, 'Assigned')}
                    className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-bold shadow-sm transition-colors"
                  >
                    Assign to Patient
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleStatus(v.id, 'Available')}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition-colors"
                  >
                    Complete Maintenance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
