export type UserRole =
  | 'STATE_CONTROL'
  | 'DISTRICT_CONTROL'
  | 'HEALTH_OFFICIAL'
  | 'DISPATCH_OFFICER'
  | 'HOSPITAL_COORDINATOR'
  | 'SYSTEM_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  districtId?: string;
  hospitalId?: string;
  badgeNumber: string;
  organization: string;
}

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'NORMAL';
export type OperationalStatus = 'OPTIMAL' | 'HEAVY_LOAD' | 'ALERT' | 'STRESS';

export interface District {
  id: string;
  name: string;
  marathiName: string;
  code: string;
  currentEmergencies: number;
  criticalIncidents: number;
  hospitalsCount: number;
  availableIcuBeds: number;
  totalIcuBeds: number;
  availableVentilators: number;
  totalVentilators: number;
  availableAmbulances: number;
  totalAmbulances: number;
  riskLevel: RiskLevel;
  avgResponseTimeMin: number;
  operationalStatus: OperationalStatus;
  controlCenterPhone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type HospitalType = 'Government' | 'Private' | 'Trust' | 'Teaching';
export type TraumaLevel = 'Level 1 Trauma' | 'Level 2 Trauma' | 'Level 3 Trauma' | 'General Emergency';
export type ERStatus = 'NORMAL' | 'FULL' | 'DIVERTING';

export interface Hospital {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  type: HospitalType;
  traumaLevel: TraumaLevel;
  totalBeds: number;
  availableGeneralBeds: number;
  occupiedGeneralBeds: number;
  availableIcuBeds: number;
  totalIcuBeds: number;
  occupiedIcuBeds: number;
  availableEmergencyBeds: number;
  totalEmergencyBeds: number;
  availableIsolationBeds: number;
  totalIsolationBeds: number;
  availableVentilators: number;
  totalVentilators: number;
  operatingTheatresTotal: number;
  operatingTheatresAvailable: number;
  emergencyDeptStatus: ERStatus;
  contactNumber: string;
  emergencyCoordinatorName: string;
  emergencyCoordinatorPhone: string;
  address: string;
  lat: number;
  lng: number;
  lastSync: string;
  bloodUnitsAvailable: number; // e.g. total units
  bloodGroupBreakdown?: {
    aPositive: number;
    bPositive: number;
    oPositive: number;
    abPositive: number;
    oNegative: number;
  };
  oxygenCapacityPercent: number; // % plant level
  oxygenCylindersAvailable: number;
  emergencyMedicinesStockLevelPercent: number;
  doctorsOnDuty: number;
  nursesOnDuty: number;
  criticalCareSpecialistsOnDuty: number;
  operationalStatus: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
}

export type BedType = 'ICU' | 'Ventilator' | 'Emergency' | 'General' | 'Isolation' | 'Pediatric';
export type BedStatus = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning' | 'Maintenance' | 'Blocked';

export interface BedMatrixEntity {
  id: string;
  hospitalId: string;
  hospitalName?: string;
  building: string;
  floor: string;
  ward: string;
  department: string;
  roomNumber: string;
  bedNumber: string;
  bedType: BedType;
  status: BedStatus;
  cleaningStatus?: string;
  reservationStatus?: string;
  expectedAvailability?: string;
  currentPatientId?: string;
  currentPatientName?: string;
  reservedForEmergencyId?: string;
  reservedByOfficer?: string;
  reservationExpiresAt?: string;
  lastUpdated: string;
}

export interface BedReservation {
  id: string;
  emergencyId: string;
  emergencyCode: string;
  hospitalId: string;
  hospitalName: string;
  bedId: string;
  bedNumber: string;
  department: string;
  bedType: BedType;
  patientName?: string;
  reservedByOfficer: string;
  attendingDoctorNotified: string;
  reservedAt: string;
  expiresAt: string;
  status: 'RESERVED' | 'CONFIRMED' | 'TRANSFERRED' | 'EXPIRED' | 'CANCELLED';
  timeRemainingSec?: number;
}

export interface HospitalTransfer {
  id: string;
  transferCode: string;
  incidentId: string;
  incidentCode: string;
  sourceHospitalId: string;
  sourceHospitalName: string;
  destinationHospitalId: string;
  destinationHospitalName: string;
  patientName: string;
  patientCondition: string;
  priority: PriorityLevel;
  requestedBy: string;
  receivingDoctor: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  requestedAt: string;
  updatedAt: string;
  transferReason: string;
  notes?: string;
}

export interface ResourceShortageAlert {
  id: string;
  hospitalId: string;
  hospitalName: string;
  districtId: string;
  districtName: string;
  alertType:
    | 'ICU_CRITICAL'
    | 'VENTILATOR_CRITICAL'
    | 'OXYGEN_LOW'
    | 'BLOOD_CRITICAL'
    | 'NO_ER_BEDS'
    | 'NO_SPECIALIST';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface AiHospitalRecommendation {
  bestHospitalId: string;
  bestHospitalName: string;
  confidenceScore: number;
  explainability: string;
  alternativeHospitals: {
    hospitalId: string;
    hospitalName: string;
    score: number;
    reason: string;
    availableIcu: number;
    availableVentilators: number;
    distanceKm: number;
  }[];
  capacityWarnings: string[];
  suggestedResourceRedistribution: string[];
  priorityHospitalList: string[];
  timestamp: string;
}

export type PriorityLevel = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE';

export type EmergencyCategory =
  | 'Trauma & Surgery'
  | 'Cardiovascular'
  | 'Neurological'
  | 'Burn & Chemical'
  | 'Respiratory & Toxic'
  | 'Environmental & Disaster'
  | 'Pediatric Emergency'
  | 'General Emergency';

export type IncidentType =
  | 'Road Accident'
  | 'Industrial Explosion'
  | 'Mass Casualty'
  | 'Cardiac Emergency'
  | 'Stroke'
  | 'Trauma'
  | 'Fire'
  | 'Building Collapse'
  | 'Flood'
  | 'Flood Rescue'
  | 'Earthquake'
  | 'Industrial Accident'
  | 'Structural Collapse'
  | 'Epidemic Alert'
  | 'Pandemic'
  | 'Chemical Exposure'
  | 'Other';

export type IncidentSeverity = 'CRITICAL' | 'MAJOR' | 'MODERATE' | 'MINOR';
export type IncidentStatus =
  | 'REPORTED'
  | 'AI_TRIAGED'
  | 'DISPATCHED'
  | 'EN_ROUTE'
  | 'PATIENT_REACHED'
  | 'TRIAGED'
  | 'STABILIZING'
  | 'HOSPITAL_ARRIVED'
  | 'CLOSED';

export interface AiTriageAssessment {
  summary: string;
  severity: PriorityLevel;
  recommendedPriority: PriorityLevel;
  suggestedDepartment: string;
  suggestedAmbulanceType: AmbulanceType;
  suggestedHospitalCapability: TraumaLevel;
  confidenceScore: number;
  clinicalExplanation: string;
  symptomsUsed: string[];
  priorityLogic: string;
  suggestedActions: string[];
  timestamp: string;
  modelVersion: string;
  humanReviewRequired: boolean;
}

export interface PriorityOverrideAudit {
  id: string;
  incidentId: string;
  originalAiPriority: PriorityLevel;
  humanAssignedPriority: PriorityLevel;
  reason: string;
  officerName: string;
  timestamp: string;
}

export interface IncidentTimelineEvent {
  id: string;
  incidentId: string;
  stage:
    | 'CREATED'
    | 'AI_ASSESSED'
    | 'DISPATCHER_REVIEW'
    | 'TRIAGED'
    | 'HOSPITAL_ASSIGNED'
    | 'AMBULANCE_ASSIGNED'
    | 'EN_ROUTE'
    | 'PATIENT_REACHED'
    | 'HOSPITAL_ARRIVED'
    | 'CLOSED';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface MassCasualtyVictim {
  id: string;
  tagNumber: string;
  triageCategory: 'RED_CRITICAL' | 'ORANGE_SERIOUS' | 'YELLOW_MODERATE' | 'GREEN_MINOR' | 'BLACK_DECEASED';
  ageGroup: string;
  gender: string;
  symptoms: string;
  injuryDescription: string;
  assignedHospitalId?: string;
  assignedHospitalName?: string;
  assignedAmbulanceNo?: string;
  status: 'TRIAGED' | 'EN_ROUTE' | 'ADMITTED' | 'DECEASED';
  updatedAt: string;
}

export interface CommandCenterAlert {
  id: string;
  type:
    | 'HIGH_PRIORITY'
    | 'MASS_CASUALTY'
    | 'MULTIPLE_CRITICAL'
    | 'HOSPITAL_CAPACITY'
    | 'NO_AMBULANCE'
    | 'DISTRICT_OVERLOAD'
    | 'ESCALATING';
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  districtId?: string;
  districtName?: string;
  incidentId?: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface QueueItem {
  rank: number;
  incident: Incident;
  aiPriority: PriorityLevel;
  finalPriority: PriorityLevel;
  deteriorationRiskScore: number;
  waitingTimeMin: number;
  hospitalCapacityScore: number;
  rankDelta: number;
  overrideReason?: string;
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  districtId: string;
  districtName: string;
  locationName: string;
  type: IncidentType;
  category?: EmergencyCategory;
  priority: PriorityLevel;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedCount: number; // Patient count
  patientCount?: number;
  ageGroup?: string;
  gender?: string;
  symptoms?: string;
  description?: string;
  reportedBy: string;
  reporterPhone?: string;
  assignedHospitalId?: string;
  assignedHospitalName?: string;
  assignedAmbulances: number;
  assignedAmbulanceDetails?: string;
  estimatedResponseTimeMin?: number;
  assignedDispatcher?: string;
  lastUpdated?: string;
  timestamp: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  notes: string;
  aiTriage?: AiTriageAssessment;
  overrideAudit?: PriorityOverrideAudit;
  timeline?: IncidentTimelineEvent[];
  massCasualtyVictims?: MassCasualtyVictim[];
  hasPhotoAttachment?: boolean;
  hasVoiceAttachment?: boolean;
}

export type AmbulanceType = 'ALS' | 'BLS' | 'Neonatal ICU' | 'Cardiac Care';
export type AmbulanceStatus =
  | 'AVAILABLE'
  | 'DISPATCHED'
  | 'EN_ROUTE'
  | 'AT_PATIENT'
  | 'PATIENT_LOADED'
  | 'TRANSPORTING'
  | 'AT_HOSPITAL'
  | 'IN_TRANSIT'
  | 'MAINTENANCE'
  | 'OFF_LINE';

export interface FleetEquipment {
  ventilator: boolean;
  defibrillator: boolean;
  oxygenReserve: boolean;
  syringePump: boolean;
  suctionMachine: boolean;
  ecgMonitor: boolean;
}

export interface Ambulance {
  id: string;
  registrationNo: string;
  districtId: string;
  districtName: string;
  type: AmbulanceType;
  status: AmbulanceStatus;
  baseHospital: string;
  baseHospitalId?: string;
  driverName: string;
  phone: string;
  paramedicName?: string;
  fuelLevel?: number; // 0-100%
  equipment?: FleetEquipment;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  heading?: number; // 0-360 deg
  speedKmH?: number;
  remainingDistanceKm?: number;
  etaMin?: number;
  currentMissionId?: string;
  assignedIncidentId?: string;
  assignedHospitalId?: string;
  lastPing: string;
}

export type MissionStage =
  | 'DISPATCHED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'EN_ROUTE_PATIENT'
  | 'PATIENT_REACHED'
  | 'PATIENT_LOADED'
  | 'EN_ROUTE_HOSPITAL'
  | 'HOSPITAL_ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface MissionTimelineEvent {
  stage: MissionStage;
  title: string;
  timestamp: string;
  note: string;
  actor: string;
}

export interface AmbulanceMission {
  id: string;
  missionCode: string;
  incidentId: string;
  incidentCode: string;
  incidentTitle: string;
  incidentLocation: string;
  incidentCoords: { lat: number; lng: number };
  priority: PriorityLevel;
  ambulanceId: string;
  ambulanceNumber: string;
  ambulanceType: AmbulanceType;
  driverName: string;
  driverPhone: string;
  paramedicName: string;
  hospitalId: string;
  hospitalName: string;
  hospitalCoords: { lat: number; lng: number };
  patientName: string;
  patientCondition: string;
  patientCount: number;
  status: MissionStage;
  greenCorridorActive: boolean;
  dispatchTimestamp: string;
  pickupTime?: string;
  hospitalArrivalTime?: string;
  dropoffTime?: string;
  completionTime?: string;
  totalDistanceKm: number;
  estimatedEtaMin: number;
  currentSpeedKmH: number;
  updatedAt: string;
  timeline: MissionTimelineEvent[];
}

export interface FleetDispatchAlert {
  id: string;
  type:
    | 'NO_AMBULANCE_NEARBY'
    | 'TRAFFIC_DELAY'
    | 'VEHICLE_BREAKDOWN'
    | 'HOSPITAL_DIVERSION'
    | 'MISSION_DELAY'
    | 'CRITICAL_MISSION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  ambulanceId?: string;
  ambulanceNumber?: string;
  incidentId?: string;
  districtId?: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

export interface RecommendedAmbulanceOption {
  ambulanceId?: string;
  registrationNo?: string;
  type?: string;
  score?: number;
  etaMin?: number;
  distanceKm?: number;
  reason?: string;
  ambulance?: Ambulance;
  trafficCondition?: 'LIGHT' | 'MODERATE' | 'HEAVY' | 'CONGESTED';
}

export interface SmartDispatchRecommendation {
  incidentId: string;
  incidentPriority?: PriorityLevel;
  bestAmbulanceId: string;
  bestAmbulanceReg: string;
  bestAmbulanceType: string;
  suitabilityScore: number;
  estimatedEtaMin: number;
  distanceKm: number;
  aiRationale: string;
  equipmentMatch: string[];
  trafficLevel?: string;
  greenCorridorRecommended: boolean;
  recommendedHospitalId: string;
  recommendedHospitalName: string;
  alternativeAmbulances: RecommendedAmbulanceOption[];
  timestamp: string;
}

export interface RouteDetails {
  incidentId?: string;
  ambulanceId?: string;
  hospitalId?: string;
  origin?: { lat: number; lng: number; address?: string };
  destination?: { lat: number; lng: number; address?: string };
  distanceKm: number;
  etaMin?: number;
  durationMin?: number;
  trafficDelayMin: number;
  greenCorridorActive: boolean;
  greenCorridorEtaSavedMin?: number;
  waypoints?: { lat: number; lng: number; name?: string; instruction?: string }[];
  turnByTurnInstructions?: {
    instruction: string;
    distanceKm: number;
    durationSec?: number;
    speedLimitKmH?: number;
  }[];
  alternativeRoutes?: {
    routeName: string;
    distanceKm: number;
    durationMin: number;
    viaRoads: string;
  }[];
}

export interface FleetAnalyticsData {
  totalFleetSize?: number;
  totalAmbulances?: number;
  availableUnits?: number;
  availableCount?: number;
  dispatchedUnits?: number;
  transportingUnits?: number;
  maintenanceUnits?: number;
  busyCount?: number;
  maintenanceCount?: number;
  alsCount?: number;
  blsCount?: number;
  icuCount?: number;
  fleetReadinessRatePercent?: number;
  avgStatewideResponseTimeMin?: number;
  avgResponseTimeMin?: number;
  greenCorridorCountToday?: number;
  greenCorridorMissionsCount?: number;
  totalMissionsCompletedToday: number;
  typeBreakdown?: {
    ALS: number;
    BLS: number;
    CardiacCare: number;
    NeonatalICU: number;
  };
  districtStats?: { district: string; totalFleet: number; available: number; busy: number }[];
  districtUtilization?: { district: string; available: number; busy: number; total: number }[];
  equipmentReadinessPercent?: number;
  fuelAveragePercent?: number;
}

export interface SystemHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  uptimeSeconds: number;
  postgres: {
    status: 'ONLINE' | 'RECONNECTING' | 'OFFLINE';
    connections: number;
    latencyMs: number;
  };
  redis: {
    status: 'ONLINE' | 'RECONNECTING' | 'OFFLINE';
    memoryUsedMB: number;
    cacheHitRatePercent: number;
  };
  webSockets: {
    gatewayStatus: 'READY' | 'LISTENING' | 'PAUSED';
    activeConnections: number;
  };
  geminiAi: {
    apiStatus: 'ONLINE' | 'STANDBY';
    latencyMs: number;
  };
  activeNodes: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  lastCheckTimestamp: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';
  source: string;
  message: string;
  user: string;
}

export interface EocSummaryMetrics {
  activeEmergencies: number;
  criticalIncidents: number;
  availableIcuBeds: number;
  totalIcuBeds: number;
  availableVentilators: number;
  totalVentilators: number;
  availableAmbulances: number;
  totalAmbulances: number;
  averageResponseTimeMin: number;
  hospitalsOnline: number;
  totalHospitals: number;
  districtsConnected: number;
  totalDistricts: number;
  systemHealthScore: number;
  activeAlertsCount: number;
}

// ==========================================
// Phase 5: AI Decision Intelligence Platform
// ==========================================

export type PatientDeteriorationRiskLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'CRITICAL';

export interface PatientDeteriorationPrediction {
  id: string;
  patientName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  incidentId: string;
  hospitalId?: string;
  hospitalName?: string;
  vitals: {
    heartRate: number;
    bpSystolic: number;
    bpDiastolic: number;
    respiratoryRate: number;
    temperatureC: number;
    spo2: number;
  };
  medicalHistory: string[];
  currentTreatment: string;
  riskScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  predictedDeteriorationTimeMin: number;
  riskLevel: PatientDeteriorationRiskLevel;
  recommendedIntervention: string;
  aiExplanation: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  overridden?: boolean;
  overrideReason?: string;
  timestamp: string;
}

export interface AiResourceOptimizationPrediction {
  id: string;
  hospitalId: string;
  hospitalName: string;
  district: string;
  timeframeMin: number; // 30, 60, 120
  predictedIcuShortage: boolean;
  predictedVentilatorShortage: boolean;
  predictedStaffShortage: boolean;
  predictedSaturationPercent: number;
  suggestedAction: 'REDISTRIBUTE_RESOURCES' | 'INTER_HOSPITAL_TRANSFER' | 'TEMPORARY_DIVERSION' | 'EMERGENCY_EXPANSION';
  actionDetails: string;
  alternateHospitalId?: string;
  alternateHospitalName?: string;
  confidence: number;
  status: 'ACTIVE' | 'EXECUTED' | 'DISMISSED';
  timestamp: string;
}

export interface DistrictRiskIntelligence {
  districtId: string;
  districtName: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0 - 100
  hospitalLoadPercent: number;
  emergencyVolume24h: number;
  avgResponseTimeMin: number;
  availableIcuBeds: number;
  availableAmbulances: number;
  predictedDemandSurgePercent: number;
  riskRank: number;
}

export interface DiseaseClusterAlert {
  id: string;
  type: 'ROAD_ACCIDENT_CLUSTER' | 'CARDIAC_SPIKE' | 'HEAT_STROKE_CLUSTER' | 'RESPIRATORY_SPIKE' | 'INDUSTRIAL_LEAK' | 'PANDEMIC_INDICATOR';
  title: string;
  district: string;
  locationName: string;
  affectedCount: number;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedTimestamp: string;
  aiAnalysis: string;
  status: 'ACTIVE' | 'CONTAINED' | 'INVESTIGATING';
}

export interface AiCommandRecommendation {
  id: string;
  category: 'AMBULANCE_DIVERSION' | 'ICU_BED_RESERVATION' | 'ADDITIONAL_DISPATCH' | 'BLOOD_SUPPLY_REQUEST' | 'DISASTER_TEAM_ACTIVATION' | 'ESCALATE_LEVEL';
  title: string;
  description: string;
  targetLocation: string;
  confidenceScore: number;
  evidenceUsed: string[];
  predictionHorizon: string;
  limitations: string;
  humanApprovalRequired: boolean;
  approved?: boolean;
  rejected?: boolean;
  executedBy?: string;
  timestamp: string;
  modelVersion: string;
}

export type SimulationScenarioType =
  | 'MASS_CASUALTY'
  | 'HIGHWAY_ACCIDENT'
  | 'FLOOD'
  | 'EARTHQUAKE'
  | 'PANDEMIC'
  | 'INDUSTRIAL_DISASTER'
  | 'CHEMICAL_LEAK';

export interface SimulationResult {
  scenario: SimulationScenarioType;
  district: string;
  intensity: 'MODERATE' | 'SEVERE' | 'CATASTROPHIC';
  estimatedCasualties: number;
  simulatedAt: string;
  hospitalOccupancyJump: number;
  ambulancesDispatched: number;
  predictedIcuExhaustionTimeMin: number;
  aiActionPlan: string[];
}

export interface AiExplainabilityLog {
  id: string;
  recommendationId: string;
  recommendationTitle: string;
  confidenceScore: number;
  reasoning: string;
  evidenceUsed: string[];
  limitations: string;
  humanApproved: boolean;
  timestamp: string;
  modelVersion: string;
}

// ====================================================
// Phase 11: National AI Decision Intelligence Types
// ====================================================

export interface HospitalResourceForecast {
  hospitalId: string;
  hospitalName: string;
  district: string;
  horizon30m: { icuOccupancy: number; ventilatorDemand: number; otDemand: number; emergencyVolume: number };
  horizon1h: { icuOccupancy: number; ventilatorDemand: number; otDemand: number; emergencyVolume: number };
  horizon2h: { icuOccupancy: number; ventilatorDemand: number; otDemand: number; emergencyVolume: number };
  horizon6h: { icuOccupancy: number; ventilatorDemand: number; otDemand: number; emergencyVolume: number };
  horizon24h: { icuOccupancy: number; ventilatorDemand: number; otDemand: number; emergencyVolume: number };
  hourlyForecast: { hour: string; admissions: number; icuOccupancy: number; ventilatorDemand: number; otDemand: number }[];
  dailyForecast: { day: string; admissions: number; icuOccupancy: number; doctorDemand: number; nurseDemand: number }[];
  weeklyForecast: { week: string; emergencyVolume: number; icuOccupancy: number; doctorDemand: number }[];
  predictedShortages: {
    icuExhaustion: boolean;
    ventilatorShortage: boolean;
    doctorShortage: boolean;
    nurseShortage: boolean;
    bloodShortage: boolean;
    oxygenShortage: boolean;
  };
  timeToExhaustionMin?: number;
}

export interface AmbulanceDemandForecast {
  districtId: string;
  districtName: string;
  currentAvailableAmbulances: number;
  currentBusyAmbulances: number;
  forecast30m: { busyUnits: number; demandSurgePercent: number; responseTimeMin: number };
  forecast1h: { busyUnits: number; demandSurgePercent: number; responseTimeMin: number };
  forecast2h: { busyUnits: number; demandSurgePercent: number; responseTimeMin: number };
  forecast6h: { busyUnits: number; demandSurgePercent: number; responseTimeMin: number };
  forecast24h: { busyUnits: number; demandSurgePercent: number; responseTimeMin: number };
  districtCoveragePercent: number;
  trafficImpactIndex: 'LOW' | 'MODERATE' | 'HEAVY' | 'CONGESTED';
  expectedDispatchVolume24h: number;
  recommendedVehicleRedistribution: {
    sourceDistrict: string;
    targetDistrict: string;
    vehicleType: 'ALS' | 'BLS' | 'Cardiac Care';
    unitsToMove: number;
    reason: string;
  }[];
}

export interface EmergencyForecastItem {
  id: string;
  category: 'Road Accidents' | 'Cardiac Emergencies' | 'Flood Impact' | 'Fire Incidents' | 'Pandemic Growth' | 'Mass Casualty Risk' | 'Heat Stroke Cluster' | string;
  district: string;
  predictedSurgePercent: number;
  riskZone: string;
  growthTrend: 'STABLE' | 'RISING' | 'SURGING' | 'CRITICAL_SPIKE';
  predictedCases24h: number;
  contributingFactors: string[];
}

export interface PredictiveAnalyticsData {
  overallPredictionAccuracy: number; // e.g. 96.4
  recommendationAcceptanceRate: number; // e.g. 92.1
  forecastAccuracyScore: number; // e.g. 94.8
  modelLatencyMs: number; // e.g. 115
  emergencyTrends: { timeLabel: string; actual: number; predicted: number }[];
  resourceForecasts: { resource: string; demandIndex: number; capacityIndex: number }[];
  patientRiskTrends: { riskCategory: string; count: number; percentage: number }[];
  districtRiskIndex: { district: string; riskScore: number; predictedGrowth: number }[];
  hospitalUtilization: { hospital: string; icuOccupancy: number; bedUtilization: number }[];
}

export interface DoctorAiWorkspacePatient {
  id: string;
  patientName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  assignedDoctorName: string;
  hospitalName: string;
  incidentCode: string;
  incidentType: string;
  etaMinutes: number;
  liveRiskScore: number; // 0-100
  riskCategory: PatientDeteriorationRiskLevel;
  predictedDeteriorationTimeMin: number;
  vitals: {
    heartRate: number;
    bpSystolic: number;
    bpDiastolic: number;
    spo2: number;
    respiratoryRate: number;
    temperatureC: number;
  };
  vitalsTrend: { timestamp: string; hr: number; spo2: number; bpSys: number }[];
  clinicalSummary: string;
  aiRiskExplanation: string;
  suggestedPreparation: string[];
  doctorDecision?: {
    status: 'APPROVED' | 'REJECTED' | 'MODIFIED' | 'PENDING';
    modifiedNotes?: string;
    decidedAt?: string;
  };
}

// ==========================================
// Phase 6: Real-Time Network & IoT Gateway
// ==========================================

export type IotDeviceCategory =
  | 'ECG_MONITOR'
  | 'PULSE_OXIMETER'
  | 'BP_MONITOR'
  | 'RESPIRATORY_SENSOR'
  | 'TEMP_SENSOR'
  | 'GLUCOSE_MONITOR'
  | 'PORTABLE_VENTILATOR'
  | 'DEFIBRILLATOR'
  | 'INFUSION_PUMP'
  | 'SMART_AMBULANCE_HUB'
  | 'REMOTE_PATIENT_MONITOR';

export interface IotDeviceTelemetryStream {
  id: string;
  serialNumber: string;
  deviceName: string;
  deviceCategory: IotDeviceCategory;
  patientId: string;
  patientName: string;
  ambulanceId?: string;
  ambulanceRegNo?: string;
  hospitalId?: string;
  hospitalName?: string;
  status: 'ONLINE_STREAMING' | 'BUFFERED' | 'WARNING' | 'CRITICAL_ALARM' | 'OFFLINE';
  vitals: {
    heartRate: number;
    bpSystolic: number;
    bpDiastolic: number;
    spo2: number;
    respiratoryRate: number;
    temperatureC: number;
    glucoseMgDl: number;
    painScore: number;
    ecgStatus: 'NORMAL_SINUS' | 'ST_ELEVATION' | 'AFIB' | 'TACHYCARDIA' | 'BRADYCARDIA';
    ventilatorMode?: string;
    infusionRateMlH?: number;
  };
  batteryLevelPercent: number;
  signalQualityPercent: number;
  aiAlertTriggered: boolean;
  aiAlertReason?: string;
  lastPing: string;
}

export type AgencyChannelGroup =
  | 'EOC_TO_HOSPITAL'
  | 'HOSPITAL_TO_HOSPITAL'
  | 'DISPATCHER_TO_AMBULANCE'
  | 'DOCTOR_TO_NURSE'
  | 'GOVT_TO_DISTRICT'
  | 'STATEWIDE_BROADCAST';

export interface AgencyChatMessage {
  id: string;
  channelGroup: AgencyChannelGroup;
  incidentId?: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderBadge: string;
  recipientGroup: string;
  messageText: string;
  priority: 'NORMAL' | 'URGENT' | 'CRITICAL_EMERGENCY';
  isBroadcast?: boolean;
  readBy: string[];
  timestamp: string;
}

export interface FcmNotificationPayload {
  id: string;
  title: string;
  body: string;
  topic: 'EMERGENCY_CREATED' | 'HOSPITAL_ASSIGNED' | 'ICU_BED_RESERVED' | 'AMBULANCE_ASSIGNED' | 'PATIENT_ARRIVED' | 'CRITICAL_ALERT';
  targetUserId?: string;
  dataPayload: Record<string, string>;
  sentAt: string;
  delivered: boolean;
}

export interface DemoSimulationState {
  active: boolean;
  paused: boolean;
  currentStepIndex: number;
  elapsedSeconds: number;
  simulatedIncidentId?: string;
  simulatedAmbulanceId?: string;
  simulatedHospitalId?: string;
  steps: {
    stepIndex: number;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    timestamp?: string;
  }[];
}

export type HospitalAdminRole =
  | 'HOSPITAL_ADMINISTRATOR'
  | 'EMERGENCY_COORDINATOR'
  | 'RESOURCE_MANAGER'
  | 'BED_MANAGER'
  | 'NURSING_SUPERVISOR'
  | 'BIOMEDICAL_ENGINEER'
  | 'MEDICAL_SUPERINTENDENT'
  | 'READ_ONLY_AUDITOR';

export interface MedicalEquipment {
  id: string;
  hospitalId: string;
  serialNumber: string;
  name: string;
  category:
    | 'VENTILATOR'
    | 'DEFIBRILLATOR'
    | 'ECG'
    | 'ULTRASOUND'
    | 'XRAY_PORTABLE'
    | 'DIALYSIS'
    | 'INFUSION_PUMP'
    | 'PATIENT_MONITOR'
    | 'OXYGEN_CONCENTRATOR';
  department: string;
  location: string;
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Fault';
  batteryHealthPercent?: number;
  assignedPatientName?: string;
  assignedBedNumber?: string;
  lastServiceDate: string;
  nextServiceDueDate: string;
  notes?: string;
}

export interface HospitalStaff {
  id: string;
  hospitalId: string;
  name: string;
  roleTitle: 'Doctor' | 'Nurse' | 'Paramedic' | 'Technician' | 'Ward Boy' | 'Response Team';
  specialty: string;
  department: string;
  shift: 'Morning' | 'Evening' | 'Night';
  status: 'On-Duty' | 'On-Call' | 'Off-Duty' | 'On-Break';
  contactNumber: string;
  emergencyAssigned?: string;
  emergencyContact: string;
  assignedWard?: string;
}

export interface HospitalDepartment {
  id: string;
  hospitalId: string;
  name: string;
  headDoctor: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  activeStaffCount: number;
  averageWaitTimeMin: number;
  occupancyPercent: number;
  status: 'NORMAL' | 'BUSY' | 'SATURATED';
}

export interface HospitalEmergencyRequest {
  id: string;
  hospitalId: string;
  incidentId: string;
  incidentCode: string;
  incidentTitle: string;
  districtName: string;
  patientName: string;
  patientAgeGender?: string;
  priority: PriorityLevel;
  symptoms: string;
  triageSummary: string;
  etaMinutes: number;
  assignedAmbulanceRegNo?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'TRANSFER_REQUESTED' | 'ARRIVED';
  assignedReceivingDoctor?: string;
  assignedBedNumber?: string;
  rejectionReason?: string;
  transferDestinationHospitalName?: string;
  requestedAt: string;
  updatedAt: string;
}

export interface HospitalAuditLog {
  id: string;
  hospitalId: string;
  hospitalName: string;
  action: string;
  category: 'BED_MANAGEMENT' | 'RESOURCE_UPDATE' | 'EMERGENCY_ACCEPT' | 'EQUIPMENT' | 'STAFF' | 'AI_ASSISTANT';
  performedBy: string;
  userRole: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface HospitalQuickResourceUpdate {
  availableIcuBeds: number;
  availableGeneralBeds: number;
  availableVentilators: number;
  doctorsOnDuty: number;
  nursesOnDuty: number;
  bloodUnitsAvailable: number;
  oxygenCapacityPercent: number;
  oxygenCylindersAvailable: number;
  emergencyMedicinesStockLevelPercent: number;
  operatingTheatresAvailable: number;
  emergencyDeptStatus: ERStatus;
}

export interface ResourceExchangeItem {
  id: string;
  requestingHospitalId: string;
  requestingHospitalName: string;
  requestingDistrict: string;
  fulfillingHospitalId?: string;
  fulfillingHospitalName?: string;
  resourceCategory: 'ICU Bed' | 'Ventilator' | 'Blood' | 'Oxygen' | 'Equipment' | 'Doctor' | 'Nurse' | 'Ambulance';
  resourceDetails: string;
  quantity: number;
  priority: 'RED' | 'ORANGE' | 'YELLOW';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_TRANSIT' | 'COMPLETED';
  requestedAt: string;
  fulfilledAt?: string;
  remarks?: string;
}

export interface PatientTransferWorkflowStage {
  stage: string;
  title: string;
  timestamp: string;
  completed: boolean;
  details?: string;
}

export interface PatientTransferWorkflow {
  id: string;
  transferCode: string;
  patientName: string;
  patientAgeGender?: string;
  sourceHospitalId: string;
  sourceHospitalName: string;
  destinationHospitalId: string;
  destinationHospitalName: string;
  priority: PriorityLevel;
  reason: string;
  status:
    | 'REQUESTED'
    | 'RECEIVING_REVIEW'
    | 'AI_RECOMMENDED'
    | 'RESOURCE_RESERVED'
    | 'AMBULANCE_ASSIGNED'
    | 'TRANSFER_APPROVED'
    | 'IN_TRANSIT'
    | 'ARRIVED'
    | 'COMPLETED'
    | 'REJECTED';
  receivingDoctor?: string;
  reservedBedNumber?: string;
  assignedAmbulanceRegNo?: string;
  etaMinutes?: number;
  aiRecommendationDetails?: string;
  timeline: PatientTransferWorkflowStage[];
  createdAt: string;
  updatedAt: string;
}

export interface HospitalDiversionOption {
  hospitalId: string;
  hospitalName: string;
  districtName: string;
  traumaLevel: string;
  availableIcu: number;
  availableVentilators: number;
  travelTimeMin: number;
  distanceKm: number;
  specialtyMatch: string;
  divertReason: string;
  aiScore: number;
}

export interface HospitalDiversionRecommendation {
  sourceHospitalId: string;
  sourceHospitalName: string;
  occupancyRatePercent: number;
  recommendedDiversions: HospitalDiversionOption[];
  diversionActive: boolean;
  diversionReason: string;
  timestamp: string;
}

export interface HospitalComparisonMetrics {
  hospitalId: string;
  name: string;
  district: string;
  traumaLevel: string;
  totalBeds: number;
  availableGeneralBeds: number;
  availableIcuBeds: number;
  availableVentilators: number;
  doctorsOnDuty: number;
  nursesOnDuty: number;
  emergencyQueueCount: number;
  avgResponseMin: number;
  occupancyPercent: number;
  aiCoordinationScore: number;
  isBestChoice?: boolean;
}

export interface HospitalCollaborationBroadcast {
  id: string;
  senderHospitalId: string;
  senderHospitalName: string;
  senderDistrict: string;
  type: 'TRANSFER_REQUEST' | 'EMERGENCY_BROADCAST' | 'RESOURCE_REQUEST' | 'ANNOUNCEMENT' | 'CRITICAL_ALERT';
  title: string;
  content: string;
  urgency: 'NORMAL' | 'HIGH' | 'CRITICAL';
  readReceipts: { userOrHospital: string; readAt: string }[];
  timestamp: string;
}

export interface StateResourceReservation {
  id: string;
  reservationCode: string;
  hospitalId: string;
  hospitalName: string;
  resourceType: 'ICU Bed' | 'Ventilator' | 'Operation Theatre' | 'Doctor' | 'Emergency Team';
  resourceDetails: string;
  patientOrIncidentCode: string;
  patientName: string;
  reservedBy: string;
  status: 'ACTIVE' | 'RELEASED' | 'EXPIRED' | 'CANCELLED' | 'TRANSFERRED';
  reservedAt: string;
  expiresAt: string;
  approvedByHospital: boolean;
}

// ==========================================
// PHASE 12: NATIONAL DISASTER RESPONSE TYPES
// ==========================================

export type IcsRole =
  | 'COMMANDER'
  | 'OPERATIONS_CHIEF'
  | 'PLANNING_CHIEF'
  | 'LOGISTICS_CHIEF'
  | 'MEDICAL_DIRECTOR'
  | 'HOSPITAL_COORDINATOR'
  | 'AMBULANCE_COMMANDER'
  | 'DISTRICT_COLLECTOR';

export type DisasterType =
  | 'MASS_CASUALTY'
  | 'HIGHWAY_ACCIDENT'
  | 'EARTHQUAKE'
  | 'FLOOD'
  | 'CHEMICAL_SPILL'
  | 'FIRE_OUTBREAK'
  | 'PANDEMIC'
  | 'INDUSTRIAL_EXPLOSION';

export type DisasterStatus = 'ACTIVE' | 'CONTAINED' | 'STANDBY' | 'RESOLVED' | 'RECOVERING';

export interface DisasterResourceRequirements {
  ambulancesNeeded: number;
  ambulancesDispatched: number;
  icuBedsNeeded: number;
  icuBedsReserved: number;
  oxygenCylindersNeeded: number;
  oxygenCylindersDispatched: number;
  bloodUnitsNeeded: number;
  bloodUnitsDispatched: number;
  hazmatKitsNeeded: number;
  hazmatKitsDispatched: number;
  traumaSurgeonsNeeded: number;
  traumaSurgeonsAssigned: number;
}

export interface DisasterIncident {
  id: string;
  code: string;
  title: string;
  type: DisasterType;
  severity: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3_RED_ALERT';
  status: DisasterStatus;
  districtId: string;
  districtName: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  radiusKm: number;
  declaredAt: string;
  declaredBy: string;
  estimatedVictims: number;
  triageBreakdown: { red: number; yellow: number; green: number; black: number };
  specialHazards: string[];
  resources: DisasterResourceRequirements;
  affectedHospitals: string[];
  greenCorridorActive: boolean;
  greenCorridorRoute?: string;
  description: string;
}

export interface DisasterTriageVictim {
  id: string;
  disasterId: string;
  tagNumber: string;
  category: 'RED' | 'YELLOW' | 'GREEN' | 'BLACK';
  ageGender: string;
  injuriesDescription: string;
  vitals: { hr: number; bp: string; spo2: number; rr: number };
  triageLocation: string;
  assignedHospitalId?: string;
  assignedHospitalName?: string;
  transportStatus: 'UNASSIGNED' | 'STAGED' | 'EN_ROUTE' | 'ADMITTED' | 'DECEASED';
  assignedAmbulanceId?: string;
  assignedAmbulanceReg?: string;
  taggedAt: string;
  aiPriorityScore: number;
  specialNotes?: string;
}

export interface FieldHospital {
  id: string;
  disasterId: string;
  name: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  totalCapacity: number;
  occupiedBeds: number;
  icuTents: number;
  doctorsCount: number;
  nursesCount: number;
  oxygenSupplyPercent: number;
  status: 'OPERATIONAL' | 'SETTING_UP' | 'FULL' | 'DEMOBILIZED';
  establishedAt: string;
}

export interface DisasterBroadcast {
  id: string;
  disasterId: string;
  title: string;
  message: string;
  channel:
    | 'POLICE_TRAFFIC'
    | 'REGIONAL_HOSPITALS'
    | 'AMBULANCE_FLEET'
    | 'PUBLIC_SMS'
    | 'DISTRICT_COLLECTORS'
    | 'ALL_HANDS';
  urgency: 'CRITICAL_EVACUATION' | 'URGENT_SURGE' | 'INFO';
  targetDistricts: string[];
  broadcastAt: string;
  author: string;
  acknowledgedCount?: number;
}

export interface DisasterTimelineEvent {
  id: string;
  disasterId: string;
  timestamp: string;
  stage: string;
  author: string;
  role: IcsRole;
  action: string;
  details: string;
  level: 'CRITICAL' | 'WARN' | 'INFO' | 'SUCCESS';
}

export interface DisasterCommandChatMessage {
  id: string;
  disasterId: string;
  sender: string;
  role: IcsRole;
  message: string;
  channel: 'COMMAND' | 'FIELD_MEDICS' | 'TRAFFIC_CORRIDOR' | 'HOSPITAL_SURGE';
  timestamp: string;
  urgent: boolean;
}

export interface AiDisasterRecommendation {
  id: string;
  disasterId: string;
  category: 'SURGE_DIVERSION' | 'GREEN_CORRIDOR' | 'RESOURCE_DEPLOYMENT' | 'FIELD_HOSPITAL' | 'PUBLIC_ALERT';
  title: string;
  rationale: string;
  suggestedAction: string;
  impactMetric: string;
  status: 'PENDING' | 'EXECUTED' | 'DISMISSED';
  timestamp: string;
}

// Phase 13: Independent Ambulance Operations Portal Types
export type AmbulanceUserRole = 'DRIVER' | 'PARAMEDIC' | 'FLEET_MANAGER' | 'EMS_COORDINATOR';

export interface AmbulanceUserSession {
  token: string;
  user: {
    id: string;
    name: string;
    role: AmbulanceUserRole;
    roleTitle: string;
    badgeNumber: string;
    phone: string;
    vehicleId: string;
    vehicleRegNo: string;
    vehicleCallsign: string;
    shiftName: string;
    districtId: string;
    districtName: string;
  };
}

export interface VehicleHealthStatus {
  vehicleId: string;
  registrationNo: string;
  fuelLevelPercent: number;
  batteryPercent: number;
  engineStatus: 'OPTIMAL' | 'CHECK_ENGINE' | 'SERVICE_DUE' | 'CRITICAL';
  tyrePressurePsi: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  oxygenCylinderBar: number;
  oxygenCylinderPercent: number;
  ventilatorStatus: 'OPERATIONAL' | 'STANDBY' | 'FAULT' | 'IN_USE';
  defibrillatorStatus: 'READY' | 'CHARGING' | 'TEST_DUE' | 'IN_USE';
  medicalKitStatus: 'COMPLETE' | 'RESTOCK_REQUIRED' | 'SEALED';
  lastServiceDate: string;
  nextMaintenanceDue: string;
  activeAlerts: string[];
}

export interface MedicalEquipmentItem {
  id: string;
  name: string;
  category: 'LIFE_SUPPORT' | 'DIAGNOSTICS' | 'AIRWAY' | 'TRAUMA' | 'MEDICATIONS';
  serialNo: string;
  status: 'CHECKED_IN' | 'CHECKED_OUT' | 'IN_USE' | 'MAINTENANCE_REQUIRED' | 'REPLACEMENT_REQUESTED';
  batteryOrLevelPercent?: number;
  lastCheckedBy: string;
  lastCheckedTimestamp: string;
  notes?: string;
}

export interface IotPatientVitals {
  incidentId: string;
  patientId: string;
  heartRate: number;
  bpSystolic: number;
  bpDiastolic: number;
  spo2: number;
  temperatureC: number;
  respRate: number;
  ecgStatus: 'NORMAL_SINUS' | 'ST_ELEVATION' | 'TACHYCARDIA' | 'BRADYCARDIA' | 'ARRHYTHMIA';
  bloodGlucoseMgDl: number;
  painScore: number;
  timestamp: string;
  deteriorationRiskScore?: number;
  aiAlert?: string;
}

export interface ParamedicPreArrivalReport {
  incidentId: string;
  patientIdentifier: string;
  patientAgeGender: string;
  chiefComplaint: string;
  vitalSignsSummary: string;
  treatmentsAdministered: string[];
  suspectedDiagnosis: string;
  requiredSpecialists: string[];
  estimatedEtaMin: number;
  assignedHospitalId: string;
  assignedHospitalName: string;
  reportGeneratedAt: string;
  submittedByParamedic: string;
}

export interface EmsAiAssistantRecommendation {
  transportRiskScore: number; // 0 - 100
  suggestedHospitalId: string;
  suggestedHospitalName: string;
  suggestedRoute: string;
  suggestedEquipment: string[];
  suggestedPreparation: string[];
  patientSummary: string;
  arrivalSummary: string;
  confidenceScore: number;
  reasoning: string;
  humanReviewRequired: boolean;
  timestamp: string;
}

export interface EmsChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientChannel: 'COMMAND' | 'HOSPITAL' | 'DOCTOR' | 'FLEET_MANAGER' | 'BROADCAST';
  message: string;
  timestamp: string;
  isEmergencyBroadcast?: boolean;
  readBy: string[];
}

export interface FleetAnalyticsMetrics {
  avgResponseTimeMin: number;
  avgTravelTimeMin: number;
  missionSuccessRatePercent: number;
  fuelUsageLitersTotal: number;
  vehicleUtilizationPercent: number;
  equipmentAvailabilityPercent: number;
  districtCoveragePercent: number;
  driverPerformanceScore: number;
  paramedicPerformanceScore: number;
  districtBreakdown: {
    districtId: string;
    districtName: string;
    totalMissions: number;
    avgResponseTime: number;
    activeFleet: number;
  }[];
}






