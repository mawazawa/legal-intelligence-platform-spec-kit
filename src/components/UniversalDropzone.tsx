"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

type UploadStatus = "pending" | "uploading" | "processing" | "completed" | "error";

interface UploadEntry {
  id: string;
  fileName: string;
  readableSize: string;
  status: UploadStatus;
  progress: number;
  message?: string;
  tags?: string[];
  renamedTo?: string;
}

function formatSize(size: number): string {
  if (!Number.isFinite(size)) return "—";
  if (size >= 1024 * 1024 * 1024) return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
}

function createId() {
  return Math.random().toString(36).slice(2, 11);
}

export function UniversalDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState<UploadEntry[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const updateEntry = useCallback((id: string, patch: Partial<UploadEntry>) => {
    setQueue(prev => prev.map(entry => (entry.id === id ? { ...entry, ...patch } : entry)));
  }, []);

  const handleUploads = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    files.forEach(file => {
      const id = createId();
      setQueue(prev => [
        {
          id,
          fileName: file.name,
          readableSize: formatSize(file.size),
          status: "pending",
          progress: 0,
        },
        ...prev,
      ]);
      uploadFile(id, file, updateEntry);
    });
  }, [updateEntry]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer?.files?.length) {
      handleUploads(event.dataTransfer.files);
    }
  }, [handleUploads]);

  const pendingCount = useMemo(() => queue.filter(entry => entry.status !== "completed" && entry.status !== "error").length, [queue]);

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragLeave={onDragLeave}
      >
        {isDragging && (
          <div className="pointer-events-auto fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
            <div className="rounded-3xl border-2 border-dashed border-sky-200 bg-white/90 px-12 py-10 text-center shadow-2xl">
              <p className="text-xl font-semibold text-slate-900">Drop anywhere to ingest</p>
              <p className="text-sm text-slate-500 mt-2">Universal intake accepts any legal document, media, audio, or email archive.</p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-[130] w-80 max-w-[92vw] rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <p className="font-semibold text-slate-900">Universal Intake</p>
            <p className="text-xs text-slate-500">Drag & drop or click to ingest. No limits.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-sky-700"
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </button>
        </div>

        <div className="px-4 py-3">
          <div
            className="relative flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-sky-300 hover:bg-sky-50"
            onClick={() => inputRef.current?.click()}
          >
            <p className="text-sm font-medium text-slate-700">Drop files anywhere or click here</p>
            <p className="text-xs text-slate-500">Audio, video, PDFs, Word, email archives — everything goes in.</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={event => {
                if (event.target.files?.length) {
                  handleUploads(event.target.files);
                  event.target.value = "";
                }
              }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
            {queue.length === 0 ? (
              <p className="text-xs text-slate-400">
                Intake queue is empty. Drop something in to kick off the ingestion pipeline.
              </p>
            ) : (
              queue.map(entry => (
                <div key={entry.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 text-left">
                      <p className="truncate text-sm font-medium text-slate-900">{entry.fileName}</p>
                      <p className="text-[11px] text-slate-500">{entry.readableSize}</p>
                    </div>
                    <span className={statusBadgeClass(entry.status)}>{statusLabel(entry.status)}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-[width]"
                      style={{ width: `${Math.max(entry.progress, entry.status === "completed" ? 100 : entry.progress)}%` }}
                    />
                  </div>
                  {entry.message && <p className="mt-1 text-[11px] text-slate-500">{entry.message}</p>}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {entry.tags.map(tag => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-[2px] text-[10px] font-medium text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {pendingCount > 0 && (
            <p className="mt-3 text-[11px] text-slate-500">
              Processing {pendingCount} item{pendingCount > 1 ? "s" : ""} in the background. You can keep working.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function uploadFile(id: string, file: File, updateEntry: (id: string, patch: Partial<UploadEntry>) => void) {
  const formData = new FormData();
  formData.append("file", file);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/uploads/universal");

  xhr.upload.onprogress = event => {
    if (!event.lengthComputable) return;
    const progress = Math.min(99, Math.round((event.loaded / event.total) * 100));
    updateEntry(id, { status: "uploading", progress });
  };

  xhr.onloadstart = () => {
    updateEntry(id, { status: "uploading", progress: 2, message: "Uploading…" });
  };

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          const payload = JSON.parse(xhr.responseText ?? "{}");
          updateEntry(id, {
            status: "completed",
            progress: 100,
            message: payload?.summary ?? "Filed, renamed, and classified.",
            tags: payload?.tags ?? [],
            renamedTo: payload?.storedFileName,
          });
        } else {
          updateEntry(id, {
            status: "error",
            message: xhr.responseText || "Upload failed",
          });
        }
      } catch (error) {
        updateEntry(id, {
          status: "error",
          message: error instanceof Error ? error.message : "Unexpected error",
        });
      }
    }
  };

  xhr.onerror = () => {
    updateEntry(id, {
      status: "error",
      message: "Network error — please retry.",
    });
  };

  xhr.send(formData);
}

function statusBadgeClass(status: UploadStatus) {
  switch (status) {
    case "completed":
      return "rounded-full bg-emerald-100 px-2 py-[2px] text-[11px] font-semibold text-emerald-700";
    case "error":
      return "rounded-full bg-rose-100 px-2 py-[2px] text-[11px] font-semibold text-rose-700";
    case "uploading":
    case "processing":
      return "rounded-full bg-sky-100 px-2 py-[2px] text-[11px] font-semibold text-sky-700";
    default:
      return "rounded-full bg-slate-100 px-2 py-[2px] text-[11px] font-semibold text-slate-600";
  }
}

function statusLabel(status: UploadStatus) {
  switch (status) {
    case "completed":
      return "Filed";
    case "error":
      return "Error";
    case "processing":
      return "Processing";
    case "uploading":
      return "Uploading";
    default:
      return "Queued";
  }
}
