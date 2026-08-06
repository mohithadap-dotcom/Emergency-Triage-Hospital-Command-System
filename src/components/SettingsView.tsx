import React from 'react';
import { Settings, Server, Database, Bell, Shield, Radio } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-700" />
          State Emergency Control Room System Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure EOC node telemetry intervals, alert threshold limits & multi-hospital sync frequencies.
        </p>
      </div>

      <div className="max-w-2xl space-y-4 text-xs">
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <Server className="w-4 h-4 text-sky-700" />
            Node Identification & Clustering
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">EOC Node Name</label>
              <input
                type="text"
                readOnly
                value="MH-SEOC-MANTRALAYA-01"
                className="w-full px-2.5 py-1.5 bg-slate-200 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Cluster Region</label>
              <input
                type="text"
                readOnly
                value="asia-south1 (Mumbai / Pune Mesh)"
                className="w-full px-2.5 py-1.5 bg-slate-200 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-amber-700" />
            Alert Threshold Configuration
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">ICU Bed Critical Warning Threshold:</span>
              <span className="font-bold font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                &lt; 10% Available
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">108 Ambulance Response Delay Warning:</span>
              <span className="font-bold font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                &gt; 15.0 Minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
