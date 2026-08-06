import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  Activity,
  HeartPulse,
  AlertTriangle,
  Building2,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingUp,
  BarChart3,
  Users,
  Play,
  FileText,
  Check,
  X,
  RefreshCw,
  Clock,
  HelpCircle,
  Flame,
  Truck,
  Layers,
  Award,
  Stethoscope,
  Sliders,
  Compass,
  ShieldCheck,
} from 'lucide-react';
import {
  PatientDeteriorationPrediction,
  AiResourceOptimizationPrediction,
  DistrictRiskIntelligence,
  DiseaseClusterAlert,
  AiCommandRecommendation,
  SimulationResult,
  SimulationScenarioType,
  Hospital,
  District,
  HospitalResourceForecast,
  AmbulanceDemandForecast,
  EmergencyForecastItem,
  PredictiveAnalyticsData,
  DoctorAiWorkspacePatient,
} from '../types';

import { DoctorAiWorkspaceView } from './intelligence/DoctorAiWorkspaceView';
import { HospitalForecastingView } from './intelligence/HospitalForecastingView';
import { AmbulanceDemandView } from './intelligence/AmbulanceDemandView';
import { DistrictRiskView } from './intelligence/DistrictRiskView';
import { DiseaseClustersView } from './intelligence/DiseaseClustersView';
import { ResourceBalancerView } from './intelligence/ResourceBalancerView';
import { PredictiveAnalyticsView } from './intelligence/PredictiveAnalyticsView';

interface AiIntelligenceProps {
  hospitals?: Hospital[];
  districts?: District[];
}

export const AiIntelligenceView: React.FC<AiIntelligenceProps> = ({
  hospitals = [],
  districts = [],
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    | 'overview'
    | 'patient-deterioration'
    | 'hospital-forecasting'
    | 'ambulance-demand'
    | 'district-risk'
    | 'disease-clusters'
    | 'resource-balancer'
    | 'doctor-workspace'
    | 'predictive-analytics'
    | 'simulation'
  >('overview');

  // State Stores
  const [patients, setPatients] = useState<PatientDeteriorationPrediction[]>([]);
  const [districtRisks, setDistrictRisks] = useState<DistrictRiskIntelligence[]>([]);
  const [clusters, setClusters] = useState<DiseaseClusterAlert[]>([]);
  const [recommendations, setRecommendations] = useState<AiCommandRecommendation[]>([]);
  const [hospitalForecasts, setHospitalForecasts] = useState<HospitalResourceForecast[]>([]);
  const [ambulanceForecasts, setAmbulanceForecasts] = useState<AmbulanceDemandForecast[]>([]);
  const [emergencyForecasts, setEmergencyForecasts] = useState<EmergencyForecastItem[]>([]);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalyticsData | null>(null);
  const [doctorPatients, setDoctorPatients] = useState<DoctorAiWorkspacePatient[]>([]);

  const [loading, setLoading] = useState(false);
  const [officerName, setOfficerName] = useState('Dr. Rajesh Patil, IAS');

  // Interactive Patient Deterioration Simulator Inputs
  const [newPatientName, setNewPatientName] = useState('Anil Sharma (54M)');
  const [newAge, setNewAge] = useState(54);
  const [newGender, setNewGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [newHr, setNewHr] = useState(132);
  const [newBpSys, setNewBpSys] = useState(88);
  const [newBpDia, setNewBpDia] = useState(58);
  const [newRr, setNewRr] = useState(28);
  const [newTemp, setNewTemp] = useState(38.2);
  const [newSpo2, setNewSpo2] = useState(86);
  const [newHistory, setNewHistory] = useState('Ischemic Heart Disease, Type-2 Diabetes');
  const [newTreatment, setNewTreatment] = useState('Non-rebreather oxygen mask, IV saline fluid resuscitation');

  // Override Modal
  const [selectedPatientForOverride, setSelectedPatientForOverride] = useState<PatientDeteriorationPrediction | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  // Simulation Controls
  const [simScenario, setSimScenario] = useState<SimulationScenarioType>('MASS_CASUALTY');
  const [simDistrict, setSimDistrict] = useState('Nagpur');
  const [simIntensity, setSimIntensity] = useState<'MODERATE' | 'SEVERE' | 'CATASTROPHIC'>('SEVERE');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [runningSim, setRunningSim] = useState(false);

  // Fetch initial AI state
  const fetchAiState = async () => {
    setLoading(true);
    try {
      const [
        resPat,
        resDist,
        resCls,
        resRec,
        resHospFc,
        resAmbFc,
        resEmgFc,
        resAnalytics,
        resDocPat,
      ] = await Promise.all([
        fetch('/api/ai/patient-deterioration'),
        fetch('/api/ai/district-risk'),
        fetch('/api/ai/disease-clusters'),
        fetch('/api/ai/command-recommendations'),
        fetch('/api/intelligence/hospital-forecasts'),
        fetch('/api/intelligence/ambulance-forecasts'),
        fetch('/api/intelligence/emergency-forecasts'),
        fetch('/api/intelligence/predictive-analytics'),
        fetch('/api/intelligence/doctor-patients'),
      ]);

      if (resPat.ok && resPat.headers.get('content-type')?.includes('application/json')) setPatients(await resPat.json());
      if (resDist.ok && resDist.headers.get('content-type')?.includes('application/json')) setDistrictRisks(await resDist.json());
      if (resCls.ok && resCls.headers.get('content-type')?.includes('application/json')) setClusters(await resCls.json());
      if (resRec.ok && resRec.headers.get('content-type')?.includes('application/json')) setRecommendations(await resRec.json());
      if (resHospFc.ok && resHospFc.headers.get('content-type')?.includes('application/json')) setHospitalForecasts(await resHospFc.json());
      if (resAmbFc.ok && resAmbFc.headers.get('content-type')?.includes('application/json')) setAmbulanceForecasts(await resAmbFc.json());
      if (resEmgFc.ok && resEmgFc.headers.get('content-type')?.includes('application/json')) setEmergencyForecasts(await resEmgFc.json());
      if (resAnalytics.ok && resAnalytics.headers.get('content-type')?.includes('application/json')) setPredictiveAnalytics(await resAnalytics.json());
      if (resDocPat.ok && resDocPat.headers.get('content-type')?.includes('application/json')) setDoctorPatients(await resDocPat.json());
    } catch (err) {
      console.error('Error fetching National AI decision intelligence state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiState();
  }, []);

  // Handle Analyzing New Patient Vitals
  const handleAnalyzeVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ai/patient-deterioration/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: newPatientName,
          age: newAge,
          gender: newGender,
          vitals: {
            heartRate: newHr,
            bpSystolic: newBpSys,
            bpDiastolic: newBpDia,
            respiratoryRate: newRr,
            temperatureC: newTemp,
            spo2: newSpo2,
          },
          medicalHistory: newHistory.split(',').map((s) => s.trim()),
          currentTreatment: newTreatment,
        }),
      });

      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.store) setPatients(data.store);
      }
    } catch (err) {
      console.error('Failed to run vitals analysis:', err);
    }
  };

  // Handle Patient Ack / Override
  const handlePatientAckOrOverride = async (patientId: string, override: boolean = false) => {
    try {
      const res = await fetch(`/api/ai/patient-deterioration/${patientId}/ack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerName,
          override,
          overrideReason: override ? overrideReason : undefined,
        }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.store) setPatients(data.store);
        setSelectedPatientForOverride(null);
        setOverrideReason('');
      }
    } catch (err) {
      console.error('Error acknowledging patient deterioration:', err);
    }
  };

  // Handle Command Recommendation Action
  const handleRecommendationAction = async (recId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch(`/api/ai/command-recommendations/${recId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, officerName }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.recommendations) setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('Error updating recommendation action:', err);
    }
  };

  // Handle Doctor Patient Action
  const handleDoctorAction = async (patientId: string, action: 'APPROVED' | 'REJECTED' | 'MODIFIED', notes?: string) => {
    try {
      const res = await fetch(`/api/intelligence/doctor-patients/${patientId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes, doctorName: officerName }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.queue) setDoctorPatients(data.queue);
      }
    } catch (err) {
      console.error('Error updating doctor patient action:', err);
    }
  };

  // Handle Running Emergency Simulation
  const handleRunSimulation = async () => {
    setRunningSim(true);
    try {
      const res = await fetch('/api/ai/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: simScenario,
          district: simDistrict,
          intensity: simIntensity,
        }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.result) setSimResult(data.result);
        if (data.recommendations) setRecommendations(data.recommendations);
        // Refresh district risks
        const resDist = await fetch('/api/ai/district-risk');
        if (resDist.ok && resDist.headers.get('content-type')?.includes('application/json')) {
          setDistrictRisks(await resDist.json());
        }
      }
    } catch (err) {
      console.error('Error running simulation:', err);
    } finally {
      setRunningSim(false);
    }
  };

  // Color helper for risk levels
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-purple-950 text-purple-200 border-purple-600 animate-pulse';
      case 'RED':
        return 'bg-rose-900 text-rose-100 border-rose-500';
      case 'ORANGE':
        return 'bg-amber-900 text-amber-200 border-amber-500';
      case 'YELLOW':
        return 'bg-yellow-900 text-yellow-200 border-yellow-500';
      case 'GREEN':
      default:
        return 'bg-emerald-900 text-emerald-200 border-emerald-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* State AI Intelligence Header Banner */}
      <div className="bg-slate-950 text-white rounded-lg p-4 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-6 h-6 text-purple-400 animate-pulse" />
            <h2 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
              National AI Decision Intelligence Engine
              <span className="text-[10px] font-mono bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded border border-purple-600">
                MODEL: GEMINI-3.6-FLASH
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Statewide emergency brain continuously monitoring multi-hospital resources, patient deterioration, district risk levels, disease clusters & fleet dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">AI Engine Status</span>
              <span className="font-extrabold text-emerald-400">ONLINE (115ms)</span>
            </div>
          </div>

          <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Prediction Accuracy</span>
              <span className="font-extrabold text-purple-300">
                {predictiveAnalytics?.overallPredictionAccuracy || 96.4}%
              </span>
            </div>
          </div>

          <button
            onClick={fetchAiState}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            title="Refresh AI Datasets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary Module Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'overview'
              ? 'bg-purple-700 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>AI Command Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('patient-deterioration')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'patient-deterioration'
              ? 'bg-rose-700 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Patient Deterioration Engine</span>
          {patients.filter((p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'RED').length > 0 && (
            <span className="bg-white text-rose-800 font-black px-1.5 py-0.2 rounded-full text-[10px]">
              {patients.filter((p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'RED').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('hospital-forecasting')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'hospital-forecasting'
              ? 'bg-sky-700 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hospital & Resource Forecasting</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ambulance-demand')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'ambulance-demand'
              ? 'bg-indigo-700 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Ambulance Demand & Redistribution</span>
        </button>

        <button
          onClick={() => setActiveSubTab('district-risk')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'district-risk'
              ? 'bg-rose-800 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>District Risk Intelligence</span>
        </button>

        <button
          onClick={() => setActiveSubTab('disease-clusters')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'disease-clusters'
              ? 'bg-amber-600 text-slate-950 font-black shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Disease Clusters & GIS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('resource-balancer')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'resource-balancer'
              ? 'bg-purple-800 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>AI Command & Resource Balancer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('doctor-workspace')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'doctor-workspace'
              ? 'bg-emerald-700 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctor AI Workspace</span>
        </button>

        <button
          onClick={() => setActiveSubTab('predictive-analytics')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'predictive-analytics'
              ? 'bg-slate-800 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Predictive Analytics</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulation')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
            activeSubTab === 'simulation'
              ? 'bg-indigo-900 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Emergency Simulation</span>
        </button>
      </div>

      {/* SUB-TAB 1: STATE AI COMMAND CENTER OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          {/* Key Executive AI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-purple-950 text-purple-100 p-3 rounded-lg border border-purple-800 shadow-sm">
              <span className="text-[10px] text-purple-300 uppercase font-mono block">Critical Deteriorations</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-rose-400">
                  {patients.filter((p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'RED').length}
                </span>
                <HeartPulse className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-purple-300 mt-1 block">Immediate Intervention Required</span>
            </div>

            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg border border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Hospital Shortage Alerts</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-amber-400">{hospitalForecasts.filter((h) => h.predictedShortages.icuExhaustion).length}</span>
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">30–120 Min ICU Exhaustion</span>
            </div>

            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg border border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Critical Risk Districts</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-rose-300">
                  {districtRisks.filter((d) => d.riskLevel === 'CRITICAL' || d.riskLevel === 'HIGH').length}
                </span>
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Nagpur & Mumbai Top Ranked</span>
            </div>

            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg border border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Disease Clusters</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-amber-300">{clusters.length}</span>
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Spatial Epicenters Active</span>
            </div>

            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg border border-slate-800 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Pending AI Commands</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-purple-400">
                  {recommendations.filter((r) => !r.approved && !r.rejected).length}
                </span>
                <BrainCircuit className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Awaiting EOC Approval</span>
            </div>
          </div>

          {/* Pending AI Command Recommendations */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center justify-between border-b pb-2">
              <span className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                Pending AI Operational Command Recommendations
              </span>
              <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                HUMAN-IN-THE-LOOP REQUIRED
              </span>
            </h3>

            <ResourceBalancerView recommendations={recommendations} onAction={handleRecommendationAction} />
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PATIENT DETERIORATION ENGINE */}
      {activeSubTab === 'patient-deterioration' && (
        <div className="space-y-4">
          {/* Interactive Patient Deterioration Simulator Input Form */}
          <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-md space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-400" />
                Ingest Patient Vitals Telemetry for AI Deterioration Risk Prediction
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">REAL GEMINI 3.6 FLASH ANALYSIS</span>
            </h3>

            <form onSubmit={handleAnalyzeVitals} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Age & Gender</label>
                  <div className="flex space-x-1">
                    <input
                      type="number"
                      value={newAge}
                      onChange={(e) => setNewAge(Number(e.target.value))}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                      required
                    />
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={newHr}
                    onChange={(e) => setNewHr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">BP Systolic/Diastolic</label>
                  <div className="flex space-x-1">
                    <input
                      type="number"
                      value={newBpSys}
                      onChange={(e) => setNewBpSys(Number(e.target.value))}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                      required
                    />
                    <input
                      type="number"
                      value={newBpDia}
                      onChange={(e) => setNewBpDia(Number(e.target.value))}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={newSpo2}
                    onChange={(e) => setNewSpo2(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Respiratory Rate (/min)</label>
                  <input
                    type="number"
                    value={newRr}
                    onChange={(e) => setNewRr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTemp}
                    onChange={(e) => setNewTemp(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-black text-xs rounded shadow flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run Gemini AI Patient Deterioration Risk Prediction</span>
                </button>
              </div>
            </form>
          </div>

          {/* High Risk Deteriorating Patients Feed */}
          <div className="space-y-3">
            {patients.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between border-b pb-2 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{p.patientName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getRiskBadge(p.riskLevel)}`}>
                        {p.riskLevel} RISK ({p.riskScore}/100)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Facility: <strong>{p.hospitalName}</strong> • Age: <strong>{p.age}</strong> ({p.gender})
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-800 text-right">
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Predicted Deterioration</span>
                      <span className="text-xs font-black text-rose-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        {p.predictedDeteriorationTimeMin} MINUTES
                      </span>
                    </div>

                    {!p.acknowledged ? (
                      <button
                        onClick={() => setSelectedPatientForOverride(p)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded shadow"
                      >
                        Override / Acknowledge
                      </button>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded text-xs border border-slate-300">
                        {p.overridden ? `Overridden (${p.acknowledgedBy})` : `Acknowledged (${p.acknowledgedBy})`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Vitals Breakdown */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-50 p-2 rounded text-xs text-center border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">HR</span>
                    <span className="font-bold text-slate-900">{p.vitals.heartRate} bpm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">BP</span>
                    <span className="font-bold text-slate-900">{p.vitals.bpSystolic}/{p.vitals.bpDiastolic}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <span className={`font-black ${p.vitals.spo2 < 90 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {p.vitals.spo2}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">RR</span>
                    <span className="font-bold text-slate-900">{p.vitals.respiratoryRate}/m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Temp</span>
                    <span className="font-bold text-slate-900">{p.vitals.temperatureC}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Confidence</span>
                    <span className="font-black text-purple-700">{p.confidenceScore}%</span>
                  </div>
                </div>

                {/* AI Explanation & Interventions */}
                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-700 bg-purple-50/70 p-2.5 rounded border border-purple-200">
                    <strong>AI Clinical Explanation:</strong> {p.aiExplanation}
                  </p>
                  <p className="text-slate-800 bg-rose-50/70 p-2.5 rounded border border-rose-200">
                    <strong>Recommended Urgent Intervention:</strong> {p.recommendedIntervention}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: HOSPITAL & RESOURCE FORECASTING */}
      {activeSubTab === 'hospital-forecasting' && (
        <HospitalForecastingView forecasts={hospitalForecasts} />
      )}

      {/* SUB-TAB 4: AMBULANCE DEMAND & REDISTRIBUTION */}
      {activeSubTab === 'ambulance-demand' && (
        <AmbulanceDemandView forecasts={ambulanceForecasts} />
      )}

      {/* SUB-TAB 5: DISTRICT RISK INTELLIGENCE */}
      {activeSubTab === 'district-risk' && (
        <DistrictRiskView districtRisks={districtRisks} />
      )}

      {/* SUB-TAB 6: DISEASE CLUSTERS & GIS */}
      {activeSubTab === 'disease-clusters' && (
        <DiseaseClustersView clusters={clusters} emergencyForecasts={emergencyForecasts} />
      )}

      {/* SUB-TAB 7: AI COMMAND & RESOURCE BALANCER */}
      {activeSubTab === 'resource-balancer' && (
        <ResourceBalancerView recommendations={recommendations} onAction={handleRecommendationAction} />
      )}

      {/* SUB-TAB 8: DOCTOR AI WORKSPACE */}
      {activeSubTab === 'doctor-workspace' && (
        <DoctorAiWorkspaceView patients={doctorPatients} onAction={handleDoctorAction} />
      )}

      {/* SUB-TAB 9: PREDICTIVE ANALYTICS */}
      {activeSubTab === 'predictive-analytics' && predictiveAnalytics && (
        <PredictiveAnalyticsView analytics={predictiveAnalytics} />
      )}

      {/* SUB-TAB 10: EMERGENCY SIMULATION PANEL */}
      {activeSubTab === 'simulation' && (
        <div className="bg-slate-950 text-white p-4 rounded-lg border border-slate-800 shadow-md space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-400" />
              <span>State Emergency Operations Disaster Simulation Panel</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate high-impact mass casualty disasters, floods, highway collisions, or heatwaves to pressure-test district hospital capacities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Disaster Scenario</label>
              <select
                value={simScenario}
                onChange={(e) => setSimScenario(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold"
              >
                <option value="MASS_CASUALTY">MASS CASUALTY EVENT</option>
                <option value="HIGHWAY_ACCIDENT">HIGHWAY EXPRESSWAY COLLISION</option>
                <option value="FLOOD">MONSOON FLASH FLOOD</option>
                <option value="EARTHQUAKE">EARTHQUAKE DISASTER</option>
                <option value="PANDEMIC">EPIDEMIC DISEASE OUTBREAK</option>
                <option value="INDUSTRIAL_DISASTER">INDUSTRIAL CHEMICAL LEAK</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Target District</label>
              <select
                value={simDistrict}
                onChange={(e) => setSimDistrict(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold"
              >
                <option value="Nagpur">Nagpur</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Chandrapur">Chandrapur</option>
                <option value="Nashik">Nashik</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Simulated Intensity</label>
              <select
                value={simIntensity}
                onChange={(e) => setSimIntensity(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold"
              >
                <option value="MODERATE">MODERATE (20 Casualties)</option>
                <option value="SEVERE">SEVERE (45 Casualties)</option>
                <option value="CATASTROPHIC">CATASTROPHIC (120+ Casualties)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRunSimulation}
              disabled={runningSim}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded shadow flex items-center gap-2"
            >
              <Play className={`w-4 h-4 ${runningSim ? 'animate-spin' : ''}`} />
              <span>{runningSim ? 'Executing Stochastic Disaster Simulation...' : 'Run Emergency Disaster Simulation'}</span>
            </button>
          </div>

          {/* Simulation Result Output */}
          {simResult && (
            <div className="bg-slate-900 p-4 rounded-lg border border-amber-500/50 space-y-3 mt-4">
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Simulation Outcome Report: {simResult.scenario.replace(/_/g, ' ')}</span>
                <span className="text-[10px] text-slate-400 font-mono">DISTRICT: {simResult.district}</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-purple-900/60 p-2.5 rounded border border-purple-800">
                  <span className="text-[10px] text-purple-300 block">Est. Casualties</span>
                  <span className="text-xl font-black text-rose-300">{simResult.estimatedCasualties} Patients</span>
                </div>

                <div className="bg-purple-900/60 p-2.5 rounded border border-purple-800">
                  <span className="text-[10px] text-purple-300 block">Hospital Load Jump</span>
                  <span className="text-xl font-black text-rose-300">+{simResult.hospitalOccupancyJump}%</span>
                </div>

                <div className="bg-purple-900/60 p-2.5 rounded border border-purple-800">
                  <span className="text-[10px] text-purple-300 block">108 Ambulances Mobilized</span>
                  <span className="text-xl font-black text-sky-300">{simResult.ambulancesDispatched} Units</span>
                </div>

                <div className="bg-purple-900/60 p-2.5 rounded border border-purple-800">
                  <span className="text-[10px] text-purple-300 block">ICU Exhaustion Horizon</span>
                  <span className="text-xl font-black text-amber-300">{simResult.predictedIcuExhaustionTimeMin} min</span>
                </div>
              </div>

              <div className="bg-purple-900/40 p-3 rounded border border-purple-800 space-y-1.5">
                <h4 className="text-xs font-bold text-amber-300">Generated AI Emergency Action Plan:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-purple-200">
                  {simResult.aiActionPlan.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Override Modal */}
      {selectedPatientForOverride && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full p-4 space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center justify-between border-b pb-2">
              <span>Medical Officer AI Prediction Override</span>
              <button onClick={() => setSelectedPatientForOverride(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </h3>

            <p className="text-xs text-slate-600">
              Overriding patient <strong>{selectedPatientForOverride.patientName}</strong> (Risk Score:{' '}
              {selectedPatientForOverride.riskScore}).
            </p>

            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">Reason for Override (Clinical Justification)</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="E.g., Patient responding well to initial fluid bolus; vitals stabilizing..."
                className="w-full p-2 border border-slate-300 rounded text-xs"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedPatientForOverride(null)}
                className="px-3 py-1.5 text-xs text-slate-600 font-bold hover:bg-slate-100 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => handlePatientAckOrOverride(selectedPatientForOverride.id, true)}
                className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-black rounded shadow"
              >
                Submit Clinical Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
