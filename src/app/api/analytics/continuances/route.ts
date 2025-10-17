import { NextRequest, NextResponse } from 'next/server';
import { getNeo4jClient } from '@/lib/neo4j';

export async function GET(request: NextRequest) {
  const neo4jClient = getNeo4jClient();

  try {
    await neo4jClient.connect();

    // Query all continuances from Neo4j
    const continuances = await neo4jClient.executeQuery<{
      externalId: string;
      date: string;
      reason: string;
      requestedBy: string;
      durationDays: number | null;
      sourcePath: string;
      snippet: string;
      description: string;
    }>(`
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

    const stats = {
      totalContinuances,
      totalDelayDays,
      byActor,
      byReason,
      timeline
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching continuance analytics:', error);

    // Return error response
    return NextResponse.json(
      {
        error: 'Failed to fetch continuance analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );

  } finally {
    await neo4jClient.disconnect();
  }
}
