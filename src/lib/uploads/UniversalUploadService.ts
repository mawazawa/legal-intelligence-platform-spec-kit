import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { classifyFile, generateSafeFileName } from "@/lib/utils/file-metadata";

export interface UploadContext {
  accountId: string;
  originalName: string;
  mimeType?: string;
  size: number;
  buffer: Buffer;
}

export interface UploadResult {
  storedFileName: string;
  storedPath: string;
  detectedCategory: string;
  tags: string[];
  summary: string;
}

const ROOT_UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

async function ensureDirectory(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

function baseNameWithoutExt(fileName: string) {
  return path.basename(fileName, path.extname(fileName));
}

export async function processUniversalUpload(context: UploadContext): Promise<UploadResult> {
  const { accountId, originalName, mimeType, size, buffer } = context;

  const classification = classifyFile(originalName, mimeType);
  const baseName = baseNameWithoutExt(originalName);
  const safeName = generateSafeFileName(`${accountId}-${baseName}`, classification.extension || path.extname(originalName));

  const today = new Date();
  const year = today.getFullYear().toString();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");

  const destinationDir = path.join(ROOT_UPLOAD_DIR, accountId, year, month, classification.category);
  await ensureDirectory(destinationDir);

  const destinationPath = path.join(destinationDir, safeName);
  await fs.writeFile(destinationPath, buffer);

  await writeAuditLog({
    accountId,
    originalName,
    storedFileName: safeName,
    storedPath: destinationPath,
    mimeType,
    size,
    category: classification.category,
    tags: classification.tags,
  });

  return {
    storedFileName: safeName,
    storedPath: destinationPath,
    detectedCategory: classification.category,
    tags: classification.tags,
    summary: buildSummaryLine(classification.category, size, safeName),
  };
}

async function writeAuditLog(entry: Record<string, unknown>) {
  const logDir = path.join(ROOT_UPLOAD_DIR, "_audit");
  await ensureDirectory(logDir);
  const logPath = path.join(logDir, `${new Date().toISOString().slice(0, 10)}.log`);
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    host: os.hostname(),
    ...entry,
  });
  await fs.appendFile(logPath, line + os.EOL, "utf8");
}

function buildSummaryLine(category: string, size: number, safeName: string) {
  const readableSize = size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${(size / 1024).toFixed(1)} KB`;
  return `Stored ${category} asset (${readableSize}) as ${safeName}`;
}
