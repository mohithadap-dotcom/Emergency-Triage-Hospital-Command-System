import React from 'react';
import {
  Home,
  ShieldAlert,
  Flame,
  Building2,
  Box,
  Truck,
  BrainCircuit,
  MapPin,
  AlertTriangle,
  BarChart3,
  Users,
  Activity,
  Settings,
  Radio,
  Award,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'ops'
  | 'incidents'
  | 'hospitals'
  | 'resources'
  | 'fleet'
  | 'ai'
  | 'realtime'
  | 'gis'
  | 'disaster'
  | 'analytics'
  | 'admin'
  | 'observability'
  | 'audit'
  | 'settings';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  disasterModeActive: boolean;
  onToggleDisasterMode: () => void;
  criticalIncidentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  disasterModeActive,
  onToggleDisasterMode,
  criticalIncidentsCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ops', label: 'Emergency Operations', icon: ShieldAlert },
    { id: 'incidents', label: 'Live Incidents', icon: Flame, badge: criticalIncidentsCount },
    { id: 'hospitals', label: 'Hospital Network', icon: Building2 },
    { id: 'resources', label: 'Resource Command', icon: Box },
    { id: 'fleet', label: 'Ambulance Fleet', icon: Truck },
    { id: 'ai', label: 'AI Intelligence', icon: BrainCircuit },
    { id: 'realtime', label: 'Real-Time & IoT', icon: Radio },
    { id: 'gis', label: 'GIS Operations', icon: MapPin },
    { id: 'disaster', label: 'Disaster Command', icon: Flame, badge: disasterModeActive ? 'ACTIVE' : undefined },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Hackathon Audit & Demo', icon: Award, badge: '100%' },
    { id: 'admin', label: 'Administration', icon: Users },
    { id: 'observability', label: 'Observability', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];


  return (
    <nav className="bg-slate-800 text-slate-100 border-b border-slate-700 shadow-sm sticky top-[73px] z-40">
      <div className="px-4 flex flex-wrap items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Nav Tabs */}
        <div className="flex items-center space-x-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-600 text-white shadow font-bold'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span className="ml-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Disaster Mode Override Quick Switch */}
        <div className="py-1 flex items-center">
          <button
            onClick={onToggleDisasterMode}
            className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-black rounded-md border transition-all shadow-sm ${
              disasterModeActive
                ? 'bg-rose-600 text-white border-rose-400 animate-bounce'
                : 'bg-amber-950/80 text-amber-300 border-amber-600 hover:bg-amber-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>
              {disasterModeActive ? 'DISASTER MODE: ACTIVE (RED ALERT)' : 'DISASTER MODE: STANDBY'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
