import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  Building2,
  Truck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Incident, Hospital, MassCasualtyVictim } from '../types';

interface MassCasualtyTriageProps {
  incidents: Incident[];
  hospitals: Hospital[];
  onBatchUpdateVictims?: (incidentId: string, victims: MassCasualtyVictim[]) => void;
}

export const MassCasualtyTriageView: React.FC<MassCasualtyTriageProps> = ({
  incidents,
  hospitals,
  onBatchUpdateVictims,
}) => {
  // Filter incidents for mass casualties or critical emergencies
  const massIncidents = incidents.filter(
    (i) => i.type === 'Mass Casualty' || i.type === 'Industrial Explosion' || i.patientCount > 5 || i.affectedCount > 5
  );

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    massIncidents.length > 0 ? massIncidents[0].id : incidents[0]?.id || ''
  );

  const activeIncident = incidents.find((i) => i.id === selectedIncidentId);

  // Local victim tracking state
  const [victims, setVictims] = useState<MassCasualtyVictim[]>(
    activeIncident?.massCasualtyVictims || [
      {
        id: 'v-1',
        tagNumber: 'TAG-MC-001',
        triageCategory: 'RED_CRITICAL',
        ageGroup: 'Adult (35 M)',
        gender: 'Male',
        symptoms: 'Unconscious, respiratory rate > 30, weak radial pulse',
        injuryDescription: 'Crushed pelvis & abdominal trauma',
        assignedHospitalId: hospitals[0]?.id,
        assignedHospitalName: hospitals[0]?.name,
        assignedAmbulanceNo: 'ALS Unit 108-A',
        status: 'EN_ROUTE',
        updatedAt: '08:45 AM',
      },
      {
        id: 'v-2',
        tagNumber: 'TAG-MC-002',
        triageCategory: 'RED_CRITICAL',
        ageGroup: 'Adult (29 F)',
        gender: 'Female',
        symptoms: 'Open compound skull fracture, GCS 8',
        injuryDescription: 'Head strike impact',
        assignedHospitalId: hospitals[0]?.id,
        assignedHospitalName: hospitals[0]?.name,
        assignedAmbulanceNo: 'ALS Unit 108-B',
        status: 'EN_ROUTE',
        updatedAt: '08:47 AM',
      },
      {
        id: 'v-3',
        tagNumber: 'TAG-MC-003',
        triageCategory: 'ORANGE_SERIOUS',
        ageGroup: 'Geriatric (68 M)',
        gender: 'Male',
        symptoms: 'Severe dyspnea, suspected tension pneumothorax',
        injuryDescription: 'Chest blast strain',
        assignedHospitalId: hospitals[1]?.id || hospitals[0]?.id,
        assignedHospitalName: hospitals[1]?.name || hospitals[0]?.name,
        assignedAmbulanceNo: 'BLS Unit 108-C',
        status: 'TRIAGED',
        updatedAt: '08:50 AM',
      },
      {
        id: 'v-4',
        tagNumber: 'TAG-MC-004',
        triageCategory: 'YELLOW_MODERATE',
        ageGroup: 'Adult (42 F)',
        gender: 'Female',
        symptoms: 'Forearm fracture, lacerations, hemodynamically stable',
        injuryDescription: 'Flying debris lacerations',
        assignedHospitalId: hospitals[1]?.id || hospitals[0]?.id,
        assignedHospitalName: hospitals[1]?.name || hospitals[0]?.name,
        assignedAmbulanceNo: 'BLS Unit 108-D',
        status: 'TRIAGED',
        updatedAt: '08:52 AM',
      },
      {
        id: 'v-5',
        tagNumber: 'TAG-MC-005',
        triageCategory: 'GREEN_MINOR',
        ageGroup: 'Pediatric (11 M)',
        gender: 'Male',
        symptoms: 'Superficial skin abrasions, walking wounded',
        injuryDescription: 'Minor glass scratches',
        assignedHospitalId: hospitals[2]?.id || hospitals[0]?.id,
        assignedHospitalName: hospitals[2]?.name || hospitals[0]?.name,
        assignedAmbulanceNo: 'Medical Bus Unit 108-E',
        status: 'TRIAGED',
        updatedAt: '08:55 AM',
      },
    ]
  );

  // New victim form state
  const [newTagNo, setNewTagNo] = useState(`TAG-MC-00${victims.length + 1}`);
  const [newCategory, setNewCategory] = useState<MassCasualtyVictim['triageCategory']>('RED_CRITICAL');
  const [newAge, setNewAge] = useState('Adult (30)');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newHospId, setNewHospId] = useState(hospitals[0]?.id || '');

  const counts = {
    red: victims.filter((v) => v.triageCategory === 'RED_CRITICAL').length,
    orange: victims.filter((v) => v.triageCategory === 'ORANGE_SERIOUS').length,
    yellow: victims.filter((v) => v.triageCategory === 'YELLOW_MODERATE').length,
    green: victims.filter((v) => v.triageCategory === 'GREEN_MINOR').length,
    black: victims.filter((v) => v.triageCategory === 'BLACK_DECEASED').length,
  };

  const handleAddVictim = (e: React.FormEvent) => {
    e.preventDefault();
    const hosp = hospitals.find((h) => h.id === newHospId);

    const newVictim: MassCasualtyVictim = {
      id: `v-${Date.now()}`,
      tagNumber: newTagNo || `TAG-MC-00${victims.length + 1}`,
      triageCategory: newCategory,
      ageGroup: newAge,
      gender: 'Mixed',
      symptoms: newSymptoms || 'Field triage evaluated',
      injuryDescription: 'Mass disaster injury',
      assignedHospitalId: hosp?.id,
      assignedHospitalName: hosp?.name || 'Local District Hospital',
      assignedAmbulanceNo: '108 Fleet Unit',
      status: 'TRIAGED',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...victims, newVictim];
    setVictims(updated);
    if (selectedIncidentId && onBatchUpdateVictims) {
      onBatchUpdateVictims(selectedIncidentId, updated);
    }

    setNewTagNo(`TAG-MC-00${updated.length + 1}`);
    setNewSymptoms('');
  };

  const handleCategoryChange = (vId: string, category: MassCasualtyVictim['triageCategory']) => {
    const updated = victims.map((v) => (v.id === vId ? { ...v, triageCategory: category } : v));
    setVictims(updated);
    if (selectedIncidentId && onBatchUpdateVictims) {
      onBatchUpdateVictims(selectedIncidentId, updated);
    }
  };

  return (
    <div className="space-y-4 text-stone-900">
      {/* Top Banner */}
      <div className="bg-white text-stone-900 rounded-lg p-4 border border-stone-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-rose-600 text-stone-900 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider animate-pulse">
              Disaster START Protocol
            </span>
            <span className="text-xs text-stone-500">Simple Triage and Rapid Treatment Workflow</span>
          </div>
          <h2 className="text-lg font-extrabold text-stone-900 mt-1 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Mass Casualty Triage & Batch Victim Tracking
          </h2>
        </div>

        {/* Select Incident dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-stone-600">Active Incident:</label>
          <select
            value={selectedIncidentId}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="px-3 py-1.5 bg-stone-100 text-stone-900 text-xs rounded border border-stone-300 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.code} - {i.title.substring(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Counter Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-rose-600 text-stone-900 p-3 rounded-lg border border-rose-400 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">
            🔴 Immediate (Red)
          </span>
          <span className="text-2xl font-black">{counts.red}</span>
          <span className="text-[10px] block opacity-80 mt-0.5">Critical ICU Priority</span>
        </div>

        <div className="bg-amber-500 text-slate-950 p-3 rounded-lg border border-amber-600 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">
            🟠 Very Urgent (Orange)
          </span>
          <span className="text-2xl font-black">{counts.orange}</span>
          <span className="text-[10px] block opacity-80 mt-0.5">High Risk Transfer</span>
        </div>

        <div className="bg-yellow-400 text-slate-950 p-3 rounded-lg border border-yellow-500 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">
            🟡 Urgent (Yellow)
          </span>
          <span className="text-2xl font-black">{counts.yellow}</span>
          <span className="text-[10px] block opacity-80 mt-0.5">Delayed Ward Care</span>
        </div>

        <div className="bg-emerald-600 text-stone-900 p-3 rounded-lg border border-emerald-700 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">
            🟢 Minor (Green)
          </span>
          <span className="text-2xl font-black">{counts.green}</span>
          <span className="text-[10px] block opacity-80 mt-0.5">Walking Wounded</span>
        </div>

        <div className="bg-stone-100 text-stone-800 p-3 rounded-lg border border-stone-200 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase tracking-wider block opacity-70">
            ⚫ Expectant (Black)
          </span>
          <span className="text-2xl font-black">{counts.black}</span>
          <span className="text-[10px] block opacity-70 mt-0.5">Palliative / Morgue</span>
        </div>
      </div>

      {/* Main Grid: Add Tag Form & Victim Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Add Victim Form */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider border-b pb-2 flex items-center space-x-1">
            <Plus className="w-4 h-4 text-rose-600" />
            <span>Tag New Field Victim</span>
          </h3>

          <form onSubmit={handleAddVictim} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-600 mb-1">Triage Tag Number *</label>
              <input
                type="text"
                required
                value={newTagNo}
                onChange={(e) => setNewTagNo(e.target.value)}
                className="w-full px-3 py-1.5 bg-cream border border-stone-200 rounded font-mono font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-600 mb-1">START Triage Tag Color *</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as MassCasualtyVictim['triageCategory'])}
                className="w-full px-2.5 py-1.5 bg-cream border border-stone-200 rounded font-bold text-stone-900"
              >
                <option value="RED_CRITICAL">🔴 RED - Immediate (Resuscitation)</option>
                <option value="ORANGE_SERIOUS">🟠 ORANGE - Very Urgent</option>
                <option value="YELLOW_MODERATE">🟡 YELLOW - Delayed Care</option>
                <option value="GREEN_MINOR">🟢 GREEN - Walking Wounded</option>
                <option value="BLACK_DECEASED">⚫ BLACK - Expectant / Deceased</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-600 mb-1">Age / Demographics</label>
              <input
                type="text"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                className="w-full px-3 py-1.5 bg-cream border border-stone-200 rounded font-medium text-stone-900"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-600 mb-1">Field Clinical Findings / Injuries</label>
              <textarea
                rows={2}
                placeholder="e.g. Femur fracture, GCS 12, burns..."
                value={newSymptoms}
                onChange={(e) => setNewSymptoms(e.target.value)}
                className="w-full px-3 py-1.5 bg-cream border border-stone-200 rounded font-medium text-stone-900"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-600 mb-1">Assigned Hospital Facility</label>
              <select
                value={newHospId}
                onChange={(e) => setNewHospId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream border border-stone-200 rounded font-semibold text-stone-800"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.availableIcuBeds} ICU Beds)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-stone-900 font-bold py-2 rounded shadow transition-colors flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Register Victim Tag</span>
            </button>
          </form>
        </div>

        {/* Victim Table */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Victim Triage Registry ({victims.length} Logged)</span>
            </h3>
            <span className="text-xs font-bold text-stone-500">
              Active Incident: <span className="text-stone-900">{activeIncident?.code}</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-600 uppercase font-black tracking-wider text-[10px] border-b border-stone-200">
                  <th className="p-2">Tag #</th>
                  <th className="p-2">Category Tag</th>
                  <th className="p-2">Age/Gender</th>
                  <th className="p-2">Symptoms</th>
                  <th className="p-2">Dest. Hospital</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-medium text-stone-800">
                {victims.map((v) => (
                  <tr key={v.id} className="hover:bg-cream transition-colors">
                    <td className="p-2 font-mono font-bold text-stone-900 whitespace-nowrap">
                      {v.tagNumber}
                    </td>
                    <td className="p-2">
                      <select
                        value={v.triageCategory}
                        onChange={(e) =>
                          handleCategoryChange(
                            v.id,
                            e.target.value as MassCasualtyVictim['triageCategory']
                          )
                        }
                        className={`text-[11px] font-black px-2 py-1 rounded border ${
                          v.triageCategory === 'RED_CRITICAL'
                            ? 'bg-rose-600 text-stone-900'
                            : v.triageCategory === 'ORANGE_SERIOUS'
                            ? 'bg-amber-500 text-slate-950'
                            : v.triageCategory === 'YELLOW_MODERATE'
                            ? 'bg-yellow-400 text-slate-950'
                            : v.triageCategory === 'GREEN_MINOR'
                            ? 'bg-emerald-600 text-stone-900'
                            : 'bg-stone-100 text-stone-900'
                        }`}
                      >
                        <option value="RED_CRITICAL">RED (Critical)</option>
                        <option value="ORANGE_SERIOUS">ORANGE (Very Urgent)</option>
                        <option value="YELLOW_MODERATE">YELLOW (Moderate)</option>
                        <option value="GREEN_MINOR">GREEN (Minor)</option>
                        <option value="BLACK_DECEASED">BLACK (Expectant)</option>
                      </select>
                    </td>
                    <td className="p-2 text-stone-600 whitespace-nowrap">{v.ageGroup}</td>
                    <td className="p-2 text-stone-800 font-medium max-w-[200px] truncate" title={v.symptoms}>
                      {v.symptoms}
                    </td>
                    <td className="p-2 font-bold text-stone-900 whitespace-nowrap">
                      {v.assignedHospitalName || 'Unassigned'}
                    </td>
                    <td className="p-2 text-right font-mono text-[11px] text-stone-500">
                      {v.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
