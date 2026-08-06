import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  Truck,
  Activity,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';
import { Incident, PriorityLevel, AiTriageAssessment } from '../types';

interface AiTriageDetailModalProps {
  incident: Incident;
  onClose: () => void;
  onOverridePriority: (incidentId: string, newPriority: PriorityLevel, reason: string, officerName: string) => void;
  onUpdateStatus?: (incidentId: string, newStatus: Incident['status']) => void;
}

export const AiTriageDetailModal: React.FC<AiTriageDetailModalProps> = ({
  incident,
  onClose,
  onOverridePriority,
  onUpdateStatus,
}) => {
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>(incident.priority);
  const [overrideReason, setOverrideReason] = useState('');
  const [officerName, setOfficerName] = useState('Duty Dispatch Officer');

  const triage: AiTriageAssessment | undefined = incident.aiTriage;

  const getPriorityBadgeClass = (p: PriorityLevel) => {
    switch (p) {
      case 'RED':
        return 'bg-rose-600 text-white font-black border-rose-700 shadow-sm';
      case 'ORANGE':
        return 'bg-amber-500 text-slate-950 font-black border-amber-600';
      case 'YELLOW':
        return 'bg-yellow-400 text-slate-950 font-black border-yellow-500';
      case 'GREEN':
        return 'bg-emerald-600 text-white font-bold border-emerald-700';
      case 'BLUE':
        return 'bg-sky-600 text-white font-bold border-sky-700';
      default:
        return 'bg-slate-600 text-white font-bold';
    }
  };

  const getPriorityLabel = (p: PriorityLevel) => {
    switch (p) {
      case 'RED':
        return 'RED (Immediate / Life-Threatening)';
      case 'ORANGE':
        return 'ORANGE (Very Urgent / High Deterioration Risk)';
      case 'YELLOW':
        return 'YELLOW (Urgent / Serious Condition)';
      case 'GREEN':
        return 'GREEN (Stable / Minor Transfer)';
      case 'BLUE':
        return 'BLUE (Low Priority / Non-Urgent)';
    }
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;
    onOverridePriority(incident.id, selectedPriority, overrideReason, officerName);
    setShowOverrideForm(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-sky-400 bg-slate-800 px-2 py-0.5 rounded">
                  {incident.code}
                </span>
                <span className="text-xs text-slate-400">• {incident.districtName} District</span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">{incident.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800">
          {/* Medical Disclaimer Banner */}
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900 flex items-start space-x-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">AI Recommendation Disclaimer:</span> Final decision must be confirmed by emergency medical personnel. Rakshak AI provides decision support and priority categorization for dispatch officers.
            </div>
          </div>

          {/* Core Triage Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Current Assigned Priority */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Assigned Priority
              </span>
              <div className="mt-2 flex items-center space-x-2">
                <span className={`px-2.5 py-1 text-xs rounded border ${getPriorityBadgeClass(incident.priority)}`}>
                  {incident.priority}
                </span>
                {incident.overrideAudit && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    Human Overridden
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-2 font-medium">
                {getPriorityLabel(incident.priority)}
              </p>
            </div>

            {/* AI Recommendation */}
            <div className="bg-sky-50/70 p-3.5 rounded-lg border border-sky-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                AI Triage Recommendation
              </span>
              <div className="mt-2 flex items-center space-x-2">
                <span
                  className={`px-2.5 py-1 text-xs rounded border ${getPriorityBadgeClass(
                    triage?.recommendedPriority || incident.priority
                  )}`}
                >
                  {triage?.recommendedPriority || incident.priority}
                </span>
                <span className="text-xs font-bold text-sky-900 bg-sky-200/80 px-2 py-0.5 rounded">
                  {triage?.confidenceScore || 95}% Confidence
                </span>
              </div>
              <p className="text-[11px] text-sky-900 mt-2 font-medium">
                Model: {triage?.modelVersion || 'gemini-3.6-flash'}
              </p>
            </div>

            {/* Suggested Hospital Capability */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                Suggested Level
              </span>
              <div className="mt-2 font-extrabold text-sm text-slate-900">
                {triage?.suggestedHospitalCapability || 'Level 1 Trauma Center'}
              </div>
              <p className="text-[11px] text-slate-600 mt-2 font-semibold">
                Dept: {triage?.suggestedDepartment || 'Trauma ICU'}
              </p>
            </div>
          </div>

          {/* Clinical Explanation & Priority Logic */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Activity className="w-4 h-4 text-rose-600" />
              AI Clinical Explainability Breakdown
            </h3>

            <div>
              <span className="text-xs font-bold text-slate-700">Summary Assessment:</span>
              <p className="text-xs text-slate-800 font-medium bg-slate-50 p-2.5 rounded border border-slate-200 mt-1">
                {triage?.summary || incident.notes}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-bold text-slate-700">Clinical Explanation:</span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {triage?.clinicalExplanation || 'Assessed based on severity indicators and patient count.'}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700">Priority Selection Logic:</span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {triage?.priorityLogic || 'Selected based on mortality risk and resource requirements.'}
                </p>
              </div>
            </div>

            {/* Symptoms analyzed chips */}
            {triage?.symptomsUsed && triage.symptomsUsed.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Symptoms & Clinical Indicators Analyzed:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {triage.symptomsUsed.map((sym, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-rose-50 text-rose-800 font-bold px-2.5 py-1 rounded-full border border-rose-200"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {triage?.suggestedActions && triage.suggestedActions.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Recommended Dispatch & Medical Actions:
                </span>
                <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
                  {triage.suggestedActions.map((act, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="font-semibold">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Audit History (If Human Overridden) */}
          {incident.overrideAudit && (
            <div className="bg-amber-50/80 border border-amber-300 rounded-lg p-3.5 text-xs space-y-1">
              <div className="font-bold text-amber-900 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Human Officer Override Audit Record</span>
              </div>
              <div className="text-amber-800 font-medium">
                Changed from <span className="font-bold">{incident.overrideAudit.originalAiPriority}</span> to{' '}
                <span className="font-bold">{incident.overrideAudit.humanAssignedPriority}</span> by{' '}
                <span className="font-bold">{incident.overrideAudit.officerName}</span> at{' '}
                {new Date(incident.overrideAudit.timestamp).toLocaleTimeString()}
              </div>
              <p className="text-amber-900 italic font-medium">
                Reason: "{incident.overrideAudit.reason}"
              </p>
            </div>
          )}

          {/* Officer Priority Override Form Toggle */}
          {!showOverrideForm ? (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowOverrideForm(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-lg border border-slate-300 transition-colors flex items-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4 text-slate-700" />
                <span>Override Priority Manually</span>
              </button>

              {onUpdateStatus && incident.status !== 'CLOSED' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateStatus(incident.id, 'EN_ROUTE')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded"
                  >
                    Mark En-Route
                  </button>
                  <button
                    onClick={() => onUpdateStatus(incident.id, 'HOSPITAL_ARRIVED')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded"
                  >
                    Mark Hospital Arrived
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Override Form */
            <form onSubmit={handleOverrideSubmit} className="bg-slate-50 p-4 rounded-lg border border-slate-300 space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900 flex items-center space-x-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Dispatch Medical Officer Priority Override</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Priority Level *</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
                  >
                    <option value="RED">RED - Immediate (Life-Threatening)</option>
                    <option value="ORANGE">ORANGE - Very Urgent (High Risk)</option>
                    <option value="YELLOW">YELLOW - Urgent (Serious)</option>
                    <option value="GREEN">GREEN - Stable (Minor)</option>
                    <option value="BLUE">BLUE - Low Priority (Non-Urgent)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Officer Name / Badge *</label>
                  <input
                    type="text"
                    required
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mandatory Override Clinical Justification *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="State clinical reason for overriding AI recommendation (e.g. Field vitals stabilization, direct physician order...)"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-medium text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowOverrideForm(false)}
                  className="px-3 py-1.5 text-slate-600 font-bold hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-sm"
                >
                  Save Override & Log Audit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
