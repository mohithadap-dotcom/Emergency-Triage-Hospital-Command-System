import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Zap,
  Thermometer,
  Wind,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Droplet,
  Brain,
  Send,
} from 'lucide-react';
import { IotPatientVitals, AmbulanceMission } from '../../types';

interface AmbulancePatientVitalsViewProps {
  mission: AmbulanceMission | null;
  onSendVitalsUpdate?: (vitals: Partial<IotPatientVitals>) => Promise<void>;
}

export const AmbulancePatientVitalsView: React.FC<AmbulancePatientVitalsViewProps> = ({
  mission,
  onSendVitalsUpdate,
}) => {
  const [vitals, setVitals] = useState<IotPatientVitals>({
    incidentId: mission?.incidentId || 'inc-0101',
    patientId: 'PAT-MH-2026-901',
    heartRate: 118,
    bpSystolic: 92,
    bpDiastolic: 62,
    spo2: 91,
    temperatureC: 37.2,
    respRate: 24,
    ecgStatus: 'ST_ELEVATION',
    bloodGlucoseMgDl: 142,
    painScore: 8,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    deteriorationRiskScore: 84,
    aiAlert: 'CRITICAL ALERT: Tachycardia + SpO₂ 91% + ST-Segment Elevation detected. Potential Traumatic Myocardial Contusion or Hypovolemic Shock.',
  });

  const [isAutoStreaming, setIsAutoStreaming] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Connected to Medical IoT Telemetry Hub (10 Hz)');

  // Auto-stream small fluctuating simulated telemetry
  useEffect(() => {
    if (!isAutoStreaming) return;
    const interval = setInterval(() => {
      setVitals((prev) => {
        const hrDelta = Math.floor(Math.random() * 5) - 2;
        const bpSysDelta = Math.floor(Math.random() * 4) - 2;
        const spo2Delta = Math.floor(Math.random() * 3) - 1;

        const newHr = Math.min(160, Math.max(60, prev.heartRate + hrDelta));
        const newBpSys = Math.min(180, Math.max(70, prev.bpSystolic + bpSysDelta));
        const newSpo2 = Math.min(100, Math.max(80, prev.spo2 + spo2Delta));

        const newVitals: IotPatientVitals = {
          ...prev,
          heartRate: newHr,
          bpSystolic: newBpSys,
          spo2: newSpo2,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          deteriorationRiskScore: newSpo2 < 90 || newBpSys < 90 ? 88 : 74,
        };

        // Post back to API if callback provided
        if (onSendVitalsUpdate) {
          onSendVitalsUpdate(newVitals);
        }

        return newVitals;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoStreaming, onSendVitalsUpdate]);

  const handleManualVitalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      if (onSendVitalsUpdate) {
        await onSendVitalsUpdate(vitals);
      }
      setSyncStatus('✓ Manual Paramedic Vitals Broadcasted to Hospital ER & Doctor Workspace.');
    } catch (err) {
      console.error('Vitals sync error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border-2 border-rose-500/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-600 rounded-xl">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black tracking-tight text-white">
                Live IoT Emergency Patient Telemetry
              </h2>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-rose-500/30 uppercase">
                {isAutoStreaming ? 'STREAMING ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Patient: <strong className="text-white">{mission?.patientName || 'Prakash Rao (Age 42)'}</strong> • Incident: {mission?.incidentCode || 'INC-2026-089'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAutoStreaming(!isAutoStreaming)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
              isAutoStreaming
                ? 'bg-rose-600 text-white hover:bg-rose-500'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isAutoStreaming ? 'Pause Auto Telemetry' : 'Resume Auto Stream'}
          </button>
        </div>
      </div>

      {/* AI Deterioration Prediction Alert Box */}
      {vitals.aiAlert && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-2 border-rose-500/80 p-4 rounded-xl text-white shadow-lg flex items-start space-x-3">
          <Sparkles className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-amber-300 font-mono">
                AI PATIENT DETERIORATION PREDICTION RISK SCORE: {vitals.deteriorationRiskScore}/100
              </span>
              <span className="bg-rose-600 text-white font-bold text-[9px] px-2 py-0.2 rounded uppercase">
                HIGH DETERIORATION RISK
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">
              {vitals.aiAlert}
            </p>
            <p className="text-[10px] text-slate-400 font-mono pt-1">
              Transmitted automatically to AIIMS Nagpur / Ruby Hall ER Resuscitation Bay Team.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Telemetry Sensors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600 animate-ping" />
              <span>Heart Rate (HR)</span>
            </span>
            <span className="font-mono text-[10px]">BPM</span>
          </div>
          <div className="text-3xl font-black text-rose-700 font-mono">
            {vitals.heartRate}
          </div>
          <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded w-max">
            TACHYCARDIA (ELEVATED)
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Blood Pressure</span>
            </span>
            <span className="font-mono text-[10px]">mmHg</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {vitals.bpSystolic}/{vitals.bpDiastolic}
          </div>
          <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-max">
            BORDERLINE HYPOTENSIVE
          </div>
        </div>

        {/* SpO2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-teal-600" />
              <span>Blood Oxygen (SpO₂)</span>
            </span>
            <span className="font-mono text-[10px]">%</span>
          </div>
          <div className="text-3xl font-black text-teal-700 font-mono">
            {vitals.spo2}%
          </div>
          <div className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded w-max">
            HIGH-FLOW O₂ CONNECTED
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-600" />
              <span>Temperature</span>
            </span>
            <span className="font-mono text-[10px]">°C</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {vitals.temperatureC}°C
          </div>
          <div className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded w-max">
            NORMOTHERMIC
          </div>
        </div>

        {/* ECG Status */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>12-Lead ECG Status</span>
            </span>
          </div>
          <div className="text-lg font-black text-amber-700 font-mono">
            {vitals.ecgStatus}
          </div>
          <div className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
            Lead II / V5 Monitor Active
          </div>
        </div>

        {/* Blood Glucose */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-indigo-600" />
              <span>Blood Glucose</span>
            </span>
            <span className="font-mono text-[10px]">mg/dL</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {vitals.bloodGlucoseMgDl}
          </div>
          <div className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded w-max">
            RANDOM GLUCOSE
          </div>
        </div>

        {/* Pain Score */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Pain Scale Score</span>
            </span>
            <span className="font-mono text-[10px]">0-10</span>
          </div>
          <div className="text-3xl font-black text-purple-700 font-mono">
            {vitals.painScore} / 10
          </div>
          <div className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded w-max">
            SEVERE PAIN
          </div>
        </div>

        {/* Respiratory Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-emerald-600" />
              <span>Respiratory Rate</span>
            </span>
            <span className="font-mono text-[10px]">RPM</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {vitals.respRate}
          </div>
          <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-max">
            TACHYPNEA
          </div>
        </div>
      </div>

      {/* Manual Paramedic Override Form */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Manual Paramedic Vitals Override / Verification
          </h3>
          <span className="text-xs text-slate-500 font-mono">{syncStatus}</span>
        </div>

        <form onSubmit={handleManualVitalsSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Heart Rate (BPM)</label>
            <input
              type="number"
              value={vitals.heartRate}
              onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">Systolic BP (mmHg)</label>
            <input
              type="number"
              value={vitals.bpSystolic}
              onChange={(e) => setVitals({ ...vitals, bpSystolic: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">SpO₂ (%)</label>
            <input
              type="number"
              value={vitals.spo2}
              onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
