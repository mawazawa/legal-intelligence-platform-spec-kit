"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud, CheckCircle2 } from 'lucide-react'
import { safeFetch } from '@/lib/api/fetch'
import { logger } from '@/lib/logging/logger'

interface IntakeResult {
  ok: boolean;
  message?: string;
  files?: Array<{ name: string; type: string }>;
  error?: string;
}

export default function IntakePage() {
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<IntakeResult | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  function onChoose(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files || [])
    setFiles(list)
  }

  /**
   * Upload and organize intake files
   * Sends files to API for classification and exhibit assembly
   */
  async function onSubmit() {
    if (!files.length) return

    setBusy(true)
    setResult(null)
    setUploadError(null)

    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f, f.name))

      logger.debug('Uploading intake files', { count: files.length });

      const response = await fetch('/api/intake/upload', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(60000) // 60s timeout for file upload
      })

      if (!response.ok) {
        logger.warn('File intake failed', {
          status: response.status,
          statusText: response.statusText
        })
        setUploadError(`Upload failed: ${response.statusText}`)
        setResult(null)
        return
      }

      const uploadResult: IntakeResult = await response.json()

      if (uploadResult.ok) {
        logger.info('Files uploaded successfully', {
          fileCount: uploadResult.files?.length || 0
        })
      } else {
        logger.warn('Upload completed with errors', {
          error: uploadResult.error
        })
        setUploadError(uploadResult.error || 'Upload failed')
      }

      setResult(uploadResult)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      logger.error('Error uploading files', err as Error)
      setUploadError('Failed to upload files: ' + errorMsg)
      setResult(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">File Intake</h1>
      <p className="text-slate-600 mb-6">Drop all your PDFs here (RFO, FL‑320, closing statement, payoff, photos, etc.). We’ll classify, ingest, and assemble exhibits automatically.</p>

      <div className="rounded border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center mb-3">
        <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <div className="text-slate-700 mb-2">Drag and drop files here or choose files</div>
        <input type="file" accept="application/pdf" multiple className="hidden" id="filepick" onChange={onChoose} />
        <label htmlFor="filepick" className="inline-block text-sm px-3 py-1.5 rounded bg-white border border-slate-300 cursor-pointer">Choose Files</label>
        {files.length>0 && (
          <div className="mt-3 text-xs text-slate-600">{files.length} file(s) selected</div>
        )}
      </div>
      <Button disabled={!files.length || busy} onClick={onSubmit}>{busy? 'Processing…' : 'Upload & Organize'}</Button>

      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          <p className="font-semibold">Upload error</p>
          <p className="text-xs mt-1">{uploadError}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 rounded border bg-white p-4">
          {result.ok ? (
            <div className="flex items-center gap-2 text-green-700 mb-2"><CheckCircle2 className="h-4 w-4"/> Organized</div>
          ) : (
            <div className="text-red-700 mb-2">Organizer error</div>
          )}
          <pre className="text-xs whitespace-pre-wrap text-slate-700">{JSON.stringify(result, null, 2)}</pre>
          <div className="mt-3 text-sm text-slate-600">Next steps: Review <a className="underline" href="/exhibits/packet">Exhibit Packet</a>, then prepare <a className="underline" href="/fl320-checklist">FL‑320 Checklist</a> and <a className="underline" href="/rfo-comparison">RFO Comparison</a>.</div>
        </div>
      )}
    </div>
  )
}

