import React from 'react';

export function PleadingPaper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const lines = Array.from({ length: 28 }).map((_, i) => i + 1);
  return (
    <div className={`pleading-paper legal-document ${className}`}>
      <div className="pleading-gutter">
        <ol>
          {lines.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ol>
      </div>
      <div className="pleading-body">
        {children}
      </div>
    </div>
  );
}

