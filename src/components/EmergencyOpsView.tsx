import React from 'react';
import { ShieldAlert, Truck, Building2, Flame, AlertTriangle, PhoneCall, Radio, Send } from 'lucide-react';
import { District, Hospital, Incident } from '../types';

interface OpsProps {
  districts: District[];
  hospitals: Hospital[];
  incidents: Incident[];
  onNavigateToIncidents: () => void;
}

export const EmergencyOpsView: React.FC<OpsProps> = ({
  districts,
  hospitals,
  incidents,
  onNavigateToIncidents,
}) => {
  const criticalIncidents = incidents.filter((i) => i.severity === 'CRITICAL');

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-4 space-y-4">
      <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
            Emergency Operations Console & Tactical Command
          </h2>
          <p className="text-xs text-stone-500">
            Direct dispatch room for state emergency directors to issue priority medical reception protocols.
          </p>
        </div>

        <button
          onClick={onNavigateToIncidents}
          className="bg-rose-600 hover:bg-rose-700 text-stone-900 font-bold text-xs px-3 py-1.5 rounded flex items-center space-x-1 shadow"
        >
          <span>Open Live Incident Stream ({incidents.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
        {/* Critical Incidents Desk */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-rose-600" />
            Priority Critical Incidents Requiring State Dispatch
          </h3>

          <div className="space-y-2">
            {criticalIncidents.map((inc) => (
              <div key={inc.id} className="bg-rose-50/60 border border-rose-200 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs bg-rose-700 text-stone-900 px-2 py-0.5 rounded">
                    {inc.code}
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded border border-rose-200">
                    {inc.districtName} District
                  </span>
                </div>

                <h4 className="font-bold text-stone-900 text-sm">{inc.title}</h4>
                <p className="text-stone-500 text-xs">{inc.notes}</p>

                <div className="flex items-center justify-between pt-1 border-t border-rose-200">
                  <span className="font-bold text-rose-400">
                    Receiving Hospital: {inc.assignedHospitalName || 'AIIMS Nagpur'}
                  </span>
                  <span className="font-bold text-blue-400">{inc.assignedAmbulances} MEMS 108 Squads En Route</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Directive Box */}
        <div className="bg-white text-stone-900 p-4 rounded-lg border border-stone-200 space-y-3">
          <h3 className="font-bold text-amber-400 text-sm flex items-center gap-1.5 uppercase">
            <Radio className="w-4 h-4 text-amber-400" />
            Issue State Dispatch Directive
          </h3>

          <p className="text-stone-600 text-xs">
            Send high-priority broadcast directive to District Control Rooms (DEOC) & 108 Fleet Coordinators.
          </p>

          <div className="space-y-2">
            <label className="block text-stone-500 font-bold">Target District Scope</label>
            <select className="w-full bg-stone-100 border border-stone-300 rounded p-1.5 font-bold text-stone-900">
              <option value="all">Statewide Broadcast (All 7 Pilot Districts)</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <label className="block text-stone-500 font-bold mt-2">Directive Message</label>
            <textarea
              rows={3}
              placeholder="e.g. Hold 5 ICU beds at KEM Hospital Mumbai for Trombay Chemical Plant burn victims."
              className="w-full bg-stone-100 border border-stone-300 rounded p-2 text-stone-900 font-medium"
            />

            <button
              onClick={() => alert('Statewide emergency directive dispatched to DEOC consoles.')}
              className="w-full bg-rose-600 hover:bg-rose-700 text-stone-900 font-bold py-2 rounded flex items-center justify-center space-x-1.5 transition-colors shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Emergency Directive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
