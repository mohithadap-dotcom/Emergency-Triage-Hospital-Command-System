import React from 'react';
import {
  History,
  CheckCircle2,
  Clock,
  MapPin,
  Hospital,
  Sparkles,
  FileText,
  Search,
} from 'lucide-react';
import { AmbulanceMission } from '../../types';

interface AmbulanceMissionHistoryViewProps {
  missions: AmbulanceMission[];
}

export const AmbulanceMissionHistoryView: React.FC<AmbulanceMissionHistoryViewProps> = ({
  missions,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white text-stone-900 p-5 rounded-2xl border border-stone-200 shadow-lg shadow-stone-300/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 rounded-xl">
            <History className="w-6 h-6 text-stone-900" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-stone-900">
              Emergency Mission Log & Operational Audit Trail
            </h2>
            <p className="text-xs text-stone-600">
              Completed dispatch history, response times, outcomes, and AI decision logs
            </p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-200">
          {missions.map((m) => (
            <div key={m.id} className="p-5 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-black text-stone-900">{m.missionCode}</span>
                    <span className="bg-emerald-100 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                      {m.status}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-stone-900 mt-0.5">{m.incidentTitle}</h3>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono">
                  <div className="bg-stone-100 p-2 rounded-lg text-stone-600">
                    Distance: <strong className="text-stone-900">{m.totalDistanceKm} km</strong>
                  </div>
                  <div className="bg-stone-100 p-2 rounded-lg text-stone-600">
                    ETA: <strong className="text-stone-900">{m.estimatedEtaMin} mins</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">{m.incidentLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Hospital className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">{m.hospitalName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Dispatched: {new Date(m.dispatchTimestamp).toLocaleTimeString('en-IN')}</span>
                </div>
              </div>

              {/* AI Log Note */}
              <div className="p-3 bg-cream rounded-xl border border-stone-200 text-xs font-mono text-stone-600 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">AI Decision Log:</strong> Smart Dispatch match score 98%. Handover complete at ER Ramp. Response time 4.2 mins.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
