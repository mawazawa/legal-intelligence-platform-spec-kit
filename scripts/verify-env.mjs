#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import path from 'node:path';

const required = [
  'NEO4J_URI',
  'NEO4J_USERNAME',
  'NEO4J_PASSWORD',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'VOYAGE_API_KEY',
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('❌ Missing environment variables:\n', missing.map((m) => `- ${m}`).join('\n'));
  console.error('\nHint: copy .env.example to .env.local and fill values.');
  process.exit(1);
}

console.log('✅ All required env vars present');

