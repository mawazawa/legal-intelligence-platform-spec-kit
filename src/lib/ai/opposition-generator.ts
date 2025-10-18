import { env } from '../../env';
import { logger } from '../logging/logger';

export interface OppositionRequest {
  claim: string;
  evidence: Array<{
    id: string;
    content: string;
    source: string;
    similarity: number;
    metadata: Record<string, unknown>;
  }>;
  caseContext?: {
    caseNumber?: string;
    respondentName?: string;
    petitionerName?: string;
    courtName?: string;
  };
}

export interface OppositionResponse {
  paragraphs: string[];
  citations: string[];
  exhibits: Array<{
    label: string;
    description: string;
    sourceId: string;
  }>;
  legalStandards: string[];
}

export class OppositionGenerator {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'claude-sonnet-4-20250514') {
    this.apiKey = apiKey || env.ANTHROPIC_API_KEY;
    this.model = model;

    if (!this.apiKey) {
      throw new Error('Anthropic API key is required');
    }
  }

  async generateOpposition(request: OppositionRequest): Promise<OppositionResponse> {
    const startTime = Date.now();

    try {
      logger.info('Generating opposition paragraph', {
        claim: request.claim.substring(0, 100),
        evidenceCount: request.evidence.length
      });

      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(request);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 4096,
          temperature: 0.3, // Lower temperature for more factual, precise legal writing
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Anthropic API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const contentBlock = data.content[0];

      if (contentBlock.type !== 'text') {
        throw new Error('Unexpected response format from Anthropic API');
      }

      const generatedText = contentBlock.text;
      const parsed = this.parseOppositionResponse(generatedText);

      logger.info('Opposition generation completed', {
        processingTime: Date.now() - startTime,
        paragraphCount: parsed.paragraphs.length,
        citationCount: parsed.citations.length
      });

      return parsed;

    } catch (error) {
      logger.error('Opposition generation error', error as Error);
      throw error;
    }
  }

  private buildSystemPrompt(): string {
    return `You are an expert legal assistant specializing in California family law opposition filings. Your role is to help self-represented litigants draft clear, persuasive opposition paragraphs that:

1. **Directly counter false claims** with specific evidence
2. **Cite relevant legal authority** (California Family Code, Evidence Code, Rules of Court)
3. **Format citations properly** for court filings
4. **Maintain professional tone** while being forceful
5. **Focus on facts and evidence** rather than emotion

Key principles:
- Every factual assertion must be supported by specific evidence with citations
- Use declarative, confident language ("The evidence shows..." not "I believe...")
- Format: Counter-claim statement → Evidence → Legal standard application → Conclusion
- Include exhibit references for documentary evidence
- Cite to specific emails by source file and date when available

Output your response in the following JSON structure:
{
  "paragraphs": ["paragraph 1", "paragraph 2", ...],
  "citations": ["citation 1", "citation 2", ...],
  "exhibits": [{"label": "Exhibit A", "description": "...", "sourceId": "..."}],
  "legalStandards": ["CA Fam Code §2621", ...]
}`;
  }

  private buildUserPrompt(request: OppositionRequest): string {
    const { claim, evidence, caseContext } = request;

    const contextSection = caseContext
      ? `Case Context:
- Case Number: ${caseContext.caseNumber || 'N/A'}
- Respondent: ${caseContext.respondentName || 'N/A'}
- Petitioner: ${caseContext.petitionerName || 'N/A'}
- Court: ${caseContext.courtName || 'California Superior Court'}

`
      : '';

    const evidenceSection = evidence.length > 0
      ? `Supporting Evidence (${evidence.length} documents found):

${evidence.map((e, i) => `${i + 1}. Source: ${e.source}
   Relevance Score: ${(e.similarity * 100).toFixed(1)}%
   Content: ${e.content.substring(0, 500)}${e.content.length > 500 ? '...' : ''}
   Metadata: ${JSON.stringify(e.metadata)}
`).join('\n')}
`
      : 'No supporting evidence found in the database. Draft a response noting the lack of evidence for this claim.\n\n';

    return `${contextSection}Opposing Party's Claim:
"${claim}"

${evidenceSection}
Task:
Draft a compelling opposition paragraph that counters this claim using the available evidence. Include:
1. A direct rebuttal statement
2. Specific evidence citations with exhibit labels
3. Applicable legal standards
4. A conclusion that undermines the claim's credibility

Output the response as valid JSON matching the specified structure.`;
  }

  private parseOppositionResponse(text: string): OppositionResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        paragraphs: Array.isArray(parsed.paragraphs) ? parsed.paragraphs : [text],
        citations: Array.isArray(parsed.citations) ? parsed.citations : [],
        exhibits: Array.isArray(parsed.exhibits) ? parsed.exhibits : [],
        legalStandards: Array.isArray(parsed.legalStandards) ? parsed.legalStandards : []
      };
    } catch (error) {
      logger.warn('Failed to parse JSON response, returning raw text', {
        error: error instanceof Error ? error.message : String(error)
      });

      // Fallback: return raw text as a single paragraph
      return {
        paragraphs: [text],
        citations: [],
        exhibits: [],
        legalStandards: []
      };
    }
  }

  /**
   * Generate multiple opposition paragraphs for a batch of claims
   */
  async generateBatch(requests: OppositionRequest[]): Promise<OppositionResponse[]> {
    const results: OppositionResponse[] = [];

    for (const request of requests) {
      const result = await this.generateOpposition(request);
      results.push(result);

      // Rate limiting: wait between requests
      if (results.length < requests.length) {
        await this.delay(1000);
      }
    }

    return results;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let oppositionGenerator: OppositionGenerator | null = null;

export function getOppositionGenerator(): OppositionGenerator {
  if (!oppositionGenerator) {
    oppositionGenerator = new OppositionGenerator();
  }
  return oppositionGenerator;
}
