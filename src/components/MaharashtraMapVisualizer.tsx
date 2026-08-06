import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Building2, Flame, Layers, MapPin, Radio, Truck } from 'lucide-react';
import { District } from '../types';

interface MapProps {
  districts: District[];
  selectedDistrict: string;
  onSelectDistrict: (id: string) => void;
}

type Basemap = 'voyager' | 'satellite' | 'dark';

const TILE_LAYERS: Record<Basemap, { label: string; url: string; attribution: string }> = {
  voyager: {
    label: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  dark: {
    label: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
};

const RISK_COLORS: Record<District['riskLevel'], string> = {
  CRITICAL: '#DC2626',
  HIGH: '#EA580C',
  ELEVATED: '#D97706',
  NORMAL: '#059669',
};

export const MaharashtraMapVisualizer: React.FC<MapProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
}) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [basemap, setBasemap] = useState<Basemap>('satellite');
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);

  const activeDistrict = useMemo(
    () => districts.find((district) => district.id === selectedDistrict),
    [districts, selectedDistrict],
  );

  const summary = useMemo(
    () => ({
      emergencies: districts.reduce((sum, district) => sum + district.currentEmergencies, 0),
      ambulances: districts.reduce((sum, district) => sum + district.availableAmbulances, 0),
      hospitals: districts.reduce((sum, district) => sum + district.hospitalsCount, 0),
    }),
    [districts],
  );

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;

    const map = L.map(mapElement.current, {
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
    }).setView([19.7515, 75.7139], 7);

    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      markersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const element = mapElement.current;
    if (!map || !element) return;

    const observer = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    tileLayerRef.current?.remove();
    const layer = TILE_LAYERS[basemap];
    tileLayerRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
  }, [basemap]);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markersRef.current;
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();
    const visibleDistricts =
      selectedDistrict === 'all'
        ? districts
        : districts.filter((district) => district.id === selectedDistrict);

    visibleDistricts.forEach((district) => {
      const color = RISK_COLORS[district.riskLevel];
      const marker = L.marker([district.coordinates.lat, district.coordinates.lng], {
        icon: L.divIcon({
          className: 'rakshak-district-marker',
          html: `<span style="background:${color};border-color:${color};">${district.code}</span>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        }),
        title: `${district.name} - ${district.riskLevel}`,
      });

      marker.on('click', () => onSelectDistrict(district.id));
      marker.on('mouseover', () => setHoveredDistrict(district));
      marker.on('mouseout', () => setHoveredDistrict(null));
      marker.bindTooltip(
        `<strong>${district.name}</strong><br/>${district.currentEmergencies} active emergencies - ${district.availableAmbulances} ambulances ready`,
        { direction: 'top', offset: [0, -18], opacity: 0.95 },
      );
      marker.addTo(markerLayer);
    });

    const center = activeDistrict?.coordinates ?? { lat: 19.7515, lng: 75.7139 };
    map.setView([center.lat, center.lng], selectedDistrict === 'all' ? 7 : 11, { animate: true });
  }, [activeDistrict, districts, onSelectDistrict, selectedDistrict]);

  return (
    <section className="card flex h-full flex-col overflow-hidden">
      <style>{`.rakshak-district-marker{background:transparent;border:0}.rakshak-district-marker span{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border:3px solid;border-radius:999px;color:#fff;font:800 10px ui-monospace,SFMono-Regular,Menlo,monospace;box-shadow:0 0 0 4px rgba(255,255,255,.85),0 8px 18px rgba(15,23,42,.28);transition:transform .2s ease}.rakshak-district-marker:hover span{transform:scale(1.08)}`}</style>

      <div className="flex flex-col gap-4 border-b border-stone-200 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="label">Live Spatial Mesh</div>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-stone-950">
            <MapPin className="h-5 w-5 text-cyan-700" />
            Maharashtra GIS overview
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-sm font-semibold text-emerald-800">
            <Radio className="h-4 w-4" />
            Live feed
          </span>
          <label className="sr-only" htmlFor="maharashtra-basemap">
            Select GIS basemap
          </label>
          <select
            id="maharashtra-basemap"
            value={basemap}
            onChange={(event) => setBasemap(event.target.value as Basemap)}
            className="h-9 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700"
          >
            {Object.entries(TILE_LAYERS).map(([key, layer]) => (
              <option key={key} value={key}>
                {layer.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid flex-1 gap-0 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative h-full min-h-[460px] bg-cream xl:min-h-[520px]">
          <div ref={mapElement} className="h-full w-full" aria-label="Interactive Maharashtra GIS fallback map" />
          {hoveredDistrict && (
            <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] w-64 rounded-lg border border-stone-200 bg-white/95 p-3 text-xs shadow-lg shadow-stone-300/30">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-stone-950">{hoveredDistrict.name}</div>
                  <div className="font-mono text-[11px] text-stone-500">{hoveredDistrict.code}</div>
                </div>
                <span
                  className="rounded-full px-2 py-1 text-[10px] font-bold text-white"
                  style={{ backgroundColor: RISK_COLORS[hoveredDistrict.riskLevel] }}
                >
                  {hoveredDistrict.riskLevel}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    Emergencies
                  </span>
                  <div className="font-mono text-base font-semibold text-rose-700">
                    {hoveredDistrict.currentEmergencies}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    ICU Free
                  </span>
                  <div className="font-mono text-base font-semibold text-cyan-800">
                    {hoveredDistrict.availableIcuBeds}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-stone-200 bg-white p-4 lg:border-l lg:border-t-0">
          <div className="label mb-3">Map Layers</div>
          <div className="space-y-3">
            <div className="rounded-lg bg-stone-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <Layers className="h-4 w-4 text-cyan-700" />
                {selectedDistrict === 'all' ? 'Statewide' : activeDistrict?.name}
              </div>
            </div>
            <div className="rounded-lg bg-rose-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-800">
                <Flame className="h-4 w-4" />
                {summary.emergencies} emergencies
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <Truck className="h-4 w-4" />
                {summary.ambulances} ambulances ready
              </div>
            </div>
            <div className="rounded-lg bg-cyan-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-800">
                <Building2 className="h-4 w-4" />
                {summary.hospitals} hospitals
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
