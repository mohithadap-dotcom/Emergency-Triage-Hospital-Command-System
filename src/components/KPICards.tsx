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
      isCritical: false,
    },
    {
      id: 'critical_incidents',
      title: 'Critical',
      value: metrics.criticalIncidents,
      subtitle: 'Immediate Priority Triage',
      icon: AlertTriangle,
      isCritical: true,
    },
    {
      id: 'available_icu',
      title: 'ICU Beds',
      value: `${metrics.availableIcuBeds}`,
      subtitle: `of ${metrics.totalIcuBeds} — ${((metrics.availableIcuBeds / metrics.totalIcuBeds) * 100).toFixed(0)}% free`,
      icon: BedDouble,
      isCritical: false,
    },
    {
      id: 'available_ventilators',
      title: 'Ventilators',
      value: `${metrics.availableVentilators}`,
      subtitle: `of ${metrics.totalVentilators} operational`,
      icon: Wind,
      isCritical: false,
    },
    {
      id: 'available_ambulances',
      title: 'Ambulances',
      value: `${metrics.availableAmbulances}`,
      subtitle: `of ${metrics.totalAmbulances} fleet ready`,
      icon: Truck,
      isCritical: false,
    },
    {
      id: 'response_time',
      title: 'Avg Response',
      value: `${metrics.averageResponseTimeMin}m`,
      subtitle: 'Target: < 12 mins',
      icon: Timer,
      isCritical: false,
    },
    {
      id: 'hospitals_online',
      title: 'Hospitals',
      value: `${metrics.hospitalsOnline}`,
      subtitle: `of ${metrics.totalHospitals} live`,
      icon: Building2,
      isCritical: false,
    },
    {
      id: 'districts_connected',
      title: 'Districts',
      value: `${metrics.districtsConnected}`,
      subtitle: `of ${metrics.totalDistricts} connected`,
      icon: Globe2,
      isCritical: false,
    },
    {
      id: 'system_health',
      title: 'System Health',
      value: `${metrics.systemHealthScore}%`,
      subtitle: 'All services operational',
      icon: Activity,
      isCritical: false,
    },
    {
      id: 'emergency_alerts',
      title: 'Alerts',
      value: metrics.activeAlertsCount,
      subtitle: 'Broadcast directives',
      icon: BellRing,
      isCritical: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterClick && onFilterClick(card.id)}
            className={`card p-4 cursor-pointer hover:border-stone-300 transition-colors duration-200 flex flex-col justify-between ${
              card.isCritical ? 'border-rose-900/50' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="label">
                  {card.title}
                </span>
                <Icon className={`w-4 h-4 ${card.isCritical ? 'text-rose-500/70' : 'text-stone-500'}`} />
              </div>

              <div className="font-mono text-2xl font-medium text-stone-900 tracking-tight">
                {card.value}
              </div>
            </div>

            <p className="text-[11px] text-stone-500 mt-3 pt-3 border-t border-stone-200">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};
