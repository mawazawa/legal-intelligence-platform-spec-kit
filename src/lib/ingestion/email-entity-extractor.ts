import crypto from 'node:crypto';

export type EntityLabel =
  | 'Person'
  | 'Organization'
  | 'DocumentArtifact'
  | 'FinancialTransaction'
  | 'TaxWithholding'
  | 'LegalAction';

export interface ExtractedEntity {
  externalId: string;
  labels: EntityLabel[];
  properties: Record<string, unknown>;
  confidence: number;
  tags: string[];
  sourceText: string;
}

export interface ExtractedRelationshipEndpoint {
  externalId: string;
  labels: EntityLabel[] | ['Event'];
}

export interface ExtractedRelationship {
  type: string;
  from: ExtractedRelationshipEndpoint;
  to: ExtractedRelationshipEndpoint;
  properties: Record<string, unknown>;
  confidence: number;
}

export interface ExtractionResult {
  entities: ExtractedEntity[];
  relationships: ExtractedRelationship[];
  tags: string[];
}

const CURRENCY_REGEX = /\$[0-9][0-9,]*(\.[0-9]{2})?/g;
const PERCENT_REGEX = /([0-9]{1,2}(?:\.[0-9]+)?)\s?%/g;
const DATE_REGEX = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s+\d{4}\b/gi;

const DOCUMENT_KEYWORDS = [
  { docType: 'Form 593', patterns: [/form\s+593/i, /ftb form 593/i] },
  { docType: 'FLARPL Release', patterns: [/flarpl/i, /attorney'?s?\s+lien/i] },
  { docType: 'Request for Order', patterns: [/request for order/i, /\bRFO\b/] },
  { docType: 'Substitution of Attorney', patterns: [/substitution of attorney/i] },
];

const LEGAL_ACTION_KEYWORDS = [
  { actionType: 'Lien', patterns: [/lien/i, /flarpl/i] },
  { actionType: 'Tax Withholding', patterns: [/withhold/i, /franchise tax board/i, /\bFTB\b/] },
  { actionType: 'Ex Parte', patterns: [/ex parte/i] },
  { actionType: 'Hearing/Motion', patterns: [/hearing/i, /motion/i, /\bRFO\b/] },
];

function hash(value: string): string {
  return crypto.createHash('sha1').update(value).digest('hex');
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function createEntity(
  label: EntityLabel,
  sourceText: string,
  properties: Record<string, unknown>,
  tags: string[] = [],
  confidence = 0.6
): ExtractedEntity {
  const baseId = `${label}:${JSON.stringify(properties)}:${sourceText}`;
  const externalId = `${label.toLowerCase()}_${hash(baseId)}`;
  const labels: EntityLabel[] = [label];
  return {
    externalId,
    labels,
    properties,
    confidence,
    tags,
    sourceText,
  };
}

function ensureTaxWithholding(
  allEntities: ExtractedEntity[],
  relationships: ExtractedRelationship[],
  emailExternalId: string,
  amount: number | null,
  percent: number | null,
  snippet: string
) {
  const properties: Record<string, unknown> = {
    amount: amount ?? undefined,
    currency: amount ? 'USD' : undefined,
    percentage: percent ?? undefined,
    transactionType: 'Withholding',
    statute: 'California FTB',
    source: 'Email',
  };

  const entity = createEntity('TaxWithholding', snippet, properties, ['tax', 'withholding'], 0.75);
  entity.labels.push('FinancialTransaction');
  allEntities.push(entity);

  const ftbEntity = createEntity(
    'Organization',
    'Franchise Tax Board',
    {
      name: 'Franchise Tax Board',
      domain: 'ftb.ca.gov',
      kind: 'GovernmentAgency',
    },
    ['organization', 'tax'],
    0.85
  );

  const existingFtb = allEntities.find(e => e.externalId === ftbEntity.externalId);
  if (!existingFtb) {
    allEntities.push(ftbEntity);
  }

  relationships.push({
    type: 'RELATES_TO',
    from: { externalId: emailExternalId, labels: ['Event'] },
    to: { externalId: entity.externalId, labels: entity.labels },
    properties: { context: 'Tax withholding mentioned in email' },
    confidence: 0.75,
  });

  relationships.push({
    type: 'HAS_COUNTERPARTY',
    from: { externalId: entity.externalId, labels: entity.labels },
    to: {
      externalId: ftbEntity.externalId,
      labels: ftbEntity.labels,
    },
    properties: { name: 'Franchise Tax Board', role: 'Counterparty' },
    confidence: 0.8,
  });
}

function extractMonetaryAmounts(text: string): { amounts: number[]; snippets: string[] } {
  const matches = text.match(CURRENCY_REGEX) ?? [];
  const amounts: number[] = [];
  const snippets: string[] = [];

  for (const match of matches) {
    const normalized = match.replace(/[$,]/g, '');
    const value = Number.parseFloat(normalized);
    if (!Number.isNaN(value)) {
      amounts.push(value);
      snippets.push(match);
    }
  }

  return { amounts, snippets };
}

function extractPercentages(text: string): number[] {
  const result: number[] = [];
  let match: RegExpExecArray | null;
  PERCENT_REGEX.lastIndex = 0;
  while ((match = PERCENT_REGEX.exec(text)) !== null) {
    const value = Number.parseFloat(match[1]);
    if (!Number.isNaN(value)) {
      result.push(value);
    }
  }
  return result;
}

function inferOrganizationsFromHeaders(fromEmail: string, toEmails: string[], ccEmails: string[]): ExtractedEntity[] {
  const domains = new Set<string>();
  const allEmails = [fromEmail, ...toEmails, ...ccEmails];

  for (const value of allEmails) {
    const match = value.match(/@([a-z0-9.-]+\.[a-z]{2,})/i);
    if (match) {
      domains.add(match[1].toLowerCase());
    }
  }

  const entities: ExtractedEntity[] = [];
  domains.forEach(domain => {
    // Skip generic email providers
    if (/(gmail|outlook|hotmail|yahoo|icloud|protonmail)\./.test(domain)) return;
    const name = domain.replace(/\.[a-z]{2,}$/, '').replace(/\./g, ' ');
    const organizationName = name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    const entity = createEntity(
      'Organization',
      domain,
      {
        name: organizationName,
        domain,
        kind: 'EmailDomain',
      },
      ['organization', 'email-domain'],
      0.55
    );
    entities.push(entity);
  });
  return entities;
}

export function extractEntitiesFromEmail(params: {
  messageExternalId: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  cc: string[];
}): ExtractionResult {
  const { messageExternalId, subject, body, from, to, cc } = params;
  const content = `${subject}\n${body}`;
  const normalizedContent = normalizeWhitespace(content);

  const entities: ExtractedEntity[] = [];
  const relationships: ExtractedRelationship[] = [];
  const tags = new Set<string>();

  // Organizations inferred from headers
  inferOrganizationsFromHeaders(from, to, cc).forEach(entity => entities.push(entity));

  // Monetary amounts
  const { amounts, snippets } = extractMonetaryAmounts(normalizedContent);
  if (amounts.length > 0) {
    tags.add('currency');
    amounts.forEach((amount, idx) => {
      const entity = createEntity(
        'FinancialTransaction',
        snippets[idx],
        {
          amount,
          currency: 'USD',
          transactionType: 'Mentioned',
          source: 'Email',
        },
        ['financial', 'currency'],
        0.6
      );
      entities.push(entity);
      relationships.push({
        type: 'RELATES_TO',
    from: { externalId: messageExternalId, labels: ['Event'] },
    to: { externalId: entity.externalId, labels: entity.labels },
    properties: { context: 'Currency mention in email' },
    confidence: 0.6,
  });
    });
  }

  // Percentages (possible withholdings)
  const percents = extractPercentages(normalizedContent);

  const hasTaxKeywords = /(withhold|franchise tax board|ftb|tax form 593|form 593|withholding statement)/i.test(
    normalizedContent
  );
  if (hasTaxKeywords) {
    tags.add('tax');
    const firstAmount = amounts.length > 0 ? amounts[0] : null;
    const firstPercent = percents.length > 0 ? percents[0] : 3.33;
    ensureTaxWithholding(entities, relationships, messageExternalId, firstAmount, firstPercent ?? null, content);
  }

  // Document references
  for (const doc of DOCUMENT_KEYWORDS) {
    const matched = doc.patterns.some(pattern => pattern.test(content));
    if (matched) {
      tags.add('document');
      const entity = createEntity(
        'DocumentArtifact',
        doc.docType,
        {
          title: doc.docType,
          docType: doc.docType,
        },
        ['document'],
        0.7
      );
      entities.push(entity);
      relationships.push({
        type: 'MENTIONS',
        from: { externalId: messageExternalId, labels: ['Event'] },
        to: { externalId: entity.externalId, labels: entity.labels },
        properties: { mention: doc.docType },
        confidence: 0.7,
      });
    }
  }

  // Legal actions
  for (const action of LEGAL_ACTION_KEYWORDS) {
    const matched = action.patterns.some(pattern => pattern.test(content));
    if (matched) {
      tags.add('legal');
      const entity = createEntity(
        'LegalAction',
        action.actionType,
        {
          actionType: action.actionType,
          status: 'Mentioned',
        },
        ['legal'],
        0.6
      );
      entities.push(entity);
      relationships.push({
        type: 'RELATES_TO',
        from: { externalId: messageExternalId, labels: ['Event'] },
        to: { externalId: entity.externalId, labels: entity.labels },
        properties: { context: `Legal action mentioned: ${action.actionType}` },
        confidence: 0.6,
      });
    }
  }

  // Date tags (for timeline alignment)
  const dateMatches = normalizedContent.match(DATE_REGEX);
  if (dateMatches) {
    dateMatches.forEach(dateString => tags.add(`date:${dateString}`));
  }

  return {
    entities,
    relationships,
    tags: Array.from(tags),
  };
}
