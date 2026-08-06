import React, { useState } from 'react';
import { Play, CheckCircle2, FastForward, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AmbulanceHackathonDemoBarProps {
  onTriggerDemoStep: (stepIndex: number) => Promise<void>;
  currentActiveStep?: number;
}

export const AmbulanceHackathonDemoBar: React.FC<AmbulanceHackathonDemoBarProps> = ({
  onTriggerDemoStep,
  currentActiveStep = 0,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(currentActiveStep);
  const [stepLog, setStepLog] = useState<string>('Ready to trigger Pune Road Accident end-to-end EMS workflow demo.');

  const steps = [
    { id: 1, label: '1. Incident Reported near Pune', desc: '45-Victim accident on Pune Expressway reported to Command.' },
    { id: 2, label: '2. AI Triage & ALS-301 Dispatched', desc: 'AI assigns ALS-301. Driver Ganesh Kulkarni receives mission.' },
    { id: 3, label: '3. En-Route & Green Corridor', desc: 'Google Maps navigation active with Green Corridor clearance.' },
    { id: 4, label: '4. Arrived at Scene & IoT Vitals', desc: 'Paramedic assesses patient. Live IoT vitals stream to hospital.' },
    { id: 5, label: '5. Patient Loaded & ICU Reserved', desc: 'Ruby Hall Clinic pre-notified; Level 1 ICU Bed reserved.' },
    { id: 6, label: '6. Hospital Arrival & Handover', desc: 'Doctor receives AI Patient Summary. Handover completed.' },
  ];

  const handleRunNextStep = async (stepId: number) => {
    setIsRunning(true);
    setActiveStep(stepId);
    setStepLog(`Executing Step ${stepId}: ${steps[stepId - 1].desc}`);
    try {
      await onTriggerDemoStep(stepId);
    } catch (e) {
      console.error('Demo step error:', e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAutoPlayDemo = async () => {
    setIsRunning(true);
    for (let i = 1; i <= 6; i++) {
      setActiveStep(i);
      setStepLog(`Auto-Advancing Step ${i}/6: ${steps[i - 1].desc}`);
      await onTriggerDemoStep(i);
      await new Promise((r) => setTimeout(r, 2500));
    }
    setStepLog('✓ Hackathon End-to-End Pune Road Accident Demo Completed Successfully!');
    setIsRunning(false);
  };

  return (
    <div className="bg-white border-b-2 border-amber-500 p-3 text-stone-900">
      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Branding & Status */}
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded text-xs flex items-center gap-1.5 shadow">
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>HACKATHON DEMO MODE</span>
          </div>
          <div>
            <div className="text-xs font-extrabold text-amber-100">
              Pune Road Accident Full EMS Life-Cycle Simulation
            </div>
            <div className="text-[11px] text-stone-600 font-mono truncate max-w-md">
              {stepLog}
            </div>
          </div>
        </div>

        {/* Step Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => handleRunNextStep(s.id)}
              disabled={isRunning}
              className={`px-2.5 py-1 rounded font-bold transition flex items-center space-x-1 ${
                activeStep === s.id
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : activeStep > s.id
                  ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-stone-100 text-stone-600 hover:bg-slate-700'
              }`}
            >
              {activeStep > s.id && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              <span>{s.id}. {s.label.split('.')[1].trim()}</span>
            </button>
          ))}

          <button
            onClick={handleAutoPlayDemo}
            disabled={isRunning}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-3 py-1 rounded shadow flex items-center space-x-1 uppercase tracking-wider ml-1"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Auto Run Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
