import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Building2,
  RefreshCw,
  BellRing,
} from 'lucide-react';
import { ResourceShortageAlert, District } from '../../types';

interface ResourceShortageAlertsViewProps {
  districts: District[];
  selectedDistrict: string;
}

export const ResourceShortageAlertsView: React.FC<ResourceShortageAlertsViewProps> = ({
  districts,
  selectedDistrict,
}) => {
  const [alerts, setAlerts] = useState<ResourceShortageAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/shortage-alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error('Failed to load shortage alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/shortage-alerts/${id}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerName: 'State Emergency Dispatcher' }),
      });
      if (res.ok) {
        fetchAlerts();
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (selectedDistrict === 'all') return true;
    return a.districtId === selectedDistrict;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-slate-900 text-white rounded-lg p-3.5 border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <BellRing className="w-4 h-4 text-rose-400" />
            Automated Resource Shortage & Capacity Stress Alert Feed
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time threshold monitoring across ICU beds, ventilator stocks, oxygen reserves, and blood banks.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alert Cards Stack */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            Fetching active resource shortage alerts...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            No active critical resource shortage alerts in selected district.
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 rounded-xl border shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                alt.acknowledged
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : alt.severity === 'CRITICAL'
                  ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                      alt.severity === 'CRITICAL'
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-amber-600 text-white border-amber-700'
                    }`}
                  >
                    {alt.severity}
                  </span>

                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-600" />
                    {alt.hospitalName} ({alt.districtName})
                  </span>
                </div>

                <h4 className="text-sm font-black">{alt.title}</h4>
                <p className="text-xs font-medium leading-relaxed opacity-90">{alt.message}</p>

                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3 pt-1">
                  <span>Logged: {new Date(alt.timestamp).toLocaleTimeString()}</span>
                  {alt.acknowledged && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Acknowledged by {alt.acknowledgedBy} at{' '}
                      {alt.acknowledgedAt ? new Date(alt.acknowledgedAt).toLocaleTimeString() : 'N/A'}
                    </span>
                  )}
                </div>
              </div>

              {!alt.acknowledged && (
                <button
                  onClick={() => handleAcknowledgeAlert(alt.id)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded shadow transition-colors flex-shrink-0"
                >
                  Acknowledge Alert
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
