import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Stethoscope,
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Activity,
  Zap,
} from 'lucide-react';
import { Hospital, MedicalEquipment } from '../../types';

interface HospitalEquipmentViewProps {
  hospital: Hospital;
  onAuditLog?: (action: string, details: string) => void;
}

export const HospitalEquipmentView: React.FC<HospitalEquipmentViewProps> = ({
  hospital,
  onAuditLog,
}) => {
  const [equipmentList, setEquipmentList] = useState<MedicalEquipment[]>([
    {
      id: 'eq-201',
      hospitalId: hospital.id,
      serialNumber: 'ZOL-DEF-8810',
      name: 'ZOLL R Series Biphasic Defibrillator',
      category: 'DEFIBRILLATOR',
      department: 'Emergency Casualty',
      location: 'ER Crash Cart #1',
      status: 'Available',
      batteryHealthPercent: 100,
      lastServiceDate: '2026-01-20',
      nextServiceDueDate: '2026-07-20',
      notes: 'Pacing & CPR Dashboard Enabled',
    },
    {
      id: 'eq-202',
      hospitalId: hospital.id,
      serialNumber: 'PHI-ECG-4412',
      name: 'Philips PageWriter TC70 12-Lead ECG',
      category: 'ECG',
      department: 'Cardiac Care Unit',
      location: 'Tower A - 2nd Floor',
      status: 'Available',
      batteryHealthPercent: 95,
      lastServiceDate: '2026-02-02',
      nextServiceDueDate: '2026-08-02',
    },
    {
      id: 'eq-203',
      hospitalId: hospital.id,
      serialNumber: 'GE-LOGIQ-0091',
      name: 'GE LOGIQ E9 Portable Ultrasound',
      category: 'ULTRASOUND',
      department: 'Trauma & Emergency',
      location: 'FAST Ultrasound Bay 1',
      status: 'Assigned',
      assignedPatientName: 'Karan Deshmukh (eFAST Scan)',
      lastServiceDate: '2026-01-10',
      nextServiceDueDate: '2026-07-10',
    },
    {
      id: 'eq-204',
      hospitalId: hospital.id,
      serialNumber: 'SIEM-XRAY-3301',
      name: 'Siemens Mobilett Elara Max Portable X-Ray',
      category: 'XRAY_PORTABLE',
      department: 'Radiology & Trauma',
      location: 'Main Block B - ER Bay',
      status: 'Available',
      batteryHealthPercent: 90,
      lastServiceDate: '2025-11-15',
      nextServiceDueDate: '2026-05-15',
    },
    {
      id: 'eq-205',
      hospitalId: hospital.id,
      serialNumber: 'MIN-MON-9910',
      name: 'Mindray BeneVision N17 Patient Monitor',
      category: 'PATIENT_MONITOR',
      department: 'Trauma ICU',
      location: 'ICU Bay 301-A',
      status: 'Assigned',
      assignedPatientName: 'Rameshwar Tawde',
      lastServiceDate: '2026-01-05',
      nextServiceDueDate: '2026-07-05',
    },
    {
      id: 'eq-206',
      hospitalId: hospital.id,
      serialNumber: 'BBRA-INF-1029',
      name: 'B. Braun Infusomat Space Infusion Pump',
      category: 'INFUSION_PUMP',
      department: 'Trauma ICU',
      location: 'ICU Bay 301-A',
      status: 'Assigned',
      assignedPatientName: 'Rameshwar Tawde',
      lastServiceDate: '2026-01-01',
      nextServiceDueDate: '2026-07-01',
    },
    {
      id: 'eq-207',
      hospitalId: hospital.id,
      serialNumber: 'FRES-DIAL-5008',
      name: 'Fresenius 5008S Hemodialysis System',
      category: 'DIALYSIS',
      department: 'Nephrology Ward',
      location: 'Dialysis Center Bay 4',
      status: 'Maintenance',
      notes: 'Water treatment filter replacement',
      lastServiceDate: '2025-09-20',
      nextServiceDueDate: '2026-03-20',
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { label: 'All Equipment', value: 'ALL' },
    { label: 'Defibrillators', value: 'DEFIBRILLATOR' },
    { label: 'ECG Machines', value: 'ECG' },
    { label: 'Ultrasound', value: 'ULTRASOUND' },
    { label: 'Portable X-Ray', value: 'XRAY_PORTABLE' },
    { label: 'Patient Monitors', value: 'PATIENT_MONITOR' },
    { label: 'Infusion Pumps', value: 'INFUSION_PUMP' },
    { label: 'Dialysis Units', value: 'DIALYSIS' },
  ];

  const filteredList = equipmentList.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCategory(c.value)}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
              selectedCategory === c.value
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main List */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-sky-600" />
              <span>Biomedical Equipment Registry</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Defibrillators, ECGs, Ultrasound, Portable X-Rays, Patient Monitors & Infusion Pumps
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => (
            <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">{item.serialNumber}</span>
                  <h4 className="font-bold text-slate-900 text-xs mt-0.5">{item.name}</h4>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    item.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Assigned'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1">
                <p>
                  <strong>Dept:</strong> {item.department} ({item.location})
                </p>
                {item.assignedPatientName && (
                  <p className="text-sky-900 font-bold bg-sky-50 p-1.5 rounded border border-sky-200">
                    Patient: {item.assignedPatientName}
                  </p>
                )}
                {item.notes && <p className="text-[10px] text-slate-500 italic">{item.notes}</p>}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200 font-bold">
                <span>Category: {item.category}</span>
                <span>Next Service: {item.nextServiceDueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
