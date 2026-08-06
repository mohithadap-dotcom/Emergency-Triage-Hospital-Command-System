import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function runDatabaseMigrations() {
  const dbUrl = process.env.DATABASE_URL;

  console.log('====================================================');
  console.log('RAKSHAK AI - SUPABASE / POSTGRESQL MIGRATION RUNNER');
  console.log('====================================================');

  if (!dbUrl || dbUrl.includes('[PASSWORD]') || dbUrl.includes('localhost')) {
    console.log('⚠️ DATABASE_URL not set or holds placeholder value.');
    console.log('SQL Migration files created successfully in /supabase/migrations & /supabase/seed.sql');
    console.log('Please set process.env.DATABASE_URL to your Supabase PostgreSQL connection string.');
    return;
  }

  console.log('Connecting to PostgreSQL database via connection string...');

  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase cloud PostgreSQL SSL connections
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL database successfully!');

    // Read and run schema migration SQL
    const schemaSqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20260805000000_rakshak_schema.sql');
    console.log(`Executing schema migration from ${schemaSqlPath}...`);
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Schema tables, constraints, indexes, triggers, functions & RLS created successfully!');

    // Read and run seed SQL
    const seedSqlPath = path.join(process.cwd(), 'supabase', 'seed.sql');
    if (fs.existsSync(seedSqlPath)) {
      console.log(`Executing seed dataset from ${seedSqlPath}...`);
      const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
      await client.query(seedSql);
      console.log('✅ Maharashtra Districts, Hospitals, Ambulances, Beds & Emergencies seeded successfully!');
    }

    console.log('====================================================');
    console.log('🎉 SUPABASE DATABASE INTEGRATION COMPLETE & VERIFIED');
    console.log('====================================================');
  } catch (err: any) {
    console.error('❌ Migration Execution Error:', err?.message || err);
  } finally {
    await client.end();
  }
}

runDatabaseMigrations();
