import { NextRequest, NextResponse } from 'next/server';
import { getIntegrityVerifier } from '@/lib/verification/integrity';
import { logger } from '@/lib/logging/logger';
import { validators } from '@/lib/validation/validator';

/**
 * Run all integrity checks on case data
 * GET /api/verification/integrity
 */
export async function GET(request: NextRequest) {
  try {
    logger.debug('Starting integrity checks');

    const verifier = getIntegrityVerifier();
    const report = await verifier.runAllChecks();

    logger.info('Integrity checks completed successfully');
    return NextResponse.json(report);

  } catch (error) {
    logger.error('Integrity check failed', error as Error);

    return NextResponse.json(
      {
        error: 'Integrity check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Generate provenance report for a specific claim
 * POST /api/verification/integrity
 * Body: { claimId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId } = body as Record<string, unknown>;

    // Validate claimId parameter
    const claimIdValidator = validators.string()
      .min(1)
      .max(255);

    const validationResult = claimIdValidator.validate(claimId);
    if (!validationResult.success) {
      logger.warn('Invalid claimId provided', {
        errors: validationResult.errors
      });
      return NextResponse.json(
        {
          error: 'Invalid claimId parameter',
          details: validationResult.errors
        },
        { status: 400 }
      );
    }

    logger.debug('Generating provenance report', {
      claimId: validationResult.data
    });

    const verifier = getIntegrityVerifier();
    const provenanceReport = await verifier.generateProvenanceReport(validationResult.data!);

    logger.info('Provenance report generated successfully', {
      claimId: validationResult.data
    });

    return NextResponse.json(provenanceReport);

  } catch (error) {
    logger.error('Provenance report generation failed', error as Error);

    return NextResponse.json(
      {
        error: 'Provenance report failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
