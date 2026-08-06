import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  BedDouble,
  Activity,
  HeartPulse,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Sliders,
  SlidersHorizontal,
  Save,
  Radio,
  FileText,
  UserCheck,
  Wrench,
  Droplet,
  Stethoscope,
  PhoneCall,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Plus,
  Lock,
  Layers,
} from 'lucide-react';
import {
  Hospital,
  HospitalAdminRole,
  MedicalEquipment,
  HospitalStaff,
  HospitalDepartment,
  HospitalEmergencyRequest,
  HospitalAuditLog,
  HospitalQuickResourceUpdate,
  ERStatus,
  Incident,
} from '../../types';

interface HospitalAdminDashboardViewProps {
  hospitals: Hospital[];
  incidents?: Incident[];
  onRefreshData?: () => void;
}

export const HospitalAdminDashboardView: React.FC<HospitalAdminDashboardViewProps> = ({
  hospitals,
  incidents = [],
  onRefreshData,
}) => {
  // Selected Active Hospital & Role
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || 'hosp-ngp-01');
  const [activeRole, setActiveRole] = useState<HospitalAdminRole>('HOSPITAL_ADMINISTRATOR');
  const [adminTab, setAdminTab] = useState<
    'OVERVIEW' | 'QUICK_SYNC' | 'ICU_VENTILATORS' | 'EQUIPMENT' | 'STAFF' | 'DEPARTMENTS' | 'EMERGENCY_QUEUE' | 'AI_ASSISTANT' | 'AUDIT_LOG'
  >('OVERVIEW');

  const activeHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  // Quick Resource Update Form State
  const [quickForm, setQuickForm] = useState<HospitalQuickResourceUpdate>({
    availableIcuBeds: activeHospital?.availableIcuBeds || 12,
    availableGeneralBeds: activeHospital?.availableGeneralBeds || 45,
    availableVentilators: activeHospital?.availableVentilators || 8,
    doctorsOnDuty: activeHospital?.doctorsOnDuty || 18,
    nursesOnDuty: activeHospital?.nursesOnDuty || 42,
    bloodUnitsAvailable: activeHospital?.bloodUnitsAvailable || 85,
    oxygenCapacityPercent: activeHospital?.oxygenCapacityPercent || 92,
    oxygenCylindersAvailable: activeHospital?.oxygenCylindersAvailable || 65,
    emergencyMedicinesStockLevelPercent: activeHospital?.emergencyMedicinesStockLevelPercent || 88,
    operatingTheatresAvailable: activeHospital?.operatingTheatresAvailable || 3,
    emergencyDeptStatus: activeHospital?.emergencyDeptStatus || 'NORMAL',
  });

  const [savingSync, setSavingSync] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Sync state whenever selected hospital changes
  useEffect(() => {
    if (activeHospital) {
      setQuickForm({
        availableIcuBeds: activeHospital.availableIcuBeds,
        availableGeneralBeds: activeHospital.availableGeneralBeds,
        availableVentilators: activeHospital.availableVentilators,
        doctorsOnDuty: activeHospital.doctorsOnDuty,
        nursesOnDuty: activeHospital.nursesOnDuty,
        bloodUnitsAvailable: activeHospital.bloodUnitsAvailable,
        oxygenCapacityPercent: activeHospital.oxygenCapacityPercent,
        oxygenCylindersAvailable: activeHospital.oxygenCylindersAvailable,
        emergencyMedicinesStockLevelPercent: activeHospital.emergencyMedicinesStockLevelPercent,
        operatingTheatresAvailable: activeHospital.operatingTheatresAvailable,
        emergencyDeptStatus: activeHospital.emergencyDeptStatus,
      });
    }
  }, [selectedHospitalId, activeHospital]);

  // Handle Quick Save & Synchronization with Backend & State
  const handleSaveQuickSync = async () => {
    setSavingSync(true);
    setSyncSuccessMsg(null);
    try {
      const res = await fetch(`/api/hospitals/${selectedHospitalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quickForm),
      });

      if (res.ok) {
        setSyncSuccessMsg(`Successfully updated & synchronized resources for ${activeHospital?.name} across Maharashtra State EOC.`);
        if (onRefreshData) onRefreshData();
        addAuditEntry(
          'RESOURCE_UPDATE',
          `Updated ICU Beds (${quickForm.availableIcuBeds}), Vents (${quickForm.availableVentilators}), ER Status (${quickForm.emergencyDeptStatus}).`
        );
      }
    } catch (err) {
      console.error('Error saving resource update:', err);
    } finally {
      setSavingSync(false);
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    }
  };

  // Mock Medical Equipment Data
  const [equipments, setEquipments] = useState<MedicalEquipment[]>([
    {
      id: 'eq-01',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      serialNumber: 'HAM-VENT-9012',
      name: 'Hamilton C6 ICU Ventilator',
      category: 'VENTILATOR',
      department: 'Trauma ICU',
      location: 'Bed ICU-301',
      status: 'Assigned',
      batteryHealthPercent: 98,
      assignedPatientName: 'Rameshwar Tawde (STEMI)',
      lastServiceDate: '2026-07-15',
      nextServiceDueDate: '2026-10-15',
    },
    {
      id: 'eq-02',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      serialNumber: 'MIND-VENT-4081',
      name: 'Mindray SV300 Transport Ventilator',
      category: 'VENTILATOR',
      department: 'Emergency Resuscitation',
      location: 'ER Bay 2',
      status: 'Available',
      batteryHealthPercent: 100,
      lastServiceDate: '2026-07-20',
      nextServiceDueDate: '2026-10-20',
    },
    {
      id: 'eq-03',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      serialNumber: 'ZOLL-DEFIB-221',
      name: 'Zoll R Series Defibrillator',
      category: 'DEFIBRILLATOR',
      department: 'Emergency Medicine',
      location: 'Casualty Crash Cart 1',
      status: 'Available',
      batteryHealthPercent: 95,
      lastServiceDate: '2026-06-10',
      nextServiceDueDate: '2026-09-10',
    },
    {
      id: 'eq-04',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      serialNumber: 'PHIL-ECG-774',
      name: 'Philips PageWriter TC70 ECG',
      category: 'ECG',
      department: 'Cardiology',
      location: 'Triage Desk 1',
      status: 'Available',
      batteryHealthPercent: 92,
      lastServiceDate: '2026-07-01',
      nextServiceDueDate: '2026-10-01',
    },
    {
      id: 'eq-05',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      serialNumber: 'GE-VSCAN-102',
      name: 'GE Vscan Extend Portable Ultrasound',
      category: 'ULTRASOUND',
      department: 'Trauma Bay',
      location: 'FAST Scan Cart',
      status: 'Available',
      batteryHealthPercent: 88,
      lastServiceDate: '2026-05-18',
      nextServiceDueDate: '2026-08-18',
    },
  ]);

  // Staff Data
  const [staffList, setStaffList] = useState<HospitalStaff[]>([
    {
      id: 'st-01',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      name: 'Dr. Anand Mahajan, MD',
      roleTitle: 'Doctor',
      specialty: 'Interventional Cardiology',
      department: 'Cardiology',
      shift: 'Morning',
      status: 'On-Duty',
      contactNumber: '+91 98230 11204',
      emergencyContact: '+91 98230 00000',
      emergencyAssigned: 'INC-NGP-STEMI',
      assignedWard: 'Cath Lab & Cardiac ICU',
    },
    {
      id: 'st-02',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      name: 'Dr. Meera Kulkarni, MS',
      roleTitle: 'Doctor',
      specialty: 'Trauma Surgery & Critical Care',
      department: 'Trauma & Emergency',
      shift: 'Morning',
      status: 'On-Duty',
      contactNumber: '+91 98221 44512',
      emergencyContact: '+91 98221 00000',
      assignedWard: 'Red Resuscitation Bay',
    },
    {
      id: 'st-03',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      name: 'Sr. Sunita Deshmukh, B.Sc Nursing',
      roleTitle: 'Nurse',
      specialty: 'Critical Care ICU Incharge',
      department: 'ICU',
      shift: 'Morning',
      status: 'On-Duty',
      contactNumber: '+91 94220 88712',
      emergencyContact: '+91 94220 00000',
      assignedWard: 'Trauma ICU Floor 3',
    },
    {
      id: 'st-04',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      name: 'Dr. Rajesh Bhave',
      roleTitle: 'Doctor',
      specialty: 'Neurology & Stroke Unit',
      department: 'Neurology',
      shift: 'On-Call',
      status: 'On-Call',
      contactNumber: '+91 97654 33210',
      emergencyContact: '+91 97654 00000',
    },
  ]);

  // Departments
  const departments: HospitalDepartment[] = [
    {
      id: 'dept-01',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      name: 'Emergency Casualty & Triage',
      headDoctor: 'Dr. Meera Kulkarni',
      totalBeds: activeHospital?.totalEmergencyBeds || 20,
      occupiedBeds: (activeHospital?.totalEmergencyBeds || 20) - (activeHospital?.availableEmergencyBeds || 5),
      availableBeds: activeHospital?.availableEmergencyBeds || 5,
      activeStaffCount: 14,
      averageWaitTimeMin: 4,
      occupancyPercent: 75,
      status: 'BUSY',
    },
    {
      id: 'dept-02',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      name: 'Intensive Care Unit (ICU)',
      headDoctor: 'Dr. Anand Mahajan',
      totalBeds: activeHospital?.totalIcuBeds || 30,
      occupiedBeds: activeHospital?.occupiedIcuBeds || 18,
      availableBeds: activeHospital?.availableIcuBeds || 12,
      activeStaffCount: 18,
      averageWaitTimeMin: 0,
      occupancyPercent: Math.round(((activeHospital?.occupiedIcuBeds || 18) / (activeHospital?.totalIcuBeds || 30)) * 100),
      status: 'NORMAL',
    },
    {
      id: 'dept-03',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      name: 'Cardiology & Cath Lab',
      headDoctor: 'Dr. Anand Mahajan',
      totalBeds: 15,
      occupiedBeds: 11,
      availableBeds: 4,
      activeStaffCount: 8,
      averageWaitTimeMin: 12,
      occupancyPercent: 73,
      status: 'NORMAL',
    },
    {
      id: 'dept-04',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      name: 'Trauma & Orthopedics',
      headDoctor: 'Dr. S. K. Joshi',
      totalBeds: 25,
      occupiedBeds: 21,
      availableBeds: 4,
      activeStaffCount: 10,
      averageWaitTimeMin: 15,
      occupancyPercent: 84,
      status: 'BUSY',
    },
  ];

  // Incoming ER Requests
  const [erRequests, setErRequests] = useState<HospitalEmergencyRequest[]>([
    {
      id: 'er-req-01',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      incidentId: 'inc-nagpur-01',
      incidentCode: 'INC-NGP-2026-0881',
      incidentTitle: 'Acute Anterior Wall STEMI - High Risk',
      districtName: activeHospital?.districtName || 'Nagpur',
      patientName: 'Rameshwar Tawde',
      patientAgeGender: '58M',
      priority: 'RED',
      symptoms: 'Crushing chest pain, diaphoretic, SpO2 88%, ST elevation V1-V4',
      triageSummary: 'Immediate PCI Cath Lab activation requested. High mortality risk without early reperfusion.',
      etaMinutes: 11,
      assignedAmbulanceRegNo: 'MH 31 EK 1108 (MEMS ALS-01)',
      status: 'ACCEPTED',
      assignedReceivingDoctor: 'Dr. Anand Mahajan',
      assignedBedNumber: 'BAY-ICU-302',
      requestedAt: new Date(Date.now() - 8 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
      id: 'er-req-02',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      incidentId: 'inc-pune-02',
      incidentCode: 'INC-PNE-2026-0914',
      incidentTitle: 'Polytrauma - Highway Collision',
      districtName: activeHospital?.districtName || 'Nagpur',
      patientName: 'Sunita Deshmukh',
      patientAgeGender: '34F',
      priority: 'RED',
      symptoms: 'Femur fracture, internal hemorrhage risk, BP 85/50, HR 124',
      triageSummary: 'Level 1 Trauma Resuscitation Bay required immediately. Blood transfusions pending.',
      etaMinutes: 18,
      assignedAmbulanceRegNo: 'MH 12 QW 9081 (MEMS ALS-03)',
      status: 'PENDING',
      requestedAt: new Date(Date.now() - 3 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    },
  ]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<HospitalAuditLog[]>([
    {
      id: 'aud-01',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      hospitalName: activeHospital?.name || 'AIIMS Nagpur',
      action: 'EMERGENCY_ACCEPTED',
      category: 'EMERGENCY_ACCEPT',
      performedBy: 'Dr. Anand Mahajan',
      userRole: 'EMERGENCY_COORDINATOR',
      details: 'Accepted STEMI emergency INC-NGP-2026-0881. Pre-reserved ICU bed BAY-ICU-302 and alerted Cath Lab team.',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      ipAddress: '10.120.4.18',
    },
    {
      id: 'aud-02',
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      hospitalName: activeHospital?.name || 'AIIMS Nagpur',
      action: 'RESOURCE_UPDATE',
      category: 'RESOURCE_UPDATE',
      performedBy: 'Dr. Rajesh Patil',
      userRole: 'HOSPITAL_ADMINISTRATOR',
      details: 'Updated ICU bed capacity from 10 to 12 free beds after releasing recovered post-op patient.',
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      ipAddress: '10.120.4.12',
    },
  ]);

  const addAuditEntry = (category: HospitalAuditLog['category'], details: string) => {
    const entry: HospitalAuditLog = {
      id: `aud-${Date.now()}`,
      hospitalId: activeHospital?.id || 'hosp-ngp-01',
      hospitalName: activeHospital?.name || 'Hospital',
      action: category,
      category,
      performedBy: activeRole.replace(/_/g, ' '),
      userRole: activeRole,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '10.120.4.22',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // AI Assistant State
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleRunAiAssistant = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentType: 'Hospital Resource Capacity & ER Saturation Evaluation',
          symptoms: `ICU Occupancy: ${Math.round(
            ((activeHospital.totalIcuBeds - activeHospital.availableIcuBeds) / activeHospital.totalIcuBeds) * 100
          )}%, Vents Free: ${activeHospital.availableVentilators}, ER Status: ${activeHospital.emergencyDeptStatus}`,
          patientCount: erRequests.length,
          description: `Hospital Admin AI analysis for ${activeHospital.name}. Total beds: ${activeHospital.totalBeds}, Doctors: ${activeHospital.doctorsOnDuty}, Blood units: ${activeHospital.bloodUnitsAvailable}.`,
          locationName: activeHospital.name,
          districtName: activeHospital.districtName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data.assessment);
        addAuditEntry('AI_ASSISTANT', 'Executed Gemini AI Hospital Resource & Saturation Analysis.');
      }
    } catch (err) {
      console.error('AI assistant failed:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUpdateErRequest = (reqId: string, newStatus: HospitalEmergencyRequest['status'], doctor?: string, bed?: string) => {
    setErRequests((prev) =>
      prev.map((r) => {
        if (r.id === reqId) {
          return {
            ...r,
            status: newStatus,
            assignedReceivingDoctor: doctor || r.assignedReceivingDoctor,
            assignedBedNumber: bed || r.assignedBedNumber,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
    addAuditEntry(
      'EMERGENCY_ACCEPT',
      `Updated Emergency Request ${reqId} status to ${newStatus}.${doctor ? ` Doctor: ${doctor}.` : ''}${bed ? ` Bed: ${bed}.` : ''}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/30">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-sky-400">
                Hospital Operational Command Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE REAL-TIME SYNC
              </span>
            </div>

            <h1 className="text-2xl font-black text-white mt-2 flex items-center gap-3">
              <span>{activeHospital?.name}</span>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700 font-mono">
                {activeHospital?.districtName} District
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct operational resource manager synchronized with Maharashtra State Emergency Operations Center (SEOC)
            </p>
          </div>

          {/* Hospital & Role Selectors */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Select Operating Hospital
              </label>
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-extrabold text-white focus:outline-none focus:border-sky-500 min-w-[200px]"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.districtName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Admin Role
              </label>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as HospitalAdminRole)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-extrabold text-amber-400 focus:outline-none focus:border-amber-500"
              >
                <option value="HOSPITAL_ADMINISTRATOR">Hospital Administrator</option>
                <option value="EMERGENCY_COORDINATOR">ER Coordinator</option>
                <option value="RESOURCE_MANAGER">Resource Manager</option>
                <option value="BED_MANAGER">Bed Manager</option>
                <option value="NURSING_SUPERVISOR">Nursing Supervisor</option>
                <option value="BIOMEDICAL_ENGINEER">Biomedical Engineer</option>
                <option value="MEDICAL_SUPERINTENDENT">Medical Superintendent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm flex items-center space-x-1 overflow-x-auto text-xs font-bold text-slate-700">
        <button
          onClick={() => setAdminTab('OVERVIEW')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
            adminTab === 'OVERVIEW' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4 text-sky-400" />
          <span>Overview & KPIs</span>
        </button>

        <button
          onClick={() => setAdminTab('QUICK_SYNC')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
            adminTab === 'QUICK_SYNC' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>One-Save Resource Sync</span>
        </button>

        <button
          onClick={() => setAdminTab('EMERGENCY_QUEUE')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
            adminTab === 'EMERGENCY_QUEUE' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Incoming ER Queue ({erRequests.filter((r) => r.status === 'PENDING').length})</span>
        </button>

        <button
          onClick={() => setAdminTab('ICU_VENTILATORS')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
            adminTab === 'ICU_VENTILATORS' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <BedDouble className="w-4 h-4 text-indigo-400" />
          <span>ICU & Ventilators</span>
        </button>

        <button
          onClick={() => setAdminTab('EQUIPMENT')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
            adminTab === 'EQUIPMENT' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>Medical Equipment</span>
        </button>

        <button
          onClick={() => setAdminTab('STAFF')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
            adminTab === 'STAFF' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Staff & Shifts</span>
        </button>

        <button
          onClick={() => setAdminTab('DEPARTMENTS')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
            adminTab === 'DEPARTMENTS' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Department Matrix</span>
        </button>

        <button
          onClick={() => setAdminTab('AI_ASSISTANT')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
            adminTab === 'AI_ASSISTANT' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Gemini AI Assistant</span>
        </button>

        <button
          onClick={() => setAdminTab('AUDIT_LOG')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
            adminTab === 'AUDIT_LOG' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Audit History</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {adminTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Available ICU Beds</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">{activeHospital.availableIcuBeds}</span>
                <span className="text-xs font-bold text-slate-500">/ {activeHospital.totalIcuBeds} total</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{
                    width: `${Math.round(((activeHospital.totalIcuBeds - activeHospital.availableIcuBeds) / activeHospital.totalIcuBeds) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Ready Ventilators</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">{activeHospital.availableVentilators}</span>
                <span className="text-xs font-bold text-slate-500">/ {activeHospital.totalVentilators} total</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-500 h-1.5 rounded-full"
                  style={{
                    width: `${Math.round(((activeHospital.totalVentilators - activeHospital.availableVentilators) / activeHospital.totalVentilators) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">ER Dept Status</span>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-black px-2.5 py-1 rounded-md ${
                    activeHospital.emergencyDeptStatus === 'NORMAL'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : activeHospital.emergencyDeptStatus === 'FULL'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {activeHospital.emergencyDeptStatus}
                </span>
                <span className="text-xs font-bold text-slate-500">{activeHospital.availableEmergencyBeds} free beds</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Doctors / Nurses On Duty</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">
                  {activeHospital.doctorsOnDuty} <span className="text-xs font-bold text-slate-500">Docs</span> / {activeHospital.nursesOnDuty}{' '}
                  <span className="text-xs font-bold text-slate-500">Nurses</span>
                </span>
              </div>
            </div>
          </div>

          {/* Incoming ER Queue & Quick Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Incoming Requests Column */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Incoming Emergency Dispatch Queue</span>
                </h2>
                <span className="text-xs font-bold text-slate-500">
                  {erRequests.length} active emergency cases
                </span>
              </div>

              <div className="space-y-3">
                {erRequests.map((req) => (
                  <div key={req.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              req.priority === 'RED'
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            PRIORITY {req.priority}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-700">{req.incidentCode}</span>
                          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">
                            ETA {req.etaMinutes} MIN
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{req.incidentTitle}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Patient: <strong className="text-slate-800">{req.patientName} ({req.patientAgeGender})</strong> • Ambulance: {req.assignedAmbulanceRegNo}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          req.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                      <div>
                        <strong className="text-slate-800">Symptoms:</strong> {req.symptoms}
                      </div>
                      <div>
                        <strong className="text-slate-800">Triage Summary:</strong> {req.triageSummary}
                      </div>
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateErRequest(req.id, 'ACCEPTED', 'Dr. Anand Mahajan', 'BAY-ICU-301')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept & Reserve ICU</span>
                        </button>
                        <button
                          onClick={() => handleUpdateErRequest(req.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          Divert Emergency
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Status Control Side Panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Quick Status Control</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ER Department Status Override</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['NORMAL', 'FULL', 'DIVERTING'] as ERStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setQuickForm((prev) => ({ ...prev, emergencyDeptStatus: st }));
                          handleSaveQuickSync();
                        }}
                        className={`py-1.5 rounded font-bold text-[11px] border transition-all ${
                          quickForm.emergencyDeptStatus === st
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block">Critical Stocks Summary</span>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-600">Oxygen Plant Level:</span>
                    <strong className="text-slate-900">{activeHospital.oxygenCapacityPercent}%</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-600">Blood Units (All Groups):</span>
                    <strong className="text-slate-900">{activeHospital.bloodUnitsAvailable} units</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-600">Operating Theatres:</span>
                    <strong className="text-slate-900">{activeHospital.operatingTheatresAvailable} available</strong>
                  </div>
                </div>

                <button
                  onClick={() => setAdminTab('QUICK_SYNC')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Open Full Resource Sync Form</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ONE-CLICK QUICK RESOURCE UPDATE FORM */}
      {adminTab === 'QUICK_SYNC' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>One-Save Real-Time State Resource Sync Panel</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Modifications here immediately update the District Control Dashboard, State EOC, AI Resource Balancer, and Ambulance Routing Engines across Maharashtra
              </p>
            </div>

            <button
              onClick={handleSaveQuickSync}
              disabled={savingSync}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 border border-emerald-500"
            >
              <Save className="w-4 h-4" />
              <span>{savingSync ? 'Synchronizing State...' : 'Save & Synchronize All Dashboards'}</span>
            </button>
          </div>

          {syncSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{syncSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Bed & Ventilator Capacity */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                Bed & Ventilator Stocks
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Available ICU Beds</span>
                    <strong className="text-slate-900">{quickForm.availableIcuBeds}</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={activeHospital.totalIcuBeds}
                    value={quickForm.availableIcuBeds}
                    onChange={(e) => setQuickForm({ ...quickForm, availableIcuBeds: Number(e.target.value) })}
                    className="w-full mt-1 accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Available General Ward Beds</span>
                    <strong className="text-slate-900">{quickForm.availableGeneralBeds}</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={activeHospital.totalBeds}
                    value={quickForm.availableGeneralBeds}
                    onChange={(e) => setQuickForm({ ...quickForm, availableGeneralBeds: Number(e.target.value) })}
                    className="w-full mt-1 accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Available Ventilators</span>
                    <strong className="text-slate-900">{quickForm.availableVentilators}</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={activeHospital.totalVentilators}
                    value={quickForm.availableVentilators}
                    onChange={(e) => setQuickForm({ ...quickForm, availableVentilators: Number(e.target.value) })}
                    className="w-full mt-1 accent-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Duty Medical Staff */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                Active Staff On Duty
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Doctors On Duty</span>
                    <strong className="text-slate-900">{quickForm.doctorsOnDuty}</strong>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quickForm.doctorsOnDuty}
                    onChange={(e) => setQuickForm({ ...quickForm, doctorsOnDuty: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Nurses On Duty</span>
                    <strong className="text-slate-900">{quickForm.nursesOnDuty}</strong>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={quickForm.nursesOnDuty}
                    onChange={(e) => setQuickForm({ ...quickForm, nursesOnDuty: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Available Operating Theatres</span>
                    <strong className="text-slate-900">{quickForm.operatingTheatresAvailable}</strong>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={activeHospital.operatingTheatresTotal}
                    value={quickForm.operatingTheatresAvailable}
                    onChange={(e) => setQuickForm({ ...quickForm, operatingTheatresAvailable: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-bold bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Blood & Oxygen Stocks */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                Blood & Medical Supplies
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Blood Units Available</span>
                    <strong className="text-slate-900">{quickForm.bloodUnitsAvailable} units</strong>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={quickForm.bloodUnitsAvailable}
                    onChange={(e) => setQuickForm({ ...quickForm, bloodUnitsAvailable: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Oxygen Capacity Plant Level</span>
                    <strong className="text-slate-900">{quickForm.oxygenCapacityPercent}%</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={quickForm.oxygenCapacityPercent}
                    onChange={(e) => setQuickForm({ ...quickForm, oxygenCapacityPercent: Number(e.target.value) })}
                    className="w-full mt-1 accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Emergency Medicines Stock Level</span>
                    <strong className="text-slate-900">{quickForm.emergencyMedicinesStockLevelPercent}%</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={quickForm.emergencyMedicinesStockLevelPercent}
                    onChange={(e) =>
                      setQuickForm({ ...quickForm, emergencyMedicinesStockLevelPercent: Number(e.target.value) })
                    }
                    className="w-full mt-1 accent-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEDICAL EQUIPMENT TRACKER */}
      {adminTab === 'EQUIPMENT' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Biomedical Equipment & Ventilator Fleet Registry</span>
            </h2>

            <span className="text-xs font-bold text-slate-500">{equipments.length} tracked devices</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Device Name & Category</th>
                  <th className="p-3">Serial ID</th>
                  <th className="p-3">Department & Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Battery Health</th>
                  <th className="p-3">Assigned Patient</th>
                  <th className="p-3">Next Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipments.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{eq.name}</td>
                    <td className="p-3 font-mono text-slate-600">{eq.serialNumber}</td>
                    <td className="p-3 text-slate-700">
                      {eq.department} • <span className="text-slate-500">{eq.location}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          eq.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : eq.status === 'Assigned'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {eq.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">{eq.batteryHealthPercent}%</td>
                    <td className="p-3 text-slate-600">{eq.assignedPatientName || 'None'}</td>
                    <td className="p-3 font-mono text-slate-500">{eq.nextServiceDueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STAFF & SHIFTS */}
      {adminTab === 'STAFF' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-600" />
              <span>Medical Roster & Emergency Duty Duty Officers</span>
            </h2>

            <span className="text-xs font-bold text-slate-500">{staffList.length} staff members</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffList.map((st) => (
              <div key={st.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-slate-900">{st.name}</span>
                    <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                      {st.roleTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Specialty: <strong>{st.specialty}</strong> • Dept: {st.department}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Shift: <strong>{st.shift}</strong> | Contact: <span className="font-mono">{st.contactNumber}</span>
                  </p>
                  {st.assignedWard && (
                    <p className="text-[11px] text-sky-700 font-semibold mt-1">
                      Assigned Ward: {st.assignedWard}
                    </p>
                  )}
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    st.status === 'On-Duty'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {st.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GEMINI AI ASSISTANT */}
      {adminTab === 'AI_ASSISTANT' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Gemini AI Hospital Operational Intelligence Assistant</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates hospital occupancy, incoming emergency triage severity, staff allocation, and generates operational warnings
              </p>
            </div>

            <button
              onClick={handleRunAiAssistant}
              disabled={aiLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{aiLoading ? 'Evaluating Hospital...' : 'Run Hospital Risk Assessment'}</span>
            </button>
          </div>

          {aiAnalysis ? (
            <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">
                  Model Output Version: {aiAnalysis.modelVersion}
                </span>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full border border-indigo-300">
                  Confidence: {aiAnalysis.confidenceScore}%
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Clinical Assessment Summary</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-indigo-100">
                  {aiAnalysis.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-indigo-100 space-y-1">
                  <strong className="text-slate-800 block">Suggested Clinical Actions:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {aiAnalysis.suggestedActions?.map((act: string, idx: number) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-lg border border-indigo-100 space-y-1">
                  <strong className="text-slate-800 block">Department Recommendation:</strong>
                  <p className="text-slate-600">{aiAnalysis.suggestedDepartment}</p>
                  <strong className="text-slate-800 block pt-1">Priority Logic:</strong>
                  <p className="text-slate-600">{aiAnalysis.priorityLogic}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">
                Click "Run Hospital Risk Assessment" to evaluate operational parameters using Gemini 3.6 Flash
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: AUDIT HISTORY */}
      {adminTab === 'AUDIT_LOG' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Hospital Action & Resource Audit Trail</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">{auditLogs.length} audit entries</span>
          </div>

          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{log.performedBy}</span>
                    <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                      {log.userRole}
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{log.details}</p>
                </div>

                <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
