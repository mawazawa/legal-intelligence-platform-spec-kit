import { NextRequest, NextResponse } from 'next/server';
import { getNeo4jClient } from '@/lib/neo4j';
import { logger } from '@/lib/logging/logger';

interface ContinuanceData {
  externalId: string;
  date: string;
  reason: string;
  requestedBy: string;
  durationDays: number | null;
  sourcePath: string;
  snippet: string;
  description: string;
}

interface ContinuanceStats {
  totalContinuances: number;
  totalDelayDays: number;
  byActor: Record<string, number>;
  byReason: Record<string, number>;
  timeline: Array<{
    id: string;
    date: string;
    actor: string;
    reason?: string;
    durationDays: number | null;
    description: string;
    source: string;
    snippet: string;
  }>;
}

/**
 * Get continuance analytics from Neo4j
 * GET /api/analytics/continuances
 */
export async function GET(request: NextRequest) {
  const neo4jClient = getNeo4jClient();

  try {
    logger.debug('Fetching continuance analytics from Neo4j');
    await neo4jClient.connect();

    // Query all continuances from Neo4j
    const continuances = await neo4jClient.executeQuery<ContinuanceData>(`
      MATCH (c:Continuance)
      RETURN c.externalId as externalId,
             c.date as date,
             c.reason as reason,
             c.requestedBy as requestedBy,
             c.durationDays as durationDays,
             c.sourcePath as sourcePath,
             c.snippet as snippet,
             c.description as description
      ORDER BY c.date DESC
    `);

    logger.debug('Queried continuances from Neo4j', { count: continuances.length });

    // Calculate statistics from the data
    const totalContinuances = continuances.length;
    const totalDelayDays = continuances.reduce(
      (sum, c) => sum + (c.durationDays || 0),
      0
    );

    // Group by actor/requestor
    const byActor: Record<string, number> = {};
    continuances.forEach(c => {
      const actor = c.requestedBy || 'unknown';
      byActor[actor] = (byActor[actor] || 0) + 1;
    });

    // Group by reason
    const byReason: Record<string, number> = {};
    continuances.forEach(c => {
      const reason = c.reason || 'Unknown';
      byReason[reason] = (byReason[reason] || 0) + 1;
    });

    // Format timeline events for the UI
    const timeline = continuances.map((c, idx) => ({
      id: c.externalId || `cont-${idx}`,
      date: c.date,
      actor: c.requestedBy || 'other',
      reason: c.reason,
      durationDays: c.durationDays,
      description: c.description || `Continuance requested by ${c.requestedBy}`,
      source: c.sourcePath || 'Unknown',
      snippet: c.snippet || ''
    }));

    const stats: ContinuanceStats = {
      totalContinuances,
      totalDelayDays,
      byActor,
      byReason,
      timeline
    };

    logger.info('Continuance analytics computed', {
      totalContinuances,
      totalDelayDays,
      actorCount: Object.keys(byActor).length,
      reasonCount: Object.keys(byReason).length
    });

    return NextResponse.json(stats);

  } catch (error) {
    logger.error('Error fetching continuance analytics', error as Error);

    // Return error response
    return NextResponse.json(
      {
        error: 'Failed to fetch continuance analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );

  } finally {
    try {
      await neo4jClient.disconnect();
      logger.debug('Disconnected from Neo4j');
    } catch (disconnectError) {
      logger.warn('Error disconnecting from Neo4j', {
        error: disconnectError instanceof Error ? disconnectError.message : String(disconnectError)
      });
    }
  }
}
