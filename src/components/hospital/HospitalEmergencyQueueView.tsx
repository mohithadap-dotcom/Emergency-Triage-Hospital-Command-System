import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Siren,
  Ambulance,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRightLeft,
  AlertTriangle,
  UserCheck,
  BedDouble,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react';
import { Hospital, Incident, HospitalEmergencyRequest } from '../../types';

interface HospitalEmergencyQueueViewProps {
  hospital: Hospital;
  incidents: Incident[];
  onAuditLog?: (action: string, details: string) => void;
}

export const HospitalEmergencyQueueView: React.FC<HospitalEmergencyQueueViewProps> = ({
  hospital,
  incidents,
  onAuditLog,
}) => {
  // Convert incidents assigned to hospital or district into Emergency Requests
  const [requests, setRequests] = useState<HospitalEmergencyRequest[]>([
    {
      id: 'req-101',
      hospitalId: hospital.id,
      incidentId: 'inc-demo-pune',
      incidentCode: 'INC-2026-PUN-0101',
      incidentTitle: 'Multi-Vehicle Collision on Samruddhi Expressway',
      districtName: hospital.districtName,
      patientName: 'Karan Deshmukh (38M - Polytrauma)',
      priority: 'CRITICAL',
      symptoms: 'Blunt chest trauma, Hypotension (BP 84/52), Flail chest, SpO2 85%',
      triageSummary: 'RED Category. Immediate intubation & thoracostomy required en-route.',
      etaMinutes: 4,
      assignedAmbulanceRegNo: 'MH 12 QW 1108 (ALS Unit)',
      status: 'ACCEPTED',
      assignedReceivingDoctor: 'Dr. Anand Mahajan (Trauma Lead)',
      assignedBedNumber: 'ICU-CRASH-01',
      requestedAt: '10 mins ago',
      updatedAt: '2 mins ago',
    },
    {
      id: 'req-102',
      hospitalId: hospital.id,
      incidentId: 'inc-102',
      incidentCode: 'INC-2026-NGP-0042',
      incidentTitle: 'Acute Anterior Wall STEMI',
      districtName: hospital.districtName,
      patientName: 'Rameshwar Tawde (54M)',
      priority: 'HIGH',
      symptoms: 'Substernal chest pain, ST elevation V1-V4, Diaphoresis',
      triageSummary: 'ORANGE Category. Immediate Cath Lab activation recommended.',
      etaMinutes: 12,
      assignedAmbulanceRegNo: 'MH 31 AB 1088 (ALS Unit)',
      status: 'PENDING',
      requestedAt: '15 mins ago',
      updatedAt: '15 mins ago',
    },
  ]);

  // Preparation checklist state for the highlighted emergency
  const [prepChecklist, setPrepChecklist] = useState({
    traumaBayPrepped: true,
    ventilatorStandby: true,
    bloodMatched: true,
    cardiacCathLabReady: false,
    traumaSurgeonNotified: true,
  });

  const handleAction = (reqId: string, action: 'ACCEPTED' | 'REJECTED' | 'TRANSFER_REQUESTED') => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === reqId) {
          const updated = { ...r, status: action, updatedAt: 'Just now' };
          return updated;
        }
        return r;
      })
    );
    if (onAuditLog) {
      onAuditLog('EMERGENCY_ACCEPT', `Emergency request ${reqId} marked as ${action}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-rose-600 text-stone-900 p-5 rounded-2xl shadow-md border border-rose-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-extrabold uppercase bg-rose-800/80 text-rose-200 border border-rose-400 px-2.5 py-0.5 rounded-full">
            Live Emergency Queue
          </span>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Siren className="w-6 h-6 text-rose-400 animate-pulse" />
            <span>Inbound Emergency Pre-Alert & Dispatch Queue</span>
          </h2>
          <p className="text-xs text-rose-200">
            Real-time ambulance pre-arrivals with AI triage assessments and pre-admission checklists
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-rose-950/60 p-3 rounded-xl border border-rose-800/60 font-mono text-xs">
          <div>
            <span className="text-[10px] text-rose-400 block uppercase font-bold">Pending Approval</span>
            <span className="text-lg font-black text-amber-400">
              {requests.filter((r) => r.status === 'PENDING').length}
            </span>
          </div>
          <div className="border-r border-rose-800 h-8" />
          <div>
            <span className="text-[10px] text-rose-400 block uppercase font-bold">Accepted & Ready</span>
            <span className="text-lg font-black text-emerald-400">
              {requests.filter((r) => r.status === 'ACCEPTED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Requests List */}
        <div className="lg:col-span-2 space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 transition-all ${
                req.priority === 'CRITICAL' ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        req.priority === 'CRITICAL'
                          ? 'bg-rose-600 text-stone-900'
                          : req.priority === 'HIGH'
                          ? 'bg-amber-500 text-stone-900'
                          : 'bg-sky-600 text-stone-900'
                      }`}
                    >
                      {req.priority} Emergency
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-500">{req.incidentCode}</span>
                  </div>
                  <h3 className="font-extrabold text-stone-900 text-base mt-1">{req.incidentTitle}</h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    Patient: <strong className="text-stone-900">{req.patientName}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-rose-400 bg-rose-100 px-3 py-1 rounded-xl border border-rose-200 block">
                    ETA: {req.etaMinutes} MINS
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block mt-1">
                    {req.assignedAmbulanceRegNo}
                  </span>
                </div>
              </div>

              {/* Clinical Summary */}
              <div className="bg-cream p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
                <p>
                  <strong className="text-stone-600">Symptoms:</strong> {req.symptoms}
                </p>
                <p className="text-sky-900 font-semibold bg-sky-50 p-2 rounded border border-sky-200">
                  <strong>AI Triage Assessment:</strong> {req.triageSummary}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-stone-500">
                  Status: <strong className="text-stone-900">{req.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {req.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleAction(req.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-900 text-xs font-extrabold rounded-xl shadow-sm transition-all flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Emergency</span>
                      </button>

                      <button
                        onClick={() => handleAction(req.id, 'TRANSFER_REQUESTED')}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-extrabold rounded-xl shadow-sm transition-all flex items-center space-x-1"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                        <span>Divert / Transfer</span>
                      </button>
                    </>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Trauma Bay & ICU Reserved</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: ER Preparation Checklist */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
          <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <ClipboardList className="w-5 h-5 text-sky-600" />
            <span>Emergency Arrival Checklist</span>
          </h3>

          <p className="text-xs text-stone-500">
            Verify trauma bay preparation before ambulance arrival at hospital gate:
          </p>

          <div className="space-y-3 text-xs font-bold">
            <label className="flex items-center space-x-3 p-3 bg-cream rounded-xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={prepChecklist.traumaBayPrepped}
                onChange={(e) => setPrepChecklist({ ...prepChecklist, traumaBayPrepped: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-stone-800">Trauma Bay & Resuscitation Equipment Ready</span>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-cream rounded-xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={prepChecklist.ventilatorStandby}
                onChange={(e) => setPrepChecklist({ ...prepChecklist, ventilatorStandby: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-stone-800">Mechanical Ventilator Calibrated & On Standby</span>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-cream rounded-xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={prepChecklist.bloodMatched}
                onChange={(e) => setPrepChecklist({ ...prepChecklist, bloodMatched: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-stone-800">Blood Bank Pre-Alerted (O-Negative Units)</span>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-cream rounded-xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={prepChecklist.traumaSurgeonNotified}
                onChange={(e) => setPrepChecklist({ ...prepChecklist, traumaSurgeonNotified: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-stone-800">Trauma Lead & Anesthetist Standing By in ER</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
