import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  Clock,
  Key,
} from 'lucide-react';
import { Hospital, HospitalAuditLog } from '../../types';

interface HospitalAuditLogViewProps {
  hospital: Hospital;
  auditLogs: HospitalAuditLog[];
}

export const HospitalAuditLogView: React.FC<HospitalAuditLogViewProps> = ({ hospital, auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (categoryFilter !== 'ALL' && log.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.performedBy.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-sky-600" />
              <span>Hospital Real-Time Operational Audit Trail</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable logs for logins, bed allocations, emergency acceptances, equipment shifts & resource updates
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="ALL">All Categories</option>
              <option value="BED_MANAGEMENT">Bed Management</option>
              <option value="RESOURCE_UPDATE">Resource Updates</option>
              <option value="EMERGENCY_ACCEPT">Emergency Acceptances</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="STAFF">Staff</option>
              <option value="AI_ASSISTANT">AI Assistant</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-medium">
              No audit records match the selected filters.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      {log.category}
                    </span>
                    <strong className="text-slate-900 font-bold">{log.action}</strong>
                  </div>
                  <p className="text-slate-600 font-medium">{log.details}</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <span className="text-slate-700 font-bold block">{log.performedBy} ({log.userRole})</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
