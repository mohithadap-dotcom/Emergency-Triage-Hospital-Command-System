import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Building2,
  Truck,
  MapPin,
  CheckCircle2,
  Award,
  Activity,
  Layers,
} from 'lucide-react';
import { DistrictRiskIntelligence } from '../../types';

interface DistrictRiskViewProps {
  districtRisks: DistrictRiskIntelligence[];
}

export const DistrictRiskView: React.FC<DistrictRiskViewProps> = ({ districtRisks }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRiskIntelligence | null>(districtRisks[0] || null);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-purple-950 text-purple-200 border-purple-600 animate-pulse';
      case 'HIGH':
        return 'bg-rose-900 text-rose-100 border-rose-500';
      case 'MODERATE':
        return 'bg-amber-900 text-amber-200 border-amber-500';
      default:
        return 'bg-emerald-900 text-emerald-200 border-emerald-500';
    }
  };

  const sortedDistricts = [...districtRisks].sort((a, b) => b.riskScore - a.riskScore);
  const currentDist = selectedDistrict || sortedDistricts[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-black text-white tracking-wide">Statewide District Risk Intelligence & Health Ranking</h3>
            <span className="text-[10px] bg-rose-950 text-rose-300 font-mono px-2 py-0.5 rounded border border-rose-700">
              STATEWIDE RISK INDEX
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-factorial risk index based on hospital occupancy, emergency surge trends, disaster exposure & fleet availability.
          </p>
        </div>

        <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-xs text-right">
          <span className="text-[10px] text-slate-400 block">Top High Risk District</span>
          <span className="font-extrabold text-rose-400">
            {sortedDistricts[0]?.districtName} (Score: {sortedDistricts[0]?.riskScore}/100)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ranked District List */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center border-b pb-2">
            <Award className="w-4 h-4 text-rose-600 mr-1.5" />
            <span>Ranked Districts ({sortedDistricts.length})</span>
          </h4>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {sortedDistricts.map((d, index) => {
              const isSelected = currentDist?.districtName === d.districtName;

              return (
                <div
                  key={d.districtName}
                  onClick={() => setSelectedDistrict(d)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected ? 'border-rose-600 bg-rose-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>
                      <div>
                        <span className="font-black text-slate-900 block text-sm">{d.districtName}</span>
                        <span className="text-[11px] text-slate-500 block">Load: {d.hospitalLoadPercent}% Occupied</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getRiskBadge(d.riskLevel)}`}>
                      {d.riskScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">Surge Growth</span>
                      <span className="font-bold text-rose-600">+{d.predictedEmergencySurgeRate}%</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Ambulance Coverage</span>
                      <span className="font-bold text-sky-600">{d.ambulanceAvailabilityScore}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed District Risk Analysis */}
        {currentDist && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{currentDist.districtName} District Intelligence</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getRiskBadge(currentDist.riskLevel)}`}>
                      {currentDist.riskLevel} RISK LEVEL
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    District Code: <strong>MH-{currentDist.districtName.slice(0, 3).toUpperCase()}</strong> • Composite Risk Score:{' '}
                    <strong>{currentDist.riskScore}/100</strong>
                  </p>
                </div>

                <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-800 text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Hospital Load</span>
                  <span className="text-sm font-black text-rose-400">{currentDist.hospitalLoadPercent}% OCCUPIED</span>
                </div>
              </div>

              {/* Key Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Overall Risk Index</span>
                  <span className="text-xl font-black text-rose-400 mt-1 block">{currentDist.riskScore}/100</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Weighted Model Score</span>
                </div>

                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Emergency Growth Rate</span>
                  <span className="text-xl font-black text-amber-400 mt-1 block">
                    +{currentDist.predictedEmergencySurgeRate}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Next 24 Hours</span>
                </div>

                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Ambulance Coverage</span>
                  <span className="text-xl font-black text-sky-400 mt-1 block">
                    {currentDist.ambulanceAvailabilityScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Readiness Index</span>
                </div>
              </div>

              {/* Primary Risk Factors */}
              <div className="bg-rose-50/70 p-3.5 rounded-md border border-rose-200 space-y-2">
                <h4 className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Primary Risk Factors & Environmental Drivers</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentDist.primaryRiskFactors.map((factor, i) => (
                    <div key={i} className="bg-white p-2.5 rounded border border-rose-200 font-bold text-slate-800 flex items-center gap-2">
                      <span className="bg-rose-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preventive Deployment Strategy */}
              <div className="bg-slate-900 text-white p-3.5 rounded-md border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>AI Recommended Preventive Action Plan for District Collector</span>
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                  {currentDist.recommendedDeploymentStrategy}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
