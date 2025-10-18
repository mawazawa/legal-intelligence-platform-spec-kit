import path from "node:path";

export type FileCategory = "audio" | "video" | "document" | "email" | "spreadsheet" | "archive" | "image" | "text" | "unknown";

export interface FileClassification {
  category: FileCategory;
  extension: string;
  mimeType?: string;
  tags: string[];
}

const CATEGORY_MAP: Record<string, FileCategory> = {
  ".mp3": "audio",
  ".wav": "audio",
  ".m4a": "audio",
  ".flac": "audio",
  ".ogg": "audio",
  ".mp4": "video",
  ".mov": "video",
  ".mkv": "video",
  ".avi": "video",
  ".pdf": "document",
  ".doc": "document",
  ".docx": "document",
  ".odt": "document",
  ".rtf": "document",
  ".txt": "text",
  ".md": "text",
  ".csv": "spreadsheet",
  ".xls": "spreadsheet",
  ".xlsx": "spreadsheet",
  ".mbox": "email",
  ".eml": "email",
  ".pst": "email",
  ".json": "text",
  ".zip": "archive",
  ".tar": "archive",
  ".gz": "archive",
  ".7z": "archive",
  ".png": "image",
  ".jpg": "image",
  ".jpeg": "image",
  ".heic": "image",
};

const CATEGORY_TAGS: Record<FileCategory, string[]> = {
  audio: ["audio", "media"],
  video: ["video", "media"],
  document: ["document", "legal"],
  email: ["communication", "email"],
  spreadsheet: ["financial", "spreadsheet"],
  archive: ["archive"],
  image: ["image"],
  text: ["text"],
  unknown: ["unclassified"],
};

export function classifyFile(originalName: string, mimeType?: string): FileClassification {
  const extension = path.extname(originalName).toLowerCase();
  const category = CATEGORY_MAP[extension] ?? guessCategoryFromMime(mimeType) ?? "unknown";

  const tags = new Set<string>(CATEGORY_TAGS[category]);

  if (extension === ".pdf") tags.add("pdf");
  if (extension === ".docx" || extension === ".doc") tags.add("word");
  if (extension === ".mbox" || extension === ".eml") tags.add("evidence-email");
  if (extension === ".mp3" || extension === ".wav") tags.add("transcribe");

  if (mimeType?.includes("calendar")) {
    tags.add("calendar");
  }

  return {
    category,
    extension,
    mimeType,
    tags: Array.from(tags),
  };
}

function guessCategoryFromMime(mime?: string): FileCategory | undefined {
  if (!mime) return undefined;
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "document";
  if (mime.includes("word") || mime.includes("officedocument")) return "document";
  if (mime.includes("excel") || mime.includes("sheet")) return "spreadsheet";
  if (mime.includes("zip") || mime.includes("compressed")) return "archive";
  if (mime.includes("json") || mime.includes("text")) return "text";
  if (mime.includes("mbox") || mime.includes("message")) return "email";
  return undefined;
}

export function generateSafeFileName(baseName: string, extension: string) {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 15);
  const slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "file";
  return `${timestamp}_${slug}${extension}`;
}
