import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '@/lib/logging/logger';
import { validators } from '@/lib/validation/validator';
import { AppError } from '@/lib/errors/AppError';

const execAsync = promisify(exec);

/**
 * Search emails for query string
 * GET /api/search/emails?q={query}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Validate query parameter
    const queryValidator = validators.string()
      .min(1)
      .max(100);

    const validationResult = queryValidator.validate(query);
    if (!validationResult.success) {
      logger.warn('Invalid search query', { errors: validationResult.errors });
      return NextResponse.json(
        { error: 'Invalid query parameter', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Search mbox files for the query
    const mboxPath = '/Users/mathieuwauters/Downloads/Takeout/Mail';
    logger.debug('Starting email search', { query: validationResult.data, path: mboxPath });

    try {
      // Use grep to search through mbox files
      const { stdout } = await execAsync(
        `grep -r -i -l "${validationResult.data}" "${mboxPath}"/*.mbox | head -10`
      );

      const files = stdout.trim().split('\n').filter(Boolean);
      logger.debug('Found mbox files', { fileCount: files.length });

      // Extract relevant snippets from each file
      const results: string[] = [];

      for (const file of files.slice(0, 5)) { // Limit to 5 files
        try {
          const { stdout: snippet } = await execAsync(
            `grep -i -A 3 -B 3 "${validationResult.data}" "${file}" | head -20`
          );

          if (snippet.trim()) {
            const fileName = file.split('/').pop()?.replace('.mbox', '') || 'Unknown';
            results.push(`${fileName}: ${snippet.trim().substring(0, 200)}...`);
          }
        } catch (error) {
          logger.warn('Error searching file', {
            file,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      const responseData = {
        results: results.length > 0 ? results : [`No emails found containing "${validationResult.data}"`],
        query: validationResult.data,
        filesFound: files.length
      };

      logger.info('Email search completed', {
        query: validationResult.data,
        resultCount: results.length,
        filesSearched: files.length
      });

      return NextResponse.json(responseData);

    } catch (grepError) {
      logger.warn('Grep search failed', {
        query: validationResult.data,
        error: grepError instanceof Error ? grepError.message : String(grepError)
      });

      // Fallback to mock results
      const mockResponse = {
        results: [
          `Mock result: Email correspondence regarding "${validationResult.data}"`,
          `Mock result: Legal communication about "${validationResult.data}"`,
          `Mock result: Case-related discussion of "${validationResult.data}"`
        ],
        query: validationResult.data,
        filesFound: 0,
        note: 'Using mock results - mbox search unavailable'
      };

      logger.info('Email search using mock results', { query: validationResult.data });
      return NextResponse.json(mockResponse);
    }

  } catch (error) {
    logger.error('Email search API error', error as Error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
