import React from 'react';

export const PrintStyles = React.memo(() => {
  return (
    <style jsx global>{`
      @media print {
        .no-print {
          display: none !important;
        }
        body {
          background: white !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .bg-gradient-to-br {
          background: white !important;
        }
        .shadow-lg, .shadow-xl, .shadow-2xl {
          box-shadow: none !important;
        }
        .animate-in {
          animation: none !important;
        }
        .hover\\:scale-105:hover {
          transform: none !important;
        }
        .court-document {
          margin: 0 !important;
          padding: 0 !important;
          max-width: none !important;
          box-shadow: none !important;
        }
        .court-page {
          page-break-inside: avoid;
          margin: 0 !important;
          padding: 1in !important;
          background: white !important;
          border: none !important;
        }
        .court-header {
          border-bottom: 2px solid #1e293b !important;
          margin-bottom: 2rem !important;
          padding-bottom: 1rem !important;
        }
        .court-calculation {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          padding: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        .court-step {
          border-left: 4px solid #3b82f6 !important;
          padding-left: 1rem !important;
          margin: 0.5rem 0 !important;
        }
        .court-footer {
          border-top: 1px solid #e2e8f0 !important;
          margin-top: 2rem !important;
          padding-top: 1rem !important;
          font-size: 0.75rem !important;
        }
      }
    `}</style>
  );
});

PrintStyles.displayName = 'PrintStyles';
