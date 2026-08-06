import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  LayoutDashboard,
  Siren,
  BedDouble,
  HeartPulse,
  Activity,
  Stethoscope,
  Users,
  RefreshCw,
  Sparkles,
  BarChart3,
  Bell,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ArrowRightLeft,
  UserCheck,
} from 'lucide-react';
import { Hospital, Incident, HospitalAuditLog, HospitalQuickResourceUpdate } from '../../types';
import { HospitalUserSession } from './HospitalLoginView';
import { HospitalBedMatrixInteractiveView } from './HospitalBedMatrixInteractiveView';
import { HospitalIcuManagementView } from './HospitalIcuManagementView';
import { HospitalVentilatorView } from './HospitalVentilatorView';
import { HospitalEquipmentView } from './HospitalEquipmentView';
import { HospitalStaffView } from './HospitalStaffView';
import { HospitalResourceCenterView } from './HospitalResourceCenterView';
import { HospitalEmergencyQueueView } from './HospitalEmergencyQueueView';
import { HospitalGeminiAiView } from './HospitalGeminiAiView';
import { HospitalAnalyticsView } from './HospitalAnalyticsView';
import { HospitalAuditLogView } from './HospitalAuditLogView';
import { HospitalSettingsView } from './HospitalSettingsView';
import { HospitalNotificationsView } from './HospitalNotificationsView';

interface HospitalPortalLayoutProps {
  hospital: Hospital;
  userSession: HospitalUserSession;
  incidents: Incident[];
  onLogout: () => void;
  onSwitchPortal?: (portal: 'GOVERNMENT' | 'HOSPITAL' | 'AMBULANCE' | 'DOCTOR_WORKSPACE') => void;
}

export type HospitalTab =
  | 'home'
  | 'emergency_queue'
  | 'beds'
  | 'icu'
  | 'ventilators'
  | 'equipment'
  | 'doctors'
  | 'resources'
  | 'ai'
  | 'analytics'
  | 'notifications'
  | 'audit'
  | 'settings';

export const HospitalPortalLayout: React.FC<HospitalPortalLayoutProps> = ({
  hospital,
  userSession,
  incidents,
  onLogout,
  onSwitchPortal,
}) => {
  const [activeTab, setActiveTab] = useState<HospitalTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentHospital, setCurrentHospital] = useState<Hospital>(hospital);

  const [auditLogs, setAuditLogs] = useState<HospitalAuditLog[]>([
    {
      id: 'log-1',
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      action: 'USER_LOGIN',
      category: 'BED_MANAGEMENT',
      performedBy: userSession.email,
      userRole: userSession.roleTitle,
      details: 'Authenticated successfully via hardware security token.',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 'log-2',
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      action: 'AUTOMATED_ICU_RESERVATION',
      category: 'BED_MANAGEMENT',
      performedBy: 'Rakshak AI Dispatch System',
      userRole: 'SYSTEM_BOT',
      details: 'Bed ICU-CRASH-01 pre-reserved for incoming polytrauma patient Karan Deshmukh.',
      timestamp: '10 mins ago',
    },
  ]);

  const handleAppendAuditLog = (category: any, details: string) => {
    const newEntry: HospitalAuditLog = {
      id: `log-${Date.now()}`,
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      action: category,
      category: category,
      performedBy: userSession.email,
      userRole: userSession.roleTitle,
      details: details,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const handleResourceUpdateSuccess = (updated: HospitalQuickResourceUpdate) => {
    setCurrentHospital((prev) => ({
      ...prev,
      availableIcuBeds: updated.availableIcuBeds,
      availableGeneralBeds: updated.availableGeneralBeds,
      availableVentilators: updated.availableVentilators,
      doctorsOnDuty: updated.doctorsOnDuty,
      nursesOnDuty: updated.nursesOnDuty,
      bloodUnitsAvailable: updated.bloodUnitsAvailable,
      oxygenCapacityPercent: updated.oxygenCapacityPercent,
      oxygenCylindersAvailable: updated.oxygenCylindersAvailable,
      emergencyMedicinesStockLevelPercent: updated.emergencyMedicinesStockLevelPercent,
      operatingTheatresAvailable: updated.operatingTheatresAvailable,
      emergencyDeptStatus: updated.emergencyDeptStatus,
      lastSync: 'Just now',
    }));
  };

  const navItems: { id: HospitalTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'emergency_queue',
      label: 'Emergency Queue',
      icon: <Siren className="w-4 h-4 text-rose-500" />,
      badge: '2 Inbound',
    },
    { id: 'beds', label: '6-Level Bed Matrix', icon: <BedDouble className="w-4 h-4" /> },
    { id: 'icu', label: 'ICU Management', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'ventilators', label: 'Ventilators', icon: <Activity className="w-4 h-4" /> },
    { id: 'equipment', label: 'Medical Equipment', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'doctors', label: 'Doctor & Nurse Roster', icon: <Users className="w-4 h-4" /> },
    { id: 'resources', label: 'Resource Sync Center', icon: <RefreshCw className="w-4 h-4 text-sky-500" /> },
    { id: 'ai', label: 'Gemini AI Assistant', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: '3' },
    { id: 'audit', label: 'Audit Trail', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'RBAC Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased">
      {/* Standalone Top Bar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-sky-600 text-white rounded-xl shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white leading-none flex items-center gap-2">
                  <span>{currentHospital.name}</span>
                  <span className="text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full uppercase">
                    Hospital Portal
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {currentHospital.districtName} District • {currentHospital.traumaLevel} Center
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* User Session Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block leading-none">{userSession.email}</span>
                <span className="text-[11px] font-bold text-amber-400 leading-none">{userSession.roleTitle}</span>
              </div>
            </div>

            {/* Portal Switcher */}
            {onSwitchPortal && (
              <button
                onClick={() => onSwitchPortal('GOVERNMENT')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold rounded-xl transition-all flex items-center space-x-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Government EOC</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 font-bold rounded-xl transition-all flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Left Sidebar */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row">
        {/* Left Navigation Sidebar */}
        <aside
          className={`lg:w-64 bg-white border-r border-slate-200 p-3 shrink-0 lg:block ${
            mobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 py-1 block">
              Hospital Navigation
            </span>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === item.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                      activeTab === item.id ? 'bg-white text-sky-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Right Active View Content Area */}
        <main className="flex-1 p-4 md:p-6 space-y-6 min-w-0">
          {activeTab === 'home' && (
            <div className="space-y-6 font-sans">
              {/* Operational Status Overview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Operational Emergency Command Center
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live status telemetry for {currentHospital.name} ({currentHospital.districtName})
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ER Status: {currentHospital.emergencyDeptStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block">Available ICU Beds</span>
                    <span className="text-2xl font-black text-emerald-600">{currentHospital.availableIcuBeds}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">Out of {currentHospital.totalIcuBeds} Installed</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block">Available General Beds</span>
                    <span className="text-2xl font-black text-sky-600">{currentHospital.availableGeneralBeds}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">Out of {currentHospital.totalBeds} Installed</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block">Available Ventilators</span>
                    <span className="text-2xl font-black text-indigo-600">{currentHospital.availableVentilators}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">Out of {currentHospital.totalVentilators} Installed</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block">On-Duty Doctors</span>
                    <span className="text-2xl font-black text-slate-900">{currentHospital.doctorsOnDuty}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">{currentHospital.nursesOnDuty} Nurses</span>
                  </div>
                </div>
              </div>

              {/* Embed Bed Matrix interactive preview */}
              <HospitalBedMatrixInteractiveView hospital={currentHospital} onAuditLog={handleAppendAuditLog} />
            </div>
          )}

          {activeTab === 'emergency_queue' && (
            <HospitalEmergencyQueueView
              hospital={currentHospital}
              incidents={incidents}
              onAuditLog={handleAppendAuditLog}
            />
          )}

          {activeTab === 'beds' && (
            <HospitalBedMatrixInteractiveView hospital={currentHospital} onAuditLog={handleAppendAuditLog} />
          )}

          {activeTab === 'icu' && (
            <HospitalIcuManagementView hospital={currentHospital} onAuditLog={handleAppendAuditLog} />
          )}

          {activeTab === 'ventilators' && (
            <HospitalVentilatorView hospital={currentHospital} onAuditLog={handleAppendAuditLog} />
          )}

          {activeTab === 'equipment' && (
            <HospitalEquipmentView hospital={currentHospital} onAuditLog={handleAppendAuditLog} />
          )}

          {activeTab === 'doctors' && (
            <HospitalStaffView hospital={currentHospital} onAuditLog={handleAppendAuditLog} />
          )}

          {activeTab === 'resources' && (
            <HospitalResourceCenterView
              hospital={currentHospital}
              onUpdateSuccess={handleResourceUpdateSuccess}
              onAuditLog={handleAppendAuditLog}
            />
          )}

          {activeTab === 'ai' && (
            <HospitalGeminiAiView hospital={currentHospital} onAuditLog={handleAppendAuditLog} />
          )}

          {activeTab === 'analytics' && <HospitalAnalyticsView hospital={currentHospital} />}

          {activeTab === 'notifications' && <HospitalNotificationsView hospital={currentHospital} />}

          {activeTab === 'audit' && (
            <HospitalAuditLogView hospital={currentHospital} auditLogs={auditLogs} />
          )}

          {activeTab === 'settings' && (
            <HospitalSettingsView hospital={currentHospital} userSession={userSession} />
          )}
        </main>
      </div>
    </div>
  );
};
