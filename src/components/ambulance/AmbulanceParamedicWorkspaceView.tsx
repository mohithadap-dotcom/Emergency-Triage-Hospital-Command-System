import React, { useState } from 'react';
import {
  UserCheck,
  FileText,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Shield,
  Pill,
  Hospital,
  Sparkles,
} from 'lucide-react';
import { AmbulanceMission } from '../../types';

interface AmbulanceParamedicWorkspaceViewProps {
  mission: AmbulanceMission | null;
}

export const AmbulanceParamedicWorkspaceView: React.FC<AmbulanceParamedicWorkspaceViewProps> = ({
  mission,
}) => {
  const [treatments, setTreatments] = useState<string[]>([
    'High-Flow Oxygen Mask (12 L/min)',
    '18G IV Cannula inserted (Left Forearm)',
    'Normal Saline 500ml Bolus IV Infusion',
    'Cervical Collar & Rigid Spine Board Immobilization',
    'Pressure Bandage applied to right thigh fracture site',
  ]);
  const [newTreatmentInput, setNewTreatmentInput] = useState('');
  const [paramedicNotes, setParamedicNotes] = useState(
    'Patient remains conscious but in severe acute pain (Pain Score 8/10). Capillary refill time 3s. Heart rate stable on IV fluids.'
  );
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
  ]);
  const [patientStatusTag, setPatientStatusTag] = useState<'RED_CRITICAL' | 'YELLOW_STABLE' | 'GREEN_MINOR'>('RED_CRITICAL');
  const [hospitalNotified, setHospitalNotified] = useState(false);
  const [resourceRequested, setResourceRequested] = useState('');

  const handleAddTreatment = () => {
    if (!newTreatmentInput.trim()) return;
    setTreatments([...treatments, newTreatmentInput.trim()]);
    setNewTreatmentInput('');
  };

  const handleSimulatePhotoUpload = () => {
    setAttachedPhotos([
      ...attachedPhotos,
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
    ]);
  };

  const handleNotifyHospital = () => {
    setHospitalNotified(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white text-stone-900 p-5 rounded-2xl border-2 border-emerald-500/80 shadow-lg shadow-stone-300/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 rounded-xl">
            <UserCheck className="w-6 h-6 text-stone-900" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-stone-900">
              Advanced Paramedic Clinical Workspace
            </h2>
            <p className="text-xs text-stone-600">
              Paramedic Nitin Somkuwar (ALS Unit #108) • Incident: {mission?.incidentCode || 'INC-2026-089'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleNotifyHospital}
            className="bg-sky-600 hover:bg-sky-500 text-stone-900 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow"
          >
            <Hospital className="w-4 h-4" />
            <span>Notify ER & Pre-Alert Trauma Bay</span>
          </button>
        </div>
      </div>

      {hospitalNotified && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>✓ Receiving ER at {mission?.hospitalName || 'AIIMS Nagpur'} notified. Trauma resuscitation bay pre-alerted with live pre-arrival report.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Treatment Checklist & Administration */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Administered Clinical Treatments</span>
            </h3>
            <span className="text-xs font-mono font-bold text-stone-500">
              {treatments.length} Logged
            </span>
          </div>

          <div className="space-y-2">
            {treatments.map((tr, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2.5 bg-cream rounded-lg border border-stone-200 text-xs text-stone-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tr}</span>
              </div>
            ))}
          </div>

          {/* Add Treatment Input */}
          <div className="pt-2 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Record new medication or intervention (e.g. IV Fentanyl 50mcg)..."
              value={newTreatmentInput}
              onChange={(e) => setNewTreatmentInput(e.target.value)}
              className="flex-1 bg-cream border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-500 font-medium"
            />
            <button
              onClick={handleAddTreatment}
              className="bg-emerald-600 hover:bg-emerald-500 text-stone-900 font-bold px-3 py-2 rounded-lg text-xs flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Right: Notes, Photos & Special Resource Requests */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Clinical Observations & Attachments</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Triage Tag: {patientStatusTag}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-500 font-bold mb-1">
                Paramedic Clinical Summary Notes
              </label>
              <textarea
                rows={3}
                value={paramedicNotes}
                onChange={(e) => setParamedicNotes(e.target.value)}
                className="w-full bg-cream border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 font-medium"
              />
            </div>

            {/* Photo Attachments (Simulated) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-stone-500 font-bold">ECG Strip / Trauma Site Photos</label>
                <button
                  onClick={handleSimulatePhotoUpload}
                  className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Attach Image</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 overflow-x-auto">
                {attachedPhotos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Clinical attachment"
                    className="w-20 h-20 object-cover rounded-lg border border-stone-200 shadow-sm"
                  />
                ))}
              </div>
            </div>

            {/* Request Additional Resources */}
            <div className="pt-2 border-t border-stone-200 space-y-2">
              <label className="block text-stone-500 font-bold">
                Request Additional Resources (Air Ambulance / Specialized Blood)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g., Request 2 Units O-Negative Blood at ER Ramp..."
                  value={resourceRequested}
                  onChange={(e) => setResourceRequested(e.target.value)}
                  className="flex-1 bg-cream border border-stone-200 rounded-lg px-3 py-2 text-xs"
                />
                <button
                  onClick={() => {
                    alert(`Resource request transmitted to Command Center & ${mission?.hospitalName || 'Hospital'}`);
                    setResourceRequested('');
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs"
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
