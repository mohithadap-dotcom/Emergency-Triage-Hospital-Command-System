import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Box,
  BrainCircuit,
  Building2,
  ChevronDown,
  Flame,
  Home,
  MapPin,
  MoreHorizontal,
  Radio,
  Settings,
  ShieldAlert,
  Truck,
  Users,
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

type NavItem = {
  id: NavTab;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number | string;
};

const PRIMARY_NAV: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'ops', label: 'Operations', icon: ShieldAlert },
  { id: 'incidents', label: 'Incidents', icon: Flame },
  { id: 'gis', label: 'GIS', icon: MapPin },
  { id: 'fleet', label: 'Fleet', icon: Truck },
  { id: 'hospitals', label: 'Hospitals', icon: Building2 },
  { id: 'ai', label: 'AI', icon: BrainCircuit },
];

const SECONDARY_NAV: NavItem[] = [
  { id: 'resources', label: 'Resources', icon: Box },
  { id: 'realtime', label: 'Real-Time Network', icon: Radio },
  { id: 'disaster', label: 'Disaster Command', icon: Flame },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'audit', label: 'Compliance Audit', icon: Award },
  { id: 'admin', label: 'Administration', icon: Users },
  { id: 'observability', label: 'System Observability', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  disasterModeActive,
  onToggleDisasterMode,
  criticalIncidentsCount,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const navItems = PRIMARY_NAV.map((item) =>
    item.id === 'incidents' ? { ...item, badge: criticalIncidentsCount } : item,
  );
  const moreItems = SECONDARY_NAV.map((item) =>
    item.id === 'disaster' && disasterModeActive ? { ...item, badge: 'ACTIVE' } : item,
  );
  const isMoreActive = moreItems.some((item) => item.id === activeTab);

  const showBadge = (badge: NavItem['badge']) =>
    typeof badge === 'number' ? badge > 0 : Boolean(badge);

  const handleTabChange = (tab: NavTab) => {
    onTabChange(tab);
    setIsMoreOpen(false);
  };

  const renderNavButton = (item: NavItem, compact = false) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => handleTabChange(item.id)}
        className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors duration-200 ${
          compact ? 'h-10 w-full justify-between' : 'h-10'
        } ${
          isActive
            ? 'bg-cyan-700 text-white shadow-sm'
            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.label}</span>
        </span>
        {showBadge(item.badge) && (
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
              isActive ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/85 backdrop-blur">
      <div className="flex w-full flex-col gap-2 px-3 py-2 sm:px-4 md:flex-row md:items-center md:justify-between md:px-5 xl:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 gap-1 overflow-x-auto">
            {navItems.map((item) => renderNavButton(item))}
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              aria-expanded={isMoreOpen}
              className={`flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors duration-200 ${
                isMoreActive
                  ? 'bg-cyan-50 text-cyan-800'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
              }`}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span>More</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-lg border border-stone-200 bg-white p-2 shadow-lg shadow-stone-300/30">
                {moreItems.map((item) => renderNavButton(item, true))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onToggleDisasterMode}
          className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors duration-200 ${
            disasterModeActive
              ? 'border-rose-300 bg-rose-600 text-white'
              : 'border-stone-200 bg-white text-stone-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>{disasterModeActive ? 'Disaster Active' : 'Disaster Mode'}</span>
        </button>
      </div>
    </nav>
  );
};
