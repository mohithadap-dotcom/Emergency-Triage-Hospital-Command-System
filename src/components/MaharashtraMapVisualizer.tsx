import React, { useState } from 'react';
import { MapPin, ShieldAlert, Building2, Flame, BedDouble, AlertCircle } from 'lucide-react';
import { District } from '../types';

interface MapProps {
  districts: District[];
  selectedDistrict: string;
  onSelectDistrict: (id: string) => void;
}

export const MaharashtraMapVisualizer: React.FC<MapProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);

  // Approximate relative SVG coordinates for Maharashtra Pilot Districts
  const districtMapNodes = [
    { id: 'mumbai', label: 'Mumbai', x: 120, y: 220, code: 'BOM' },
    { id: 'pune', label: 'Pune', x: 210, y: 270, code: 'PUN' },
    { id: 'nashik', label: 'Nashik', x: 210, y: 150, code: 'NSK' },
    { id: 'amravati', label: 'Amravati', x: 440, y: 120, code: 'AMR' },
    { id: 'wardha', label: 'Wardha', x: 530, y: 140, code: 'WRD' },
    { id: 'nagpur', label: 'Nagpur', x: 590, y: 110, code: 'NGP' },
    { id: 'chandrapur', label: 'Chandrapur', x: 610, y: 200, code: 'CHA' },
  ];

  const getRiskColor = (risk: District['riskLevel']) => {
    switch (risk) {
      case 'CRITICAL':
        return { fill: '#DC2626', stroke: '#991B1B', text: '#FFFFFF', badge: 'bg-rose-600' };
      case 'HIGH':
        return { fill: '#EA580C', stroke: '#C2410C', text: '#FFFFFF', badge: 'bg-orange-600' };
      case 'ELEVATED':
        return { fill: '#D97706', stroke: '#B45309', text: '#FFFFFF', badge: 'bg-amber-600' };
      default:
        return { fill: '#059669', stroke: '#047857', text: '#FFFFFF', badge: 'bg-emerald-600' };
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-lg border border-slate-800 p-4 shadow-md relative overflow-hidden">
      {/* Title Bar */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            Maharashtra State Pilot EOC Mesh Network Map
          </h3>
          <p className="text-[11px] text-slate-400">
            Interactive GIS Node topology for emergency triage & bed allocation tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-[10px]">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
            <span className="text-slate-300">Critical</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block"></span>
            <span className="text-slate-300">High Risk</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
            <span className="text-slate-300">Elevated</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            <span className="text-slate-300">Optimal</span>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[320px] bg-slate-950 rounded border border-slate-800 flex items-center justify-center p-2">
        <svg viewBox="0 0 750 360" className="w-full h-full max-h-[300px]">
          {/* Background Map Outline abstraction */}
          <path
            d="M 60 180 L 140 100 L 250 80 L 400 60 L 680 50 L 730 180 L 680 320 L 520 330 L 350 300 L 220 320 L 110 260 Z"
            fill="#0F172A"
            stroke="#1E293B"
            strokeWidth="3"
            strokeDasharray="4 4"
          />

          {/* Connection Lines between Nodes */}
          {districtMapNodes.map((node, i) =>
            districtMapNodes.slice(i + 1).map((targetNode, j) => (
              <line
                key={`${node.id}-${targetNode.id}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="#334155"
                strokeWidth="1.2"
                strokeOpacity="0.4"
              />
            ))
          )}

          {/* District Nodes */}
          {districtMapNodes.map((node) => {
            const districtData = districts.find((d) => d.id === node.id);
            if (!districtData) return null;

            const isSelected = selectedDistrict === node.id;
            const colors = getRiskColor(districtData.riskLevel);

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectDistrict(node.id)}
                onMouseEnter={() => setHoveredDistrict(districtData)}
                onMouseLeave={() => setHoveredDistrict(null)}
              >
                {/* Pulse Ring for Critical Nodes */}
                {districtData.riskLevel === 'CRITICAL' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Selection Halo */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="26"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="3"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill={colors.fill}
                  stroke={isSelected ? '#38BDF8' : colors.stroke}
                  strokeWidth="3"
                  className="shadow-lg"
                />

                {/* District Code Text */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="900"
                  fontFamily="monospace"
                >
                  {node.code}
                </text>

                {/* Label below node */}
                <text
                  x={node.x}
                  y={node.y + 32}
                  textAnchor="middle"
                  fill={isSelected ? '#38BDF8' : '#94A3B8'}
                  fontSize="11"
                  fontWeight={isSelected ? '900' : '700'}
                >
                  {node.label}
                </text>

                {/* Emergency Counter Badge */}
                <rect
                  x={node.x + 8}
                  y={node.y - 20}
                  width="20"
                  height="14"
                  rx="4"
                  fill="#0284C7"
                  stroke="#38BDF8"
                  strokeWidth="1"
                />
                <text
                  x={node.x + 18}
                  y={node.y - 10}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="900"
                >
                  {districtData.currentEmergencies}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Tooltip overlay */}
        {hoveredDistrict && (
          <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-sky-500/50 p-3 rounded-lg shadow-2xl backdrop-blur-sm text-xs w-64 z-20">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1 mb-2">
              <span className="font-extrabold text-white text-sm">
                {hoveredDistrict.name} ({hoveredDistrict.marathiName})
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  getRiskColor(hoveredDistrict.riskLevel).badge
                }`}
              >
                {hoveredDistrict.riskLevel}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">Emergencies:</span>
                <span className="font-bold text-rose-400 text-sm">
                  {hoveredDistrict.currentEmergencies}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ICU Beds Free:</span>
                <span className="font-bold text-sky-400 text-sm">
                  {hoveredDistrict.availableIcuBeds} / {hoveredDistrict.totalIcuBeds}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">108 Ambulances:</span>
                <span className="font-bold text-emerald-400">
                  {hoveredDistrict.availableAmbulances} ready
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Avg Response:</span>
                <span className="font-bold text-amber-400">
                  {hoveredDistrict.avgResponseTimeMin} min
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
