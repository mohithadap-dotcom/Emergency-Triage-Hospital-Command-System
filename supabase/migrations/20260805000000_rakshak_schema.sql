-- RAKSHAK AI PRODUCTION POSTGRESQL SCHEMA MIGRATION
-- Enables UUIDs, normalized tables, constraints, foreign keys, indexes, triggers, stored functions & RLS policies

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. LOCATION & JURISDICTIONS
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  capital VARCHAR(100),
  population BIGINT,
  eoc_hq VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id) ON DELETE CASCADE,
  district_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  headquarters VARCHAR(100),
  population INT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  total_hospitals INT DEFAULT 0,
  active_ambulances INT DEFAULT 0,
  risk_level VARCHAR(20) DEFAULT 'MODERATE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS emergency_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
  zone_code VARCHAR(30) UNIQUE NOT NULL,
  zone_name VARCHAR(100) NOT NULL,
  severity_level VARCHAR(20) DEFAULT 'NORMAL',
  boundaries JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTHENTICATION, USERS & RBAC
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID, -- Links to supabase auth.users if used
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  role_code VARCHAR(50) NOT NULL,
  district_id UUID REFERENCES districts(id),
  hospital_id UUID, -- FK added after hospital table creation
  vehicle_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100),
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HOSPITALS, NETWORKS & FACILITIES
CREATE TABLE IF NOT EXISTS hospital_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_name VARCHAR(150) UNIQUE NOT NULL,
  type VARCHAR(50) DEFAULT 'GOVERNMENT',
  hq_location VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES districts(id) ON DELETE RESTRICT,
  network_id UUID REFERENCES hospital_networks(id) ON DELETE SET NULL,
  hospital_code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) DEFAULT 'Government Tertiary',
  trauma_level VARCHAR(30) DEFAULT 'Level 1 Trauma',
  address TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  emergency_phone VARCHAR(20),
  coordinator_name VARCHAR(100),
  total_beds INT DEFAULT 100,
  available_general_beds INT DEFAULT 50,
  total_icu_beds INT DEFAULT 20,
  available_icu_beds INT DEFAULT 5,
  occupied_icu_beds INT DEFAULT 15,
  total_ventilators INT DEFAULT 10,
  available_ventilators INT DEFAULT 2,
  blood_units_available INT DEFAULT 50,
  emergency_dept_status VARCHAR(30) DEFAULT 'NORMAL',
  operational_status VARCHAR(30) DEFAULT 'OPERATIONAL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Now add foreign key from users to hospitals
ALTER TABLE users ADD CONSTRAINT fk_user_hospital FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  dept_code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  head_doctor_name VARCHAR(100),
  contact_number VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  building_name VARCHAR(100) NOT NULL,
  building_code VARCHAR(30),
  floors_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS floors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  floor_number INT NOT NULL,
  floor_name VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_id UUID REFERENCES floors(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  room_number VARCHAR(30) NOT NULL,
  room_type VARCHAR(50) DEFAULT 'General Ward',
  capacity INT DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  bed_number VARCHAR(30) NOT NULL,
  bed_type VARCHAR(50) DEFAULT 'ICU',
  status VARCHAR(30) DEFAULT 'Available',
  current_patient_name VARCHAR(150),
  current_patient_id VARCHAR(100),
  reserved_for_emergency_id VARCHAR(100),
  reserved_by_officer VARCHAR(100),
  reservation_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS icu_beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_id UUID UNIQUE REFERENCES beds(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  has_ventilator BOOLEAN DEFAULT TRUE,
  has_ecg_monitor BOOLEAN DEFAULT TRUE,
  isolation_type VARCHAR(50) DEFAULT 'Negative Pressure',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ventilators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  model_name VARCHAR(100),
  bed_id UUID REFERENCES beds(id) ON DELETE SET NULL,
  status VARCHAR(30) DEFAULT 'AVAILABLE',
  battery_level_percent INT DEFAULT 100,
  oxygen_pressure_bar NUMERIC(5,2) DEFAULT 4.2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  equipment_code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity_total INT DEFAULT 10,
  quantity_available INT DEFAULT 8,
  condition_status VARCHAR(30) DEFAULT 'OPTIMAL',
  last_serviced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEDICAL STAFF & SHIFTS
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  doctor_code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  qualification VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  is_on_duty BOOLEAN DEFAULT TRUE,
  available_for_emergency BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nurses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  qualification VARCHAR(100),
  phone VARCHAR(20),
  shift_type VARCHAR(30) DEFAULT 'DAY',
  is_on_duty BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_type VARCHAR(30) NOT NULL, -- DOCTOR, NURSE, PARAMEDIC, DRIVER
  staff_id UUID NOT NULL,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  shift_start TIMESTAMPTZ NOT NULL,
  shift_end TIMESTAMPTZ NOT NULL,
  status VARCHAR(30) DEFAULT 'SCHEDULED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AMBULANCE SERVICES & FLEET
CREATE TABLE IF NOT EXISTS ambulances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES districts(id) ON DELETE RESTRICT,
  registration_number VARCHAR(30) UNIQUE NOT NULL,
  call_sign VARCHAR(50) NOT NULL,
  type VARCHAR(30) DEFAULT 'ALS',
  status VARCHAR(30) DEFAULT 'AVAILABLE',
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  heading INT DEFAULT 0,
  speed_kmh NUMERIC(5,2) DEFAULT 0,
  fuel_percent INT DEFAULT 95,
  oxygen_cylinder_bar INT DEFAULT 180,
  base_station_name VARCHAR(150),
  assigned_driver_name VARCHAR(100),
  assigned_paramedic_name VARCHAR(100),
  current_mission_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FK for users vehicle_id
ALTER TABLE users ADD CONSTRAINT fk_user_vehicle FOREIGN KEY (vehicle_id) REFERENCES ambulances(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
  ambulance_id UUID REFERENCES ambulances(id) ON DELETE SET NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  badge_id VARCHAR(30),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS paramedics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
  ambulance_id UUID REFERENCES ambulances(id) ON DELETE SET NULL,
  certification_level VARCHAR(50) DEFAULT 'ALS Specialist',
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambulance_id UUID REFERENCES ambulances(id) ON DELETE CASCADE,
  engine_status VARCHAR(30) DEFAULT 'OPTIMAL',
  battery_percent INT DEFAULT 98,
  fuel_level_percent INT DEFAULT 90,
  tyre_pressure_psi JSONB DEFAULT '{"frontLeft":35,"frontRight":35,"rearLeft":36,"rearRight":36}'::jsonb,
  ventilator_status VARCHAR(30) DEFAULT 'OPERATIONAL',
  defibrillator_status VARCHAR(30) DEFAULT 'READY_CHARGED',
  last_service_date DATE,
  next_maintenance_due DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_equipment_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambulance_id UUID REFERENCES ambulances(id) ON DELETE CASCADE,
  item_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity_available INT DEFAULT 1,
  unit VARCHAR(20) DEFAULT 'pcs',
  expiration_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EMERGENCY OPERATIONS & DISPATCH
CREATE TABLE IF NOT EXISTS emergency_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_code VARCHAR(50) UNIQUE NOT NULL,
  district_id UUID REFERENCES districts(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL,
  category VARCHAR(50) DEFAULT 'General Emergency',
  priority VARCHAR(20) DEFAULT 'YELLOW',
  severity VARCHAR(20) DEFAULT 'MODERATE',
  status VARCHAR(30) DEFAULT 'AI_TRIAGED',
  patient_count INT DEFAULT 1,
  age_group VARCHAR(50),
  gender VARCHAR(20),
  symptoms TEXT,
  description TEXT,
  location_name VARCHAR(200) NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  reported_by VARCHAR(100),
  reporter_phone VARCHAR(20),
  assigned_hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  assigned_hospital_name VARCHAR(200),
  assigned_ambulance_id UUID REFERENCES ambulances(id) ON DELETE SET NULL,
  estimated_response_time_min INT,
  ai_triage_assessment JSONB,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS victims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES emergency_incidents(id) ON DELETE CASCADE,
  victim_code VARCHAR(30) UNIQUE NOT NULL,
  triage_color VARCHAR(20) DEFAULT 'YELLOW',
  age INT,
  gender VARCHAR(20),
  chief_complaint TEXT,
  vitals JSONB,
  assigned_hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  status VARCHAR(30) DEFAULT 'TRIAGED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  patient_code VARCHAR(30) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  medical_history TEXT,
  allergies TEXT,
  emergency_contact VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospital_acceptance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES emergency_incidents(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  accepted_by VARCHAR(100) NOT NULL,
  response_status VARCHAR(30) DEFAULT 'ACCEPTED',
  assigned_bed_id UUID REFERENCES beds(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospital_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_code VARCHAR(50) UNIQUE NOT NULL,
  incident_id UUID REFERENCES emergency_incidents(id) ON DELETE SET NULL,
  source_hospital_id UUID REFERENCES hospitals(id) ON DELETE RESTRICT,
  destination_hospital_id UUID REFERENCES hospitals(id) ON DELETE RESTRICT,
  patient_name VARCHAR(150) NOT NULL,
  patient_condition TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'RED',
  status VARCHAR(30) DEFAULT 'PENDING',
  requested_by VARCHAR(100) NOT NULL,
  receiving_doctor VARCHAR(100),
  transfer_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transfer_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID REFERENCES hospital_transfers(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  notes TEXT,
  actor VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bed_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_id VARCHAR(100) NOT NULL,
  emergency_code VARCHAR(50),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  bed_id UUID REFERENCES beds(id) ON DELETE CASCADE,
  bed_number VARCHAR(30) NOT NULL,
  department VARCHAR(100),
  bed_type VARCHAR(50) DEFAULT 'ICU',
  patient_name VARCHAR(150) NOT NULL,
  reserved_by_officer VARCHAR(100) NOT NULL,
  attending_doctor_notified VARCHAR(100),
  status VARCHAR(30) DEFAULT 'RESERVED',
  reserved_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ventilator_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  ventilator_id UUID REFERENCES ventilators(id) ON DELETE CASCADE,
  reserved_for_patient VARCHAR(150) NOT NULL,
  reserved_by_doctor VARCHAR(100) NOT NULL,
  status VARCHAR(30) DEFAULT 'RESERVED',
  reserved_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 7. INVENTORY & RESOURCES
CREATE TABLE IF NOT EXISTS blood_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  blood_group VARCHAR(10) NOT NULL,
  units_available INT DEFAULT 0,
  units_reserved INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oxygen_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  liquid_oxygen_kilo_liters NUMERIC(8,2) DEFAULT 10.0,
  cylinders_count_d_type INT DEFAULT 50,
  cylinders_count_b_type INT DEFAULT 30,
  refill_status VARCHAR(30) DEFAULT 'ADEQUATE',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medicine_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  medicine_name VARCHAR(150) NOT NULL,
  stock_quantity INT DEFAULT 100,
  unit VARCHAR(30) DEFAULT 'vials',
  critical_threshold INT DEFAULT 20,
  expiration_date DATE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requesting_hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  providing_hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  resource_type VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  unit VARCHAR(30) DEFAULT 'units',
  priority VARCHAR(20) DEFAULT 'HIGH',
  status VARCHAR(30) DEFAULT 'PENDING',
  approved_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI PREDICTIONS, RECOMMENDATIONS & CLUSTERS
CREATE TABLE IF NOT EXISTS ai_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- HOSPITAL, DISTRICT, AMBULANCE
  entity_id VARCHAR(100) NOT NULL,
  model_name VARCHAR(100) DEFAULT 'gemini-3.6-flash',
  prediction_type VARCHAR(50) NOT NULL,
  prediction_score NUMERIC(5,2),
  details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disease_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
  disease_name VARCHAR(100) NOT NULL,
  cluster_type VARCHAR(50) DEFAULT 'SURGE_WARNING',
  affected_cases_count INT DEFAULT 12,
  risk_level VARCHAR(20) DEFAULT 'HIGH',
  recommended_containment TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. IOT & TELEMETRY
CREATE TABLE IF NOT EXISTS patient_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(100) NOT NULL,
  ambulance_id UUID REFERENCES ambulances(id) ON DELETE CASCADE,
  heart_rate_bpm INT,
  spo2_percent INT,
  blood_pressure_sys INT,
  blood_pressure_dia INT,
  respiratory_rate INT,
  temperature_cels NUMERIC(4,1),
  ecg_waveform_preview TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS iot_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(100) NOT NULL,
  ambulance_id UUID REFERENCES ambulances(id) ON DELETE CASCADE,
  telemetry_type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. COMMUNICATIONS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_role VARCHAR(50),
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'ALERT',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_name VARCHAR(100) NOT NULL,
  recipient_role VARCHAR(50),
  district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DISASTER MANAGEMENT
CREATE TABLE IF NOT EXISTS disaster_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  disaster_type VARCHAR(50) NOT NULL,
  severity_level VARCHAR(20) DEFAULT 'RED_ALERT',
  district_id UUID REFERENCES districts(id) ON DELETE RESTRICT,
  location_name VARCHAR(200) NOT NULL,
  affected_population INT DEFAULT 0,
  casualties_estimated INT DEFAULT 0,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS simulation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_name VARCHAR(150) NOT NULL,
  scenario_type VARCHAR(50) NOT NULL,
  parameters JSONB NOT NULL,
  results JSONB,
  run_by VARCHAR(100),
  run_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_incidents_district ON emergency_incidents(district_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON emergency_incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON emergency_incidents(priority);
CREATE INDEX IF NOT EXISTS idx_hospitals_district ON hospitals(district_id);
CREATE INDEX IF NOT EXISTS idx_beds_hospital ON beds(hospital_id);
CREATE INDEX IF NOT EXISTS idx_beds_status ON beds(status);
CREATE INDEX IF NOT EXISTS idx_ambulances_district ON ambulances(district_id);
CREATE INDEX IF NOT EXISTS idx_ambulances_status ON ambulances(status);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON hospital_transfers(status);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON bed_reservations(status);

-- STORED FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION reserve_icu_bed(
  p_hospital_id UUID,
  p_bed_id UUID,
  p_patient_name VARCHAR,
  p_officer_name VARCHAR,
  p_emergency_code VARCHAR
) RETURNS JSONB AS $$
DECLARE
  v_bed_status VARCHAR;
  v_result JSONB;
BEGIN
  SELECT status INTO v_bed_status FROM beds WHERE id = p_bed_id FOR UPDATE;
  
  IF v_bed_status = 'Occupied' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Bed is already occupied!');
  END IF;

  UPDATE beds 
  SET status = 'Reserved', current_patient_name = p_patient_name, reserved_by_officer = p_officer_name, updated_at = NOW()
  WHERE id = p_bed_id;

  UPDATE hospitals
  SET available_icu_beds = GREATEST(0, available_icu_beds - 1),
      occupied_icu_beds = occupied_icu_beds + 1,
      updated_at = NOW()
  WHERE id = p_hospital_id;

  RETURN jsonb_build_object('success', true, 'message', 'Bed successfully reserved');
END;
$$ LANGUAGE plpgsql;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulances ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active emergency datasets for portal users
DROP POLICY IF EXISTS "Public read access to emergency_incidents" ON emergency_incidents;
CREATE POLICY "Public read access to emergency_incidents" ON emergency_incidents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public update to emergency_incidents" ON emergency_incidents;
CREATE POLICY "Public update to emergency_incidents" ON emergency_incidents FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access to hospitals" ON hospitals;
CREATE POLICY "Public access to hospitals" ON hospitals FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access to beds" ON beds;
CREATE POLICY "Public access to beds" ON beds FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access to ambulances" ON ambulances;
CREATE POLICY "Public access to ambulances" ON ambulances FOR ALL USING (true);

-- REALTIME PUBLICATION ENABLEMENT
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE emergency_incidents, hospitals, beds, ambulances, hospital_transfers, notifications;
