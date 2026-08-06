import React, { useState } from 'react';
import {
  HeartPulse,
  Tag,
  Plus,
  Building2,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Activity,
  UserCheck,
} from 'lucide-react';
import { DisasterTriageVictim, Hospital, Ambulance, DisasterIncident } from '../../types';

interface DisasterTriageViewProps {
  disaster: DisasterIncident;
  victims: DisasterTriageVictim[];
  hospitals: Hospital[];
  ambulances: Ambulance[];
  onAddVictim: (newVictim: Partial<DisasterTriageVictim>) => void;
}

export const DisasterTriageView: React.FC<DisasterTriageViewProps> = ({
  disaster,
  victims,
  hospitals,
  ambulances,
  onAddVictim,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);

  // Form State for Quick Victim Tagging
  const [newTagNumber, setNewTagNumber] = useState(`TAG-RED-${Math.floor(100 + Math.random() * 899)}`);
  const [newCategory, setNewCategory] = useState<'RED' | 'YELLOW' | 'GREEN' | 'BLACK'>('RED');
  const [newAgeGender, setNewAgeGender] = useState('32M');
  const [newInjuries, setNewInjuries] = useState('Polytrauma, open limb fractures');
  const [newHr, setNewHr] = useState(130);
  const [newBp, setNewBp] = useState('85/55');
  const [newSpo2, setNewSpo2] = useState(86);
  const [newRr, setNewRr] = useState(28);
  const [newLocation, setNewLocation] = useState('Red Triage Tent A - Toll Plaza');
  const [newAssignedHosp, setNewAssignedHosp] = useState(hospitals[0]?.id || '');
  const [newNotes, setNewNotes] = useState('');

  const filteredVictims = victims.filter((v) => {
    const matchesCategory = filterCategory === 'all' || v.category === filterCategory;
    const matchesQuery =
      v.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.injuriesDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ageGender.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSubmitTag = (e: React.FormEvent) => {
    e.preventDefault();
    const hospObj = hospitals.find((h) => h.id === newAssignedHosp);

    onAddVictim({
      disasterId: disaster.id,
      tagNumber: newTagNumber,
      category: newCategory,
      ageGender: newAgeGender,
      injuriesDescription: newInjuries,
      vitals: { hr: Number(newHr), bp: newBp, spo2: Number(newSpo2), rr: Number(newRr) },
      triageLocation: newLocation,
      assignedHospitalId: hospObj?.id,
      assignedHospitalName: hospObj?.name,
      transportStatus: 'STAGED',
      specialNotes: newNotes,
    });

    setIsTagModalOpen(false);
    // Reset defaults
    setNewTagNumber(`TAG-RED-${Math.floor(100 + Math.random() * 899)}`);
    setNewInjuries('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            START / Jump Multi-Casualty Triage Console
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time tagging, vital signs tracking, and automated casualty destination matching.
          </p>
        </div>

        <button
          onClick={() => setIsTagModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-500 text-stone-900 font-extrabold text-xs px-4 py-2.5 rounded-lg shadow flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>TAG NEW CASUALTY AT SCENE</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-cream border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pill Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterCategory === 'all'
                ? 'bg-stone-100 text-stone-900 shadow'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Casualties ({victims.length})
          </button>
          <button
            onClick={() => setFilterCategory('RED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterCategory === 'RED'
                ? 'bg-rose-600 text-stone-900 shadow'
                : 'bg-rose-50 text-rose-400 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            RED Immediate ({victims.filter((v) => v.category === 'RED').length})
          </button>
          <button
            onClick={() => setFilterCategory('YELLOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterCategory === 'YELLOW'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            YELLOW Delayed ({victims.filter((v) => v.category === 'YELLOW').length})
          </button>
          <button
            onClick={() => setFilterCategory('GREEN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterCategory === 'GREEN'
                ? 'bg-emerald-600 text-stone-900 shadow'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            GREEN Minor ({victims.filter((v) => v.category === 'GREEN').length})
          </button>
          <button
            onClick={() => setFilterCategory('BLACK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterCategory === 'BLACK'
                ? 'bg-stone-100 text-stone-900 shadow'
                : 'bg-stone-100 text-stone-800 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            BLACK Deceased ({victims.filter((v) => v.category === 'BLACK').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
          <input
            type="text"
            placeholder="Search by tag # or injuries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Victims Triage List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVictims.map((v) => (
          <div
            key={v.id}
            className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all space-y-3 ${
              v.category === 'RED'
                ? 'border-l-4 border-l-rose-600 border-stone-200'
                : v.category === 'YELLOW'
                ? 'border-l-4 border-l-amber-500 border-stone-200'
                : v.category === 'GREEN'
                ? 'border-l-4 border-l-emerald-500 border-stone-200'
                : 'border-l-4 border-l-slate-800 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`font-black text-xs px-2.5 py-1 rounded shadow ${
                    v.category === 'RED'
                      ? 'bg-rose-600 text-stone-900 animate-pulse'
                      : v.category === 'YELLOW'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : v.category === 'GREEN'
                      ? 'bg-emerald-600 text-stone-900'
                      : 'bg-stone-100 text-stone-900'
                  }`}
                >
                  {v.tagNumber}
                </span>
                <span className="font-bold text-stone-900 text-sm">{v.ageGender}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-stone-100 text-stone-600 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                  AI Score: {v.aiPriorityScore}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    v.transportStatus === 'EN_ROUTE'
                      ? 'bg-sky-100 text-sky-400'
                      : v.transportStatus === 'STAGED'
                      ? 'bg-amber-100 text-amber-400'
                      : v.transportStatus === 'ADMITTED'
                      ? 'bg-emerald-100 text-emerald-400'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {v.transportStatus}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-800 font-medium leading-relaxed">{v.injuriesDescription}</p>

            {/* Vitals Ribbon */}
            <div className="bg-cream border border-stone-200 rounded-lg p-2.5 font-mono text-[11px] grid grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-[10px] text-stone-500 block">HEART RATE</span>
                <span className={`font-bold ${v.vitals.hr > 120 ? 'text-rose-600' : 'text-stone-800'}`}>
                  {v.vitals.hr} bpm
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block">BLOOD PRESS.</span>
                <span className="font-bold text-stone-800">{v.vitals.bp}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block">SPO2 %</span>
                <span className={`font-bold ${v.vitals.spo2 < 90 ? 'text-rose-600 font-black' : 'text-stone-800'}`}>
                  {v.vitals.spo2}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block">RESP RATE</span>
                <span className="font-bold text-stone-800">{v.vitals.rr}/min</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-1 border-t border-slate-100 gap-2">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                Destination: <strong className="text-stone-800">{v.assignedHospitalName || 'Unassigned'}</strong>
              </span>
              {v.assignedAmbulanceReg && (
                <span className="flex items-center gap-1 text-sky-400 font-bold">
                  <Truck className="w-3.5 h-3.5" />
                  Unit: {v.assignedAmbulanceReg}
                </span>
              )}
            </div>

            {v.specialNotes && (
              <div className="bg-rose-50 border border-rose-200 text-rose-900 text-[11px] p-2 rounded font-medium">
                ⚠️ {v.specialNotes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Tagging New Casualty */}
      {isTagModalOpen && (
        <div className="fixed inset-0 bg-cream/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-6 shadow-lg shadow-stone-300/50 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-rose-600" />
                START Triage Field Tagging Form
              </h3>
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="text-stone-500 hover:text-stone-500 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTag} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Tag Identifier</label>
                  <input
                    type="text"
                    required
                    value={newTagNumber}
                    onChange={(e) => setNewTagNumber(e.target.value)}
                    className="w-full bg-cream border border-stone-200 rounded p-2 text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-600 mb-1">Triage Priority Level</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-cream border border-stone-200 rounded p-2 font-bold"
                  >
                    <option value="RED">RED — Immediate / Critical</option>
                    <option value="YELLOW">YELLOW — Delayed / Serious</option>
                    <option value="GREEN">GREEN — Minor / Walking Wounded</option>
                    <option value="BLACK">BLACK — Deceased / Expectant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Age & Gender</label>
                  <input
                    type="text"
                    required
                    value={newAgeGender}
                    onChange={(e) => setNewAgeGender(e.target.value)}
                    placeholder="e.g. 35M or 24F"
                    className="w-full bg-cream border border-stone-200 rounded p-2 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-600 mb-1">Triage Scene Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-cream border border-stone-200 rounded p-2 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Injury / Clinical Description</label>
                <textarea
                  required
                  rows={2}
                  value={newInjuries}
                  onChange={(e) => setNewInjuries(e.target.value)}
                  className="w-full bg-cream border border-stone-200 rounded p-2 text-stone-900"
                ></textarea>
              </div>

              {/* Vitals Form Grid */}
              <div className="bg-cream border border-stone-200 rounded p-3">
                <span className="block font-bold text-stone-800 text-[11px] mb-2 uppercase tracking-wider">
                  Initial Vital Signs
                </span>
                <div className="grid grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <label className="block text-stone-500 mb-1">HR (bpm)</label>
                    <input
                      type="number"
                      value={newHr}
                      onChange={(e) => setNewHr(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded p-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">BP (mmHg)</label>
                    <input
                      type="text"
                      value={newBp}
                      onChange={(e) => setNewBp(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded p-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">SpO2 %</label>
                    <input
                      type="number"
                      value={newSpo2}
                      onChange={(e) => setNewSpo2(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded p-1 text-center font-bold text-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Resp Rate</label>
                    <input
                      type="number"
                      value={newRr}
                      onChange={(e) => setNewRr(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded p-1 text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Assigned Receiving Trauma Center</label>
                <select
                  value={newAssignedHosp}
                  onChange={(e) => setNewAssignedHosp(e.target.value)}
                  className="w-full bg-cream border border-stone-200 rounded p-2 font-bold"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.districtName}) — {h.availableIcuBeds} ICU Beds Free
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Special Directives / Alert Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Needs immediate blood transfusion or chest tube thoracostomy"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-cream border border-stone-200 rounded p-2 text-stone-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsTagModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-600 font-bold rounded hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-stone-900 font-extrabold rounded hover:bg-rose-500 shadow"
                >
                  Confirm Triage Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
