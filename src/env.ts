import { z } from 'zod';

const serverSchema = z.object({
  NEO4J_URI: z.string().url(),
  NEO4J_USERNAME: z.string(),
  NEO4J_PASSWORD: z.string(),
  NEO4J_DATABASE: z.string().default('neo4j').optional(),

  VOYAGE_API_KEY: z.string(),
  VOYAGE_MODEL: z.string().optional(),

  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});

export const env = serverSchema.parse(process.env);

