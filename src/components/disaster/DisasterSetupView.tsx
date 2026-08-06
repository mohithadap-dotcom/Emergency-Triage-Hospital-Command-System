import React, { useState } from 'react';
import { ShieldAlert, Plus, MapPin, AlertTriangle, Send } from 'lucide-react';
import { DisasterIncident, DisasterType, District } from '../../types';

interface DisasterSetupViewProps {
  districts: District[];
  onCreateDisaster: (disasterData: Partial<DisasterIncident>) => void;
}

export const DisasterSetupView: React.FC<DisasterSetupViewProps> = ({
  districts,
  onCreateDisaster,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DisasterType>('MASS_CASUALTY');
  const [severity, setSeverity] = useState<'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3_RED_ALERT'>('LEVEL_3_RED_ALERT');
  const [districtId, setDistrictId] = useState(districts[0]?.id || 'pune');
  const [locationName, setLocationName] = useState('');
  const [radiusKm, setRadiusKm] = useState(4.0);
  const [estimatedVictims, setEstimatedVictims] = useState(35);
  const [specialHazardsText, setSpecialHazardsText] = useState('Traffic blockage, chemical leak suspicion');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const distObj = districts.find((d) => d.id === districtId);

    onCreateDisaster({
      title: title || `${type} Emergency Event`,
      type,
      severity,
      districtId,
      districtName: distObj?.name || 'Pune',
      locationName: locationName || `${distObj?.name} Central Corridor`,
      radiusKm: Number(radiusKm),
      estimatedVictims: Number(estimatedVictims),
      specialHazards: specialHazardsText.split(',').map((s) => s.trim()),
      declaredBy: 'State Emergency Operations Center (SEOC Director)',
      description: description || `Official Level-3 Disaster declaration in ${distObj?.name} District.`,
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-600 animate-pulse" />
          Declare State / District Level Disaster Incident
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Triggers Level-3 Emergency Protocols, Incident Command System (ICS), Green Corridors, and multi-hospital triage allocation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Disaster Event Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Mass Casualty Multi-Vehicle Collision on NH-48 Expressway (KM 62)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Disaster Classification</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
            >
              <option value="MASS_CASUALTY">Mass Casualty Event</option>
              <option value="HIGHWAY_ACCIDENT">Highway Expressway Collision</option>
              <option value="CHEMICAL_SPILL">Chemical Leak / Toxic Vapor</option>
              <option value="EARTHQUAKE">Earthquake / Tremor</option>
              <option value="FLOOD">Flash Flood / Monsoon Emergency</option>
              <option value="FIRE_OUTBREAK">Major Fire Outbreak</option>
              <option value="PANDEMIC">Pandemic Outbreak</option>
              <option value="INDUSTRIAL_EXPLOSION">Industrial Explosion</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Severity & Alert Level</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
            >
              <option value="LEVEL_3_RED_ALERT">LEVEL-3 STATE RED ALERT</option>
              <option value="LEVEL_2">LEVEL-2 DISTRICT ALERT</option>
              <option value="LEVEL_1">LEVEL-1 LOCAL MONITORING</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">District Location</label>
            <select
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.marathiName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Epicenter Location Name</label>
            <input
              type="text"
              required
              placeholder="e.g. NH-48 Expressway Toll Plaza KM 62"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Exclusion Radius (KM)</label>
            <input
              type="number"
              step="0.5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold text-center"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Estimated Victims</label>
            <input
              type="number"
              value={estimatedVictims}
              onChange={(e) => setEstimatedVictims(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold text-center text-rose-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Special Hazards (Comma Separated)</label>
          <input
            type="text"
            value={specialHazardsText}
            onChange={(e) => setSpecialHazardsText(e.target.value)}
            placeholder="e.g. Chemical rollover, diesel fire, severe traffic congestion"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Detailed Situation Briefing</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the event, initial casualties, and state assistance required..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
          ></textarea>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>DECLARE LEVEL-3 DISASTER & ACTIVATE ICS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
