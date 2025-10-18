import React from 'react';
import { CASE_INFO, ATTORNEY_INFO } from '../data/case-data';

const CoverPage: React.FC = () => {
  return (
    <div className="letter-page page-break min-h-[11in] flex flex-col justify-center items-center text-center">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">SUPERIOR COURT OF CALIFORNIA</h1>
        <h2 className="text-2xl font-semibold mb-4">COUNTY OF LOS ANGELES</h2>
        <h3 className="text-xl mb-8">FAMILY LAW DIVISION</h3>

        <div className="border-t-2 border-b-2 border-black py-8 my-8">
          <h4 className="text-2xl font-bold mb-4">OPPOSITION TO REQUEST FOR ORDER</h4>
          <h5 className="text-lg font-semibold">FL-320 RESPONSIVE DECLARATION</h5>
        </div>

        <div className="text-left space-y-4">
          <div><strong>Case Number:</strong> {CASE_INFO.caseNumber}</div>
          <div><strong>Petitioner:</strong> {CASE_INFO.petitioner}</div>
          <div><strong>Respondent:</strong> {CASE_INFO.respondent}</div>
          <div><strong>Hearing Date:</strong> {CASE_INFO.hearingDate}</div>
          <div><strong>Hearing Time:</strong> {CASE_INFO.hearingTime}</div>
          <div><strong>Department:</strong> {CASE_INFO.department}</div>
        </div>

        <div className="mt-12 text-sm">
          <p><strong>Filed:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Attorney for Respondent:</strong> {ATTORNEY_INFO.name}</p>
          <p><strong>Law Firm:</strong> {ATTORNEY_INFO.firm}</p>
          <p><strong>Address:</strong> {ATTORNEY_INFO.address}</p>
          <p><strong>Phone:</strong> {ATTORNEY_INFO.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CoverPage);
