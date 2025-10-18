import React from 'react';

export const PageFooter = React.memo(() => {
  return (
    <div className="text-center text-sm text-slate-500 mb-8">
      <p>This filing package contains all necessary documents and calculations for the FL-320 Responsive Declaration.</p>
      <p>All calculations are based on verified sources and legal authorities.</p>
    </div>
  );
});

PageFooter.displayName = 'PageFooter';
