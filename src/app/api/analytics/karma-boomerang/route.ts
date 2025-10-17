import { NextRequest, NextResponse } from 'next/server';
import { getNeo4jClient } from '@/lib/neo4j';
import { KarmaBoomerangAnalyzer } from '@/lib/analytics/karma-boomerang';

export async function GET(request: NextRequest) {
  const neo4jClient = getNeo4jClient();
  const analyzer = new KarmaBoomerangAnalyzer(neo4jClient);

  try {
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

    return NextResponse.json({
      success: true,
      data: {
        analyses,
        summary,
        courtAnalysis
      }
    });

  } catch (error) {
    console.error('Error in karma boomerang analysis:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze opponent behavior',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );

  } finally {
    await neo4jClient.disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mboxPath, analysisType } = body;

    if (!mboxPath) {
      return NextResponse.json(
        { success: false, error: 'mboxPath is required' },
        { status: 400 }
      );
    }

    const neo4jClient = getNeo4jClient();
    const analyzer = new KarmaBoomerangAnalyzer(neo4jClient);

    await neo4jClient.connect();

    // Run specific analysis based on type
    let result;
    switch (analysisType) {
      case 'continuances':
        result = await analyzer.analyzeOpponentBehavior();
        break;
      case 'cooperation':
        result = await analyzer.analyzeOpponentBehavior();
        break;
      case 'financial':
        result = await analyzer.analyzeOpponentBehavior();
        break;
      default:
        result = await analyzer.analyzeOpponentBehavior();
    }

    return NextResponse.json({
      success: true,
      data: result,
      analysisType
    });

  } catch (error) {
    console.error('Error in karma boomerang POST analysis:', error);

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
