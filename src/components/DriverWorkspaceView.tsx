import React, { useState, useEffect } from 'react';
import {
  Navigation,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Building2,
  ArrowRight,
  Radio,
  Gauge,
  User,
  Heart,
  Zap,
  Activity,
  Check,
} from 'lucide-react';
import { AmbulanceMission, MissionStage, Ambulance, RouteDetails } from '../types';

interface DriverWorkspaceProps {
  missions: AmbulanceMission[];
  ambulances: Ambulance[];
  onMissionStageUpdated?: (missionId: string, nextStage: MissionStage) => void;
}

export const DriverWorkspaceView: React.FC<DriverWorkspaceProps> = ({
  missions,
  ambulances,
  onMissionStageUpdated,
}) => {
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>(
    ambulances.find((a) => a.currentMissionId)?.id || ambulances[0]?.id || ''
  );

  const [activeMission, setActiveMission] = useState<AmbulanceMission | null>(null);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [updatingStage, setUpdatingStage] = useState(false);
  const [stageNote, setStageNote] = useState('');

  const currentAmbulance = ambulances.find((a) => a.id === selectedAmbulanceId);

  // Find assigned mission for current ambulance
  useEffect(() => {
    const found = missions.find(
      (m) => m.ambulanceId === selectedAmbulanceId && m.status !== 'COMPLETED'
    ) || missions[0] || null;

    setActiveMission(found);
    if (found) {
      fetchRoute(found);
    }
  }, [selectedAmbulanceId, missions]);

  // Fetch Route Details
  const fetchRoute = async (mission: AmbulanceMission) => {
    setLoadingRoute(true);
    try {
      const res = await fetch('/api/fleet/routing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: mission.incidentCoords,
          destination: mission.hospitalCoords,
          greenCorridor: mission.greenCorridorActive,
          priority: mission.priority,
        }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        setRouteDetails(data);
      }
    } catch (err) {
      console.error('Routing Error:', err);
    } finally {
      setLoadingRoute(false);
    }
  };

  // Advance Stage Handler
  const handleAdvanceStage = async (nextStage: MissionStage) => {
    if (!activeMission) return;
    setUpdatingStage(true);

    try {
      const res = await fetch(`/api/fleet/missions/${activeMission.id}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nextStage,
          note: stageNote || `Driver advanced stage to ${nextStage}`,
          actorName: currentAmbulance?.driverName || '108 Ambulance Driver',
        }),
      });

      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setActiveMission(data.mission);
          setStageNote('');
          if (onMissionStageUpdated) onMissionStageUpdated(activeMission.id, nextStage);
        }
      }
    } catch (err) {
      console.error('Error advancing mission stage:', err);
    } finally {
      setUpdatingStage(false);
    }
  };

  const getStageStepNumber = (s: MissionStage) => {
    switch (s) {
      case 'DISPATCHED':
      case 'ACCEPTED':
        return 1;
      case 'EN_ROUTE_PATIENT':
        return 2;
      case 'PATIENT_REACHED':
        return 3;
      case 'PATIENT_LOADED':
        return 4;
      case 'EN_ROUTE_HOSPITAL':
        return 5;
      case 'HOSPITAL_ARRIVED':
      case 'COMPLETED':
        return 6;
      default:
        return 1;
    }
  };

  const currentStepNum = activeMission ? getStageStepNumber(activeMission.status) : 1;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
      {/* Title & Unit Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-sky-700" />
            108 Mobile Emergency Driver Workspace & Live Navigation
          </h2>
          <p className="text-xs text-slate-500">
            Field tablet console for ambulance drivers & paramedics. Manage mission lifecycle, turn-by-turn routing, & green corridors.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">Simulate Unit:</span>
          <select
            value={selectedAmbulanceId}
            onChange={(e) => setSelectedAmbulanceId(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md font-mono font-bold text-slate-900"
          >
            {ambulances.map((a) => (
              <option key={a.id} value={a.id}>
                {a.registrationNo} ({a.type}) - {a.driverName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeMission ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Mission Control & Stage Progress */}
          <div className="lg:col-span-7 space-y-4">
            {/* Active Mission Banner */}
            <div className="bg-slate-900 text-white p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-amber-400 text-sm">{activeMission.missionCode}</span>
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {activeMission.priority} PRIORITY
                  </span>
                </div>

                {activeMission.greenCorridorActive && (
                  <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                    <Zap className="w-3 h-3 text-slate-950" /> Green Corridor Active
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">INCIDENT CALLOUT</span>
                <h3 className="text-base font-extrabold text-white">{activeMission.incidentTitle}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" /> {activeMission.incidentLocation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 block">Patient Vitals/Condition:</span>
                  <strong className="text-amber-300">{activeMission.patientCondition}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Receiving Hospital:</span>
                  <strong className="text-sky-300 truncate block">{activeMission.hospitalName}</strong>
                </div>
              </div>
            </div>

            {/* Mission Stage Stepper (6-Step Lifecycle) */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-700" /> Mission Stage Lifecycle Tracker
              </h4>

              <div className="grid grid-cols-6 gap-1.5 text-[10px] font-bold text-center">
                <div className={`p-1.5 rounded border ${currentStepNum >= 1 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-400 border-slate-200'}`}>
                  1. Dispatched
                </div>
                <div className={`p-1.5 rounded border ${currentStepNum >= 2 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-400 border-slate-200'}`}>
                  2. En-Route
                </div>
                <div className={`p-1.5 rounded border ${currentStepNum >= 3 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-400 border-slate-200'}`}>
                  3. Reached
                </div>
                <div className={`p-1.5 rounded border ${currentStepNum >= 4 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-400 border-slate-200'}`}>
                  4. Loaded
                </div>
                <div className={`p-1.5 rounded border ${currentStepNum >= 5 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-400 border-slate-200'}`}>
                  5. To Hospital
                </div>
                <div className={`p-1.5 rounded border ${currentStepNum >= 6 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-400 border-slate-200'}`}>
                  6. Arrived
                </div>
              </div>

              {/* Stage Advance Action Controls */}
              <div className="bg-white p-3.5 rounded border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Current Stage:</span>
                  <span className="font-mono font-black text-sky-900 bg-sky-100 px-2 py-0.5 rounded border border-sky-300 uppercase">
                    {activeMission.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {currentStepNum <= 1 && (
                    <button
                      onClick={() => handleAdvanceStage('EN_ROUTE_PATIENT')}
                      disabled={updatingStage}
                      className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-2.5 rounded shadow text-xs uppercase"
                    >
                      Start En-Route to Patient Site
                    </button>
                  )}

                  {currentStepNum === 2 && (
                    <button
                      onClick={() => handleAdvanceStage('PATIENT_REACHED')}
                      disabled={updatingStage}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-black py-2.5 rounded shadow text-xs uppercase"
                    >
                      Arrived at Incident Site
                    </button>
                  )}

                  {currentStepNum === 3 && (
                    <button
                      onClick={() => handleAdvanceStage('PATIENT_LOADED')}
                      disabled={updatingStage}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-2.5 rounded shadow text-xs uppercase"
                    >
                      Patient Secured & Loaded in Ambulance
                    </button>
                  )}

                  {currentStepNum === 4 && (
                    <button
                      onClick={() => handleAdvanceStage('EN_ROUTE_HOSPITAL')}
                      disabled={updatingStage}
                      className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-2.5 rounded shadow text-xs uppercase"
                    >
                      Start En-Route to Destination Hospital
                    </button>
                  )}

                  {currentStepNum === 5 && (
                    <button
                      onClick={() => handleAdvanceStage('HOSPITAL_ARRIVED')}
                      disabled={updatingStage}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2.5 rounded shadow text-xs uppercase"
                    >
                      Arrived at Hospital Emergency Bay
                    </button>
                  )}

                  {currentStepNum >= 6 && (
                    <button
                      onClick={() => handleAdvanceStage('COMPLETED')}
                      disabled={updatingStage}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 rounded shadow text-xs uppercase"
                    >
                      Close Mission & Set Unit Available
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stage Timeline Log */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 font-mono text-xs uppercase">Mission Execution Timeline</h4>
              <div className="space-y-2 text-[11px]">
                {activeMission.timeline?.map((evt, idx) => (
                  <div key={idx} className="flex items-start justify-between border-b border-slate-100 pb-1.5">
                    <div>
                      <strong className="text-slate-900 block">{evt.title}</strong>
                      <span className="text-slate-500">{evt.note} • By: {evt.actor}</span>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px]">{evt.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Turn-by-Turn Routing & ETA Display */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-sky-400 font-mono flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-sky-400" /> GIS Navigation & ETA
                </span>
                <span className="font-mono font-bold text-amber-400">
                  ~{routeDetails?.etaMin || activeMission.estimatedEtaMin} MIN ETA
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-xs">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Total Distance</span>
                  <span className="text-sm font-black text-white">{routeDetails?.distanceKm || activeMission.totalDistanceKm} KM</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Current Speed</span>
                  <span className="text-sm font-black text-emerald-400">{activeMission.currentSpeedKmH || 65} KM/H</span>
                </div>
              </div>

              {/* Turn-by-Turn Instructions List */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Turn-By-Turn Route Guidance:
                </span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {routeDetails?.turnByTurnInstructions?.map((step, i) => (
                    <div key={i} className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-200 text-xs flex items-center gap-1">
                          <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" /> {step.instruction}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{step.distanceKm} km</span>
                        <span>Speed Limit: {step.speedLimitKmH} km/h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 bg-slate-50 rounded border">
          No active mission assigned to Unit {currentAmbulance?.registrationNo}. Unit status is AVAILABLE.
        </div>
      )}
    </div>
  );
};
