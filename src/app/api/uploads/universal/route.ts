import { NextResponse } from "next/server";
import { processUniversalUpload } from "@/lib/uploads/UniversalUploadService";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File payload is required" }, { status: 400 });
  }

  const accountId = (formData.get("accountId") as string) || "respondent";

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await processUniversalUpload({
      accountId,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      buffer,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Universal upload error", error);
    return NextResponse.json({ error: "Failed to ingest file" }, { status: 500 });
  }
}
