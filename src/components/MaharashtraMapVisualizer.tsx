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
    label: 'CartoDB Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  satellite: {
    label: 'ESRI Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  dark: {
    label: 'CartoDB Dark',
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
  const [basemap, setBasemap] = useState<Basemap>('voyager');
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);

  const activeDistrict = useMemo(
    () => districts.find((district) => district.id === selectedDistrict),
    [districts, selectedDistrict],
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
    const visibleDistricts = selectedDistrict === 'all'
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
        title: `${district.name} — ${district.riskLevel}`,
      });

      marker.on('click', () => onSelectDistrict(district.id));
      marker.on('mouseover', () => setHoveredDistrict(district));
      marker.on('mouseout', () => setHoveredDistrict(null));
      marker.bindTooltip(
        `<strong>${district.name}</strong><br/>${district.currentEmergencies} active emergencies · ${district.availableAmbulances} ambulances ready`,
        { direction: 'top', offset: [0, -18], opacity: 0.95 },
      );
      marker.addTo(markerLayer);
    });

    const center = activeDistrict?.coordinates ?? { lat: 19.7515, lng: 75.7139 };
    map.setView([center.lat, center.lng], selectedDistrict === 'all' ? 7 : 11, { animate: true });
  }, [activeDistrict, districts, onSelectDistrict, selectedDistrict]);

  return (
    <div className="bg-white text-stone-900 rounded-lg border border-stone-200 p-4 shadow-md relative overflow-hidden">
      <style>{`.rakshak-district-marker { background: transparent; border: 0; } .rakshak-district-marker span { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border:3px solid; border-radius:999px; color:#fff; font:900 10px ui-monospace, SFMono-Regular, Menlo, monospace; box-shadow:0 0 0 4px rgba(255,255,255,.8), 0 4px 12px rgba(15,23,42,.35); } .rakshak-district-marker:hover span { transform:scale(1.12); }`}</style>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            Maharashtra State Pilot EOC Mesh Network Map
          </h3>
          <p className="text-[11px] text-stone-500">
            Leaflet / OpenStreetMap fallback telecasting layer for district emergency operations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span className="font-mono text-stone-600">LIVE SPATIAL FEED</span>
          <select
            value={basemap}
            onChange={(event) => setBasemap(event.target.value as Basemap)}
            className="px-2 py-1 bg-cream border border-stone-200 rounded font-semibold text-stone-700"
            aria-label="Select GIS basemap"
          >
            {Object.entries(TILE_LAYERS).map(([key, layer]) => (
              <option key={key} value={key}>{layer.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2 text-[10px]">
        <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-1 text-stone-600"><Layers className="w-3 h-3" /> {selectedDistrict === 'all' ? 'Statewide' : activeDistrict?.name}</span>
        <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-1 text-rose-700"><Flame className="w-3 h-3" /> {districts.reduce((sum, d) => sum + d.currentEmergencies, 0)} emergencies</span>
        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-emerald-700"><Truck className="w-3 h-3" /> {districts.reduce((sum, d) => sum + d.availableAmbulances, 0)} ambulances ready</span>
        <span className="inline-flex items-center gap-1 rounded bg-sky-50 px-2 py-1 text-sky-700"><Building2 className="w-3 h-3" /> {districts.reduce((sum, d) => sum + d.hospitalsCount, 0)} hospitals</span>
      </div>

      <div className="relative w-full h-[320px] rounded border border-stone-200 overflow-hidden bg-cream">
        <div ref={mapElement} className="w-full h-full" aria-label="Interactive Maharashtra GIS fallback map" />
        {hoveredDistrict && (
          <div className="absolute bottom-3 left-3 bg-white/95 border border-sky-500/50 p-3 rounded-lg shadow-lg text-xs w-64 z-[1000] pointer-events-none">
            <div className="flex items-center justify-between border-b border-stone-200 pb-1 mb-2">
              <span className="font-extrabold text-stone-900 text-sm">{hoveredDistrict.name} ({hoveredDistrict.marathiName})</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: RISK_COLORS[hoveredDistrict.riskLevel] }}>{hoveredDistrict.riskLevel}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-stone-600">
              <div><span className="text-stone-500 block text-[10px]">Emergencies:</span><span className="font-bold text-rose-600 text-sm">{hoveredDistrict.currentEmergencies}</span></div>
              <div><span className="text-stone-500 block text-[10px]">ICU Beds Free:</span><span className="font-bold text-sky-600 text-sm">{hoveredDistrict.availableIcuBeds} / {hoveredDistrict.totalIcuBeds}</span></div>
              <div><span className="text-stone-500 block text-[10px]">108 Ambulances:</span><span className="font-bold text-emerald-600">{hoveredDistrict.availableAmbulances} ready</span></div>
              <div><span className="text-stone-500 block text-[10px]">Avg Response:</span><span className="font-bold text-amber-600">{hoveredDistrict.avgResponseTimeMin} min</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
