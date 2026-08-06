import React, { useState } from 'react';
import { AlertCircle, X, ShieldAlert, ArrowRight, Radio } from 'lucide-react';

interface AlertBannerProps {
  disasterModeActive: boolean;
  onNavigateToIncidents: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  disasterModeActive,
  onNavigateToIncidents,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && !disasterModeActive) return null;

  return (
    <div
      className={`px-4 py-2.5 shadow-md flex items-center justify-between transition-colors border-b ${
        disasterModeActive
          ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
          : 'bg-amber-600 text-white border-amber-400'
      }`}
    >
      <div className="flex items-center space-x-3 text-xs md:text-sm">
        <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider bg-stone-900/10 px-2 py-1 rounded border border-stone-300">
          <Radio className="w-4 h-4 text-amber-100 animate-ping" />
          <span>{disasterModeActive ? 'STATEWIDE LEVEL 3 RED ALERT' : 'ACTIVE EMERGENCY BROADCAST'}</span>
        </div>

        <p className="font-medium">
          {disasterModeActive
            ? 'State Disaster Triage Directive 44-A in effect. All district hospitals instructed to clear non-emergency ICU beds and report status every 15 minutes.'
            : 'Multi-vehicle collision on Samruddhi Expressway (KM 412) - AIIMS Nagpur & GMCH Nagpur set to priority reception protocol.'}
        </p>
      </div>

      <div className="flex items-center space-x-3 text-xs">
        <button
          onClick={onNavigateToIncidents}
          className="bg-white/20 hover:bg-white/30 text-stone-900 font-bold px-3 py-1.5 rounded flex items-center space-x-1 transition-colors"
        >
          <span>View Triage Dispatch</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        {!disasterModeActive && (
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-100 hover:text-stone-900 p-1"
            title="Acknowledge Broadcast"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
