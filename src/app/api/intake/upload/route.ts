import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { logger } from '@/lib/logging/logger'
import { validators } from '@/lib/validation/validator'

export const runtime = 'nodejs'

interface OrganizerResult {
  ok: boolean;
  inbox?: string;
  organizer?: Record<string, unknown>;
  files?: Array<{ name: string; size: number }>;
  error?: string;
  stderr?: string;
  code?: number;
}

/**
 * Upload and organize intake files
 * POST /api/intake/upload
 * Accepts multipart form data with 'files' field
 */
export async function POST(req: NextRequest): Promise<NextResponse<OrganizerResult>> {
  try {
    const data = await req.formData()
    const files = data.getAll('files') as File[]

    // Validate files
    if (!files?.length) {
      logger.warn('Upload request with no files')
      return NextResponse.json(
        { ok: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    logger.debug('Processing file upload', { fileCount: files.length })

    // Validate file count (max 50 files)
    if (files.length > 50) {
      logger.warn('Upload exceeds file limit', { fileCount: files.length })
      return NextResponse.json(
        { ok: false, error: 'Too many files. Maximum 50 files allowed.' },
        { status: 400 }
      )
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const inboxRel = path.join('intake', 'inbox', stamp)
    const inboxAbs = path.resolve(process.cwd(), '..', inboxRel)

    try {
      await fs.mkdir(inboxAbs, { recursive: true })
      logger.debug('Created intake directory', { path: inboxAbs })
    } catch (mkdirError) {
      logger.error('Failed to create intake directory', mkdirError as Error, { path: inboxAbs })
      return NextResponse.json(
        { ok: false, error: 'Failed to create upload directory' },
        { status: 500 }
      )
    }

    const uploadedFiles: Array<{ name: string; size: number }> = []

    // Write files to disk
    for (const f of files) {
      try {
        const arrayBuf = await f.arrayBuffer()
        const buf = Buffer.from(arrayBuf)
        const safe = f.name.replace(/[^A-Za-z0-9._-]+/g, '_') || 'upload.pdf'
        const filePath = path.join(inboxAbs, safe)

        await fs.writeFile(filePath, buf)
        uploadedFiles.push({ name: safe, size: buf.length })
        logger.debug('Wrote file', { name: safe, size: buf.length })
      } catch (writeError) {
        logger.warn('Failed to write file', {
          fileName: f.name,
          error: writeError instanceof Error ? writeError.message : String(writeError)
        })
      }
    }

    if (uploadedFiles.length === 0) {
      logger.warn('No files were successfully written')
      return NextResponse.json(
        { ok: false, error: 'Failed to write any files' },
        { status: 500 }
      )
    }

    // Run organizer synchronously for now (YAGNI); capture output
    const script = path.resolve(process.cwd(), '..', 'tools', 'intake', 'organize.py')
    logger.debug('Running file organizer', { script, inbox: inboxRel })

    const proc = spawnSync('python3', [script, '--inbox', inboxRel], {
      cwd: path.resolve(process.cwd(), '..'),
      encoding: 'utf-8',
      env: process.env,
      timeout: 1000 * 60 * 5, // 5 minute timeout
    })

    if (proc.error) {
      logger.error('Organizer spawn error', proc.error as Error, { stderr: proc.stderr })
      return NextResponse.json(
        { ok: false, error: 'Failed to run file organizer', stderr: proc.stderr },
        { status: 500 }
      )
    }

    if (proc.status !== 0) {
      logger.warn('Organizer failed', {
        status: proc.status,
        stderr: proc.stderr,
        inbox: inboxRel
      })
      return NextResponse.json(
        {
          ok: false,
          error: 'File organizer failed',
          code: proc.status,
          stderr: proc.stderr
        } as OrganizerResult,
        { status: 500 }
      )
    }

    let organizerOutput: Record<string, unknown> = {}
    try {
      organizerOutput = JSON.parse(proc.stdout || '{}') as Record<string, unknown>
      logger.debug('Parsed organizer output', { keys: Object.keys(organizerOutput) })
    } catch (parseError) {
      logger.warn('Failed to parse organizer output', {
        error: parseError instanceof Error ? parseError.message : String(parseError)
      })
      // Continue with empty output
    }

    logger.info('File upload completed successfully', {
      filesUploaded: uploadedFiles.length,
      inbox: inboxRel
    })

    return NextResponse.json({
      ok: true,
      inbox: inboxRel,
      files: uploadedFiles,
      organizer: organizerOutput
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    logger.error('File upload API error', error as Error)
    return NextResponse.json(
      { ok: false, error: errorMsg },
      { status: 500 }
    )
  }
}

