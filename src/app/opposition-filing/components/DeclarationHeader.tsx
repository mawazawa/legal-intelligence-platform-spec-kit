import React from 'react';
import { RESPONDENT_INFO, CASE_INFO } from '../data/case-data';

const DeclarationHeader: React.FC = () => {
  return (
    <>
      {/* Page Header with Case Info */}
      <div className="text-[10pt] mb-4">
        <div>{RESPONDENT_INFO.name}</div>
        <div>{RESPONDENT_INFO.status}</div>
        <div>{RESPONDENT_INFO.address}</div>
        <div>{RESPONDENT_INFO.cityStateZip}</div>
        <div>Tel: {RESPONDENT_INFO.phone}</div>
        <div>Email: {RESPONDENT_INFO.email}</div>
      </div>

      {/* Court Caption */}
      <div className="text-center mt-8 mb-8">
        <div className="font-bold">SUPERIOR COURT OF CALIFORNIA</div>
        <div className="font-bold">COUNTY OF LOS ANGELES</div>
      </div>

      <div className="caption-box">
        <div className="flex justify-between mb-2">
          <div className="w-1/2">
            <div>In re the Marriage of:</div>
            <div className="mt-2">{CASE_INFO.petitioner.toUpperCase()},</div>
            <div className="ml-8">Petitioner,</div>
            <div className="mt-2">and</div>
            <div className="mt-2">{CASE_INFO.respondent.toUpperCase()},</div>
            <div className="ml-8">Respondent.</div>
          </div>
          <div className="w-1/2 text-right">
            <div>Case No. {CASE_INFO.caseNumber}</div>
            <div className="mt-4 font-bold">DECLARATION OF MATHIEU</div>
            <div className="font-bold">CHRISTIAN YVES WAUTERS IN</div>
            <div className="font-bold">OPPOSITION TO REQUEST FOR</div>
            <div className="font-bold">ORDER</div>
            <div className="mt-4">Hearing Date: {CASE_INFO.hearingDate.split(',')[1]?.trim() || CASE_INFO.hearingDate}</div>
            <div>Hearing Time: {CASE_INFO.hearingTime.toLowerCase()}</div>
            <div>Department: {CASE_INFO.department}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(DeclarationHeader);
