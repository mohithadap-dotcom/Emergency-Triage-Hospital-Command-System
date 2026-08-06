import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldAlert,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import { Hospital } from '../../types';

interface HospitalGeminiAiViewProps {
  hospital: Hospital;
  onAuditLog?: (action: string, details: string) => void;
}

export const HospitalGeminiAiView: React.FC<HospitalGeminiAiViewProps> = ({ hospital, onAuditLog }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const icuOccupancy = Math.round(((hospital.totalIcuBeds - hospital.availableIcuBeds) / hospital.totalIcuBeds) * 100);

  const handleRunAiAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAiResponse(
        `Gemini AI Emergency Diagnostic Analysis for ${hospital.name}:
- **Capacity Forecast**: ICU occupancy predicted to hit 95% within next 3 hours due to Samruddhi Expressway corridor traffic.
- **Diversion Recommendation**: Pre-alert neighboring Kingsway Hospital for non-critical surgical transfers.
- **Staffing Optimization**: Request on-call anesthetist Dr. Rahul Verma for evening shift coverage.
- **Confidence Score**: 96.4%`
      );
      if (onAuditLog) {
        onAuditLog('AI_ASSISTANT', `Ran Gemini AI Hospital Diagnostic Analysis for ${hospital.name}`);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-sky-800/50 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-500/20 text-sky-400 rounded-2xl border border-sky-500/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-full uppercase">
              Powered by Google Gemini 2.5 Flash
            </span>
            <h2 className="text-xl font-black tracking-tight text-white mt-1">
              AI Hospital Operational Intelligence & Risk Assistant
            </h2>
            <p className="text-xs text-sky-200">
              Predictive bed exhaustion, load forecasting, staff optimization, and clinical diversion recommendations
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-sky-800/40 text-xs font-mono">
          <span className="text-sky-300 font-bold">Target Center: {hospital.name}</span>
          <button
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center space-x-2"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{analyzing ? 'Synthesizing Telemetry...' : 'Run Live Diagnostic Model'}</span>
          </button>
        </div>
      </div>

      {/* Primary AI Risk Score & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
            Calculated Hospital Risk Index
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-rose-600">88.4 / 100</span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              HIGH RISK
            </span>
          </div>

          <p className="text-xs text-slate-600">
            High ICU surge probability driven by highway accident pre-arrivals and low remaining ventilator buffer ({hospital.availableVentilators} left).
          </p>
        </div>

        {/* Suggested Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 md:col-span-2">
          <span className="text-[10px] uppercase font-extrabold text-sky-600 tracking-wider block">
            AI Automated Operational Recommendations
          </span>

          <div className="space-y-2 text-xs font-semibold">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Reserve Emergency Ventilators:</strong> Pre-allocate 2 portable ZOLL EMV+ units from Ambulance Bay to Trauma ICU.
              </span>
            </div>

            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong>Notify On-Call Doctor:</strong> Request Dr. Rahul Verma (Neurosurgery) for emergency standby.
              </span>
            </div>
          </div>
        </div>
      </div>

      {aiResponse && (
        <div className="bg-white border border-sky-300 rounded-2xl p-6 shadow-md space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Bot className="w-5 h-5 text-sky-600" />
            <span>Gemini AI Telemetry Diagnostic Output</span>
          </h3>
          <div className="text-xs text-slate-700 space-y-2 whitespace-pre-line font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {aiResponse}
          </div>
        </div>
      )}
    </div>
  );
};
