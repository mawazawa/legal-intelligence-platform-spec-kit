export function splitPages(text?: string): string[] {
  if (!text) return []
  const parts = text.split(/\n--- Page \d+ ---\n/g).map(s=>s.trim()).filter(Boolean)
  if (parts.length) return parts
  // Fallback: chunk approximately by characters to avoid huge single page
  const sz = 1800
  const out: string[] = []
  for (let i = 0; i < text.length; i += sz) out.push(text.slice(i, i + sz))
  return out
}

