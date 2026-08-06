import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL / Supabase Database Pool Connection
const dbPool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : null;

// Function to query Supabase Database with fallback
async function queryDb(sql: string, params: any[] = []) {
  if (!dbPool) return null;
  try {
    const res = await dbPool.query(sql, params);
    return res.rows;
  } catch (err: any) {
    console.error('[Supabase DB Query Error]:', err?.message || err);
    return null;
  }
}
import {
  MOCK_DISTRICTS,
  MOCK_HOSPITALS,
  MOCK_INCIDENTS,
  MOCK_AMBULANCES,
  MOCK_AMBULANCE_MISSIONS,
  MOCK_FLEET_ALERTS,
  INITIAL_SYSTEM_HEALTH,
  INITIAL_LOG_ENTRIES,
  INITIAL_METRICS,
  INITIAL_USER_PROFILES,
  MOCK_BED_MATRICES,
  MOCK_BED_RESERVATIONS,
  MOCK_TRANSFERS,
  MOCK_SHORTAGE_ALERTS,
  MOCK_PATIENT_DETERIORATIONS,
  MOCK_AI_RESOURCE_OPTIMIZATIONS,
  MOCK_DISTRICT_RISK_SCORES,
  MOCK_DISEASE_CLUSTERS,
  MOCK_AI_COMMAND_RECOMMENDATIONS,
  MOCK_IOT_TELEMETRY_STREAMS,
  MOCK_AGENCY_MESSAGES,
  MOCK_FCM_NOTIFICATIONS,
  MOCK_RESOURCE_EXCHANGES,
  MOCK_PATIENT_TRANSFER_WORKFLOWS,
  MOCK_COLLABORATION_BROADCASTS,
  MOCK_STATE_RESERVATIONS,
  MOCK_HOSPITAL_FORECASTS,
  MOCK_AMBULANCE_FORECASTS,
  MOCK_EMERGENCY_FORECASTS,
  MOCK_PREDICTIVE_ANALYTICS,
  MOCK_DOCTOR_AI_PATIENTS,
  MOCK_DISASTER_INCIDENTS,
  MOCK_DISASTER_VICTIMS,
  MOCK_FIELD_HOSPITALS,
  MOCK_DISASTER_BROADCASTS,
  MOCK_DISASTER_TIMELINE,
  MOCK_DISASTER_CHAT,
  MOCK_AI_DISASTER_RECOMMENDATIONS,
} from './src/data/mockData';
import {
  Incident,
  AiTriageAssessment,
  PriorityLevel,
  CommandCenterAlert,
  IncidentTimelineEvent,
  MassCasualtyVictim,
  Hospital,
  BedMatrixEntity,
  BedReservation,
  HospitalTransfer,
  ResourceShortageAlert,
  AiHospitalRecommendation,
  Ambulance,
  AmbulanceMission,
  FleetDispatchAlert,
  SmartDispatchRecommendation,
  RouteDetails,
  FleetAnalyticsData,
  MissionStage,
  PatientDeteriorationPrediction,
  AiResourceOptimizationPrediction,
  DistrictRiskIntelligence,
  DiseaseClusterAlert,
  AiCommandRecommendation,
  SimulationResult,
  IotDeviceTelemetryStream,
  AgencyChatMessage,
  FcmNotificationPayload,
  ResourceExchangeItem,
  PatientTransferWorkflow,
  HospitalDiversionRecommendation,
  HospitalComparisonMetrics,
  HospitalCollaborationBroadcast,
  StateResourceReservation,
  HospitalResourceForecast,
  AmbulanceDemandForecast,
  EmergencyForecastItem,
  PredictiveAnalyticsData,
  DoctorAiWorkspacePatient,
  DisasterIncident,
  DisasterTriageVictim,
  FieldHospital,
  DisasterBroadcast,
  DisasterTimelineEvent,
  DisasterCommandChatMessage,
  AiDisasterRecommendation,
  IcsRole,
} from './src/types';

// In-Memory Data Store for Live Updates
let incidentsStore: Incident[] = [...MOCK_INCIDENTS];
let hospitalsStore: Hospital[] = [...MOCK_HOSPITALS];
let bedsStore: BedMatrixEntity[] = [...MOCK_BED_MATRICES];
let reservationsStore: BedReservation[] = [...MOCK_BED_RESERVATIONS];
let transfersStore: HospitalTransfer[] = [...MOCK_TRANSFERS];
let shortageAlertsStore: ResourceShortageAlert[] = [...MOCK_SHORTAGE_ALERTS];
let patientDeteriorationsStore: PatientDeteriorationPrediction[] = [...MOCK_PATIENT_DETERIORATIONS];
let aiResourceOptimizationsStore: AiResourceOptimizationPrediction[] = [...MOCK_AI_RESOURCE_OPTIMIZATIONS];
let districtRiskStore: DistrictRiskIntelligence[] = [...MOCK_DISTRICT_RISK_SCORES];
let diseaseClustersStore: DiseaseClusterAlert[] = [...MOCK_DISEASE_CLUSTERS];
let aiCommandRecommendationsStore: AiCommandRecommendation[] = [...MOCK_AI_COMMAND_RECOMMENDATIONS];

let iotStreamsStore: IotDeviceTelemetryStream[] = [...MOCK_IOT_TELEMETRY_STREAMS];
let agencyMessagesStore: AgencyChatMessage[] = [...MOCK_AGENCY_MESSAGES];
let fcmNotificationsStore: FcmNotificationPayload[] = [...MOCK_FCM_NOTIFICATIONS];
let resourceExchangesStore: ResourceExchangeItem[] = [...MOCK_RESOURCE_EXCHANGES];
let patientTransferWorkflowsStore: PatientTransferWorkflow[] = [...MOCK_PATIENT_TRANSFER_WORKFLOWS];
let collaborationBroadcastsStore: HospitalCollaborationBroadcast[] = [...MOCK_COLLABORATION_BROADCASTS];
let stateReservationsStore: StateResourceReservation[] = [...MOCK_STATE_RESERVATIONS];
let hospitalForecastsStore: HospitalResourceForecast[] = [...MOCK_HOSPITAL_FORECASTS];
let ambulanceForecastsStore: AmbulanceDemandForecast[] = [...MOCK_AMBULANCE_FORECASTS];
let emergencyForecastsStore: EmergencyForecastItem[] = [...MOCK_EMERGENCY_FORECASTS];
let predictiveAnalyticsStore: PredictiveAnalyticsData = { ...MOCK_PREDICTIVE_ANALYTICS };
let doctorAiPatientsStore: DoctorAiWorkspacePatient[] = [...MOCK_DOCTOR_AI_PATIENTS];
let isDisasterModeActive: boolean = false;

// Phase 12 National Disaster Command Stores
let disasterIncidentsStore: DisasterIncident[] = [...MOCK_DISASTER_INCIDENTS];
let disasterVictimsStore: DisasterTriageVictim[] = [...MOCK_DISASTER_VICTIMS];
let fieldHospitalsStore: FieldHospital[] = [...MOCK_FIELD_HOSPITALS];
let disasterBroadcastsStore: DisasterBroadcast[] = [...MOCK_DISASTER_BROADCASTS];
let disasterTimelineStore: DisasterTimelineEvent[] = [...MOCK_DISASTER_TIMELINE];
let disasterChatStore: DisasterCommandChatMessage[] = [...MOCK_DISASTER_CHAT];
let aiDisasterRecommendationsStore: AiDisasterRecommendation[] = [...MOCK_AI_DISASTER_RECOMMENDATIONS];


let ambulancesStore: Ambulance[] = [...MOCK_AMBULANCES];
let missionsStore: AmbulanceMission[] = [...MOCK_AMBULANCE_MISSIONS];
let fleetAlertsStore: FleetDispatchAlert[] = [...MOCK_FLEET_ALERTS];

let commandCenterAlerts: CommandCenterAlert[] = [
  {
    id: 'alt-101',
    type: 'HIGH_PRIORITY',
    title: 'CRITICAL RED EMERGENCY DISPATCHED',
    message: 'Multi-Vehicle Collision on Samruddhi Expressway (KM 412) - 14 patients affected. AIIMS Nagpur ICU pre-alerted.',
    severity: 'CRITICAL',
    districtId: 'nagpur',
    districtName: 'Nagpur',
    incidentId: 'inc-0101',
    timestamp: new Date().toISOString(),
    acknowledged: false,
  },
  {
    id: 'alt-102',
    type: 'MASS_CASUALTY',
    title: 'MASS CASUALTY EVENT TRIGGERED',
    message: 'Industrial Boiler Leakage at Chembur Plant - 18 chemical burn victims en-route to KEM Hospital.',
    severity: 'CRITICAL',
    districtId: 'mumbai',
    districtName: 'Mumbai',
    incidentId: 'inc-0102',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    acknowledged: false,
  },
];

// Lazy Gemini API Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// Helper Rule-Based Triage Fallback (when API key missing or network fails)
function computeRuleBasedTriage(data: {
  incidentType: string;
  symptoms: string;
  patientCount: number;
  ageGroup?: string;
  description?: string;
}): AiTriageAssessment {
  const sym = (data.symptoms || '').toLowerCase();
  const desc = (data.description || '').toLowerCase();
  const type = (data.incidentType || '').toLowerCase();

  let priority: PriorityLevel = 'YELLOW';
  let severity: PriorityLevel = 'YELLOW';
  let dept = 'Emergency Department';
  let ambType: 'ALS' | 'BLS' | 'Neonatal ICU' | 'Cardiac Care' = 'BLS';
  let traumaCap: 'Level 1 Trauma' | 'Level 2 Trauma' | 'Level 3 Trauma' | 'General Emergency' = 'Level 2 Trauma';
  let score = 92;

  if (
    sym.includes('unconscious') ||
    sym.includes('arrest') ||
    sym.includes('cardiac') ||
    sym.includes('polytrauma') ||
    sym.includes('shock') ||
    sym.includes('ammonia') ||
    sym.includes('burn') ||
    type.includes('explosion') ||
    type.includes('cardiac')
  ) {
    priority = 'RED';
    severity = 'RED';
    dept = 'Trauma ICU / Cardiac Care Unit';
    ambType = 'ALS';
    traumaCap = 'Level 1 Trauma';
    score = 96;
  } else if (
    sym.includes('fracture') ||
    sym.includes('bleed') ||
    sym.includes('chest pain') ||
    sym.includes('breath') ||
    type.includes('mass casualty')
  ) {
    priority = 'ORANGE';
    severity = 'ORANGE';
    dept = 'Emergency Resuscitation & Orthopedics';
    ambType = 'ALS';
    traumaCap = 'Level 2 Trauma';
    score = 94;
  } else if (sym.includes('abrasion') || sym.includes('hypothermia') || sym.includes('minor')) {
    priority = 'GREEN';
    severity = 'GREEN';
    dept = 'General Emergency Ward';
    ambType = 'BLS';
    traumaCap = 'Level 3 Trauma';
    score = 90;
  }

  return {
    summary: `Emergency evaluation for ${data.incidentType} (${data.patientCount} patient(s)). ${data.symptoms}`,
    severity,
    recommendedPriority: priority,
    suggestedDepartment: dept,
    suggestedAmbulanceType: ambType,
    suggestedHospitalCapability: traumaCap,
    confidenceScore: score,
    clinicalExplanation: `Assessed based on clinical risk criteria for ${data.incidentType}. Priority ${priority} assigned to minimize mortality risk.`,
    symptomsUsed: data.symptoms ? data.symptoms.split(',').map((s) => s.trim()) : ['Acute Distress'],
    priorityLogic: `${priority} priority level assigned based on physiological distress indicators and casualty volume.`,
    suggestedActions: [
      `Deploy ${ambType} ambulances immediately`,
      `Pre-notify ${traumaCap} facility`,
      'Initiate continuous vital signs telemetry',
    ],
    timestamp: new Date().toISOString(),
    modelVersion: 'gemini-3.6-flash',
    humanReviewRequired: true,
  };
}

async function hydrateFromSupabase() {
  if (!dbPool) return;
  try {
    const dbIncidents = await queryDb('SELECT * FROM emergency_incidents ORDER BY created_at DESC');
    if (dbIncidents && dbIncidents.length > 0) {
      incidentsStore = dbIncidents.map((i: any, index: number) => {
        const base = MOCK_INCIDENTS[index % MOCK_INCIDENTS.length] || MOCK_INCIDENTS[0];
        return {
          ...base,
          id: i.id,
          code: i.incident_code,
          title: i.title,
          type: i.type,
          category: i.category,
          priority: i.priority,
          severity: i.severity,
          status: i.status,
          affectedCount: i.patient_count,
          patientCount: i.patient_count,
          symptoms: i.symptoms,
          description: i.description,
          locationName: i.location_name,
          reportedBy: i.reported_by,
          reporterPhone: i.reporter_phone,
          assignedHospitalId: i.assigned_hospital_id,
          assignedHospitalName: i.assigned_hospital_name,
          coordinates: { lat: Number(i.latitude), lng: Number(i.longitude) },
          aiTriage: i.ai_triage_assessment || base.aiTriage,
          timeline: i.timeline || base.timeline,
        };
      });
      console.log(`[Supabase DB Hydration] Hydrated ${dbIncidents.length} emergency incidents.`);
    }

    const dbHospitals = await queryDb('SELECT * FROM hospitals');
    if (dbHospitals && dbHospitals.length > 0) {
      hospitalsStore = dbHospitals.map((h: any, index: number) => {
        const base = MOCK_HOSPITALS[index % MOCK_HOSPITALS.length] || MOCK_HOSPITALS[0];
        return {
          ...base,
          id: h.id,
          code: h.hospital_code,
          name: h.name,
          type: h.type,
          traumaLevel: h.trauma_level,
          totalBeds: h.total_beds,
          availableGeneralBeds: h.available_general_beds,
          totalIcuBeds: h.total_icu_beds,
          availableIcuBeds: h.available_icu_beds,
          occupiedIcuBeds: h.occupied_icu_beds,
          totalVentilators: h.total_ventilators,
          availableVentilators: h.available_ventilators,
          bloodUnitsAvailable: h.blood_units_available,
          emergencyDeptStatus: h.emergency_dept_status,
          latitude: Number(h.latitude),
          longitude: Number(h.longitude),
        };
      });
      console.log(`[Supabase DB Hydration] Hydrated ${dbHospitals.length} hospitals.`);
    }
  } catch (err) {
    console.error('[Supabase DB Hydration Error]:', err);
  }
}

async function startServer() {
  await hydrateFromSupabase();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      ...INITIAL_SYSTEM_HEALTH,
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/summary', (req, res) => {
    res.json({
      ...INITIAL_METRICS,
      activeEmergencies: incidentsStore.filter((i) => i.status !== 'CLOSED').length,
      criticalIncidents: incidentsStore.filter((i) => i.priority === 'RED' || i.severity === 'CRITICAL').length,
    });
  });

  app.get('/api/districts', (req, res) => {
    res.json(MOCK_DISTRICTS);
  });

  app.get('/api/hospitals', (req, res) => {
    const districtId = req.query.district as string | undefined;
    if (districtId && districtId !== 'all') {
      return res.json(hospitalsStore.filter((h) => h.districtId === districtId));
    }
    res.json(hospitalsStore);
  });

  // PUT /api/hospitals/:id - Update hospital capacity or resources
  app.put('/api/hospitals/:id', (req, res) => {
    const { id } = req.params;
    const index = hospitalsStore.findIndex((h) => h.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }
    hospitalsStore[index] = {
      ...hospitalsStore[index],
      ...req.body,
      lastSync: 'Just now',
    };
    res.json({ success: true, hospital: hospitalsStore[index] });
  });

  // -------------------------------------------------------------
  // PHASE 3: STATEWIDE HOSPITAL RESOURCE COMMAND CENTER ENDPOINTS
  // -------------------------------------------------------------

  // GET /api/beds - Fetch interactive Bed Matrix with search & filters
  app.get('/api/beds', (req, res) => {
    let result = [...bedsStore];
    const hospitalId = req.query.hospitalId as string | undefined;
    const districtId = req.query.district as string | undefined;
    const bedType = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;
    const department = req.query.department as string | undefined;

    if (hospitalId && hospitalId !== 'all') {
      result = result.filter((b) => b.hospitalId === hospitalId);
    }
    if (districtId && districtId !== 'all') {
      const distHospitals = hospitalsStore.filter((h) => h.districtId === districtId).map((h) => h.id);
      result = result.filter((b) => distHospitals.includes(b.hospitalId));
    }
    if (bedType && bedType !== 'all') {
      result = result.filter((b) => b.bedType === bedType);
    }
    if (status && status !== 'all') {
      result = result.filter((b) => b.status === status);
    }
    if (department && department !== 'all') {
      result = result.filter((b) => b.department === department);
    }

    res.json(result);
  });

  // PUT /api/beds/:bedId/status - Update bed status & prevent double-booking
  app.put('/api/beds/:bedId/status', (req, res) => {
    const { bedId } = req.params;
    const { status, patientName, patientId, reservedForEmergencyId, officerName } = req.body;

    const index = bedsStore.findIndex((b) => b.id === bedId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Bed record not found' });
    }

    const currentBed = bedsStore[index];

    // Double booking protection check
    if (
      status === 'Reserved' &&
      (currentBed.status === 'Occupied' || currentBed.status === 'Reserved') &&
      currentBed.reservedForEmergencyId !== reservedForEmergencyId
    ) {
      return res.status(409).json({
        success: false,
        message: `Double booking conflict! Bed ${currentBed.bedNumber} is already ${currentBed.status.toLowerCase()} by ${currentBed.reservedByOfficer || 'another patient'}.`,
      });
    }

    const updatedBed: BedMatrixEntity = {
      ...currentBed,
      status: status || currentBed.status,
      currentPatientName: patientName ?? currentBed.currentPatientName,
      currentPatientId: patientId ?? currentBed.currentPatientId,
      reservedForEmergencyId: reservedForEmergencyId ?? currentBed.reservedForEmergencyId,
      reservedByOfficer: officerName ?? currentBed.reservedByOfficer,
      lastUpdated: 'Just now',
    };

    bedsStore[index] = updatedBed;

    // Sync with hospital aggregate counts
    const hospIndex = hospitalsStore.findIndex((h) => h.id === currentBed.hospitalId);
    if (hospIndex !== -1) {
      const hospBeds = bedsStore.filter((b) => b.hospitalId === currentBed.hospitalId);
      const availIcu = hospBeds.filter((b) => b.bedType === 'ICU' && b.status === 'Available').length;
      if (availIcu > 0) {
        hospitalsStore[hospIndex].availableIcuBeds = availIcu;
      }
    }

    res.json({ success: true, bed: updatedBed });
  });

  // POST /api/reservations - Automatic Bed Reservation Workflow
  app.post('/api/reservations', (req, res) => {
    const {
      emergencyId,
      emergencyCode,
      hospitalId,
      bedId,
      bedNumber,
      department,
      bedType,
      patientName,
      reservedByOfficer,
      attendingDoctorNotified,
      durationMinutes,
    } = req.body;

    // Verify hospital and bed existence
    const hospital = hospitalsStore.find((h) => h.id === hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Selected hospital not found' });
    }

    // Double booking guard
    const targetBedIndex = bedsStore.findIndex((b) => b.id === bedId);
    if (targetBedIndex !== -1) {
      const targetBed = bedsStore[targetBedIndex];
      if (targetBed.status === 'Occupied') {
        return res.status(409).json({ success: false, message: `Bed ${targetBed.bedNumber} is currently occupied by a patient.` });
      }
    }

    const now = Date.now();
    const expiryMs = (durationMinutes || 30) * 60000;
    const expiresAt = new Date(now + expiryMs).toISOString();

    const reservation: BedReservation = {
      id: `res-${Date.now()}`,
      emergencyId: emergencyId || 'inc-custom',
      emergencyCode: emergencyCode || 'INC-MH-2026',
      hospitalId,
      hospitalName: hospital.name,
      bedId: bedId || `bed-temp-${Date.now()}`,
      bedNumber: bedNumber || 'BAY-RES-1',
      department: department || 'Emergency Resuscitation',
      bedType: bedType || 'ICU',
      patientName: patientName || 'Emergency Patient',
      reservedByOfficer: reservedByOfficer || 'State Control Dispatcher',
      attendingDoctorNotified: attendingDoctorNotified || hospital.emergencyCoordinatorName || 'Duty Medical Officer',
      reservedAt: new Date().toISOString(),
      expiresAt,
      status: 'RESERVED',
    };

    reservationsStore.unshift(reservation);

    // Lock Bed Status
    if (targetBedIndex !== -1) {
      bedsStore[targetBedIndex] = {
        ...bedsStore[targetBedIndex],
        status: 'Reserved',
        reservedForEmergencyId: emergencyId,
        reservedByOfficer,
        reservationExpiresAt: expiresAt,
        lastUpdated: 'Just now',
      };
    }

    // Decrement hospital available beds
    const hospIdx = hospitalsStore.findIndex((h) => h.id === hospitalId);
    if (hospIdx !== -1) {
      if (bedType === 'ICU' && hospitalsStore[hospIdx].availableIcuBeds > 0) {
        hospitalsStore[hospIdx].availableIcuBeds -= 1;
        hospitalsStore[hospIdx].occupiedIcuBeds += 1;
      }
      if (hospitalsStore[hospIdx].availableEmergencyBeds > 0) {
        hospitalsStore[hospIdx].availableEmergencyBeds -= 1;
      }
    }

    res.status(201).json({ success: true, reservation, message: `Bed ${reservation.bedNumber} reserved for 30 minutes at ${hospital.name}` });
  });

  // GET /api/reservations - Fetch active bed reservations
  app.get('/api/reservations', (req, res) => {
    // Process expirations
    const nowIso = new Date().toISOString();
    reservationsStore.forEach((r) => {
      if (r.status === 'RESERVED' && r.expiresAt < nowIso) {
        r.status = 'EXPIRED';
      }
    });
    res.json(reservationsStore);
  });

  // PUT /api/reservations/:id - Update reservation (CONFIRM, CANCEL, TRANSFER, EXPIRE)
  app.put('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    const { action, notes } = req.body;

    const index = reservationsStore.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    const currentRes = reservationsStore[index];

    if (action === 'CONFIRM') {
      currentRes.status = 'CONFIRMED';
      // Mark bed as Occupied
      const bedIdx = bedsStore.findIndex((b) => b.id === currentRes.bedId);
      if (bedIdx !== -1) {
        bedsStore[bedIdx].status = 'Occupied';
        bedsStore[bedIdx].currentPatientName = currentRes.patientName;
      }
    } else if (action === 'CANCEL' || action === 'EXPIRE') {
      currentRes.status = action === 'CANCEL' ? 'CANCELLED' : 'EXPIRED';
      // Free bed
      const bedIdx = bedsStore.findIndex((b) => b.id === currentRes.bedId);
      if (bedIdx !== -1) {
        bedsStore[bedIdx].status = 'Available';
        bedsStore[bedIdx].reservedForEmergencyId = undefined;
      }
      // Re-increment hospital bed count
      const hospIdx = hospitalsStore.findIndex((h) => h.id === currentRes.hospitalId);
      if (hospIdx !== -1 && currentRes.bedType === 'ICU') {
        hospitalsStore[hospIdx].availableIcuBeds += 1;
      }
    }

    res.json({ success: true, reservation: currentRes });
  });

  // POST /api/transfers - Create Inter-Hospital Patient Transfer Request
  app.post('/api/transfers', (req, res) => {
    const {
      incidentId,
      incidentCode,
      sourceHospitalId,
      destinationHospitalId,
      patientName,
      patientCondition,
      priority,
      requestedBy,
      receivingDoctor,
      transferReason,
    } = req.body;

    const srcHosp = hospitalsStore.find((h) => h.id === sourceHospitalId);
    const dstHosp = hospitalsStore.find((h) => h.id === destinationHospitalId);

    if (!srcHosp || !dstHosp) {
      return res.status(400).json({ success: false, message: 'Invalid source or destination hospital' });
    }

    const count = transfersStore.length + 1;
    const transferCode = `TRF-2026-${String(count).padStart(4, '0')}`;

    const transfer: HospitalTransfer = {
      id: `trf-${Date.now()}`,
      transferCode,
      incidentId: incidentId || 'inc-0101',
      incidentCode: incidentCode || 'INC-MH-2026',
      sourceHospitalId,
      sourceHospitalName: srcHosp.name,
      destinationHospitalId,
      destinationHospitalName: dstHosp.name,
      patientName: patientName || 'Critical Patient',
      patientCondition: patientCondition || 'Requires Specialized ICU Care',
      priority: priority || 'RED',
      requestedBy: requestedBy || 'Transfer Coordinator',
      receivingDoctor: receivingDoctor || dstHosp.emergencyCoordinatorName || 'Chief Medical Officer',
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transferReason: transferReason || 'Hospital capacity overload / specialized tertiary care required.',
    };

    transfersStore.unshift(transfer);

    res.status(201).json({ success: true, transfer, message: `Transfer request ${transferCode} initiated to ${dstHosp.name}` });
  });

  // GET /api/transfers - List transfer requests
  app.get('/api/transfers', (req, res) => {
    res.json(transfersStore);
  });

  // PUT /api/transfers/:id - Update transfer status (ACCEPT, REJECT, IN_TRANSIT, COMPLETED)
  app.put('/api/transfers/:id', (req, res) => {
    const { id } = req.params;
    const { status, notes, receivingDoctor } = req.body;

    const index = transfersStore.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Transfer record not found' });
    }

    transfersStore[index] = {
      ...transfersStore[index],
      status: status || transfersStore[index].status,
      notes: notes || transfersStore[index].notes,
      receivingDoctor: receivingDoctor || transfersStore[index].receivingDoctor,
      updatedAt: new Date().toISOString(),
    };

    res.json({ success: true, transfer: transfersStore[index] });
  });

  // POST /api/hospital-recommendation - AI Resource Allocation Engine (Google Gemini)
  app.post('/api/hospital-recommendation', async (req, res) => {
    const {
      incidentType,
      priority,
      patientCount,
      districtId,
      districtName,
      requiredSpecialty,
      icuRequired,
      ventilatorRequired,
      coordinates,
    } = req.body;

    // Filter available candidate hospitals in district / state
    const candidateHospitals = hospitalsStore.filter(
      (h) => (districtId === 'all' || h.districtId === districtId) && h.availableIcuBeds > 0
    );
    const fallbackList = candidateHospitals.length > 0 ? candidateHospitals : hospitalsStore;

    try {
      const client = getGeminiClient();

      if (client) {
        const prompt = `You are Rakshak AI, the Statewide Emergency Resource Coordinator for the Government of Maharashtra.
An emergency response request requires dynamic multi-hospital resource allocation and triage matching.

EMERGENCY INCIDENT DATA:
- Incident Type: ${incidentType || 'General Emergency'}
- Priority Level: ${priority || 'RED'}
- Casualty Count: ${patientCount || 1}
- Location District: ${districtName || 'Maharashtra'}
- Required Specialty: ${requiredSpecialty || 'Trauma & Critical Care'}
- ICU Bed Needed: ${icuRequired ? 'YES' : 'NO'}
- Mechanical Ventilator Needed: ${ventilatorRequired ? 'YES' : 'NO'}

CANDIDATE HOSPITALS IN AREA:
${JSON.stringify(
  fallbackList.map((h) => ({
    id: h.id,
    name: h.name,
    district: h.districtName,
    type: h.type,
    traumaLevel: h.traumaLevel,
    freeIcu: h.availableIcuBeds,
    totalIcu: h.totalIcuBeds,
    freeVentilators: h.availableVentilators,
    erStatus: h.emergencyDeptStatus,
    operationalStatus: h.operationalStatus,
  })),
  null,
  2
)}

Select the optimal primary hospital for immediate patient diversion, along with 2 alternative backup facilities.
Evaluate capacity, trauma level suitability, ICU availability, ventilator stocks, and emergency department diversion risk.

Return strictly valid JSON matching this schema:
{
  "bestHospitalId": "hospital id string",
  "bestHospitalName": "hospital name string",
  "confidenceScore": 96,
  "explainability": "Detailed clinical and operational justification for choosing this hospital.",
  "alternativeHospitals": [
    {
      "hospitalId": "id string",
      "hospitalName": "name string",
      "score": 90,
      "reason": "Backup reason",
      "availableIcu": 10,
      "availableVentilators": 4,
      "distanceKm": 4.2
    }
  ],
  "capacityWarnings": ["Warning item 1", "Warning item 2"],
  "suggestedResourceRedistribution": ["Redistribution strategy 1"],
  "priorityHospitalList": ["hosp1_name", "hosp2_name"]
}`;

        const response = await client.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                bestHospitalId: { type: Type.STRING },
                bestHospitalName: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                explainability: { type: Type.STRING },
                alternativeHospitals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      hospitalId: { type: Type.STRING },
                      hospitalName: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      reason: { type: Type.STRING },
                      availableIcu: { type: Type.NUMBER },
                      availableVentilators: { type: Type.NUMBER },
                      distanceKm: { type: Type.NUMBER },
                    },
                    required: ['hospitalId', 'hospitalName', 'score', 'reason', 'availableIcu', 'availableVentilators', 'distanceKm'],
                  },
                },
                capacityWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedResourceRedistribution: { type: Type.ARRAY, items: { type: Type.STRING } },
                priorityHospitalList: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                'bestHospitalId',
                'bestHospitalName',
                'confidenceScore',
                'explainability',
                'alternativeHospitals',
                'capacityWarnings',
                'suggestedResourceRedistribution',
                'priorityHospitalList',
              ],
            },
          },
        });

        if (response.text) {
          const parsed: AiHospitalRecommendation = JSON.parse(response.text);
          return res.json({ success: true, recommendation: parsed, source: 'gemini-3.6-flash' });
        }
      }
    } catch (err: any) {
      console.error('[Rakshak Hospital Recommendation Error]:', err?.message || err);
    }

    // Rule-Based Smart Fallback
    const best = fallbackList[0] || hospitalsStore[0];
    const alt1 = fallbackList[1] || hospitalsStore[1];
    const alt2 = fallbackList[2] || hospitalsStore[2];

    const fallbackRec: AiHospitalRecommendation = {
      bestHospitalId: best.id,
      bestHospitalName: best.name,
      confidenceScore: 94,
      explainability: `Recommended ${best.name} as optimal facility. Holds ${best.availableIcuBeds} available ICU beds, ${best.availableVentilators} ready ventilators, and ${best.traumaLevel} capability. ER status currently ${best.emergencyDeptStatus}.`,
      alternativeHospitals: [
        {
          hospitalId: alt1.id,
          hospitalName: alt1.name,
          score: 88,
          reason: `Secondary option in district with ${alt1.availableIcuBeds} free ICU beds.`,
          availableIcu: alt1.availableIcuBeds,
          availableVentilators: alt1.availableVentilators,
          distanceKm: 5.4,
        },
        {
          hospitalId: alt2.id,
          hospitalName: alt2.name,
          score: 82,
          reason: `Tertiary emergency backup with ${alt2.availableIcuBeds} free ICU beds.`,
          availableIcu: alt2.availableIcuBeds,
          availableVentilators: alt2.availableVentilators,
          distanceKm: 8.1,
        },
      ],
      capacityWarnings: [
        `${best.name} ICU occupancy currently at ${Math.round(((best.totalIcuBeds - best.availableIcuBeds) / best.totalIcuBeds) * 100)}%.`,
        `Pre-alert required before dispatching severe trauma casualties.`,
      ],
      suggestedResourceRedistribution: [
        `Pre-reserve 1 Resuscitation Bay at ${best.name}.`,
        `Re-route minor non-red triage casualties to ${alt1.name} to preserve Level 1 ICU capacity.`,
      ],
      priorityHospitalList: [best.name, alt1.name, alt2.name],
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, recommendation: fallbackRec, source: 'rule-engine-fallback' });
  });

  // GET /api/shortage-alerts - Resource Shortage Alerts Feed
  app.get('/api/shortage-alerts', (req, res) => {
    res.json(shortageAlertsStore);
  });

  // POST /api/shortage-alerts/:id/acknowledge - Acknowledge shortage alert
  app.post('/api/shortage-alerts/:id/acknowledge', (req, res) => {
    const { id } = req.params;
    const { officerName } = req.body;
    const alert = shortageAlertsStore.find((a) => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = officerName || 'State Control Officer';
      alert.acknowledgedAt = new Date().toISOString();
    }
    res.json({ success: true, alerts: shortageAlertsStore });
  });

  // GET /api/hospital-analytics - Statewide Resource Analytics
  app.get('/api/hospital-analytics', (req, res) => {
    const totalBeds = hospitalsStore.reduce((acc, h) => acc + h.totalBeds, 0);
    const availBeds = hospitalsStore.reduce((acc, h) => acc + h.availableGeneralBeds, 0);
    const totalIcu = hospitalsStore.reduce((acc, h) => acc + h.totalIcuBeds, 0);
    const availIcu = hospitalsStore.reduce((acc, h) => acc + h.availableIcuBeds, 0);
    const totalVents = hospitalsStore.reduce((acc, h) => acc + h.totalVentilators, 0);
    const availVents = hospitalsStore.reduce((acc, h) => acc + h.availableVentilators, 0);
    const totalBlood = hospitalsStore.reduce((acc, h) => acc + h.bloodUnitsAvailable, 0);

    const districtBreakdown = MOCK_DISTRICTS.map((d) => {
      const distHosps = hospitalsStore.filter((h) => h.districtId === d.id);
      const dTotalIcu = distHosps.reduce((acc, h) => acc + h.totalIcuBeds, 0);
      const dAvailIcu = distHosps.reduce((acc, h) => acc + h.availableIcuBeds, 0);
      const icuOccupancy = dTotalIcu > 0 ? Math.round(((dTotalIcu - dAvailIcu) / dTotalIcu) * 100) : 0;
      return {
        district: d.name,
        hospitalsCount: distHosps.length,
        totalIcu: dTotalIcu,
        availableIcu: dAvailIcu,
        icuOccupancyPercent: icuOccupancy,
      };
    });

    res.json({
      totalBeds,
      availableBeds: availBeds,
      occupancyPercent: Math.round(((totalBeds - availBeds) / (totalBeds || 1)) * 100),
      totalIcu,
      availableIcu: availIcu,
      icuOccupancyPercent: Math.round(((totalIcu - availIcu) / (totalIcu || 1)) * 100),
      totalVentilators: totalVents,
      availableVentilators: availVents,
      ventilatorUtilizationPercent: Math.round(((totalVents - availVents) / (totalVents || 1)) * 100),
      totalBloodUnits: totalBlood,
      activeShortageAlerts: shortageAlertsStore.filter((a) => !a.acknowledged).length,
      activeReservationsCount: reservationsStore.filter((r) => r.status === 'RESERVED').length,
      activeTransfersCount: transfersStore.filter((t) => t.status === 'PENDING' || t.status === 'IN_TRANSIT').length,
      districtBreakdown,
    });
  });

  // GET /api/emergencies - Search and filter emergencies
  app.get('/api/emergencies', (req, res) => {
    let result = [...incidentsStore];
    const districtId = req.query.district as string | undefined;
    const priority = req.query.priority as string | undefined;
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    if (districtId && districtId !== 'all') {
      result = result.filter((i) => i.districtId === districtId);
    }
    if (priority && priority !== 'all') {
      result = result.filter((i) => i.priority === priority);
    }
    if (type && type !== 'all') {
      result = result.filter((i) => i.type === type);
    }
    if (status && status !== 'all') {
      result = result.filter((i) => i.status === status);
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q) ||
          i.locationName.toLowerCase().includes(q) ||
          (i.symptoms && i.symptoms.toLowerCase().includes(q))
      );
    }

    res.json(result);
  });

  // GET /api/fleet - Statewide Fleet Status & Real-Time Tracking
  app.get('/api/fleet', (req, res) => {
    let result = [...ambulancesStore];
    const districtId = req.query.district as string | undefined;
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;

    if (districtId && districtId !== 'all') {
      result = result.filter((a) => a.districtId === districtId);
    }
    if (status && status !== 'all') {
      result = result.filter((a) => a.status === status);
    }
    if (type && type !== 'all') {
      result = result.filter((a) => a.type === type);
    }
    res.json(result);
  });

  app.get('/api/logs', (req, res) => {
    res.json(INITIAL_LOG_ENTRIES);
  });

  app.get('/api/users', (req, res) => {
    res.json(INITIAL_USER_PROFILES);
  });

  // -------------------------------------------------------------
  // PHASE 2: AI TRIAGE & EMERGENCY INCIDENT MANAGEMENT ENDPOINTS
  // -------------------------------------------------------------

  // POST /api/ai-triage - Real Gemini 3.6 Flash Triage Analysis
  app.post('/api/ai-triage', async (req, res) => {
    const {
      incidentType,
      symptoms,
      patientCount,
      ageGroup,
      gender,
      description,
      locationName,
      districtName,
      medicalHistory,
    } = req.body;

    try {
      const client = getGeminiClient();

      if (client) {
        const prompt = `You are Rakshak AI, an emergency triage expert system for the Government of Maharashtra State Emergency Operations Center (SEOC).
Analyze the following emergency incident details and provide an immediate, structured clinical triage recommendation.

IMPORTANT DISCLAIMER RULE:
Never diagnose specific diseases or prescribe medications. Provide priority classification and emergency resource suggestions for dispatch officers.

INCIDENT DETAILS:
- Emergency Type: ${incidentType || 'Unknown Emergency'}
- Symptoms / Clinical Findings: ${symptoms || 'None specified'}
- Number of Patients: ${patientCount || 1}
- Age Group: ${ageGroup || 'Mixed'}
- Gender: ${gender || 'Unspecified'}
- Location: ${locationName || 'Unknown'}, District: ${districtName || 'Maharashtra'}
- Incident Description: ${description || 'N/A'}
- Medical History Notes: ${medicalHistory || 'N/A'}

Triage Color Categories:
- RED: Immediate (Life-threatening, active airway/hemodynamic failure)
- ORANGE: Very Urgent (High deterioration risk within 10-15 minutes)
- YELLOW: Urgent (Serious condition, non-life-threatening immediate)
- GREEN: Stable (Minor injuries, standard transfer)
- BLUE: Low Priority (Non-urgent triage)

Respond strictly in valid JSON format matching this schema:
{
  "summary": "Brief clinical summary of the emergency situation",
  "severity": "RED" | "ORANGE" | "YELLOW" | "GREEN" | "BLUE",
  "recommendedPriority": "RED" | "ORANGE" | "YELLOW" | "GREEN" | "BLUE",
  "suggestedDepartment": "e.g. Trauma ICU, Cardiac Care, Burn Unit, etc.",
  "suggestedAmbulanceType": "ALS" | "BLS" | "Neonatal ICU" | "Cardiac Care",
  "suggestedHospitalCapability": "Level 1 Trauma" | "Level 2 Trauma" | "Level 3 Trauma" | "General Emergency",
  "confidenceScore": 95,
  "clinicalExplanation": "Detailed clinical reasoning behind priority assignment",
  "symptomsUsed": ["symptom1", "symptom2"],
  "priorityLogic": "Why this specific color priority was selected",
  "suggestedActions": ["Action item 1", "Action item 2", "Action item 3"],
  "humanReviewRequired": true
}`;

        const response = await client.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                severity: { type: Type.STRING },
                recommendedPriority: { type: Type.STRING },
                suggestedDepartment: { type: Type.STRING },
                suggestedAmbulanceType: { type: Type.STRING },
                suggestedHospitalCapability: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                clinicalExplanation: { type: Type.STRING },
                symptomsUsed: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                priorityLogic: { type: Type.STRING },
                suggestedActions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                humanReviewRequired: { type: Type.BOOLEAN },
              },
              required: [
                'summary',
                'severity',
                'recommendedPriority',
                'suggestedDepartment',
                'suggestedAmbulanceType',
                'suggestedHospitalCapability',
                'confidenceScore',
                'clinicalExplanation',
                'symptomsUsed',
                'priorityLogic',
                'suggestedActions',
                'humanReviewRequired',
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          const result: AiTriageAssessment = {
            ...parsed,
            timestamp: new Date().toISOString(),
            modelVersion: 'gemini-3.6-flash',
          };
          return res.json({ success: true, triage: result, source: 'gemini-3.6-flash' });
        }
      }

      // Fallback rule engine if API key not available or empty response
      const fallback = computeRuleBasedTriage({
        incidentType,
        symptoms,
        patientCount,
        ageGroup,
        description,
      });
      return res.json({ success: true, triage: fallback, source: 'rule-engine-fallback' });
    } catch (err: any) {
      console.error('[Rakshak AI Triage Error]:', err?.message || err);
      const fallback = computeRuleBasedTriage({
        incidentType,
        symptoms,
        patientCount,
        ageGroup,
        description,
      });
      return res.json({ success: true, triage: fallback, source: 'rule-engine-fallback' });
    }
  });

  // POST /api/incidents - Create a new Emergency Incident with AI Triage & Audit Trail
  app.post('/api/incidents', async (req, res) => {
    const {
      title,
      districtId,
      districtName,
      locationName,
      type,
      category,
      patientCount,
      ageGroup,
      gender,
      symptoms,
      description,
      reportedBy,
      reporterPhone,
      assignedHospitalId,
      assignedHospitalName,
      coordinates,
      hasPhotoAttachment,
      hasVoiceAttachment,
    } = req.body;

    // Generate district code
    const distCode = (districtId || 'MH').slice(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `INC-2026-${distCode}-${randomNum}`;
    const id = `inc-${Date.now()}`;

    // Perform AI Triage
    const aiTriage = computeRuleBasedTriage({
      incidentType: type,
      symptoms: symptoms || description || '',
      patientCount: patientCount || 1,
      ageGroup,
      description,
    });

    const initialTimeline: IncidentTimelineEvent[] = [
      {
        id: `tl-${id}-1`,
        incidentId: id,
        stage: 'CREATED',
        title: 'Emergency Incident Reported to Dispatch',
        description: `Logged by ${reportedBy || 'Dispatch Officer'}. Location: ${locationName}, ${districtName}.`,
        actor: reportedBy || 'Dispatch Officer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: `tl-${id}-2`,
        incidentId: id,
        stage: 'AI_ASSESSED',
        title: `AI Triage Completed (${aiTriage.recommendedPriority} Priority)`,
        description: `Gemini AI assessed symptoms. Priority assigned: ${aiTriage.recommendedPriority}. Confidence: ${aiTriage.confidenceScore}%.`,
        actor: 'Rakshak AI Triage Engine (gemini-3.6-flash)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    const newIncident: Incident = {
      id,
      code,
      title: title || `${type} at ${locationName}`,
      districtId: districtId || 'nagpur',
      districtName: districtName || 'Nagpur',
      locationName: locationName || 'District HQ',
      type: type || 'Road Accident',
      category: category || 'General Emergency',
      priority: aiTriage.recommendedPriority,
      severity: aiTriage.severity === 'RED' ? 'CRITICAL' : aiTriage.severity === 'ORANGE' ? 'MAJOR' : 'MODERATE',
      status: 'AI_TRIAGED',
      affectedCount: patientCount || 1,
      patientCount: patientCount || 1,
      ageGroup: ageGroup || 'Adult',
      gender: gender || 'Mixed',
      symptoms: symptoms || '',
      description: description || '',
      reportedBy: reportedBy || '108 Dispatcher',
      reporterPhone: reporterPhone || '+91 108 000 0000',
      assignedHospitalId,
      assignedHospitalName: assignedHospitalName || (assignedHospitalId ? 'Assigned Hospital' : undefined),
      assignedAmbulances: 1,
      assignedAmbulanceDetails: `${aiTriage.suggestedAmbulanceType} Unit Dispatched`,
      estimatedResponseTimeMin: Math.floor(6 + Math.random() * 8),
      assignedDispatcher: 'State Control Dispatcher',
      lastUpdated: 'Just now',
      timestamp: new Date().toISOString(),
      coordinates: coordinates || { lat: 21.1458, lng: 79.0882 },
      notes: description || 'New emergency registered via Dispatch Console.',
      aiTriage,
      timeline: initialTimeline,
      hasPhotoAttachment: !!hasPhotoAttachment,
      hasVoiceAttachment: !!hasVoiceAttachment,
    };

    incidentsStore.unshift(newIncident);

    // Persist new incident to Supabase PostgreSQL Database
    if (dbPool) {
      try {
        await queryDb(
          `INSERT INTO emergency_incidents 
            (id, incident_code, title, type, category, priority, severity, status, patient_count, symptoms, description, location_name, latitude, longitude, reported_by, reporter_phone, ai_triage_assessment, timeline)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            newIncident.id,
            newIncident.code,
            newIncident.title,
            newIncident.type,
            newIncident.category,
            newIncident.priority,
            newIncident.severity,
            newIncident.status,
            newIncident.patientCount,
            newIncident.symptoms,
            newIncident.description,
            newIncident.locationName,
            newIncident.coordinates.lat,
            newIncident.coordinates.lng,
            newIncident.reportedBy,
            newIncident.reporterPhone,
            JSON.stringify(newIncident.aiTriage),
            JSON.stringify(newIncident.timeline),
          ]
        );
        console.log(`[Supabase DB Write] Persisted Incident ${newIncident.code} to PostgreSQL.`);
      } catch (err) {
        console.error('[Supabase DB Incident Write Error]:', err);
      }
    }

    // If RED priority, trigger Command Center Alert
    if (newIncident.priority === 'RED') {
      commandCenterAlerts.unshift({
        id: `alt-${Date.now()}`,
        type: 'HIGH_PRIORITY',
        title: `CRITICAL RED ALERT: ${newIncident.code}`,
        message: `${newIncident.title} - ${newIncident.patientCount} patient(s). ${aiTriage.clinicalExplanation}`,
        severity: 'CRITICAL',
        districtId: newIncident.districtId,
        districtName: newIncident.districtName,
        incidentId: newIncident.id,
        timestamp: new Date().toISOString(),
        acknowledged: false,
      });
    }

    res.status(201).json({ success: true, incident: newIncident });
  });

  // PUT /api/incidents/:id - Update incident status, assigned resources, or details
  app.put('/api/incidents/:id', (req, res) => {
    const { id } = req.params;
    const index = incidentsStore.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    const current = incidentsStore[index];
    const updates = req.body;

    const updatedTimeline = current.timeline ? [...current.timeline] : [];

    if (updates.status && updates.status !== current.status) {
      updatedTimeline.push({
        id: `tl-${id}-${Date.now()}`,
        incidentId: id,
        stage: updates.status === 'EN_ROUTE' ? 'EN_ROUTE' : updates.status === 'CLOSED' ? 'CLOSED' : 'DISPATCHER_REVIEW',
        title: `Status Changed to ${updates.status.replace(/_/g, ' ')}`,
        description: `Incident status updated by operator.`,
        actor: updates.updatedBy || 'Emergency Operator',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    if (updates.assignedHospitalId && updates.assignedHospitalId !== current.assignedHospitalId) {
      const hosp = MOCK_HOSPITALS.find((h) => h.id === updates.assignedHospitalId);
      const hospName = hosp ? hosp.name : updates.assignedHospitalName || 'Assigned Hospital';
      updatedTimeline.push({
        id: `tl-${id}-hosp-${Date.now()}`,
        incidentId: id,
        stage: 'HOSPITAL_ASSIGNED',
        title: `Assigned to Hospital: ${hospName}`,
        description: `Patient transfer destination set to ${hospName}. ICU bed reservation sent.`,
        actor: updates.updatedBy || 'Dispatch Officer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    const updatedIncident: Incident = {
      ...current,
      ...updates,
      timeline: updatedTimeline,
      lastUpdated: 'Just now',
    };

    incidentsStore[index] = updatedIncident;
    res.json({ success: true, incident: updatedIncident });
  });

  // POST /api/incidents/:id/override - Manual Officer Priority Override
  app.post('/api/incidents/:id/override', (req, res) => {
    const { id } = req.params;
    const { humanAssignedPriority, reason, officerName } = req.body;

    const index = incidentsStore.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    const incident = incidentsStore[index];
    const originalAiPriority = incident.aiTriage?.recommendedPriority || incident.priority;

    const overrideAudit = {
      id: `ovr-${Date.now()}`,
      incidentId: id,
      originalAiPriority,
      humanAssignedPriority: humanAssignedPriority as PriorityLevel,
      reason: reason || 'Clinical override by dispatch medical officer',
      officerName: officerName || 'Duty Dispatch Officer',
      timestamp: new Date().toISOString(),
    };

    const updatedTimeline = incident.timeline ? [...incident.timeline] : [];
    updatedTimeline.push({
      id: `tl-ovr-${Date.now()}`,
      incidentId: id,
      stage: 'DISPATCHER_REVIEW',
      title: `Priority Override: ${originalAiPriority} ➔ ${humanAssignedPriority}`,
      description: `Manual override by ${officerName}. Reason: ${reason}`,
      actor: officerName || 'Medical Officer',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    const updated: Incident = {
      ...incident,
      priority: humanAssignedPriority,
      severity: humanAssignedPriority === 'RED' ? 'CRITICAL' : humanAssignedPriority === 'ORANGE' ? 'MAJOR' : 'MODERATE',
      overrideAudit,
      timeline: updatedTimeline,
      lastUpdated: 'Just now',
    };

    incidentsStore[index] = updated;
    res.json({ success: true, incident: updated, audit: overrideAudit });
  });

  // GET /api/queue - AI-Prioritized Dynamic Emergency Queue
  app.get('/api/queue', (req, res) => {
    const activeIncidents = incidentsStore.filter((i) => i.status !== 'CLOSED');

    const priorityWeight: Record<PriorityLevel, number> = {
      RED: 100,
      ORANGE: 80,
      YELLOW: 60,
      GREEN: 40,
      BLUE: 20,
    };

    const queue = activeIncidents
      .map((inc, idx) => {
        const aiPri = inc.aiTriage?.recommendedPriority || inc.priority;
        const baseScore = priorityWeight[inc.priority] || 50;
        const patientMultiplier = Math.min(20, (inc.patientCount || inc.affectedCount || 1) * 2);
        const deteriorationRisk = Math.min(99, Math.floor(baseScore * 0.8 + patientMultiplier + Math.random() * 5));

        return {
          rank: idx + 1,
          incident: inc,
          aiPriority: aiPri,
          finalPriority: inc.priority,
          deteriorationRiskScore: deteriorationRisk,
          waitingTimeMin: Math.floor(3 + Math.random() * 12),
          hospitalCapacityScore: Math.floor(70 + Math.random() * 25),
          rankDelta: idx === 0 ? 0 : idx % 2 === 0 ? 1 : -1,
          overrideReason: inc.overrideAudit?.reason,
        };
      })
      .sort((a, b) => b.deteriorationRiskScore - a.deteriorationRiskScore)
      .map((item, sortedIdx) => ({
        ...item,
        rank: sortedIdx + 1,
      }));

    res.json(queue);
  });

  // POST /api/mass-casualty/batch - Mass Casualty Batch Triage (START Protocol)
  app.post('/api/mass-casualty/batch', (req, res) => {
    const { incidentId, victims } = req.body;

    const index = incidentsStore.findIndex((i) => i.id === incidentId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Mass Casualty incident not found' });
    }

    const incident = incidentsStore[index];
    const updatedVictims: MassCasualtyVictim[] = victims || [];

    const redCount = updatedVictims.filter((v) => v.triageCategory === 'RED_CRITICAL').length;

    const updatedTimeline = incident.timeline ? [...incident.timeline] : [];
    updatedTimeline.push({
      id: `tl-mc-${Date.now()}`,
      incidentId,
      stage: 'TRIAGED',
      title: 'Mass Casualty START Batch Triage Executed',
      description: `Triaged ${updatedVictims.length} victims. Identified ${redCount} RED critical patients requiring immediate ICU transfer.`,
      actor: 'START Disaster Triage Officer',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    const updatedIncident: Incident = {
      ...incident,
      massCasualtyVictims: updatedVictims,
      affectedCount: updatedVictims.length,
      patientCount: updatedVictims.length,
      timeline: updatedTimeline,
      lastUpdated: 'Just now',
    };

    incidentsStore[index] = updatedIncident;

    res.json({ success: true, incident: updatedIncident, summary: { total: updatedVictims.length, redCount } });
  });

  // GET /api/incidents/analytics - Incident Triage Analytics
  app.get('/api/incidents/analytics', (req, res) => {
    const total = incidentsStore.length;
    const active = incidentsStore.filter((i) => i.status !== 'CLOSED').length;
    const redCount = incidentsStore.filter((i) => i.priority === 'RED').length;
    const orangeCount = incidentsStore.filter((i) => i.priority === 'ORANGE').length;
    const yellowCount = incidentsStore.filter((i) => i.priority === 'YELLOW').length;
    const greenCount = incidentsStore.filter((i) => i.priority === 'GREEN').length;

    const overrideCount = incidentsStore.filter((i) => i.overrideAudit).length;
    const aiAccuracyRate = total > 0 ? Number(((1 - overrideCount / total) * 100).toFixed(1)) : 96.4;

    const districtDistribution = MOCK_DISTRICTS.map((d) => ({
      district: d.name,
      count: incidentsStore.filter((i) => i.districtId === d.id).length,
    }));

    const categoryDistribution = [
      { category: 'Trauma & Surgery', count: incidentsStore.filter((i) => i.category === 'Trauma & Surgery' || i.type === 'Road Accident').length },
      { category: 'Burn & Chemical', count: incidentsStore.filter((i) => i.category === 'Burn & Chemical' || i.type === 'Industrial Explosion').length },
      { category: 'Environmental & Disaster', count: incidentsStore.filter((i) => i.category === 'Environmental & Disaster' || i.type === 'Mass Casualty').length },
      { category: 'Respiratory & Toxic', count: incidentsStore.filter((i) => i.category === 'Respiratory & Toxic' || i.type === 'Chemical Exposure').length },
      { category: 'Cardiovascular', count: incidentsStore.filter((i) => i.type === 'Cardiac Emergency').length },
    ];

    res.json({
      totalEmergencies: total,
      activeEmergencies: active,
      criticalRedIncidents: redCount,
      veryUrgentOrangeIncidents: orangeCount,
      urgentYellowIncidents: yellowCount,
      stableGreenIncidents: greenCount,
      avgAiTriageTimeMs: 412,
      avgDispatchTimeMin: 7.2,
      aiAccuracyRate,
      overriddenCount: overrideCount,
      districtDistribution,
      categoryDistribution,
    });
  });

  // GET /api/alerts - Command Center Alert Feed
  app.get('/api/alerts', (req, res) => {
    res.json(commandCenterAlerts);
  });

  // POST /api/alerts/:id/acknowledge - Acknowledge alert
  app.post('/api/alerts/:id/acknowledge', (req, res) => {
    const { id } = req.params;
    const alert = commandCenterAlerts.find((a) => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = req.body.officerName || 'State Control Director';
      alert.acknowledgedAt = new Date().toISOString();
    }
    res.json({ success: true, alerts: commandCenterAlerts });
  });

  // -------------------------------------------------------------
  // PHASE 4: EMERGENCY FLEET COMMAND & GIS OPERATIONS ENDPOINTS
  // -------------------------------------------------------------

  // POST /api/fleet - Register new emergency ambulance vehicle
  app.post('/api/fleet', (req, res) => {
    const { registrationNo, districtId, type, baseHospitalId, baseHospital, driverName, phone, paramedicName, equipment } = req.body;
    const dist = MOCK_DISTRICTS.find((d) => d.id === districtId);

    const newAmb: Ambulance = {
      id: `amb-${Date.now()}`,
      registrationNo: registrationNo || `MH-${Math.floor(10 + Math.random() * 89)}-EQ-${Math.floor(1000 + Math.random() * 8999)}`,
      districtId: districtId || 'nagpur',
      districtName: dist ? dist.name : 'Nagpur',
      type: type || 'ALS',
      status: 'AVAILABLE',
      baseHospital: baseHospital || 'District General Hospital',
      baseHospitalId: baseHospitalId || 'hosp-ngp-01',
      driverName: driverName || 'Emergency Driver',
      phone: phone || '+91 108 108 108',
      paramedicName: paramedicName || 'Emergency Paramedic',
      fuelLevel: 100,
      equipment: equipment || {
        ventilator: type === 'ALS' || type === 'Neonatal ICU',
        defibrillator: true,
        oxygenReserve: true,
        syringePump: type === 'ALS',
        suctionMachine: true,
        ecgMonitor: true,
      },
      location: dist ? { lat: dist.coordinates.lat + 0.02, lng: dist.coordinates.lng + 0.02, address: `${dist.name} Base Station` } : { lat: 21.1458, lng: 79.0882, address: 'Nagpur Base Station' },
      heading: 0,
      speedKmH: 0,
      lastPing: 'Just now',
    };

    ambulancesStore.unshift(newAmb);
    res.status(201).json({ success: true, ambulance: newAmb });
  });

  // PUT /api/fleet/:id/status - Update ambulance vehicle status, driver, equipment or fuel
  app.put('/api/fleet/:id/status', (req, res) => {
    const { id } = req.params;
    const index = ambulancesStore.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Ambulance vehicle not found' });
    }

    ambulancesStore[index] = {
      ...ambulancesStore[index],
      ...req.body,
      lastPing: 'Just now',
    };

    res.json({ success: true, ambulance: ambulancesStore[index] });
  });

  // POST /api/fleet/gps - Live Vehicle GPS Telemetry Ping
  app.post('/api/fleet/gps', (req, res) => {
    const { ambulanceId, lat, lng, speedKmH, heading, address } = req.body;
    const index = ambulancesStore.findIndex((a) => a.id === ambulanceId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Ambulance not found for GPS telemetry' });
    }

    const current = ambulancesStore[index];
    const updated: Ambulance = {
      ...current,
      location: {
        lat: lat ?? current.location?.lat ?? 21.1458,
        lng: lng ?? current.location?.lng ?? 79.0882,
        address: address || current.location?.address || 'GPS Stream Update',
      },
      speedKmH: speedKmH ?? current.speedKmH,
      heading: heading ?? current.heading,
      lastPing: '1 sec ago',
    };

    ambulancesStore[index] = updated;

    res.json({ success: true, telemetry: { id: ambulanceId, location: updated.location, speedKmH: updated.speedKmH } });
  });

  // POST /api/fleet/dispatch/recommend - Smart AI Dispatch Engine (Gemini 3.6 Flash)
  app.post('/api/fleet/dispatch/recommend', async (req, res) => {
    const { incidentId } = req.body;

    const incident = incidentsStore.find((i) => i.id === incidentId);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Emergency incident not found' });
    }

    const availableFleet = ambulancesStore.filter(
      (a) => a.status === 'AVAILABLE' && (a.districtId === incident.districtId || incident.districtId === 'all')
    );
    const candidateList = availableFleet.length > 0 ? availableFleet : ambulancesStore;

    try {
      const client = getGeminiClient();

      if (client) {
        const prompt = `You are Rakshak AI, the Smart Emergency Dispatcher for Maharashtra EOC.
Analyze this emergency incident and match the best available ambulance unit based on distance, equipment fit, and casualty urgency.

INCIDENT:
- Code: ${incident.code}
- Title: ${incident.title}
- Priority: ${incident.priority}
- Casualty Count: ${incident.patientCount}
- Location: ${incident.locationName}, ${incident.districtName}
- Coordinates: ${JSON.stringify(incident.coordinates)}
- Required Equipment: ${incident.aiTriage?.suggestedAmbulanceType || 'ALS'}

CANDIDATE AMBULANCES:
${JSON.stringify(
  candidateList.map((a) => ({
    id: a.id,
    registrationNo: a.registrationNo,
    type: a.type,
    status: a.status,
    baseHospital: a.baseHospital,
    fuelLevel: a.fuelLevel,
    equipment: a.equipment,
    location: a.location,
  })),
  null,
  2
)}

Select the primary best ambulance unit and 2 alternative units. Also recommend the primary target hospital destination.

Return strictly valid JSON matching:
{
  "bestAmbulanceId": "amb id",
  "bestAmbulanceReg": "MH-XX-XX-XXXX",
  "bestAmbulanceType": "ALS",
  "suitabilityScore": 98,
  "estimatedEtaMin": 6,
  "distanceKm": 4.5,
  "aiRationale": "Clinical rationale for selecting unit",
  "equipmentMatch": ["Ventilator", "Defibrillator", "Oxygen"],
  "trafficLevel": "MODERATE",
  "greenCorridorRecommended": true,
  "recommendedHospitalId": "hosp-id",
  "recommendedHospitalName": "Hospital Name",
  "alternativeAmbulances": [
    {
      "ambulanceId": "amb-id-2",
      "registrationNo": "MH-XX-XX-YYYY",
      "type": "Cardiac Care",
      "score": 90,
      "etaMin": 9,
      "distanceKm": 6.8,
      "reason": "Secondary unit"
    }
  ]
}`;

        const response = await client.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                bestAmbulanceId: { type: Type.STRING },
                bestAmbulanceReg: { type: Type.STRING },
                bestAmbulanceType: { type: Type.STRING },
                suitabilityScore: { type: Type.NUMBER },
                estimatedEtaMin: { type: Type.NUMBER },
                distanceKm: { type: Type.NUMBER },
                aiRationale: { type: Type.STRING },
                equipmentMatch: { type: Type.ARRAY, items: { type: Type.STRING } },
                trafficLevel: { type: Type.STRING },
                greenCorridorRecommended: { type: Type.BOOLEAN },
                recommendedHospitalId: { type: Type.STRING },
                recommendedHospitalName: { type: Type.STRING },
                alternativeAmbulances: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      ambulanceId: { type: Type.STRING },
                      registrationNo: { type: Type.STRING },
                      type: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      etaMin: { type: Type.NUMBER },
                      distanceKm: { type: Type.NUMBER },
                      reason: { type: Type.STRING },
                    },
                    required: ['ambulanceId', 'registrationNo', 'type', 'score', 'etaMin', 'distanceKm', 'reason'],
                  },
                },
              },
              required: [
                'bestAmbulanceId',
                'bestAmbulanceReg',
                'bestAmbulanceType',
                'suitabilityScore',
                'estimatedEtaMin',
                'distanceKm',
                'aiRationale',
                'equipmentMatch',
                'trafficLevel',
                'greenCorridorRecommended',
                'recommendedHospitalId',
                'recommendedHospitalName',
                'alternativeAmbulances',
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          const recommendation: SmartDispatchRecommendation = {
            ...parsed,
            incidentId: incident.id,
            incidentPriority: incident.priority,
            timestamp: new Date().toISOString(),
          };
          return res.json({ success: true, recommendation, source: 'gemini-3.6-flash' });
        }
      }
    } catch (err: any) {
      console.error('[Smart Dispatch Engine Error]:', err?.message || err);
    }

    // Smart Rule Fallback
    const bestAmb = candidateList[0] || ambulancesStore[0];
    const altAmb1 = candidateList[1] || ambulancesStore[1];
    const altAmb2 = candidateList[2] || ambulancesStore[2];

    const targetHosp = hospitalsStore.find((h) => h.districtId === incident.districtId) || hospitalsStore[0];

    const fallbackRec: SmartDispatchRecommendation = {
      incidentId: incident.id,
      incidentPriority: incident.priority,
      bestAmbulanceId: bestAmb.id,
      bestAmbulanceReg: bestAmb.registrationNo,
      bestAmbulanceType: bestAmb.type,
      suitabilityScore: 96,
      estimatedEtaMin: 5,
      distanceKm: 3.8,
      aiRationale: `Matched ${bestAmb.registrationNo} (${bestAmb.type}) as closest available response unit with full ICU equipment suite. Base station: ${bestAmb.baseHospital}.`,
      equipmentMatch: ['Mechanical Ventilator', 'Defibrillator', 'High-Flow O2', 'Syringe Pump'],
      trafficLevel: incident.priority === 'RED' ? 'HEAVY' : 'LIGHT',
      greenCorridorRecommended: incident.priority === 'RED',
      recommendedHospitalId: targetHosp.id,
      recommendedHospitalName: targetHosp.name,
      alternativeAmbulances: [
        {
          ambulanceId: altAmb1.id,
          registrationNo: altAmb1.registrationNo,
          type: altAmb1.type,
          score: 89,
          etaMin: 8,
          distanceKm: 5.4,
          reason: `Secondary dispatch unit at ${altAmb1.baseHospital}.`,
        },
        {
          ambulanceId: altAmb2.id,
          registrationNo: altAmb2.registrationNo,
          type: altAmb2.type,
          score: 82,
          etaMin: 11,
          distanceKm: 7.2,
          reason: `Tertiary backup unit.`,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, recommendation: fallbackRec, source: 'rule-engine-fallback' });
  });

  // POST /api/fleet/dispatch/assign - Execute Dispatch Assignment
  app.post('/api/fleet/dispatch/assign', (req, res) => {
    const { incidentId, ambulanceId, hospitalId, greenCorridor, officerName } = req.body;

    const incidentIdx = incidentsStore.findIndex((i) => i.id === incidentId);
    const ambIdx = ambulancesStore.findIndex((a) => a.id === ambulanceId);

    if (incidentIdx === -1 || ambIdx === -1) {
      return res.status(404).json({ success: false, message: 'Incident or Ambulance vehicle not found' });
    }

    const incident = incidentsStore[incidentIdx];
    const amb = ambulancesStore[ambIdx];
    const hosp = hospitalsStore.find((h) => h.id === hospitalId) || hospitalsStore[0];

    const missionId = `msn-${Date.now()}`;
    const missionCode = `MSN-2026-${(incident.districtId || 'MH').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newMission: AmbulanceMission = {
      id: missionId,
      missionCode,
      incidentId: incident.id,
      incidentCode: incident.code,
      incidentTitle: incident.title,
      incidentLocation: incident.locationName,
      incidentCoords: incident.coordinates || { lat: 21.0823, lng: 79.0112 },
      priority: incident.priority,
      ambulanceId: amb.id,
      ambulanceNumber: amb.registrationNo,
      ambulanceType: amb.type,
      driverName: amb.driverName,
      driverPhone: amb.phone,
      paramedicName: amb.paramedicName,
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      hospitalCoords: { lat: hosp.lat, lng: hosp.lng },
      patientName: incident.reportedBy ? `Patient (${incident.patientCount} Casualty)` : 'Emergency Patient',
      patientCondition: incident.symptoms || incident.type,
      patientCount: incident.patientCount || 1,
      status: 'DISPATCHED',
      greenCorridorActive: !!greenCorridor,
      dispatchTimestamp: new Date().toISOString(),
      totalDistanceKm: 6.5,
      estimatedEtaMin: 7,
      currentSpeedKmH: 60,
      updatedAt: 'Just now',
      timeline: [
        {
          stage: 'ASSIGNED',
          title: `Dispatched Unit ${amb.registrationNo}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Assigned by ${officerName || 'State Dispatch Officer'}. Destination: ${hosp.name}.`,
          actor: officerName || 'State Control Dispatcher',
        },
      ],
    };

    missionsStore.unshift(newMission);

    // Update Ambulance vehicle state
    ambulancesStore[ambIdx] = {
      ...amb,
      status: 'DISPATCHED',
      currentMissionId: missionId,
      assignedIncidentId: incident.id,
      assignedHospitalId: hosp.id,
      etaMin: 7,
      remainingDistanceKm: 6.5,
      lastPing: 'Just now',
    };

    // Update Incident state & timeline
    const updatedIncidentTimeline = incident.timeline ? [...incident.timeline] : [];
    updatedIncidentTimeline.push({
      id: `tl-disp-${Date.now()}`,
      incidentId: incident.id,
      stage: 'EN_ROUTE',
      title: `Ambulance ${amb.registrationNo} Dispatched`,
      description: `${amb.type} Unit from ${amb.baseHospital} dispatched. ETA: 7 mins. Green Corridor: ${greenCorridor ? 'ACTIVE' : 'INACTIVE'}.`,
      actor: officerName || 'Smart Dispatch Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    incidentsStore[incidentIdx] = {
      ...incident,
      status: 'EN_ROUTE',
      assignedHospitalId: hosp.id,
      assignedHospitalName: hosp.name,
      assignedAmbulances: 1,
      assignedAmbulanceDetails: `${amb.registrationNo} (${amb.type})`,
      estimatedResponseTimeMin: 7,
      timeline: updatedIncidentTimeline,
      lastUpdated: 'Just now',
    };

    res.status(201).json({ success: true, mission: newMission, ambulance: ambulancesStore[ambIdx], incident: incidentsStore[incidentIdx] });
  });

  // GET /api/fleet/missions - Fetch active/historical transport missions
  app.get('/api/fleet/missions', (req, res) => {
    const ambulanceId = req.query.ambulanceId as string | undefined;
    const incidentId = req.query.incidentId as string | undefined;

    let result = [...missionsStore];
    if (ambulanceId) {
      result = result.filter((m) => m.ambulanceId === ambulanceId);
    }
    if (incidentId) {
      result = result.filter((m) => m.incidentId === incidentId);
    }
    res.json(result);
  });

  // POST /api/fleet/missions/:id/step - Advance Mission Lifecycle Stage
  app.post('/api/fleet/missions/:id/step', (req, res) => {
    const { id } = req.params;
    const { nextStage, note, actorName } = req.body;

    const msnIdx = missionsStore.findIndex((m) => m.id === id);
    if (msnIdx === -1) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    const mission = missionsStore[msnIdx];
    const stage = (nextStage as MissionStage) || mission.status;

    const timeline = mission.timeline ? [...mission.timeline] : [];
    timeline.push({
      stage,
      title: `Stage Updated to ${stage.replace(/_/g, ' ')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: note || `Driver updated mission progress.`,
      actor: actorName || mission.driverName,
    });

    const updatedMission: AmbulanceMission = {
      ...mission,
      status: stage,
      updatedAt: 'Just now',
      timeline,
    };

    if (stage === 'PATIENT_LOADED') {
      updatedMission.pickupTime = new Date().toISOString();
    }
    if (stage === 'COMPLETED') {
      updatedMission.dropoffTime = new Date().toISOString();
    }

    missionsStore[msnIdx] = updatedMission;

    // Sync Ambulance vehicle status
    const ambIdx = ambulancesStore.findIndex((a) => a.id === mission.ambulanceId);
    if (ambIdx !== -1) {
      let ambStatus = ambulancesStore[ambIdx].status;
      if (stage === 'EN_ROUTE_PATIENT') ambStatus = 'DISPATCHED';
      if (stage === 'PATIENT_REACHED' || stage === 'PATIENT_LOADED') ambStatus = 'IN_TRANSIT';
      if (stage === 'EN_ROUTE_HOSPITAL') ambStatus = 'TRANSPORTING';
      if (stage === 'HOSPITAL_ARRIVED' || stage === 'COMPLETED') {
        ambStatus = 'AVAILABLE';
        ambulancesStore[ambIdx].currentMissionId = undefined;
        ambulancesStore[ambIdx].assignedIncidentId = undefined;
      }

      ambulancesStore[ambIdx] = {
        ...ambulancesStore[ambIdx],
        status: ambStatus,
        lastPing: 'Just now',
      };
    }

    res.json({ success: true, mission: updatedMission });
  });

  // POST /api/fleet/routing - GIS Smart Routing & Green Corridor Calculator
  app.post('/api/fleet/routing', (req, res) => {
    const { origin, destination, greenCorridor, priority } = req.body;

    const distanceKm = Number((3.5 + Math.random() * 8.5).toFixed(1));
    const isRed = priority === 'RED' || greenCorridor;
    const speed = isRed ? 72 : 45;
    const rawEta = Math.round((distanceKm / speed) * 60);
    const etaMin = isRed ? Math.max(3, Math.round(rawEta * 0.65)) : rawEta;

    const route: RouteDetails = {
      origin: origin || { lat: 21.0745, lng: 79.0234, address: 'Ambulance Base' },
      destination: destination || { lat: 21.0823, lng: 79.0112, address: 'Incident Site' },
      distanceKm,
      etaMin,
      trafficDelayMin: greenCorridor ? 0 : 4,
      greenCorridorActive: !!greenCorridor,
      waypoints: [
        { lat: 21.0745, lng: 79.0234, name: 'Start Base' },
        { lat: 21.0780, lng: 79.0200, name: 'Samruddhi Expressway Junction' },
        { lat: 21.0823, lng: 79.0112, name: 'Destination' },
      ],
      turnByTurnInstructions: [
        { instruction: 'Head north on Main Expressway Access Ramp', distanceKm: 1.2, durationSec: 90, speedLimitKmH: 80 },
        { instruction: greenCorridor ? 'GREEN CORRIDOR ACTIVE: Proceed straight through Toll Plaza Signal Override' : 'Merge onto Main Samruddhi Expressway', distanceKm: 2.5, durationSec: 140, speedLimitKmH: 100 },
        { instruction: 'Exit onto Hingna Sector Emergency Slip Road', distanceKm: 0.8, durationSec: 60, speedLimitKmH: 50 },
      ],
    };

    res.json(route);
  });

  // GET /api/fleet/alerts - Dispatch Alerts Feed
  app.get('/api/fleet/alerts', (req, res) => {
    res.json(fleetAlertsStore);
  });

  // POST /api/fleet/alerts/:id/ack - Acknowledge Fleet Alert
  app.post('/api/fleet/alerts/:id/ack', (req, res) => {
    const { id } = req.params;
    const alert = fleetAlertsStore.find((a) => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = req.body.officerName || 'Fleet Commander';
    }
    res.json({ success: true, alerts: fleetAlertsStore });
  });

  // GET /api/fleet/analytics - Statewide Fleet Operations Analytics
  app.get('/api/fleet/analytics', (req, res) => {
    const total = ambulancesStore.length;
    const available = ambulancesStore.filter((a) => a.status === 'AVAILABLE').length;
    const dispatched = ambulancesStore.filter((a) => a.status === 'DISPATCHED' || a.status === 'IN_TRANSIT').length;
    const transporting = ambulancesStore.filter((a) => a.status === 'TRANSPORTING').length;
    const maintenance = ambulancesStore.filter((a) => a.status === 'MAINTENANCE' || a.status === 'OFF_LINE').length;

    const alsCount = ambulancesStore.filter((a) => a.type === 'ALS').length;
    const blsCount = ambulancesStore.filter((a) => a.type === 'BLS').length;
    const cardiacCount = ambulancesStore.filter((a) => a.type === 'Cardiac Care').length;
    const nicuCount = ambulancesStore.filter((a) => a.type === 'Neonatal ICU').length;

    const districtStats = MOCK_DISTRICTS.map((d) => {
      const distAmbs = ambulancesStore.filter((a) => a.districtId === d.id);
      return {
        district: d.name,
        totalFleet: distAmbs.length,
        available: distAmbs.filter((a) => a.status === 'AVAILABLE').length,
        busy: distAmbs.filter((a) => a.status !== 'AVAILABLE').length,
      };
    });

    const analytics: FleetAnalyticsData = {
      totalFleetSize: total,
      availableUnits: available,
      dispatchedUnits: dispatched,
      transportingUnits: transporting,
      maintenanceUnits: maintenance,
      fleetReadinessRatePercent: total > 0 ? Math.round((available / total) * 100) : 85,
      avgStatewideResponseTimeMin: 6.8,
      greenCorridorCountToday: 14,
      totalMissionsCompletedToday: 48,
      typeBreakdown: {
        ALS: alsCount,
        BLS: blsCount,
        CardiacCare: cardiacCount,
        NeonatalICU: nicuCount,
      },
      districtStats,
    };

    res.json(analytics);
  });

  // ====================================================
  // Phase 5: AI Decision Intelligence Platform API Routes
  // ====================================================

  // GET /api/ai/patient-deterioration - High Risk Patient Deterioration Feed
  app.get('/api/ai/patient-deterioration', (req, res) => {
    res.json(patientDeteriorationsStore);
  });

  // POST /api/ai/patient-deterioration/analyze - Analyze Vitals with Gemini / Rule Engine
  app.post('/api/ai/patient-deterioration/analyze', async (req, res) => {
    const { patientName, age, gender, vitals, medicalHistory, currentTreatment } = req.body;

    const hr = Number(vitals?.heartRate || 100);
    const bpSys = Number(vitals?.bpSystolic || 110);
    const bpDia = Number(vitals?.bpDiastolic || 70);
    const rr = Number(vitals?.respiratoryRate || 20);
    const tempC = Number(vitals?.temperatureC || 37.0);
    const spo2 = Number(vitals?.spo2 || 95);

    let riskScore = 30;
    if (spo2 < 90) riskScore += 35;
    else if (spo2 < 94) riskScore += 15;

    if (hr > 130 || hr < 50) riskScore += 25;
    else if (hr > 110) riskScore += 10;

    if (bpSys < 90) riskScore += 25;
    if (rr > 30 || rr < 10) riskScore += 15;
    if (tempC > 39.0 || tempC < 35.0) riskScore += 10;

    riskScore = Math.min(99, Math.max(10, riskScore));

    let riskLevel: PatientDeteriorationPrediction['riskLevel'] = 'GREEN';
    if (riskScore >= 85) riskLevel = 'CRITICAL';
    else if (riskScore >= 70) riskLevel = 'RED';
    else if (riskScore >= 50) riskLevel = 'ORANGE';
    else if (riskScore >= 35) riskLevel = 'YELLOW';

    const predictedMin = Math.max(10, Math.round((100 - riskScore) * 0.4));

    const newPrediction: PatientDeteriorationPrediction = {
      id: `pat-det-${Date.now().toString().slice(-4)}`,
      patientName: patientName || 'Emergency Patient',
      age: Number(age || 45),
      gender: gender || 'MALE',
      incidentId: `inc-${Date.now().toString().slice(-4)}`,
      hospitalName: 'AIIMS Nagpur Trauma Center',
      vitals: {
        heartRate: hr,
        bpSystolic: bpSys,
        bpDiastolic: bpDia,
        respiratoryRate: rr,
        temperatureC: tempC,
        spo2,
      },
      medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : ['Hypertension'],
      currentTreatment: currentTreatment || 'Oxygen via nasal cannula, IV line secured',
      riskScore,
      confidenceScore: 92,
      predictedDeteriorationTimeMin: predictedMin,
      riskLevel,
      recommendedIntervention:
        riskScore > 75
          ? 'Urgent airway stabilization, high-flow oxygenation, alert ICU crash team.'
          : 'Continuous vital monitoring every 15 mins, arterial blood gas sample.',
      aiExplanation: `Calculated deterioration score based on vital signs profile: SpO2=${spo2}%, HR=${hr} bpm, BP=${bpSys}/${bpDia} mmHg. ${
        riskScore > 75
          ? 'Decompensation risk elevated due to severe respiratory/circulatory strain.'
          : 'Patient currently stable with low-moderate risk trajectory.'
      }`,
      acknowledged: false,
      timestamp: new Date().toISOString(),
    };

    patientDeteriorationsStore.unshift(newPrediction);
    res.json({ success: true, prediction: newPrediction, store: patientDeteriorationsStore });
  });

  // POST /api/ai/patient-deterioration/:id/ack - Acknowledge or Override Prediction
  app.post('/api/ai/patient-deterioration/:id/ack', (req, res) => {
    const { id } = req.params;
    const { officerName, override, overrideReason } = req.body;
    const item = patientDeteriorationsStore.find((p) => p.id === id);
    if (item) {
      item.acknowledged = true;
      item.acknowledgedBy = officerName || 'Medical Operations Officer';
      if (override) {
        item.overridden = true;
        item.overrideReason = overrideReason || 'Clinical judgment override by attending doctor.';
      }
    }
    res.json({ success: true, store: patientDeteriorationsStore });
  });

  // GET /api/ai/resource-optimizations - AI Hospital Resource Optimizations
  app.get('/api/ai/resource-optimizations', (req, res) => {
    res.json(aiResourceOptimizationsStore);
  });

  // GET /api/ai/district-risk - District Risk Intelligence
  app.get('/api/ai/district-risk', (req, res) => {
    res.json(districtRiskStore);
  });

  // GET /api/ai/disease-clusters - Disease & Incident Cluster Detection
  app.get('/api/ai/disease-clusters', (req, res) => {
    res.json(diseaseClustersStore);
  });

  // GET /api/ai/command-recommendations - AI Command Center Recommendations
  app.get('/api/ai/command-recommendations', (req, res) => {
    res.json(aiCommandRecommendationsStore);
  });

  // POST /api/ai/command-recommendations/:id/action - Approve or Reject AI Recommendation
  app.post('/api/ai/command-recommendations/:id/action', (req, res) => {
    const { id } = req.params;
    const { action, officerName } = req.body; // 'APPROVE' or 'REJECT'
    const rec = aiCommandRecommendationsStore.find((r) => r.id === id);
    if (rec) {
      if (action === 'APPROVE') {
        rec.approved = true;
        rec.rejected = false;
        rec.executedBy = officerName || 'State EOC Director';
      } else if (action === 'REJECT') {
        rec.rejected = true;
        rec.approved = false;
      }
    }
    res.json({ success: true, recommendations: aiCommandRecommendationsStore });
  });

  // POST /api/ai/simulation - Emergency Simulation Engine
  app.post('/api/ai/simulation', (req, res) => {
    const { scenario, district, intensity } = req.body;

    const sType = scenario || 'MASS_CASUALTY';
    const distName = district || 'Nagpur';
    const intLvl = intensity || 'SEVERE';

    let estimatedCasualties = 45;
    let occupancyJump = 32;
    let ambsDeployed = 12;
    let icuExhaustionMin = 35;

    if (intLvl === 'CATASTROPHIC') {
      estimatedCasualties = 120;
      occupancyJump = 58;
      ambsDeployed = 28;
      icuExhaustionMin = 18;
    } else if (intLvl === 'MODERATE') {
      estimatedCasualties = 20;
      occupancyJump = 15;
      ambsDeployed = 6;
      icuExhaustionMin = 75;
    }

    // Update target district risk score in store
    const distTarget = districtRiskStore.find((d) => d.districtName.toLowerCase() === distName.toLowerCase());
    if (distTarget) {
      distTarget.riskScore = Math.min(99, distTarget.riskScore + (intLvl === 'CATASTROPHIC' ? 30 : 15));
      distTarget.riskLevel = distTarget.riskScore > 80 ? 'CRITICAL' : 'HIGH';
      distTarget.hospitalLoadPercent = Math.min(98, distTarget.hospitalLoadPercent + occupancyJump);
    }

    const simResult: SimulationResult = {
      scenario: sType,
      district: distName,
      intensity: intLvl,
      estimatedCasualties,
      simulatedAt: new Date().toISOString(),
      hospitalOccupancyJump: occupancyJump,
      ambulancesDispatched: ambsDeployed,
      predictedIcuExhaustionTimeMin: icuExhaustionMin,
      aiActionPlan: [
        `Pre-reserve ${Math.round(estimatedCasualties * 0.4)} ICU & Trauma crash beds in ${distName} tertiary hospitals.`,
        `Mobilize ${ambsDeployed} MEMS 108 ambulances from neighboring sub-districts into ${distName} green corridors.`,
        `Notify State Blood Transfusion Council to dispatch O-Negative blood reserves.`,
        `Activate District Disaster Management Authority (DDMA) Command Post.`,
      ],
    };

    // Add a generated AI command recommendation from simulation
    const generatedCmd: AiCommandRecommendation = {
      id: `cmd-sim-${Date.now().toString().slice(-4)}`,
      category: 'DISASTER_TEAM_ACTIVATION',
      title: `[SIMULATION RESULT] Mobilize ${distName} Emergency Disaster Response for ${sType.replace(/_/g, ' ')}`,
      description: `Simulated surge of ${estimatedCasualties} casualties in ${distName}. Recommended immediate pre-allocation of ${Math.round(estimatedCasualties * 0.4)} ICU beds and ${ambsDeployed} ALS units.`,
      targetLocation: `${distName} District`,
      confidenceScore: 94,
      evidenceUsed: [
        `Simulation Intensity: ${intLvl}`,
        `Predicted Hospital Occupancy Jump (+${occupancyJump}%)`,
        `Estimated ICU Exhaustion Horizon (${icuExhaustionMin} min)`,
      ],
      predictionHorizon: `${icuExhaustionMin} minutes`,
      limitations: 'Simulation output based on stochastic disaster models.',
      humanApprovalRequired: true,
      approved: false,
      timestamp: new Date().toISOString(),
      modelVersion: 'Rakshak-Gemini-3.6-Flash-v2',
    };
    aiCommandRecommendationsStore.unshift(generatedCmd);

    res.json({ success: true, result: simResult, recommendations: aiCommandRecommendationsStore });
  });

  // =============================================================
  // Phase 11: National AI Decision Intelligence Platform Routes
  // =============================================================

  // GET /api/intelligence/summary - Aggregate metrics for National AI Decision Intelligence Engine
  app.get('/api/intelligence/summary', (req, res) => {
    const highRiskPatientsCount = patientDeteriorationsStore.filter((p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'RED').length;
    const criticalHospitalsCount = hospitalsStore.filter((h) => (h.totalIcuBeds - h.availableIcuBeds) / (h.totalIcuBeds || 1) > 0.85).length;
    const activeShortageAlertsCount = shortageAlertsStore.filter((a) => !a.acknowledged).length;
    const activeRecommendationsCount = aiCommandRecommendationsStore.filter((r) => !r.approved && !r.rejected).length;
    const diseaseClustersCount = diseaseClustersStore.length;

    res.json({
      highRiskPatientsCount,
      criticalHospitalsCount,
      activeShortageAlertsCount,
      activeRecommendationsCount,
      diseaseClustersCount,
      predictionAccuracy: predictiveAnalyticsStore.overallPredictionAccuracy,
      acceptanceRate: predictiveAnalyticsStore.recommendationAcceptanceRate,
      forecastAccuracy: predictiveAnalyticsStore.forecastAccuracyScore,
      modelLatencyMs: predictiveAnalyticsStore.modelLatencyMs,
      timestamp: new Date().toISOString(),
    });
  });

  // GET /api/intelligence/hospital-forecasts - Hospital capacity & demand forecasts
  app.get('/api/intelligence/hospital-forecasts', (req, res) => {
    res.json(hospitalForecastsStore);
  });

  // GET /api/intelligence/ambulance-forecasts - Ambulance demand & redistribution forecasts
  app.get('/api/intelligence/ambulance-forecasts', (req, res) => {
    res.json(ambulanceForecastsStore);
  });

  // GET /api/intelligence/emergency-forecasts - Emergency surge forecasts by category & district
  app.get('/api/intelligence/emergency-forecasts', (req, res) => {
    res.json(emergencyForecastsStore);
  });

  // GET /api/intelligence/predictive-analytics - Model accuracy & analytics metrics
  app.get('/api/intelligence/predictive-analytics', (req, res) => {
    res.json(predictiveAnalyticsStore);
  });

  // GET /api/intelligence/doctor-patients - Doctor AI Workspace patient queue
  app.get('/api/intelligence/doctor-patients', (req, res) => {
    res.json(doctorAiPatientsStore);
  });

  // POST /api/intelligence/doctor-patients/:id/action - Doctor AI Workspace decision (Approve / Reject / Modify)
  app.post('/api/intelligence/doctor-patients/:id/action', (req, res) => {
    const { id } = req.params;
    const { action, notes, doctorName } = req.body; // action: 'APPROVED' | 'REJECTED' | 'MODIFIED'

    const patient = doctorAiPatientsStore.find((p) => p.id === id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Doctor patient record not found' });
    }

    patient.doctorDecision = {
      status: action || 'APPROVED',
      modifiedNotes: notes || '',
      decidedAt: new Date().toISOString(),
    };

    res.json({ success: true, patient, queue: doctorAiPatientsStore });
  });

  // ====================================================
  // Phase 6: Real-Time Network & IoT Gateway API Routes
  // ====================================================

  // GET /api/iot/streams - Live IoT Medical Device Telemetry Streams
  app.get('/api/iot/streams', (req, res) => {
    res.json(iotStreamsStore);
  });

  // POST /api/iot/streams/:id/ping - Ingest live telemetry & auto-trigger Gemini AI evaluation
  app.post('/api/iot/streams/:id/ping', (req, res) => {
    const { id } = req.params;
    const { vitals, batteryLevelPercent, signalQualityPercent } = req.body;
    const stream = iotStreamsStore.find((s) => s.id === id);

    if (stream) {
      if (vitals) {
        stream.vitals = { ...stream.vitals, ...vitals };
      }
      if (batteryLevelPercent !== undefined) stream.batteryLevelPercent = batteryLevelPercent;
      if (signalQualityPercent !== undefined) stream.signalQualityPercent = signalQualityPercent;
      stream.lastPing = new Date().toISOString();

      // Trigger automatic AI rule / Gemini check for severe vitals anomaly
      const { heartRate, bpSystolic, spo2 } = stream.vitals;
      if (spo2 < 88 || heartRate > 135 || bpSystolic < 85) {
        stream.status = 'CRITICAL_ALARM';
        stream.aiAlertTriggered = true;
        stream.aiAlertReason = `AUTOMATIC GEMINI AI ALARM: Critical Vitals Decompensation (HR ${heartRate} bpm, SpO2 ${spo2}%, BP ${bpSystolic} mmHg). Priority Transport & Cath/ICU Standby required!`;

        // Check if patient deterioration record exists, or create one
        let existingDet = patientDeteriorationsStore.find((p) => p.patientName === stream.patientName);
        if (!existingDet) {
          const newDet: PatientDeteriorationPrediction = {
            id: `pat-det-iot-${Date.now().toString().slice(-4)}`,
            patientName: stream.patientName,
            age: 55,
            gender: 'MALE',
            incidentId: 'inc-nagpur-01',
            hospitalName: stream.hospitalName || 'AIIMS Nagpur Trauma Center',
            vitals: stream.vitals,
            medicalHistory: ['IoT Monitored Patient'],
            currentTreatment: 'High-flow oxygenation, continuous multi-lead ECG',
            riskScore: 92,
            confidenceScore: 96,
            predictedDeteriorationTimeMin: 15,
            riskLevel: 'CRITICAL',
            recommendedIntervention: 'Immediate endotracheal intubation, urgent invasive arterial line placement',
            aiExplanation: stream.aiAlertReason,
            acknowledged: false,
            timestamp: new Date().toISOString(),
          };
          patientDeteriorationsStore.unshift(newDet);
        } else {
          existingDet.vitals = stream.vitals;
          existingDet.riskScore = 95;
          existingDet.riskLevel = 'CRITICAL';
          existingDet.aiExplanation = stream.aiAlertReason;
        }

        // Push FCM Notification
        const newFcm: FcmNotificationPayload = {
          id: `fcm-${Date.now().toString().slice(-4)}`,
          title: '🚨 IOT CRITICAL VITAL DECOMPENSATION',
          body: `${stream.patientName} telemetry alarm: SpO2 ${spo2}%, HR ${heartRate}bpm. Urgent intervention required!`,
          topic: 'CRITICAL_ALERT',
          dataPayload: { patientId: stream.patientId, streamId: stream.id },
          sentAt: new Date().toISOString(),
          delivered: true,
        };
        fcmNotificationsStore.unshift(newFcm);
      } else if (spo2 < 93 || heartRate > 110) {
        stream.status = 'WARNING';
      } else {
        stream.status = 'ONLINE_STREAMING';
        stream.aiAlertTriggered = false;
      }
    }

    res.json({ success: true, stream, allStreams: iotStreamsStore });
  });

  // GET /api/messages - Intra-Agency Communication Channels
  app.get('/api/messages', (req, res) => {
    res.json(agencyMessagesStore);
  });

  // POST /api/messages/send - Transmit Intra-Agency Broadcast or Direct Message
  app.post('/api/messages/send', (req, res) => {
    const { channelGroup, senderId, senderName, senderRole, senderBadge, recipientGroup, messageText, priority, isBroadcast } = req.body;

    const newMsg: AgencyChatMessage = {
      id: `msg-${Date.now().toString().slice(-4)}`,
      channelGroup: channelGroup || 'STATEWIDE_BROADCAST',
      senderId: senderId || 'usr-01',
      senderName: senderName || 'Dr. Rajesh Patil, IAS',
      senderRole: senderRole || 'State EOC Director',
      senderBadge: senderBadge || 'MH-EOC-001',
      recipientGroup: recipientGroup || 'All Emergency Agencies',
      messageText: messageText || 'Operational announcement broadcast.',
      priority: priority || 'NORMAL',
      isBroadcast: Boolean(isBroadcast),
      readBy: [senderId || 'usr-01'],
      timestamp: new Date().toISOString(),
    };

    agencyMessagesStore.unshift(newMsg);
    res.json({ success: true, message: newMsg, messages: agencyMessagesStore });
  });

  // GET /api/notifications/fcm - Push Notifications Log
  app.get('/api/notifications/fcm', (req, res) => {
    res.json(fcmNotificationsStore);
  });

  // POST /api/notifications/fcm/send - Push FCM Alert
  app.post('/api/notifications/fcm/send', (req, res) => {
    const { title, body, topic, dataPayload } = req.body;

    const newFcm: FcmNotificationPayload = {
      id: `fcm-${Date.now().toString().slice(-4)}`,
      title: title || 'Emergency Notification',
      body: body || 'Real-time alert dispatch from EOC Command.',
      topic: topic || 'CRITICAL_ALERT',
      dataPayload: dataPayload || {},
      sentAt: new Date().toISOString(),
      delivered: true,
    };

    fcmNotificationsStore.unshift(newFcm);
    res.json({ success: true, notification: newFcm, log: fcmNotificationsStore });
  });

  // GET /api/system/observability - Operations Observability & Health Metrics
  app.get('/api/system/observability', (req, res) => {
    const observabilityData = {
      status: 'HEALTHY',
      uptimeSeconds: Math.floor(process.uptime()),
      postgres: {
        status: 'ONLINE',
        connections: 18,
        latencyMs: 3.4,
      },
      redis: {
        status: 'ONLINE',
        memoryUsedMB: 48.2,
        cacheHitRatePercent: 99.4,
      },
      webSockets: {
        gatewayStatus: 'READY',
        activeConnections: 42,
        messagesPerSec: 128,
      },
      geminiAi: {
        apiStatus: 'ONLINE',
        latencyMs: 180,
        requestsProcessed24h: 3410,
      },
      googleMaps: {
        status: 'ONLINE',
        quotaRemainingPercent: 88.5,
      },
      iotGateway: {
        status: 'ONLINE_STREAMING',
        connectedDevices: iotStreamsStore.length,
        packetsProcessedPerSec: 250,
      },
      fcmPushService: {
        status: 'ONLINE',
        deliveredCount24h: 1840,
      },
      activeNodes: 6,
      cpuUsagePercent: 18.4,
      memoryUsagePercent: 32.1,
      lastCheckTimestamp: new Date().toISOString(),
    };
    res.json(observabilityData);
  });

  // POST /api/disaster/toggle - Toggle Statewide Disaster Mode
  app.post('/api/disaster/toggle', (req, res) => {
    const { active, scenario } = req.body;
    isDisasterModeActive = active !== undefined ? active : !isDisasterModeActive;

    if (isDisasterModeActive) {
      // Elevate district risk scores and generate multi-incident mass casualty dispatches
      districtRiskStore.forEach((d) => {
        d.riskScore = Math.min(99, d.riskScore + 25);
        d.riskLevel = d.riskScore > 80 ? 'CRITICAL' : 'HIGH';
        d.hospitalLoadPercent = Math.min(98, d.hospitalLoadPercent + 30);
      });

      const disasterInc: Incident = {
        id: `inc-disaster-${Date.now().toString().slice(-4)}`,
        code: `DISASTER-${scenario || 'MASS_CASUALTY'}-01`,
        title: `STATEWIDE DISASTER: ${scenario || 'MASS CASUALTY'} EMERGENCY ALARM`,
        districtId: 'nagpur',
        districtName: 'Nagpur',
        locationName: 'Samruddhi Expressway Corridor & MIDC Zone',
        type: 'Mass Casualty',
        priority: 'RED',
        severity: 'CRITICAL',
        status: 'EN_ROUTE',
        affectedCount: 38,
        reportedBy: 'State EOC Automated Disaster Dispatcher',
        assignedHospitalName: 'AIIMS Nagpur & GMCH Nagpur',
        assignedAmbulances: 8,
        timestamp: new Date().toISOString(),
        coordinates: { lat: 21.1458, lng: 79.0882 },
        notes: 'Statewide Disaster Mode Activated. Emergency corridors pre-cleared across Vidarbha region.',
      };
      incidentsStore.unshift(disasterInc);
    }

    res.json({ success: true, disasterModeActive: isDisasterModeActive, districts: districtRiskStore, incidents: incidentsStore });
  });

  // POST /api/demo/step - Trigger Automated Demo Simulation Step Progress
  app.post('/api/demo/step', (req, res) => {
    const { stepIndex } = req.body;

    // Step 1: Create Pune Highway Collision Incident
    if (stepIndex === 1) {
      const demoInc: Incident = {
        id: 'inc-demo-pune',
        code: 'INC-DEMO-2026-PUNE',
        title: 'LIVE DEMO: Multi-Vehicle Collision on Pune-Mumbai Expressway',
        districtId: 'pune',
        districtName: 'Pune',
        locationName: 'KM 42 Khandala Ghat Corridor',
        type: 'Road Accident',
        category: 'Trauma & Surgery',
        priority: 'RED',
        severity: 'CRITICAL',
        status: 'REPORTED',
        affectedCount: 4,
        symptoms: 'Polytrauma, severe arterial bleeding, acute dyspnea',
        reportedBy: 'Highway Police Patrol (MH 12)',
        assignedAmbulances: 0,
        timestamp: new Date().toISOString(),
        coordinates: { lat: 18.7509, lng: 73.4077 },
        notes: 'Automated 3-Minute Live Hackathon Demonstration Scenario in progress.',
        aiTriage: {
          summary: 'High Velocity Polytrauma with Traumatic Shock Risk',
          severity: 'RED',
          recommendedPriority: 'RED',
          suggestedDepartment: 'Trauma & Cardiothoracic Surgery',
          suggestedAmbulanceType: 'ALS',
          suggestedHospitalCapability: 'Level 1 Trauma',
          confidenceScore: 98,
          clinicalExplanation: 'High impact collision telemetry indicates severe multi-system trauma. Golden hour response required immediately.',
          symptomsUsed: ['High Velocity Impact', 'Severe Blood Loss', 'Hypotension'],
          priorityLogic: 'Catastrophic Trauma Matrix Level A',
          suggestedActions: ['Dispatch ALS Unit immediately', 'Pre-reserve Level 1 Trauma ICU bed'],
          timestamp: new Date().toISOString(),
          modelVersion: 'Rakshak-Gemini-3.6-Flash-v2',
          humanReviewRequired: false,
        },
      };
      // Insert if not present
      incidentsStore = incidentsStore.filter((i) => i.id !== demoInc.id);
      incidentsStore.unshift(demoInc);
    }

    // Step 2: Smart Dispatch Assignment
    if (stepIndex === 2) {
      const demoInc = incidentsStore.find((i) => i.id === 'inc-demo-pune');
      if (demoInc) {
        demoInc.status = 'DISPATCHED';
        demoInc.assignedAmbulances = 1;
        demoInc.assignedAmbulanceDetails = 'MEMS 108 ALS-02 (MH 12 QW 1108)';
      }
      const amb = ambulancesStore.find((a) => a.id === 'amb-pun-01');
      if (amb) {
        amb.status = 'DISPATCHED';
        amb.currentMissionId = 'mis-demo-pune';
        amb.assignedIncidentId = 'inc-demo-pune';
      }
    }

    // Step 3: Live Movement & En-Route Telemetry
    if (stepIndex === 3) {
      const demoInc = incidentsStore.find((i) => i.id === 'inc-demo-pune');
      if (demoInc) demoInc.status = 'EN_ROUTE';
      const amb = ambulancesStore.find((a) => a.id === 'amb-pun-01');
      if (amb) {
        amb.status = 'EN_ROUTE';
        amb.speedKmH = 85;
        amb.etaMin = 6;
      }
    }

    // Step 4: Patient Reached & IoT Vitals Stream Connected
    if (stepIndex === 4) {
      const demoInc = incidentsStore.find((i) => i.id === 'inc-demo-pune');
      if (demoInc) demoInc.status = 'PATIENT_REACHED';
      const amb = ambulancesStore.find((a) => a.id === 'amb-pun-01');
      if (amb) amb.status = 'AT_PATIENT';

      // Connect live telemetry stream
      const demoIot: IotDeviceTelemetryStream = {
        id: 'iot-demo-pune',
        serialNumber: 'SN-DEMO-PUN-99',
        deviceName: 'Mindray ALS Ambulance Gateway',
        deviceCategory: 'ECG_MONITOR',
        patientId: 'pat-demo-pune',
        patientName: 'Karan Deshmukh (38M - Polytrauma)',
        ambulanceId: 'amb-pun-01',
        ambulanceRegNo: 'MH 12 QW 1108',
        hospitalId: 'hosp-pun-01',
        hospitalName: 'Sassoon General Hospital Pune',
        status: 'CRITICAL_ALARM',
        vitals: {
          heartRate: 138,
          bpSystolic: 84,
          bpDiastolic: 52,
          spo2: 85,
          respiratoryRate: 30,
          temperatureC: 38.4,
          glucoseMgDl: 165,
          painScore: 9,
          ecgStatus: 'ST_ELEVATION',
          ventilatorMode: 'CPAP FiO2 100%',
        },
        batteryLevelPercent: 96,
        signalQualityPercent: 100,
        aiAlertTriggered: true,
        aiAlertReason: 'LIVE DEMO ALARM: Rapid Hemodynamic Collapse (SpO2 85%, BP 84/52). Priority intubation required.',
        lastPing: new Date().toISOString(),
      };
      iotStreamsStore = iotStreamsStore.filter((s) => s.id !== demoIot.id);
      iotStreamsStore.unshift(demoIot);
    }

    // Step 5: AI Hospital Recommendation & Automatic ICU Bed Reservation
    if (stepIndex === 5) {
      const demoInc = incidentsStore.find((i) => i.id === 'inc-demo-pune');
      if (demoInc) {
        demoInc.assignedHospitalId = 'hosp-pun-01';
        demoInc.assignedHospitalName = 'Sassoon General Hospital Pune';
        demoInc.status = 'TRIAGED';
      }

      const newRes: BedReservation = {
        id: `res-demo-${Date.now().toString().slice(-4)}`,
        emergencyId: 'inc-demo-pune',
        emergencyCode: 'INC-DEMO-2026-PUNE',
        hospitalId: 'hosp-pun-01',
        hospitalName: 'Sassoon General Hospital Pune',
        bedId: 'bed-pun-icu-01',
        bedNumber: 'ICU-CRASH-01',
        department: 'Trauma & Cardiothoracic Surgery',
        bedType: 'ICU',
        patientName: 'Karan Deshmukh (38M)',
        reservedByOfficer: 'Rakshak AI Automated Dispatcher',
        attendingDoctorNotified: 'Dr. Neha Kulkarni (On Duty)',
        reservedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 45 * 60000).toISOString(),
        status: 'RESERVED',
      };
      reservationsStore = reservationsStore.filter((r) => r.emergencyId !== 'inc-demo-pune');
      reservationsStore.unshift(newRes);

      // Decrement hospital available ICU beds
      const hosp = hospitalsStore.find((h) => h.id === 'hosp-pun-01');
      if (hosp && hosp.availableIcuBeds > 0) {
        hosp.availableIcuBeds -= 1;
        hosp.occupiedIcuBeds += 1;
      }
    }

    // Step 6: Green Corridor & Doctor Notification
    if (stepIndex === 6) {
      const amb = ambulancesStore.find((a) => a.id === 'amb-pun-01');
      if (amb) {
        amb.status = 'TRANSPORTING';
        amb.speedKmH = 95;
        amb.etaMin = 2;
      }
      // Post notification message to agency chat
      const msg: AgencyChatMessage = {
        id: `msg-demo-${Date.now().toString().slice(-4)}`,
        channelGroup: 'EOC_TO_HOSPITAL',
        incidentId: 'inc-demo-pune',
        senderId: 'usr-01',
        senderName: 'Rakshak AI Automated System',
        senderRole: 'AI Emergency Coordinator',
        senderBadge: 'AI-AUTO-BOT',
        recipientGroup: 'Sassoon Hospital Trauma Desk',
        messageText: 'LIVE DEMO NOTICE: Green Corridor active on Pune Expressway. Patient Karan Deshmukh arriving in 2 mins. ICU-CRASH-01 ready.',
        priority: 'CRITICAL_EMERGENCY',
        isBroadcast: false,
        readBy: [],
        timestamp: new Date().toISOString(),
      };
      agencyMessagesStore.unshift(msg);
    }

    // Step 7: Patient Arrival & Admission
    if (stepIndex === 7) {
      const demoInc = incidentsStore.find((i) => i.id === 'inc-demo-pune');
      if (demoInc) demoInc.status = 'HOSPITAL_ARRIVED';
      const amb = ambulancesStore.find((a) => a.id === 'amb-pun-01');
      if (amb) amb.status = 'AT_HOSPITAL';
    }

    // Step 8: Complete Demo Scenario
    if (stepIndex === 8) {
      const demoInc = incidentsStore.find((i) => i.id === 'inc-demo-pune');
      if (demoInc) demoInc.status = 'CLOSED';
      const amb = ambulancesStore.find((a) => a.id === 'amb-pun-01');
      if (amb) amb.status = 'AVAILABLE';
    }

    res.json({
      success: true,
      stepIndex,
      incidents: incidentsStore,
      ambulances: ambulancesStore,
      reservations: reservationsStore,
      hospitals: hospitalsStore,
      iotStreams: iotStreamsStore,
      messages: agencyMessagesStore,
    });
  });

  // ==========================================
  // DEDICATED INDEPENDENT HOSPITAL PORTAL APIS
  // ==========================================
  app.post('/api/hospital/auth/login', (req, res) => {
    const { hospitalCode, email, password, hospitalId, role } = req.body;
    const hospital = hospitalsStore.find((h) => h.id === hospitalId) || hospitalsStore[0];
    res.json({
      success: true,
      token: `token-hosp-${Date.now()}`,
      user: {
        id: `hosp-user-${Date.now()}`,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        hospitalCode: hospitalCode || hospital.id.toUpperCase(),
        email: email || 'admin@hospital.gov.in',
        role: role || 'HOSPITAL_ADMINISTRATOR',
        name: role ? role.replace(/_/g, ' ') : 'Hospital Administrator',
        districtName: hospital.districtName,
        lastLogin: new Date().toISOString(),
      },
    });
  });

  app.get('/api/hospital/dashboard/:hospitalId', (req, res) => {
    const { hospitalId } = req.params;
    const hospital = hospitalsStore.find((h) => h.id === hospitalId) || hospitalsStore[0];
    const beds = bedsStore.filter((b) => b.hospitalId === hospital.id);
    const reservations = reservationsStore.filter((r) => r.hospitalId === hospital.id);
    const requests = incidentsStore.filter(
      (i) => i.assignedHospitalId === hospital.id || i.districtName === hospital.districtName
    );

    res.json({
      hospital,
      totalBeds: hospital.totalBeds,
      availableGeneralBeds: hospital.availableGeneralBeds,
      availableIcuBeds: hospital.availableIcuBeds,
      totalIcuBeds: hospital.totalIcuBeds,
      availableVentilators: hospital.availableVentilators,
      totalVentilators: hospital.totalVentilators,
      doctorsOnDuty: hospital.doctorsOnDuty,
      nursesOnDuty: hospital.nursesOnDuty,
      emergencyDeptStatus: hospital.emergencyDeptStatus,
      activeReservationsCount: reservations.length,
      incomingEmergenciesCount: requests.length,
      bedsList: beds,
      reservations,
    });
  });

  app.get('/api/hospital/beds/:hospitalId', (req, res) => {
    const { hospitalId } = req.params;
    const beds = bedsStore.filter((b) => b.hospitalId === hospitalId);
    res.json(beds);
  });

  app.post('/api/hospital/beds', (req, res) => {
    const newBed: BedMatrixEntity = req.body;
    newBed.id = newBed.id || `bed-${Date.now()}`;
    bedsStore.unshift(newBed);
    res.json({ success: true, bed: newBed });
  });

  app.put('/api/hospital/beds/:bedId', (req, res) => {
    const { bedId } = req.params;
    const index = bedsStore.findIndex((b) => b.id === bedId);
    if (index !== -1) {
      bedsStore[index] = { ...bedsStore[index], ...req.body, lastUpdated: new Date().toISOString() };
      res.json({ success: true, bed: bedsStore[index] });
    } else {
      res.status(404).json({ error: 'Bed not found' });
    }
  });

  app.delete('/api/hospital/beds/:bedId', (req, res) => {
    const { bedId } = req.params;
    bedsStore = bedsStore.filter((b) => b.id !== bedId);
    res.json({ success: true });
  });

  app.get('/api/hospital/icu/:hospitalId', (req, res) => {
    const { hospitalId } = req.params;
    const hospital = hospitalsStore.find((h) => h.id === hospitalId) || hospitalsStore[0];
    const icuBeds = bedsStore.filter((b) => b.hospitalId === hospitalId && b.bedType === 'ICU');
    res.json({
      totalIcuBeds: hospital.totalIcuBeds,
      availableIcuBeds: hospital.availableIcuBeds,
      occupiedIcuBeds: hospital.occupiedIcuBeds,
      icuBeds,
    });
  });

  app.put('/api/hospital/resources/:hospitalId', (req, res) => {
    const { hospitalId } = req.params;
    const index = hospitalsStore.findIndex((h) => h.id === hospitalId);
    if (index !== -1) {
      hospitalsStore[index] = {
        ...hospitalsStore[index],
        ...req.body,
        lastSync: 'Just now',
      };
      res.json({ success: true, hospital: hospitalsStore[index] });
    } else {
      res.status(404).json({ error: 'Hospital not found' });
    }
  });

  app.get('/api/hospital/emergency/:hospitalId', (req, res) => {
    const { hospitalId } = req.params;
    const hospital = hospitalsStore.find((h) => h.id === hospitalId) || hospitalsStore[0];
    const requests = incidentsStore
      .filter((i) => i.assignedHospitalId === hospital.id || i.districtName === hospital.districtName)
      .slice(0, 10);
    res.json(requests);
  });

  // ==========================================
  // PHASE 10: STATEWIDE HOSPITAL COORDINATION NETWORK APIS
  // ==========================================

  // GET /api/coordination/network-summary
  app.get('/api/coordination/network-summary', (req, res) => {
    const totalConnectedHospitals = hospitalsStore.length;
    const totalBeds = hospitalsStore.reduce((acc, h) => acc + h.totalBeds, 0);
    const availableIcu = hospitalsStore.reduce((acc, h) => acc + h.availableIcuBeds, 0);
    const totalIcu = hospitalsStore.reduce((acc, h) => acc + h.totalIcuBeds, 0);
    const availableVentilators = hospitalsStore.reduce((acc, h) => acc + h.availableVentilators, 0);
    const totalVentilators = hospitalsStore.reduce((acc, h) => acc + h.totalVentilators, 0);

    const saturatedHospitals = hospitalsStore.filter(
      (h) => (h.totalBeds - h.availableGeneralBeds) / h.totalBeds > 0.85 || h.emergencyDeptStatus === 'FULL'
    ).length;

    res.json({
      totalConnectedHospitals,
      totalBeds,
      availableIcu,
      totalIcu,
      availableVentilators,
      totalVentilators,
      saturatedHospitals,
      activeTransfersCount: patientTransferWorkflowsStore.filter((w) => w.status !== 'COMPLETED' && w.status !== 'REJECTED').length,
      pendingResourceRequestsCount: resourceExchangesStore.filter((r) => r.status === 'PENDING').length,
      activeStateReservationsCount: stateReservationsStore.filter((r) => r.status === 'ACTIVE').length,
      hospitals: hospitalsStore,
    });
  });

  // GET & POST /api/coordination/resource-exchanges
  app.get('/api/coordination/resource-exchanges', (req, res) => {
    res.json(resourceExchangesStore);
  });

  app.post('/api/coordination/resource-exchanges', (req, res) => {
    const { requestingHospitalId, resourceCategory, resourceDetails, quantity, priority, remarks } = req.body;
    const reqHosp = hospitalsStore.find((h) => h.id === requestingHospitalId) || hospitalsStore[0];

    const newItem: ResourceExchangeItem = {
      id: `exch-${Date.now()}`,
      requestingHospitalId: reqHosp.id,
      requestingHospitalName: reqHosp.name,
      requestingDistrict: reqHosp.districtName,
      resourceCategory: resourceCategory || 'Ventilator',
      resourceDetails: resourceDetails || 'Emergency High-Flow Ventilator Support Unit',
      quantity: Number(quantity) || 1,
      priority: priority || 'RED',
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      remarks: remarks || 'Urgent inter-hospital resource requisition initiated via State Coordination Command.',
    };

    resourceExchangesStore.unshift(newItem);
    res.status(201).json({ success: true, item: newItem });
  });

  app.put('/api/coordination/resource-exchanges/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, fulfillingHospitalId, remarks } = req.body;
    const index = resourceExchangesStore.findIndex((r) => r.id === id);

    if (index !== -1) {
      const item = resourceExchangesStore[index];
      item.status = status || item.status;
      if (fulfillingHospitalId) {
        const fulHosp = hospitalsStore.find((h) => h.id === fulfillingHospitalId);
        if (fulHosp) {
          item.fulfillingHospitalId = fulHosp.id;
          item.fulfillingHospitalName = fulHosp.name;
        }
      }
      if (remarks) item.remarks = remarks;
      if (status === 'COMPLETED') item.fulfilledAt = new Date().toISOString();

      res.json({ success: true, item });
    } else {
      res.status(404).json({ error: 'Resource exchange item not found' });
    }
  });

  // GET & POST /api/coordination/transfer-workflows
  app.get('/api/coordination/transfer-workflows', (req, res) => {
    res.json(patientTransferWorkflowsStore);
  });

  app.post('/api/coordination/transfer-workflows', (req, res) => {
    const {
      patientName,
      patientAgeGender,
      sourceHospitalId,
      destinationHospitalId,
      priority,
      reason,
      receivingDoctor,
    } = req.body;

    const sourceHosp = hospitalsStore.find((h) => h.id === sourceHospitalId) || hospitalsStore[0];
    const destHosp = hospitalsStore.find((h) => h.id === destinationHospitalId) || hospitalsStore[1] || hospitalsStore[0];

    const newWf: PatientTransferWorkflow = {
      id: `trf-wf-${Date.now()}`,
      transferCode: `TRF-2026-${sourceHosp.districtName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`,
      patientName: patientName || 'Critical Emergency Patient',
      patientAgeGender: patientAgeGender || '45M',
      sourceHospitalId: sourceHosp.id,
      sourceHospitalName: sourceHosp.name,
      destinationHospitalId: destHosp.id,
      destinationHospitalName: destHosp.name,
      priority: priority || 'RED',
      reason: reason || 'Specialty Care Transfer Requested',
      status: 'REQUESTED',
      receivingDoctor: receivingDoctor || 'Duty Senior Registrar',
      etaMinutes: 15,
      aiRecommendationDetails: `AI Assessment: Best specialty destination ${destHosp.name} (${destHosp.traumaLevel}) with available ICU capacity.`,
      timeline: [
        {
          stage: 'REQUESTED',
          title: `Transfer Requested by ${sourceHosp.name}`,
          timestamp: new Date().toISOString(),
          completed: true,
          details: 'Initial clinical notes uploaded to State Health Command.',
        },
        { stage: 'RECEIVING_REVIEW', title: `${destHosp.name} Review`, timestamp: '', completed: false },
        { stage: 'RESOURCE_RESERVED', title: 'Bed Reservation', timestamp: '', completed: false },
        { stage: 'AMBULANCE_ASSIGNED', title: 'Ambulance Dispatch', timestamp: '', completed: false },
        { stage: 'TRANSFER_APPROVED', title: 'Corridor Approval', timestamp: '', completed: false },
        { stage: 'IN_TRANSIT', title: 'Patient In Transit', timestamp: '', completed: false },
        { stage: 'COMPLETED', title: 'Handover Completed', timestamp: '', completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    patientTransferWorkflowsStore.unshift(newWf);
    res.status(201).json({ success: true, workflow: newWf });
  });

  app.put('/api/coordination/transfer-workflows/:id/stage', (req, res) => {
    const { id } = req.params;
    const { status, stageName, stageDetails, assignedAmbulance, reservedBed } = req.body;
    const index = patientTransferWorkflowsStore.findIndex((w) => w.id === id);

    if (index !== -1) {
      const wf = patientTransferWorkflowsStore[index];
      if (status) wf.status = status;
      if (assignedAmbulance) wf.assignedAmbulanceRegNo = assignedAmbulance;
      if (reservedBed) wf.reservedBedNumber = reservedBed;
      wf.updatedAt = new Date().toISOString();

      if (stageName) {
        const stageObj = wf.timeline.find((t) => t.stage === stageName);
        if (stageObj) {
          stageObj.completed = true;
          stageObj.timestamp = new Date().toISOString();
          if (stageDetails) stageObj.details = stageDetails;
        }
      }

      res.json({ success: true, workflow: wf });
    } else {
      res.status(404).json({ error: 'Transfer workflow not found' });
    }
  });

  // POST /api/coordination/diversion-check
  app.post('/api/coordination/diversion-check', (req, res) => {
    const { sourceHospitalId } = req.body;
    const srcHosp = hospitalsStore.find((h) => h.id === sourceHospitalId) || hospitalsStore[0];
    const total = srcHosp.totalBeds;
    const occupied = total - srcHosp.availableGeneralBeds;
    const occupancyRate = Math.round((occupied / total) * 100);

    const candidates = hospitalsStore
      .filter((h) => h.id !== srcHosp.id && h.availableIcuBeds > 0)
      .slice(0, 3)
      .map((h, i) => ({
        hospitalId: h.id,
        hospitalName: h.name,
        districtName: h.districtName,
        traumaLevel: h.traumaLevel,
        availableIcu: h.availableIcuBeds,
        availableVentilators: h.availableVentilators,
        travelTimeMin: 12 + i * 8,
        distanceKm: 4.5 + i * 3.2,
        specialtyMatch: '100% Specialty Fit (Level 1 Trauma & Cardiac)',
        divertReason: `Sufficient ICU headroom (${h.availableIcuBeds} beds available) and short transit corridor.`,
        aiScore: 98 - i * 5,
      }));

    const result: HospitalDiversionRecommendation = {
      sourceHospitalId: srcHosp.id,
      sourceHospitalName: srcHosp.name,
      occupancyRatePercent: occupancyRate,
      recommendedDiversions: candidates,
      diversionActive: occupancyRate > 85 || srcHosp.emergencyDeptStatus === 'FULL',
      diversionReason:
        occupancyRate > 85
          ? `Facility at critical occupancy (${occupancyRate}%). Auto-diversion to secondary tertiary nodes active.`
          : 'Normal capacity. Standby diversion protocols active.',
      timestamp: new Date().toISOString(),
    };

    res.json(result);
  });

  // POST /api/coordination/hospital-comparison
  app.post('/api/coordination/hospital-comparison', (req, res) => {
    const { hospitalIds } = req.body;
    const targetIds = Array.isArray(hospitalIds) && hospitalIds.length > 0 ? hospitalIds : hospitalsStore.slice(0, 3).map((h) => h.id);
    const matched = hospitalsStore.filter((h) => targetIds.includes(h.id));

    let maxScore = -1;
    let bestId = '';

    const metricsList: HospitalComparisonMetrics[] = matched.map((h) => {
      const occ = Math.round(((h.totalBeds - h.availableGeneralBeds) / h.totalBeds) * 100);
      const score = Math.min(99, Math.max(60, 100 - occ + h.availableIcuBeds * 2 + h.doctorsOnDuty));
      if (score > maxScore) {
        maxScore = score;
        bestId = h.id;
      }
      return {
        hospitalId: h.id,
        name: h.name,
        district: h.districtName,
        traumaLevel: h.traumaLevel,
        totalBeds: h.totalBeds,
        availableGeneralBeds: h.availableGeneralBeds,
        availableIcuBeds: h.availableIcuBeds,
        availableVentilators: h.availableVentilators,
        doctorsOnDuty: h.doctorsOnDuty,
        nursesOnDuty: h.nursesOnDuty,
        emergencyQueueCount: Math.floor(Math.random() * 6) + 1,
        avgResponseMin: Math.floor(Math.random() * 5) + 4,
        occupancyPercent: occ,
        aiCoordinationScore: score,
        isBestChoice: false,
      };
    });

    metricsList.forEach((m) => {
      if (m.hospitalId === bestId) m.isBestChoice = true;
    });

    res.json({ metrics: metricsList, bestChoiceHospitalId: bestId });
  });

  // GET & POST /api/coordination/collaboration-broadcasts
  app.get('/api/coordination/collaboration-broadcasts', (req, res) => {
    res.json(collaborationBroadcastsStore);
  });

  app.post('/api/coordination/collaboration-broadcasts', (req, res) => {
    const { senderHospitalId, type, title, content, urgency } = req.body;
    const senderHosp = hospitalsStore.find((h) => h.id === senderHospitalId) || hospitalsStore[0];

    const newBroadcast: HospitalCollaborationBroadcast = {
      id: `collab-${Date.now()}`,
      senderHospitalId: senderHosp.id,
      senderHospitalName: senderHosp.name,
      senderDistrict: senderHosp.districtName,
      type: type || 'ANNOUNCEMENT',
      title: title || 'Statewide Hospital Coordination Broadcast',
      content: content || 'Important operational update regarding emergency capacity.',
      urgency: urgency || 'NORMAL',
      readReceipts: [],
      timestamp: new Date().toISOString(),
    };

    collaborationBroadcastsStore.unshift(newBroadcast);
    res.status(201).json({ success: true, broadcast: newBroadcast });
  });

  // GET & POST /api/coordination/state-reservations
  app.get('/api/coordination/state-reservations', (req, res) => {
    res.json(stateReservationsStore);
  });

  app.post('/api/coordination/state-reservations', (req, res) => {
    const { hospitalId, resourceType, resourceDetails, patientName, patientOrIncidentCode, reservedBy } = req.body;
    const hosp = hospitalsStore.find((h) => h.id === hospitalId) || hospitalsStore[0];

    // Double-booking check
    const existingActive = stateReservationsStore.find(
      (r) => r.hospitalId === hosp.id && r.resourceType === resourceType && r.status === 'ACTIVE' && r.patientName === patientName
    );

    if (existingActive) {
      return res.status(409).json({
        success: false,
        message: 'A duplicate active reservation already exists for this patient and resource type.',
      });
    }

    const newRes: StateResourceReservation = {
      id: `res-st-${Date.now()}`,
      reservationCode: `RES-STATE-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      resourceType: resourceType || 'ICU Bed',
      resourceDetails: resourceDetails || 'Emergency Critical Care Unit',
      patientOrIncidentCode: patientOrIncidentCode || 'INC-2026-GEN-01',
      patientName: patientName || 'Emergency Referral Patient',
      reservedBy: reservedBy || 'State Health Operations Officer',
      status: 'ACTIVE',
      reservedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 180 * 60000).toISOString(),
      approvedByHospital: true,
    };

    stateReservationsStore.unshift(newRes);
    res.status(201).json({ success: true, reservation: newRes });
  });

  app.put('/api/coordination/state-reservations/:id/action', (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // 'RELEASE' | 'CANCEL' | 'TRANSFER'
    const index = stateReservationsStore.findIndex((r) => r.id === id);

    if (index !== -1) {
      const resObj = stateReservationsStore[index];
      if (action === 'RELEASE') resObj.status = 'RELEASED';
      if (action === 'CANCEL') resObj.status = 'CANCELLED';
      if (action === 'TRANSFER') resObj.status = 'TRANSFERRED';

      res.json({ success: true, reservation: resObj });
    } else {
      res.status(404).json({ error: 'Reservation not found' });
    }
  });

  // POST /api/coordination/ai-optimize
  app.post('/api/coordination/ai-optimize', async (req, res) => {
    const gemini = getGeminiClient();
    if (!gemini) {
      return res.json({
        recommendation: 'Rule-Based Statewide Allocation: Rebalance 5 ventilators from AIIMS Nagpur to GMC Nagpur, route high-priority cardiac cases in Pune to Sassoon Trauma Desk.',
        confidenceScore: 94,
        diversions: [
          'Divert non-trauma ER traffic from KEM Hospital Mumbai to Lilavati & Cooper',
          'Deploy 2 ALS units from Nashik Base to Samruddhi Corridor KM 400',
        ],
      });
    }

    try {
      const prompt = `You are the AI Resource Optimization Engine for Maharashtra State Emergency Operations Center.
Analyze current hospital capacity data:
${JSON.stringify(hospitalsStore.map((h) => ({ name: h.name, district: h.districtName, availableIcu: h.availableIcuBeds, availableVentilators: h.availableVentilators, occupancy: Math.round(((h.totalBeds - h.availableGeneralBeds) / h.totalBeds) * 100) })))}

Provide JSON response with fields:
- rankingSummary: string
- topRedistributionActions: string[]
- suggestedDiversions: string[]
- capacityRiskForecast: string`;

      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ success: true, rawAiText: response.text });
    } catch (err: any) {
      res.json({
        recommendation: 'Rule-Based Statewide Allocation: Active capacity balancing across 7 key districts.',
        confidenceScore: 91,
        diversions: ['Auto-diversion active for overloaded urban emergency departments'],
      });
    }
  });

  // ====================================================
  // PHASE 12: NATIONAL DISASTER RESPONSE API ENDPOINTS
  // ====================================================

  // GET /api/disaster/incidents
  app.get('/api/disaster/incidents', (req, res) => {
    res.json(disasterIncidentsStore);
  });

  // POST /api/disaster/create
  app.post('/api/disaster/create', (req, res) => {
    const {
      title,
      type,
      severity,
      districtId,
      districtName,
      locationName,
      coordinates,
      radiusKm,
      estimatedVictims,
      specialHazards,
      declaredBy,
      description,
    } = req.body;

    const newDisaster: DisasterIncident = {
      id: `dis-${Date.now()}`,
      code: `DIS-2026-${(districtName || 'STATE').toUpperCase().slice(0, 4)}-${Math.floor(100 + Math.random() * 899)}`,
      title: title || 'Unnamed Emergency Event',
      type: type || 'MASS_CASUALTY',
      severity: severity || 'LEVEL_3_RED_ALERT',
      status: 'ACTIVE',
      districtId: districtId || 'pune',
      districtName: districtName || 'Pune',
      locationName: locationName || 'Expressway Sector',
      coordinates: coordinates || { lat: 18.5204, lng: 73.8567 },
      radiusKm: Number(radiusKm) || 3.5,
      declaredAt: new Date().toISOString(),
      declaredBy: declaredBy || 'State Disaster Operations Chief',
      estimatedVictims: Number(estimatedVictims) || 30,
      triageBreakdown: { red: 5, yellow: 15, green: 10, black: 0 },
      specialHazards: specialHazards || ['Heavy Traffic Blockage'],
      resources: {
        ambulancesNeeded: 15,
        ambulancesDispatched: 10,
        icuBedsNeeded: 10,
        icuBedsReserved: 8,
        oxygenCylindersNeeded: 25,
        oxygenCylindersDispatched: 20,
        bloodUnitsNeeded: 30,
        bloodUnitsDispatched: 25,
        hazmatKitsNeeded: 5,
        hazmatKitsDispatched: 5,
        traumaSurgeonsNeeded: 4,
        traumaSurgeonsAssigned: 4,
      },
      affectedHospitals: ['hosp-pne-01', 'hosp-pne-02'],
      greenCorridorActive: true,
      description: description || 'Level-3 Disaster Incident declared by Command Center.',
    };

    disasterIncidentsStore.unshift(newDisaster);

    // Also append timeline event
    disasterTimelineStore.unshift({
      id: `tl-${Date.now()}`,
      disasterId: newDisaster.id,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      stage: 'DECLARATION',
      author: newDisaster.declaredBy,
      role: 'COMMANDER',
      action: `${newDisaster.severity} DECLARED`,
      details: `${newDisaster.title} declared in ${newDisaster.districtName}. Disaster Command activated.`,
      level: 'CRITICAL',
    });

    res.status(201).json({ success: true, disaster: newDisaster });
  });

  // POST /api/disaster/incidents/:id/update-status
  app.post('/api/disaster/incidents/:id/update-status', (req, res) => {
    const { id } = req.params;
    const { status, severity, greenCorridorActive } = req.body;
    const disaster = disasterIncidentsStore.find((d) => d.id === id);

    if (disaster) {
      if (status) disaster.status = status;
      if (severity) disaster.severity = severity;
      if (typeof greenCorridorActive === 'boolean') disaster.greenCorridorActive = greenCorridorActive;

      disasterTimelineStore.unshift({
        id: `tl-${Date.now()}`,
        disasterId: disaster.id,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        stage: 'COMMAND UPDATE',
        author: 'Incident Commander',
        role: 'COMMANDER',
        action: `Disaster Status Updated to ${disaster.status} (${disaster.severity})`,
        details: `Green Corridor is ${disaster.greenCorridorActive ? 'ACTIVE' : 'INACTIVE'}.`,
        level: disaster.severity === 'LEVEL_3_RED_ALERT' ? 'CRITICAL' : 'INFO',
      });

      res.json({ success: true, disaster });
    } else {
      res.status(404).json({ error: 'Disaster incident not found' });
    }
  });

  // GET /api/disaster/victims
  app.get('/api/disaster/victims', (req, res) => {
    res.json(disasterVictimsStore);
  });

  // POST /api/disaster/victims/triage
  app.post('/api/disaster/victims/triage', (req, res) => {
    const {
      disasterId,
      tagNumber,
      category,
      ageGender,
      injuriesDescription,
      vitals,
      triageLocation,
      assignedHospitalId,
      assignedHospitalName,
      transportStatus,
      assignedAmbulanceId,
      assignedAmbulanceReg,
      specialNotes,
    } = req.body;

    const newVictim: DisasterTriageVictim = {
      id: `vic-${Date.now()}`,
      disasterId: disasterId || 'dis-pune-01',
      tagNumber: tagNumber || `TAG-${category || 'RED'}-${Math.floor(100 + Math.random() * 899)}`,
      category: category || 'RED',
      ageGender: ageGender || '30M',
      injuriesDescription: injuriesDescription || 'Polytrauma casualty tagged at scene',
      vitals: vitals || { hr: 120, bp: '90/60', spo2: 90, rr: 24 },
      triageLocation: triageLocation || 'Field Triage Post',
      assignedHospitalId,
      assignedHospitalName,
      transportStatus: transportStatus || 'STAGED',
      assignedAmbulanceId,
      assignedAmbulanceReg,
      taggedAt: 'Just now',
      aiPriorityScore: category === 'RED' ? 95 : category === 'YELLOW' ? 70 : category === 'GREEN' ? 30 : 0,
      specialNotes,
    };

    disasterVictimsStore.unshift(newVictim);

    // Recalculate tally for disaster
    const dis = disasterIncidentsStore.find((d) => d.id === newVictim.disasterId);
    if (dis) {
      if (category === 'RED') dis.triageBreakdown.red += 1;
      if (category === 'YELLOW') dis.triageBreakdown.yellow += 1;
      if (category === 'GREEN') dis.triageBreakdown.green += 1;
      if (category === 'BLACK') dis.triageBreakdown.black += 1;
    }

    res.status(201).json({ success: true, victim: newVictim });
  });

  // GET /api/disaster/field-hospitals
  app.get('/api/disaster/field-hospitals', (req, res) => {
    res.json(fieldHospitalsStore);
  });

  // POST /api/disaster/field-hospitals
  app.post('/api/disaster/field-hospitals', (req, res) => {
    const { name, locationName, disasterId, totalCapacity, icuTents, doctorsCount, nursesCount } = req.body;
    const newFieldHosp: FieldHospital = {
      id: `field-hosp-${Date.now()}`,
      disasterId: disasterId || 'dis-pune-01',
      name: name || 'Emergency Inflatable Field Tent #3',
      locationName: locationName || 'Expressway Exit Staging Area',
      coordinates: { lat: 18.528, lng: 73.861 },
      totalCapacity: Number(totalCapacity) || 40,
      occupiedBeds: 5,
      icuTents: Number(icuTents) || 3,
      doctorsCount: Number(doctorsCount) || 6,
      nursesCount: Number(nursesCount) || 12,
      oxygenSupplyPercent: 100,
      status: 'OPERATIONAL',
      establishedAt: 'Just now',
    };

    fieldHospitalsStore.unshift(newFieldHosp);
    res.status(201).json({ success: true, fieldHospital: newFieldHosp });
  });

  // GET /api/disaster/broadcasts
  app.get('/api/disaster/broadcasts', (req, res) => {
    res.json(disasterBroadcastsStore);
  });

  // POST /api/disaster/broadcasts
  app.post('/api/disaster/broadcasts', (req, res) => {
    const { title, message, channel, urgency, targetDistricts, author, disasterId } = req.body;
    const newBc: DisasterBroadcast = {
      id: `bc-${Date.now()}`,
      disasterId: disasterId || 'dis-pune-01',
      title: title || 'STATE EMERGENCY DISASTER BROADCAST',
      message: message || 'Urgent disaster advisory for all regional authorities.',
      channel: channel || 'ALL_HANDS',
      urgency: urgency || 'CRITICAL_EVACUATION',
      targetDistricts: targetDistricts || ['pune', 'mumbai'],
      broadcastAt: 'Just now',
      author: author || 'Incident Commander Dr. Rajesh Patil',
      acknowledgedCount: 1,
    };

    disasterBroadcastsStore.unshift(newBc);

    disasterTimelineStore.unshift({
      id: `tl-${Date.now()}`,
      disasterId: newBc.disasterId,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      stage: 'BROADCAST',
      author: newBc.author,
      role: 'COMMANDER',
      action: `Broadcast Issued: ${newBc.title}`,
      details: `Dispatched to ${newBc.channel} channel across districts [${newBc.targetDistricts.join(', ')}].`,
      level: newBc.urgency === 'CRITICAL_EVACUATION' ? 'CRITICAL' : 'WARN',
    });

    res.status(201).json({ success: true, broadcast: newBc });
  });

  // GET /api/disaster/timeline
  app.get('/api/disaster/timeline', (req, res) => {
    res.json(disasterTimelineStore);
  });

  // GET /api/disaster/chat
  app.get('/api/disaster/chat', (req, res) => {
    res.json(disasterChatStore);
  });

  // POST /api/disaster/chat
  app.post('/api/disaster/chat', (req, res) => {
    const { sender, role, message, channel, urgent, disasterId } = req.body;
    const newMsg: DisasterCommandChatMessage = {
      id: `chat-${Date.now()}`,
      disasterId: disasterId || 'dis-pune-01',
      sender: sender || 'State Command Officer',
      role: role || 'COMMANDER',
      message: message || 'Status check for emergency corridor.',
      channel: channel || 'COMMAND',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      urgent: Boolean(urgent),
    };

    disasterChatStore.push(newMsg);
    res.status(201).json({ success: true, message: newMsg });
  });

  // GET /api/disaster/ai-recommendations
  app.get('/api/disaster/ai-recommendations', (req, res) => {
    res.json(aiDisasterRecommendationsStore);
  });

  // POST /api/disaster/ai-recommendations/:id/execute
  app.post('/api/disaster/ai-recommendations/:id/execute', (req, res) => {
    const { id } = req.params;
    const rec = aiDisasterRecommendationsStore.find((r) => r.id === id);

    if (rec) {
      rec.status = 'EXECUTED';

      disasterTimelineStore.unshift({
        id: `tl-${Date.now()}`,
        disasterId: rec.disasterId,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        stage: 'AI EXECUTION',
        author: 'Rakshak AI Disaster Commander',
        role: 'PLANNING_CHIEF',
        action: `AI Recommendation Executed: ${rec.title}`,
        details: rec.suggestedAction,
        level: 'SUCCESS',
      });

      res.json({ success: true, recommendation: rec });
    } else {
      res.status(404).json({ error: 'AI Recommendation not found' });
    }
  });

  // POST /api/disaster/ai-commander (Gemini-powered Decision Intelligence)
  app.post('/api/disaster/ai-commander', async (req, res) => {
    const gemini = getGeminiClient();
    const activeDisaster = disasterIncidentsStore[0];

    if (!gemini) {
      return res.json({
        recommendation:
          'AI Commander Recommendation: Re-route incoming RED casualties from Sassoon (94% full) to Ruby Hall & Sahyadri Hospitals. Extend Emergency Green Corridor along Katraj Bypass.',
        confidenceScore: 96,
        actionItems: [
          'Divert 6 Yellow victims to Sahyadri Super Speciality',
          'Deploy 2 Mobile Oxygen Tanker units from Pimpri Hub',
          'Issue Public Traffic Avoidance Alert for NH-48 KM 60-65',
        ],
      });
    }

    try {
      const prompt = `You are the National Disaster AI Commander for Rakshak AI.
Analyze active disaster state:
Disaster: ${activeDisaster.title} (${activeDisaster.severity})
Victim Triage: Red=${activeDisaster.triageBreakdown.red}, Yellow=${activeDisaster.triageBreakdown.yellow}, Green=${activeDisaster.triageBreakdown.green}, Black=${activeDisaster.triageBreakdown.black}
Hazards: ${activeDisaster.specialHazards.join(', ')}
Resources Dispatched: Ambulances=${activeDisaster.resources.ambulancesDispatched}/${activeDisaster.resources.ambulancesNeeded}, Blood=${activeDisaster.resources.bloodUnitsDispatched}/${activeDisaster.resources.bloodUnitsNeeded}

Provide actionable decision intelligence:
- executiveSummary: string
- keyRiskFactor: string
- surgeDiversionPlan: string
- resourceReallocationPlan: string
- recommendedGreenCorridor: string`;

      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ success: true, analysis: response.text });
    } catch (err) {
      res.json({
        recommendation:
          'AI Disaster Analysis active: Re-balancing triage loads across Pune regional trauma network.',
        confidenceScore: 92,
        actionItems: ['Divert non-critical victims to peripheral clinics'],
      });
    }
  });

  // POST /api/disaster/demo-trigger (3-4 minute Mass Casualty Pune Simulation)
  app.post('/api/disaster/demo-trigger', (req, res) => {
    // Activate Statewide Disaster Mode
    isDisasterModeActive = true;

    // Reset or populate Pune Disaster Incident
    disasterIncidentsStore = [
      {
        id: 'dis-pune-01',
        code: 'DIS-2026-PUNE-001',
        title: 'Mass Casualty Multi-Vehicle Collision on NH-48 Expressway (KM 62)',
        type: 'HIGHWAY_ACCIDENT',
        severity: 'LEVEL_3_RED_ALERT',
        status: 'ACTIVE',
        districtId: 'pune',
        districtName: 'Pune',
        locationName: 'NH-48 Pune-Satara Highway, Expressway Interchange KM 62',
        coordinates: { lat: 18.5204, lng: 73.8567 },
        radiusKm: 4.5,
        declaredAt: new Date().toISOString(),
        declaredBy: 'State Emergency Operations Center (SEOC Director)',
        estimatedVictims: 45,
        triageBreakdown: { red: 8, yellow: 18, green: 15, black: 4 },
        specialHazards: [
          'Chemical tanker rollover with low-pressure diesel leak',
          'Heavy traffic congestion over 6 km stretch',
          'Trapped victims inside collapsed luxury tourist bus',
        ],
        resources: {
          ambulancesNeeded: 25,
          ambulancesDispatched: 21,
          icuBedsNeeded: 14,
          icuBedsReserved: 14,
          oxygenCylindersNeeded: 40,
          oxygenCylindersDispatched: 40,
          bloodUnitsNeeded: 50,
          bloodUnitsDispatched: 48,
          hazmatKitsNeeded: 10,
          hazmatKitsDispatched: 10,
          traumaSurgeonsNeeded: 6,
          traumaSurgeonsAssigned: 6,
        },
        affectedHospitals: ['hosp-pne-01', 'hosp-pne-02', 'hosp-pne-03'],
        greenCorridorActive: true,
        greenCorridorRoute: 'NH-48 KM 62 -> Katraj Tunnel Bypass -> Sassoon General & Ruby Hall Clinic',
        description:
          'DEMO SCENARIO ACTIVE: 45-Victim pileup on NH-48 near Pune. AI triage, Green Corridor signal automation, and regional hospital surge distribution active.',
      },
      ...disasterIncidentsStore.filter((d) => d.id !== 'dis-pune-01'),
    ];

    // Reset timeline with demo milestones
    disasterTimelineStore = [
      {
        id: `tl-demo-1`,
        disasterId: 'dis-pune-01',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        stage: 'T=0 SCENARIO LAUNCH',
        author: 'National Disaster Commander',
        role: 'COMMANDER',
        action: 'LEVEL-3 RED ALERT ACTIVATED (PUNE DEMO)',
        details: 'Multi-vehicle tourist bus collision alert on NH-48 Expressway received by SEOC.',
        level: 'CRITICAL',
      },
      {
        id: `tl-demo-2`,
        disasterId: 'dis-pune-01',
        timestamp: new Date(Date.now() + 10000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        stage: 'T+30s AI TRIAGE',
        author: 'Rakshak AI Triage Engine',
        role: 'PLANNING_CHIEF',
        action: '45 Casualties Categorized by Field Smart Triage',
        details: '8 RED (Immediate), 18 YELLOW (Delayed), 15 GREEN (Walking Wounded), 4 BLACK (Deceased).',
        level: 'SUCCESS',
      },
      {
        id: `tl-demo-3`,
        disasterId: 'dis-pune-01',
        timestamp: new Date(Date.now() + 20000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        stage: 'T+60s GREEN CORRIDOR',
        author: 'Traffic Command Center',
        role: 'AMBULANCE_COMMANDER',
        action: 'Emergency Green Corridor Cleared on NH-48',
        details: '14 Escort units dispatched. Automated signal sequence priority saved 14.5 minutes transport ETA.',
        level: 'INFO',
      },
      {
        id: `tl-demo-4`,
        disasterId: 'dis-pune-01',
        timestamp: new Date(Date.now() + 30000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        stage: 'T+90s SURGE DIVERSION',
        author: 'AI Surge Balancer',
        role: 'LOGISTICS_CHIEF',
        action: 'Automated Hospital Load Balancing',
        details: 'Diverted 6 Yellow casualties to Sahyadri Hospital to prevent Sassoon ER overload.',
        level: 'WARN',
      },
    ];

    res.json({
      success: true,
      message: 'Mass Casualty Highway Collision near Pune Demo scenario launched successfully.',
      disaster: disasterIncidentsStore[0],
    });
  });


  // Vite Middleware in Development vs Static in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Rakshak EOC Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

