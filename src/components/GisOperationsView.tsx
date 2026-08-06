import React, { useMemo, useState } from 'react';
import { APIProvider, InfoWindow, Map, Marker } from '@vis.gl/react-google-maps';
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Flame,
  Globe,
  Layers,
  MapPin,
  Radio,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import { Ambulance, District, Hospital, Incident, SmartDispatchRecommendation } from '../types';

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

  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showGreenCorridors, setShowGreenCorridors] = useState(true);

  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const [dispatchRecommendation, setDispatchRecommendation] =
    useState<SmartDispatchRecommendation | null>(null);
  const [loadingDispatch, setLoadingDispatch] = useState(false);
  const [assigningDispatch, setAssigningDispatch] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  const filteredAmbulances = useMemo(
    () =>
      selectedDistrict === 'all'
        ? ambulances
        : ambulances.filter((ambulance) => ambulance.districtId === selectedDistrict),
    [ambulances, selectedDistrict],
  );

  const filteredIncidents = useMemo(
    () =>
      selectedDistrict === 'all'
        ? incidents
        : incidents.filter((incident) => incident.districtId === selectedDistrict),
    [incidents, selectedDistrict],
  );

  const filteredHospitals = useMemo(
    () =>
      selectedDistrict === 'all'
        ? hospitals
        : hospitals.filter((hospital) => hospital.districtId === selectedDistrict),
    [hospitals, selectedDistrict],
  );

  const currentDistrictObj = districts.find((district) => district.id === selectedDistrict);
  const mapCenter = currentDistrictObj
    ? { lat: currentDistrictObj.coordinates.lat, lng: currentDistrictObj.coordinates.lng }
    : { lat: 19.7515, lng: 75.7139 };
  const mapZoom = selectedDistrict === 'all' ? 7 : 11;

  const availableAmbulances = filteredAmbulances.filter(
    (ambulance) => ambulance.status === 'AVAILABLE',
  ).length;
  const availableIcuBeds = filteredHospitals.reduce(
    (sum, hospital) => sum + hospital.availableIcuBeds,
    0,
  );
  const priorityCorridors = filteredIncidents.filter(
    (incident) => incident.priority === 'RED' || incident.severity === 'CRITICAL',
  ).length;

  const handleRunSmartDispatch = async (incident: Incident) => {
    setSelectedIncident(incident);
    setSelectedAmbulance(null);
    setSelectedHospital(null);
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
          `Unit ${dispatchRecommendation.bestAmbulanceReg} dispatched to ${selectedIncident.code}. Mission ID: ${data.mission?.missionCode}`,
        );
        onDispatchAssigned?.(data.mission);
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

  const layerToggles = [
    {
      label: '108 Fleet',
      count: filteredAmbulances.length,
      enabled: showAmbulances,
      onToggle: () => setShowAmbulances((value) => !value),
      icon: Truck,
      activeClass: 'bg-emerald-700 text-white border-emerald-700',
      inactiveClass: 'text-stone-700 hover:border-emerald-200 hover:bg-emerald-50',
    },
    {
      label: 'Incidents',
      count: filteredIncidents.length,
      enabled: showIncidents,
      onToggle: () => setShowIncidents((value) => !value),
      icon: Flame,
      activeClass: 'bg-rose-700 text-white border-rose-700',
      inactiveClass: 'text-stone-700 hover:border-rose-200 hover:bg-rose-50',
    },
    {
      label: 'Hospitals',
      count: filteredHospitals.length,
      enabled: showHospitals,
      onToggle: () => setShowHospitals((value) => !value),
      icon: Building2,
      activeClass: 'bg-cyan-700 text-white border-cyan-700',
      inactiveClass: 'text-stone-700 hover:border-cyan-200 hover:bg-cyan-50',
    },
    {
      label: 'Corridors',
      count: priorityCorridors,
      enabled: showGreenCorridors,
      onToggle: () => setShowGreenCorridors((value) => !value),
      icon: Zap,
      activeClass: 'bg-amber-600 text-white border-amber-600',
      inactiveClass: 'text-stone-700 hover:border-amber-200 hover:bg-amber-50',
    },
  ];

  const priorityBadgeClass = (priority: Incident['priority']) => {
    if (priority === 'RED') return 'bg-rose-700 text-white';
    if (priority === 'ORANGE') return 'bg-orange-100 text-orange-800';
    if (priority === 'YELLOW') return 'bg-amber-100 text-amber-800';
    return 'bg-emerald-100 text-emerald-800';
  };

  return (
    <section className="space-y-5">
      <div className="card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="label">GIS Operations</div>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-stone-950">
              <Globe className="h-6 w-6 text-cyan-700" />
              Emergency spatial command
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
              Google Maps primary engine with real-time ambulance, incident, hospital, and green corridor layers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="gis-district-scope">
              Select district scope
            </label>
            <select
              id="gis-district-scope"
              value={selectedDistrict}
              onChange={(event) => onSelectDistrict(event.target.value)}
              className="h-10 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-800"
            >
              <option value="all">All Pilot Districts</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name} ({district.code})
                </option>
              ))}
            </select>
            <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-sm font-semibold text-emerald-800">
              <Radio className="h-4 w-4" />
              Telemetry live
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-rose-50 p-3">
            <div className="text-xs font-semibold text-rose-700">Active incidents</div>
            <div className="mt-1 font-mono text-2xl font-semibold text-stone-950">
              {filteredIncidents.length}
            </div>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3">
            <div className="text-xs font-semibold text-emerald-800">Fleet ready</div>
            <div className="mt-1 font-mono text-2xl font-semibold text-stone-950">
              {availableAmbulances}
            </div>
          </div>
          <div className="rounded-lg bg-cyan-50 p-3">
            <div className="text-xs font-semibold text-cyan-800">ICU beds free</div>
            <div className="mt-1 font-mono text-2xl font-semibold text-stone-950">
              {availableIcuBeds}
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <div className="text-xs font-semibold text-amber-800">Priority corridors</div>
            <div className="mt-1 font-mono text-2xl font-semibold text-stone-950">
              {priorityCorridors}
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-stone-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <Layers className="h-4 w-4 text-cyan-700" />
            Visible layers
          </div>
          <div className="flex flex-wrap gap-2">
            {layerToggles.map((layer) => {
              const Icon = layer.icon;
              return (
                <button
                  key={layer.label}
                  type="button"
                  aria-pressed={layer.enabled}
                  onClick={layer.onToggle}
                  className={`flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors duration-200 ${
                    layer.enabled
                      ? layer.activeClass
                      : `border-stone-200 bg-white ${layer.inactiveClass}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{layer.label}</span>
                  <span className={layer.enabled ? 'text-white/80' : 'text-stone-500'}>
                    {layer.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative h-[620px] w-full bg-cream">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <Map
                id="rakshak-gis-map"
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                center={mapCenter}
                zoom={mapZoom}
                mapTypeId="satellite"
                gestureHandling="greedy"
                fullscreenControl
                className="h-full w-full"
              >
                {showAmbulances &&
                  filteredAmbulances.map((ambulance) => (
                    <Marker
                      key={`amb-${ambulance.id}`}
                      position={{
                        lat: ambulance.location?.lat || 21.1458,
                        lng: ambulance.location?.lng || 79.0882,
                      }}
                      onClick={() => {
                        setSelectedAmbulance(ambulance);
                        setSelectedIncident(null);
                        setSelectedHospital(null);
                      }}
                      title={`${ambulance.registrationNo} (${ambulance.type}) - ${ambulance.status}`}
                    />
                  ))}

                {showIncidents &&
                  filteredIncidents.map((incident) => (
                    <Marker
                      key={`inc-${incident.id}`}
                      position={{
                        lat: incident.coordinates?.lat || 21.0823,
                        lng: incident.coordinates?.lng || 79.0112,
                      }}
                      onClick={() => handleRunSmartDispatch(incident)}
                      title={`${incident.code}: ${incident.title} [${incident.priority}]`}
                    />
                  ))}

                {showHospitals &&
                  filteredHospitals.map((hospital) => (
                    <Marker
                      key={`hosp-${hospital.id}`}
                      position={{ lat: hospital.lat, lng: hospital.lng }}
                      onClick={() => {
                        setSelectedHospital(hospital);
                        setSelectedAmbulance(null);
                        setSelectedIncident(null);
                      }}
                      title={`${hospital.name} (${hospital.districtName}) - ICU: ${hospital.availableIcuBeds}/${hospital.totalIcuBeds}`}
                    />
                  ))}

                {selectedAmbulance && (
                  <InfoWindow
                    position={{
                      lat: selectedAmbulance.location?.lat || 21.1458,
                      lng: selectedAmbulance.location?.lng || 79.0882,
                    }}
                    onCloseClick={() => setSelectedAmbulance(null)}
                  >
                    <div className="max-w-xs space-y-2 p-1 text-xs text-stone-800">
                      <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-2">
                        <span className="font-mono font-bold text-cyan-800">
                          {selectedAmbulance.registrationNo}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800">
                          {selectedAmbulance.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div>Type: {selectedAmbulance.type}</div>
                        <div>Base: {selectedAmbulance.baseHospital}</div>
                        <div>Driver: {selectedAmbulance.driverName}</div>
                        <div>Phone: {selectedAmbulance.phone}</div>
                        <div className="border-t border-stone-200 pt-2">
                          Fuel {selectedAmbulance.fuelLevel || 100}% - Speed{' '}
                          {selectedAmbulance.speedKmH || 0} km/h
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}

                {selectedIncident && (
                  <InfoWindow
                    position={{
                      lat: selectedIncident.coordinates?.lat || 21.0823,
                      lng: selectedIncident.coordinates?.lng || 79.0112,
                    }}
                    onCloseClick={() => {
                      setSelectedIncident(null);
                      setDispatchRecommendation(null);
                    }}
                  >
                    <div className="max-w-xs space-y-2 p-1 text-xs text-stone-800">
                      <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-2">
                        <span className="font-mono font-bold text-cyan-800">
                          {selectedIncident.code}
                        </span>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${priorityBadgeClass(selectedIncident.priority)}`}>
                          {selectedIncident.priority}
                        </span>
                      </div>
                      <div className="font-semibold text-stone-950">{selectedIncident.title}</div>
                      <div>{selectedIncident.locationName}, {selectedIncident.districtName}</div>
                      <div>{selectedIncident.affectedCount} patient(s)</div>
                      <div>Receiving center: {selectedIncident.assignedHospitalName || 'Pending dispatch'}</div>
                    </div>
                  </InfoWindow>
                )}

                {selectedHospital && (
                  <InfoWindow
                    position={{ lat: selectedHospital.lat, lng: selectedHospital.lng }}
                    onCloseClick={() => setSelectedHospital(null)}
                  >
                    <div className="max-w-xs space-y-2 p-1 text-xs text-stone-800">
                      <div className="border-b border-stone-200 pb-2">
                        <div className="font-bold text-stone-950">{selectedHospital.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {selectedHospital.districtName} - {selectedHospital.traumaLevel}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span>Free ICU beds</span>
                          <strong className="font-mono text-emerald-800">
                            {selectedHospital.availableIcuBeds}/{selectedHospital.totalIcuBeds}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Ventilators</span>
                          <strong className="font-mono text-cyan-800">
                            {selectedHospital.availableVentilators}/{selectedHospital.totalVentilators}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>ER status</span>
                          <strong className="font-mono text-amber-800">
                            {selectedHospital.emergencyDeptStatus}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-cream p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-cyan-800">
                <Globe className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-stone-950">GIS topology mesh ready</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                Add the Google Maps Platform key to render the live Google vector map. The Maharashtra Leaflet view remains available on the home dashboard.
              </p>
            </div>
          )}

          {showGreenCorridors && priorityCorridors > 0 && (
            <div className="absolute bottom-4 left-4 z-10 rounded-lg border border-amber-200 bg-white/95 p-3 shadow-lg shadow-stone-300/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                <Zap className="h-4 w-4" />
                {priorityCorridors} priority corridor{priorityCorridors === 1 ? '' : 's'} monitored
              </div>
            </div>
          )}

          {selectedIncident && (
            <div className="absolute right-3 top-3 z-20 w-[360px] max-w-[calc(100%-1.5rem)] rounded-lg border border-stone-200 bg-white/95 p-4 text-sm text-stone-800 shadow-xl shadow-stone-400/20 backdrop-blur">
              <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <div className="label">Smart Dispatch</div>
                  <div className="mt-1 flex items-center gap-2 font-bold text-stone-950">
                    <Zap className="h-4 w-4 text-amber-600" />
                    Gemini recommendation
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedIncident(null);
                    setDispatchRecommendation(null);
                  }}
                  aria-label="Close dispatch drawer"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-stone-500 transition-colors duration-200 hover:bg-stone-100 hover:text-stone-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 rounded-lg bg-stone-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold text-cyan-800">
                    {selectedIncident.code}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${priorityBadgeClass(selectedIncident.priority)}`}>
                    {selectedIncident.priority}
                  </span>
                </div>
                <div className="mt-2 font-semibold text-stone-950">{selectedIncident.title}</div>
                <div className="mt-1 text-xs text-stone-500">
                  {selectedIncident.locationName}, {selectedIncident.districtName}
                </div>
              </div>

              {loadingDispatch && (
                <div className="flex flex-col items-center gap-2 py-8 text-center text-sm font-semibold text-cyan-800">
                  <Activity className="h-6 w-6 animate-spin" />
                  <span>Analyzing proximity, equipment, traffic, and bed capacity...</span>
                </div>
              )}

              {dispatchSuccessMsg && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{dispatchSuccessMsg}</span>
                </div>
              )}

              {dispatchRecommendation && !loadingDispatch && !dispatchSuccessMsg && (
                <div className="mt-3 space-y-3">
                  <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-800">
                        Recommended unit
                      </span>
                      <span className="rounded-full bg-cyan-700 px-2 py-1 font-mono text-[10px] font-bold text-white">
                        {dispatchRecommendation.suitabilityScore}% match
                      </span>
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <span className="font-mono text-lg font-bold text-stone-950">
                        {dispatchRecommendation.bestAmbulanceReg}
                      </span>
                      <span className="font-mono text-sm font-bold text-amber-800">
                        ETA {dispatchRecommendation.estimatedEtaMin}m
                      </span>
                    </div>
                    <p className="mt-3 border-t border-cyan-100 pt-3 text-xs leading-5 text-stone-600">
                      {dispatchRecommendation.aiRationale}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-stone-500">
                        <Building2 className="h-3.5 w-3.5" />
                        Target hospital
                      </span>
                      <strong className="text-right text-stone-950">
                        {dispatchRecommendation.recommendedHospitalName}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-stone-500">
                        <MapPin className="h-3.5 w-3.5" />
                        Distance
                      </span>
                      <strong className="font-mono text-stone-950">
                        {dispatchRecommendation.distanceKm} km
                      </strong>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-stone-500">
                        <Zap className="h-3.5 w-3.5" />
                        Green corridor
                      </span>
                      <strong
                        className={
                          dispatchRecommendation.greenCorridorRecommended
                            ? 'text-amber-800'
                            : 'text-stone-600'
                        }
                      >
                        {dispatchRecommendation.greenCorridorRecommended ? 'Recommended' : 'Standard route'}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmAssignment}
                    disabled={assigningDispatch}
                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white transition-colors duration-200 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  >
                    {assigningDispatch ? (
                      <span>Dispatching unit...</span>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4" />
                        <span>Confirm Dispatch</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
