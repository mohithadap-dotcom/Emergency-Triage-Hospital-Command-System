import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Hospital,
  AlertTriangle,
  User,
  Shield,
  Zap,
  ArrowRight,
  FileText,
  Activity,
  Phone,
  Navigation,
  Send,
  Upload,
} from 'lucide-react';
import { AmbulanceMission, MissionStage } from '../../types';

interface AmbulanceCurrentMissionViewProps {
  mission: AmbulanceMission | null;
  onUpdateStage: (newStage: MissionStage, note?: string) => Promise<void>;
  onNavigateTab: (tab: string) => void;
}

export const AmbulanceCurrentMissionView: React.FC<AmbulanceCurrentMissionViewProps> = ({
  mission,
  onUpdateStage,
  onNavigateTab,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [paramedicNotes, setParamedicNotes] = useState(
    'Patient stabilized at scene with cervical collar, IV saline line, continuous high-flow oxygen.'
  );
  const [showPreArrivalModal, setShowPreArrivalModal] = useState(false);
  const [preArrivalStatus, setPreArrivalStatus] = useState('');

  if (!mission) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900">No Active Emergency Mission</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Ambulance is currently in AVAILABLE state. New dispatch orders from the Government Command Center will appear here in real time.
        </p>
      </div>
    );
  }

  // Define 10 stages workflow
  const workflowStages: { key: MissionStage; label: string; desc: string }[] = [
    { key: 'ASSIGNED', label: '1. Mission Assigned', desc: 'Command Center dispatched vehicle' },
    { key: 'ACCEPTED', label: '2. Driver Accepts', desc: 'Driver confirmed & cleared ramp' },
    { key: 'EN_ROUTE_PATIENT', label: '3. Navigate to Patient', desc: 'En route with siren & maps' },
    { key: 'PATIENT_REACHED', label: '4. Arrived at Scene', desc: 'On scene with hazard lights' },
    { key: 'PATIENT_LOADED', label: '5. Patient Assessment', desc: 'Paramedic triage & vitals recorded' },
    { key: 'EN_ROUTE_HOSPITAL', label: '6. Transport Started', desc: 'Patient loaded, en-route to hospital' },
    { key: 'HOSPITAL_ARRIVED', label: '7. Hospital Arrival', desc: 'Arrived at emergency ramp' },
    { key: 'COMPLETED', label: '8. Patient Handover', desc: 'Handover complete to trauma team' },
  ];

  const currentStageIndex = workflowStages.findIndex((s) => s.key === mission.status);

  const handleStageClick = async (targetStage: MissionStage) => {
    setIsUpdating(true);
    try {
      await onUpdateStage(targetStage, noteInput || `Stage updated to ${targetStage}`);
      setNoteInput('');
    } catch (err) {
      console.error('Failed to update stage:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendPreArrivalReport = () => {
    setPreArrivalStatus('Pre-Arrival Report transmitted to Receiving ER & Attending Doctor via Rakshak Net.');
    setShowPreArrivalModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 border-2 border-rose-500/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="bg-rose-600 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded uppercase">
              {mission.priority} PRIORITY
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Mission ID: {mission.missionCode}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mission.incidentTitle}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Assigned Hospital: <strong className="text-sky-300">{mission.hospitalName}</strong> • Green Corridor: <strong className="text-emerald-300">{mission.greenCorridorActive ? 'ACTIVE' : 'INACTIVE'}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateTab('maps')}
            className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Maps Navigation</span>
          </button>

          <button
            onClick={() => onNavigateTab('vitals')}
            className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow animate-pulse"
          >
            <Activity className="w-4 h-4" />
            <span>Stream Patient Vitals</span>
          </button>
        </div>
      </div>

      {/* Workflow Stage Timeline */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Authoritative Mission Stage Workflow
            </h3>
            <p className="text-xs text-slate-500">
              Updating stage broadcasts real-time location & status to Government Command & Hospital ER.
            </p>
          </div>
          <span className="bg-amber-100 text-amber-900 font-mono text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
            Current: {mission.status}
          </span>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {workflowStages.map((st, idx) => {
            const isCompleted = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <button
                key={st.key}
                disabled={isUpdating}
                onClick={() => handleStageClick(st.key)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold ring-2 ring-amber-300 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black">{st.label}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {isCurrent && <Zap className="w-4 h-4 text-slate-950 animate-bounce" />}
                </div>
                <p className={`text-[10px] leading-tight ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                  {st.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Quick Advance Button */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-700">
            <span className="font-bold">Stage Update Note:</span>
            <input
              type="text"
              placeholder="e.g., Green Corridor clear, patient stable..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          {currentStageIndex < workflowStages.length - 1 && (
            <button
              disabled={isUpdating}
              onClick={() => handleStageClick(workflowStages[currentStageIndex + 1].key)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-2 rounded-xl text-xs flex items-center justify-center space-x-2 shadow uppercase tracking-wide"
            >
              <span>Advance to Stage {currentStageIndex + 2}: {workflowStages[currentStageIndex + 1].label.split('.')[1]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Patient & Hospital Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Patient Summary & Paramedic Notes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-rose-600" />
              <span>Patient & Incident Information</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">
              {mission.patientCount} Patient(s)
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Patient Identifier</span>
                <span className="font-black text-slate-900">{mission.patientName}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Suspected Condition</span>
                <span className="font-bold text-rose-700">{mission.patientCondition}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">Pickup Location</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{mission.incidentLocation}</span>
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Paramedic Pre-Arrival Clinical Notes
              </label>
              <textarea
                rows={3}
                value={paramedicNotes}
                onChange={(e) => setParamedicNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <button
              onClick={handleSendPreArrivalReport}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow"
            >
              <Send className="w-4 h-4" />
              <span>Generate & Transmit Pre-Arrival ER Report</span>
            </button>

            {preArrivalStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{preArrivalStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Hospital Destination & Corridor */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-sky-600" />
              <span>Assigned Hospital & Route Telemetry</span>
            </h3>
            <span className="text-xs font-mono font-bold text-sky-700">
              ETA: {mission.estimatedEtaMin} Mins
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-sky-50 p-3 rounded-lg border border-sky-200">
              <span className="text-[10px] text-sky-800 font-bold block uppercase mb-1">Destination Facility</span>
              <span className="font-black text-sky-950 text-sm block">{mission.hospitalName}</span>
              <span className="text-[11px] text-sky-700 font-medium">Level 1 Trauma Center • ICU Bed Pre-Reserved</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-mono">REMAINING DISTANCE</span>
                <span className="text-xl font-black text-slate-900">{mission.totalDistanceKm} km</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-mono">CURRENT SPEED</span>
                <span className="text-xl font-black text-emerald-700">{mission.currentSpeedKmH} km/h</span>
              </div>
            </div>

            {/* Mission Timeline History */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                Recorded Mission Audit Trail
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {mission.timeline.map((ev, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{ev.title}</span>
                      <span className="block text-[10px] text-slate-500">{ev.note}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{ev.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
