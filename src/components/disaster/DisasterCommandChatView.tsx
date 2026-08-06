import React, { useState } from 'react';
import { MessageSquare, Send, Users, ShieldAlert } from 'lucide-react';
import { DisasterCommandChatMessage, DisasterIncident, IcsRole } from '../../types';

interface DisasterCommandChatViewProps {
  disaster: DisasterIncident;
  chatMessages: DisasterCommandChatMessage[];
  activeIcsRole: IcsRole;
  onSendMessage: (msg: Partial<DisasterCommandChatMessage>) => void;
}

export const DisasterCommandChatView: React.FC<DisasterCommandChatViewProps> = ({
  disaster,
  chatMessages,
  activeIcsRole,
  onSendMessage,
}) => {
  const [activeChannel, setActiveChannel] = useState<'COMMAND' | 'FIELD_MEDICS' | 'TRAFFIC_CORRIDOR' | 'HOSPITAL_SURGE'>('COMMAND');
  const [inputText, setInputText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const filteredMessages = chatMessages.filter((m) => m.channel === activeChannel);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage({
      disasterId: disaster.id,
      sender: `Commander (${activeIcsRole})`,
      role: activeIcsRole,
      message: inputText,
      channel: activeChannel,
      urgent: isUrgent,
    });

    setInputText('');
    setIsUrgent(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
      {/* Left Sidebar: Channels */}
      <div className="bg-slate-900 text-slate-300 p-4 border-r border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          Command Channels
        </h3>

        <div className="space-y-1 text-xs">
          {[
            { id: 'COMMAND', label: '1. Incident Command Desk' },
            { id: 'FIELD_MEDICS', label: '2. Field Medics & Triage' },
            { id: 'TRAFFIC_CORRIDOR', label: '3. Traffic & Escort Escadrille' },
            { id: 'HOSPITAL_SURGE', label: '4. Hospital ER Coordinators' },
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id as any)}
              className={`w-full text-left px-3 py-2 rounded font-bold transition-all ${
                activeChannel === ch.id
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right 3 Cols: Active Chat Feed */}
      <div className="md:col-span-3 flex flex-col justify-between p-4 bg-slate-50">
        <div className="border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
          <span className="font-bold text-slate-900 text-xs uppercase">
            Active Channel: {activeChannel}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Role: {activeIcsRole}
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[380px] mb-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg text-xs space-y-1 ${
                msg.urgent
                  ? 'bg-rose-50 border border-rose-300 text-rose-950 font-medium'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-[11px]">
                <span className={msg.urgent ? 'text-rose-700' : 'text-slate-900'}>
                  {msg.sender} [{msg.role}]
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Message #${activeChannel}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>

          <label className="flex items-center space-x-1.5 text-xs text-rose-700 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="rounded border-rose-400 text-rose-600 focus:ring-rose-500"
            />
            <span>Mark as HIGH URGENCY RED ALERT MESSAGE</span>
          </label>
        </form>
      </div>
    </div>
  );
};
