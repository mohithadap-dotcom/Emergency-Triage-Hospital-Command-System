import { supabase } from './supabase';
import {
  Incident,
  Hospital,
  District,
} from '../types';
import {
  MOCK_DISTRICTS,
  MOCK_HOSPITALS,
  MOCK_INCIDENTS,
} from '../data/mockData';

// DB Service helper to execute queries against Supabase
export const dbService = {
  // Fetch Districts
  async getDistricts(): Promise<District[]> {
    try {
      const { data, error } = await supabase.from('districts').select('*');
      if (error || !data || data.length === 0) {
        return MOCK_DISTRICTS;
      }
      return data.map((d: any, index: number) => {
        const base = MOCK_DISTRICTS[index % MOCK_DISTRICTS.length] || MOCK_DISTRICTS[0];
        return {
          ...base,
          id: d.district_code ? d.district_code.toLowerCase().replace('mh-', '') : d.id,
          code: d.district_code,
          name: d.name,
          headquarters: d.headquarters || d.name,
          population: d.population || 1000000,
          riskLevel: d.risk_level || base.riskLevel,
        };
      });
    } catch {
      return MOCK_DISTRICTS;
    }
  },

  // Fetch Hospitals
  async getHospitals(districtId?: string): Promise<Hospital[]> {
    try {
      let query = supabase.from('hospitals').select('*');
      if (districtId && districtId !== 'all') {
        query = query.eq('district_id', districtId);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return districtId && districtId !== 'all'
          ? MOCK_HOSPITALS.filter((h) => h.districtId === districtId)
          : MOCK_HOSPITALS;
      }
      return data.map((h: any, index: number) => {
        const base = MOCK_HOSPITALS[index % MOCK_HOSPITALS.length] || MOCK_HOSPITALS[0];
        return {
          ...base,
          id: h.id,
          code: h.hospital_code,
          name: h.name,
          districtId: h.district_id,
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
          emergencyPhone: h.emergency_phone,
          emergencyCoordinatorName: h.coordinator_name,
          latitude: Number(h.latitude),
          longitude: Number(h.longitude),
          operationalStatus: h.operational_status,
        };
      });
    } catch {
      return MOCK_HOSPITALS;
    }
  },

  // Fetch Emergency Incidents
  async getIncidents(): Promise<Incident[]> {
    try {
      const { data, error } = await supabase.from('emergency_incidents').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return MOCK_INCIDENTS;
      }
      return data.map((i: any, index: number) => {
        const base = MOCK_INCIDENTS[index % MOCK_INCIDENTS.length] || MOCK_INCIDENTS[0];
        return {
          ...base,
          id: i.id,
          code: i.incident_code,
          title: i.title,
          districtId: i.district_id,
          locationName: i.location_name,
          type: i.type,
          category: i.category,
          priority: i.priority,
          severity: i.severity,
          status: i.status,
          affectedCount: i.patient_count,
          patientCount: i.patient_count,
          symptoms: i.symptoms,
          description: i.description,
          reportedBy: i.reported_by,
          reporterPhone: i.reporter_phone,
          assignedHospitalId: i.assigned_hospital_id,
          assignedHospitalName: i.assigned_hospital_name,
          coordinates: { lat: Number(i.latitude), lng: Number(i.longitude) },
          aiTriage: i.ai_triage_assessment || base.aiTriage,
          timeline: i.timeline || base.timeline,
          notes: i.description || base.notes,
        };
      });
    } catch {
      return MOCK_INCIDENTS;
    }
  },

  // Create Emergency Incident in Supabase
  async createIncident(incidentData: Partial<Incident>): Promise<Incident | null> {
    try {
      const incidentCode = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const base = MOCK_INCIDENTS[0];
      const newRow = {
        incident_code: incidentCode,
        title: incidentData.title || 'New Emergency Incident',
        type: incidentData.type || 'Road Accident',
        category: incidentData.category || 'General Emergency',
        priority: incidentData.priority || 'YELLOW',
        severity: incidentData.severity || 'MODERATE',
        status: 'AI_TRIAGED',
        patient_count: incidentData.patientCount || 1,
        symptoms: incidentData.symptoms || '',
        description: incidentData.description || '',
        location_name: incidentData.locationName || 'Location HQ',
        latitude: incidentData.coordinates?.lat || 21.1458,
        longitude: incidentData.coordinates?.lng || 79.0882,
        reported_by: incidentData.reportedBy || '108 Dispatch',
        reporter_phone: incidentData.reporterPhone || '+91 108 000 0000',
        ai_triage_assessment: incidentData.aiTriage,
        timeline: incidentData.timeline || [],
      };

      const { data, error } = await supabase.from('emergency_incidents').insert([newRow]).select().single();
      if (error || !data) return null;

      return {
        ...base,
        id: data.id,
        code: data.incident_code,
        title: data.title,
        districtId: data.district_id || 'nagpur',
        districtName: 'Nagpur',
        locationName: data.location_name,
        type: data.type,
        category: data.category,
        priority: data.priority,
        severity: data.severity,
        status: data.status,
        affectedCount: data.patient_count,
        patientCount: data.patient_count,
        reportedBy: data.reported_by,
        reporterPhone: data.reporter_phone,
        coordinates: { lat: Number(data.latitude), lng: Number(data.longitude) },
        aiTriage: data.ai_triage_assessment || base.aiTriage,
        timeline: data.timeline || base.timeline,
        notes: data.description || 'New emergency logged',
      };
    } catch {
      return null;
    }
  },

  // Realtime subscription setup
  subscribeToIncidents(callback: (payload: any) => void) {
    return supabase
      .channel('realtime_incidents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_incidents' }, callback)
      .subscribe();
  },

  subscribeToBeds(callback: (payload: any) => void) {
    return supabase
      .channel('realtime_beds')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beds' }, callback)
      .subscribe();
  },

  subscribeToAmbulances(callback: (payload: any) => void) {
    return supabase
      .channel('realtime_ambulances')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ambulances' }, callback)
      .subscribe();
  },
};
