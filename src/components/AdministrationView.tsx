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
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-4 space-y-4">
      <div className="border-b border-stone-200 pb-3">
        <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-400" />
          State & District EOC Directory & RBAC Administration
        </h2>
        <p className="text-xs text-stone-500">
          Role-Based Access Control (RBAC) directory of state control room directors, district disaster management officers & emergency medical coordinators.
        </p>
      </div>

      <div className="overflow-x-auto border border-stone-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white text-stone-800 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-3">Official Name & Badge</th>
              <th className="p-3">Designation / Role Title</th>
              <th className="p-3">RBAC Permission Role</th>
              <th className="p-3">Organization & Command Node</th>
              <th className="p-3">Contact Email</th>
              <th className="p-3 text-right">Switch Active Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {userProfiles.map((user) => {
              const isActive = currentUser.id === user.id;

              return (
                <tr key={user.id} className={`hover:bg-cream ${isActive ? 'bg-sky-50/50' : ''}`}>
                  <td className="p-3">
                    <div className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                      {user.name}
                      {isActive && <BadgeCheck className="w-4 h-4 text-sky-600" />}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-400 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded inline-block mt-0.5">
                      {user.badgeNumber}
                    </div>
                  </td>

                  <td className="p-3 font-bold text-stone-800">{user.roleTitle}</td>

                  <td className="p-3">
                    <span className="font-mono text-[10px] font-black bg-stone-100 text-stone-900 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-3 text-stone-600 font-medium max-w-[220px]">{user.organization}</td>

                  <td className="p-3 text-sky-400 font-mono font-semibold">{user.email}</td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectUser(user)}
                      disabled={isActive}
                      className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                        isActive
                          ? 'bg-sky-700 text-stone-900 cursor-default'
                          : 'bg-stone-100 hover:bg-stone-100 text-stone-800 border border-stone-200'
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
