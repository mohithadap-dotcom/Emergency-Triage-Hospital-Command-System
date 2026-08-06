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
    { id: 'ops', label: 'Operations', icon: ShieldAlert },
    { id: 'incidents', label: 'Incidents', icon: Flame, badge: criticalIncidentsCount },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'resources', label: 'Resources', icon: Box },
    { id: 'fleet', label: 'Fleet', icon: Truck },
    { id: 'ai', label: 'AI Intelligence', icon: BrainCircuit },
    { id: 'realtime', label: 'Real-Time', icon: Radio },
    { id: 'gis', label: 'GIS', icon: MapPin },
    { id: 'disaster', label: 'Disaster', icon: Flame, badge: disasterModeActive ? 'ACTIVE' : undefined },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit', icon: Award },
    { id: 'admin', label: 'Admin', icon: Users },
    { id: 'observability', label: 'System', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-cream border-b border-stone-200 sticky top-[89px] z-40">
      <div className="px-6 md:px-8 flex items-center justify-between overflow-x-auto">
        {/* Nav Tabs */}
        <div className="flex items-center gap-0.5 py-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-3 text-xs font-medium tracking-wide transition-colors duration-200 whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'text-amber-400 border-amber-500'
                    : 'text-stone-500 border-transparent hover:text-stone-600'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500/80' : 'text-stone-500'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span className="text-[10px] font-mono text-rose-400 ml-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Disaster Mode Toggle — restrained but clear */}
        <div className="py-2 flex items-center flex-shrink-0">
          <button
            onClick={onToggleDisasterMode}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md border transition-colors duration-200 ${
              disasterModeActive
                ? 'bg-rose-950/40 text-rose-400 border-rose-200'
                : 'bg-white text-stone-500 border-stone-200 hover:text-stone-600 hover:border-stone-300'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${disasterModeActive ? 'text-rose-500' : 'text-stone-500'}`} />
            <span>
              {disasterModeActive ? 'Disaster Mode Active' : 'Disaster Mode'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
