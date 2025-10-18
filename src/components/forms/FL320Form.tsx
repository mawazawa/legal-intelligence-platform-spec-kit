'use client';

/**
 * FL-320: Responsive Declaration to Request for Order
 *
 * California Judicial Council form for family law responses
 * Follows official court formatting standards
 *
 * YAGNI: Only implements visible form fields, no unnecessary features
 * DRY: Reusable field components for consistency
 * KISS: Simple, readable structure matching official form
 */

import React from 'react';

interface FL320FormProps {
  data?: {
    caseNumber?: string;
    attorney?: {
      name?: string;
      barNumber?: string;
      firmName?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      telephone?: string;
      fax?: string;
      email?: string;
      attorneyFor?: string;
    };
    court?: {
      county?: string;
      streetAddress?: string;
      mailingAddress?: string;
      cityZip?: string;
      branchName?: string;
    };
    parties?: {
      petitioner?: string;
      respondent?: string;
      otherParent?: string;
    };
    hearing?: {
      date?: string;
      time?: string;
      department?: string;
    };
    responses?: {
      restrainingOrder?: 'none' | 'agree';
      childCustody?: 'consent' | 'consent-visitation' | 'do-not-consent';
      childCustodyAgreement?: string;
      childSupport?: 'consent' | 'guideline' | 'do-not-consent';
      childSupportAgreement?: string;
      spousalSupport?: 'consent' | 'do-not-consent';
      spousalSupportAgreement?: string;
    };
  };
}

export const FL320Form: React.FC<FL320FormProps> = ({ data }) => {
  return (
    <div className="fl320-form letter-page" style={{ width: '612px', background: '#fff' }}>
      {/* Header Section */}
      <div className="form-header" style={{ position: 'relative', marginBottom: '1rem' }}>
        {/* Top Left - Attorney Info */}
        <div className="attorney-box" style={{
          border: '1px solid #000',
          padding: '8px',
          marginBottom: '8px',
          minHeight: '120px'
        }}>
          <div style={{ fontSize: '6px', marginBottom: '4px' }}>
            <span>PARTY WITHOUT ATTORNEY OR ATTORNEY</span>
            <span style={{ float: 'right' }}>STATE BAR NUMBER:</span>
          </div>
          <div style={{ fontSize: '6px', lineHeight: '1.4' }}>
            <div>NAME: {data?.attorney?.name || ''}</div>
            <div>FIRM NAME: {data?.attorney?.firmName || ''}</div>
            <div>STREET ADDRESS: {data?.attorney?.address || ''}</div>
            <div>
              CITY: {data?.attorney?.city || ''}
              <span style={{ marginLeft: '20px' }}>STATE: {data?.attorney?.state || ''}</span>
              <span style={{ marginLeft: '20px' }}>ZIP CODE: {data?.attorney?.zipCode || ''}</span>
            </div>
            <div>TELEPHONE NO.: {data?.attorney?.telephone || ''} FAX NO.: {data?.attorney?.fax || ''}</div>
            <div>EMAIL ADDRESS: {data?.attorney?.email || ''}</div>
            <div>ATTORNEY FOR <em>(name)</em>: {data?.attorney?.attorneyFor || ''}</div>
          </div>
        </div>

        {/* Court Info */}
        <div className="court-info" style={{ border: '1px solid #000', padding: '8px', marginBottom: '8px' }}>
          <div style={{ fontSize: '8px', fontWeight: 'bold' }}>
            SUPERIOR COURT OF CALIFORNIA, COUNTY OF {data?.court?.county || ''}
          </div>
          <div style={{ fontSize: '6px', marginTop: '4px', lineHeight: '1.4' }}>
            <div>STREET ADDRESS: {data?.court?.streetAddress || ''}</div>
            <div>MAILING ADDRESS: {data?.court?.mailingAddress || ''}</div>
            <div>CITY AND ZIP CODE: {data?.court?.cityZip || ''}</div>
            <div>BRANCH NAME: {data?.court?.branchName || ''}</div>
          </div>
        </div>

        {/* Party Names */}
        <div className="parties" style={{ fontSize: '9px', marginBottom: '8px', lineHeight: '1.6' }}>
          <div>PETITIONER: {data?.parties?.petitioner || ''}</div>
          <div>RESPONDENT: {data?.parties?.respondent || ''}</div>
          <div>OTHER PARENT/PARTY: {data?.parties?.otherParent || ''}</div>
        </div>

        {/* Case Number Box (Top Right) */}
        <div className="case-number-box" style={{
          position: 'absolute',
          top: 0,
          right: 0,
          border: '1px solid #000',
          padding: '8px',
          width: '30%',
          minHeight: '200px'
        }}>
          <div style={{ fontSize: '6px', fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center' }}>
            FOR COURT USE ONLY
          </div>
          <div style={{ marginTop: '170px', borderTop: '1px solid #000', paddingTop: '4px' }}>
            <div style={{ fontSize: '6px' }}>CASE NUMBER:</div>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{data?.caseNumber || ''}</div>
          </div>
        </div>
      </div>

      {/* Form Title */}
      <div style={{
        borderTop: '1px solid #000',
        borderBottom: '1px solid #000',
        padding: '8px 0',
        textAlign: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        letterSpacing: '0.5px'
      }}>
        RESPONSIVE DECLARATION TO REQUEST FOR ORDER
      </div>

      {/* Hearing Info */}
      <div style={{ border: '1px solid #000', padding: '6px', margin: '8px 0', fontSize: '6px' }}>
        <span>HEARING DATE: {data?.hearing?.date || ''}</span>
        <span style={{ marginLeft: '40px' }}>TIME: {data?.hearing?.time || ''}</span>
        <span style={{ marginLeft: '40px' }}>DEPARTMENT OR ROOM: {data?.hearing?.department || ''}</span>
      </div>

      {/* Information Note */}
      <div style={{ fontSize: '9px', marginBottom: '12px', padding: '8px 0' }}>
        Read <em>Information Sheet: Responsive Declaration to Request for Order</em> (form <span style={{ color: 'blue' }}>FL-320-INFO</span>) for more information about this form.
      </div>

      {/* Form Content */}
      <div className="form-content" style={{ fontSize: '9px', lineHeight: '1.6' }}>

        {/* Section 1: Restraining Order Information */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>1. RESTRAINING ORDER INFORMATION</div>
          <div style={{ marginLeft: '20px' }}>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.restrainingOrder === 'none'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>a. No domestic violence restraining/protective orders are now in effect between the parties in this case.</span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.restrainingOrder === 'agree'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>b. I agree that one or more domestic violence restraining/protective orders are now in effect between the parties in this case.</span>
            </div>
          </div>
        </div>

        {/* Section 2: Child Custody / Visitation */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>2. CHILD CUSTODY VISITATION (PARENTING TIME)</div>
          <div style={{ marginLeft: '20px' }}>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.childCustody === 'consent'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>a. I consent to the order requested for child custody (legal and physical custody).</span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.childCustody === 'consent-visitation'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>b. I consent to the order requested for visitation (parenting time).</span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.childCustody === 'do-not-consent'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>c. I do not consent to the order requested for </span>
              <input type="checkbox" style={{ marginLeft: '4px', marginRight: '4px' }} /> child custody
              <input type="checkbox" style={{ marginLeft: '8px', marginRight: '4px' }} /> visitation (parenting time)
              <div style={{ marginLeft: '24px', marginTop: '4px' }}>
                but I consent to the following order:
                <div style={{ borderBottom: '1px solid #999', marginTop: '4px', minHeight: '20px' }}>
                  {data?.responses?.childCustodyAgreement || ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Child Support */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>3. CHILD SUPPORT</div>
          <div style={{ marginLeft: '20px' }}>
            <div style={{ marginBottom: '6px', fontSize: '8px' }}>
              a. I have completed and filed a current <em>Income and Expense Declaration</em> (form <span style={{ color: 'blue' }}>FL-150</span>) or, if eligible, a current <em>Financial Statement (Simplified)</em> (form FL-155) to support my responsive declaration.
            </div>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.childSupport === 'consent'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>b. I consent to the order requested.</span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.childSupport === 'guideline'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>c. I consent to guideline support.</span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.childSupport === 'do-not-consent'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>d. I do not consent to the order requested </span>
              <input type="checkbox" style={{ marginLeft: '4px', marginRight: '4px' }} />
              <div style={{ marginLeft: '24px', marginTop: '4px' }}>
                but I consent to the following order:
                <div style={{ borderBottom: '1px solid #999', marginTop: '4px', minHeight: '20px' }}>
                  {data?.responses?.childSupportAgreement || ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Spousal/Domestic Partner Support */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>4. SPOUSAL OR DOMESTIC PARTNER SUPPORT</div>
          <div style={{ marginLeft: '20px' }}>
            <div style={{ marginBottom: '6px', fontSize: '8px' }}>
              a. I have completed and filed a current <em>Income and Expense Declaration</em> (form <span style={{ color: 'blue' }}>FL-150</span>) to support my responsive declaration.
            </div>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.spousalSupport === 'consent'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>b. I consent to the order requested.</span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={data?.responses?.spousalSupport === 'do-not-consent'}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span>c. I do not consent to the order requested </span>
              <input type="checkbox" style={{ marginLeft: '4px', marginRight: '4px' }} />
              <div style={{ marginLeft: '24px', marginTop: '4px' }}>
                but I consent to the following order:
                <div style={{ borderBottom: '1px solid #999', marginTop: '4px', minHeight: '20px' }}>
                  {data?.responses?.spousalSupportAgreement || ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #000',
        marginTop: '40px',
        paddingTop: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '6px'
      }}>
        <div>
          <div>Form Adopted for Mandatory Use</div>
          <div>Judicial Council of California</div>
          <div>FL-320 [Rev. July 1, 2025]</div>
        </div>
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
          <div>RESPONSIVE DECLARATION TO REQUEST FOR ORDER</div>
          <div style={{ fontSize: '6px', marginTop: '4px' }}>
            Code of Civil Procedure, § 1005
          </div>
          <div style={{ fontSize: '6px' }}>Cal. Rules of Court, rule 5.92</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: 'blue', textDecoration: 'underline' }}>courts.ca.gov</span>
        </div>
      </div>

      <div style={{ textAlign: 'right', fontSize: '6px', fontWeight: 'bold', marginTop: '8px' }}>
        Page 1 of 2
      </div>
      <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', marginTop: '4px' }}>
        FL-320
      </div>
    </div>
  );
};

export default FL320Form;
