import { FL320ChecklistItem as ChecklistItem } from '@/types/checklist';

export const FL320_CHECKLIST_TEMPLATE = `# FL-320 Responsive Declaration Court Packet Checklist

## Required Forms
- [ ] **FL-320 Responsive Declaration** - Main responsive declaration form
- [ ] **FL-320-INFO** - Information sheet for FL-320 (if applicable)

## Supporting Declarations
- [ ] **Declaration of Thomas J. Rotert** - Attorney declaration with legal arguments
- [ ] **Declaration of Mathieu Wauters** - Respondent's personal declaration
- [ ] **Declaration of [Additional Witness]** - Supporting witness declarations (if any)

## Memorandum of Points and Authorities
- [ ] **Memo of Points and Authorities** - Legal brief supporting the responsive declaration
- [ ] **Table of Authorities** - Legal citations and case law references

## Indexed List of Exhibits
- [ ] **Indexed List of Exhibits** - Comprehensive list of all supporting documents
- [ ] **Exhibit A** - Statement of Decision (SOD) - Court's final judgment
- [ ] **Exhibit B** - Final Sellers Closing Statement - Property sale documentation
- [ ] **Exhibit C** - Lakeview Mortgage Payoff Statement - Mortgage details
- [ ] **Exhibit D** - Tax Withholding Documentation - Form 593 and related tax forms
- [ ] **Exhibit E** - Email Evidence - Tax withholding discussions (May 30, 2025)
- [ ] **Exhibit F** - Financial Computation Exhibit - Detailed calculation breakdown
- [ ] **Exhibit G** - Supporting Documentation - Additional evidence as needed

## Financial Documentation
- [ ] **Detailed Financial Computation** - Step-by-step calculation with sources
- [ ] **Property Sale Analysis** - Complete breakdown of sale proceeds
- [ ] **Tax Obligation Analysis** - Mathieu's estimated $25k tax obligation
- [ ] **Watts Charges Calculation** - Exclusive possession charges breakdown
- [ ] **Furniture Reversal Documentation** - $15,000 furniture retention evidence

## Legal Research and Citations
- [ ] **Family Code § 2550** - Equal division of community property
- [ ] **Family Code § 2552** - Court's authority to adjust property division
- [ ] **Revenue and Taxation Code § 2187** - Tax withholding requirements
- [ ] **Case Law Precedents** - Supporting legal authorities

## Court Filing Requirements
- [ ] **Proof of Service** - Service on opposing party
- [ ] **Filing Fee** - Court filing fee payment
- [ ] **Conformed Copies** - Copies for court and parties
- [ ] **Electronic Filing** - E-filing submission (if applicable)

## Quality Assurance
- [ ] **Legal Review** - Attorney review of all documents
- [ ] **Fact Checking** - Verification of all financial calculations
- [ ] **Citation Verification** - Confirmation of all legal citations
- [ ] **Format Compliance** - Court formatting requirements met
- [ ] **Deadline Confirmation** - Filing deadline verification

## Post-Filing Tasks
- [ ] **Service on Opposing Party** - Serve responsive declaration
- [ ] **Calendar Hearing** - Schedule any required hearings
- [ ] **Follow-up Documentation** - Additional filings as needed
- [ ] **Case Management** - Update case management system

---

## Notes and Comments
*Add any additional notes, comments, or observations here*

## Filing Deadline
**Target Filing Date:** [To be determined]
**Court:** [Court Information]
**Case Number:** FDI-21-794666
**Judge:** [Assigned Judge]

## Contact Information
**Attorney:** Thomas J. Rotert
**Client:** Mathieu Wauters
**Opposing Party:** Rosanna Alvero
**Opposing Counsel:** [To be determined]`;

export const FL320_CHECKLIST: ChecklistItem[] = [
  {
    id: 'fl320-form',
    title: 'FL-320 Responsive Declaration',
    description: 'Main responsive declaration form',
    status: 'pending',
    priority: 'high',
    category: 'form',
    filePath: '/documents/FL-320-Responsive-Declaration.pdf'
  },
  {
    id: 'fl320-info',
    title: 'FL-320-INFO Information Sheet',
    description: 'Information sheet for FL-320 (if applicable)',
    status: 'pending',
    priority: 'medium',
    category: 'form',
    filePath: '/documents/FL-320-INFO.pdf'
  },
  {
    id: 'declaration-rotert',
    title: 'Declaration of Thomas J. Rotert',
    description: 'Attorney declaration with legal arguments',
    status: 'in-progress',
    priority: 'high',
    category: 'declaration',
    filePath: '/documents/Declaration-Thomas-J-Rotert.pdf'
  },
  {
    id: 'declaration-wauters',
    title: 'Declaration of Mathieu Wauters',
    description: 'Respondent\'s personal declaration',
    status: 'pending',
    priority: 'high',
    category: 'declaration',
    filePath: '/documents/Declaration-Mathieu-Wauters.pdf'
  },
  {
    id: 'memo-points-auth',
    title: 'Memo of Points and Authorities',
    description: 'Legal brief supporting the responsive declaration',
    status: 'pending',
    priority: 'high',
    category: 'declaration',
    filePath: '/documents/Memo-Points-Authorities.pdf'
  },
  {
    id: 'exhibit-index',
    title: 'Indexed List of Exhibits',
    description: 'Comprehensive list of all supporting documents',
    status: 'pending',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Exhibit-Index.pdf'
  },
  {
    id: 'exhibit-sod',
    title: 'Exhibit A - Statement of Decision',
    description: 'Court\'s final judgment and property division order',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Statement-of-Decision.pdf'
  },
  {
    id: 'exhibit-closing',
    title: 'Exhibit B - Final Sellers Closing Statement',
    description: 'Property sale documentation and proceeds breakdown',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Final-Sellers-Closing-Statement.pdf'
  },
  {
    id: 'exhibit-mortgage',
    title: 'Exhibit C - Lakeview Mortgage Payoff Statement',
    description: 'Mortgage details and payoff information',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Lakeview-Mortgage-Payoff.pdf'
  },
  {
    id: 'exhibit-tax',
    title: 'Exhibit D - Tax Withholding Documentation',
    description: 'Form 593 and related tax forms',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Tax-Withholding-Documentation.pdf'
  },
  {
    id: 'exhibit-email',
    title: 'Exhibit E - Email Evidence',
    description: 'Tax withholding discussions (May 30, 2025)',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Email-Evidence-Tax-Withholding.pdf'
  },
  {
    id: 'exhibit-financial',
    title: 'Exhibit F - Financial Computation Exhibit',
    description: 'Detailed calculation breakdown with sources',
    status: 'in-progress',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Financial-Computation-Exhibit.pdf'
  },
  {
    id: 'exhibit-supporting',
    title: 'Exhibit G - Supporting Documentation',
    description: 'Additional evidence as needed',
    status: 'pending',
    priority: 'medium',
    category: 'exhibit',
    filePath: '/documents/Supporting-Documentation.pdf'
  }
];
