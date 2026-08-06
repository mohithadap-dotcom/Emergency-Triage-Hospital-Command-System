import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  UserCheck,
  Clock,
  Search,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Plus,
} from 'lucide-react';
import { Hospital, HospitalStaff } from '../../types';

interface HospitalStaffViewProps {
  hospital: Hospital;
  onAuditLog?: (action: string, details: string) => void;
}

export const HospitalStaffView: React.FC<HospitalStaffViewProps> = ({ hospital, onAuditLog }) => {
  const [staffList, setStaffList] = useState<HospitalStaff[]>([
    {
      id: 'doc-101',
      hospitalId: hospital.id,
      name: 'Dr. Anand Mahajan, MD (Trauma & Critical Care)',
      roleTitle: 'Doctor',
      specialty: 'Trauma Surgery / Critical Care',
      department: 'Trauma ICU',
      shift: 'Morning',
      status: 'On-Duty',
      contactNumber: '+91 98230 11223',
      emergencyContact: '+91 98230 11224',
      emergencyAssigned: 'INC-DEMO-2026-PUNE',
    },
    {
      id: 'doc-102',
      hospitalId: hospital.id,
      name: 'Dr. Meera Kulkarni, DM (Cardiology)',
      roleTitle: 'Doctor',
      specialty: 'Interventional Cardiology',
      department: 'Cardiac Care Unit',
      shift: 'Morning',
      status: 'On-Duty',
      contactNumber: '+91 98220 55667',
      emergencyContact: '+91 98220 55668',
    },
    {
      id: 'doc-103',
      hospitalId: hospital.id,
      name: 'Dr. Rahul Verma, MCh (Neurosurgery)',
      roleTitle: 'Doctor',
      specialty: 'Neurotrauma & Brain Surgery',
      department: 'Neuro ICU',
      shift: 'Morning',
      status: 'On-Call',
      contactNumber: '+91 98221 88990',
      emergencyContact: '+91 98221 88991',
    },
    {
      id: 'nurse-201',
      hospitalId: hospital.id,
      name: 'Sister Sunita Deshmukh, B.Sc Nursing',
      roleTitle: 'Nurse',
      specialty: 'Critical Care Nursing',
      department: 'Trauma ICU',
      shift: 'Morning',
      status: 'On-Duty',
      contactNumber: '+91 98231 44556',
      emergencyContact: '+91 98231 44557',
      assignedWard: 'Red Zone ICU Ward 1',
    },
    {
      id: 'nurse-202',
      hospitalId: hospital.id,
      name: 'Sister Priyanka Jadhav, GNM',
      roleTitle: 'Nurse',
      specialty: 'Emergency Triage',
      department: 'Emergency Casualty',
      shift: 'Morning',
      status: 'On-Duty',
      contactNumber: '+91 98232 77889',
      emergencyContact: '+91 98232 77890',
      assignedWard: 'Casualty Resuscitation Bay',
    },
    {
      id: 'tech-301',
      hospitalId: hospital.id,
      name: 'Vikram Shinde',
      roleTitle: 'Technician',
      specialty: 'Biomedical & Ventilator Operations',
      department: 'Bio-Medical Dept',
      shift: 'Morning',
      status: 'On-Duty',
      contactNumber: '+91 98233 11223',
      emergencyContact: '+91 98233 11224',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'ALL' | 'Doctor' | 'Nurse' | 'Technician'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = staffList.filter((s) => {
    if (activeTab !== 'ALL' && s.roleTitle !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.specialty.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-sky-600" />
            <span>Emergency Staff & Medical Duty Roster</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Active doctors, critical care nurses, paramedics & biomedical engineers on duty at {hospital.name}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg border ${
              activeTab === 'ALL' ? 'bg-sky-600 text-stone-900 border-sky-600' : 'bg-cream text-stone-600'
            }`}
          >
            All Staff ({staffList.length})
          </button>
          <button
            onClick={() => setActiveTab('Doctor')}
            className={`px-3 py-1.5 rounded-lg border ${
              activeTab === 'Doctor' ? 'bg-sky-600 text-stone-900 border-sky-600' : 'bg-cream text-stone-600'
            }`}
          >
            Doctors ({staffList.filter((s) => s.roleTitle === 'Doctor').length})
          </button>
          <button
            onClick={() => setActiveTab('Nurse')}
            className={`px-3 py-1.5 rounded-lg border ${
              activeTab === 'Nurse' ? 'bg-sky-600 text-stone-900 border-sky-600' : 'bg-cream text-stone-600'
            }`}
          >
            Nurses ({staffList.filter((s) => s.roleTitle === 'Nurse').length})
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="bg-white border border-stone-200 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-sky-600 tracking-wider block">
                  {staff.roleTitle} • {staff.department}
                </span>
                <h3 className="font-extrabold text-stone-900 text-sm mt-0.5">{staff.name}</h3>
                <span className="text-[11px] text-stone-500 font-medium">{staff.specialty}</span>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  staff.status === 'On-Duty'
                    ? 'bg-emerald-100 text-emerald-400 border border-emerald-300'
                    : 'bg-amber-100 text-amber-400 border border-amber-200'
                }`}
              >
                {staff.status}
              </span>
            </div>

            <div className="text-xs text-stone-500 space-y-1 font-medium">
              <p className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>Shift: {staff.shift} Duty</span>
              </p>
              <p className="flex items-center space-x-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-stone-500" />
                <span>Direct Contact: {staff.contactNumber}</span>
              </p>
              {staff.emergencyAssigned && (
                <p className="bg-rose-50 text-rose-900 p-2 rounded-lg border border-rose-200 font-bold text-[11px]">
                  Assigned Emergency: {staff.emergencyAssigned}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
