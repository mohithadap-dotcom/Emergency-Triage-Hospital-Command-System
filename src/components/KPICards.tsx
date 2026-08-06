import React from 'react';
import {
  Flame,
  AlertTriangle,
  BedDouble,
  Wind,
  Truck,
  Timer,
  Building2,
  Globe2,
  Activity,
  BellRing,
} from 'lucide-react';
import { EocSummaryMetrics } from '../types';

interface KPICardsProps {
  metrics: EocSummaryMetrics;
  onFilterClick?: (type: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics, onFilterClick }) => {
  const cards = [
    {
      id: 'active_emergencies',
      title: 'Active Emergencies',
      value: metrics.activeEmergencies,
      subtitle: 'Across 7 Pilot Districts',
      icon: Flame,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-200',
      badge: '+4 in last hr',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'critical_incidents',
      title: 'Critical Incidents',
      value: metrics.criticalIncidents,
      subtitle: 'Immediate Priority Triage',
      icon: AlertTriangle,
      color: 'text-rose-700',
      bgColor: 'bg-rose-100/60 border-rose-300',
      badge: 'RED ALERT',
      badgeColor: 'bg-rose-600 text-white font-bold animate-pulse',
    },
    {
      id: 'available_icu',
      title: 'Available ICU Beds',
      value: `${metrics.availableIcuBeds} / ${metrics.totalIcuBeds}`,
      subtitle: `${((metrics.availableIcuBeds / metrics.totalIcuBeds) * 100).toFixed(1)}% Available Capacity`,
      icon: BedDouble,
      color: 'text-sky-700',
      bgColor: 'bg-sky-50 border-sky-200',
      badge: '9.7% Free',
      badgeColor: metrics.availableIcuBeds < 300 ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800',
    },
    {
      id: 'available_ventilators',
      title: 'Available Ventilators',
      value: `${metrics.availableVentilators} / ${metrics.totalVentilators}`,
      subtitle: `${((metrics.availableVentilators / metrics.totalVentilators) * 100).toFixed(1)}% Operational Ready`,
      icon: Wind,
      color: 'text-teal-700',
      bgColor: 'bg-teal-50 border-teal-200',
      badge: 'Ready',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'available_ambulances',
      title: 'Available Ambulances',
      value: `${metrics.availableAmbulances} / ${metrics.totalAmbulances}`,
      subtitle: '108 Fleet Units Ready',
      icon: Truck,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      badge: '32% Idle',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'response_time',
      title: 'Avg Response Time',
      value: `${metrics.averageResponseTimeMin} mins`,
      subtitle: 'Target: < 12.0 mins',
      icon: Timer,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
      badge: '-1.4 min vs avg',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'hospitals_online',
      title: 'Hospitals Online',
      value: `${metrics.hospitalsOnline} / ${metrics.totalHospitals}`,
      subtitle: 'Live Telemetry Synced',
      icon: Building2,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50 border-indigo-200',
      badge: '96.5% Live',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'districts_connected',
      title: 'Districts Connected',
      value: `${metrics.districtsConnected} / ${metrics.totalDistricts}`,
      subtitle: 'Pilot Node Network',
      icon: Globe2,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100 border-slate-300',
      badge: '100% Mesh',
      badgeColor: 'bg-slate-200 text-slate-800 font-mono',
    },
    {
      id: 'system_health',
      title: 'System Health',
      value: `${metrics.systemHealthScore}%`,
      subtitle: 'Postgres & Redis Online',
      icon: Activity,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
      badge: 'OPTIMAL',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    },
    {
      id: 'emergency_alerts',
      title: 'Emergency Alerts',
      value: metrics.activeAlertsCount,
      subtitle: 'Broadcast Directives',
      icon: BellRing,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200',
      badge: 'State Directives',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterClick && onFilterClick(card.id)}
            className={`${card.bgColor} p-3 rounded-lg border shadow-sm transition-all hover:shadow-md cursor-pointer flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 tracking-tight uppercase">
                  {card.title}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className={`text-xl font-extrabold tracking-tight text-slate-900 font-mono`}>
                  {card.value}
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-medium mt-2 border-t border-black/5 pt-1">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};
