import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Layers,
  Filter,
  CheckCircle2,
  Sparkles,
  Activity,
  Compass,
} from 'lucide-react';
import { DiseaseClusterAlert, EmergencyForecastItem } from '../../types';

interface DiseaseClustersViewProps {
  clusters: DiseaseClusterAlert[];
  emergencyForecasts?: EmergencyForecastItem[];
}

export const DiseaseClustersView: React.FC<DiseaseClustersViewProps> = ({ clusters, emergencyForecasts = [] }) => {
  const [selectedCluster, setSelectedCluster] = useState<DiseaseClusterAlert | null>(clusters[0] || null);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
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

  const filteredClusters = clusters.filter(
    (c) => selectedFilter === 'ALL' || c.clusterType.toUpperCase().includes(selectedFilter)
  );

  const currentCluster = selectedCluster || filteredClusters[0];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-base font-black text-white tracking-wide">Disease Outbreak & Incident Cluster Detection Engine</h3>
            <span className="text-[10px] bg-amber-950 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-700">
              SPATIAL CLUSTER ALGORITHMS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time disease spatial clustering, highway accident hotspot tracking, thermal exposure alerts & pandemic outbreak prediction.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs font-bold">
          {['ALL', 'ACCIDENT', 'CARDIAC', 'HEAT', 'CHEMICAL', 'PANDEMIC'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-2.5 py-1 rounded transition ${
                selectedFilter === f ? 'bg-amber-600 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cluster Cards */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center border-b pb-2">
            <Flame className="w-4 h-4 text-amber-600 mr-1.5" />
            <span>Active Detected Clusters ({filteredClusters.length})</span>
          </h4>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredClusters.map((cls) => {
              const isSelected = currentCluster?.id === cls.id;

              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedCluster(cls)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-black text-slate-900 block text-sm">{cls.clusterName}</span>
                      <span className="text-[11px] text-slate-500 block">
                        {cls.districtName} • Radius: {cls.radiusKm} km
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getSeverityBadge(cls.severity)}`}>
                      {cls.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">Affected Cases</span>
                      <span className="font-black text-rose-600">{cls.caseCount} Patients</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Growth Trend</span>
                      <span className="font-bold text-amber-600">{cls.growthRatePercent}% / 24h</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cluster Intelligence Detail & GIS Mock Layer */}
        {currentCluster && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{currentCluster.clusterName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getSeverityBadge(currentCluster.severity)}`}>
                      {currentCluster.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    District: <strong>{currentCluster.districtName}</strong> • Type: <strong>{currentCluster.clusterType}</strong> • Spatial Radius: <strong>{currentCluster.radiusKm} km</strong>
                  </p>
                </div>

                <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-800 text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Growth Rate</span>
                  <span className="text-sm font-black text-amber-400">+{currentCluster.growthRatePercent}% / 24H</span>
                </div>
              </div>

              {/* GIS Overlay Mock Simulation */}
              <div className="bg-slate-950 text-white p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-400" />
                    GIS Cluster Heatmap Overlay ({currentCluster.districtName})
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">COORDINATES: {currentCluster.centerCoordinates.lat}, {currentCluster.centerCoordinates.lng}</span>
                </div>

                <div className="h-44 bg-slate-900 rounded-md border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-rose-500/10 to-transparent animate-pulse" />
                  <div className="text-center z-10 space-y-1 p-3">
                    <MapPin className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
                    <span className="text-xs font-black text-amber-300 block">{currentCluster.clusterName} Epicenter</span>
                    <span className="text-[10px] text-slate-400 block max-w-md">
                      Cluster Density Radius: {currentCluster.radiusKm} km • Active Case Density: {currentCluster.caseCount} confirmed casualties
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Forecast Highlights */}
              {emergencyForecasts.length > 0 && (
                <div className="bg-amber-50/70 p-3.5 rounded-md border border-amber-200 space-y-2">
                  <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    <span>Statewide Emergency Forecast Items</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {emergencyForecasts.map((item) => (
                      <div key={item.id} className="bg-white p-2.5 rounded border border-amber-200 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-900">{item.category} ({item.district})</span>
                          <span className="text-rose-600 font-black">+{item.predictedSurgePercent}%</span>
                        </div>
                        <p className="text-[11px] text-slate-600">Risk Zone: {item.riskZone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
