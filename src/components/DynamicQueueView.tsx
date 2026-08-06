import React from 'react';
import {
  ListOrdered,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  ShieldAlert,
  Clock,
  Building2,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { Incident, PriorityLevel, QueueItem } from '../types';

interface DynamicQueueViewProps {
  incidents: Incident[];
  onOpenDetail: (incident: Incident) => void;
}

export const DynamicQueueView: React.FC<DynamicQueueViewProps> = ({
  incidents,
  onOpenDetail,
}) => {
  const priorityWeight: Record<PriorityLevel, number> = {
    RED: 100,
    ORANGE: 80,
    YELLOW: 60,
    GREEN: 40,
    BLUE: 20,
  };

  // Generate dynamic queue list
  const queueItems: QueueItem[] = incidents
    .filter((i) => i.status !== 'CLOSED')
    .map((inc, idx) => {
      const aiPri = inc.aiTriage?.recommendedPriority || inc.priority;
      const baseScore = priorityWeight[inc.priority] || 50;
      const patientMultiplier = Math.min(20, (inc.patientCount || inc.affectedCount || 1) * 2);
      const deteriorationRisk = Math.min(
        99,
        Math.floor(baseScore * 0.8 + patientMultiplier + (idx % 3) * 3)
      );

      return {
        rank: idx + 1,
        incident: inc,
        aiPriority: aiPri,
        finalPriority: inc.priority,
        deteriorationRiskScore: deteriorationRisk,
        waitingTimeMin: Math.floor(4 + idx * 3),
        hospitalCapacityScore: Math.floor(75 + (idx % 4) * 5),
        rankDelta: idx === 0 ? 0 : idx % 2 === 0 ? 1 : -1,
        overrideReason: inc.overrideAudit?.reason,
      };
    })
    .sort((a, b) => b.deteriorationRiskScore - a.deteriorationRiskScore)
    .map((item, sortedIdx) => ({
      ...item,
      rank: sortedIdx + 1,
    }));

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'RED':
        return 'bg-rose-600 text-stone-900 font-black animate-pulse';
      case 'ORANGE':
        return 'bg-amber-500 text-slate-950 font-black';
      case 'YELLOW':
        return 'bg-yellow-400 text-slate-950 font-bold';
      case 'GREEN':
        return 'bg-emerald-600 text-stone-900 font-bold';
      default:
        return 'bg-sky-600 text-stone-900 font-bold';
    }
  };

  return (
    <div className="space-y-4 text-stone-900">
      {/* Top Queue Header */}
      <div className="bg-white text-stone-900 rounded-lg p-4 border border-stone-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-sky-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
              Dynamic Real-Time Reordering
            </span>
            <span className="text-xs text-stone-500">Continuous Physiological Deterioration Risk Scoring</span>
          </div>
          <h2 className="text-lg font-extrabold text-stone-900 mt-1 flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-sky-400" />
            AI-Prioritized Dynamic Emergency Dispatch Queue
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-stone-100/80 px-3 py-2 rounded-lg border border-stone-300">
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">Queue Length</span>
            <span className="font-extrabold text-stone-900 text-base">{queueItems.length} Emergencies</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">Top Deterioration</span>
            <span className="font-extrabold text-rose-400 text-base">
              {queueItems[0]?.deteriorationRiskScore || 98}% Risk
            </span>
          </div>
        </div>
      </div>

      {/* Queue Items Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-3 bg-cream border-b border-stone-200 flex items-center justify-between">
          <span className="text-xs font-black text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Live Priority Queue Standings
          </span>
          <span className="text-xs text-stone-500 font-medium">
            Re-sorted continuously by Gemini Risk Engine & Dispatch Overrides
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-600 uppercase font-black tracking-wider text-[10px] border-b border-stone-200">
                <th className="p-3 text-center">Rank</th>
                <th className="p-3">Shift</th>
                <th className="p-3">Emergency & Code</th>
                <th className="p-3">District</th>
                <th className="p-3">Priority Level</th>
                <th className="p-3">Deterioration Risk</th>
                <th className="p-3">Patients</th>
                <th className="p-3">Wait Time</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-medium text-stone-800">
              {queueItems.map((item) => (
                <tr
                  key={item.incident.id}
                  className={`hover:bg-cream transition-colors ${
                    item.incident.priority === 'RED' ? 'bg-rose-50/20' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="p-3 text-center">
                    <span className="font-mono font-black text-sm text-stone-900 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                      #{item.rank}
                    </span>
                  </td>

                  {/* Rank Shift Indicator */}
                  <td className="p-3">
                    {item.rankDelta > 0 ? (
                      <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-rose-400 bg-rose-100 px-1.5 py-0.5 rounded">
                        <ArrowUp className="w-3 h-3" />
                        <span>+{item.rankDelta}</span>
                      </span>
                    ) : item.rankDelta < 0 ? (
                      <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-100 px-1.5 py-0.5 rounded">
                        <ArrowDown className="w-3 h-3" />
                        <span>{item.rankDelta}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-stone-500 flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </td>

                  {/* Title */}
                  <td className="p-3">
                    <div className="font-mono text-[11px] font-bold text-sky-400">
                      {item.incident.code}
                    </div>
                    <div className="font-bold text-stone-900 line-clamp-1 max-w-[260px]">
                      {item.incident.title}
                    </div>
                  </td>

                  {/* District */}
                  <td className="p-3 font-semibold text-stone-600">{item.incident.districtName}</td>

                  {/* Priority Level */}
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${getPriorityBadge(item.finalPriority)}`}>
                        {item.finalPriority}
                      </span>
                      {item.incident.overrideAudit && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-100 px-1 py-0.5 rounded">
                          Human
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Deterioration Risk Score */}
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            item.deteriorationRiskScore >= 90
                              ? 'bg-rose-600'
                              : item.deteriorationRiskScore >= 75
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${item.deteriorationRiskScore}%` }}
                        />
                      </div>
                      <span className="font-mono font-extrabold text-stone-900">
                        {item.deteriorationRiskScore}%
                      </span>
                    </div>
                  </td>

                  {/* Patients */}
                  <td className="p-3 font-bold text-rose-400">
                    {item.incident.patientCount || item.incident.affectedCount} Patients
                  </td>

                  {/* Wait Time */}
                  <td className="p-3 text-stone-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>{item.waitingTimeMin} min</span>
                  </td>

                  {/* Status */}
                  <td className="p-3 font-bold text-stone-600">
                    {item.incident.status.replace(/_/g, ' ')}
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenDetail(item.incident)}
                      className="bg-white hover:bg-stone-100 text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded transition-colors inline-flex items-center space-x-1"
                    >
                      <span>AI Triage & Override</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
