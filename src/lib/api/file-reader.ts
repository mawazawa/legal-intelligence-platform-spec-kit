import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

type ContentType = 'application/json' | 'text/markdown' | 'text/plain'

/**
 * Read a file from the case-financials results directory
 *
 * DRY utility to consolidate duplicate file-reading API routes
 * Follows SOLID (Single Responsibility) and KISS principles
 *
 * @param filename - Name of file in case-financials/results/
 * @param contentType - MIME type for response headers
 * @returns NextResponse with file contents or error
 */
export async function readCaseFile(
  filename: string,
  contentType: ContentType = 'application/json'
): Promise<NextResponse> {
  try {
    const filePath = path.resolve(
      process.cwd(),
      '..',
      'case-financials',
      'results',
      filename
    )

    const content = await fs.readFile(filePath, 'utf8')

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': `${contentType}; charset=utf-8`,
        'Cache-Control': 'public, max-age=3600, must-revalidate' // 1 hour cache
      }
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'File not found'
    return NextResponse.json({
      error: message,
      filename
    }, {
      status: 404
    })
  }
}
