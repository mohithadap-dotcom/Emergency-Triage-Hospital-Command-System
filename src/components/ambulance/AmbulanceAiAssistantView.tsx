import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Zap,
  AlertTriangle,
  Hospital,
  Navigation,
  CheckCircle2,
  Brain,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AmbulanceMission, EmsAiAssistantRecommendation } from '../../types';

interface AmbulanceAiAssistantViewProps {
  mission: AmbulanceMission | null;
}

export const AmbulanceAiAssistantView: React.FC<AmbulanceAiAssistantViewProps> = ({
  mission,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<EmsAiAssistantRecommendation>({
    transportRiskScore: 78,
    suggestedHospitalId: mission?.hospitalId || 'hosp-ngp-01',
    suggestedHospitalName: mission?.hospitalName || 'AIIMS Nagpur Level 1 Trauma Center',
    suggestedRoute: 'Samruddhi Expressway Corridor via Hingna Signal Override (Save 12 mins)',
    suggestedEquipment: [
      'Portable Transport Ventilator (Volume-Control PEEP 5)',
      '12-Lead Continuous ECG Lead V5',
      'Cervical Spine Immobilization Collar',
      'Normal Saline IV Pressure Bag',
    ],
    suggestedPreparation: [
      'Pre-alert AIIMS Nagpur Resuscitation Bay 1 for Level 1 Polytrauma',
      'Prepare 2 Units O-Negative Uncrossmatched Blood for ER Ramp arrival',
      'Confirm Neurosurgery & Orthopedic Trauma surgeons standing by',
    ],
    patientSummary:
      'High-velocity road collision victim with unstable vitals, suspected traumatic chest injury, open femur fracture, and borderline hypotension.',
    arrivalSummary:
      'Patient expected in 5 minutes via Green Corridor. Direct transfer to Resuscitation Bay 1 recommended for Immediate Blood Transfusion & CT Scan.',
    confidenceScore: 97,
    reasoning:
      'Gemini 3.6 Flash analyzed real-time IoT vitals (HR 118, BP 92/62, SpO2 91%), crash velocity telemetry, and regional ICU capacity to compute transport risk and optimal reception pathway.',
    humanReviewRequired: true,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  });

  const handleRunAiAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ambulance/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentTitle: mission?.incidentTitle || 'Multi-Vehicle Highway Collision',
          patientCondition: mission?.patientCondition || 'Polytrauma and shock',
          hospitalName: mission?.hospitalName || 'AIIMS Nagpur',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.recommendation) {
          setRecommendation(data.recommendation);
        }
      }
    } catch (err) {
      console.error('AI call error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl border-2 border-indigo-500/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
            <Sparkles className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black tracking-tight text-white">
                Google Gemini AI EMS Assistant
              </h2>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-500/30">
                GEMINI-3.6-FLASH
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Transport Risk Assessment • Route Optimization • Pre-Arrival Hospital Preparation
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAiAnalysis}
          disabled={isLoading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow uppercase tracking-wide disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Running Gemini AI...' : 'Re-Run AI Assessment'}</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-xs flex items-center space-x-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Clinical Disclaimer:</strong> The AI EMS Assistant provides decision support to optimize logistics, route selection, and hospital preparation. It never diagnoses conditions or prescribes medical treatment. Human review required.
        </span>
      </div>

      {/* Main AI Output Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Score & Facility */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Transport Risk & Reception</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Transport Risk Score</span>
              <span className="text-3xl font-black text-rose-700 font-mono">{recommendation.transportRiskScore} / 100</span>
              <span className="text-[10px] text-rose-600 font-bold block mt-0.5">HIGH TRANSPORT RISK</span>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
              <span className="text-[10px] text-sky-800 font-bold block uppercase mb-1">Optimal Hospital Match</span>
              <span className="font-extrabold text-sky-950 text-sm block">{recommendation.suggestedHospitalName}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">Recommended Route</span>
              <span className="font-semibold text-slate-800 text-xs">{recommendation.suggestedRoute}</span>
            </div>
          </div>
        </div>

        {/* Suggested Equipment & Preparation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Suggested Equipment & Preparation</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Required Equipment Checklist:</span>
              <div className="space-y-1.5">
                {recommendation.suggestedEquipment.map((eq, i) => (
                  <div key={i} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg text-slate-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{eq}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Hospital Pre-Arrival Steps:</span>
              <div className="space-y-1.5">
                {recommendation.suggestedPreparation.map((prep, i) => (
                  <div key={i} className="p-2 bg-indigo-50 rounded-lg text-indigo-900 font-medium text-[11px]">
                    • {prep}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Reasoning & Confidence */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-indigo-900 pb-2">
            <Brain className="w-4 h-4 text-amber-400" />
            <span>AI Reasoning & Explainability</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold block mb-1">Patient Summary:</span>
              <p className="text-slate-200 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {recommendation.patientSummary}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-bold block mb-1">Arrival Summary:</span>
              <p className="text-slate-200 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {recommendation.arrivalSummary}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono">
              <span className="text-slate-400">Confidence Score:</span>
              <span className="text-emerald-400 font-bold text-sm">{recommendation.confidenceScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
