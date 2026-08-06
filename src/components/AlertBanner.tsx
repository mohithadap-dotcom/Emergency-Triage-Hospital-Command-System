import React, { useState } from 'react';
import { ArrowRight, Radio, X } from 'lucide-react';

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
      className={`border-b ${
        disasterModeActive
          ? 'border-rose-200 bg-rose-50 text-rose-950'
          : 'border-stone-200/80 bg-white/65 text-stone-800'
      }`}
    >
      <div className="flex w-full flex-col gap-3 px-3 py-3 sm:px-4 md:flex-row md:items-center md:justify-between md:px-5 xl:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              disasterModeActive ? 'bg-rose-600 text-white' : 'bg-amber-50 text-amber-700'
            }`}
          >
            <Radio className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider">
              {disasterModeActive ? 'Statewide Level 3 Red Alert' : 'Active Emergency Broadcast'}
            </div>
            <p className="mt-0.5 text-sm leading-snug text-stone-700">
              {disasterModeActive
                ? 'Directive 44-A is active. District hospitals should clear non-emergency ICU beds and report status every 15 minutes.'
                : 'Multi-vehicle collision on Samruddhi Expressway KM 412. AIIMS Nagpur and GMCH Nagpur are on priority reception protocol.'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onNavigateToIncidents}
            className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-800 transition-colors duration-200 hover:border-cyan-300 hover:text-cyan-800"
          >
            <span>Open Triage</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          {!disasterModeActive && (
            <button
              onClick={() => setDismissed(true)}
              aria-label="Acknowledge broadcast"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-stone-500 transition-colors duration-200 hover:bg-stone-100 hover:text-stone-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
