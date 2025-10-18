import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logging/logger';
import { getNeo4jClient } from '@/lib/neo4j';
import { KarmaBoomerangAnalyzer } from '@/lib/analytics/karma-boomerang';

/**
 * Get karma boomerang analysis
 * GET /api/analytics/karma-boomerang
 */
export async function GET(request: NextRequest) {
  const neo4jClient = getNeo4jClient();
  const analyzer = new KarmaBoomerangAnalyzer(neo4jClient);

  try {
    logger.debug('Starting karma boomerang analysis');
    await neo4jClient.connect();

    // Analyze opponent behavior using karma boomerang method
    const analyses = await analyzer.analyzeOpponentBehavior();

    // Generate court-ready analysis
    const courtAnalysis = await analyzer.generateCourtAnalysis();

    // Calculate summary statistics
    const summary = {
      totalAnalyses: analyses.length,
      totalDelays: analyses.reduce((sum, a) => sum + a.totalDelays, 0),
      totalDelayDays: analyses.reduce((sum, a) => sum + a.totalDelayDays, 0),
      avgCooperationScore: analyses.reduce((sum, a) => sum + a.cooperationScore, 0) / analyses.length,
      totalContradictions: analyses.reduce((sum, a) => sum + a.contradictionCount, 0),
      totalFinancialInconsistencies: analyses.reduce((sum, a) => sum + a.financialInconsistencies, 0),
      courtReadyReport: courtAnalysis
    };

    logger.info('Karma boomerang analysis completed', {
      analysisCount: analyses.length,
      totalDelays: summary.totalDelays
    });

    return NextResponse.json({
      success: true,
      data: {
        analyses,
        summary,
        courtAnalysis
      }
    });

  } catch (error) {
    logger.error('Error in karma boomerang analysis', error as Error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze opponent behavior',
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

/**
 * Run custom karma boomerang analysis
 * POST /api/analytics/karma-boomerang
 * Body: { mboxPath: string, analysisType?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mboxPath, analysisType } = body as Record<string, unknown>;

    if (!mboxPath) {
      logger.warn('Karma boomerang POST request missing mboxPath');
      return NextResponse.json(
        { success: false, error: 'mboxPath is required' },
        { status: 400 }
      );
    }

    logger.debug('Running karma boomerang analysis', {
      mboxPath,
      analysisType
    });

    const neo4jClient = getNeo4jClient();
    const analyzer = new KarmaBoomerangAnalyzer(neo4jClient);

    await neo4jClient.connect();

    // Run specific analysis based on type
    let result;
    switch (analysisType) {
      case 'continuances':
        logger.debug('Analyzing continuances');
        result = await analyzer.analyzeOpponentBehavior();
        break;
      case 'cooperation':
        logger.debug('Analyzing cooperation scores');
        result = await analyzer.analyzeOpponentBehavior();
        break;
      case 'financial':
        logger.debug('Analyzing financial inconsistencies');
        result = await analyzer.analyzeOpponentBehavior();
        break;
      default:
        logger.debug('Running default analysis');
        result = await analyzer.analyzeOpponentBehavior();
    }

    logger.info('Karma boomerang analysis completed', {
      analysisType: analysisType || 'default'
    });

    return NextResponse.json({
      success: true,
      data: result,
      analysisType
    });

  } catch (error) {
    logger.error('Error in karma boomerang analysis', error as Error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run karma boomerang analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
