import React from 'react';
import { motion } from 'motion/react';
import { Bell, Siren, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { Hospital } from '../../types';

interface HospitalNotificationsViewProps {
  hospital: Hospital;
}

export const HospitalNotificationsView: React.FC<HospitalNotificationsViewProps> = ({ hospital }) => {
  const notifications = [
    {
      id: 'notif-1',
      title: 'CRITICAL INBOUND AMBULANCE PRE-ALERT',
      message: 'ALS Unit MH 12 QW 1108 arriving in 4 mins with polytrauma patient Karan Deshmukh (SpO2 85%, BP 84/52). Trauma Bay pre-allocated.',
      type: 'CRITICAL',
      time: '2 mins ago',
    },
    {
      id: 'notif-2',
      title: 'AUTOMATED ICU BED RESERVATION',
      message: 'ICU Bed ICU-CRASH-01 automatically reserved by State Emergency Operations Center.',
      type: 'RESERVATION',
      time: '10 mins ago',
    },
    {
      id: 'notif-3',
      title: 'RESOURCE SYNC CONFIRMATION',
      message: 'Updated ventilator and oxygen cylinder counts successfully broadcasted across Maharashtra Emergency Network.',
      type: 'INFO',
      time: '25 mins ago',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <span>Hospital Operational Alerts & Push Notifications</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ambulance arrivals, ICU reservations, critical resource warnings, and AI recommendations
          </p>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                n.type === 'CRITICAL'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : n.type === 'RESERVATION'
                  ? 'bg-sky-50 border-sky-300 text-sky-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <Siren className={`w-5 h-5 shrink-0 ${n.type === 'CRITICAL' ? 'text-rose-600 animate-pulse' : 'text-sky-600'}`} />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <strong className="font-extrabold text-xs">{n.title}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                </div>
                <p className="text-xs font-medium leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
