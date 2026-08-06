import React from 'react';
import { Users, ShieldCheck, Building2, PhoneCall, Mail, BadgeCheck } from 'lucide-react';
import { UserProfile, District } from '../types';

interface AdminProps {
  userProfiles: UserProfile[];
  districts: District[];
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AdministrationView: React.FC<AdminProps> = ({
  userProfiles,
  districts,
  currentUser,
  onSelectUser,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-700" />
          State & District EOC Directory & RBAC Administration
        </h2>
        <p className="text-xs text-slate-500">
          Role-Based Access Control (RBAC) directory of state control room directors, district disaster management officers & emergency medical coordinators.
        </p>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-200 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-3">Official Name & Badge</th>
              <th className="p-3">Designation / Role Title</th>
              <th className="p-3">RBAC Permission Role</th>
              <th className="p-3">Organization & Command Node</th>
              <th className="p-3">Contact Email</th>
              <th className="p-3 text-right">Switch Active Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {userProfiles.map((user) => {
              const isActive = currentUser.id === user.id;

              return (
                <tr key={user.id} className={`hover:bg-slate-50 ${isActive ? 'bg-sky-50/50' : ''}`}>
                  <td className="p-3">
                    <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      {user.name}
                      {isActive && <BadgeCheck className="w-4 h-4 text-sky-600" />}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded inline-block mt-0.5">
                      {user.badgeNumber}
                    </div>
                  </td>

                  <td className="p-3 font-bold text-slate-800">{user.roleTitle}</td>

                  <td className="p-3">
                    <span className="font-mono text-[10px] font-black bg-slate-800 text-slate-100 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-3 text-slate-700 font-medium max-w-[220px]">{user.organization}</td>

                  <td className="p-3 text-sky-800 font-mono font-semibold">{user.email}</td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectUser(user)}
                      disabled={isActive}
                      className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                        isActive
                          ? 'bg-sky-700 text-white cursor-default'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {isActive ? 'Active User' : 'Switch Role'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
