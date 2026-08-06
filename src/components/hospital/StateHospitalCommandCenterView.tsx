import React, { useState, useEffect } from 'react';
import {
  Building2,
  Activity,
  BedDouble,
  Droplet,
  Zap,
  ArrowLeftRight,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Sparkles,
  RefreshCw,
  Plus,
  BarChart3,
  MapPin,
  FileText,
  Radio,
  Send,
  AlertTriangle,
  Lock,
  Unlock,
  CheckSquare,
  ChevronRight,
  Users,
  Stethoscope,
  HeartPulse,
  Award,
  Layers,
  ArrowUpRight,
  Sliders,
} from 'lucide-react';
import {
  Hospital,
  District,
  Incident,
  ResourceExchangeItem,
  PatientTransferWorkflow,
  HospitalDiversionRecommendation,
  HospitalComparisonMetrics,
  HospitalCollaborationBroadcast,
  StateResourceReservation,
  AiCommandRecommendation,
} from '../../types';

interface StateHospitalCommandCenterViewProps {
  hospitals: Hospital[];
  districts: District[];
  incidents?: Incident[];
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  onAuditLog?: (category: string, details: string) => void;
}

export const StateHospitalCommandCenterView: React.FC<StateHospitalCommandCenterViewProps> = ({
  hospitals,
  districts,
  incidents = [],
  selectedDistrict,
  onSelectDistrict,
  onAuditLog,
}) => {
  // Navigation Sub-Tabs
  const [activeTab, setActiveTab] = useState<
    | 'NETWORK_COMMAND'
    | 'RESOURCE_BALANCER'
    | 'RESOURCE_EXCHANGE'
    | 'TRANSFER_COMMAND'
    | 'DIVERSION_ENGINE'
    | 'DISTRICT_MATRIX'
    | 'HOSPITAL_COMPARISON'
    | 'RESOURCE_RESERVATION'
    | 'COLLABORATION_CENTER'
    | 'STATE_ANALYTICS'
  >('NETWORK_COMMAND');

  // Local State Store Feeds
  const [exchanges, setExchanges] = useState<ResourceExchangeItem[]>([]);
  const [transferWorkflows, setTransferWorkflows] = useState<PatientTransferWorkflow[]>([]);
  const [broadcasts, setBroadcasts] = useState<HospitalCollaborationBroadcast[]>([]);
  const [stateReservations, setStateReservations] = useState<StateResourceReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');

  // Resource Exchange Form State
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [reqHospitalId, setReqHospitalId] = useState(hospitals[0]?.id || '');
  const [reqCategory, setReqCategory] = useState<ResourceExchangeItem['resourceCategory']>('Ventilator');
  const [reqDetails, setReqDetails] = useState('');
  const [reqQuantity, setReqQuantity] = useState(2);
  const [reqPriority, setReqPriority] = useState<'RED' | 'ORANGE' | 'YELLOW'>('RED');

  // Transfer Workflow Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [trfPatientName, setTrfPatientName] = useState('');
  const [trfPatientAgeGender, setTrfPatientAgeGender] = useState('45M');
  const [trfSourceHospId, setTrfSourceHospId] = useState(hospitals[0]?.id || '');
  const [trfDestHospId, setTrfDestHospId] = useState(hospitals[1]?.id || '');
  const [trfPriority, setTrfPriority] = useState<'RED' | 'ORANGE' | 'YELLOW'>('RED');
  const [trfReason, setTrfReason] = useState('');

  // Hospital Comparison
  const [compareHospIds, setCompareHospIds] = useState<string[]>(
    hospitals.slice(0, 3).map((h) => h.id)
  );
  const [comparisonMetrics, setComparisonMetrics] = useState<HospitalComparisonMetrics[]>([]);
  const [bestChoiceHospId, setBestChoiceHospId] = useState<string>('');

  // Diversion Engine
  const [selectedDiversionSourceId, setSelectedDiversionSourceId] = useState<string>(hospitals[0]?.id || '');
  const [diversionData, setDiversionData] = useState<HospitalDiversionRecommendation | null>(null);

  // Collaboration Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastType, setBroadcastType] = useState<HospitalCollaborationBroadcast['type']>('ANNOUNCEMENT');
  const [broadcastUrgency, setBroadcastUrgency] = useState<'NORMAL' | 'HIGH' | 'CRITICAL'>('HIGH');

  // Reservation Form State
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [resHospId, setResHospId] = useState(hospitals[0]?.id || '');
  const [resType, setResType] = useState<StateResourceReservation['resourceType']>('ICU Bed');
  const [resDetails, setResDetails] = useState('Cardiac ICU Bed');
  const [resPatientName, setResPatientName] = useState('');
  const [resIncidentCode, setResIncidentCode] = useState('INC-2026-SAMRUDDHI-01');
  const [resError, setResError] = useState<string | null>(null);

  // AI Optimization Generation State
  const [aiRunning, setAiRunning] = useState(false);
  const [aiResults, setAiResults] = useState<{
    recommendation: string;
    confidenceScore: number;
    diversions: string[];
  } | null>(null);

  // Fetch Feeds
  const fetchCoordinationData = async () => {
    setLoading(true);
    try {
      const [resExch, resTrf, resBcast, resRes] = await Promise.all([
        fetch('/api/coordination/resource-exchanges'),
        fetch('/api/coordination/transfer-workflows'),
        fetch('/api/coordination/collaboration-broadcasts'),
        fetch('/api/coordination/state-reservations'),
      ]);

      if (resExch.ok) setExchanges(await resExch.json());
      if (resTrf.ok) setTransferWorkflows(await resTrf.json());
      if (resBcast.ok) setBroadcasts(await resBcast.json());
      if (resRes.ok) setStateReservations(await resRes.json());
    } catch (err) {
      console.error('Failed fetching state coordination data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinationData();
  }, []);

  // Fetch comparison metrics when compareHospIds changes
  const fetchComparison = async () => {
    try {
      const res = await fetch('/api/coordination/hospital-comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospitalIds: compareHospIds }),
      });
      if (res.ok) {
        const data = await res.json();
        setComparisonMetrics(data.metrics || []);
        setBestChoiceHospId(data.bestChoiceHospitalId || '');
      }
    } catch (err) {
      console.error('Failed fetching hospital comparison:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'HOSPITAL_COMPARISON') {
      fetchComparison();
    }
  }, [compareHospIds, activeTab]);

  // Fetch Diversion Recommendation
  const fetchDiversion = async (sourceId: string) => {
    try {
      const res = await fetch('/api/coordination/diversion-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceHospitalId: sourceId }),
      });
      if (res.ok) {
        const data = await res.json();
        setDiversionData(data);
      }
    } catch (err) {
      console.error('Failed checking diversion:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'DIVERSION_ENGINE' && selectedDiversionSourceId) {
      fetchDiversion(selectedDiversionSourceId);
    }
  }, [selectedDiversionSourceId, activeTab]);

  // Handlers
  const handleCreateExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coordination/resource-exchanges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestingHospitalId: reqHospitalId,
          resourceCategory: reqCategory,
          resourceDetails: reqDetails,
          quantity: reqQuantity,
          priority: reqPriority,
          remarks: 'Initiated via State Command Center',
        }),
      });
      if (res.ok) {
        setShowExchangeModal(false);
        setReqDetails('');
        fetchCoordinationData();
        if (onAuditLog) onAuditLog('RESOURCE_UPDATE', `Requested resource exchange: ${reqQuantity} x ${reqCategory}`);
      }
    } catch (err) {
      console.error('Failed creating exchange:', err);
    }
  };

  const handleUpdateExchangeStatus = async (id: string, status: ResourceExchangeItem['status'], fulfillingId?: string) => {
    try {
      const res = await fetch(`/api/coordination/resource-exchanges/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, fulfillingHospitalId: fulfillingId }),
      });
      if (res.ok) fetchCoordinationData();
    } catch (err) {
      console.error('Failed updating exchange status:', err);
    }
  };

  const handleCreateTransferWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coordination/transfer-workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: trfPatientName,
          patientAgeGender: trfPatientAgeGender,
          sourceHospitalId: trfSourceHospId,
          destinationHospitalId: trfDestHospId,
          priority: trfPriority,
          reason: trfReason,
        }),
      });
      if (res.ok) {
        setShowTransferModal(false);
        setTrfPatientName('');
        setTrfReason('');
        fetchCoordinationData();
        if (onAuditLog) onAuditLog('EMERGENCY_ACCEPT', `Initiated Patient Transfer Workflow for ${trfPatientName}`);
      }
    } catch (err) {
      console.error('Failed creating transfer workflow:', err);
    }
  };

  const handleAdvanceTransferStage = async (wfId: string, stageName: string) => {
    try {
      const res = await fetch(`/api/coordination/transfer-workflows/${wfId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageName,
          status: stageName === 'COMPLETED' ? 'COMPLETED' : 'IN_TRANSIT',
          stageDetails: `Stage ${stageName} confirmed by State EOC Dispatcher.`,
        }),
      });
      if (res.ok) fetchCoordinationData();
    } catch (err) {
      console.error('Failed updating transfer stage:', err);
    }
  };

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;
    try {
      const res = await fetch('/api/coordination/collaboration-broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderHospitalId: hospitals[0]?.id || 'hosp-ngp-01',
          type: broadcastType,
          title: broadcastTitle,
          content: broadcastContent,
          urgency: broadcastUrgency,
        }),
      });
      if (res.ok) {
        setBroadcastTitle('');
        setBroadcastContent('');
        fetchCoordinationData();
      }
    } catch (err) {
      console.error('Failed creating broadcast:', err);
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setResError(null);
    try {
      const res = await fetch('/api/coordination/state-reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: resHospId,
          resourceType: resType,
          resourceDetails: resDetails,
          patientName: resPatientName || 'Referral Patient',
          patientOrIncidentCode: resIncidentCode,
          reservedBy: 'State EOC Officer',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResError(data.message || 'Failed to create reservation');
      } else {
        setShowReservationModal(false);
        setResPatientName('');
        fetchCoordinationData();
      }
    } catch (err) {
      setResError('Network error during reservation');
    }
  };

  const handleReservationAction = async (id: string, action: 'RELEASE' | 'CANCEL' | 'TRANSFER') => {
    try {
      const res = await fetch(`/api/coordination/state-reservations/${id}/action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) fetchCoordinationData();
    } catch (err) {
      console.error('Failed updating reservation action:', err);
    }
  };

  const handleRunAiOptimization = async () => {
    setAiRunning(true);
    try {
      const res = await fetch('/api/coordination/ai-optimize', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAiResults(data);
      }
    } catch (err) {
      console.error('AI optimization error:', err);
    } finally {
      setAiRunning(false);
    }
  };

  // Filtered Hospital List
  const filteredHospitals = hospitals.filter((h) => {
    const matchesDist = districtFilter === 'all' || h.districtId === districtFilter;
    const matchesQuery =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.districtName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDist && matchesQuery;
  });

  // Calculate High Level Metrics
  const totalConnected = hospitals.length;
  const totalBeds = hospitals.reduce((sum, h) => sum + h.totalBeds, 0);
  const totalIcuBeds = hospitals.reduce((sum, h) => sum + h.totalIcuBeds, 0);
  const availIcuBeds = hospitals.reduce((sum, h) => sum + h.availableIcuBeds, 0);
  const totalVent = hospitals.reduce((sum, h) => sum + h.totalVentilators, 0);
  const availVent = hospitals.reduce((sum, h) => sum + h.availableVentilators, 0);
  const saturatedCount = hospitals.filter(
    (h) => (h.totalBeds - h.availableGeneralBeds) / h.totalBeds > 0.85
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Banner Header */}
      <div className="bg-white text-stone-900 rounded-2xl p-5 shadow-sm border border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-sky-50 text-sky-600 border border-sky-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Phase 10 Multi-Hospital Coordination Network
              </span>
              <span className="text-xs font-mono font-bold text-sky-600">
                ⚡ Statewide Real-Time Sync Active
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight mt-1 text-stone-900 flex items-center gap-2.5">
              <Building2 className="w-7 h-7 text-sky-500" />
              Statewide Multi-Hospital Resource Operations & Command
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-3xl">
              Eliminating hospital fragmentation across Maharashtra. Continuous resource exchange, statewide AI resource balancing, patient transfer command, and emergency diversion control.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunAiOptimization}
              disabled={aiRunning}
              className="bg-sky-500 hover:bg-sky-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              {aiRunning ? 'Generating Allocation...' : 'Run Statewide AI Resource Balancer'}
            </button>

            <button
              onClick={fetchCoordinationData}
              className="bg-stone-50 hover:bg-stone-100 text-stone-600 p-2.5 rounded-xl border border-stone-200 transition-colors"
              title="Refresh Statewide Feeds"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* High-Level Network KPIs Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-5 pt-4 border-t border-stone-200">
          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Connected Hospitals</span>
            <span className="text-lg font-black text-stone-900">{totalConnected} Facilities</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Total Network Beds</span>
            <span className="text-lg font-black text-sky-400">{totalBeds} Beds</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Available ICU Beds</span>
            <span className="text-lg font-black text-emerald-400">{availIcuBeds} / {totalIcuBeds}</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Available Ventilators</span>
            <span className="text-lg font-black text-indigo-400">{availVent} / {totalVent}</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Saturated Facilities</span>
            <span className="text-lg font-black text-rose-400">{saturatedCount} Overloaded</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Active Transfers</span>
            <span className="text-lg font-black text-amber-400">{transferWorkflows.filter(w => w.status !== 'COMPLETED').length} Cases</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Resource Exchange</span>
            <span className="text-lg font-black text-sky-300">{exchanges.filter(e => e.status === 'PENDING').length} Pending</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">State Reservations</span>
            <span className="text-lg font-black text-emerald-300">{stateReservations.filter(r => r.status === 'ACTIVE').length} Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center space-x-1 border-b border-stone-200 overflow-x-auto bg-cream p-1.5 rounded-xl text-xs font-bold text-stone-600">
        <button
          onClick={() => setActiveTab('NETWORK_COMMAND')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'NETWORK_COMMAND'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Live Hospital Network</span>
          <span className="bg-sky-500 text-stone-900 text-[9px] font-black px-1.5 py-0.2 rounded-full">
            {filteredHospitals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('RESOURCE_BALANCER')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'RESOURCE_BALANCER'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>AI Resource Balancer</span>
        </button>

        <button
          onClick={() => setActiveTab('RESOURCE_EXCHANGE')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'RESOURCE_EXCHANGE'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
          <span>Resource Exchange</span>
          <span className="bg-emerald-500 text-stone-900 text-[9px] font-black px-1.5 py-0.2 rounded-full">
            {exchanges.filter(e => e.status === 'PENDING').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('TRANSFER_COMMAND')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'TRANSFER_COMMAND'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Patient Transfer Command</span>
          <span className="bg-indigo-500 text-stone-900 text-[9px] font-black px-1.5 py-0.2 rounded-full">
            {transferWorkflows.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('DIVERSION_ENGINE')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'DIVERSION_ENGINE'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Emergency Diversion Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('DISTRICT_MATRIX')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'DISTRICT_MATRIX'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>District Coordination</span>
        </button>

        <button
          onClick={() => setActiveTab('HOSPITAL_COMPARISON')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'HOSPITAL_COMPARISON'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span>Hospital Comparison</span>
        </button>

        <button
          onClick={() => setActiveTab('RESOURCE_RESERVATION')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'RESOURCE_RESERVATION'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>State Reservations</span>
        </button>

        <button
          onClick={() => setActiveTab('COLLABORATION_CENTER')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'COLLABORATION_CENTER'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-purple-400" />
          <span>Hospital Collaboration</span>
        </button>

        <button
          onClick={() => setActiveTab('STATE_ANALYTICS')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'STATE_ANALYTICS'
              ? 'bg-white text-stone-900 shadow'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
          <span>State Analytics</span>
        </button>
      </div>

      {/* AI Recommendation Banner if generated */}
      {aiResults && (
        <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 border border-amber-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              Statewide AI Resource Balancer Recommendation (Confidence Score: {aiResults.confidenceScore}%)
            </span>
            <button
              onClick={() => setAiResults(null)}
              className="text-xs text-stone-500 hover:text-stone-900 font-bold"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs font-semibold text-stone-800">{aiResults.recommendation}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {aiResults.diversions.map((div, i) => (
              <span key={i} className="bg-white border border-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                • {div}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 1: LIVE HOSPITAL NETWORK */}
      {activeTab === 'NETWORK_COMMAND' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
              <input
                type="text"
                placeholder="Search hospital by name, district, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Filter className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="text-xs font-bold text-stone-800 bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="all">All Maharashtra Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} District
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hospital Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHospitals.map((hospital) => {
              const occRate = Math.round(
                ((hospital.totalBeds - hospital.availableGeneralBeds) / hospital.totalBeds) * 100
              );
              return (
                <div
                  key={hospital.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {hospital.districtName} • {hospital.type}
                      </span>
                      <h3 className="text-sm font-black text-stone-900 mt-1">{hospital.name}</h3>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-500" /> {hospital.address}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                        hospital.emergencyDeptStatus === 'FULL'
                          ? 'bg-rose-600 text-stone-900 animate-pulse'
                          : hospital.emergencyDeptStatus === 'DIVERTING'
                          ? 'bg-amber-500 text-stone-900'
                          : 'bg-emerald-100 text-emerald-400 border border-emerald-300'
                      }`}
                    >
                      {hospital.emergencyDeptStatus === 'FULL' ? 'ER SATURATED' : hospital.emergencyDeptStatus}
                    </span>
                  </div>

                  {/* Bed & Medical Resource Capacity Stats */}
                  <div className="grid grid-cols-3 gap-2 bg-cream p-2.5 rounded-lg border border-slate-100 text-center">
                    <div>
                      <span className="text-[9px] font-extrabold text-stone-500 uppercase block">Occupancy</span>
                      <span
                        className={`text-xs font-black ${
                          occRate > 85 ? 'text-rose-600' : 'text-stone-900'
                        }`}
                      >
                        {occRate}% ({hospital.totalBeds - hospital.availableGeneralBeds}/{hospital.totalBeds})
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-extrabold text-stone-500 uppercase block">Available ICU</span>
                      <span className="text-xs font-black text-emerald-600">
                        {hospital.availableIcuBeds} / {hospital.totalIcuBeds}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-extrabold text-stone-500 uppercase block">Ventilators</span>
                      <span className="text-xs font-black text-indigo-600">
                        {hospital.availableVentilators} / {hospital.totalVentilators}
                      </span>
                    </div>
                  </div>

                  {/* Staffing & Operational Info */}
                  <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-slate-100 pt-2">
                    <span className="flex items-center gap-1 font-bold">
                      <Users className="w-3.5 h-3.5 text-stone-500" /> {hospital.doctorsOnDuty} Doctors / {hospital.nursesOnDuty} Nurses
                    </span>
                    <span className="font-mono text-stone-500">Sync: {hospital.lastSync}</span>
                  </div>

                  {/* Quick Action Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setReqHospitalId(hospital.id);
                        setShowExchangeModal(true);
                      }}
                      className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-400 border border-sky-200 text-xs font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <ArrowLeftRight className="w-3 h-3 text-sky-600" /> Request Resource
                    </button>

                    <button
                      onClick={() => {
                        setTrfSourceHospId(hospital.id);
                        setShowTransferModal(true);
                      }}
                      className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-400 border border-indigo-200 text-xs font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Truck className="w-3 h-3 text-indigo-600" /> Initiate Transfer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: AI RESOURCE BALANCER */}
      {activeTab === 'RESOURCE_BALANCER' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                Statewide AI Resource Optimization & Redistribution Engine
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Continuously analyzes ICU, ventilator, doctor, and ER queue pressure across 7 major Maharashtra urban hubs.
              </p>
            </div>

            <button
              onClick={handleRunAiOptimization}
              disabled={aiRunning}
              className="bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              {aiRunning ? 'Analyzing statewide capacity...' : 'Execute Live AI Analysis'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Realtime Overload Risk Ranking */}
            <div className="bg-cream rounded-xl p-4 border border-stone-200 space-y-3">
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Hospital Overload Risk Ranking
              </h3>

              <div className="space-y-2">
                {hospitals.map((h, idx) => {
                  const occ = Math.round(((h.totalBeds - h.availableGeneralBeds) / h.totalBeds) * 100);
                  return (
                    <div
                      key={h.id}
                      className="bg-white rounded-lg p-2.5 border border-stone-200 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-white text-stone-900 font-black text-[10px] flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">{h.name}</span>
                          <span className="text-[10px] text-stone-500">{h.districtName} • {h.traumaLevel}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded ${
                            occ > 85 ? 'bg-rose-100 text-rose-400' : 'bg-emerald-100 text-emerald-400'
                          }`}
                        >
                          {occ}% Occupancy
                        </span>
                        <span className="text-[10px] text-stone-500 block mt-0.5">ICU Free: {h.availableIcuBeds}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Optimization Predictions & Suggested Diversions */}
            <div className="bg-cream rounded-xl p-4 border border-stone-200 space-y-3">
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Suggested Statewide Diversion & Redistribution Actions
              </h3>

              <div className="space-y-2.5 text-xs text-stone-800 font-medium">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <span className="font-bold text-amber-900 block">⚡ Vidarbha Zone Action</span>
                  <p className="text-[11px] text-amber-400 mt-0.5">
                    Transfer 3 transport ventilators from AIIMS Nagpur to GMC Nagpur due to sudden surge in respiratory trauma admissions.
                  </p>
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                  <span className="font-bold text-sky-900 block">⚡ Mumbai Metropolitan Action</span>
                  <p className="text-[11px] text-sky-400 mt-0.5">
                    Activate diversion protocol for KEM Hospital ER; route incoming non-trauma ambulances to Lilavati Hospital and Cooper Hospital.
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <span className="font-bold text-indigo-900 block">⚡ Pune Regional Action</span>
                  <p className="text-[11px] text-indigo-400 mt-0.5">
                    Sassoon General Hospital operating theatres at 90% utilization. Standby referral agreement triggered with Jehangir Hospital for neurosurgery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: INTER-HOSPITAL RESOURCE EXCHANGE */}
      {activeTab === 'RESOURCE_EXCHANGE' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
                Inter-Hospital Resource Sharing & Exchange Hub
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Statewide requisition platform for ICU beds, ventilators, blood units, oxygen, doctors, and nurses.
              </p>
            </div>

            <button
              onClick={() => setShowExchangeModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold text-xs px-3.5 py-2 rounded-lg shadow flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Request Resource Exchange
            </button>
          </div>

          {/* Exchanges List Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 font-extrabold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Exchange ID</th>
                  <th className="p-3">Requesting Hospital</th>
                  <th className="p-3">Resource Category & Qty</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Fulfilling Facility</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-200 font-medium text-stone-800">
                {exchanges.map((item) => (
                  <tr key={item.id} className="hover:bg-cream transition-colors">
                    <td className="p-3 font-mono font-bold text-stone-500">{item.id}</td>
                    <td className="p-3">
                      <span className="font-bold block text-stone-900">{item.requestingHospitalName}</span>
                      <span className="text-[10px] text-stone-500">{item.requestingDistrict} District</span>
                    </td>

                    <td className="p-3">
                      <span className="bg-stone-100 text-stone-900 font-black px-2 py-0.5 rounded mr-1">
                        {item.quantity} x {item.resourceCategory}
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">{item.resourceDetails}</span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          item.priority === 'RED'
                            ? 'bg-rose-100 text-rose-400 border border-rose-200'
                            : 'bg-amber-100 text-amber-400 border border-amber-200'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td className="p-3">
                      {item.fulfillingHospitalName ? (
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {item.fulfillingHospitalName}
                        </span>
                      ) : (
                        <span className="text-stone-500 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                          item.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-400 border border-amber-200 animate-pulse'
                            : item.status === 'ACCEPTED'
                            ? 'bg-sky-100 text-sky-400 border border-sky-300'
                            : item.status === 'IN_TRANSIT'
                            ? 'bg-indigo-100 text-indigo-400 border border-indigo-300'
                            : 'bg-emerald-100 text-emerald-400 border border-emerald-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {item.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateExchangeStatus(item.id, 'ACCEPTED', hospitals[1]?.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold text-[10px] px-2.5 py-1 rounded shadow"
                        >
                          Fulfill Request
                        </button>
                      )}

                      {item.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleUpdateExchangeStatus(item.id, 'IN_TRANSIT')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-stone-900 font-bold text-[10px] px-2.5 py-1 rounded shadow"
                        >
                          Dispatch Transit
                        </button>
                      )}

                      {item.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleUpdateExchangeStatus(item.id, 'COMPLETED')}
                          className="bg-white hover:bg-stone-100 text-stone-900 font-bold text-[10px] px-2.5 py-1 rounded shadow"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {item.status === 'COMPLETED' && (
                        <span className="text-[10px] text-stone-500 font-bold">Fulfilled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: PATIENT TRANSFER COMMAND */}
      {activeTab === 'TRANSFER_COMMAND' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                Inter-Hospital Patient Transfer Workflow Command
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                End-to-end multi-stage transfer tracking: Request → Review → AI Match → Bed Reserved → Ambulance Dispatched → Corridor Approved → In Transit → Arrived.
              </p>
            </div>

            <button
              onClick={() => setShowTransferModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-stone-900 font-bold text-xs px-3.5 py-2 rounded-lg shadow flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Initiate Patient Transfer
            </button>
          </div>

          {/* Workflows List */}
          <div className="space-y-4">
            {transferWorkflows.map((wf) => (
              <div
                key={wf.id}
                className="bg-cream rounded-xl border border-stone-200 p-4 space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono font-black text-xs text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
                      {wf.transferCode}
                    </span>
                    <h3 className="text-sm font-black text-stone-900">
                      {wf.patientName} ({wf.patientAgeGender || '45M'})
                    </h3>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        wf.priority === 'RED'
                          ? 'bg-rose-100 text-rose-400 border border-rose-200'
                          : 'bg-amber-100 text-amber-400'
                      }`}
                    >
                      Priority {wf.priority}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-stone-600">
                    <span>{wf.sourceHospitalName}</span>
                    <ChevronRight className="w-4 h-4 text-stone-500" />
                    <span className="text-indigo-900 font-extrabold">{wf.destinationHospitalName}</span>
                  </div>
                </div>

                {/* Clinical Reason & AI Justification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] uppercase font-extrabold text-stone-500 block">Transfer Reason</span>
                    <p className="text-stone-800 font-medium">{wf.reason}</p>
                  </div>

                  <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-200">
                    <span className="text-[10px] uppercase font-extrabold text-sky-400 block">AI Specialty Recommendation</span>
                    <p className="text-sky-900 font-medium text-[11px]">{wf.aiRecommendationDetails}</p>
                  </div>
                </div>

                {/* Multi-Stage Timeline Bar */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-extrabold text-stone-500 block mb-2">Workflow Stage Tracker</span>
                  <div className="flex items-center space-x-1 overflow-x-auto pb-1">
                    {wf.timeline.map((stage, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 min-w-[110px] p-2 rounded-lg border text-center transition-all ${
                          stage.completed
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-white border-stone-200 text-stone-500'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          {stage.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-stone-600" />
                          )}
                          <span className="text-[10px] font-black uppercase">{stage.stage}</span>
                        </div>
                        <span className="text-[9px] font-bold block truncate">{stage.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stage Advancement Control Button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleAdvanceTransferStage(wf.id, 'IN_TRANSIT')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-stone-900 font-bold text-xs px-3 py-1.5 rounded-lg shadow flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" /> Advance Stage & Dispatch Corridor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: EMERGENCY DIVERSION ENGINE */}
      {activeTab === 'DIVERSION_ENGINE' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Automated Emergency Diversion Control Engine
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Calculates alternate tertiary care destinations when Hospital A reaches critical capacity (&gt;85% occupancy).
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-stone-600">Select Overloaded Hospital:</span>
              <select
                value={selectedDiversionSourceId}
                onChange={(e) => setSelectedDiversionSourceId(e.target.value)}
                className="text-xs font-bold text-stone-900 bg-stone-100 border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.districtName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {diversionData && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  diversionData.diversionActive
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="font-black text-sm uppercase">
                      {diversionData.sourceHospitalName} Occupancy Status: {diversionData.occupancyRatePercent}%
                    </span>
                  </div>

                  <span className="font-extrabold text-xs px-2.5 py-1 rounded bg-white shadow-sm">
                    {diversionData.diversionActive ? 'AUTO-DIVERSION ACTIVE' : 'NORMAL CAPACITY'}
                  </span>
                </div>
                <p className="text-xs mt-1 font-medium">{diversionData.diversionReason}</p>
              </div>

              <h3 className="text-xs font-black uppercase text-stone-800 tracking-wider">
                Recommended Alternate Destination Hospitals (Hospital B & C)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {diversionData.recommendedDiversions.map((opt, idx) => (
                  <div
                    key={opt.hospitalId}
                    className="bg-cream rounded-xl border border-stone-200 p-3.5 space-y-2 relative"
                  >
                    <span className="bg-sky-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase absolute top-3 right-3">
                      Rank #{idx + 1} • AI Score {opt.aiScore}/100
                    </span>

                    <h4 className="text-xs font-black text-stone-900 pr-20">{opt.hospitalName}</h4>
                    <p className="text-[11px] text-stone-500 font-bold">{opt.districtName} • {opt.traumaLevel}</p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded border border-stone-200">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-stone-500 block">Available ICU</span>
                        <span className="font-extrabold text-emerald-400">{opt.availableIcu} Beds</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-stone-500 block">Transit Time</span>
                        <span className="font-extrabold text-indigo-400">{opt.travelTimeMin} mins ({opt.distanceKm} km)</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-stone-500 bg-sky-50 p-2 rounded border border-sky-100 font-medium">
                      💡 {opt.divertReason}
                    </p>

                    <button
                      onClick={() => alert(`Diversion corridor activated to ${opt.hospitalName}`)}
                      className="w-full bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Route Ambulances Here
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 6: DISTRICT COORDINATION MATRIX */}
      {activeTab === 'DISTRICT_MATRIX' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Statewide District Health Coordination Matrix
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Comparative load analysis across Nagpur, Pune, Mumbai, Nashik, Wardha, Amravati, and Chandrapur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districts.map((d) => {
              const distHospitals = hospitals.filter((h) => h.districtId === d.id);
              const distIncidents = incidents.filter((i) => i.districtName === d.name);
              const availIcu = distHospitals.reduce((acc, h) => acc + h.availableIcuBeds, 0);

              return (
                <div
                  key={d.id}
                  className="bg-cream rounded-xl border border-stone-200 p-4 space-y-3 hover:border-stone-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-stone-900">{d.name} District</h3>
                      <span className="text-[10px] font-bold text-stone-500">{distHospitals.length} Connected Hospitals</span>
                    </div>

                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                        d.riskLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-400 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-400'
                      }`}
                    >
                      Risk Score {d.riskScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-stone-200 text-center text-xs">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-stone-500 block">Emergencies</span>
                      <span className="font-black text-rose-600">{distIncidents.length} Active</span>
                    </div>

                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-stone-500 block">ICU Available</span>
                      <span className="font-black text-emerald-600">{availIcu} Beds</span>
                    </div>

                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-stone-500 block">Ambulances</span>
                      <span className="font-black text-sky-600">{d.activeAmbulances} Units</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectDistrict(d.id)}
                    className="w-full bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    View {d.name} Detailed Command <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 7: HOSPITAL COMPARISON TOOL */}
      {activeTab === 'HOSPITAL_COMPARISON' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-600" />
                Statewide Side-by-Side Hospital Comparison Engine
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Compare ICU beds, ventilators, doctors, nurses, ER queue, trauma level, and AI coordination scores.
              </p>
            </div>
          </div>

          {/* Selector checkboxes */}
          <div className="flex flex-wrap items-center gap-2 bg-cream p-3 rounded-xl border border-stone-200">
            <span className="text-xs font-bold text-stone-600 mr-2">Select Hospitals to Compare:</span>
            {hospitals.map((h) => {
              const isChecked = compareHospIds.includes(h.id);
              return (
                <button
                  key={h.id}
                  onClick={() => {
                    if (isChecked) {
                      if (compareHospIds.length > 1) {
                        setCompareHospIds(compareHospIds.filter((id) => id !== h.id));
                      }
                    } else {
                      if (compareHospIds.length < 4) {
                        setCompareHospIds([...compareHospIds, h.id]);
                      }
                    }
                  }}
                  className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                    isChecked
                      ? 'bg-white text-stone-900 border-stone-200 shadow-sm'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {isChecked ? '✓ ' : '+ '} {h.name}
                </button>
              );
            })}
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 font-extrabold border-b border-stone-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3 w-48">Metric / Parameter</th>
                  {comparisonMetrics.map((m) => (
                    <th key={m.hospitalId} className="p-3 text-center border-l border-stone-200">
                      <span className="font-black text-stone-900 block text-xs">{m.name}</span>
                      <span className="text-[10px] text-stone-500">{m.district} • {m.traumaLevel}</span>
                      {m.isBestChoice && (
                        <span className="bg-emerald-500 text-stone-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase block mt-1">
                          ★ RECOMMENDED BEST CHOICE
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-200 font-medium text-stone-800">
                <tr>
                  <td className="p-3 font-bold text-stone-600 bg-cream">AI Coordination Score</td>
                  {comparisonMetrics.map((m) => (
                    <td key={m.hospitalId} className="p-3 text-center font-black text-sm text-indigo-900 border-l border-stone-200">
                      {m.aiCoordinationScore} / 100
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-stone-600 bg-cream">Occupancy Rate</td>
                  {comparisonMetrics.map((m) => (
                    <td key={m.hospitalId} className="p-3 text-center font-extrabold border-l border-stone-200">
                      <span className={m.occupancyPercent > 85 ? 'text-rose-600' : 'text-emerald-600'}>
                        {m.occupancyPercent}%
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-stone-600 bg-cream">Available ICU Beds</td>
                  {comparisonMetrics.map((m) => (
                    <td key={m.hospitalId} className="p-3 text-center font-black text-emerald-400 border-l border-stone-200">
                      {m.availableIcuBeds} Beds
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-stone-600 bg-cream">Available Ventilators</td>
                  {comparisonMetrics.map((m) => (
                    <td key={m.hospitalId} className="p-3 text-center font-black text-indigo-400 border-l border-stone-200">
                      {m.availableVentilators} Units
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-stone-600 bg-cream">Doctors & Nurses Duty Staff</td>
                  {comparisonMetrics.map((m) => (
                    <td key={m.hospitalId} className="p-3 text-center font-bold text-stone-800 border-l border-stone-200">
                      {m.doctorsOnDuty} Doctors / {m.nursesOnDuty} Nurses
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-stone-600 bg-cream">Emergency Queue Count</td>
                  {comparisonMetrics.map((m) => (
                    <td key={m.hospitalId} className="p-3 text-center font-bold text-stone-800 border-l border-stone-200">
                      {m.emergencyQueueCount} Incoming Patients
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 8: RESOURCE RESERVATION ENGINE */}
      {activeTab === 'RESOURCE_RESERVATION' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                Statewide Resource Reservation Engine
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Pre-reserve ICU beds, ventilators, operation theatres, doctors, and response teams with double-booking protection.
              </p>
            </div>

            <button
              onClick={() => setShowReservationModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold text-xs px-3.5 py-2 rounded-lg shadow flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Reserve Resource
            </button>
          </div>

          {/* Reservation List Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 font-extrabold border-b border-stone-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Reservation Code</th>
                  <th className="p-3">Hospital Name</th>
                  <th className="p-3">Reserved Resource</th>
                  <th className="p-3">Patient / Incident</th>
                  <th className="p-3">Reserved By</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-200 font-medium text-stone-800">
                {stateReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-cream transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-900">{res.reservationCode}</td>
                    <td className="p-3 font-black text-stone-900">{res.hospitalName}</td>
                    <td className="p-3">
                      <span className="font-bold text-stone-900 block">{res.resourceType}</span>
                      <span className="text-[10px] text-stone-500">{res.resourceDetails}</span>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-stone-900 block">{res.patientName}</span>
                      <span className="text-[10px] text-stone-500 font-mono">{res.patientOrIncidentCode}</span>
                    </td>

                    <td className="p-3 text-stone-500">{res.reservedBy}</td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                          res.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-400 border border-emerald-300'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {res.status === 'ACTIVE' && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleReservationAction(res.id, 'RELEASE')}
                            className="bg-white hover:bg-stone-100 text-stone-900 font-bold text-[10px] px-2 py-1 rounded"
                          >
                            Release
                          </button>
                          <button
                            onClick={() => handleReservationAction(res.id, 'CANCEL')}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-400 font-bold text-[10px] px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 9: HOSPITAL COLLABORATION CENTER */}
      {activeTab === 'COLLABORATION_CENTER' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-600" />
              Statewide Inter-Hospital Collaboration & Broadcast Network
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Secure broadcast communication channel for emergency notifications, blood bank requests, and disaster referrals.
            </p>
          </div>

          {/* New Broadcast Form */}
          <form onSubmit={handleCreateBroadcast} className="bg-cream p-4 rounded-xl border border-stone-200 space-y-3">
            <h3 className="text-xs font-black uppercase text-stone-800">Publish Broadcast Announcement</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Broadcast Title..."
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="text-xs font-bold p-2 border border-stone-200 rounded-lg focus:outline-none"
                required
              />

              <select
                value={broadcastType}
                onChange={(e) => setBroadcastType(e.target.value as any)}
                className="text-xs font-bold p-2 border border-stone-200 rounded-lg focus:outline-none"
              >
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="CRITICAL_ALERT">Critical Alert</option>
                <option value="RESOURCE_REQUEST">Resource Request</option>
                <option value="TRANSFER_REQUEST">Transfer Request</option>
              </select>

              <select
                value={broadcastUrgency}
                onChange={(e) => setBroadcastUrgency(e.target.value as any)}
                className="text-xs font-bold p-2 border border-stone-200 rounded-lg focus:outline-none"
              >
                <option value="NORMAL">Normal Urgency</option>
                <option value="HIGH">High Urgency</option>
                <option value="CRITICAL">Critical Emergency</option>
              </select>
            </div>

            <textarea
              placeholder="Broadcast Message Content..."
              value={broadcastContent}
              onChange={(e) => setBroadcastContent(e.target.value)}
              className="w-full text-xs font-medium p-2 border border-stone-200 rounded-lg focus:outline-none h-20"
              required
            />

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-stone-900 font-bold text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Broadcast to All Hospitals
            </button>
          </form>

          {/* Broadcasts Feed */}
          <div className="space-y-3">
            {broadcasts.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-xl border ${
                  b.urgency === 'CRITICAL'
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-cream border-stone-200'
                } space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-stone-900 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-purple-600" /> {b.title}
                  </span>

                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase bg-white border shadow-sm">
                    {b.type} • {b.senderHospitalName}
                  </span>
                </div>

                <p className="text-xs text-stone-800 font-medium">{b.content}</p>

                <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-200/60">
                  <span>District: {b.senderDistrict}</span>
                  <span>Read Receipts: {b.readReceipts.length} Facilities Acknowledged</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 10: STATE RESOURCE ANALYTICS */}
      {activeTab === 'STATE_ANALYTICS' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Statewide Multi-Hospital Resource Analytics
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Operational analytics, transfer success rate, ICU utilization trends, and AI recommendation accuracy metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <span className="text-[10px] font-extrabold text-teal-400 uppercase block">Transfer Success Rate</span>
              <span className="text-2xl font-black text-teal-900 mt-1 block">98.4%</span>
              <span className="text-[10px] text-teal-400 mt-0.5 block">Avg Transit Time: 14 mins</span>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <span className="text-[10px] font-extrabold text-sky-400 uppercase block">AI Balancer Accuracy</span>
              <span className="text-2xl font-black text-sky-900 mt-1 block">96.2%</span>
              <span className="text-[10px] text-sky-400 mt-0.5 block">Zero double booking errors</span>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase block">Avg ICU Wait Time</span>
              <span className="text-2xl font-black text-indigo-900 mt-1 block">4.2 Mins</span>
              <span className="text-[10px] text-indigo-400 mt-0.5 block">Pre-allocation active</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase block">Resource Exchanges</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">142 Requests</span>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">Inter-hospital sharing</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: REQUEST RESOURCE EXCHANGE */}
      {showExchangeModal && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-lg shadow-stone-300/50 border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-emerald-600" /> Request Inter-Hospital Resource
              </h3>
              <button
                onClick={() => setShowExchangeModal(false)}
                className="text-stone-500 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExchange} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-600 block mb-1">Requesting Hospital</label>
                <select
                  value={reqHospitalId}
                  onChange={(e) => setReqHospitalId(e.target.value)}
                  className="w-full p-2 border rounded-lg font-bold"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.districtName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as any)}
                    className="w-full p-2 border rounded-lg font-bold"
                  >
                    <option value="ICU Bed">ICU Bed</option>
                    <option value="Ventilator">Ventilator</option>
                    <option value="Blood">Blood Units</option>
                    <option value="Oxygen">Oxygen Supply</option>
                    <option value="Equipment">Medical Equipment</option>
                    <option value="Doctor">Doctor Specialist</option>
                    <option value="Nurse">Nursing Staff</option>
                    <option value="Ambulance">Ambulance Vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={reqQuantity}
                    onChange={(e) => setReqQuantity(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-600 block mb-1">Resource Details & Requirements</label>
                <textarea
                  placeholder="E.g. High-Flow Transport Ventilators compatible with pediatric care..."
                  value={reqDetails}
                  onChange={(e) => setReqDetails(e.target.value)}
                  className="w-full p-2 border rounded-lg h-20 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExchangeModal(false)}
                  className="px-4 py-2 rounded-lg bg-stone-100 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-stone-900 font-bold shadow"
                >
                  Broadcast Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PATIENT TRANSFER WORKFLOW */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-lg shadow-stone-300/50 border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" /> Initiate Patient Transfer Command
              </h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-stone-500 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransferWorkflow} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    placeholder="Patient Name..."
                    value={trfPatientName}
                    onChange={(e) => setTrfPatientName(e.target.value)}
                    className="w-full p-2 border rounded-lg font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Age / Gender</label>
                  <input
                    type="text"
                    value={trfPatientAgeGender}
                    onChange={(e) => setTrfPatientAgeGender(e.target.value)}
                    className="w-full p-2 border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">Source Hospital</label>
                  <select
                    value={trfSourceHospId}
                    onChange={(e) => setTrfSourceHospId(e.target.value)}
                    className="w-full p-2 border rounded-lg font-bold"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Destination Hospital</label>
                  <select
                    value={trfDestHospId}
                    onChange={(e) => setTrfDestHospId(e.target.value)}
                    className="w-full p-2 border rounded-lg font-bold"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-600 block mb-1">Clinical Transfer Justification</label>
                <textarea
                  placeholder="Multi-organ trauma requiring tertiary ECMO support..."
                  value={trfReason}
                  onChange={(e) => setTrfReason(e.target.value)}
                  className="w-full p-2 border rounded-lg h-20 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-lg bg-stone-100 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-stone-900 font-bold shadow"
                >
                  Start Transfer Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: STATE RESOURCE RESERVATION */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-lg shadow-stone-300/50 border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" /> State Resource Reservation (Anti Double-Booking)
              </h3>
              <button
                onClick={() => setShowReservationModal(false)}
                className="text-stone-500 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            {resError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-900 text-xs p-3 rounded-lg font-bold">
                {resError}
              </div>
            )}

            <form onSubmit={handleCreateReservation} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-600 block mb-1">Target Hospital</label>
                <select
                  value={resHospId}
                  onChange={(e) => setResHospId(e.target.value)}
                  className="w-full p-2 border rounded-lg font-bold"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">Resource Type</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as any)}
                    className="w-full p-2 border rounded-lg font-bold"
                  >
                    <option value="ICU Bed">ICU Bed</option>
                    <option value="Ventilator">Ventilator</option>
                    <option value="Operation Theatre">Operation Theatre</option>
                    <option value="Doctor">Doctor Specialist</option>
                    <option value="Emergency Team">Emergency Team</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    placeholder="Patient Name..."
                    value={resPatientName}
                    onChange={(e) => setResPatientName(e.target.value)}
                    className="w-full p-2 border rounded-lg font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-600 block mb-1">Resource Details</label>
                <input
                  type="text"
                  value={resDetails}
                  onChange={(e) => setResDetails(e.target.value)}
                  className="w-full p-2 border rounded-lg font-bold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="px-4 py-2 rounded-lg bg-stone-100 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-stone-900 font-bold shadow"
                >
                  Lock Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
