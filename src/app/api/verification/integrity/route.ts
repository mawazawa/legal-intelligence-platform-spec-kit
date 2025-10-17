import { NextRequest, NextResponse } from 'next/server';
import { getIntegrityVerifier } from '@/lib/verification/integrity';

export async function GET(request: NextRequest) {
  try {
    const verifier = getIntegrityVerifier();
    const report = await verifier.runAllChecks();
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Integrity check failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Integrity check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId } = body;
    
    if (!claimId) {
      return NextResponse.json(
        { error: 'claimId is required' },
        { status: 400 }
      );
    }
    
    const verifier = getIntegrityVerifier();
    const provenanceReport = await verifier.generateProvenanceReport(claimId);
    
    return NextResponse.json(provenanceReport);
  } catch (error) {
    console.error('Provenance report failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Provenance report failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
