import React from 'react';
import { Box, BedDouble, Wind, Droplet, Zap, HeartPulse, Building2, AlertTriangle } from 'lucide-react';
import { Hospital, District } from '../types';

interface ResourceCommandProps {
  hospitals: Hospital[];
  districts: District[];
  selectedDistrict: string;
}

export const ResourceCommandView: React.FC<ResourceCommandProps> = ({
  hospitals,
  districts,
  selectedDistrict,
}) => {
  const filteredHospitals =
    selectedDistrict === 'all'
      ? hospitals
      : hospitals.filter((h) => h.districtId === selectedDistrict);

  const totalIcuBeds = filteredHospitals.reduce((acc, h) => acc + h.totalIcuBeds, 0);
  const availIcuBeds = filteredHospitals.reduce((acc, h) => acc + h.availableIcuBeds, 0);

  const totalVentilators = filteredHospitals.reduce((acc, h) => acc + h.totalVentilators, 0);
  const availVentilators = filteredHospitals.reduce((acc, h) => acc + h.availableVentilators, 0);

  const totalBloodUnits = filteredHospitals.reduce((acc, h) => acc + h.bloodUnitsAvailable, 0);
  const avgOxygen = Math.round(
    filteredHospitals.reduce((acc, h) => acc + h.oxygenCapacityPercent, 0) /
      (filteredHospitals.length || 1)
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Box className="w-5 h-5 text-sky-700" />
          Critical Medical Inventory & Resource Command Index
        </h2>
        <p className="text-xs text-slate-500">
          Statewide real-time tracking of ventilator stocks, liquid medical oxygen generation plants, blood bank reserves & ECMO life-support systems.
        </p>
      </div>

      {/* Aggregate Resource Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg">
          <span className="text-xs font-bold text-sky-900 uppercase block">ICU Beds Free</span>
          <span className="text-2xl font-black font-mono text-sky-800 mt-1 block">
            {availIcuBeds} <span className="text-xs text-slate-500 font-normal">/ {totalIcuBeds}</span>
          </span>
          <span className="text-[10px] text-sky-700 font-medium">
            {Math.round((availIcuBeds / (totalIcuBeds || 1)) * 100)}% Available
          </span>
        </div>

        <div className="bg-teal-50 border border-teal-200 p-3 rounded-lg">
          <span className="text-xs font-bold text-teal-900 uppercase block">Ventilators Ready</span>
          <span className="text-2xl font-black font-mono text-teal-800 mt-1 block">
            {availVentilators} <span className="text-xs text-slate-500 font-normal">/ {totalVentilators}</span>
          </span>
          <span className="text-[10px] text-teal-700 font-medium">
            {Math.round((availVentilators / (totalVentilators || 1)) * 100)}% Operational
          </span>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg">
          <span className="text-xs font-bold text-rose-900 uppercase block">Blood Bank Reserves</span>
          <span className="text-2xl font-black font-mono text-rose-800 mt-1 block">
            {totalBloodUnits} <span className="text-xs text-slate-500 font-normal">Units</span>
          </span>
          <span className="text-[10px] text-rose-700 font-medium">All Blood Groups Synced</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
          <span className="text-xs font-bold text-amber-900 uppercase block">Avg Oxygen Capacity</span>
          <span className="text-2xl font-black font-mono text-amber-800 mt-1 block">
            {avgOxygen}%
          </span>
          <span className="text-[10px] text-amber-700 font-medium">Liquid Oxygen Plants Normal</span>
        </div>
      </div>

      {/* Hospital Resource Breakdown Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-200 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-3">Hospital Name</th>
              <th className="p-3">District</th>
              <th className="p-3">General Beds</th>
              <th className="p-3">ICU Beds Free</th>
              <th className="p-3">Ventilators</th>
              <th className="p-3">Blood Reserve</th>
              <th className="p-3">Oxygen Plant Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredHospitals.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50 font-medium">
                <td className="p-3 font-extrabold text-slate-900">{h.name}</td>
                <td className="p-3 font-bold text-sky-800">{h.districtName}</td>
                <td className="p-3 font-mono text-slate-700">{h.availableGeneralBeds} / {h.totalBeds}</td>
                <td className="p-3 font-mono font-bold text-sky-900">{h.availableIcuBeds} / {h.totalIcuBeds}</td>
                <td className="p-3 font-mono font-bold text-teal-800">{h.availableVentilators} / {h.totalVentilators}</td>
                <td className="p-3 font-mono font-bold text-rose-700">{h.bloodUnitsAvailable} Units</td>
                <td className="p-3">
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-300">
                    O₂ {h.oxygenCapacityPercent}% Operational
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
