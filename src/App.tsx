import React, { useState, useEffect } from 'react';
import {
  District,
  Hospital,
  Incident,
  Ambulance,
  SystemHealth,
  LogEntry,
  UserProfile,
  EocSummaryMetrics,
} from './types';
import {
  INITIAL_USER_PROFILES,
  MOCK_DISTRICTS,
  MOCK_HOSPITALS,
  MOCK_INCIDENTS,
  MOCK_AMBULANCES,
  MOCK_AMBULANCE_MISSIONS,
  INITIAL_SYSTEM_HEALTH,
  INITIAL_LOG_ENTRIES,
  INITIAL_METRICS,
} from './data/mockData';
import { AmbulanceMission } from './types';

import { Header } from './components/Header';
import { Navbar, NavTab } from './components/Navbar';
import { AlertBanner } from './components/AlertBanner';
import { HomeDashboard } from './components/HomeDashboard';
import { EmergencyOpsView } from './components/EmergencyOpsView';
import { LiveIncidentsView } from './components/LiveIncidentsView';
import { HospitalNetworkView } from './components/HospitalNetworkView';
import { ResourceCommandView } from './components/ResourceCommandView';
import { AmbulanceFleetView } from './components/AmbulanceFleetView';
import { AiIntelligenceView } from './components/AiIntelligenceView';
import { RealTimeNetworkView } from './components/RealTimeNetworkView';
import { GisOperationsView } from './components/GisOperationsView';
import { DisasterModeBanner } from './components/DisasterModeBanner';
import { AnalyticsView } from './components/AnalyticsView';
import { AdministrationView } from './components/AdministrationView';
import { ObservabilityView } from './components/ObservabilityView';
import { SettingsView } from './components/SettingsView';
import { HackathonComplianceAudit } from './components/HackathonComplianceAudit';
import { DisasterCommandPortal } from './components/DisasterCommandPortal';
import { HospitalLoginView, HospitalUserSession } from './components/hospital/HospitalLoginView';
import { HospitalPortalLayout } from './components/hospital/HospitalPortalLayout';
import { AmbulanceLoginView } from './components/ambulance/AmbulanceLoginView';
import { AmbulancePortalLayout } from './components/ambulance/AmbulancePortalLayout';
import { VehicleHealthStatus, MissionStage, AmbulanceUserSession } from './types';

export default function App() {
  // Multi-Portal Architecture State
  const [activePortal, setActivePortal] = useState<'GOVERNMENT' | 'HOSPITAL' | 'AMBULANCE' | 'DOCTOR_WORKSPACE'>('GOVERNMENT');
  const [hospitalUserSession, setHospitalUserSession] = useState<HospitalUserSession | null>(null);
  const [ambulanceUserSession, setAmbulanceUserSession] = useState<AmbulanceUserSession | null>(null);

  const [vehicleHealth, setVehicleHealth] = useState<VehicleHealthStatus>({
    vehicleId: 'amb-108-01',
    registrationNo: 'MH-31-EQ-9108',
    fuelLevelPercent: 92,
    batteryPercent: 98,
    oxygenCylinderBar: 180,
    engineStatus: 'OPTIMAL',
    tyrePressurePsi: { frontLeft: 35, frontRight: 35, rearLeft: 36, rearRight: 36 },
    ventilatorStatus: 'OPERATIONAL',
    defibrillatorStatus: 'READY_CHARGED',
    lastServiceDate: '2026-07-15',
    nextMaintenanceDue: '2026-09-15',
  });

  // Application State
  const [userProfiles] = useState<UserProfile[]>(INITIAL_USER_PROFILES);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_PROFILES[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [disasterModeActive, setDisasterModeActive] = useState<boolean>(false);

  // Core Data States
  const [districts, setDistricts] = useState<District[]>(MOCK_DISTRICTS);
  const [hospitals, setHospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(MOCK_AMBULANCES);
  const [missions, setMissions] = useState<AmbulanceMission[]>(MOCK_AMBULANCE_MISSIONS);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(INITIAL_SYSTEM_HEALTH);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOG_ENTRIES);
  const [metrics, setMetrics] = useState<EocSummaryMetrics>(INITIAL_METRICS);

  // Refresh Fleet & Incidents from API
  const handleRefreshFleet = async () => {
    try {
      const resFleet = await fetch('/api/fleet');
      if (resFleet.ok && resFleet.headers.get('content-type')?.includes('application/json')) {
        const fleetData = await resFleet.json();
        setAmbulances(fleetData);
      }

      const resMsn = await fetch('/api/fleet/missions');
      if (resMsn.ok && resMsn.headers.get('content-type')?.includes('application/json')) {
        const msnData = await resMsn.json();
        setMissions(msnData);
      }

      const resInc = await fetch('/api/incidents');
      if (resInc.ok && resInc.headers.get('content-type')?.includes('application/json')) {
        const incData = await resInc.json();
        setIncidents(incData);
      }
    } catch (err) {
      console.error('Failed to sync fleet state:', err);
    }
  };

  // Optional API Fetch on Mount
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const resHealth = await fetch('/api/health');
        if (resHealth.ok && resHealth.headers.get('content-type')?.includes('application/json')) {
          const healthData = await resHealth.json();
          setSystemHealth(healthData);
        }

        const resSummary = await fetch('/api/summary');
        if (resSummary.ok && resSummary.headers.get('content-type')?.includes('application/json')) {
          const summaryData = await resSummary.json();
          setMetrics(summaryData);
        }

        handleRefreshFleet();
      } catch (err) {
        // Fallback to initial mock state if client-only rendering
        console.log('[Rakshak EOC] Using embedded state foundation.');
      }
    };
    fetchApiData();
  }, []);

  // Recalculate summary metrics when incidents or hospitals state changes
  useEffect(() => {
    const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL').length;
    const availIcu = hospitals.reduce((acc, h) => acc + h.availableIcuBeds, 0);
    const totalIcu = hospitals.reduce((acc, h) => acc + h.totalIcuBeds, 0);

    setMetrics((prev) => ({
      ...prev,
      activeEmergencies: incidents.length,
      criticalIncidents: criticalCount,
      availableIcuBeds: availIcu,
      totalIcuBeds: totalIcu,
    }));
  }, [incidents, hospitals]);

  // Handler to add a new incident
  const handleAddNewIncident = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);

    // Append log
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      level: 'AUDIT',
      source: 'DISPATCH_CONSOLE',
      message: `New incident reported: ${newIncident.code} - ${newIncident.title} (${newIncident.districtName})`,
      user: currentUser.name,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Handler to toggle disaster mode
  const handleToggleDisasterMode = () => {
    const newStatus = !disasterModeActive;
    setDisasterModeActive(newStatus);

    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      level: newStatus ? 'WARN' : 'INFO',
      source: 'DISASTER_OVERRIDE',
      message: newStatus
        ? 'STATEWIDE DISASTER MODE LEVEL 3 RED ALERT ACTIVATED BY STATE DIRECTOR'
        : 'Statewide Disaster Mode deactivated. Standard EOC protocols restored.',
      user: currentUser.name,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Handler to ping telemetry
  const handleRefreshTelemetry = () => {
    setSystemHealth((prev) => ({
      ...prev,
      postgres: { ...prev.postgres, latencyMs: Number((1.2 + Math.random()).toFixed(1)) },
      redis: { ...prev.redis, memoryUsedMB: Number((60 + Math.random() * 10).toFixed(1)) },
      cpuUsagePercent: Number((15 + Math.random() * 10).toFixed(1)),
      lastCheckTimestamp: new Date().toISOString(),
    }));
  };

  const criticalIncidentsCount = incidents.filter((i) => i.severity === 'CRITICAL').length;

  // Handler for Ambulance Mission Stage Updates
  const handleUpdateMissionStage = async (stage: MissionStage, note?: string) => {
    try {
      const activeMsn = missions.find((m) => m.status !== 'COMPLETED') || missions[0];
      if (!activeMsn) return;

      const response = await fetch('/api/ambulance/missions/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: activeMsn.id,
          stage,
          note: note || `Stage advanced to ${stage}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.mission) {
          setMissions((prev) =>
            prev.map((m) => (m.id === data.mission.id ? data.mission : m))
          );
        }
      } else {
        // Client fallback state update
        setMissions((prev) =>
          prev.map((m) =>
            m.id === activeMsn.id
              ? {
                  ...m,
                  status: stage,
                  timeline: [
                    ...m.timeline,
                    {
                      stage,
                      title: `Mission Stage Updated to ${stage}`,
                      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                      note: note || `Updated via Ambulance Tablet`,
                      actor: ambulanceUserSession?.user.name || 'Emergency Driver',
                    },
                  ],
                }
              : m
          )
        );
      }
    } catch (err) {
      console.error('Failed to update mission stage:', err);
    }
  };

  // Handler for Hackathon Demo Steps
  const handleTriggerPuneDemoStep = async (stepIndex: number) => {
    try {
      const response = await fetch('/api/ambulance/demo/pune-accident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepIndex }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.mission) {
          setMissions((prev) =>
            prev.map((m) => (m.id === data.mission.id ? data.mission : m))
          );
        }
        if (data.incidents) {
          setIncidents(data.incidents);
        }
      }
    } catch (err) {
      console.error('Demo step trigger error:', err);
    }
  };

  // Render Independent Hospital Administration Portal
  if (activePortal === 'HOSPITAL') {
    if (!hospitalUserSession) {
      return (
        <HospitalLoginView
          hospitals={hospitals}
          onLoginSuccess={(session) => setHospitalUserSession(session)}
          onSwitchPortal={setActivePortal}
        />
      );
    }

    const currentHospitalObj =
      hospitals.find((h) => h.id === hospitalUserSession.hospitalId) || hospitals[0];

    return (
      <HospitalPortalLayout
        hospital={currentHospitalObj}
        userSession={hospitalUserSession}
        incidents={incidents}
        onLogout={() => setHospitalUserSession(null)}
        onSwitchPortal={setActivePortal}
      />
    );
  }

  // Render Independent Ambulance Operations Portal
  if (activePortal === 'AMBULANCE') {
    if (!ambulanceUserSession) {
      return (
        <AmbulanceLoginView
          ambulances={ambulances}
          onLoginSuccess={(session) => setAmbulanceUserSession(session)}
          onSwitchPortal={setActivePortal}
        />
      );
    }

    const assignedVehicle =
      ambulances.find((a) => a.id === ambulanceUserSession.user.vehicleId) || ambulances[0];

    const activeMissionObj =
      missions.find((m) => m.ambulanceId === assignedVehicle.id && m.status !== 'COMPLETED') ||
      missions[0];

    return (
      <AmbulancePortalLayout
        session={ambulanceUserSession}
        activeMission={activeMissionObj}
        allMissions={missions}
        allAmbulances={ambulances}
        vehicleHealth={vehicleHealth}
        onLogout={() => setAmbulanceUserSession(null)}
        onSwitchPortal={setActivePortal}
        onUpdateMissionStage={handleUpdateMissionStage}
        onTriggerDemoStep={handleTriggerPuneDemoStep}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream text-stone-700 font-sans flex flex-col antialiased">
      {/* 1. Official Government Header & RBAC Switcher */}
      <Header
        currentUser={currentUser}
        userProfiles={userProfiles}
        onSelectUser={setCurrentUser}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        districts={districts}
        systemHealthScore={metrics.systemHealthScore}
        activePortal={activePortal}
        onSwitchPortal={setActivePortal}
      />

      {/* 2. EOC Primary Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        disasterModeActive={disasterModeActive}
        onToggleDisasterMode={handleToggleDisasterMode}
        criticalIncidentsCount={criticalIncidentsCount}
      />

      {/* 3. Statewide Emergency Alert Banner */}
      <AlertBanner
        disasterModeActive={disasterModeActive}
        onNavigateToIncidents={() => setActiveTab('incidents')}
      />

      {/* 4. Main EOC Operations Area */}
      <main className="flex-1 w-full px-3 py-4 sm:px-4 md:px-5 xl:px-6">
        {activeTab === 'home' && (
          <HomeDashboard
            metrics={metrics}
            districts={districts}
            hospitals={hospitals}
            incidents={incidents}
            systemHealth={systemHealth}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'ops' && (
          <EmergencyOpsView
            districts={districts}
            hospitals={hospitals}
            incidents={incidents}
            onNavigateToIncidents={() => setActiveTab('incidents')}
          />
        )}

        {activeTab === 'incidents' && (
          <LiveIncidentsView
            incidents={incidents}
            districts={districts}
            hospitals={hospitals}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            onAddNewIncident={handleAddNewIncident}
          />
        )}

        {activeTab === 'hospitals' && (
          <HospitalNetworkView
            hospitals={hospitals}
            districts={districts}
            incidents={incidents}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            onSwitchPortal={setActivePortal}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceCommandView
            hospitals={hospitals}
            districts={districts}
            selectedDistrict={selectedDistrict}
          />
        )}

        {activeTab === 'fleet' && (
          <AmbulanceFleetView
            ambulances={ambulances}
            districts={districts}
            incidents={incidents}
            hospitals={hospitals}
            missions={missions}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            onRefreshFleet={handleRefreshFleet}
          />
        )}

        {activeTab === 'ai' && (
          <AiIntelligenceView hospitals={hospitals} districts={districts} />
        )}

        {activeTab === 'realtime' && (
          <RealTimeNetworkView
            onIncidentUpdate={handleRefreshFleet}
            onRefreshAllData={handleRefreshFleet}
          />
        )}

        {activeTab === 'gis' && (
          <GisOperationsView
            districts={districts}
            selectedDistrict={selectedDistrict}
            ambulances={ambulances}
            incidents={incidents}
            hospitals={hospitals}
            onSelectDistrict={setSelectedDistrict}
            onDispatchAssigned={handleRefreshFleet}
          />
        )}

        {activeTab === 'disaster' && (
          <DisasterCommandPortal
            hospitals={hospitals}
            districts={districts}
            ambulances={ambulances}
            onToggleDisasterMode={handleToggleDisasterMode}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView districts={districts} hospitals={hospitals} />
        )}

        {activeTab === 'admin' && (
          <AdministrationView
            userProfiles={userProfiles}
            districts={districts}
            currentUser={currentUser}
            onSelectUser={setCurrentUser}
          />
        )}

        {activeTab === 'observability' && (
          <ObservabilityView
            systemHealth={systemHealth}
            logs={logs}
            onRefreshTelemetry={handleRefreshTelemetry}
          />
        )}

        {activeTab === 'audit' && (
          <HackathonComplianceAudit
            incidents={incidents}
            hospitals={hospitals}
            ambulances={ambulances}
            currentUser={currentUser}
            onTriggerDemo={() => setActiveTab('realtime')}
          />
        )}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* 5. Official EOC Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white/70 px-4 py-3 text-xs text-stone-500">
        <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span
              aria-label="Government of Maharashtra - Public Health and Relief Operations"
              className="font-semibold text-[0] text-transparent after:text-xs after:text-stone-700 after:content-['Government_of_Maharashtra_-_Public_Health_and_Relief_Operations']"
            >
              Government of Maharashtra — Public Health & Relief Operations Department
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] [&>span:nth-child(2)]:hidden">
            <span>Platform: Rakshak AI v1.0.0</span>
            <span>•</span>
            <span>Pilot Districts: Nagpur, Pune, Mumbai, Nashik, Wardha, Amravati, Chandrapur</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
