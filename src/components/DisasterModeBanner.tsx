import React from 'react';
import { AlertTriangle, Radio, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface DisasterProps {
  disasterModeActive: boolean;
  onToggle: () => void;
}

export const DisasterModeBanner: React.FC<DisasterProps> = ({ disasterModeActive, onToggle }) => {
  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-4 space-y-4">
      <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
            State Disaster Mode & Protocol Override Command
          </h2>
          <p className="text-xs text-stone-500">
            Emergency protocol override to mandate statewide ICU bed clearing, green corridors, and high-frequency hospital telemetry updates.
          </p>
        </div>

        <button
          onClick={onToggle}
          className={`px-4 py-2 font-black text-xs rounded-md border transition-all shadow-md flex items-center space-x-2 ${
            disasterModeActive
              ? 'bg-rose-600 hover:bg-rose-700 text-stone-900 border-rose-400 animate-pulse'
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>
            {disasterModeActive ? 'DEACTIVATE RED ALERT PROTOCOL' : 'ACTIVATE DISASTER RED ALERT PROTOCOL'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          className={`p-3.5 rounded-lg border text-xs ${
            disasterModeActive ? 'bg-rose-50 border-rose-200 text-rose-950 font-medium' : 'bg-cream border-stone-200'
          }`}
        >
          <div className="font-extrabold text-sm mb-1 flex items-center space-x-1">
            <Radio className="w-4 h-4 text-rose-600" />
            <span>State Directive 44-A (Bed Priority)</span>
          </div>
          <p className="text-stone-500">
            Automatically instructs all pilot district government and empanelled private hospitals to halt elective procedures and clear 20% ICU beds for incoming emergency mass casualties.
          </p>
        </div>

        <div
          className={`p-3.5 rounded-lg border text-xs ${
            disasterModeActive ? 'bg-amber-50 border-amber-200 text-amber-950 font-medium' : 'bg-cream border-stone-200'
          }`}
        >
          <div className="font-extrabold text-sm mb-1 flex items-center space-x-1">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>108 Traffic Corridor Clearance</span>
          </div>
          <p className="text-stone-500">
            Directs Maharashtra Traffic Police Control to establish automatic green corridors along Samruddhi Expressway, Mumbai-Pune Expressway, and urban arterials.
          </p>
        </div>

        <div
          className={`p-3.5 rounded-lg border text-xs ${
            disasterModeActive ? 'bg-sky-50 border-sky-300 text-sky-950 font-medium' : 'bg-cream border-stone-200'
          }`}
        >
          <div className="font-extrabold text-sm mb-1 flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            <span>High-Frequency Telemetry Sync</span>
          </div>
          <p className="text-stone-500">
            Reduces hospital telemetry ping interval from 5 minutes down to 30 seconds for real-time ventilator and oxygen stock accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};
