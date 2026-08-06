import React, { useState } from 'react';
import { Radio, Megaphone, AlertCircle, ShieldAlert, Send, CheckCircle2, Users } from 'lucide-react';
import { DisasterBroadcast, DisasterIncident } from '../../types';

interface DisasterBroadcastViewProps {
  disaster: DisasterIncident;
  broadcasts: DisasterBroadcast[];
  onSendBroadcast: (newBc: Partial<DisasterBroadcast>) => void;
}

export const DisasterBroadcastView: React.FC<DisasterBroadcastViewProps> = ({
  disaster,
  broadcasts,
  onSendBroadcast,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<DisasterBroadcast['channel']>('POLICE_TRAFFIC');
  const [urgency, setUrgency] = useState<DisasterBroadcast['urgency']>('CRITICAL_EVACUATION');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    onSendBroadcast({
      disasterId: disaster.id,
      title,
      message,
      channel,
      urgency,
      targetDistricts: [disaster.districtId],
      author: 'Incident Commander Dr. Rajesh Patil',
    });

    setTitle('');
    setMessage('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Broadcast Dispatch Form & Channels */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-rose-600" />
              Inter-Agency & Public Advisory Emergency Broadcast Console
            </h2>
            <span className="bg-rose-100 text-rose-400 text-xs font-bold px-2.5 py-1 rounded">
              SEOC Command Radio
            </span>
          </div>

          {isSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs p-3 rounded-lg font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Emergency Broadcast successfully dispatched to all target channels and agencies!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-600 mb-1">Target Agency / Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full bg-cream border border-stone-200 rounded-lg p-2.5 font-bold text-stone-900"
                >
                  <option value="POLICE_TRAFFIC">Traffic Police & Highway Control</option>
                  <option value="REGIONAL_HOSPITALS">Regional ER Hospital Network</option>
                  <option value="AMBULANCE_FLEET">Ambulance Dispatch Fleet</option>
                  <option value="DISTRICT_COLLECTORS">District Collectors & SDMA</option>
                  <option value="PUBLIC_SMS">Public Health Emergency SMS / Sirens</option>
                  <option value="ALL_HANDS">ALL-HANDS DISASTER COMMAND</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Priority / Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-cream border border-stone-200 rounded-lg p-2.5 font-bold text-stone-900"
                >
                  <option value="CRITICAL_EVACUATION">CRITICAL — EVACUATION / ROAD BLOCK</option>
                  <option value="URGENT_SURGE">URGENT — SURGE / BLOOD ADVISORY</option>
                  <option value="INFO">INFORMATION / SITUATION REPORT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-600 mb-1">Broadcast Title / Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. CRITICAL ROAD BLOCK: Emergency Green Corridor Active on NH-48"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-cream border border-stone-200 rounded-lg p-2.5 font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-600 mb-1">Broadcast Message Body</label>
              <textarea
                required
                rows={4}
                placeholder="Provide precise tactical instructions for police, hospitals, ambulances or public..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-cream border border-stone-200 rounded-lg p-2.5 text-stone-900 leading-relaxed"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-500 text-stone-900 font-extrabold text-xs px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>DISPATCH EMERGENCY BROADCAST</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right 1 Col: Broadcast Log History */}
      <div className="bg-white text-stone-900 border border-stone-200 rounded-xl p-5 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-stone-200 pb-3">
          <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          Active Broadcast History ({broadcasts.length})
        </h3>

        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {broadcasts.map((bc) => (
            <div key={bc.id} className="bg-stone-100 border border-stone-300 p-3.5 rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-amber-100 font-bold">
                <span>CHANNEL: {bc.channel}</span>
                <span>{bc.broadcastAt}</span>
              </div>
              <h4 className="font-bold text-stone-900 text-xs">{bc.title}</h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">{bc.message}</p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-stone-500 border-t border-stone-300 font-mono">
                <span>Author: {bc.author}</span>
                <span className="text-emerald-400 font-bold">Ack: {bc.acknowledgedCount || 1} Stations</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
