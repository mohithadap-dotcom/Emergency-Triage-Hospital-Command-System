import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Radio,
  Building2,
  Hospital,
  UserCheck,
  Shield,
  Zap,
  CheckCheck,
} from 'lucide-react';
import { EmsChatMessage, AmbulanceUserSession } from '../../types';

interface AmbulanceCommunicationCenterProps {
  session: AmbulanceUserSession;
}

export const AmbulanceCommunicationCenter: React.FC<AmbulanceCommunicationCenterProps> = ({
  session,
}) => {
  const [activeChannel, setActiveChannel] = useState<'COMMAND' | 'HOSPITAL' | 'DOCTOR' | 'FLEET_MANAGER' | 'BROADCAST'>('HOSPITAL');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<EmsChatMessage[]>([
    {
      id: 'msg-1',
      senderId: 'COMMAND-EOC-01',
      senderName: 'State EOC Dispatch Control',
      senderRole: 'Dispatch Officer',
      recipientChannel: 'COMMAND',
      message: 'ALS Unit 101, green corridor activated on Samruddhi Expressway. Traffic signals set to priority green.',
      timestamp: '08:45 AM',
      readBy: ['ALS-101'],
    },
    {
      id: 'msg-2',
      senderId: 'HOSP-NGP-ER',
      senderName: 'AIIMS Nagpur ER Coordinator',
      senderRole: 'Hospital Coordinator',
      recipientChannel: 'HOSPITAL',
      message: 'Trauma Resuscitation Bay 1 pre-reserved. Blood Bank pre-alerted for 2 units O-Negative.',
      timestamp: '08:48 AM',
      readBy: ['ALS-101'],
    },
    {
      id: 'msg-3',
      senderId: 'DOC-NEURO-02',
      senderName: 'Dr. Vikram Shah (Trauma Specialist)',
      senderRole: 'Attending Doctor',
      recipientChannel: 'DOCTOR',
      message: 'Received live IoT vitals. Continue saline bolus. CT Trauma protocol activated on arrival.',
      timestamp: '08:50 AM',
      readBy: ['ALS-101'],
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: EmsChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: session.user.id,
      senderName: session.user.name,
      senderRole: session.user.roleTitle,
      recipientChannel: activeChannel,
      message: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      readBy: ['COMMAND', 'HOSPITAL'],
    };

    setMessages([...messages, newMsg]);
    setMessageInput('');
  };

  const handleSendQuickStatus = (statusText: string) => {
    const quickMsg: EmsChatMessage = {
      id: `msg-quick-${Date.now()}`,
      senderId: session.user.id,
      senderName: session.user.name,
      senderRole: session.user.roleTitle,
      recipientChannel: activeChannel,
      message: `[QUICK STATUS]: ${statusText}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      readBy: ['COMMAND', 'HOSPITAL'],
    };
    setMessages([...messages, quickMsg]);
  };

  const handleEmergencyBroadcast = () => {
    const broadcastMsg: EmsChatMessage = {
      id: `msg-bc-${Date.now()}`,
      senderId: session.user.id,
      senderName: session.user.name,
      senderRole: session.user.roleTitle,
      recipientChannel: 'BROADCAST',
      message: '🚨 CRITICAL EMERGENCY BROADCAST: Patient undergoing cardiac arrest in transit. Diverting immediately to nearest Level 1 Trauma Center with Police Escort!',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isEmergencyBroadcast: true,
      readBy: ['ALL_HANDS'],
    };
    setMessages([...messages, broadcastMsg]);
  };

  const filteredMessages = messages.filter(
    (m) => m.recipientChannel === activeChannel || m.recipientChannel === 'BROADCAST' || m.isEmergencyBroadcast
  );

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white text-stone-900 p-5 rounded-2xl border border-stone-200 shadow-lg shadow-stone-300/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-600 rounded-xl">
            <Radio className="w-6 h-6 text-stone-900 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-stone-900">
              Cross-Agency Emergency Radio Communication Center
            </h2>
            <p className="text-xs text-stone-600">
              Encrypted Real-Time Messaging: Ambulance ↔ Command ↔ Hospital ↔ Doctor ↔ Fleet Manager
            </p>
          </div>
        </div>

        <button
          onClick={handleEmergencyBroadcast}
          className="bg-rose-600 hover:bg-rose-500 text-stone-900 font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-2 uppercase shadow animate-pulse"
        >
          <Zap className="w-4 h-4 text-amber-100" />
          <span>Emergency Radio Broadcast</span>
        </button>
      </div>

      {/* Main Radio Chat Layout */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
        {/* Left Channels Sidebar */}
        <div className="md:col-span-4 bg-cream border-r border-stone-200 p-4 space-y-2">
          <div className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-2">
            Select Radio Channel
          </div>

          <button
            onClick={() => setActiveChannel('HOSPITAL')}
            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
              activeChannel === 'HOSPITAL'
                ? 'bg-sky-600 text-stone-900 border-sky-500 font-bold shadow'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center space-x-2 text-xs">
              <Hospital className="w-4 h-4" />
              <span>Ambulance ↔ Hospital ER</span>
            </div>
          </button>

          <button
            onClick={() => setActiveChannel('COMMAND')}
            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
              activeChannel === 'COMMAND'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center space-x-2 text-xs">
              <Building2 className="w-4 h-4" />
              <span>Ambulance ↔ Government Command</span>
            </div>
          </button>

          <button
            onClick={() => setActiveChannel('DOCTOR')}
            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
              activeChannel === 'DOCTOR'
                ? 'bg-emerald-600 text-stone-900 border-emerald-500 font-bold shadow'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center space-x-2 text-xs">
              <UserCheck className="w-4 h-4" />
              <span>Ambulance ↔ Attending Doctor</span>
            </div>
          </button>

          <button
            onClick={() => setActiveChannel('FLEET_MANAGER')}
            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
              activeChannel === 'FLEET_MANAGER'
                ? 'bg-indigo-600 text-stone-900 border-indigo-500 font-bold shadow'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center space-x-2 text-xs">
              <Shield className="w-4 h-4" />
              <span>Ambulance ↔ Fleet Manager</span>
            </div>
          </button>

          {/* Quick Status Buttons */}
          <div className="pt-4 border-t border-stone-200 space-y-1.5">
            <div className="text-[10px] font-bold text-stone-500 uppercase">Quick Status Transmit</div>
            <button
              onClick={() => handleSendQuickStatus('PATIENT LOADED & STABLE')}
              className="w-full text-left p-2 bg-stone-100 hover:bg-stone-100 rounded-lg text-[11px] font-bold text-stone-800"
            >
              + Patient Loaded & Stable
            </button>
            <button
              onClick={() => handleSendQuickStatus('5 MINS TO ER RAMP')}
              className="w-full text-left p-2 bg-stone-100 hover:bg-stone-100 rounded-lg text-[11px] font-bold text-stone-800"
            >
              + 5 Mins to ER Ramp
            </button>
            <button
              onClick={() => handleSendQuickStatus('TRAFFIC CLEARANCE REQUIRED')}
              className="w-full text-left p-2 bg-stone-100 hover:bg-stone-100 rounded-lg text-[11px] font-bold text-stone-800"
            >
              + Request Traffic Clearance
            </button>
          </div>
        </div>

        {/* Right Chat Conversation */}
        <div className="md:col-span-8 p-4 flex flex-col justify-between space-y-4 bg-cream/50">
          <div className="space-y-3 overflow-y-auto max-h-[360px] pr-2">
            {filteredMessages.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl max-w-xl text-xs space-y-1 shadow-sm ${
                  m.isEmergencyBroadcast
                    ? 'bg-rose-600 text-stone-900 font-bold ml-auto border border-rose-400'
                    : m.senderId === session.user.id
                    ? 'bg-white text-stone-900 ml-auto'
                    : 'bg-white text-stone-900 border border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-80 border-b border-current/20 pb-1">
                  <span className="font-bold">{m.senderName} ({m.senderRole})</span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="leading-relaxed font-medium">{m.message}</p>
                <div className="text-[9px] text-right opacity-70 flex items-center justify-end gap-1 pt-1">
                  <CheckCheck className="w-3 h-3 text-emerald-400" />
                  <span>Read by {m.readBy.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-stone-200 shadow">
            <input
              type="text"
              placeholder={`Type message to ${activeChannel}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-xs text-stone-900 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-stone-900 font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
