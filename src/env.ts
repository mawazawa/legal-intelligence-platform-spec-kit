// Simple environment variable access without validation
// Following KISS principle - only validate what's actually needed

export const env = {
  NEO4J_URI: process.env.NEO4J_URI || 'bolt://localhost:7687',
  NEO4J_USERNAME: process.env.NEO4J_USERNAME || 'neo4j',
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || 'password',
  NEO4J_DATABASE: process.env.NEO4J_DATABASE || 'neo4j',

  VOYAGE_API_KEY: process.env.VOYAGE_API_KEY || '',
  VOYAGE_MODEL: process.env.VOYAGE_MODEL || 'voyage-3-large',

  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',

  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
};

