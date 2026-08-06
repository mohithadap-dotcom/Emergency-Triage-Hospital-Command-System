import React, { useState } from 'react';
import {
  Zap,
  Truck,
  Building2,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Flame,
  AlertTriangle,
  ArrowRight,
  Activity,
  Sliders,
  ChevronRight,
  Gauge,
  User,
  PhoneCall,
} from 'lucide-react';
import { Incident, Ambulance, Hospital, SmartDispatchRecommendation, District } from '../types';

interface DispatchProps {
  incidents: Incident[];
  ambulances: Ambulance[];
  hospitals: Hospital[];
  districts: District[];
  onDispatchAssigned: (mission: any) => void;
}

export const SmartDispatchEngine: React.FC<DispatchProps> = ({
  incidents,
  ambulances,
  hospitals,
  districts,
  onDispatchAssigned,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    incidents.find((i) => i.status !== 'RESOLVED' && i.status !== 'EN_ROUTE')?.id || incidents[0]?.id || ''
  );

  const [recommendation, setRecommendation] = useState<SmartDispatchRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [greenCorridor, setGreenCorridor] = useState<boolean>(false);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>('');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentIncident = incidents.find((i) => i.id === selectedIncidentId);

  // Trigger AI Smart Dispatch Recommendation
  const handleRunDispatchAi = async (incidentId: string) => {
    setLoading(true);
    setRecommendation(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/fleet/dispatch/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId }),
      });

      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.recommendation) {
          setRecommendation(data.recommendation);
          setSelectedAmbulanceId(data.recommendation.bestAmbulanceId);
          setSelectedHospitalId(data.recommendation.recommendedHospitalId);
          setGreenCorridor(data.recommendation.greenCorridorRecommended);
        }
      }
    } catch (err) {
      console.error('Error running smart dispatch AI:', err);
    } finally {
      setLoading(false);
    }
  };

  // Confirm Dispatch Assignment
  const handleExecuteDispatch = async () => {
    if (!currentIncident || !selectedAmbulanceId || !selectedHospitalId) return;
    setAssigning(true);

    try {
      const res = await fetch('/api/fleet/dispatch/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: currentIncident.id,
          ambulanceId: selectedAmbulanceId,
          hospitalId: selectedHospitalId,
          greenCorridor,
          officerName: 'State EOC Senior Dispatch Commander',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          `Dispatch Order Executed! Mission Code: ${data.mission?.missionCode}. Ambulance ${data.ambulance?.registrationNo} assigned to ${currentIncident.code}.`
        );
        onDispatchAssigned(data.mission);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
    } catch (err) {
      console.error('Error executing dispatch:', err);
    } finally {
      setAssigning(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'RED':
        return 'bg-rose-600 text-stone-900 font-black animate-pulse';
      case 'ORANGE':
        return 'bg-orange-600 text-stone-900 font-black';
      case 'YELLOW':
        return 'bg-amber-500 text-slate-950 font-bold';
      default:
        return 'bg-emerald-600 text-stone-900 font-bold';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-4 space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            AI Smart Dispatch Engine & Dynamic Ambulance Matching
          </h2>
          <p className="text-xs text-stone-500">
            Powered by Gemini 3.6 Flash. Matches nearest ready ICU/ALS 108 units to critical emergencies based on traffic, distance, & casualty severity.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-950 text-emerald-300 border border-emerald-700 p-3.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Active Incident Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white text-stone-900 p-3 rounded-lg flex items-center justify-between">
            <span className="font-mono font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400" /> Live Emergency Queue
            </span>
            <span className="bg-rose-600 text-stone-900 font-mono font-black text-[10px] px-2 py-0.5 rounded">
              {incidents.filter((i) => i.status !== 'RESOLVED').length} Active
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {incidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    handleRunDispatchAi(inc.id);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-sky-50 border-sky-600 shadow-md ring-1 ring-sky-500'
                      : 'bg-cream border-stone-200 hover:border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-stone-900">{inc.code}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${getPriorityBadge(inc.priority)}`}>
                      {inc.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900">{inc.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-400" /> {inc.locationName}
                    </span>
                    <span className="font-semibold text-rose-400">{inc.patientCount} Casualties</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Dispatch Matching & Assignment Console */}
        <div className="lg:col-span-8 space-y-4">
          {currentIncident ? (
            <div className="bg-cream rounded-lg border border-stone-200 p-4 space-y-4">
              {/* Incident Summary Card */}
              <div className="bg-white text-stone-900 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-amber-400 text-sm">{currentIncident.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getPriorityBadge(currentIncident.priority)}`}>
                      {currentIncident.priority} TRIAGE
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900 mt-1">{currentIncident.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Location: {currentIncident.locationName}, {currentIncident.districtName} • Reported by: {currentIncident.reportedBy}
                  </p>
                </div>

                <button
                  onClick={() => handleRunDispatchAi(currentIncident.id)}
                  disabled={loading}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs shadow flex items-center justify-center space-x-1.5 uppercase shrink-0"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>{loading ? 'Analyzing...' : 'Re-Run AI Dispatcher'}</span>
                </button>
              </div>

              {loading && (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white rounded border p-6 text-center">
                  <Activity className="w-8 h-8 text-sky-400 animate-spin" />
                  <h4 className="font-bold text-stone-900 text-sm">Gemini 3.6 Smart Dispatcher Processing...</h4>
                  <p className="text-xs text-stone-500 max-w-sm">
                    Evaluating GPS distances, unit equipment readiness, and traffic congestion models.
                  </p>
                </div>
              )}

              {recommendation && !loading && (
                <div className="space-y-4">
                  {/* AI Match Banner */}
                  <div className="bg-cream text-stone-900 p-4 rounded-lg border border-sky-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="text-xs font-bold text-sky-400 font-mono flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400" /> GEMINI AI DISPATCH RECOMMENDATION
                      </span>
                      <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded">
                        {recommendation.suitabilityScore}% SUITABILITY MATCH
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] text-stone-500 font-mono uppercase">Primary Match Unit</span>
                        <div className="text-base font-mono font-black text-sky-300">{recommendation.bestAmbulanceReg}</div>
                        <span className="text-xs text-stone-600">{recommendation.bestAmbulanceType} Unit</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-500 font-mono uppercase">Estimated Response ETA</span>
                        <div className="text-base font-mono font-black text-amber-400">~{recommendation.estimatedEtaMin} MIN</div>
                        <span className="text-xs text-stone-600">{recommendation.distanceKm} km distance</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-500 font-mono uppercase">Target Hospital</span>
                        <div className="text-xs font-bold text-stone-900 truncate">{recommendation.recommendedHospitalName}</div>
                        <span className="text-[11px] text-emerald-400">Capacity Verified</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 italic bg-white p-2.5 rounded border border-stone-200">
                      "{recommendation.aiRationale}"
                    </p>
                  </div>

                  {/* Candidate Ambulances Selection List */}
                  <div className="bg-white p-3.5 rounded-lg border border-stone-200 space-y-2 text-xs">
                    <h4 className="font-extrabold text-stone-900 flex items-center justify-between">
                      <span>Select Response Ambulance Unit:</span>
                      <span className="text-stone-500 text-[11px] font-normal">Ranked by proximity & equipment</span>
                    </h4>

                    <div className="space-y-2">
                      {ambulances
                        .filter((a) => a.status === 'AVAILABLE' || a.id === recommendation.bestAmbulanceId)
                        .map((amb) => {
                          const isSelected = amb.id === selectedAmbulanceId;
                          const isBest = amb.id === recommendation.bestAmbulanceId;

                          return (
                            <div
                              key={amb.id}
                              onClick={() => setSelectedAmbulanceId(amb.id)}
                              className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-500'
                                  : 'bg-cream border-stone-200 hover:border-stone-200'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name="selectedAmbulance"
                                  checked={isSelected}
                                  onChange={() => setSelectedAmbulanceId(amb.id)}
                                  className="accent-sky-600"
                                />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono font-black text-stone-900 text-sm">{amb.registrationNo}</span>
                                    <span className="font-bold text-amber-400 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                                      {amb.type}
                                    </span>
                                    {isBest && (
                                      <span className="bg-emerald-600 text-stone-900 text-[10px] font-black px-1.5 py-0.5 rounded">
                                        AI TOP PICK
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-stone-500 block mt-0.5">
                                    Base: {amb.baseHospital} • Driver: {amb.driverName} ({amb.phone})
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="font-mono font-bold text-sky-900 text-xs block">
                                  {amb.status === 'AVAILABLE' ? 'READY' : amb.status}
                                </span>
                                <span className="text-[10px] text-stone-500">Fuel: {amb.fuelLevel ?? 100}%</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Destination Hospital Selection & Green Corridor Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3.5 rounded-lg border border-stone-200 text-xs">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Target Receiving Hospital:</label>
                      <select
                        value={selectedHospitalId}
                        onChange={(e) => setSelectedHospitalId(e.target.value)}
                        className="w-full px-3 py-2 bg-cream border border-stone-200 rounded font-semibold text-stone-900"
                      >
                        {hospitals.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.districtName}) - ICU Beds: {h.availableIcuBeds}/{h.totalIcuBeds}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between bg-amber-50 p-3 rounded border border-amber-200">
                      <div>
                        <span className="font-bold text-amber-900 block flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-600" /> Green Corridor Traffic Override
                        </span>
                        <span className="text-[11px] text-amber-400">Automates traffic light overrides along response path</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={greenCorridor}
                        onChange={(e) => setGreenCorridor(e.target.checked)}
                        className="w-5 h-5 accent-amber-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Dispatch Action Button */}
                  <button
                    onClick={handleExecuteDispatch}
                    disabled={assigning}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-3 rounded-lg text-sm shadow-md transition-all uppercase flex items-center justify-center space-x-2"
                  >
                    {assigning ? (
                      <span>ISSUING DISPATCH ORDER...</span>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        <span>CONFIRM DISPATCH & TRANSMIT TO DRIVER WORKSPACE</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 bg-cream rounded border">
              Select an emergency incident from the queue to run AI Smart Dispatch.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
