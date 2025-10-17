import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

async function readDeclaration(): Promise<string> {
  const candidates = [
    path.resolve(process.cwd(), 'RESPONSIVE_DECLARATION_FL320_FINAL.md'),
    path.resolve(process.cwd(), 'RESPONSIVE_DECLARATION_FL320.md'),
  ];
  for (const p of candidates) {
    try { return await fs.readFile(p, 'utf8'); } catch {}
  }
  return '# Responsive Declaration\n\n[Add content file to repository]';
}

export default async function ResponsivePleadingPage() {
  const content = await readDeclaration();
  return (
    <div className="min-h-screen bg-white p-8 pleading-paper legal-document">
      <div className="pleading-gutter hidden print:block">
        <ol>{Array.from({ length: 28 }).map((_, i) => (<li key={i+1}>{i+1}</li>))}</ol>
      </div>
      <div className="max-w-4xl mx-auto pleading-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

