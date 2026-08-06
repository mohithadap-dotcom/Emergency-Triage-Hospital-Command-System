import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function runComprehensiveSeed() {
  const dbUrl = process.env.DATABASE_URL;

  console.log('====================================================');
  console.log('RAKSHAK AI - COMPREHENSIVE SUPABASE MAHARASHTRA SEED');
  console.log('====================================================');

  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL database!');

    await client.query('BEGIN');

    // Clean existing seed tables cleanly
    console.log('Clearing existing tables...');
    await client.query(`
      TRUNCATE TABLE 
        emergency_incidents, 
        disaster_events, 
        ai_predictions, 
        notifications, 
        blood_inventory, 
        oxygen_inventory, 
        ambulances, 
        drivers, 
        paramedics, 
        doctors, 
        nurses, 
        beds, 
        icu_beds, 
        ventilators, 
        rooms, 
        floors, 
        buildings, 
        departments, 
        hospitals, 
        emergency_zones, 
        districts, 
        states 
      CASCADE;
    `);

    // 1. STATES
    console.log('1/8 Seeding States...');
    await client.query(`
      INSERT INTO states (id, code, name, capital, population, eoc_hq)
      VALUES ('11111111-1111-1111-1111-111111111111', 'MH', 'Maharashtra', 'Mumbai', 125000000, 'State Emergency Operations Center (SEOC), Mantralaya, Mumbai');
    `);

    // 2. DISTRICTS
    console.log('2/8 Seeding Districts...');
    await client.query(`
      INSERT INTO districts (id, state_id, district_code, name, headquarters, population, latitude, longitude, total_hospitals, active_ambulances, risk_level)
      VALUES
        ('22222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MH-NAG', 'Nagpur', 'Nagpur City', 4653000, 21.1458000, 79.0882000, 14, 28, 'HIGH'),
        ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'MH-PUN', 'Pune', 'Pune City', 9429000, 18.5204000, 73.8567000, 22, 45, 'CRITICAL'),
        ('22222222-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'MH-MUM', 'Mumbai', 'Mumbai Central', 12442000, 19.0760000, 72.8777000, 35, 60, 'HIGH'),
        ('22222222-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'MH-NAS', 'Nashik', 'Nashik', 6107000, 20.0059000, 73.7898000, 12, 22, 'MODERATE'),
        ('22222222-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'MH-WAR', 'Wardha', 'Wardha', 1300000, 20.7453000, 78.6022000, 6, 12, 'LOW'),
        ('22222222-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'MH-AMR', 'Amravati', 'Amravati', 2888000, 20.9374000, 77.7796000, 8, 16, 'MODERATE'),
        ('22222222-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'MH-CHA', 'Chandrapur', 'Chandrapur', 2204000, 19.9615000, 79.2961000, 7, 14, 'MODERATE');
    `);

    // 3. EMERGENCY ZONES
    console.log('3/8 Seeding Emergency Zones...');
    await client.query(`
      INSERT INTO emergency_zones (id, district_id, zone_code, zone_name, severity_level)
      VALUES
        ('33333333-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'ZONE-NGP-EAST', 'Nagpur East Industrial Belt', 'HIGH'),
        ('33333333-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'ZONE-PUN-CHAKAN', 'Chakan Industrial MIDC Corridor', 'CRITICAL'),
        ('33333333-3333-3333-3333-333333333333', '22222222-3333-3333-3333-333333333333', 'ZONE-MUM-DOCK', 'Mumbai South Dockyard Zone', 'MODERATE');
    `);

    // 4. HOSPITALS
    console.log('4/8 Seeding Hospitals...');
    await client.query(`
      INSERT INTO hospitals (id, district_id, hospital_code, name, type, trauma_level, address, latitude, longitude, emergency_phone, coordinator_name, total_beds, available_general_beds, total_icu_beds, available_icu_beds, occupied_icu_beds, total_ventilators, available_ventilators, blood_units_available, emergency_dept_status)
      VALUES
        ('44444444-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'HOSP-NGP-01', 'AIIMS Nagpur Apex Trauma Center', 'Government Autonomous', 'Level 1 Trauma', 'MIHAN, Nagpur, MH 441108', 21.0558, 79.0302, '+91 712 2812000', 'Dr. Rajesh Sharma', 750, 180, 80, 12, 68, 40, 8, 145, 'NORMAL'),
        ('44444444-2222-2222-2222-222222222222', '22222222-1111-1111-1111-111111111111', 'HOSP-NGP-02', 'Government Medical College Hospital (GMCH)', 'Government Tertiary', 'Level 1 Trauma', 'Medical Square, Hanuman Nagar, Nagpur', 21.1302, 79.0964, '+91 712 2744438', 'Dr. Avinash Gawande', 1400, 210, 120, 8, 112, 60, 5, 210, 'HIGH_LOAD'),
        ('44444444-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'HOSP-PUN-01', 'Sassoon General Hospital & BJ Medical College', 'Government Tertiary', 'Level 1 Trauma', 'Near Pune Railway Station, Pune', 18.5284, 73.8739, '+91 20 26128000', 'Dr. Sanjeev Thakur', 1290, 150, 100, 6, 94, 50, 4, 180, 'CRITICAL'),
        ('44444444-4444-4444-4444-444444444444', '22222222-3333-3333-3333-333333333333', 'HOSP-MUM-01', 'KEM Hospital & Seth GS Medical College', 'Municipal Corporation Tertiary', 'Level 1 Trauma', 'Parel, Mumbai', 19.0028, 72.8427, '+91 22 24107000', 'Dr. Sangeeta Rawat', 1800, 190, 150, 10, 140, 80, 9, 310, 'NORMAL'),
        ('44444444-5555-5555-5555-555555555555', '22222222-4444-4444-4444-444444444444', 'HOSP-NAS-01', 'Nashik Civil District Hospital', 'Government District', 'Level 2 Trauma', 'Trimbak Road, Nashik', 20.0002, 73.7801, '+91 253 2570001', 'Dr. Ashok Pawar', 600, 120, 45, 9, 36, 25, 6, 95, 'NORMAL');
    `);

    // 5. DEPARTMENTS, BUILDINGS, FLOORS, ROOMS & BEDS
    console.log('5/8 Seeding Hospital Infrastructure...');
    await client.query(`
      INSERT INTO departments (id, hospital_id, dept_code, name, head_doctor_name)
      VALUES
        ('55555555-1111-1111-1111-111111111111', '44444444-1111-1111-1111-111111111111', 'DEPT-TRAUMA', 'Emergency Trauma Surgery', 'Dr. Rajesh Sharma'),
        ('55555555-2222-2222-2222-222222222222', '44444444-1111-1111-1111-111111111111', 'DEPT-ICU', 'Critical Care & Pulmonology', 'Dr. Sunita Deshmukh'),
        ('55555555-3333-3333-3333-333333333333', '44444444-3333-3333-3333-333333333333', 'DEPT-BURN', 'Burns & Toxicology Unit', 'Dr. Sanjeev Thakur');

      INSERT INTO buildings (id, hospital_id, building_name, building_code, floors_count)
      VALUES
        ('66666666-1111-1111-1111-111111111111', '44444444-1111-1111-1111-111111111111', 'Apex Trauma Tower A', 'BLDG-A', 6),
        ('66666666-2222-2222-2222-222222222222', '44444444-3333-3333-3333-333333333333', 'Sassoon Emergency Block', 'SEB', 4);

      INSERT INTO floors (id, building_id, floor_number, floor_name)
      VALUES
        ('77777777-1111-1111-1111-111111111111', '66666666-1111-1111-1111-111111111111', 1, 'Ground Emergency Resuscitation'),
        ('77777777-2222-2222-2222-222222222222', '66666666-1111-1111-1111-111111111111', 2, 'Level 2 Cardiac ICU');

      INSERT INTO rooms (id, floor_id, department_id, room_number, room_type, capacity)
      VALUES
        ('88888888-1111-1111-1111-111111111111', '77777777-1111-1111-1111-111111111111', '55555555-1111-1111-1111-111111111111', 'ER-BAY-101', 'Resuscitation Room', 4),
        ('88888888-2222-2222-2222-222222222222', '77777777-2222-2222-2222-222222222222', '55555555-2222-2222-2222-222222222222', 'ICU-ROOM-201', 'Critical Care Unit', 10);

      INSERT INTO beds (id, hospital_id, department_id, room_id, bed_number, bed_type, status, current_patient_name)
      VALUES
        ('99999999-1111-1111-1111-111111111111', '44444444-1111-1111-1111-111111111111', '55555555-1111-1111-1111-111111111111', '88888888-1111-1111-1111-111111111111', 'ICU-BAY-01', 'ICU', 'Available', NULL),
        ('99999999-2222-2222-2222-222222222222', '44444444-1111-1111-1111-111111111111', '55555555-1111-1111-1111-111111111111', '88888888-1111-1111-1111-111111111111', 'ICU-BAY-02', 'ICU', 'Occupied', 'Rohan Kulkarni'),
        ('99999999-3333-3333-3333-333333333333', '44444444-1111-1111-1111-111111111111', '55555555-2222-2222-2222-222222222222', '88888888-2222-2222-2222-222222222222', 'ICU-BAY-03', 'ICU', 'Reserved', 'Samruddhi Expressway Casualty #1'),
        ('99999999-4444-4444-4444-444444444444', '44444444-3333-3333-3333-333333333333', '55555555-3333-3333-3333-333333333333', NULL, 'SASSOON-ICU-08', 'ICU', 'Available', NULL);

      INSERT INTO icu_beds (id, bed_id, hospital_id, has_ventilator, has_ecg_monitor)
      VALUES
        ('aaaaaaaa-1111-1111-1111-111111111111', '99999999-1111-1111-1111-111111111111', '44444444-1111-1111-1111-111111111111', TRUE, TRUE),
        ('aaaaaaaa-2222-2222-2222-222222222222', '99999999-2222-2222-2222-222222222222', '44444444-1111-1111-1111-111111111111', TRUE, TRUE);

      INSERT INTO ventilators (id, hospital_id, serial_number, model_name, status)
      VALUES
        ('bbbbbbbb-1111-1111-1111-111111111111', '44444444-1111-1111-1111-111111111111', 'VENT-AIIMS-01', 'Hamilton-C6 Medical', 'AVAILABLE'),
        ('bbbbbbbb-2222-2222-2222-222222222222', '44444444-1111-1111-1111-111111111111', 'VENT-AIIMS-02', 'Draeger Evita V800', 'IN_USE'),
        ('bbbbbbbb-3333-3333-3333-333333333333', '44444444-3333-3333-3333-333333333333', 'VENT-SASS-01', 'Mindray SV300', 'AVAILABLE');
    `);

    // 6. DOCTORS, NURSES, STAFF & AMBULANCES
    console.log('6/8 Seeding Medical Personnel & Ambulance Fleet...');
    await client.query(`
      INSERT INTO doctors (id, hospital_id, doctor_code, name, specialty, qualification, phone, email, is_on_duty)
      VALUES
        ('cccccccc-1111-1111-1111-111111111111', '44444444-1111-1111-1111-111111111111', 'DOC-AIIMS-101', 'Dr. Rajesh Sharma', 'Emergency Surgery & Trauma', 'MS, MCh Trauma', '+91 98220 11223', 'r.sharma@aiimsnagpur.edu.in', TRUE),
        ('cccccccc-2222-2222-2222-222222222222', '44444444-1111-1111-1111-111111111111', 'DOC-AIIMS-102', 'Dr. Sunita Deshmukh', 'Critical Care & Pulmonology', 'MD Critical Care', '+91 98220 44556', 's.deshmukh@aiimsnagpur.edu.in', TRUE),
        ('cccccccc-3333-3333-3333-333333333333', '44444444-3333-3333-3333-333333333333', 'DOC-SASS-201', 'Dr. Sanjeev Thakur', 'Toxicology & Internal Medicine', 'MD Medicine', '+91 98230 77889', 's.thakur@sassoon.gov.in', TRUE);

      INSERT INTO nurses (id, hospital_id, name, qualification, phone, shift_type, is_on_duty)
      VALUES
        ('dddddddd-1111-1111-1111-111111111111', '44444444-1111-1111-1111-111111111111', 'Sister Rekha Patil', 'B.Sc Nursing (ICU Specialist)', '+91 94221 00112', 'DAY', TRUE),
        ('dddddddd-2222-2222-2222-222222222222', '44444444-3333-3333-3333-333333333333', 'Sister Anjali Jadhav', 'General Nursing & Midwifery', '+91 94221 33445', 'DAY', TRUE);

      INSERT INTO ambulances (id, district_id, registration_number, call_sign, type, status, latitude, longitude, heading, speed_kmh, fuel_percent, oxygen_cylinder_bar, base_station_name, assigned_driver_name, assigned_paramedic_name)
      VALUES
        ('eeeeeeee-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'MH-31-EQ-9108', 'AMB-108-NAG-01', 'ALS', 'AVAILABLE', 21.1458, 79.0882, 45, 0, 92, 180, 'Nagpur Civil Hospital Base', 'Suresh Deshmukh', 'Pooja Kulkarni'),
        ('eeeeeeee-2222-2222-2222-222222222222', '22222222-1111-1111-1111-111111111111', 'MH-31-AP-1080', 'AMB-108-NAG-02', 'ALS', 'DISPATCHED', 21.1205, 79.0512, 180, 62, 78, 165, 'MIHAN AIIMS Station', 'Ramesh Patil', 'Vikram Mane'),
        ('eeeeeeee-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'MH-12-PN-1081', 'AMB-108-PUN-01', 'ALS', 'ON_SCENE', 18.5204, 73.8567, 90, 0, 85, 170, 'Sassoon Station', 'Anil Jadhav', 'Deepak More');

      INSERT INTO drivers (id, district_id, ambulance_id, license_number, name, phone, badge_id)
      VALUES
        ('ffffffff-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'eeeeeeee-1111-1111-1111-111111111111', 'MH-31-2019-009911', 'Suresh Deshmukh', '+91 97660 11008', '108-BADGE-9108'),
        ('ffffffff-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'eeeeeeee-3333-3333-3333-333333333333', 'MH-12-2018-004455', 'Anil Jadhav', '+91 97660 22008', '108-BADGE-1081');

      INSERT INTO paramedics (id, district_id, ambulance_id, certification_level, name, phone)
      VALUES
        ('00000000-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'eeeeeeee-1111-1111-1111-111111111111', 'ALS Emergency Specialist', 'Pooja Kulkarni', '+91 98900 11223'),
        ('00000000-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'eeeeeeee-3333-3333-3333-333333333333', 'Trauma & Cardiac Care Paramedic', 'Deepak More', '+91 98900 44556');
    `);

    // 7. EMERGENCY INCIDENTS & DISASTER EVENTS
    console.log('7/8 Seeding Incidents, Disasters, AI Predictions & Alerts...');
    await client.query(`
      INSERT INTO emergency_incidents (id, incident_code, district_id, title, type, category, priority, severity, status, patient_count, symptoms, description, location_name, latitude, longitude, reported_by, reporter_phone, assigned_hospital_id, assigned_hospital_name)
      VALUES
        (
          '10101010-1111-1111-1111-111111111111',
          'INC-2026-NAG-101',
          '22222222-1111-1111-1111-111111111111',
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
          '44444444-1111-1111-1111-111111111111',
          'AIIMS Nagpur Apex Trauma Center'
        ),
        (
          '10101010-2222-2222-2222-222222222222',
          'INC-2026-PUN-204',
          '22222222-2222-2222-2222-222222222222',
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
          '44444444-3333-3333-3333-333333333333',
          'Sassoon General Hospital'
        );

      INSERT INTO disaster_events (id, event_code, title, disaster_type, severity_level, district_id, location_name, affected_population, casualties_estimated, status, summary)
      VALUES
        ('20202020-1111-1111-1111-111111111111', 'DIS-2026-MH-01', 'Musi Basin Urban Flash Flood Warning', 'Urban Flood', 'RED_ALERT', '22222222-2222-2222-2222-222222222222', 'Mula-Mutha River Basin, Pune', 45000, 120, 'ACTIVE', 'Continuous heavy cloudburst creating flash inundation across low lying city sectors.');

      INSERT INTO ai_predictions (id, entity_type, entity_id, model_name, prediction_type, prediction_score, details)
      VALUES
        ('30303030-1111-1111-1111-111111111111', 'DISTRICT', '22222222-1111-1111-1111-111111111111', 'gemini-3.6-flash', 'SURGE_PREDICTION', 94.5, '{"predictedCases24h": 42, "criticalIcuDemand": 8, "recommendedAction": "Pre-stage 4 ALS Ambulances at Hingna Junction"}');

      INSERT INTO notifications (id, target_role, title, body, type)
      VALUES
        ('40404040-1111-1111-1111-111111111111', 'GOVERNMENT_DISPATCHER', 'CRITICAL RED INCIDENT LOGGED', 'Samruddhi Highway accident require instant ICU bed reservation at AIIMS Nagpur.', 'ALERT');
    `);

    // 8. BLOOD & OXYGEN INVENTORY
    console.log('8/8 Seeding Blood & Oxygen Inventory...');
    await client.query(`
      INSERT INTO blood_inventory (hospital_id, blood_group, units_available)
      VALUES
        ('44444444-1111-1111-1111-111111111111', 'O_NEGATIVE', 24),
        ('44444444-1111-1111-1111-111111111111', 'A_POSITIVE', 48),
        ('44444444-3333-3333-3333-333333333333', 'O_NEGATIVE', 12);

      INSERT INTO oxygen_inventory (hospital_id, liquid_oxygen_kilo_liters, cylinders_count_d_type, refill_status)
      VALUES
        ('44444444-1111-1111-1111-111111111111', 14.5, 80, 'ADEQUATE'),
        ('44444444-3333-3333-3333-333333333333', 8.2, 45, 'REFILL_REQUESTED');
    `);

    await client.query('COMMIT');
    console.log('====================================================');
    console.log('🎉 ALL MAHARASHTRA DATABASE TABLES SEEDED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ SEEDING ERROR:', err?.message || err);
  } finally {
    await client.end();
  }
}

runComprehensiveSeed();
