import { NextResponse } from "next/server";
import { logger } from "@/lib/logging/logger";
import { validators } from "@/lib/validation/validator";
import { processUniversalUpload } from "@/lib/uploads/UniversalUploadService";

export const runtime = "nodejs";

interface UniversalUploadResponse {
  success: boolean;
  fileName?: string;
  accountId?: string;
  size?: number;
  error?: string;
  [key: string]: unknown;
}

/**
 * Universal file upload endpoint
 * POST /api/uploads/universal
 * Accepts multipart form data with 'file' and optional 'accountId'
 */
export async function POST(request: Request): Promise<NextResponse<UniversalUploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    // Validate file
    if (!(file instanceof File)) {
      logger.warn("Upload request missing file payload");
      return NextResponse.json(
        { success: false, error: "File payload is required" },
        { status: 400 }
      );
    }

    // Validate account ID (optional, defaults to "respondent")
    const rawAccountId = (formData.get("accountId") as string) || "respondent";
    const accountIdValidator = validators.string().min(1).max(100);
    const accountIdValidation = accountIdValidator.validate(rawAccountId);

    if (!accountIdValidation.success) {
      logger.warn("Invalid accountId provided", { errors: accountIdValidation.errors });
      return NextResponse.json(
        { success: false, error: "Invalid account ID" },
        { status: 400 }
      );
    }

    const accountId = accountIdValidation.data!;

    logger.debug("Processing universal upload", {
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      accountId
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await processUniversalUpload({
      accountId,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      buffer,
    });

    logger.info("Universal upload completed successfully", {
      fileName: file.name,
      accountId,
      size: file.size
    });

    return NextResponse.json({ success: true, ...result } as UniversalUploadResponse);
  } catch (error) {
    logger.error("Universal upload error", error as Error);
    return NextResponse.json(
      { success: false, error: "Failed to ingest file" },
      { status: 500 }
    );
  }
}
