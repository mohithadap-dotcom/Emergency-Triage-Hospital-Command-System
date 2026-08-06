import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Activity,
  Building2,
  Clock,
  UserCheck,
  ChevronDown,
  Check,
  Server,
} from 'lucide-react';
import { UserProfile, District } from '../types';

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
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeDistrictObj = districts.find((d) => d.id === selectedDistrict);

  return (
    <header className="bg-cream border-b border-stone-200 sticky top-0 z-50">
      {/* Top Government Banner — quiet, dignified */}
      <div className="px-6 md:px-8 py-2 border-b border-stone-200 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-stone-500">
            <div className="w-4 h-4 rounded-full bg-amber-500/80 text-slate-950 flex items-center font-bold justify-center text-[8px]">
              MH
            </div>
            <span>महाराष्ट्र शासन</span>
            <span className="text-stone-600">·</span>
            <span>Government of Maharashtra</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Server className="w-3 h-3" />
            <span>SEOC Node #01</span>
          </div>
          <span className="text-stone-800">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-500/60" />
            <span>{timeStr || '—'}</span>
          </div>
        </div>
      </div>

      {/* Main Header — typography-led */}
      <div className="px-6 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Branding */}
        <div className="flex items-center gap-4">
          <div className="bg-white border border-stone-200 p-2.5 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-amber-500/80" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight text-stone-900">
              Rakshak AI
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 tracking-wide">
              Emergency Response & Multi-Hospital Coordination
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Multi-Portal Switcher */}
          {onSwitchPortal && (
            <div className="flex items-center bg-white border border-stone-200 p-0.5 rounded-md text-xs">
              <button
                onClick={() => onSwitchPortal('GOVERNMENT')}
                className={`px-3 py-1.5 rounded font-medium transition-all duration-200 ${
                  activePortal === 'GOVERNMENT'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-stone-500 hover:text-stone-600 border border-transparent'
                }`}
              >
                Government EOC
              </button>

              <button
                onClick={() => onSwitchPortal('HOSPITAL')}
                className={`px-3 py-1.5 rounded font-medium transition-all duration-200 ${
                  activePortal === 'HOSPITAL'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-stone-500 hover:text-stone-600 border border-transparent'
                }`}
              >
                Hospital Portal
              </button>
            </div>
          )}

          {/* District Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
                setIsUserDropdownOpen(false);
              }}
              className="bg-white border border-stone-200 hover:border-stone-300 text-stone-600 text-xs font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <Building2 className="w-3.5 h-3.5 text-stone-500" />
              <span>
                {selectedDistrict === 'all'
                  ? 'All Districts'
                  : activeDistrictObj?.name || selectedDistrict}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {isDistrictDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-lg py-1 z-50 shadow-lg shadow-stone-300/40">
                <div className="label px-4 py-2 border-b border-stone-200">
                  Select Scope
                </div>
                <button
                  onClick={() => {
                    onSelectDistrict('all');
                    setIsDistrictDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors duration-150 hover:bg-stone-100/50 ${
                    selectedDistrict === 'all' ? 'text-amber-400' : 'text-stone-500'
                  }`}
                >
                  <span>All Pilot Districts</span>
                  {selectedDistrict === 'all' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
                <div className="border-t border-stone-200 my-0.5"></div>
                {districts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDistrict(d.id);
                      setIsDistrictDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors duration-150 hover:bg-stone-100/50 ${
                      selectedDistrict === d.id ? 'text-amber-400' : 'text-stone-500'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-stone-600">{d.name}</span>
                      <span className="text-stone-500 ml-2">{d.marathiName}</span>
                    </div>
                    {selectedDistrict === d.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserDropdownOpen(!isUserDropdownOpen);
                setIsDistrictDropdownOpen(false);
              }}
              className="bg-white border border-stone-200 hover:border-stone-300 text-stone-600 text-xs font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-500/60" />
              <div className="text-left">
                <div className="font-medium leading-tight text-stone-800">{currentUser.name}</div>
                <div className="text-[10px] text-stone-500 font-mono">{currentUser.roleTitle}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-lg py-1 z-50 shadow-lg shadow-stone-300/40">
                <div className="label px-4 py-2 border-b border-stone-200">
                  Switch Role Profile
                </div>
                {userProfiles.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      setIsUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 transition-colors duration-150 hover:bg-stone-100/50 ${
                      currentUser.id === user.id ? 'border-l-2 border-amber-500 bg-stone-100/30' : 'border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-stone-800">{user.name}</span>
                      <span className="text-[10px] text-stone-500 font-mono">{user.role}</span>
                    </div>
                    <div className="text-xs text-amber-500/60 mt-0.5">{user.roleTitle}</div>
                    <div className="text-[10px] text-stone-500 truncate mt-0.5">{user.organization}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* System Health — quiet indicator */}
          <div className="bg-white border border-stone-200 text-xs px-3 py-2 rounded-md flex items-center gap-2 font-mono text-stone-500">
            <Activity className="w-3.5 h-3.5 text-emerald-500/60" />
            <span>{systemHealthScore}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
