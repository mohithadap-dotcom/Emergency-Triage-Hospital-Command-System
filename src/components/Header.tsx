import React, { useEffect, useState } from 'react';
import {
  Activity,
  Ambulance,
  Building2,
  Check,
  ChevronDown,
  Clock,
  Server,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { District, UserProfile } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  userProfiles: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  districts: District[];
  systemHealthScore: number;
  activePortal?: 'GOVERNMENT' | 'HOSPITAL' | 'AMBULANCE' | 'DOCTOR_WORKSPACE';
  onSwitchPortal?: (portal: 'GOVERNMENT' | 'HOSPITAL' | 'AMBULANCE' | 'DOCTOR_WORKSPACE') => void;
}

type PortalOption = {
  id: 'GOVERNMENT' | 'HOSPITAL' | 'AMBULANCE';
  label: string;
  icon: React.FC<{ className?: string }>;
};

const PORTAL_OPTIONS: PortalOption[] = [
  { id: 'GOVERNMENT', label: 'Gov EOC', icon: ShieldAlert },
  { id: 'HOSPITAL', label: 'Hospital', icon: Building2 },
  { id: 'AMBULANCE', label: 'Ambulance', icon: Ambulance },
];

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  userProfiles,
  onSelectUser,
  selectedDistrict,
  onSelectDistrict,
  districts,
  systemHealthScore,
  activePortal = 'GOVERNMENT',
  onSwitchPortal,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        `${now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })} IST`,
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeDistrictObj = districts.find((d) => d.id === selectedDistrict);
  const portalButtonClass = (portal: PortalOption['id']) =>
    activePortal === portal
      ? 'bg-cyan-700 text-white shadow-sm'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950';

  return (
    <header className="border-b border-stone-200/80 bg-[#F5F2ED]">
      <div className="w-full px-3 py-3 sm:px-4 md:px-5 xl:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-700 text-[9px] font-black text-white">
                  MH
                </span>
                Maharashtra Shasan
              </span>
              <span className="hidden h-3 w-px bg-stone-300 sm:block" />
              <span className="inline-flex items-center gap-1.5 font-mono normal-case tracking-normal">
                <Server className="h-3.5 w-3.5 text-cyan-700" />
                SEOC Node 01
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono normal-case tracking-normal">
                <Clock className="h-3.5 w-3.5 text-stone-500" />
                {timeStr || 'Syncing'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white">
                <ShieldAlert className="h-6 w-6 text-cyan-700" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-extrabold tracking-tight text-stone-950 md:text-3xl">
                  Rakshak AI
                </h1>
                <p className="mt-0.5 max-w-2xl text-sm text-stone-600">
                  Maharashtra emergency command, hospital capacity, and 108 dispatch coordination.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {onSwitchPortal && (
              <div className="flex items-center rounded-lg border border-stone-200 bg-white p-1 text-xs font-semibold">
                {PORTAL_OPTIONS.map((portal) => {
                  const Icon = portal.icon;
                  return (
                    <button
                      key={portal.id}
                      onClick={() => onSwitchPortal(portal.id)}
                      className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-md px-3 transition-colors duration-200 ${portalButtonClass(
                        portal.id,
                      )}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{portal.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => {
                  setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
                  setIsUserDropdownOpen(false);
                }}
                aria-expanded={isDistrictDropdownOpen}
                className="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 transition-colors duration-200 hover:border-cyan-300 hover:text-stone-950"
              >
                <Building2 className="h-4 w-4 text-cyan-700" />
                <span>
                  {selectedDistrict === 'all'
                    ? 'All Districts'
                    : activeDistrictObj?.name || selectedDistrict}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
              </button>

              {isDistrictDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg shadow-stone-300/30">
                  <div className="label border-b border-stone-200 px-4 py-3">Command Scope</div>
                  <button
                    onClick={() => {
                      onSelectDistrict('all');
                      setIsDistrictDropdownOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-stone-50 ${
                      selectedDistrict === 'all' ? 'text-cyan-700' : 'text-stone-700'
                    }`}
                  >
                    <span>All Pilot Districts</span>
                    {selectedDistrict === 'all' && <Check className="h-4 w-4" />}
                  </button>
                  {districts.map((district) => (
                    <button
                      key={district.id}
                      onClick={() => {
                        onSelectDistrict(district.id);
                        setIsDistrictDropdownOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-stone-50 ${
                        selectedDistrict === district.id ? 'text-cyan-700' : 'text-stone-700'
                      }`}
                    >
                      <span className="font-medium">{district.name}</span>
                      <span className="ml-3 font-mono text-xs text-stone-500">{district.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                  setIsDistrictDropdownOpen(false);
                }}
                aria-expanded={isUserDropdownOpen}
                className="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-left transition-colors duration-200 hover:border-cyan-300"
              >
                <UserCheck className="h-4 w-4 text-cyan-700" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold leading-tight text-stone-900">
                    {currentUser.name}
                  </span>
                  <span className="block truncate text-[11px] text-stone-500">
                    {currentUser.roleTitle}
                  </span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg shadow-stone-300/30">
                  <div className="label border-b border-stone-200 px-4 py-3">Role Profile</div>
                  {userProfiles.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSelectUser(user);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full cursor-pointer border-l-2 px-4 py-3 text-left transition-colors duration-150 hover:bg-stone-50 ${
                        currentUser.id === user.id
                          ? 'border-cyan-700 bg-cyan-50/70'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-stone-900">{user.name}</span>
                        <span className="font-mono text-[11px] text-stone-500">{user.role}</span>
                      </div>
                      <div className="mt-1 text-xs font-medium text-cyan-700">{user.roleTitle}</div>
                      <div className="mt-0.5 truncate text-[11px] text-stone-500">{user.organization}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-11 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-800">
              <Activity className="h-4 w-4" />
              <span className="font-mono">{systemHealthScore}%</span>
              <span className="hidden text-xs font-medium text-emerald-700 sm:inline">System</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
