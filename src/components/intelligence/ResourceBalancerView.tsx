import React from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Award,
  Building2,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AiCommandRecommendation } from '../../types';

interface ResourceBalancerViewProps {
  recommendations: AiCommandRecommendation[];
  onAction: (recId: string, action: 'APPROVE' | 'REJECT') => void;
}

export const ResourceBalancerView: React.FC<ResourceBalancerViewProps> = ({ recommendations, onAction }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-black text-white tracking-wide">AI Operational Resource Balancer & Command Engine</h3>
            <span className="text-[10px] bg-purple-950 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-700">
              HUMAN-IN-THE-LOOP COGNITIVE ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-hospital patient diversions, ventilator reallocation, doctor sharing protocols & disaster escalation.
          </p>
        </div>

        <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-xs text-right">
          <span className="text-[10px] text-slate-400 block">Pending Command Decisions</span>
          <span className="font-extrabold text-amber-400">
            {recommendations.filter((r) => !r.approved && !r.rejected).length} Active Recommendations
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const isPending = !rec.approved && !rec.rejected;

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-lg border text-xs shadow-sm space-y-3 transition ${
                rec.approved
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : rec.rejected
                  ? 'bg-rose-50/60 border-rose-200'
                  : 'bg-white border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-slate-900 text-slate-200 px-2 py-0.5 rounded">
                      {rec.category.replace(/_/g, ' ')}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{rec.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Target Location: <strong>{rec.targetLocation}</strong></p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="bg-purple-100 text-purple-900 font-extrabold px-2.5 py-1 rounded text-[11px] border border-purple-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Confidence: {rec.confidenceScore}%
                  </span>

                  {rec.approved && (
                    <span className="bg-emerald-600 text-white font-black px-3 py-1 rounded text-[11px]">
                      APPROVED BY {rec.executedBy || 'State EOC Director'}
                    </span>
                  )}

                  {rec.rejected && (
                    <span className="bg-rose-600 text-white font-black px-3 py-1 rounded text-[11px]">REJECTED</span>
                  )}
                </div>
              </div>

              {/* Description & Reasoning */}
              <p className="text-slate-800 text-xs leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                {rec.description}
              </p>

              {/* Supporting Evidence Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Supporting Evidence</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 mt-1 space-y-0.5">
                    {rec.evidenceUsed.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Prediction Horizon</span>
                  <span className="text-xs font-black text-purple-700 mt-1 block flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    {rec.predictionHorizon}
                  </span>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Model Limitations</span>
                  <span className="text-[11px] text-slate-600 mt-1 block">{rec.limitations}</span>
                </div>
              </div>

              {/* Action Bar for Pending Recommendations */}
              {isPending && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    Human State Control Officer Verification Required
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onAction(rec.id, 'REJECT')}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded border border-rose-300 flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Reject Command</span>
                    </button>

                    <button
                      onClick={() => onAction(rec.id, 'APPROVE')}
                      className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-black rounded shadow flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Approve & Execute Command</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
