import React, { useState } from 'react';
import {
  Stethoscope,
  HeartPulse,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  UserCheck,
  Building2,
  ShieldAlert,
  Sliders,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { DoctorAiWorkspacePatient } from '../../types';

interface DoctorAiWorkspaceViewProps {
  patients: DoctorAiWorkspacePatient[];
  onAction: (patientId: string, action: 'APPROVED' | 'REJECTED' | 'MODIFIED', notes?: string) => void;
}

export const DoctorAiWorkspaceView: React.FC<DoctorAiWorkspaceViewProps> = ({ patients, onAction }) => {
  const [selectedPatient, setSelectedPatient] = useState<DoctorAiWorkspacePatient | null>(patients[0] || null);
  const [modifiedNotes, setModifiedNotes] = useState('');
  const [activeActionModal, setActiveActionModal] = useState<'APPROVE' | 'REJECT' | 'MODIFY' | null>(null);

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'CRITICAL':
        return 'bg-purple-950 text-purple-200 border-purple-600 animate-pulse';
      case 'RED':
        return 'bg-rose-600 text-white border-rose-500';
      case 'ORANGE':
        return 'bg-amber-600 text-amber-100 border-amber-500';
      case 'YELLOW':
        return 'bg-yellow-900 text-yellow-200 border-yellow-500';
      default:
        return 'bg-emerald-900 text-emerald-200 border-emerald-500';
    }
  };

  const currentPatient = selectedPatient || patients[0];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white text-stone-900 p-4 rounded-lg border border-stone-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-stone-900 tracking-wide">Doctor AI Clinical Command Workspace</h3>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-700">
              DOCTOR CLINICAL TRIAGE & INTERVENTION PROTOCOL
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time clinical AI decision support, incoming patient vitals trend analysis, predicted deterioration horizons & prep checklist.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="bg-cream px-3 py-1.5 rounded border border-stone-200 text-right">
            <span className="text-[10px] text-stone-500 block">Pending Clinical Decisions</span>
            <span className="font-extrabold text-amber-400">
              {patients.filter((p) => !p.doctorDecision || p.doctorDecision.status === 'PENDING').length} Patients En-Route
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Incoming Patients List */}
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-600" />
              <span>Incoming Patients Queue</span>
            </h4>
            <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
              {patients.length} Active
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {patients.map((patient) => {
              const isSelected = currentPatient?.id === patient.id;
              const decisionStatus = patient.doctorDecision?.status;

              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-stone-200 hover:border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-black text-stone-900 block text-sm">{patient.patientName}</span>
                      <span className="text-[11px] text-stone-500 block">
                        {patient.incidentCode} • {patient.incidentType}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getRiskColor(patient.riskCategory)}`}>
                      {patient.riskCategory}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-stone-500 block">ETA to Hospital</span>
                      <span className="font-bold text-stone-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" />
                        {patient.etaMinutes} Minutes
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-500 block">AI Risk Score</span>
                      <span className="font-bold text-rose-600 flex items-center gap-1">
                        <HeartPulse className="w-3 h-3 text-rose-500" />
                        {patient.liveRiskScore}/100
                      </span>
                    </div>
                  </div>

                  {decisionStatus && (
                    <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-500">Doctor Status:</span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          decisionStatus === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-400'
                            : decisionStatus === 'REJECTED'
                            ? 'bg-rose-100 text-rose-400'
                            : 'bg-amber-100 text-amber-400'
                        }`}
                      >
                        {decisionStatus}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Patient Intelligence & Clinical Actions */}
        {currentPatient && (
          <div className="lg:col-span-2 space-y-4">
            {/* Patient Header Card */}
            <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-stone-900">{currentPatient.patientName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getRiskColor(currentPatient.riskCategory)}`}>
                      {currentPatient.riskCategory} RISK ({currentPatient.liveRiskScore}/100)
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Assigned: <strong>{currentPatient.assignedDoctorName}</strong> ({currentPatient.hospitalName}) • Incident:{' '}
                    <strong>{currentPatient.incidentCode}</strong>
                  </p>
                </div>

                <div className="bg-white text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 text-right">
                  <span className="text-[10px] text-stone-500 block uppercase font-mono">Incoming ETA</span>
                  <span className="text-sm font-black text-amber-400 flex items-center gap-1 justify-end">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    {currentPatient.etaMinutes} MIN
                  </span>
                </div>
              </div>

              {/* Vitals Summary Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-cream p-2.5 rounded-md border border-stone-200 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 block">Heart Rate</span>
                  <span className={`font-extrabold ${currentPatient.vitals.heartRate > 120 ? 'text-rose-600 font-black' : 'text-stone-800'}`}>
                    {currentPatient.vitals.heartRate} bpm
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">Blood Pressure</span>
                  <span className={`font-extrabold ${currentPatient.vitals.bpSystolic < 90 ? 'text-rose-600 font-black' : 'text-stone-800'}`}>
                    {currentPatient.vitals.bpSystolic}/{currentPatient.vitals.bpDiastolic}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">SpO2 Oxygen</span>
                  <span className={`font-extrabold ${currentPatient.vitals.spo2 < 90 ? 'text-rose-600 font-black' : 'text-stone-800'}`}>
                    {currentPatient.vitals.spo2}%
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">Resp. Rate</span>
                  <span className="font-extrabold text-stone-800">{currentPatient.vitals.respiratoryRate}/min</span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">Temperature</span>
                  <span className="font-extrabold text-stone-800">{currentPatient.vitals.temperatureC}°C</span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">Deterioration Horizon</span>
                  <span className="font-black text-purple-400">{currentPatient.predictedDeteriorationTimeMin} min</span>
                </div>
              </div>

              {/* Clinical Summary & AI Risk Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="bg-sky-50/60 p-3 rounded-md border border-sky-200 space-y-1">
                  <span className="font-bold text-sky-900 block flex items-center gap-1 text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    Clinical Summary
                  </span>
                  <p className="text-stone-600 leading-relaxed">{currentPatient.clinicalSummary}</p>
                </div>

                <div className="bg-purple-50/60 p-3 rounded-md border border-purple-200 space-y-1">
                  <span className="font-bold text-purple-900 block flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    AI Reasoning & Risk Pathway
                  </span>
                  <p className="text-stone-600 leading-relaxed">{currentPatient.aiRiskExplanation}</p>
                </div>
              </div>

              {/* Vitals Trend Graph Simulation */}
              <div className="bg-white text-stone-900 p-3 rounded-md border border-stone-200 space-y-2">
                <h4 className="text-xs font-bold text-stone-600 flex items-center justify-between">
                  <span>En-Route Telemetry Vitals Trend (Last 30 Mins)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">STREAMING LIVE (100 Hz)</span>
                </h4>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {currentPatient.vitalsTrend.map((vt, idx) => (
                    <div key={idx} className="bg-cream p-2 rounded border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">{vt.timestamp}</span>
                      <span className="text-xs font-black text-rose-400 block">HR: {vt.hr} bpm</span>
                      <span className="text-[10px] text-sky-400 block">SpO2: {vt.spo2}%</span>
                      <span className="text-[10px] text-amber-400 block">BP: {vt.bpSys} mmHg</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Suggested Preparation Checklist */}
              <div className="bg-emerald-50/70 p-3 rounded-md border border-emerald-200 space-y-2">
                <h4 className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AI Recommended Emergency Preparation Checklist</span>
                </h4>

                <ul className="space-y-1.5 text-xs text-stone-800">
                  {currentPatient.suggestedPreparation.map((prep, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white p-2 rounded border border-emerald-100">
                      <span className="bg-emerald-600 text-stone-900 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{prep}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Doctor Action Controls */}
              <div className="bg-stone-100 p-3 rounded-md border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-stone-800 block">Doctor Clinical Verification</span>
                  <span className="text-[10px] text-stone-500">
                    Confirm preparation order, modify clinical notes, or reject suggestion.
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => setActiveActionModal('MODIFY')}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-100 text-stone-800 font-bold rounded border border-stone-200 flex items-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5 text-stone-500" />
                    <span>Modify Notes</span>
                  </button>

                  <button
                    onClick={() => onAction(currentPatient.id, 'REJECT')}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-400 font-bold rounded border border-rose-200 flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Reject Suggestion</span>
                  </button>

                  <button
                    onClick={() => onAction(currentPatient.id, 'APPROVED')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-900 font-black rounded shadow flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-900" />
                    <span>Approve & Order Prep</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modify Notes Modal */}
      {activeActionModal === 'MODIFY' && currentPatient && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg shadow-stone-300/40 border border-stone-200 max-w-md w-full p-4 space-y-3">
            <h3 className="text-sm font-black text-stone-900 flex items-center justify-between border-b pb-2">
              <span>Modify Doctor Clinical Notes & Instructions</span>
              <button onClick={() => setActiveActionModal(null)} className="text-stone-500 hover:text-stone-500">
                <X className="w-4 h-4" />
              </button>
            </h3>

            <p className="text-xs text-stone-500">
              Adding custom clinical notes for <strong>{currentPatient.patientName}</strong>.
            </p>

            <div>
              <label className="font-bold text-xs text-stone-600 block mb-1">Doctor Notes & Orders</label>
              <textarea
                value={modifiedNotes}
                onChange={(e) => setModifiedNotes(e.target.value)}
                placeholder="E.g., Prepare 2 units PRBC instead of 4; add portable X-ray scan..."
                className="w-full p-2 border border-stone-200 rounded text-xs"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveActionModal(null)}
                className="px-3 py-1.5 text-xs text-stone-500 font-bold hover:bg-stone-100 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onAction(currentPatient.id, 'MODIFIED', modifiedNotes);
                  setActiveActionModal(null);
                  setModifiedNotes('');
                }}
                className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-stone-900 font-black rounded shadow"
              >
                Save Doctor Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
