import React from 'react';
import DeclarationHeader from './DeclarationHeader';
import IntroductionSection from './sections/IntroductionSection';
import TimelineSection from './sections/TimelineSection';
import MathematicalImpossibilitySection from './sections/MathematicalImpossibilitySection';
import WattsChargesSection from './sections/WattsChargesSection';
import TaxWithholdingSection from './sections/TaxWithholdingSection';
import AdditionalDeclarationSections from './sections/AdditionalDeclarationSections';

const RespondentDeclaration: React.FC = () => {
  return (
    <>
      {/* PAGE 3 - First page of declaration */}
      <div className="letter-page page-break">
        <div className="page-content">
          <DeclarationHeader />
          <IntroductionSection />
          <TimelineSection />
          <MathematicalImpossibilitySection />
          <WattsChargesSection />
          <TaxWithholdingSection />
        </div>
      </div>

      {/* PAGES 4-8 - Continuation of declaration */}
      <div className="page-break min-h-[11in] p-16">
        <AdditionalDeclarationSections />
      </div>
    </>
  );
};

export default React.memo(RespondentDeclaration);
