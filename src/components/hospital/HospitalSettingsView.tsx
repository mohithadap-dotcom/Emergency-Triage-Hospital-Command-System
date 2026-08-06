import React from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  ShieldCheck,
  Building2,
  Lock,
  UserCheck,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { Hospital, HospitalAdminRole } from '../../types';
import { HospitalUserSession } from './HospitalLoginView';

interface HospitalSettingsViewProps {
  hospital: Hospital;
  userSession: HospitalUserSession;
}

export const HospitalSettingsView: React.FC<HospitalSettingsViewProps> = ({ hospital, userSession }) => {
  const permissionsMatrix: { role: HospitalAdminRole; label: string; perms: string[] }[] = [
    {
      role: 'HOSPITAL_ADMINISTRATOR',
      label: 'Hospital Administrator',
      perms: ['Full Access', 'Bed Matrix Override', 'Staff Roster', 'Resource Center', 'Emergency Acceptance', 'AI Assistant', 'RBAC Configuration'],
    },
    {
      role: 'EMERGENCY_COORDINATOR',
      label: 'Emergency Coordinator',
      perms: ['Emergency Queue Accept/Divert', 'Pre-Alert Preparation', 'ICU Bed Reservation', 'Resource Quick Update'],
    },
    {
      role: 'BED_MANAGER',
      label: 'Bed Manager',
      perms: ['6-Level Bed Matrix Control', 'Bed Status Transitions', 'Cleaning & Maintenance Flags', 'Patient Admission'],
    },
    {
      role: 'RESOURCE_MANAGER',
      label: 'Resource Manager',
      perms: ['Single-Save Resource Center', 'Oxygen & Blood Stock Updates', 'Equipment Allocation'],
    },
    {
      role: 'BIOMEDICAL_ENGINEER',
      label: 'Biomedical Engineer',
      perms: ['Ventilator Fleet Management', 'Equipment Calibration', 'Fault Reporting', 'Maintenance Status'],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Active Session Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Hospital Security & RBAC Profile</h2>
            <p className="text-xs text-slate-500">
              Active authenticated session details and role-based permissions matrix for {hospital.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase block">User Email</span>
            <span className="text-slate-900 font-extrabold">{userSession.email}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase block">Active Role</span>
            <span className="text-amber-700 font-extrabold">{userSession.roleTitle}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase block">MFA Verification</span>
            <span className="text-emerald-700 font-extrabold flex items-center space-x-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Hardware Token</span>
            </span>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Role-Based Access Control (RBAC) Enforcement Matrix
        </h3>

        <div className="space-y-3">
          {permissionsMatrix.map((item) => (
            <div
              key={item.role}
              className={`p-4 rounded-xl border transition-all ${
                userSession.role === item.role ? 'bg-sky-50 border-sky-300' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs">{item.label}</span>
                {userSession.role === item.role && (
                  <span className="text-[10px] font-black bg-sky-600 text-white px-2.5 py-0.5 rounded-full uppercase">
                    Your Active Role
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.perms.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] font-semibold bg-white border border-slate-300 text-slate-700 px-2 py-0.5 rounded-md"
                  >
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
