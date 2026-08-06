import React, { useState } from 'react';
import {
  Truck,
  Navigation,
  Activity,
  Gauge,
  CheckSquare,
  Sparkles,
  Radio,
  History,
  Shield,
  BarChart3,
  User,
  LogOut,
  Bell,
  Zap,
  Clock,
  Building2,
  Menu,
  X,
} from 'lucide-react';
import {
  AmbulanceUserSession,
  AmbulanceMission,
  VehicleHealthStatus,
  Ambulance,
  MissionStage,
} from '../../types';
import { AmbulanceHomeDashboard } from './AmbulanceHomeDashboard';
import { AmbulanceCurrentMissionView } from './AmbulanceCurrentMissionView';
import { AmbulanceGoogleMapsView } from './AmbulanceGoogleMapsView';
import { AmbulancePatientVitalsView } from './AmbulancePatientVitalsView';
import { AmbulanceParamedicWorkspaceView } from './AmbulanceParamedicWorkspaceView';
import { AmbulanceVehicleHealthView } from './AmbulanceVehicleHealthView';
import { AmbulanceEquipmentChecklist } from './AmbulanceEquipmentChecklist';
import { AmbulanceAiAssistantView } from './AmbulanceAiAssistantView';
import { AmbulanceCommunicationCenter } from './AmbulanceCommunicationCenter';
import { AmbulanceMissionHistoryView } from './AmbulanceMissionHistoryView';
import { AmbulanceFleetManagementView } from './AmbulanceFleetManagementView';
import { AmbulanceFleetAnalyticsView } from './AmbulanceFleetAnalyticsView';
import { AmbulanceHackathonDemoBar } from './AmbulanceHackathonDemoBar';

interface AmbulancePortalLayoutProps {
  session: AmbulanceUserSession;
  activeMission: AmbulanceMission | null;
  allMissions: AmbulanceMission[];
  allAmbulances: Ambulance[];
  vehicleHealth: VehicleHealthStatus;
  onLogout: () => void;
  onSwitchPortal: (portal: 'GOVERNMENT' | 'HOSPITAL' | 'AMBULANCE' | 'DOCTOR_WORKSPACE') => void;
  onUpdateMissionStage: (stage: MissionStage, note?: string) => Promise<void>;
  onTriggerDemoStep: (stepIndex: number) => Promise<void>;
}

export const AmbulancePortalLayout: React.FC<AmbulancePortalLayoutProps> = ({
  session,
  activeMission,
  allMissions,
  allAmbulances,
  vehicleHealth,
  onLogout,
  onSwitchPortal,
  onUpdateMissionStage,
  onTriggerDemoStep,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = session.user;

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Truck, badge: null },
    {
      id: 'current_mission',
      label: 'Active Mission',
      icon: Zap,
      badge: activeMission ? '1 Active' : null,
      badgeColor: 'bg-rose-500 text-stone-900',
    },
    { id: 'maps', label: 'Google Maps Nav', icon: Navigation, badge: 'Corridor' },
    { id: 'vitals', label: 'Patient Vitals', icon: Activity, badge: 'IoT Live' },
    { id: 'paramedic', label: 'Paramedic Notes', icon: User, badge: null },
    { id: 'vehicle', label: 'Vehicle Health', icon: Gauge, badge: `${vehicleHealth.fuelLevelPercent}% Fuel` },
    { id: 'equipment', label: 'Equipment List', icon: CheckSquare, badge: null },
    { id: 'ai_assistant', label: 'Gemini AI Assistant', icon: Sparkles, badge: 'AI AIIMS' },
    { id: 'radio', label: 'Radio Comm Center', icon: Radio, badge: null },
    { id: 'history', label: 'Mission History', icon: History, badge: `${allMissions.length}` },
    { id: 'fleet', label: 'Fleet Directory', icon: Shield, badge: `${allAmbulances.length}` },
    { id: 'analytics', label: 'Fleet Analytics', icon: BarChart3, badge: null },
  ];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans antialiased flex flex-col">
      {/* Top Hackathon Pune Accident Simulation Bar */}
      <AmbulanceHackathonDemoBar onTriggerDemoStep={onTriggerDemoStep} />

      {/* Main Header */}
      <header className="bg-cream text-stone-900 border-b border-stone-200 sticky top-0 z-30 shadow-md">
        <div className="max-w-[1700px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Brand & Call-sign */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-white rounded-lg text-stone-600 hover:text-stone-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-stone-900 text-base shadow border border-emerald-400">
              108
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black text-sm text-stone-900 tracking-wider">
                  {user.vehicleCallsign} ({user.vehicleRegNo})
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {user.districtName}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 font-medium">
                {user.name} ({user.roleTitle}) • {user.shiftName}
              </div>
            </div>
          </div>

          {/* Quick Active Mission Pill */}
          {activeMission && (
            <button
              onClick={() => setActiveTab('current_mission')}
              className="hidden md:flex items-center space-x-2 bg-rose-600/20 border border-rose-500/40 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-extrabold hover:bg-rose-600/30 transition animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 text-amber-100" />
              <span>DISPATCHED: {activeMission.incidentTitle.slice(0, 32)}...</span>
            </button>
          )}

          {/* User Session & Switch Portal Controls */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            {/* Multi-Portal Navigation Dropdown */}
            <div className="hidden sm:flex items-center space-x-1 bg-white p-1 rounded-lg border border-stone-200">
              <button
                onClick={() => onSwitchPortal('GOVERNMENT')}
                className="px-2.5 py-1 text-stone-500 hover:text-stone-900 rounded"
              >
                Govt EOC
              </button>
              <button
                onClick={() => onSwitchPortal('HOSPITAL')}
                className="px-2.5 py-1 text-stone-500 hover:text-stone-900 rounded"
              >
                Hospital
              </button>
              <button
                onClick={() => onSwitchPortal('AMBULANCE')}
                className="px-2.5 py-1 bg-emerald-600 text-stone-900 font-bold rounded shadow"
              >
                Ambulance
              </button>
            </div>

            <button
              onClick={onLogout}
              className="p-2 bg-white hover:bg-rose-600/40 border border-stone-200 hover:border-rose-500/50 rounded-lg text-stone-600 hover:text-rose-300 transition"
              title="Logout Shift Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 bg-white border-r border-stone-200 p-3 space-y-1 shrink-0`}
        >
          <div className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider px-3 py-2 font-mono">
            108 EMS Tablet Controls
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition ${
                  isActive
                    ? 'bg-emerald-600 text-stone-900 shadow-md'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-stone-100 text-stone-600 border border-stone-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <AmbulanceHomeDashboard
              session={session}
              activeMission={activeMission}
              vehicleHealth={vehicleHealth}
              todayCompletedCount={allMissions.length}
              onNavigateTab={setActiveTab}
              onUpdateMissionStage={(st) => onUpdateMissionStage(st as MissionStage)}
            />
          )}

          {activeTab === 'current_mission' && (
            <AmbulanceCurrentMissionView
              mission={activeMission}
              onUpdateStage={onUpdateMissionStage}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'maps' && (
            <AmbulanceGoogleMapsView mission={activeMission} />
          )}

          {activeTab === 'vitals' && (
            <AmbulancePatientVitalsView mission={activeMission} />
          )}

          {activeTab === 'paramedic' && (
            <AmbulanceParamedicWorkspaceView mission={activeMission} />
          )}

          {activeTab === 'vehicle' && (
            <AmbulanceVehicleHealthView health={vehicleHealth} />
          )}

          {activeTab === 'equipment' && <AmbulanceEquipmentChecklist />}

          {activeTab === 'ai_assistant' && (
            <AmbulanceAiAssistantView mission={activeMission} />
          )}

          {activeTab === 'radio' && (
            <AmbulanceCommunicationCenter session={session} />
          )}

          {activeTab === 'history' && (
            <AmbulanceMissionHistoryView missions={allMissions} />
          )}

          {activeTab === 'fleet' && (
            <AmbulanceFleetManagementView ambulances={allAmbulances} />
          )}

          {activeTab === 'analytics' && <AmbulanceFleetAnalyticsView />}
        </main>
      </div>
    </div>
  );
};
