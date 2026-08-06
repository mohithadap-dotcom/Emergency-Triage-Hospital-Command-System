import React, { useState } from 'react';
import { Building2, Plus, Users, Wind, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FieldHospital, DisasterIncident } from '../../types';

interface DisasterFieldHospitalsViewProps {
  disaster: DisasterIncident;
  fieldHospitals: FieldHospital[];
  onAddFieldHospital: (newFh: Partial<FieldHospital>) => void;
}

export const DisasterFieldHospitalsView: React.FC<DisasterFieldHospitalsViewProps> = ({
  disaster,
  fieldHospitals,
  onAddFieldHospital,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('NH-48 Inflatable Trauma Unit #3');
  const [locationName, setLocationName] = useState('Katraj Tunnel Expressway Interchange');
  const [totalCapacity, setTotalCapacity] = useState(40);
  const [icuTents, setIcuTents] = useState(3);
  const [doctorsCount, setDoctorsCount] = useState(6);
  const [nursesCount, setNursesCount] = useState(12);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFieldHospital({
      disasterId: disaster.id,
      name,
      locationName,
      totalCapacity: Number(totalCapacity),
      icuTents: Number(icuTents),
      doctorsCount: Number(doctorsCount),
      nursesCount: Number(nursesCount),
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            Field Hospital & Mobile Trauma Camp Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deployment of temporary inflatable field medical units, mobile ICU tents, bed capacity, and local oxygen reserves.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-lg shadow flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>DEPLOY NEW FORWARD FIELD CAMP</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fieldHospitals.map((fh) => (
          <div key={fh.id} className="bg-white border border-amber-300 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded">
                  {fh.status}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{fh.name}</h3>
                <span className="text-xs text-slate-500">{fh.locationName}</span>
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">{fh.establishedAt}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">BED OCCUPANCY</span>
                <span className="font-black text-slate-900">{fh.occupiedBeds} / {fh.totalCapacity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">ICU TENTS</span>
                <span className="font-black text-purple-700">{fh.icuTents} Tents</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">OXYGEN RESERVE</span>
                <span className="font-black text-emerald-700">{fh.oxygenSupplyPercent}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100 font-bold">
              <span>Medical Team: {fh.doctorsCount} Doctors, {fh.nursesCount} Paramedics</span>
              <button className="text-sky-600 hover:underline">Manage Camp Beds</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                Deploy Field Medical Tent
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Camp Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Staging Location</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bed Capacity</label>
                  <input
                    type="number"
                    value={totalCapacity}
                    onChange={(e) => setTotalCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ICU Tents</label>
                  <input
                    type="number"
                    value={icuTents}
                    onChange={(e) => setIcuTents(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-center font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctors Count</label>
                  <input
                    type="number"
                    value={doctorsCount}
                    onChange={(e) => setDoctorsCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nurses Count</label>
                  <input
                    type="number"
                    value={nursesCount}
                    onChange={(e) => setNursesCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-center font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 font-bold text-slate-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 font-extrabold text-slate-950 rounded shadow"
                >
                  Deploy Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
