import React from 'react';
import { Clock, FileText, Download, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { DisasterTimelineEvent, DisasterIncident } from '../../types';

interface DisasterTimelineAarViewProps {
  disaster: DisasterIncident;
  timeline: DisasterTimelineEvent[];
}

export const DisasterTimelineAarView: React.FC<DisasterTimelineAarViewProps> = ({
  disaster,
  timeline,
}) => {
  const handleExportAar = () => {
    const reportText = `NATIONAL DISASTER RESPONSE — AFTER ACTION REVIEW (AAR) AUDIT REPORT
====================================================================
Incident Code: ${disaster.code}
Title: ${disaster.title}
District: ${disaster.districtName}
Severity Level: ${disaster.severity}
Status: ${disaster.status}
Declared At: ${disaster.declaredAt}
Declared By: ${disaster.declaredBy}
Estimated Casualties: ${disaster.estimatedVictims}
Triage Breakdown: RED=${disaster.triageBreakdown.red}, YELLOW=${disaster.triageBreakdown.yellow}, GREEN=${disaster.triageBreakdown.green}, BLACK=${disaster.triageBreakdown.black}

COMMAND LOG TIMELINE
--------------------------------------------------------------------
${timeline.map((tl) => `[${tl.timestamp}] [${tl.role}] ${tl.action}: ${tl.details}`).join('\n')}

====================================================================
End of Official Government Disaster Operations Log
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AAR_Audit_Report_${disaster.code}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            Command Timeline & After-Action Review (AAR) Audit Console
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Immutable operation event log tracking declarations, dispatch decisions, AI recommendations, and response time metrics.
          </p>
        </div>

        <button
          onClick={handleExportAar}
          className="bg-white hover:bg-stone-100 text-stone-900 font-extrabold text-xs px-4 py-2.5 rounded-lg shadow flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>EXPORT OFFICIAL AAR AUDIT REPORT</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-3">
          Chronological Incident Command Log ({timeline.length} Events Logged)
        </h3>

        <div className="relative border-l-2 border-stone-200 ml-4 space-y-6 pl-6 py-2">
          {timeline.map((tl) => (
            <div key={tl.id} className="relative">
              <div
                className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                  tl.level === 'CRITICAL'
                    ? 'bg-rose-600'
                    : tl.level === 'WARN'
                    ? 'bg-amber-500'
                    : tl.level === 'SUCCESS'
                    ? 'bg-emerald-500'
                    : 'bg-sky-500'
                }`}
              ></div>

              <div className="flex flex-wrap items-center justify-between font-mono text-xs text-stone-500">
                <span className="font-bold text-stone-900">{tl.timestamp}</span>
                <span className="bg-stone-100 px-2 py-0.5 rounded font-semibold text-stone-600">
                  Role: {tl.role}
                </span>
              </div>

              <div className="mt-1">
                <span className="text-xs font-black text-stone-900 block">{tl.action}</span>
                <p className="text-xs text-stone-500 leading-relaxed mt-0.5">{tl.details}</p>
                <div className="text-[10px] text-stone-500 mt-1">Author: {tl.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
