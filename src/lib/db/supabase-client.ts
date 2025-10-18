/**
 * Centralized Supabase Client
 * Singleton pattern to ensure single instance across the application
 * Eliminates duplicate initialization code in service files
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../logging/logger';

// Singleton instance
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get or create the Supabase client instance
 * Returns null if environment variables are not configured
 *
 * @returns SupabaseClient instance or null
 */
export function getSupabaseClient(): SupabaseClient | null {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if credentials are provided
  if (!supabaseUrl || !supabaseKey) {
    logger.warn('Supabase credentials not configured. Using mock data mode.');
    return null;
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch {
    logger.error('Invalid Supabase URL format', new Error('Invalid URL'));
    return null;
  }

  // Create and cache the instance
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    logger.info('Supabase client initialized successfully');
    return supabaseInstance;
  } catch (error) {
    logger.error('Failed to initialize Supabase client', error as Error);
    return null;
  }
}

/**
 * Reset the Supabase client instance
 * Useful for testing or when credentials change
 */
export function resetSupabaseClient(): void {
  supabaseInstance = null;
  logger.debug('Supabase client instance reset');
}

/**
 * Check if Supabase is configured
 *
 * @returns true if Supabase credentials are available
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Get Supabase client or throw error
 * Use this when Supabase is required and mock data is not acceptable
 *
 * @throws Error if Supabase is not configured
 * @returns SupabaseClient instance
 */
export function requireSupabaseClient(): SupabaseClient {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase client is required but not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }

  return client;
}

// Export default instance getter
export default getSupabaseClient;
