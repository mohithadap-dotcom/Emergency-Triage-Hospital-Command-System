import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  ShieldAlert,
  User,
  FileText,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { HospitalTransfer, Hospital, Incident } from '../../types';

interface InterHospitalTransferViewProps {
  hospitals: Hospital[];
  incidents: Incident[];
  selectedDistrict: string;
}

export const InterHospitalTransferView: React.FC<InterHospitalTransferViewProps> = ({
  hospitals,
  incidents,
  selectedDistrict,
}) => {
  const [transfers, setTransfers] = useState<HospitalTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [sourceHospitalId, setSourceHospitalId] = useState(hospitals[0]?.id || '');
  const [destinationHospitalId, setDestinationHospitalId] = useState(hospitals[1]?.id || '');
  const [patientName, setPatientName] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [priority, setPriority] = useState<'RED' | 'ORANGE' | 'YELLOW'>('RED');
  const [transferReason, setTransferReason] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transfers');
      if (res.ok) {
        const data = await res.json();
        setTransfers(data);
      }
    } catch (err) {
      console.error('Failed to load transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceHospitalId || !destinationHospitalId) {
      setErrorMsg('Please select valid source and destination hospitals');
      return;
    }
    if (sourceHospitalId === destinationHospitalId) {
      setErrorMsg('Source and Destination hospitals cannot be the same facility');
      return;
    }

    setCreating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceHospitalId,
          destinationHospitalId,
          patientName: patientName || 'Critical Care Patient',
          patientCondition: patientCondition || 'Requires Tertiary ICU Care',
          priority,
          requestedBy: 'State Command Dispatcher',
          transferReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Failed to create transfer request');
      } else {
        setShowNewModal(false);
        setPatientName('');
        setPatientCondition('');
        setTransferReason('');
        fetchTransfers();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error creating transfer request');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: HospitalTransfer['status']) => {
    try {
      const res = await fetch(`/api/transfers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          receivingDoctor: 'Dr. Sanjay Kulkarni (Senior Registrar)',
        }),
      });
      if (res.ok) {
        fetchTransfers();
      }
    } catch (err) {
      console.error('Failed to update transfer status:', err);
    }
  };

  const filteredTransfers = transfers.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.transferCode.toLowerCase().includes(q) ||
      t.sourceHospitalName.toLowerCase().includes(q) ||
      t.destinationHospitalName.toLowerCase().includes(q) ||
      t.patientName.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: HospitalTransfer['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-900 border-amber-200 animate-pulse font-bold';
      case 'ACCEPTED':
        return 'bg-sky-100 text-sky-400 border-sky-300 font-bold';
      case 'IN_TRANSIT':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-400 border-emerald-300 font-bold';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-400 border-rose-200 font-bold';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="bg-white text-stone-900 rounded-lg p-3.5 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-sky-400" />
            Hospital-to-Hospital Patient Transfer Coordination Engine
          </h3>
          <p className="text-[11px] text-stone-500">
            Real-time inter-hospital referral tracking, tertiary ICU acceptance approvals, and Green Corridor ambulance dispatch sync.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search transfer code, hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-stone-100 border border-stone-300 text-stone-900 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 w-full"
            />
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="bg-sky-600 hover:bg-sky-700 text-stone-900 font-extrabold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Initiate Inter-Hospital Transfer
          </button>

          <button
            onClick={fetchTransfers}
            className="p-1.5 bg-stone-100 hover:bg-slate-700 border border-stone-300 text-stone-600 rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transfers Data Table */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-extrabold text-[11px] uppercase tracking-wider">
                <th className="p-3">Transfer Code</th>
                <th className="p-3">Patient & Condition</th>
                <th className="p-3">Source Hospital</th>
                <th className="p-3">Destination Hospital</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-medium text-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500 font-mono text-xs">
                    Loading inter-hospital transfer registry...
                  </td>
                </tr>
              ) : filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500 text-xs">
                    No patient transfers currently recorded.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((t) => (
                  <tr key={t.id} className="hover:bg-cream transition-colors">
                    <td className="p-3 font-mono font-bold text-stone-900">
                      {t.transferCode}
                      <span className="block text-[10px] text-stone-500 font-normal">
                        Req: {new Date(t.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-extrabold text-stone-900">{t.patientName}</div>
                      <div className="text-[10px] text-stone-500 truncate max-w-[180px]">
                        {t.patientCondition}
                      </div>
                    </td>

                    <td className="p-3 text-stone-600 font-semibold">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span>{t.sourceHospitalName}</span>
                      </div>
                      <span className="text-[10px] text-stone-500 block">{t.requestedBy}</span>
                    </td>

                    <td className="p-3 text-stone-600 font-semibold">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{t.destinationHospitalName}</span>
                      </div>
                      <span className="text-[10px] text-stone-500 block">{t.receivingDoctor}</span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                          t.priority === 'RED'
                            ? 'bg-rose-100 text-rose-400 border-rose-200'
                            : t.priority === 'ORANGE'
                            ? 'bg-orange-100 text-orange-900 border-orange-300'
                            : 'bg-amber-100 text-amber-900 border-amber-200'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {t.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'ACCEPTED')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold px-2 py-1 rounded text-[10px] transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'REJECTED')}
                              className="bg-rose-600 hover:bg-rose-700 text-stone-900 font-bold px-2 py-1 rounded text-[10px] transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {t.status === 'ACCEPTED' && (
                          <button
                            onClick={() => handleUpdateStatus(t.id, 'IN_TRANSIT')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-stone-900 font-bold px-2 py-1 rounded text-[10px] transition-colors flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3" />
                            Dispatch Ambulance
                          </button>
                        )}

                        {t.status === 'IN_TRANSIT' && (
                          <button
                            onClick={() => handleUpdateStatus(t.id, 'COMPLETED')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold px-2 py-1 rounded text-[10px] transition-colors"
                          >
                            Mark Arrived & Admitted
                          </button>
                        )}

                        {t.status === 'COMPLETED' && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transfer Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-white/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-stone-200 shadow-lg shadow-stone-300/50 overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-sky-400" />
                Initiate Inter-Hospital Referral Request
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-stone-500 hover:text-stone-500 font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border-l-4 border-rose-600 p-2.5 text-xs text-rose-900 font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTransfer} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Source Hospital (Origin):</label>
                <select
                  value={sourceHospitalId}
                  onChange={(e) => setSourceHospitalId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded font-semibold text-stone-900"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.districtName}) — Free ICU: {h.availableIcuBeds}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Destination Hospital (Target):</label>
                <select
                  value={destinationHospitalId}
                  onChange={(e) => setDestinationHospitalId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded font-semibold text-stone-900"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.districtName}) — Free ICU: {h.availableIcuBeds}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Patient Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anil Deshpande"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Priority Level:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded font-bold"
                  >
                    <option value="RED">RED (Critical Resuscitation)</option>
                    <option value="ORANGE">ORANGE (High Urgency)</option>
                    <option value="YELLOW">YELLOW (Stable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Patient Clinical Condition:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traumatic Brain Injury requiring immediate neurosurgery"
                  value={patientCondition}
                  onChange={(e) => setPatientCondition(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Reason for Transfer:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Origin hospital ICU at 100% capacity. Specialized neurosurgeon available at destination."
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-1.5 font-bold text-stone-600 bg-stone-100 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-1.5 font-black text-stone-900 bg-sky-600 hover:bg-sky-700 rounded shadow"
                >
                  {creating ? 'Submitting...' : 'Submit Transfer Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
