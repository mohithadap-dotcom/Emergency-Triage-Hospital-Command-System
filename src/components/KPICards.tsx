import React from 'react';
import {
  Activity,
  AlertTriangle,
  BedDouble,
  Flame,
  Timer,
  Truck,
} from 'lucide-react';
import { EocSummaryMetrics } from '../types';

interface KPICardsProps {
  metrics: EocSummaryMetrics;
  onFilterClick?: (type: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics, onFilterClick }) => {
  const icuFreePercent =
    metrics.totalIcuBeds > 0
      ? Math.round((metrics.availableIcuBeds / metrics.totalIcuBeds) * 100)
      : 0;

  const cards = [
    {
      id: 'active_emergencies',
      title: 'Active Emergencies',
      value: metrics.activeEmergencies,
      subtitle: `${metrics.criticalIncidents} critical cases`,
      icon: Flame,
      accent: 'text-rose-700',
      bg: 'bg-rose-50',
    },
    {
      id: 'critical_incidents',
      title: 'Critical Priority',
      value: metrics.criticalIncidents,
      subtitle: 'Immediate dispatch review',
      icon: AlertTriangle,
      accent: 'text-rose-700',
      bg: 'bg-rose-50',
    },
    {
      id: 'available_icu',
      title: 'ICU Capacity',
      value: metrics.availableIcuBeds,
      subtitle: `${icuFreePercent}% free statewide`,
      icon: BedDouble,
      accent: 'text-cyan-800',
      bg: 'bg-cyan-50',
    },
    {
      id: 'available_ambulances',
      title: '108 Fleet Ready',
      value: metrics.availableAmbulances,
      subtitle: `of ${metrics.totalAmbulances} units available`,
      icon: Truck,
      accent: 'text-emerald-800',
      bg: 'bg-emerald-50',
    },
    {
      id: 'response_time',
      title: 'Avg Response',
      value: `${metrics.averageResponseTimeMin}m`,
      subtitle: 'Target under 12 minutes',
      icon: Timer,
      accent: 'text-amber-800',
      bg: 'bg-amber-50',
    },
    {
      id: 'system_health',
      title: 'System Health',
      value: `${metrics.systemHealthScore}%`,
      subtitle: `${metrics.hospitalsOnline}/${metrics.totalHospitals} hospitals live`,
      icon: Activity,
      accent: 'text-cyan-800',
      bg: 'bg-cyan-50',
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            onClick={() => onFilterClick?.(card.id)}
            className="card min-h-[132px] cursor-pointer p-4 text-left transition-colors duration-200 hover:border-cyan-200 hover:bg-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.accent}`} />
              </div>
              <span className="label text-right">{card.title}</span>
            </div>

            <div className="mt-4 font-mono text-3xl font-semibold tracking-tight text-stone-950">
              {card.value}
            </div>
            <p className="mt-2 text-sm leading-snug text-stone-500">{card.subtitle}</p>
          </button>
        );
      })}
    </section>
  );
};
