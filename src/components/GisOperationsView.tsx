import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Globe,
  Truck,
  Building2,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  Filter,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Radio,
  Clock,
  Gauge,
  User,
  PhoneCall,
} from 'lucide-react';
import { District, Ambulance, Incident, Hospital, SmartDispatchRecommendation } from '../types';

interface GisProps {
  districts: District[];
  selectedDistrict: string;
  ambulances: Ambulance[];
  incidents: Incident[];
  hospitals: Hospital[];
  onSelectDistrict: (districtId: string) => void;
  onDispatchAssigned?: (mission: any) => void;
}

export const GisOperationsView: React.FC<GisProps> = ({
  districts,
  selectedDistrict,
  ambulances,
  incidents,
  hospitals,
  onSelectDistrict,
  onDispatchAssigned,
}) => {
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

  // Layer Visibility States
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showGreenCorridors, setShowGreenCorridors] = useState(true);

  // Selected Marker State
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Smart Dispatch State
  const [dispatchRecommendation, setDispatchRecommendation] = useState<SmartDispatchRecommendation | null>(null);
  const [loadingDispatch, setLoadingDispatch] = useState(false);
  const [assigningDispatch, setAssigningDispatch] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  // Filter items by district
  const filteredAmbulances =
    selectedDistrict === 'all'
      ? ambulances
      : ambulances.filter((a) => a.districtId === selectedDistrict);

  const filteredIncidents =
    selectedDistrict === 'all'
      ? incidents
      : incidents.filter((i) => i.districtId === selectedDistrict);

  const filteredHospitals =
    selectedDistrict === 'all'
      ? hospitals
      : hospitals.filter((h) => h.districtId === selectedDistrict);

  // Default Map Coordinates (Center of Maharashtra or selected district)
  const currentDistrictObj = districts.find((d) => d.id === selectedDistrict);
  const mapCenter = currentDistrictObj
    ? { lat: currentDistrictObj.coordinates.lat, lng: currentDistrictObj.coordinates.lng }
    : { lat: 19.7515, lng: 75.7139 }; // Center of Maharashtra

  const mapZoom = selectedDistrict === 'all' ? 7 : 11;

  // Run AI Smart Dispatch recommendation for an incident
  const handleRunSmartDispatch = async (incident: Incident) => {
    setSelectedIncident(incident);
    setLoadingDispatch(true);
    setDispatchRecommendation(null);
    setDispatchSuccessMsg(null);

    try {
      const res = await fetch('/api/fleet/dispatch/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId: incident.id }),
      });
      const data = await res.json();
      if (data.success && data.recommendation) {
        setDispatchRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error('Smart Dispatch Error:', err);
    } finally {
      setLoadingDispatch(false);
    }
  };

  // Confirm Dispatch Assignment
  const handleConfirmAssignment = async () => {
    if (!dispatchRecommendation || !selectedIncident) return;
    setAssigningDispatch(true);

    try {
      const res = await fetch('/api/fleet/dispatch/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: selectedIncident.id,
          ambulanceId: dispatchRecommendation.bestAmbulanceId,
          hospitalId: dispatchRecommendation.recommendedHospitalId,
          greenCorridor: dispatchRecommendation.greenCorridorRecommended,
          officerName: 'State EOC GIS Dispatcher',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDispatchSuccessMsg(
          `Unit ${dispatchRecommendation.bestAmbulanceReg} dispatched to ${selectedIncident.code}! Mission ID: ${data.mission?.missionCode}`
        );
        if (onDispatchAssigned) onDispatchAssigned(data.mission);
        setTimeout(() => {
          setDispatchRecommendation(null);
          setSelectedIncident(null);
          setDispatchSuccessMsg(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Assign Dispatch Error:', err);
    } finally {
      setAssigningDispatch(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-700" />
            GIS Command & Real-Time Emergency Spatial Mesh
          </h2>
          <p className="text-xs text-slate-500">
            Statewide Google Maps GIS tracking for 108 Emergency Ambulances, Live Incidents, and Hospitals across Maharashtra.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800"
          >
            <option value="all">All Pilot Districts (Statewide)</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Control Toolbar & Layer Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white p-2.5 rounded-lg text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-sky-400 font-mono flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Active GIS Layers:
          </span>

          <label className="flex items-center space-x-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded">
            <input
              type="checkbox"
              checked={showAmbulances}
              onChange={(e) => setShowAmbulances(e.target.checked)}
              className="rounded accent-sky-500"
            />
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <Truck className="w-3.5 h-3.5" /> 108 Fleet ({filteredAmbulances.length})
            </span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded">
            <input
              type="checkbox"
              checked={showIncidents}
              onChange={(e) => setShowIncidents(e.target.checked)}
              className="rounded accent-sky-500"
            />
            <span className="flex items-center gap-1 font-semibold text-rose-400">
              <Flame className="w-3.5 h-3.5" /> Incidents ({filteredIncidents.length})
            </span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded">
            <input
              type="checkbox"
              checked={showHospitals}
              onChange={(e) => setShowHospitals(e.target.checked)}
              className="rounded accent-sky-500"
            />
            <span className="flex items-center gap-1 font-semibold text-sky-400">
              <Building2 className="w-3.5 h-3.5" /> Hospitals ({filteredHospitals.length})
            </span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded">
            <input
              type="checkbox"
              checked={showGreenCorridors}
              onChange={(e) => setShowGreenCorridors(e.target.checked)}
              className="rounded accent-sky-500"
            />
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <Zap className="w-3.5 h-3.5" /> Green Corridors
            </span>
          </label>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Live Telemetry Stream: Active
          </span>
        </div>
      </div>

      {/* Main Map Canvas Section */}
      <div className="relative w-full h-[520px] bg-slate-900 rounded-lg overflow-hidden border border-slate-300">
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              id="rakshak-gis-map"
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              defaultCenter={mapCenter}
              defaultZoom={mapZoom}
              gestureHandling={'greedy'}
              fullscreenControl={true}
              className="w-full h-full"
            >
              {/* Ambulance Markers */}
              {showAmbulances &&
                filteredAmbulances.map((amb) => {
                  const lat = amb.location?.lat || 21.1458;
                  const lng = amb.location?.lng || 79.0882;
                  const isAvailable = amb.status === 'AVAILABLE';

                  return (
                    <Marker
                      key={`amb-${amb.id}`}
                      position={{ lat, lng }}
                      onClick={() => {
                        setSelectedAmbulance(amb);
                        setSelectedIncident(null);
                        setSelectedHospital(null);
                      }}
                      title={`${amb.registrationNo} (${amb.type}) - ${amb.status}`}
                    />
                  );
                })}

              {/* Incident Markers */}
              {showIncidents &&
                filteredIncidents.map((inc) => {
                  const lat = inc.coordinates?.lat || 21.0823;
                  const lng = inc.coordinates?.lng || 79.0112;

                  return (
                    <Marker
                      key={`inc-${inc.id}`}
                      position={{ lat, lng }}
                      onClick={() => {
                        setSelectedIncident(inc);
                        setSelectedAmbulance(null);
                        setSelectedHospital(null);
                        handleRunSmartDispatch(inc);
                      }}
                      title={`${inc.code}: ${inc.title} [${inc.priority}]`}
                    />
                  );
                })}

              {/* Hospital Markers */}
              {showHospitals &&
                filteredHospitals.map((hosp) => {
                  const lat = hosp.coordinates.lat;
                  const lng = hosp.coordinates.lng;

                  return (
                    <Marker
                      key={`hosp-${hosp.id}`}
                      position={{ lat, lng }}
                      onClick={() => {
                        setSelectedHospital(hosp);
                        setSelectedAmbulance(null);
                        setSelectedIncident(null);
                      }}
                      title={`${hosp.name} (${hosp.districtName}) - ICU: ${hosp.availableIcuBeds}/${hosp.totalIcuBeds}`}
                    />
                  );
                })}

              {/* InfoWindow for Selected Ambulance */}
              {selectedAmbulance && (
                <InfoWindow
                  position={{
                    lat: selectedAmbulance.location?.lat || 21.1458,
                    lng: selectedAmbulance.location?.lng || 79.0882,
                  }}
                  onCloseClick={() => setSelectedAmbulance(null)}
                >
                  <div className="p-1 max-w-xs text-slate-900 space-y-2">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-extrabold text-xs font-mono bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded">
                        {selectedAmbulance.registrationNo}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {selectedAmbulance.status}
                      </span>
                    </div>
                    <div className="text-xs space-y-1 text-slate-700">
                      <div>
                        <strong>Type:</strong> {selectedAmbulance.type}
                      </div>
                      <div>
                        <strong>Base:</strong> {selectedAmbulance.baseHospital}
                      </div>
                      <div>
                        <strong>Driver:</strong> {selectedAmbulance.driverName} ({selectedAmbulance.phone})
                      </div>
                      <div>
                        <strong>Paramedic:</strong> {selectedAmbulance.paramedicName || 'On Duty'}
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t">
                        <span>Fuel: <strong>{selectedAmbulance.fuelLevel || 100}%</strong></span>
                        <span>Speed: <strong>{selectedAmbulance.speedKmH || 0} km/h</strong></span>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}

              {/* InfoWindow for Selected Hospital */}
              {selectedHospital && (
                <InfoWindow
                  position={{
                    lat: selectedHospital.coordinates.lat,
                    lng: selectedHospital.coordinates.lng,
                  }}
                  onCloseClick={() => setSelectedHospital(null)}
                >
                  <div className="p-1 max-w-xs text-slate-900 space-y-2">
                    <div className="border-b pb-1">
                      <h4 className="font-bold text-xs text-sky-900">{selectedHospital.name}</h4>
                      <p className="text-[10px] text-slate-500">{selectedHospital.districtName} District • {selectedHospital.traumaCenterLevel}</p>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Free ICU Beds:</span>
                        <strong className="text-emerald-700 font-mono">{selectedHospital.availableIcuBeds} / {selectedHospital.totalIcuBeds}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Ventilators:</span>
                        <strong className="text-sky-700 font-mono">{selectedHospital.availableVentilators} / {selectedHospital.totalVentilators}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>ER Status:</span>
                        <strong className="text-amber-700 font-mono">{selectedHospital.emergencyRoomStatus}</strong>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Fallback Spatial Mesh View if Key is not set */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-3 bg-slate-950">
            <Globe className="w-12 h-12 text-sky-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">Statewide GIS Topology Mesh Ready</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Configured with 7 district spatial nodes across Maharashtra. Connect Google Maps Platform Key in secrets to render live Google vector maps.
            </p>
          </div>
        )}

        {/* Floating AI Smart Dispatch Inspector Drawer */}
        {selectedIncident && (
          <div className="absolute top-3 right-3 w-80 bg-slate-900/95 text-white border border-slate-700 rounded-lg shadow-2xl p-4 backdrop-blur-md z-20 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-extrabold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Smart Dispatcher
              </span>
              <button
                onClick={() => {
                  setSelectedIncident(null);
                  setDispatchRecommendation(null);
                }}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sky-400">{selectedIncident.code}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
                  {selectedIncident.priority}
                </span>
              </div>
              <h4 className="font-bold text-white text-xs">{selectedIncident.title}</h4>
              <p className="text-[11px] text-slate-300">{selectedIncident.locationName}, {selectedIncident.districtName}</p>
            </div>

            {loadingDispatch && (
              <div className="py-6 flex flex-col items-center space-y-2 text-sky-400 font-mono text-xs">
                <Activity className="w-6 h-6 animate-spin" />
                <span>Gemini 3.6 Dispatcher Analyzing GPS & Traffic...</span>
              </div>
            )}

            {dispatchSuccessMsg && (
              <div className="bg-emerald-950 text-emerald-300 border border-emerald-700 p-3 rounded font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{dispatchSuccessMsg}</span>
              </div>
            )}

            {dispatchRecommendation && !loadingDispatch && !dispatchSuccessMsg && (
              <div className="space-y-3">
                <div className="bg-slate-950 p-3 rounded border border-sky-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">RECOMMENDED UNIT</span>
                    <span className="bg-sky-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded">
                      {dispatchRecommendation.suitabilityScore}% MATCH
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono font-black text-sm text-sky-400">
                      {dispatchRecommendation.bestAmbulanceReg}
                    </span>
                    <span className="text-amber-400 font-bold font-mono">
                      ETA ~{dispatchRecommendation.estimatedEtaMin} MIN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 italic border-t border-slate-800 pt-1.5">
                    "{dispatchRecommendation.aiRationale}"
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Target Hospital:</span>
                    <strong className="text-white">{dispatchRecommendation.recommendedHospitalName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Green Corridor:</span>
                    <strong className={dispatchRecommendation.greenCorridorRecommended ? 'text-amber-400' : 'text-slate-400'}>
                      {dispatchRecommendation.greenCorridorRecommended ? 'RECOMMENDED (ACTIVE)' : 'STANDARD ROUTE'}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={handleConfirmAssignment}
                  disabled={assigningDispatch}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2 rounded shadow-md transition-all flex items-center justify-center space-x-1.5 uppercase text-xs"
                >
                  {assigningDispatch ? (
                    <span>DISPATCHING UNIT...</span>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>CONFIRM & EXECUTE DISPATCH</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
