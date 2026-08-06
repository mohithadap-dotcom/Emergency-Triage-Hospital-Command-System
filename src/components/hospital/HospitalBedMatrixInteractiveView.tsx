import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BedDouble,
  Building2,
  Layers,
  Search,
  Filter,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Trash2,
  UserCheck,
  ShieldAlert,
  SlidersHorizontal,
  Wrench,
  X,
  UserX,
  Lock,
  ArrowRightLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { BedMatrixEntity, Hospital } from '../../types';

interface HospitalBedMatrixInteractiveViewProps {
  hospital: Hospital;
  onAuditLog?: (action: string, details: string) => void;
}

export const HospitalBedMatrixInteractiveView: React.FC<HospitalBedMatrixInteractiveViewProps> = ({
  hospital,
  onAuditLog,
}) => {
  // Initial Mock 6-Level Hierarchy Bed Store for the Selected Hospital
  const [beds, setBeds] = useState<BedMatrixEntity[]>([
    {
      id: 'bed-101',
      hospitalId: hospital.id,
      building: 'Trauma & Critical Care Tower A',
      floorName: '3rd Floor - Critical Wing',
      departmentName: 'Trauma ICU',
      wardName: 'Red Zone ICU Ward 1',
      roomNumber: '301',
      bedNumber: 'ICU-BAY-301-A',
      bedType: 'ICU',
      status: 'Occupied',
      cleaningStatus: 'Clean',
      reservationStatus: 'UNRESERVED',
      assignedPatientName: 'Rameshwar Tawde (STEMI)',
      assignedDoctorName: 'Dr. Anand Mahajan',
      equipmentAttached: ['Hamilton C6 Ventilator', 'Philips TC70 Monitor', 'Infusion Pump x2'],
      expectedAvailability: 'In 48 Hours',
      lastUpdated: '10 mins ago',
    },
    {
      id: 'bed-102',
      hospitalId: hospital.id,
      building: 'Trauma & Critical Care Tower A',
      floorName: '3rd Floor - Critical Wing',
      departmentName: 'Trauma ICU',
      wardName: 'Red Zone ICU Ward 1',
      roomNumber: '301',
      bedNumber: 'ICU-BAY-301-B',
      bedType: 'ICU',
      status: 'Available',
      cleaningStatus: 'Sanitized & Ready',
      reservationStatus: 'UNRESERVED',
      assignedDoctorName: 'Dr. Anand Mahajan',
      equipmentAttached: ['Mindray SV300 Ventilator', 'Defibrillator Ready'],
      expectedAvailability: 'Immediate',
      lastUpdated: '2 mins ago',
    },
    {
      id: 'bed-103',
      hospitalId: hospital.id,
      building: 'Trauma & Critical Care Tower A',
      floorName: '3rd Floor - Critical Wing',
      departmentName: 'Trauma ICU',
      wardName: 'Red Zone ICU Ward 1',
      roomNumber: '302',
      bedNumber: 'ICU-BAY-302-A',
      bedType: 'ICU',
      status: 'Reserved',
      cleaningStatus: 'Sanitized & Ready',
      reservationStatus: 'RESERVED_FOR_DISPATCH',
      assignedPatientName: 'Sunita Deshmukh (Polytrauma ETA 12M)',
      assignedDoctorName: 'Dr. Meera Kulkarni',
      equipmentAttached: ['Zoll Defibrillator', 'High-Flow O2'],
      expectedAvailability: 'Reserved for Ambulance MEMS-01',
      lastUpdated: 'Just now',
    },
    {
      id: 'bed-104',
      hospitalId: hospital.id,
      building: 'Trauma & Critical Care Tower A',
      floorName: '3rd Floor - Critical Wing',
      departmentName: 'Trauma ICU',
      wardName: 'Red Zone ICU Ward 1',
      roomNumber: '302',
      bedNumber: 'ICU-BAY-302-B',
      bedType: 'ICU',
      status: 'Cleaning',
      cleaningStatus: 'Deep Disinfection In Progress',
      reservationStatus: 'UNRESERVED',
      equipmentAttached: ['Mobile Patient Monitor'],
      expectedAvailability: 'Ready in 20 Mins',
      lastUpdated: '15 mins ago',
    },
    {
      id: 'bed-105',
      hospitalId: hospital.id,
      building: 'Trauma & Critical Care Tower A',
      floorName: '3rd Floor - Critical Wing',
      departmentName: 'Cardiac ICU',
      wardName: 'Cath Lab Post-Op',
      roomNumber: '310',
      bedNumber: 'CCU-BAY-310-A',
      bedType: 'Cardiac ICU',
      status: 'Maintenance',
      cleaningStatus: 'Pending',
      reservationStatus: 'BLOCKED',
      equipmentAttached: ['ECG Machine (Calibrating)'],
      expectedAvailability: 'Tomorrow 09:00 AM',
      lastUpdated: '1 hour ago',
    },
    {
      id: 'bed-106',
      hospitalId: hospital.id,
      building: 'Main Block B',
      floorName: '2nd Floor - Casualty',
      departmentName: 'Emergency Casualty',
      wardName: 'Triage & Resuscitation',
      roomNumber: 'ER-BAY-1',
      bedNumber: 'ER-BED-01',
      bedType: 'Emergency',
      status: 'Available',
      cleaningStatus: 'Sanitized & Ready',
      reservationStatus: 'UNRESERVED',
      assignedDoctorName: 'Dr. S. K. Joshi',
      equipmentAttached: ['Crash Cart', 'Oxygen Line'],
      expectedAvailability: 'Immediate',
      lastUpdated: '1 min ago',
    },
    {
      id: 'bed-107',
      hospitalId: hospital.id,
      building: 'Main Block B',
      floorName: '2nd Floor - Casualty',
      departmentName: 'Emergency Casualty',
      wardName: 'Triage & Resuscitation',
      roomNumber: 'ER-BAY-1',
      bedNumber: 'ER-BED-02',
      bedType: 'Emergency',
      status: 'Occupied',
      cleaningStatus: 'Clean',
      reservationStatus: 'UNRESERVED',
      assignedPatientName: 'Amit Patel (Fracture & Lacerations)',
      assignedDoctorName: 'Dr. S. K. Joshi',
      equipmentAttached: ['Splint Kit', 'IV Monitor'],
      expectedAvailability: 'In 3 Hours',
      lastUpdated: '30 mins ago',
    },
    {
      id: 'bed-108',
      hospitalId: hospital.id,
      building: 'General Ward Block C',
      floorName: '1st Floor',
      departmentName: 'General Surgery',
      wardName: 'Male Surgical Ward 2',
      roomNumber: '104',
      bedNumber: 'WARD-104-12',
      bedType: 'General',
      status: 'Available',
      cleaningStatus: 'Clean',
      reservationStatus: 'UNRESERVED',
      expectedAvailability: 'Immediate',
      lastUpdated: '5 mins ago',
    },
  ]);

  // Filters & Selected State
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Bed Modal & Form Modal State
  const [selectedBed, setSelectedBed] = useState<BedMatrixEntity | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBedForm, setNewBedForm] = useState<Partial<BedMatrixEntity>>({
    building: 'Trauma & Critical Care Tower A',
    floorName: '3rd Floor - Critical Wing',
    departmentName: 'Trauma ICU',
    wardName: 'Ward 1',
    roomNumber: '305',
    bedNumber: 'ICU-305-C',
    bedType: 'ICU',
    status: 'Available',
    cleaningStatus: 'Sanitized & Ready',
    reservationStatus: 'UNRESERVED',
    expectedAvailability: 'Immediate',
  });

  // Unique Filter Options Derived from Data
  const buildings = Array.from(new Set(beds.map((b) => b.building)));
  const floors = Array.from(new Set(beds.map((b) => b.floorName)));
  const depts = Array.from(new Set(beds.map((b) => b.departmentName)));

  // Filtered Beds
  const filteredBeds = beds.filter((b) => {
    if (selectedBuilding !== 'ALL' && b.building !== selectedBuilding) return false;
    if (selectedFloor !== 'ALL' && b.floorName !== selectedFloor) return false;
    if (selectedDept !== 'ALL' && b.departmentName !== selectedDept) return false;
    if (selectedType !== 'ALL' && b.bedType !== selectedType) return false;
    if (selectedStatus !== 'ALL' && b.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.bedNumber.toLowerCase().includes(q) ||
        b.departmentName.toLowerCase().includes(q) ||
        (b.assignedPatientName && b.assignedPatientName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Bed Status Action Handlers
  const handleUpdateBedStatus = (
    bedId: string,
    newStatus: BedMatrixEntity['status'],
    cleaningStatus?: string,
    patientName?: string
  ) => {
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === bedId) {
          const updated = {
            ...b,
            status: newStatus,
            cleaningStatus: cleaningStatus || b.cleaningStatus,
            assignedPatientName: patientName !== undefined ? patientName : b.assignedPatientName,
            lastUpdated: 'Just now',
          };
          if (selectedBed && selectedBed.id === bedId) {
            setSelectedBed(updated);
          }
          return updated;
        }
        return b;
      })
    );
    if (onAuditLog) {
      onAuditLog(
        'BED_MANAGEMENT',
        `Updated Bed ${bedId} status to ${newStatus}.${patientName ? ` Patient: ${patientName}.` : ''}`
      );
    }
  };

  const handleCreateNewBed = () => {
    const created: BedMatrixEntity = {
      id: `bed-${Date.now()}`,
      hospitalId: hospital.id,
      building: newBedForm.building || 'Main Tower',
      floor: newBedForm.floorName || '1st Floor',
      department: newBedForm.departmentName || 'Emergency',
      ward: newBedForm.wardName || 'General Ward',
      roomNumber: newBedForm.roomNumber || '101',
      bedNumber: newBedForm.bedNumber || 'BED-101-X',
      bedType: (newBedForm.bedType as any) || 'General',
      status: (newBedForm.status as any) || 'Available',
      cleaningStatus: newBedForm.cleaningStatus || 'Sanitized & Ready',
      reservationStatus: 'UNRESERVED',
      expectedAvailability: 'Immediate',
      lastUpdated: 'Just now',
    };
    setBeds([created, ...beds]);
    setShowCreateModal(false);
    if (onAuditLog) {
      onAuditLog('BED_MANAGEMENT', `Created new bed ${created.bedNumber} in ${created.department}`);
    }
  };

  const handleDeleteBed = (bedId: string) => {
    setBeds(beds.filter((b) => b.id !== bedId));
    setSelectedBed(null);
    if (onAuditLog) {
      onAuditLog('BED_MANAGEMENT', `Deleted Bed ${bedId} from hospital inventory`);
    }
  };

  // Color Mapping helper
  const getStatusBadge = (status: BedMatrixEntity['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500 text-stone-900 border-emerald-600';
      case 'Occupied':
        return 'bg-rose-600 text-stone-900 border-rose-400';
      case 'Reserved':
        return 'bg-sky-600 text-stone-900 border-sky-700';
      case 'Cleaning':
        return 'bg-amber-500 text-stone-900 border-amber-600';
      case 'Maintenance':
        return 'bg-slate-600 text-stone-900 border-stone-300';
      default:
        return 'bg-cream0 text-stone-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Bed Counts Overview */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-sky-600" />
              <span>Interactive 6-Level Hierarchy Bed Matrix</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Building → Floor → Department → Ward → Room → Bed live real-time capacity map for {hospital.name}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add New Bed Entry</span>
            </button>
          </div>
        </div>

        {/* Legend / Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-emerald-900">Available</span>
            </div>
            <span className="text-lg font-black text-emerald-400">
              {beds.filter((b) => b.status === 'Available').length}
            </span>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <span className="text-rose-900">Occupied</span>
            </div>
            <span className="text-lg font-black text-rose-400">
              {beds.filter((b) => b.status === 'Occupied').length}
            </span>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-sky-600" />
              <span className="text-sky-900">Reserved</span>
            </div>
            <span className="text-lg font-black text-sky-400">
              {beds.filter((b) => b.status === 'Reserved').length}
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-amber-900">Cleaning</span>
            </div>
            <span className="text-lg font-black text-amber-400">
              {beds.filter((b) => b.status === 'Cleaning').length}
            </span>
          </div>

          <div className="bg-stone-100 border border-stone-200 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-slate-600" />
              <span className="text-stone-800">Maintenance</span>
            </div>
            <span className="text-lg font-black text-stone-800">
              {beds.filter((b) => b.status === 'Maintenance').length}
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-cream p-3 rounded-xl border border-stone-200 grid grid-cols-1 md:grid-cols-6 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-0.5">Building</label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-lg p-1.5 font-bold text-stone-800"
            >
              <option value="ALL">All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-0.5">Floor</label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-lg p-1.5 font-bold text-stone-800"
            >
              <option value="ALL">All Floors</option>
              {floors.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-0.5">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-lg p-1.5 font-bold text-stone-800"
            >
              <option value="ALL">All Departments</option>
              {depts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-0.5">Bed Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-lg p-1.5 font-bold text-stone-800"
            >
              <option value="ALL">All Bed Types</option>
              <option value="ICU">ICU</option>
              <option value="Cardiac ICU">Cardiac ICU</option>
              <option value="Emergency">Emergency</option>
              <option value="General">General Ward</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-0.5">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-lg p-1.5 font-bold text-stone-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-0.5">Search</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2 top-2.5" />
              <input
                type="text"
                placeholder="Bed#, patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg pl-7 pr-2 py-1.5 text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Interactive Beds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => (
          <motion.div
            key={bed.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => setSelectedBed(bed)}
            className={`p-4 rounded-xl border cursor-pointer shadow-sm transition-all relative space-y-2 ${
              bed.status === 'Available'
                ? 'bg-white border-emerald-300 hover:border-emerald-500 hover:shadow-emerald-100'
                : bed.status === 'Occupied'
                ? 'bg-white border-rose-200 hover:border-rose-500 hover:shadow-rose-100'
                : bed.status === 'Reserved'
                ? 'bg-white border-sky-300 hover:border-sky-500 hover:shadow-sky-100'
                : bed.status === 'Cleaning'
                ? 'bg-white border-amber-200 hover:border-amber-500 hover:shadow-amber-100'
                : 'bg-white border-stone-200 hover:border-slate-500'
            }`}
          >
            {/* Header / Bed Number & Status Pill */}
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-stone-900">{bed.bedNumber}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${getStatusBadge(bed.status)}`}>
                {bed.status}
              </span>
            </div>

            {/* Hierarchy Line */}
            <div className="text-[11px] text-stone-500 font-medium space-y-0.5">
              <p className="font-bold text-stone-800">{bed.departmentName}</p>
              <p className="text-[10px] text-stone-500">
                {bed.building} • {bed.floorName}
              </p>
              <p className="text-[10px] text-stone-500">
                Ward: {bed.wardName} | Room: {bed.roomNumber}
              </p>
            </div>

            {/* Patient or Equipment info */}
            <div className="bg-cream p-2 rounded-lg border border-slate-100 text-[11px] space-y-1">
              {bed.assignedPatientName ? (
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Patient</span>
                  <strong className="text-stone-900">{bed.assignedPatientName}</strong>
                </div>
              ) : (
                <span className="text-emerald-400 font-bold block text-[10px]">Ready for Immediate Admission</span>
              )}

              {bed.equipmentAttached && bed.equipmentAttached.length > 0 && (
                <div className="text-[10px] text-stone-500">
                  Equipment: {bed.equipmentAttached.slice(0, 2).join(', ')}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-[10px] font-bold text-stone-500">
              <span>Type: {bed.bedType}</span>
              <span className="text-sky-600 hover:underline flex items-center">
                Click for Actions <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bed Detail & Action Modal */}
      <AnimatePresence>
        {selectedBed && (
          <div className="fixed inset-0 z-50 bg-cream/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-lg shadow-stone-300/50 border border-stone-200 space-y-5 text-stone-800"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${getStatusBadge(selectedBed.status)}`}>
                    {selectedBed.status}
                  </span>
                  <h3 className="text-xl font-black text-stone-900 mt-1">{selectedBed.bedNumber}</h3>
                  <p className="text-xs text-stone-500">
                    {selectedBed.departmentName} • {selectedBed.building} ({selectedBed.floorName})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBed(null)}
                  className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Hierarchy Detail Table */}
              <div className="bg-cream p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase block">Ward & Room</span>
                    <strong className="text-stone-800">{selectedBed.wardName} (Room {selectedBed.roomNumber})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase block">Bed Classification</span>
                    <strong className="text-stone-800">{selectedBed.bedType} Bed</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase block">Assigned Doctor</span>
                    <strong className="text-stone-800">{selectedBed.assignedDoctorName || 'Not Assigned'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase block">Sanitation Status</span>
                    <strong className="text-stone-800">{selectedBed.cleaningStatus}</strong>
                  </div>
                </div>

                {selectedBed.assignedPatientName && (
                  <div className="pt-2 border-t border-stone-200">
                    <span className="text-[10px] text-stone-500 font-bold uppercase block">Current Admitted Patient</span>
                    <strong className="text-rose-400 font-bold">{selectedBed.assignedPatientName}</strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
                  Bed Management Actions
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    onClick={() => handleUpdateBedStatus(selectedBed.id, 'Available', 'Sanitized & Ready', '')}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-400 rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Release Bed</span>
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateBedStatus(selectedBed.id, 'Occupied', 'In Use', 'Emergency Admission (Inbound)')
                    }
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-400 rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <UserCheck className="w-4 h-4 text-rose-600" />
                    <span>Admit Patient</span>
                  </button>

                  <button
                    onClick={() => handleUpdateBedStatus(selectedBed.id, 'Reserved', 'Sanitized & Ready')}
                    className="p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-400 rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <Lock className="w-4 h-4 text-sky-600" />
                    <span>Reserve Bed</span>
                  </button>

                  <button
                    onClick={() => handleUpdateBedStatus(selectedBed.id, 'Cleaning', 'Deep Sanitation In Progress')}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-400 rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-600" />
                    <span>Mark Cleaning</span>
                  </button>

                  <button
                    onClick={() => handleUpdateBedStatus(selectedBed.id, 'Maintenance', 'Under Calibration')}
                    className="p-2.5 bg-stone-100 hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <Wrench className="w-4 h-4 text-stone-500" />
                    <span>Maintenance</span>
                  </button>

                  <button
                    onClick={() => handleDeleteBed(selectedBed.id)}
                    className="p-2.5 bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-400 border border-stone-200 hover:border-rose-200 rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Entry</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Bed Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-cream/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-lg shadow-stone-300/50 border border-stone-200 space-y-4 text-stone-800"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Create Bed Entry in Hospital Hierarchy</span>
                </h3>
                <button onClick={() => setShowCreateModal(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block text-stone-600 mb-1">Building</label>
                  <input
                    type="text"
                    value={newBedForm.building}
                    onChange={(e) => setNewBedForm({ ...newBedForm, building: e.target.value })}
                    className="w-full bg-cream border border-stone-200 rounded-lg p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 mb-1">Floor</label>
                    <input
                      type="text"
                      value={newBedForm.floorName}
                      onChange={(e) => setNewBedForm({ ...newBedForm, floorName: e.target.value })}
                      className="w-full bg-cream border border-stone-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Department</label>
                    <input
                      type="text"
                      value={newBedForm.departmentName}
                      onChange={(e) => setNewBedForm({ ...newBedForm, departmentName: e.target.value })}
                      className="w-full bg-cream border border-stone-200 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 mb-1">Ward Name</label>
                    <input
                      type="text"
                      value={newBedForm.wardName}
                      onChange={(e) => setNewBedForm({ ...newBedForm, wardName: e.target.value })}
                      className="w-full bg-cream border border-stone-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Room Number</label>
                    <input
                      type="text"
                      value={newBedForm.roomNumber}
                      onChange={(e) => setNewBedForm({ ...newBedForm, roomNumber: e.target.value })}
                      className="w-full bg-cream border border-stone-200 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 mb-1">Bed Number Code</label>
                    <input
                      type="text"
                      value={newBedForm.bedNumber}
                      onChange={(e) => setNewBedForm({ ...newBedForm, bedNumber: e.target.value })}
                      className="w-full bg-cream border border-stone-200 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Bed Type</label>
                    <select
                      value={newBedForm.bedType}
                      onChange={(e) => setNewBedForm({ ...newBedForm, bedType: e.target.value as any })}
                      className="w-full bg-cream border border-stone-200 rounded-lg p-2 font-bold"
                    >
                      <option value="ICU">ICU</option>
                      <option value="Cardiac ICU">Cardiac ICU</option>
                      <option value="Emergency">Emergency</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleCreateNewBed}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold text-xs rounded-xl shadow-md transition-colors mt-2"
                >
                  Save Bed Entry to Hospital System
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
