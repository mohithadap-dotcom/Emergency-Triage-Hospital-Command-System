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
    <header className="bg-slate-900 text-white border-b-4 border-amber-500 shadow-md sticky top-0 z-50">
      {/* Top Government Banner */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 font-semibold tracking-wide text-amber-400">
            {/* Government Seal emblem simulation */}
            <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center font-bold justify-center text-[10px] shadow">
              MH
            </div>
            <span>महाराष्ट्र शासन | Government of Maharashtra</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-300">
            State Emergency Operations Center (SEOC)
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-emerald-400 font-mono">
            <Server className="w-3.5 h-3.5" />
            <span>SEOC Node #01 Active</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1 text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{timeStr || '09:00:00 AM IST'}</span>
          </div>
        </div>
      </div>

      {/* Main EOC Header */}
      <div className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title & Branding */}
        <div className="flex items-center space-x-3">
          <div className="bg-rose-600 p-2.5 rounded-lg shadow-lg flex items-center justify-center border border-rose-400">
            <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                RAKSHAK AI
                <span className="text-xs bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                  EOC Platform
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              AI-Powered Emergency Response & Multi-Hospital Coordination Network
            </p>
          </div>
        </div>

        {/* Action Controls & RBAC Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Multi-Portal Switcher Button */}
          {onSwitchPortal && (
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-md border border-slate-700 font-mono text-[11px]">
              <button
                onClick={() => onSwitchPortal('GOVERNMENT')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  activePortal === 'GOVERNMENT'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Government EOC
              </button>

              <button
                onClick={() => onSwitchPortal('HOSPITAL')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  activePortal === 'HOSPITAL'
                    ? 'bg-sky-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Hospital Portal
              </button>
            </div>
          )}
          {/* Pilot District Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
                setIsUserDropdownOpen(false);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold px-3 py-2 rounded-md border border-slate-700 flex items-center space-x-2 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {selectedDistrict === 'all'
                  ? 'All Pilot Districts (7)'
                  : `District: ${activeDistrictObj?.name || selectedDistrict}`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDistrictDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-bold text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
                  Select Scope
                </div>
                <button
                  onClick={() => {
                    onSelectDistrict('all');
                    setIsDistrictDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${
                    selectedDistrict === 'all' ? 'text-sky-400 font-bold bg-slate-800/50' : 'text-slate-200'
                  }`}
                >
                  <span>All Pilot Districts (7)</span>
                  {selectedDistrict === 'all' && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </button>
                <div className="border-t border-slate-800 my-1"></div>
                {districts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDistrict(d.id);
                      setIsDistrictDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${
                      selectedDistrict === d.id ? 'text-sky-400 font-bold bg-slate-800/50' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{d.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({d.marathiName})</span>
                    </div>
                    {selectedDistrict === d.id && <Check className="w-3.5 h-3.5 text-sky-400" />}
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
              className="bg-sky-950 hover:bg-sky-900 border border-sky-700 text-sky-100 text-xs font-semibold px-3 py-2 rounded-md flex items-center space-x-2 transition-colors shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left">
                <div className="font-bold leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-sky-300 font-mono">{currentUser.roleTitle}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-sky-300" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-bold text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
                  Switch Active RBAC Role Profile
                </div>
                {userProfiles.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      setIsUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors ${
                      currentUser.id === user.id ? 'bg-sky-950/80 border-l-2 border-sky-400' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">{user.name}</span>
                      <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-sky-400">{user.roleTitle}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.organization}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* System Health Status Indicator */}
          <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs px-2.5 py-1.5 rounded-md flex items-center space-x-1.5 font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Health: {systemHealthScore}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
