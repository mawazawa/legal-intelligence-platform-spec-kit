import React from 'react';
import { TABLE_OF_CONTENTS } from '../data/case-data';

const TableOfContents: React.FC = () => {
  return (
    <div className="letter-page page-break min-h-[11in]">
      <h2 className="text-2xl font-bold mb-8 text-center">TABLE OF CONTENTS</h2>

      <div className="space-y-4 text-sm">
        {TABLE_OF_CONTENTS.map((section, idx) => (
          <React.Fragment key={idx}>
            <div className="flex justify-between">
              <span>{section.title}</span>
              <span>Page {section.page}</span>
            </div>
            {section.subsections.map((sub, subIdx) => (
              <div key={subIdx} className="flex justify-between">
                <span>&nbsp;&nbsp;{sub.title}</span>
                <span>{sub.page}</span>
              </div>
            ))}
            {idx < TABLE_OF_CONTENTS.length - 1 && (
              <div className="mt-8 pt-4 border-t"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default React.memo(TableOfContents);
