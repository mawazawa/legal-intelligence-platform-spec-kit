export type CaseId = 'FDI-21-794666' | 'FDV-24-817888' | 'A171270';

export interface ParticipantStat {
  name: string;
  email: string;
  role: string;
  organization?: string;
  touches: number;
  sent: number;
  received: number;
  uniqueThreads: number;
  leverageScore: number;
  firstSeen: string;
  lastSeen: string;
  medianResponseHours?: number;
  financialImpactUsd?: number;
  caseHooks: Array<{
    caseId: CaseId;
    hook: string;
  }>;
  signalBoost: string;
}

export const participants: ParticipantStat[] = [
  {
    name: 'Mathieu Wauters',
    email: 'mathieuwauters@gmail.com',
    role: 'Petitioner / Client',
    touches: 20,
    sent: 9,
    received: 11,
    uniqueThreads: 8,
    leverageScore: 37,
    firstSeen: '2019-03-21',
    lastSeen: '2022-12-30',
    medianResponseHours: 72.3,
    caseHooks: [
      {
        caseId: 'FDI-21-794666',
        hook: 'Trial readiness and counsel coordination, including December 2022 deadlines for discovery responses.',
      },
      {
        caseId: 'FDV-24-817888',
        hook: 'Captures historical narrative of marital strain and alleged misconduct needed for credibility and DV findings.',
      },
      {
        caseId: 'A171270',
        hook: 'Provides appellate record context on counsel search and financial mitigation steps for the marital residence.',
      },
    ],
    signalBoost:
      'Primary narrator tying together trial schedule, property financing pressures, and contemporaneous documentation.',
  },
  {
    name: 'Brett Berman',
    email: 'brett@bermanfamilylaw.com',
    role: 'Prospective Lead Trial Counsel (CFLS)',
    organization: 'The Berman Law Group',
    touches: 13,
    sent: 4,
    received: 9,
    uniqueThreads: 2,
    leverageScore: 19,
    firstSeen: '2022-10-10',
    lastSeen: '2022-12-30',
    medianResponseHours: 5.9,
    caseHooks: [
      {
        caseId: 'FDI-21-794666',
        hook: 'Evaluated to replace current counsel before Feb 2023 trial; responsive cadence evidences readiness.',
      },
      {
        caseId: 'A171270',
        hook: 'Potential declarant on diligence to secure qualified counsel if appellate issues arise from trial timeline.',
      },
    ],
    signalBoost:
      'Fast response cycle (median 5.9h) and willingness to engage show viable pathway for trial-team upgrade.',
  },
  {
    name: 'Robyn Macias',
    email: 'robyn@bermanfamilylaw.com',
    role: 'Paralegal, Intake Coordinator',
    organization: 'The Berman Law Group',
    touches: 3,
    sent: 1,
    received: 2,
    uniqueThreads: 2,
    leverageScore: 6,
    firstSeen: '2022-12-30',
    lastSeen: '2022-12-30',
    medianResponseHours: 0.13,
    caseHooks: [
      {
        caseId: 'FDI-21-794666',
        hook: 'Documented same-day scheduling support to lock strategy touchpoint before discovery cutoff.',
      },
    ],
    signalBoost:
      'Ultra-fast engagement (median 8 minutes) signals firm bandwidth to mobilize discovery triage immediately.',
  },
  {
    name: 'Eric Proos',
    email: 'eproos@ejplawoffice.com',
    role: 'Referring Attorney',
    organization: 'Law Office of Eric J. Proos, PC',
    touches: 4,
    sent: 1,
    received: 3,
    uniqueThreads: 3,
    leverageScore: 8,
    firstSeen: '2022-10-10',
    lastSeen: '2022-10-13',
    caseHooks: [
      {
        caseId: 'FDI-21-794666',
        hook: 'Introduces CFLS specialist; can authenticate referral provenance and urgency around mortgage deed issues.',
      },
      {
        caseId: 'A171270',
        hook: 'Bolsters diligence narrative on sourcing specialized counsel for appellate mitigation arguments.',
      },
    ],
    signalBoost:
      'Bridge between client and CFLS counsel underscores external validation of case complexity and mortgage stakes.',
  },
  {
    name: 'Ryan Anderson',
    email: 'ryan@sojourn.club',
    role: 'Business Partner / Referral Source',
    organization: 'Sojourn',
    touches: 4,
    sent: 1,
    received: 3,
    uniqueThreads: 3,
    leverageScore: 8,
    firstSeen: '2020-01-01',
    lastSeen: '2023-01-01',
    caseHooks: [
      {
        caseId: 'FDI-21-794666',
        hook: 'Frames mortgage/deed release as key deliverable and provides character evidence on financial stewardship.',
      },
      {
        caseId: 'FDV-24-817888',
        hook: "Third-party witness to client's urgency and perceived pressure points during alleged DV period.",
      },
    ],
    signalBoost:
      'Narrative teammate highlighting mortgage removal priority; potential lay witness on good-faith restructuring.',
  },
  {
    name: 'Rosey Alvero',
    email: 'roseyalvero@gmail.com',
    role: 'Respondent / Opposing Party',
    touches: 2,
    sent: 1,
    received: 1,
    uniqueThreads: 2,
    leverageScore: 5,
    firstSeen: '2019-03-21',
    lastSeen: '2019-03-21',
    caseHooks: [
      {
        caseId: 'FDV-24-817888',
        hook: 'Admits to depressive episodes, “temporary high” shoplifting, and emotional withdrawal—credibility leverage.',
      },
      {
        caseId: 'FDI-21-794666',
        hook: 'Corroborates separation timeline and competing financial narratives for spousal support arguments.',
      },
    ],
    signalBoost:
      'Long-form mea culpa email supplies impeachment material and timeline anchors pre-dating formal filings.',
  },
  {
    name: 'Joe Baldino',
    email: 'joe6677@aol.com',
    role: 'Real Estate Appraiser',
    touches: 2,
    sent: 1,
    received: 1,
    uniqueThreads: 2,
    leverageScore: 5,
    firstSeen: '2022-07-25',
    lastSeen: '2022-07-25',
    caseHooks: [
      {
        caseId: 'FDI-21-794666',
        hook: 'Delivers appraisal for 3535 8th Ave—critical to marital estate valuation and buyout scenarios.',
      },
      {
        caseId: 'A171270',
        hook: 'Supports evidentiary record on property valuation if challenged on appeal.',
      },
    ],
    signalBoost:
      'Appraisal packet creates baseline valuation; can testify to methodology supporting refinance or sale.',
  },
  {
    name: 'California Mortgage Relief Program',
    email: 'noreply@camortgagerelief.org',
    role: 'Government Relief Administrator',
    touches: 1,
    sent: 1,
    received: 0,
    uniqueThreads: 1,
    leverageScore: 3,
    firstSeen: '2022-11-02',
    lastSeen: '2022-11-02',
    financialImpactUsd: 49262.84,
    caseHooks: [
      {
        caseId: 'FDI-21-794666',
        hook: 'Confirms $49,262.84 principal assistance applied to mortgage, reshaping equity split math.',
      },
      {
        caseId: 'A171270',
        hook: 'Documentary evidence of post-separation financial mitigation for appellate equitable arguments.',
      },
    ],
    signalBoost:
      'Creates traceable cash infusion into the secured debt—key for tracing community vs. separate contributions.',
  },
  {
    name: 'Superhuman Reminder Bot',
    email: 'reminder@superhuman.com',
    role: 'Personal Workflow Automation',
    touches: 1,
    sent: 1,
    received: 0,
    uniqueThreads: 1,
    leverageScore: 3,
    firstSeen: '2022-11-06',
    lastSeen: '2022-11-06',
    caseHooks: [
      {
        caseId: 'FDI-21-794666',
        hook: 'Shows diligence via self-reminder to follow up with counsel during pre-trial preparation.',
      },
    ],
    signalBoost:
      'Timestamped self-reminder evidences client diligence in securing representation and meeting deadlines.',
  },
];
