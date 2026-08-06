import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Flame,
  Users,
  Building2,
  Truck,
  HeartPulse,
  MapPin,
  Radio,
  Clock,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
} from 'lucide-react';
import {
  DisasterIncident,
  DisasterTriageVictim,
  FieldHospital,
  DisasterBroadcast,
  DisasterTimelineEvent,
  DisasterCommandChatMessage,
  AiDisasterRecommendation,
  IcsRole,
  Hospital,
  District,
  Ambulance,
} from '../types';

import { DisasterIcsOverview } from './disaster/DisasterIcsOverview';
import { DisasterTriageView } from './disaster/DisasterTriageView';
import { DisasterGisMapView } from './disaster/DisasterGisMapView';
import { DisasterResourceMatrix } from './disaster/DisasterResourceMatrix';
import { DisasterHospitalSurgeView } from './disaster/DisasterHospitalSurgeView';
import { DisasterBroadcastView } from './disaster/DisasterBroadcastView';
import { DisasterFieldHospitalsView } from './disaster/DisasterFieldHospitalsView';
import { DisasterTimelineAarView } from './disaster/DisasterTimelineAarView';
import { DisasterCommandChatView } from './disaster/DisasterCommandChatView';
import { DisasterAiCommanderView } from './disaster/DisasterAiCommanderView';
import { DisasterSetupView } from './disaster/DisasterSetupView';

interface DisasterCommandPortalProps {
  hospitals: Hospital[];
  districts: District[];
  ambulances: Ambulance[];
  onToggleDisasterMode?: () => void;
}

export const DisasterCommandPortal: React.FC<DisasterCommandPortalProps> = ({
  hospitals,
  districts,
  ambulances,
  onToggleDisasterMode,
}) => {
  // ICS Active Role State
  const [activeIcsRole, setActiveIcsRole] = useState<IcsRole>('COMMANDER');

  // Active Sub Tab
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');

  // Disaster State Store
  const [disasters, setDisasters] = useState<DisasterIncident[]>([]);
  const [victims, setVictims] = useState<DisasterTriageVictim[]>([]);
  const [fieldHospitals, setFieldHospitals] = useState<FieldHospital[]>([]);
  const [broadcasts, setBroadcasts] = useState<DisasterBroadcast[]>([]);
  const [timeline, setTimeline] = useState<DisasterTimelineEvent[]>([]);
  const [chatMessages, setChatMessages] = useState<DisasterCommandChatMessage[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AiDisasterRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoActiveText, setDemoActiveText] = useState<string | null>(null);

  // Fetch Disaster Data from API
  const fetchDisasterData = async () => {
    try {
      const [resInc, resVic, resFh, resBc, resTl, resChat, resAi] = await Promise.all([
        fetch('/api/disaster/incidents'),
        fetch('/api/disaster/victims'),
        fetch('/api/disaster/field-hospitals'),
        fetch('/api/disaster/broadcasts'),
        fetch('/api/disaster/timeline'),
        fetch('/api/disaster/chat'),
        fetch('/api/disaster/ai-recommendations'),
      ]);

      if (resInc.ok) setDisasters(await resInc.json());
      if (resVic.ok) setVictims(await resVic.json());
      if (resFh.ok) setFieldHospitals(await resFh.json());
      if (resBc.ok) setBroadcasts(await resBc.json());
      if (resTl.ok) setTimeline(await resTl.json());
      if (resChat.ok) setChatMessages(await resChat.json());
      if (resAi.ok) setAiRecommendations(await resAi.json());
    } catch (err) {
      console.error('Failed to sync disaster data from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasterData();
  }, []);

  const activeDisaster = disasters[0] || {
    id: 'dis-pune-01',
    code: 'DIS-2026-PUNE-001',
    title: 'Mass Casualty Multi-Vehicle Collision on NH-48 Expressway (KM 62)',
    type: 'HIGHWAY_ACCIDENT',
    severity: 'LEVEL_3_RED_ALERT',
    status: 'ACTIVE',
    districtId: 'pune',
    districtName: 'Pune',
    locationName: 'NH-48 Pune-Satara Highway, Expressway Interchange KM 62',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    radiusKm: 4.5,
    declaredAt: new Date().toISOString(),
    declaredBy: 'State Disaster Operations Chief',
    estimatedVictims: 45,
    triageBreakdown: { red: 8, yellow: 18, green: 15, black: 4 },
    specialHazards: ['Chemical tanker rollover', 'Heavy traffic congestion', 'Trapped victims in bus'],
    resources: {
      ambulancesNeeded: 25,
      ambulancesDispatched: 19,
      icuBedsNeeded: 14,
      icuBedsReserved: 12,
      oxygenCylindersNeeded: 40,
      oxygenCylindersDispatched: 35,
      bloodUnitsNeeded: 50,
      bloodUnitsDispatched: 42,
      hazmatKitsNeeded: 10,
      hazmatKitsDispatched: 8,
      traumaSurgeonsNeeded: 6,
      traumaSurgeonsAssigned: 5,
    },
    affectedHospitals: ['hosp-pne-01', 'hosp-pne-02'],
    greenCorridorActive: true,
    description: 'Level-3 Disaster Emergency active on NH-48 Expressway.',
  };

  // Trigger Mass Casualty Demo Scenario
  const handleTriggerDemoScenario = async () => {
    try {
      const res = await fetch('/api/disaster/demo-trigger', { method: 'POST' });
      if (res.ok) {
        setDemoActiveText('MASS CASUALTY PUNE HIGHWAY DEMO SCENARIO ACTIVE — 45 VICTIMS SYNCHRONIZED!');
        fetchDisasterData();
        if (onToggleDisasterMode) onToggleDisasterMode();
        setTimeout(() => setDemoActiveText(null), 6000);
      }
    } catch (err) {
      console.error('Failed to trigger demo scenario:', err);
    }
  };

  // Add Victim Callback
  const handleAddVictim = async (victimData: Partial<DisasterTriageVictim>) => {
    try {
      const res = await fetch('/api/disaster/victims/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(victimData),
      });
      if (res.ok) fetchDisasterData();
    } catch (err) {
      console.error('Failed to add victim:', err);
    }
  };

  // Create Disaster Callback
  const handleCreateDisaster = async (disasterData: Partial<DisasterIncident>) => {
    try {
      const res = await fetch('/api/disaster/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disasterData),
      });
      if (res.ok) {
        fetchDisasterData();
        setActiveSubTab('overview');
      }
    } catch (err) {
      console.error('Failed to create disaster:', err);
    }
  };

  // Execute AI Recommendation
  const handleExecuteAiRecommendation = async (id: string) => {
    try {
      const res = await fetch(`/api/disaster/ai-recommendations/${id}/execute`, { method: 'POST' });
      if (res.ok) fetchDisasterData();
    } catch (err) {
      console.error('Failed to execute AI recommendation:', err);
    }
  };

  // Send Broadcast
  const handleSendBroadcast = async (bcData: Partial<DisasterBroadcast>) => {
    try {
      const res = await fetch('/api/disaster/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bcData),
      });
      if (res.ok) fetchDisasterData();
    } catch (err) {
      console.error('Failed to send broadcast:', err);
    }
  };

  // Add Field Hospital
  const handleAddFieldHospital = async (fhData: Partial<FieldHospital>) => {
    try {
      const res = await fetch('/api/disaster/field-hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fhData),
      });
      if (res.ok) fetchDisasterData();
    } catch (err) {
      console.error('Failed to add field hospital:', err);
    }
  };

  // Send Chat Message
  const handleSendChatMessage = async (msgData: Partial<DisasterCommandChatMessage>) => {
    try {
      const res = await fetch('/api/disaster/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData),
      });
      if (res.ok) fetchDisasterData();
    } catch (err) {
      console.error('Failed to send chat message:', err);
    }
  };

  const icsRoles: { id: IcsRole; title: string }[] = [
    { id: 'COMMANDER', title: 'Incident Commander' },
    { id: 'OPERATIONS_CHIEF', title: 'Operations Chief' },
    { id: 'PLANNING_CHIEF', title: 'Planning Chief' },
    { id: 'LOGISTICS_CHIEF', title: 'Logistics Chief' },
    { id: 'MEDICAL_DIRECTOR', title: 'Medical Director' },
    { id: 'HOSPITAL_COORDINATOR', title: 'Hospital Coordinator' },
    { id: 'AMBULANCE_COMMANDER', title: 'Ambulance Commander' },
    { id: 'DISTRICT_COLLECTOR', title: 'District Collector' },
  ];

  const subTabs = [
    { id: 'overview', label: 'ICS Dashboard', icon: ShieldAlert },
    { id: 'triage', label: 'START Triage', icon: HeartPulse, badge: victims.length },
    { id: 'gis', label: 'Live GIS Map', icon: MapPin },
    { id: 'resources', label: 'Resource Matrix', icon: Truck },
    { id: 'surge', label: 'Hospital Surge', icon: Building2 },
    { id: 'broadcast', label: 'Broadcast Alerts', icon: Radio },
    { id: 'field', label: 'Field Hospitals', icon: Building2 },
    { id: 'timeline', label: 'AAR Audit Log', icon: Clock },
    { id: 'chat', label: 'Command Chat', icon: MessageSquare },
    { id: 'ai', label: 'AI Disaster Commander', icon: Sparkles },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Top Portal Command Banner */}
      <div className="bg-white border-b-2 border-rose-600 rounded-xl p-4 text-stone-900 shadow-lg shadow-stone-300/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-600 p-3 rounded-lg shadow-lg flex items-center justify-center animate-pulse">
            <Flame className="w-7 h-7 text-stone-900" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-stone-900 flex items-center gap-2">
                NATIONAL DISASTER RESPONSE
                <span className="text-xs bg-rose-600 text-stone-900 font-black px-2.5 py-0.5 rounded uppercase tracking-wider shadow">
                  UNIFIED COMMAND
                </span>
              </h1>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Statewide Incident Command System (ICS), Mass Casualty Triage & Multi-Hospital Surge Orchestration
            </p>
          </div>
        </div>

        {/* Demo Trigger Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTriggerDemoScenario}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 animate-bounce" />
            <span>TRIGGER MASS CASUALTY PUNE DEMO</span>
          </button>
        </div>
      </div>

      {/* Demo Toast Notification Banner */}
      {demoActiveText && (
        <div className="bg-amber-500 text-slate-950 font-black text-xs p-3 rounded-xl shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{demoActiveText}</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-cream text-amber-400 px-2 py-0.5 rounded">
            LEVEL-3 SIMULATION ACTIVE
          </span>
        </div>
      )}

      {/* 2. ICS Role Switcher Strip */}
      <div className="bg-cream border border-stone-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-amber-400 font-bold">
          <Users className="w-4 h-4" />
          <span>Active ICS Command Role:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {icsRoles.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveIcsRole(r.id)}
              className={`px-3 py-1.5 rounded-md font-bold transition-all whitespace-nowrap ${
                activeIcsRole === r.id
                  ? 'bg-amber-500 text-slate-950 shadow-md transform scale-105 font-black'
                  : 'bg-stone-100 text-stone-600 hover:bg-slate-700 hover:text-stone-900'
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Sub-Module Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-stone-200 overflow-x-auto pb-1 no-scrollbar">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'bg-white text-rose-600 border-rose-600 shadow-sm font-extrabold'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-100 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-stone-500'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 bg-rose-600 text-stone-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Sub-Tab Render Views */}
      <div className="pt-2">
        {activeSubTab === 'overview' && (
          <DisasterIcsOverview
            disaster={activeDisaster}
            activeIcsRole={activeIcsRole}
            victims={victims}
            fieldHospitals={fieldHospitals}
            hospitals={hospitals}
            aiRecommendations={aiRecommendations}
            onExecuteAiRecommendation={handleExecuteAiRecommendation}
            onNavigateSubTab={setActiveSubTab}
            onTriggerDemoScenario={handleTriggerDemoScenario}
          />
        )}

        {activeSubTab === 'triage' && (
          <DisasterTriageView
            disaster={activeDisaster}
            victims={victims}
            hospitals={hospitals}
            ambulances={ambulances}
            onAddVictim={handleAddVictim}
          />
        )}

        {activeSubTab === 'gis' && (
          <DisasterGisMapView
            disaster={activeDisaster}
            hospitals={hospitals}
            ambulances={ambulances}
            fieldHospitals={fieldHospitals}
          />
        )}

        {activeSubTab === 'resources' && (
          <DisasterResourceMatrix disaster={activeDisaster} hospitals={hospitals} />
        )}

        {activeSubTab === 'surge' && (
          <DisasterHospitalSurgeView disaster={activeDisaster} hospitals={hospitals} />
        )}

        {activeSubTab === 'broadcast' && (
          <DisasterBroadcastView
            disaster={activeDisaster}
            broadcasts={broadcasts}
            onSendBroadcast={handleSendBroadcast}
          />
        )}

        {activeSubTab === 'field' && (
          <DisasterFieldHospitalsView
            disaster={activeDisaster}
            fieldHospitals={fieldHospitals}
            onAddFieldHospital={handleAddFieldHospital}
          />
        )}

        {activeSubTab === 'timeline' && (
          <DisasterTimelineAarView disaster={activeDisaster} timeline={timeline} />
        )}

        {activeSubTab === 'chat' && (
          <DisasterCommandChatView
            disaster={activeDisaster}
            chatMessages={chatMessages}
            activeIcsRole={activeIcsRole}
            onSendMessage={handleSendChatMessage}
          />
        )}

        {activeSubTab === 'ai' && (
          <DisasterAiCommanderView
            disaster={activeDisaster}
            recommendations={aiRecommendations}
            onExecuteRecommendation={handleExecuteAiRecommendation}
          />
        )}

        {activeSubTab === 'setup' && (
          <DisasterSetupView districts={districts} onCreateDisaster={handleCreateDisaster} />
        )}
      </div>
    </div>
  );
};
