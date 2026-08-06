import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  BrainCircuit,
  Compass,
  BedDouble,
  Activity,
  Send,
  Zap,
} from 'lucide-react';
import { Incident, Hospital, AiHospitalRecommendation } from '../../types';

interface AiResourceAllocationModalProps {
  incidents: Incident[];
  hospitals: Hospital[];
  selectedDistrict: string;
  onClose: () => void;
  onSelectHospitalForReservation?: (hospitalId: string) => void;
}

export const AiResourceAllocationModal: React.FC<AiResourceAllocationModalProps> = ({
  incidents,
  hospitals,
  selectedDistrict,
  onClose,
  onSelectHospitalForReservation,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [icuRequired, setIcuRequired] = useState(true);
  const [ventilatorRequired, setVentilatorRequired] = useState(true);
  const [requiredSpecialty, setRequiredSpecialty] = useState('Trauma & Critical Care');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AiHospitalRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);

  const handleRunAiAllocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/hospital-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentType: selectedIncident?.title || 'Mass Casualty Emergency',
          priority: selectedIncident?.priority || 'RED',
          patientCount: selectedIncident?.affectedCount || 5,
          districtId: selectedIncident?.districtId || selectedDistrict,
          districtName: selectedIncident?.districtName || 'Nagpur',
          requiredSpecialty,
          icuRequired,
          ventilatorRequired,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError('Failed to generate AI recommendation.');
      } else {
        setRecommendation(data.recommendation);
      }
    } catch (err: any) {
      setError(err.message || 'Network error invoking Gemini AI engine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase block">
                State Emergency Command Engine
              </span>
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                Gemini AI Multi-Hospital Resource Allocation Engine
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-extrabold text-sm p-1 rounded hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Form Input Parameters */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Select Active Emergency Incident:
                </label>
                <select
                  value={selectedIncidentId}
                  onChange={(e) => setSelectedIncidentId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 text-slate-900 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                >
                  {incidents.map((inc) => (
                    <option key={inc.id} value={inc.id}>
                      [{inc.code}] {inc.title} ({inc.affectedCount} Patients — {inc.priority})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Required Clinical Specialty:
                </label>
                <select
                  value={requiredSpecialty}
                  onChange={(e) => setRequiredSpecialty(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 text-slate-900 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                >
                  <option value="Trauma & Critical Care">Level 1 Trauma & Critical Care</option>
                  <option value="Chemical & Toxicological Isolation">Chemical & Toxicological Isolation</option>
                  <option value="Neurosurgery & Spine">Neurosurgery & Spine Surgery</option>
                  <option value="Cardiothoracic Emergency">Cardiothoracic Resuscitation</option>
                  <option value="Burns & Plastic Surgery">Burns & Plastic Surgery Unit</option>
                  <option value="Pediatric Emergency">Pediatric ICU & Trauma</option>
                </select>
              </div>
            </div>

            {/* Checkbox Constraints */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 font-semibold pt-1">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={icuRequired}
                  onChange={(e) => setIcuRequired(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Mandatory Dedicated ICU Bed</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ventilatorRequired}
                  onChange={(e) => setVentilatorRequired(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Mandatory Invasive Mechanical Ventilator</span>
              </label>

              <button
                type="button"
                onClick={handleRunAiAllocation}
                disabled={loading}
                className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-4 py-2 rounded shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  'Evaluating Hospital Telemetry...'
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    Run AI Optimization Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-600 p-3 text-xs text-rose-900 font-bold">
              {error}
            </div>
          )}

          {/* AI Output Display */}
          {recommendation && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Primary Recommended Hospital Card */}
              <div className="bg-slate-900 text-white rounded-xl p-4 border border-indigo-500/40 shadow-lg space-y-3 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      Optimal Primary Facility
                    </span>
                    <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Confidence Score: {recommendation.confidenceScore}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Powered by Gemini 3.6 Flash
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    {recommendation.bestHospitalName}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed bg-slate-800/80 p-2.5 rounded border border-slate-700">
                    <span className="text-indigo-400 font-bold block mb-0.5">
                      "WHY" Operational Justification:
                    </span>
                    {recommendation.explainability}
                  </p>
                </div>

                {onSelectHospitalForReservation && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        onSelectHospitalForReservation(recommendation.bestHospitalId);
                        onClose();
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors shadow"
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      Pre-Reserve Bed at {recommendation.bestHospitalName}
                    </button>
                  </div>
                )}
              </div>

              {/* Alternative Hospital Options */}
              <div>
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-slate-700" />
                  Secondary Backup Facilities (Redirection Alternatives)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendation.alternativeHospitals.map((alt, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 hover:border-slate-300 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {alt.hospitalName}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                          Score: {alt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {alt.reason}
                      </p>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1">
                        <span>Free ICU: {alt.availableIcu}</span>
                        <span>Free Vents: {alt.availableVentilators}</span>
                        <span>Distance: {alt.distanceKm} km</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity Warnings & Suggested Redistribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1.5">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Capacity & Surge Warnings
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-amber-900 space-y-1 font-medium">
                    {recommendation.capacityWarnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 space-y-1.5">
                  <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-sky-600" />
                    Resource Redistribution Strategy
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-sky-900 space-y-1 font-medium">
                    {recommendation.suggestedResourceRedistribution.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors"
          >
            Close Engine
          </button>
        </div>
      </div>
    </div>
  );
};
