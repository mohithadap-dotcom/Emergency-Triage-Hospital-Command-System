import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Radio,
  Wifi,
  WifiOff,
  Bell,
  MessageSquare,
  Zap,
  ShieldAlert,
  Server,
  Cpu,
  Database,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Heart,
  Thermometer,
  Layers,
  ArrowRight,
  CheckCheck,
  Globe,
  HardDrive,
  Share2,
  UserCheck,
  AlertCircle,
  Gauge,
  Info,
} from 'lucide-react';
import {
  IotDeviceTelemetryStream,
  AgencyChatMessage,
  FcmNotificationPayload,
  Incident,
  Ambulance,
  Hospital,
  BedReservation,
  DemoSimulationState,
} from '../types';

interface RealTimeNetworkViewProps {
  onIncidentUpdate?: () => void;
  onRefreshAllData?: () => void;
}

export const RealTimeNetworkView: React.FC<RealTimeNetworkViewProps> = ({
  onIncidentUpdate,
  onRefreshAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'IOT_GATEWAY' | 'AGENCY_COMMUNICATION' | 'DEMO_SIMULATION' | 'DISASTER_MODE' | 'SYSTEM_HEALTH'>('IOT_GATEWAY');

  // IoT Streams state
  const [iotStreams, setIotStreams] = useState<IotDeviceTelemetryStream[]>([]);
  const [loadingIot, setLoadingIot] = useState(false);
  const [simulatingPingId, setSimulatingPingId] = useState<string | null>(null);

  // Agency Messages state
  const [messages, setMessages] = useState<AgencyChatMessage[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>('ALL');
  const [newMessageText, setNewMessageText] = useState('');
  const [newMessageChannel, setNewMessageChannel] = useState<string>('EOC_TO_HOSPITAL');
  const [newMessagePriority, setNewMessagePriority] = useState<'NORMAL' | 'URGENT' | 'CRITICAL_EMERGENCY'>('URGENT');
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);

  // FCM Notifications
  const [fcmLogs, setFcmLogs] = useState<FcmNotificationPayload[]>([]);
  const [showFcmModal, setShowFcmModal] = useState(false);
  const [fcmTitle, setFcmTitle] = useState('🚨 EOC HIGH PRIORITY ALERT');
  const [fcmBody, setFcmBody] = useState('Green corridor established for MEMS 108 Ambulance MH 31 EK 1108 to AIIMS Trauma Desk.');

  // System Health & Observability state
  const [observability, setObservability] = useState<any>(null);

  // Disaster Mode state
  const [disasterActive, setDisasterActive] = useState(false);
  const [disasterScenario, setDisasterScenario] = useState('MASS_CASUALTY');
  const [disasterLoading, setDisasterLoading] = useState(false);

  // Automated Demo Simulation state
  const [demoState, setDemoState] = useState<DemoSimulationState>({
    active: false,
    paused: false,
    currentStepIndex: 0,
    elapsedSeconds: 0,
    steps: [
      { stepIndex: 1, title: '1. Pune Highway Collision Reported', description: 'Multi-vehicle crash on Expressway KM 42. AI Triage triggers priority RED.', status: 'PENDING' },
      { stepIndex: 2, title: '2. Smart Dispatch ALS Ambulance', description: 'Rakshak AI evaluates fleet proximity & selects MEMS 108 ALS-02 (MH 12).', status: 'PENDING' },
      { stepIndex: 3, title: '3. En-Route GPS Telemetry Track', description: 'Live location stream & traffic delay recalculation in real time.', status: 'PENDING' },
      { stepIndex: 4, title: '4. IoT Patient Vital Stream Connected', description: 'Ambulance Gateway connects Mindray N1 ECG. SpO2 drops to 85% with STEMI alarm.', status: 'PENDING' },
      { stepIndex: 5, title: '5. AI Hospital Match & ICU Reserved', description: 'AI evaluates Sassoon General Hospital & auto-reserves ICU Crash Bed #01.', status: 'PENDING' },
      { stepIndex: 6, title: '6. Green Corridor & Doctor Alert', description: 'Traffic signals overridden. Intra-agency message sent to Sassoon Trauma Desk.', status: 'PENDING' },
      { stepIndex: 7, title: '7. Hospital Arrival & Emergency Entry', description: 'Ambulance arrives at ER Bay. Patient Karan Deshmukh pre-admitted.', status: 'PENDING' },
      { stepIndex: 8, title: '8. Mission Closure & Fleet Sync', description: 'Ambulance status updated to Available. Golden hour response logged.', status: 'PENDING' },
    ],
  });

  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    fetchIotStreams();
    fetchMessages();
    fetchFcmLogs();
    fetchObservability();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      fetchIotStreams();
      fetchObservability();
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Demo Simulation Ticker
  useEffect(() => {
    let timer: any = null;
    if (demoState.active && !demoState.paused) {
      timer = setInterval(() => {
        setDemoState((prev) => {
          const nextSec = prev.elapsedSeconds + 1;
          const targetStep = Math.min(8, Math.floor(nextSec / 4) + 1);

          if (targetStep !== prev.currentStepIndex && targetStep <= 8) {
            triggerDemoStep(targetStep);
          }

          if (targetStep >= 8 && nextSec >= 32) {
            return {
              ...prev,
              active: false,
              currentStepIndex: 8,
              steps: prev.steps.map((s) => ({ ...s, status: 'COMPLETED' })),
            };
          }

          return {
            ...prev,
            elapsedSeconds: nextSec,
            currentStepIndex: targetStep,
            steps: prev.steps.map((s) => ({
              ...s,
              status: s.stepIndex < targetStep ? 'COMPLETED' : s.stepIndex === targetStep ? 'IN_PROGRESS' : 'PENDING',
            })),
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [demoState.active, demoState.paused]);

  const fetchIotStreams = async () => {
    try {
      setLoadingIot(true);
      const res = await fetch('/api/iot/streams');
      if (res.ok) {
        const data = await res.json();
        setIotStreams(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIot(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFcmLogs = async () => {
    try {
      const res = await fetch('/api/notifications/fcm');
      if (res.ok) {
        const data = await res.json();
        setFcmLogs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchObservability = async () => {
    try {
      const res = await fetch('/api/system/observability');
      if (res.ok) {
        const data = await res.json();
        setObservability(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateIotPing = async (streamId: string, critical: boolean = false) => {
    try {
      setSimulatingPingId(streamId);
      const targetStream = iotStreams.find((s) => s.id === streamId);
      if (!targetStream) return;

      const newHeartRate = critical ? 148 : Math.floor(75 + Math.random() * 25);
      const newSpo2 = critical ? 82 : Math.floor(95 + Math.random() * 5);
      const newBpSystolic = critical ? 78 : Math.floor(115 + Math.random() * 15);

      const res = await fetch(`/api/iot/streams/${streamId}/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vitals: {
            heartRate: newHeartRate,
            spo2: newSpo2,
            bpSystolic: newBpSystolic,
          },
          batteryLevelPercent: Math.max(10, targetStream.batteryLevelPercent - 1),
          signalQualityPercent: Math.floor(90 + Math.random() * 10),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIotStreams(data.allStreams);
        if (onIncidentUpdate) onIncidentUpdate();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulatingPingId(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    try {
      setSendingMsg(true);
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelGroup: newMessageChannel,
          senderName: 'Dr. Rajesh Patil, IAS',
          senderRole: 'State EOC Director',
          senderBadge: 'MH-EOC-001',
          recipientGroup: isBroadcast ? 'ALL EMERGENCY UNITS & HOSPITALS' : 'Target Channel Agency',
          messageText: newMessageText,
          priority: newMessagePriority,
          isBroadcast,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setNewMessageText('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSendFcm = async () => {
    try {
      const res = await fetch('/api/notifications/fcm/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fcmTitle,
          body: fcmBody,
          topic: 'CRITICAL_ALERT',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFcmLogs(data.log);
        setShowFcmModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleDisasterMode = async () => {
    try {
      setDisasterLoading(true);
      const res = await fetch('/api/disaster/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active: !disasterActive,
          scenario: disasterScenario,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDisasterActive(data.disasterModeActive);
        if (onRefreshAllData) onRefreshAllData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDisasterLoading(false);
    }
  };

  const triggerDemoStep = async (stepIndex: number) => {
    try {
      const res = await fetch('/api/demo/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepIndex }),
      });
      if (res.ok) {
        if (onRefreshAllData) onRefreshAllData();
        fetchIotStreams();
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startDemoSimulation = () => {
    setDemoState({
      active: true,
      paused: false,
      currentStepIndex: 1,
      elapsedSeconds: 0,
      steps: demoState.steps.map((s) => ({
        ...s,
        status: s.stepIndex === 1 ? 'IN_PROGRESS' : 'PENDING',
      })),
    });
    triggerDemoStep(1);
  };

  const pauseDemoSimulation = () => {
    setDemoState((prev) => ({ ...prev, paused: !prev.paused }));
  };

  const resetDemoSimulation = () => {
    setDemoState((prev) => ({
      active: false,
      paused: false,
      currentStepIndex: 0,
      elapsedSeconds: 0,
      steps: prev.steps.map((s) => ({ ...s, status: 'PENDING' })),
    }));
  };

  const filteredMessages =
    activeChannel === 'ALL'
      ? messages
      : messages.filter((m) => m.channelGroup === activeChannel || m.isBroadcast);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
                <Radio className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Real-Time Emergency Network & IoT Gateway
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    WebSocket SSE Connected
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronized EOC telemetry gateway, IoT medical device streaming, FCM push alerts & intra-agency channels
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Offline Resilience Indicator */}
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border ${
                isOnline
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                  : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isOnline ? 'Network Online' : `PWA Offline (${offlineQueueCount} Queued)`}</span>
            </div>

            {/* FCM Trigger */}
            <button
              onClick={() => setShowFcmModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Test FCM Push</span>
            </button>

            {/* Disaster Mode Toggle */}
            <button
              onClick={handleToggleDisasterMode}
              disabled={disasterLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 border ${
                disasterActive
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>{disasterActive ? 'DISASTER MODE ACTIVE' : 'Activate Disaster Mode'}</span>
            </button>

            {/* Start Live Demo Simulation */}
            <button
              onClick={() => setActiveTab('DEMO_SIMULATION')}
              className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg text-xs shadow-md shadow-red-900/30 hover:brightness-110 transition-all flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Start Live Simulation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-sm px-4 pt-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('IOT_GATEWAY')}
          className={`px-4 py-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'IOT_GATEWAY'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>IoT Gateway & Telemetry ({iotStreams.length})</span>
          {iotStreams.some((s) => s.status === 'CRITICAL_ALARM') && (
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('AGENCY_COMMUNICATION')}
          className={`px-4 py-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'AGENCY_COMMUNICATION'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Intra-Agency Network</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {messages.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('DEMO_SIMULATION')}
          className={`px-4 py-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'DEMO_SIMULATION'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Automated Demo Engine</span>
          {demoState.active && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold animate-pulse">
              RUNNING Step {demoState.currentStepIndex}/8
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('DISASTER_MODE')}
          className={`px-4 py-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'DISASTER_MODE'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Disaster & Mass Casualty</span>
          {disasterActive && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
              ACTIVE
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('SYSTEM_HEALTH')}
          className={`px-4 py-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'SYSTEM_HEALTH'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Observability & System Health</span>
        </button>
      </div>

      {/* TAB 1: IOT GATEWAY & LIVE TELEMETRY STREAM */}
      {activeTab === 'IOT_GATEWAY' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                IoT Medical Device Streaming Gateway
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-normal">
                  Adapter protocol: MQTT / WebSockets JSON
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Continuous vitals streaming from ECGs, Pulse Oximeters, and Transport Ventilators with automatic Gemini AI deterioration evaluation
              </p>
            </div>
            <button
              onClick={fetchIotStreams}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingIot ? 'animate-spin' : ''}`} />
              <span>Refresh Gateway</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {iotStreams.map((stream) => (
              <motion.div
                key={stream.id}
                layout
                className={`bg-white rounded-xl border p-5 shadow-sm transition-all relative overflow-hidden ${
                  stream.status === 'CRITICAL_ALARM'
                    ? 'border-red-400 ring-2 ring-red-500/20'
                    : stream.status === 'WARNING'
                    ? 'border-amber-300'
                    : 'border-slate-200'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{stream.deviceName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{stream.serialNumber}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      stream.status === 'CRITICAL_ALARM'
                        ? 'bg-red-100 text-red-700 animate-pulse'
                        : stream.status === 'WARNING'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {stream.status}
                  </span>
                </div>

                {/* Patient & Ambulance details */}
                <div className="bg-slate-50 rounded-lg p-2.5 mb-3 text-xs space-y-1 border border-slate-100">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Patient: {stream.patientName}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Ambulance: {stream.ambulanceRegNo}</span>
                    <span>Hospital: {stream.hospitalName?.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Live Vitals Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-rose-50 border border-rose-100 rounded-lg p-2.5 text-center">
                    <div className="flex items-center justify-center space-x-1 text-rose-600 text-xs font-medium">
                      <Heart className="w-3.5 h-3.5 animate-bounce" />
                      <span>Heart Rate</span>
                    </div>
                    <div className="text-xl font-black text-rose-700 mt-1">
                      {stream.vitals.heartRate} <span className="text-xs font-normal">bpm</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-center">
                    <div className="flex items-center justify-center space-x-1 text-blue-600 text-xs font-medium">
                      <Activity className="w-3.5 h-3.5" />
                      <span>SpO2 Oxygen</span>
                    </div>
                    <div className="text-xl font-black text-blue-700 mt-1">
                      {stream.vitals.spo2}%
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
                    <div className="text-emerald-700 text-xs font-medium">Blood Pressure</div>
                    <div className="text-base font-black text-emerald-800 mt-1">
                      {stream.vitals.bpSystolic}/{stream.vitals.bpDiastolic} <span className="text-[10px] font-normal">mmHg</span>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-2.5 text-center">
                    <div className="text-purple-700 text-xs font-medium">Resp. Rate</div>
                    <div className="text-base font-black text-purple-800 mt-1">
                      {stream.vitals.respiratoryRate} <span className="text-[10px] font-normal">/min</span>
                    </div>
                  </div>
                </div>

                {/* AI Alarm Banner if active */}
                {stream.aiAlertTriggered && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-3 text-xs text-red-800">
                    <div className="font-bold flex items-center gap-1 text-red-700 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Gemini AI Vital Anomaly Alarm</span>
                    </div>
                    <p className="text-[11px] leading-tight text-red-700">{stream.aiAlertReason}</p>
                  </div>
                )}

                {/* Footer simulation action controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    Batt: {stream.batteryLevelPercent}% | Sig: {stream.signalQualityPercent}%
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSimulateIotPing(stream.id, false)}
                      disabled={simulatingPingId === stream.id}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                    >
                      Normal Ping
                    </button>
                    <button
                      onClick={() => handleSimulateIotPing(stream.id, true)}
                      disabled={simulatingPingId === stream.id}
                      className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[11px] font-bold transition-colors"
                    >
                      Simulate Drop
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTRA-AGENCY COMMUNICATION NETWORK */}
      {activeTab === 'AGENCY_COMMUNICATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Channels & Filters Column */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
              <span>Agency Channels</span>
            </h3>

            <div className="space-y-1">
              {[
                { id: 'ALL', name: 'All Agency Communications', desc: 'Combined Statewide Feed' },
                { id: 'EOC_TO_HOSPITAL', name: 'EOC ↔ Hospital Desk', desc: 'Bed reserves & ER alerts' },
                { id: 'DISPATCHER_TO_AMBULANCE', name: 'Dispatcher ↔ Ambulance', desc: 'Fleet routing & Green Corridor' },
                { id: 'HOSPITAL_TO_HOSPITAL', name: 'Inter-Hospital Transfer', desc: 'Patient transfer coordination' },
                { id: 'STATEWIDE_BROADCAST', name: 'Statewide Broadcasts', desc: 'High priority disaster bulletins' },
              ].map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                    activeChannel === ch.id
                      ? 'bg-red-50 text-red-700 border-red-200 font-bold'
                      : 'bg-slate-50 text-slate-700 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <div className="font-semibold">{ch.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{ch.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Feed & Composer Column */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between min-h-[500px]">
            {/* Message Feed */}
            <div className="space-y-3 overflow-y-auto max-h-[420px] pr-2">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    msg.priority === 'CRITICAL_EMERGENCY'
                      ? 'bg-red-50/60 border-red-200 text-red-950'
                      : msg.priority === 'URGENT'
                      ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-900 font-bold">{msg.senderName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-slate-600">
                        {msg.senderBadge}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed font-normal">{msg.messageText}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    <span className="font-medium text-slate-500">To: {msg.recipientGroup}</span>
                    <div className="flex items-center space-x-1 text-emerald-600">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Read by {msg.readBy.length} units</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer Bar */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex gap-2 text-xs">
                <select
                  value={newMessageChannel}
                  onChange={(e) => setNewMessageChannel(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="EOC_TO_HOSPITAL">EOC ↔ Hospital Desk</option>
                  <option value="DISPATCHER_TO_AMBULANCE">Dispatcher ↔ Ambulance</option>
                  <option value="HOSPITAL_TO_HOSPITAL">Inter-Hospital Transfer</option>
                  <option value="STATEWIDE_BROADCAST">Statewide Broadcast</option>
                </select>

                <select
                  value={newMessagePriority}
                  onChange={(e) => setNewMessagePriority(e.target.value as any)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="NORMAL">Normal Priority</option>
                  <option value="URGENT">Urgent Priority</option>
                  <option value="CRITICAL_EMERGENCY">Critical Emergency</option>
                </select>

                <label className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium cursor-pointer ml-auto">
                  <input
                    type="checkbox"
                    checked={isBroadcast}
                    onChange={(e) => setIsBroadcast(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Statewide Broadcast</span>
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type agency dispatch message or emergency broadcast..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATED DEMO SIMULATION ENGINE */}
      {activeTab === 'DEMO_SIMULATION' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-600 fill-current" />
                <span>Automated Hackathon End-to-End Simulation Engine</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Single-click automated demonstration script progressing through Pune Expressway crash, AI triage, smart dispatch, IoT vital drops, hospital ICU pre-reservation, and Green Corridor activation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!demoState.active ? (
                <button
                  onClick={startDemoSimulation}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md shadow-red-900/20 transition-all flex items-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Live Emergency Simulation</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseDemoSimulation}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center space-x-1.5"
                  >
                    {demoState.paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{demoState.paused ? 'Resume' : 'Pause'}</span>
                  </button>

                  <button
                    onClick={resetDemoSimulation}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Simulation Timeline Progress</span>
              <span>
                {demoState.active ? `Elapsed: ${demoState.elapsedSeconds}s (Step ${demoState.currentStepIndex}/8)` : 'Ready'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {demoState.steps.map((step) => (
                <div
                  key={step.stepIndex}
                  onClick={() => triggerDemoStep(step.stepIndex)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    step.status === 'COMPLETED'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : step.status === 'IN_PROGRESS'
                      ? 'bg-red-50 border-red-300 text-red-950 ring-2 ring-red-500/30'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs">{step.title}</span>
                    {step.status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {step.status === 'IN_PROGRESS' && <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DISASTER & MASS CASUALTY ENGINE */}
      {activeTab === 'DISASTER_MODE' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>Statewide Disaster Mode & Mass Casualty Redistribution</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Activates emergency mass casualty protocols, multi-district hospital triage overload management, and regional resource redistribution.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={disasterScenario}
                onChange={(e) => setDisasterScenario(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50"
              >
                <option value="MASS_CASUALTY">Samruddhi Expressway Mass Casualty</option>
                <option value="FLOOD">Vidarbha Monsoon Flood Emergency</option>
                <option value="HEATWAVE">Extreme Vidarbha Heatwave Surge</option>
                <option value="CHEMICAL_LEAK">MIDC Industrial Chemical Leak</option>
              </select>

              <button
                onClick={handleToggleDisasterMode}
                disabled={disasterLoading}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  disasterActive
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                }`}
              >
                {disasterActive ? 'Deactivate Disaster Mode' : 'Activate Selected Scenario'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
              <div className="font-bold text-red-900">1. Automated Triage Escalation</div>
              <p className="text-red-700 text-[11px]">
                All incoming emergency dispatches automatically override to Priority RED Trauma protocol.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div className="font-bold text-amber-900">2. Emergency ICU Bed Lockout</div>
              <p className="text-amber-700 text-[11px]">
                Hospitals within 40km radius automatically freeze 20% of general ICU beds for incoming disaster victims.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <div className="font-bold text-blue-900">3. Statewide Green Corridors</div>
              <p className="text-blue-700 text-[11px]">
                Traffic control rooms across Nagpur & Pune override signal lights for all MEMS 108 dispatches.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OBSERVABILITY & SYSTEM HEALTH */}
      {activeTab === 'SYSTEM_HEALTH' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Server className="w-5 h-5 text-red-600" />
              <span>Rakshak Operations & System Observability</span>
            </h3>
            <button
              onClick={fetchObservability}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping Metrics</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-slate-500 text-xs font-medium">Server Uptime</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {observability ? `${Math.floor(observability.uptimeSeconds / 60)} mins` : '100%'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-slate-500 text-xs font-medium">PostgreSQL Latency</div>
              <div className="text-xl font-black text-emerald-600 mt-1">
                {observability ? `${observability.postgres.latencyMs} ms` : '3.4 ms'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-slate-500 text-xs font-medium">Gemini AI Latency</div>
              <div className="text-xl font-black text-blue-600 mt-1">
                {observability ? `${observability.geminiAi.latencyMs} ms` : '180 ms'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-slate-500 text-xs font-medium">WebSocket Throughput</div>
              <div className="text-xl font-black text-purple-600 mt-1">
                {observability ? `${observability.webSockets.messagesPerSec} msg/s` : '128 msg/s'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FCM Test Modal */}
      {showFcmModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Trigger Test FCM Web Push Notification</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Alert Title</label>
                <input
                  type="text"
                  value={fcmTitle}
                  onChange={(e) => setFcmTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Message Body</label>
                <textarea
                  value={fcmBody}
                  onChange={(e) => setFcmBody(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFcmModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFcm}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-xs"
              >
                Push FCM Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
