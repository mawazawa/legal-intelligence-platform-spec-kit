import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Search mbox files for the query
    const mboxPath = '/Users/mathieuwauters/Downloads/Takeout/Mail';
    
    try {
      // Use grep to search through mbox files
      const { stdout } = await execAsync(
        `grep -r -i -l "${query}" "${mboxPath}"/*.mbox | head -10`
      );
      
      const files = stdout.trim().split('\n').filter(Boolean);
      
      // Extract relevant snippets from each file
      const results: string[] = [];
      
      for (const file of files.slice(0, 5)) { // Limit to 5 files
        try {
          const { stdout: snippet } = await execAsync(
            `grep -i -A 3 -B 3 "${query}" "${file}" | head -20`
          );
          
          if (snippet.trim()) {
            const fileName = file.split('/').pop()?.replace('.mbox', '') || 'Unknown';
            results.push(`${fileName}: ${snippet.trim().substring(0, 200)}...`);
          }
        } catch (error) {
          console.error(`Error searching file ${file}:`, error);
        }
      }

      return NextResponse.json({ 
        results: results.length > 0 ? results : [`No emails found containing "${query}"`],
        query,
        filesFound: files.length
      });

    } catch (grepError) {
      console.error('Grep search failed:', grepError);
      
      // Fallback to mock results
      return NextResponse.json({
        results: [
          `Mock result: Email correspondence regarding "${query}"`,
          `Mock result: Legal communication about "${query}"`,
          `Mock result: Case-related discussion of "${query}"`
        ],
        query,
        filesFound: 0,
        note: 'Using mock results - mbox search unavailable'
      });
    }

  } catch (error) {
    console.error('Email search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
