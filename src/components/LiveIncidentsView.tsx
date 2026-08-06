import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  MapPin,
  Clock,
  Truck,
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Plus,
  ShieldAlert,
  Sparkles,
  ListOrdered,
  Users,
  BarChart2,
  Bell,
  ChevronRight,
  Info,
  X,
  UserCheck,
} from 'lucide-react';
import { Incident, District, Hospital, PriorityLevel, CommandCenterAlert } from '../types';
import { AiTriageDetailModal } from './AiTriageDetailModal';
import { MassCasualtyTriageView } from './MassCasualtyTriageView';
import { DynamicQueueView } from './DynamicQueueView';
import { IncidentAnalyticsView } from './IncidentAnalyticsView';

interface LiveIncidentsProps {
  incidents: Incident[];
  districts: District[];
  hospitals: Hospital[];
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  onAddNewIncident: (newIncident: Incident) => void;
}

export const LiveIncidentsView: React.FC<LiveIncidentsProps> = ({
  incidents,
  districts,
  hospitals,
  selectedDistrict,
  onSelectDistrict,
  onAddNewIncident,
}) => {
  // Navigation Tabs inside Phase 2 Module
  const [activeTab, setActiveTab] = useState<
    'console' | 'queue' | 'mass_casualty' | 'analytics'
  >('console');

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIncidentForTriage, setSelectedIncidentForTriage] = useState<Incident | null>(null);

  // Active Command Center Banner Alert
  const [activeAlert, setActiveAlert] = useState<CommandCenterAlert | null>({
    id: 'alert-seoc-01',
    type: 'MASS_CASUALTY',
    title: 'CRITICAL ALERT: Multi-Vehicle Collision on Nagpur-Pune Expressway (NH-44)',
    message: 'Estimated 18 casualties. 4 patients in critical shock requiring immediate Level 1 Trauma ICU reception and neuro-surgical team standby.',
    districtId: 'nagpur',
    districtName: 'Nagpur',
    incidentId: 'inc-001',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    acknowledged: false,
  });

  // Form state for creating new incident with Gemini AI Triage
  const [newTitle, setNewTitle] = useState('');
  const [newDistrict, setNewDistrict] = useState('nagpur');
  const [newType, setNewType] = useState<Incident['type']>('Road Accident');
  const [newSeverity, setNewSeverity] = useState<Incident['severity']>('CRITICAL');
  const [newLocation, setNewLocation] = useState('');
  const [newAffected, setNewAffected] = useState(5);
  const [newSymptomsText, setNewSymptomsText] = useState(
    'Multiple victims trapped, severe thoracic crush injuries, uncoordinated pupil reflex, BP dropping'
  );
  const [newNotes, setNewNotes] = useState('');
  const [isAiTriaging, setIsAiTriaging] = useState(false);

  // Filtered List
  const filteredIncidents = incidents.filter((inc) => {
    const matchesDistrict = selectedDistrict === 'all' || inc.districtId === selectedDistrict;
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
    return matchesDistrict && matchesSearch && matchesSeverity && matchesStatus;
  });

  const getPriorityBadgeClass = (p: PriorityLevel) => {
    switch (p) {
      case 'RED':
        return 'bg-rose-600 text-stone-900 font-black animate-pulse shadow-sm';
      case 'ORANGE':
        return 'bg-amber-500 text-slate-950 font-black';
      case 'YELLOW':
        return 'bg-yellow-400 text-slate-950 font-black';
      case 'GREEN':
        return 'bg-emerald-600 text-stone-900 font-bold';
      default:
        return 'bg-sky-600 text-stone-900 font-bold';
    }
  };

  const getStatusBadgeClass = (status: Incident['status']) => {
    switch (status) {
      case 'DISPATCHED':
        return 'bg-amber-500 text-slate-950 font-bold';
      case 'EN_ROUTE':
        return 'bg-blue-600 text-stone-900 font-bold';
      case 'TRIAGED':
        return 'bg-emerald-600 text-stone-900 font-bold';
      case 'STABILIZING':
        return 'bg-indigo-600 text-stone-900 font-bold';
      default:
        return 'bg-stone-100 text-stone-600 font-medium';
    }
  };

  // Override Priority Handler
  const handleOverridePriority = (
    incidentId: string,
    newPriority: PriorityLevel,
    reason: string,
    officerName: string
  ) => {
    const target = incidents.find((i) => i.id === incidentId);
    if (!target) return;

    target.priority = newPriority;
    target.overrideAudit = {
      id: `audit-${Date.now()}`,
      incidentId,
      originalAiPriority: target.aiTriage?.recommendedPriority || 'RED',
      humanAssignedPriority: newPriority,
      reason,
      officerName,
      timestamp: new Date().toISOString(),
    };

    setSelectedIncidentForTriage(null);
  };

  // Form Submit with AI API call simulation / execution
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation) return;

    setIsAiTriaging(true);

    const districtObj = districts.find((d) => d.id === newDistrict);
    const code = `INC-2026-${districtObj?.code || 'EOC'}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      // Call backend AI triage endpoint
      const res = await fetch('/api/ai-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentTitle: newTitle,
          incidentType: newType,
          districtName: districtObj?.name || 'Nagpur',
          symptomsText: newSymptomsText,
          patientCount: Number(newAffected),
          locationName: newLocation,
        }),
      });

      let aiResult;
      if (res.ok) {
        aiResult = await res.json();
      }

      const assignedPri: PriorityLevel = aiResult?.recommendedPriority || (newSeverity === 'CRITICAL' ? 'RED' : 'ORANGE');

      const created: Incident = {
        id: `inc-${Date.now()}`,
        code,
        title: newTitle,
        districtId: newDistrict,
        districtName: districtObj?.name || 'Nagpur',
        locationName: newLocation,
        type: newType,
        severity: newSeverity,
        priority: assignedPri,
        status: 'DISPATCHED',
        affectedCount: Number(newAffected),
        patientCount: Number(newAffected),
        assignedAmbulances: 2,
        assignedHospitalName: hospitals[0]?.name || 'AIIMS Nagpur Trauma Center',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reportedBy: 'State EOC Dispatch Command',
        coordinates: districtObj?.coordinates || { lat: 21.1458, lng: 79.0882 },
        notes: newNotes || `Symptom Report: ${newSymptomsText}`,
        aiTriage: aiResult || {
          summary: `AI evaluated ${newType} with ${newAffected} victims. Immediate Level 1 trauma routing recommended.`,
          severity: assignedPri,
          recommendedPriority: assignedPri,
          suggestedDepartment: 'Trauma ICU & Emergency Resuscitation',
          suggestedAmbulanceType: 'ALS (Advanced Life Support)',
          suggestedHospitalCapability: 'Level 1 Trauma Center',
          confidenceScore: 96,
          clinicalExplanation: 'Airway and hemodynamic instability reported in field dispatch log.',
          symptomsUsed: ['Airway Obstruction Risk', 'Hypotension', 'Crush Injury'],
          priorityLogic: 'Higher priority assigned due to severe casualty volume and vital instability.',
          suggestedActions: [
            'Dispatch 2 ALS 108 Ambulances with ventilators',
            'Pre-alert Trauma Surgeon on-call at AIIMS Nagpur',
            'Reserve 3 ICU beds in State EOC Hospital Matrix',
          ],
          timestamp: new Date().toISOString(),
          modelVersion: 'gemini-3.6-flash',
          humanReviewRequired: true,
        },
      };

      onAddNewIncident(created);
      setShowCreateModal(false);
      setNewTitle('');
      setNewLocation('');
      setNewNotes('');
      setNewSymptomsText('');
    } catch (err) {
      console.error('Triage dispatch error:', err);
    } finally {
      setIsAiTriaging(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Command Center Alert Banner */}
      {activeAlert && !activeAlert.acknowledged && (
        <div className="bg-rose-950 border border-rose-600 text-stone-900 rounded-lg p-3.5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-rose-600 text-stone-900 rounded-full shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] font-black bg-rose-600 text-stone-900 px-2 py-0.5 rounded uppercase tracking-wider">
                  STATE COMMAND CENTER ALERT
                </span>
                <span className="text-xs text-rose-300 font-bold">• {activeAlert.districtName} District</span>
                <span className="text-xs text-rose-300">• {activeAlert.timestamp}</span>
              </div>
              <h3 className="text-sm font-extrabold text-stone-900 mt-1">{activeAlert.title}</h3>
              <p className="text-xs text-rose-200 mt-0.5 font-medium">{activeAlert.message}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveAlert({ ...activeAlert, acknowledged: true })}
            className="bg-white hover:bg-stone-100 text-slate-950 font-black text-xs px-3 py-1.5 rounded-md shadow shrink-0 border border-stone-200 transition-colors"
          >
            Acknowledge & Clear Alert
          </button>
        </div>
      )}

      {/* Module Navigation Sub-Header */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'console'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Incidents Console ({incidents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'queue'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <ListOrdered className="w-4 h-4 text-sky-400" />
            <span>AI Smart Triage Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('mass_casualty')}
            className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'mass_casualty'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Mass Casualty (START)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'analytics'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>Triage Analytics</span>
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-stone-900 font-black text-xs px-3 py-1.5 rounded-md shadow-sm flex items-center space-x-1 transition-colors ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Emergency</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'queue' && (
        <DynamicQueueView
          incidents={incidents}
          onOpenDetail={(inc) => setSelectedIncidentForTriage(inc)}
        />
      )}

      {activeTab === 'mass_casualty' && (
        <MassCasualtyTriageView incidents={incidents} hospitals={hospitals} />
      )}

      {activeTab === 'analytics' && (
        <IncidentAnalyticsView incidents={incidents} districts={districts} />
      )}

      {activeTab === 'console' && (
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-4 space-y-4">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600 animate-pulse" />
                Live Incident Response Feed
              </h2>
              <p className="text-xs text-stone-500">
                AI-triaged active emergency incidents, patient counts & assigned reception centers across Maharashtra.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search code or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-cream border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-stone-900 font-medium"
                />
              </div>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-cream border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-stone-800"
              >
                <option value="all">All Severities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="MAJOR">MAJOR</option>
                <option value="MODERATE">MODERATE</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-cream border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-stone-800"
              >
                <option value="all">All Statuses</option>
                <option value="DISPATCHED">DISPATCHED</option>
                <option value="EN_ROUTE">EN ROUTE</option>
                <option value="TRIAGED">TRIAGED</option>
                <option value="STABILIZING">STABILIZING</option>
              </select>
            </div>
          </div>

          {/* Incident Cards List */}
          <div className="space-y-3">
            {filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                className={`rounded-lg border p-4 transition-all bg-cream/60 ${
                  inc.priority === 'RED' || inc.severity === 'CRITICAL'
                    ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-300'
                    : 'border-stone-200 hover:border-stone-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-black bg-white text-stone-900 px-2 py-0.5 rounded">
                        {inc.code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${getPriorityBadgeClass(inc.priority)}`}>
                        {inc.priority} PRIORITY
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${getStatusBadgeClass(inc.status)}`}>
                        {inc.status}
                      </span>
                      <span className="text-xs bg-sky-100 text-sky-400 font-bold px-2 py-0.5 rounded border border-sky-200">
                        {inc.districtName}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900">
                      {inc.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{inc.locationName}</span>
                      </span>
                      <span>•</span>
                      <span className="font-bold text-rose-400">
                        {inc.patientCount || inc.affectedCount} Patients Logged
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span>{inc.timestamp}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions & Hospital Box */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 min-w-[220px]">
                    <div className="bg-white p-2.5 rounded border border-stone-200 text-xs w-full">
                      <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1">
                        Assigned Receiving Center
                      </div>
                      <div className="font-bold text-stone-900 flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>{inc.assignedHospitalName || 'AIIMS Nagpur Trauma'}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-blue-400 font-semibold">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        <span>{inc.assignedAmbulances} 108 Units Dispatched</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedIncidentForTriage(inc)}
                      className="w-full bg-white hover:bg-stone-100 text-stone-900 font-extrabold text-xs py-1.5 px-3 rounded flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>AI Triage & Explainability</span>
                    </button>
                  </div>
                </div>

                {inc.notes && (
                  <p className="text-xs text-stone-500 bg-white p-2 rounded border border-stone-200 mt-2 font-medium">
                    <span className="font-bold text-stone-800">Dispatch Notes:</span> {inc.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Triage Detail Drawer / Modal */}
      {selectedIncidentForTriage && (
        <AiTriageDetailModal
          incident={selectedIncidentForTriage}
          onClose={() => setSelectedIncidentForTriage(null)}
          onOverridePriority={handleOverridePriority}
        />
      )}

      {/* Report New Emergency Incident Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-cream/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-lg shadow-stone-300/50 max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Report Emergency Incident & Run AI Triage
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-500 hover:text-stone-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-600 mb-1">Incident Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bus Collided with tanker on NH-44"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-cream border border-stone-200 rounded font-medium text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Pilot District *</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-cream border border-stone-200 rounded font-semibold text-stone-800"
                  >
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-600 mb-1">Incident Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Incident['type'])}
                    className="w-full px-2.5 py-1.5 bg-cream border border-stone-200 rounded font-semibold text-stone-800"
                  >
                    <option value="Road Accident">Road Accident</option>
                    <option value="Industrial Explosion">Industrial Explosion</option>
                    <option value="Mass Casualty">Mass Casualty</option>
                    <option value="Cardiac Emergency">Cardiac Emergency</option>
                    <option value="Flood Rescue">Flood Rescue</option>
                    <option value="Epidemic Alert">Epidemic Alert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Severity Assessment *</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as Incident['severity'])}
                    className="w-full px-2.5 py-1.5 bg-cream border border-stone-200 rounded font-bold text-rose-400"
                  >
                    <option value="CRITICAL">CRITICAL (Level 1 Red)</option>
                    <option value="MAJOR">MAJOR (Level 2 Orange)</option>
                    <option value="MODERATE">MODERATE (Level 3 Yellow)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-600 mb-1">Estimated Patient Count</label>
                  <input
                    type="number"
                    value={newAffected}
                    onChange={(e) => setNewAffected(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-cream border border-stone-200 rounded font-mono font-bold text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Exact Location / Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KM 24, Wardha Road, Hingna Bypass"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-cream border border-stone-200 rounded font-medium text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">
                  Field Symptoms & Vital Observations (AI Triage Input) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe patient vitals, consciousness level, fractures, hemorrhage status..."
                  value={newSymptomsText}
                  onChange={(e) => setNewSymptomsText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-cream border border-stone-200 rounded font-medium text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-stone-500 font-bold hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAiTriaging}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-stone-900 font-bold rounded shadow flex items-center space-x-1"
                >
                  {isAiTriaging ? (
                    <span>Running Gemini AI Triage...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Dispatch & Run AI Triage</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
