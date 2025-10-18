import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Get case financial source documents
 * Handles requests for petitioner RFO, declaration, etc.
 *
 * Performance: Mock data for now to prevent 404 errors
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const file = searchParams.get('file');

  // Quick response to prevent slow 404s
  if (!file) {
    return NextResponse.json(
      { error: 'Missing file parameter' },
      { status: 400 }
    );
  }

  // Mock data for development
  const mockSources: Record<string, { content: string; type: string }> = {
    petitioner_rfo: {
      type: 'text/plain',
      content: 'Petitioner RFO - Mock data for development',
    },
    petitioner_declaration: {
      type: 'text/plain',
      content: 'Petitioner Declaration - Mock data for development',
    },
  };

  const source = mockSources[file];

  if (!source) {
    return NextResponse.json(
      { error: `Source file '${file}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    file,
    content: source.content,
    type: source.type,
  });
}
