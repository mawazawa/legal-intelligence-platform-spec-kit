import { extractEntitiesFromEmail } from '../email-entity-extractor';

describe('extractEntitiesFromEmail', () => {
  const baseParams = {
    messageExternalId: 'email_test_1',
    subject: 'Re: Form 593 and withholding',
    from: 'mcook@chartwellescrow.com',
    to: ['mathieuwauters@gmail.com'],
    cc: [] as string[],
  };

  it('extracts tax withholding entities and relationships', () => {
    const body = `
      We are required to withhold 3.33% of the sale price per Form 593.
      The withholding check to Franchise Tax Board will be for $13,694.62 unless a corrected exemption is delivered.
    `;

    const result = extractEntitiesFromEmail({ ...baseParams, body });

    const taxEntity = result.entities.find(entity => entity.labels.includes('TaxWithholding'));
    expect(taxEntity).toBeTruthy();
    expect(taxEntity?.properties.amount).toBe(13694.62);
    expect(taxEntity?.properties.percentage).toBeCloseTo(3.33);

    const hasFtbOrg = result.entities.some(entity => entity.labels.includes('Organization') && entity.properties.name === 'Franchise Tax Board');
    expect(hasFtbOrg).toBe(true);

    const relatesRelationship = result.relationships.find(
      rel => rel.type === 'RELATES_TO' && rel.to.externalId === taxEntity?.externalId
    );
    expect(relatesRelationship).toBeTruthy();
  });

  it('recognizes legal lien references', () => {
    const body = `
      Simon Law recorded a FLARPL lien for $60,000 on Rosanna's share.
      We will release the lien with a $0 demand once closing occurs.
    `;

    const result = extractEntitiesFromEmail({ ...baseParams, messageExternalId: 'email_test_2', body });

    const legalEntity = result.entities.find(entity => entity.labels.includes('LegalAction'));
    expect(legalEntity).toBeTruthy();
    expect(legalEntity?.properties.actionType).toMatch(/Lien/i);

    const monetaryEntity = result.entities.find(entity => entity.labels.includes('FinancialTransaction') && entity.properties.amount === 60000);
    expect(monetaryEntity).toBeTruthy();
  });
});
