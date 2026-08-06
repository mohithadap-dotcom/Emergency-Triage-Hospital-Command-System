-- RAKSHAK AI MAHARASHTRA SEED DATA
-- Pre-populates State, Districts, Hospitals, Ambulances, Beds, Emergency Incidents & Doctors

-- 1. State
INSERT INTO states (id, code, name, capital, population, eoc_hq)
VALUES ('11111111-1111-1111-1111-111111111111', 'MH', 'Maharashtra', 'Mumbai', 125000000, 'State Emergency Operations Center (SEOC), Mantralaya, Mumbai')
ON CONFLICT (code) DO NOTHING;

-- 2. Districts
INSERT INTO districts (id, state_id, district_code, name, headquarters, population, latitude, longitude, total_hospitals, active_ambulances, risk_level)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MH-NAG', 'Nagpur', 'Nagpur City', 4653000, 21.1458000, 79.0882000, 14, 28, 'MODERATE'),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'MH-PUN', 'Pune', 'Pune City', 9429000, 18.5204000, 73.8567000, 22, 45, 'HIGH'),
  ('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'MH-MUM', 'Mumbai', 'Mumbai Central', 12442000, 19.0760000, 72.8777000, 35, 60, 'HIGH'),
  ('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'MH-NAS', 'Nashik', 'Nashik', 6107000, 20.0059000, 73.7898000, 12, 22, 'MODERATE'),
  ('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'MH-WAR', 'Wardha', 'Wardha', 1300000, 20.7453000, 78.6022000, 6, 12, 'LOW'),
  ('a6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'MH-AMR', 'Amravati', 'Amravati', 2888000, 20.9374000, 77.7796000, 8, 16, 'MODERATE'),
  ('a7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'MH-CHA', 'Chandrapur', 'Chandrapur', 2204000, 19.9615000, 79.2961000, 7, 14, 'MODERATE')
ON CONFLICT (district_code) DO NOTHING;

-- 3. Hospitals
INSERT INTO hospitals (id, district_id, hospital_code, name, type, trauma_level, address, latitude, longitude, emergency_phone, coordinator_name, total_beds, available_general_beds, total_icu_beds, available_icu_beds, occupied_icu_beds, total_ventilators, available_ventilators, blood_units_available, emergency_dept_status)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'HOSP-NGP-01', 'AIIMS Nagpur Apex Trauma Center', 'Government Autonomous', 'Level 1 Trauma', 'MIHAN, Nagpur, MH 441108', 21.0558, 79.0302, '+91 712 2812000', 'Dr. Rajesh Sharma', 750, 180, 80, 12, 68, 40, 8, 145, 'NORMAL'),
  ('b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'HOSP-NGP-02', 'Government Medical College Hospital (GMCH)', 'Government Tertiary', 'Level 1 Trauma', 'Medical Square, Hanuman Nagar, Nagpur', 21.1302, 79.0964, '+91 712 2744438', 'Dr. Avinash Gawande', 1400, 210, 120, 8, 112, 60, 5, 210, 'HIGH_LOAD'),
  ('b3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'HOSP-PUN-01', 'Sassoon General Hospital & BJ Medical College', 'Government Tertiary', 'Level 1 Trauma', 'Near Pune Railway Station, Pune', 18.5284, 73.8739, '+91 20 26128000', 'Dr. Sanjeev Thakur', 1290, 150, 100, 6, 94, 50, 4, 180, 'HIGH_LOAD'),
  ('b4444444-4444-4444-4444-444444444444', 'a3333333-3333-3333-3333-333333333333', 'HOSP-MUM-01', 'KEM Hospital & Seth GS Medical College', 'Municipal Corporation Tertiary', 'Level 1 Trauma', 'Parel, Mumbai', 19.0028, 72.8427, '+91 22 24107000', 'Dr. Sangeeta Rawat', 1800, 190, 150, 10, 140, 80, 9, 310, 'NORMAL')
ON CONFLICT (hospital_code) DO NOTHING;

-- 4. Ambulances
INSERT INTO ambulances (id, district_id, registration_number, call_sign, type, status, latitude, longitude, heading, speed_kmh, fuel_percent, oxygen_cylinder_bar, base_station_name, assigned_driver_name, assigned_paramedic_name)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'MH-31-EQ-9108', 'AMB-108-NAG-01', 'ALS', 'AVAILABLE', 21.1458, 79.0882, 45, 0, 92, 180, 'Nagpur Civil Hospital Base', 'Suresh Deshmukh', 'Pooja Kulkarni'),
  ('c2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'MH-31-AP-1080', 'AMB-108-NAG-02', 'ALS', 'DISPATCHED', 21.1205, 79.0512, 180, 62, 78, 165, 'MIHAN AIIMS Station', 'Ramesh Patil', 'Vikram Mane'),
  ('c3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'MH-12-PN-1081', 'AMB-108-PUN-01', 'ALS', 'ON_SCENE', 18.5204, 73.8567, 90, 0, 85, 170, 'Sassoon Station', 'Anil Jadhav', 'Deepak More')
ON CONFLICT (registration_number) DO NOTHING;

-- 5. Emergency Incidents
INSERT INTO emergency_incidents (id, incident_code, district_id, title, type, category, priority, severity, status, patient_count, symptoms, description, location_name, latitude, longitude, reported_by, reporter_phone, assigned_hospital_id, assigned_hospital_name)
VALUES
  (
    'd1111111-1111-1111-1111-111111111111',
    'INC-2026-NAG-101',
    'a1111111-1111-1111-1111-111111111111',
    'Multi-Vehicle Express Crash on Samruddhi Highway',
    'Road Accident',
    'Mass Casualty',
    'RED',
    'CRITICAL',
    'IN_TRANSIT',
    14,
    'Polytrauma, severe arterial bleeding, loss of consciousness, tension pneumothorax',
    'High speed multi-bus collision at KM 412 on Samruddhi Expressway. 14 victims impacted.',
    'Samruddhi Expressway KM 412, Nagpur',
    21.0823, 79.0112,
    'Expressway Highway Patrol',
    '+91 108 998877',
    'b1111111-1111-1111-1111-111111111111',
    'AIIMS Nagpur Apex Trauma Center'
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    'INC-2026-PUN-204',
    'a2222222-2222-2222-2222-222222222222',
    'Industrial Boiler Chemical Leakage at Chakan MIDC',
    'Chemical Leakage',
    'Industrial Disaster',
    'RED',
    'CRITICAL',
    'DISPATCHED',
    18,
    'Inhalation burns, acute respiratory failure, chemical corneal ulcers',
    'Toxic chemical gas leak in manufacturing facility floor B-12.',
    'Chakan Phase II MIDC, Pune',
    18.7601, 73.8623,
    'Factory Safety Coordinator',
    '+91 20 55443322',
    'b3333333-3333-3333-3333-333333333333',
    'Sassoon General Hospital'
  )
ON CONFLICT (incident_code) DO NOTHING;

-- 6. Beds Seed
INSERT INTO beds (id, hospital_id, bed_number, bed_type, status, current_patient_name)
VALUES
  ('e1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'ICU-BAY-01', 'ICU', 'Available', NULL),
  ('e2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'ICU-BAY-02', 'ICU', 'Occupied', 'Rohan Kulkarni'),
  ('e3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 'ICU-BAY-03', 'ICU', 'Reserved', 'Samruddhi Casualty #1')
ON CONFLICT DO NOTHING;
