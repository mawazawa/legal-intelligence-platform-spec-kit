/**
 * Legal document styles for California Rules of Court compliance
 * Rules 2.104 (Font), 2.107 (Margins), 2.108 (Line Spacing/Numbers)
 */

export const legalDocumentStyles = `
  /* =================================================================
     PRINT STYLES - California Rules of Court Compliance
     Rules 2.104 (Font), 2.107 (Margins), 2.108 (Line Spacing/Numbers)
     ================================================================= */
  @media print {
    /* Hide print controls */
    .no-print { display: none !important; }

    /* Page breaks */
    .page-break { page-break-before: always; }
    .page-break:first-child { page-break-before: avoid; }

    /* California Rules of Court formatting */
    body {
      margin: 0;
      padding: 0;
      font-family: "Courier New", Courier, monospace;
      font-size: 12pt;
      line-height: 2.0;
    }

    .legal-document {
      font-family: "Courier New", Courier, monospace !important;
      font-size: 12pt !important;
      line-height: 2.0 !important;
      max-width: 8.5in;
      margin: 0;
      padding: 1in 0.5in 1in 1in !important;
      background: white !important;
      box-shadow: none !important;
    }

    /* Strip ALL colorful web styling for court compliance */
    .bg-purple-50, .bg-purple-100, .bg-purple-200,
    .bg-green-50, .bg-green-100, .bg-green-200,
    .bg-red-50, .bg-red-100, .bg-red-200,
    .bg-blue-50, .bg-blue-100, .bg-blue-200,
    .bg-yellow-50, .bg-yellow-100, .bg-yellow-200,
    .bg-indigo-50, .bg-indigo-100, .bg-indigo-200,
    .bg-slate-50, .bg-slate-100, .bg-slate-200 {
      background: white !important;
      border: none !important;
      padding: 0 !important;
      margin: 4pt 0 !important;
    }

    /* Remove rounded corners */
    .rounded, .rounded-lg, .rounded-md {
      border-radius: 0 !important;
    }

    /* Remove decorative borders */
    .border-l-4, .border-2, .border-4 {
      border: none !important;
    }

    /* Convert grids to single column */
    .grid {
      display: block !important;
    }

    .grid > div {
      display: block !important;
      width: 100% !important;
      margin-bottom: 12pt !important;
    }

    /* Pleading paper line numbers (Rule 2.108) */
    .line-numbers {
      counter-reset: line-counter;
    }

    .line-numbers .line {
      position: relative;
      padding-left: 0.75in;
      min-height: 24pt;
    }

    .line-numbers .line::before {
      counter-increment: line-counter;
      content: counter(line-counter);
      position: absolute;
      left: 0.25in;
      width: 0.4in;
      text-align: right;
      font-size: 10pt;
      color: #000;
      font-family: "Courier New", Courier, monospace;
    }

    /* Caption box (keep border for court format) */
    .caption-box {
      border: 2pt solid black !important;
      padding: 12pt;
      margin: 24pt 0;
      background: white !important;
    }

    /* Page footers */
    .footer {
      position: fixed;
      bottom: 0.5in;
      left: 1in;
      right: 0.5in;
      text-align: center;
      font-size: 10pt;
      border-top: 1pt solid black;
      padding-top: 6pt;
    }

    /* Plain text formatting for all elements */
    p, div, span, li {
      font-family: "Courier New", Courier, monospace !important;
      font-size: 12pt !important;
      line-height: 2.0 !important;
    }

    /* Keep headings bold */
    h1, h2, h3, h4, .font-bold {
      font-weight: bold !important;
      font-family: "Courier New", Courier, monospace !important;
    }

    /* Standardize margins */
    .ml-4 { margin-left: 24pt !important; }
    .ml-8 { margin-left: 48pt !important; }
    .ml-12 { margin-left: 72pt !important; }

    /* Remove shadows and effects */
    * {
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }

  /* =================================================================
     SCREEN STYLES - Beautiful, Modern Web UI
     ================================================================= */
  .legal-document {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 15px;
    line-height: 1.7;
    max-width: 8.5in;
    margin: 0 auto;
    background: white;
    box-shadow: 0 0 30px rgba(0,0,0,0.15);
    padding: 3rem;
  }

  /* Subtle line numbers for screen */
  .line-numbers {
    counter-reset: line-counter;
  }

  .line-numbers .line {
    position: relative;
    padding-left: 0.75in;
    min-height: 24pt;
  }

  .line-numbers .line::before {
    counter-increment: line-counter;
    content: counter(line-counter);
    position: absolute;
    left: 0.25in;
    width: 0.4in;
    text-align: right;
    font-size: 9pt;
    color: #e0e0e0;
    font-family: "Courier New", Courier, monospace;
  }

  .page-content {
    padding: 2.5rem;
  }

  .caption-box {
    border: 3px solid #2c3e50;
    padding: 1.5rem;
    margin: 2rem 0;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .centered {
    text-align: center;
  }

  /* Beautiful spacing for web */
  .space-y-4 > * + * {
    margin-top: 1rem;
  }

  .ml-4 { margin-left: 1.5rem; }
  .ml-8 { margin-left: 3rem; }
  .ml-12 { margin-left: 4.5rem; }

  /* Enhanced readability */
  p {
    margin-bottom: 0.75rem;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #2c3e50;
  }

  h4 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: #34495e;
  }
`;
