import { env } from '../../env';
import type { OppositionRequest, Opposition } from '../../types/opposition';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

/**
 * Generate opposition paragraph using Anthropic Claude
 * KISS principle: Simple function, no class wrapper needed
 */
export async function generateOpposition(request: OppositionRequest): Promise<Opposition> {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      temperature: 0.3,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(request) }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return parseResponse(data.content[0]?.text || '');
}

function buildSystemPrompt(): string {
  return `You are a California family law expert. Generate opposition paragraphs that:
1. Counter false claims with specific evidence
2. Cite California Family Code, Evidence Code, Rules of Court
3. Use confident, declarative language
4. Format: Counter-claim → Evidence → Legal standard → Conclusion

Output as JSON:
{
  "paragraphs": ["..."],
  "citations": ["CA Fam Code §2621"],
  "exhibits": [{"label": "Exhibit A", "description": "...", "sourceId": "..."}],
  "legalStandards": ["..."]
}`;
}

function buildUserPrompt({ claim, evidence, caseContext }: OppositionRequest): string {
  const context = caseContext
    ? `Case: ${caseContext.caseNumber || 'N/A'} | Respondent: ${caseContext.respondentName || 'N/A'}\n\n`
    : '';

  const evidenceText = evidence.length > 0
    ? `Evidence (${evidence.length} docs):\n${evidence
        .map((e, i) => `${i + 1}. ${e.source} (${(e.similarity * 100).toFixed(0)}%)\n${e.content.slice(0, 400)}...`)
        .join('\n\n')}`
    : 'No evidence found - note this in response';

  return `${context}Claim: "${claim}"\n\n${evidenceText}\n\nGenerate opposition as JSON.`;
}

function parseResponse(text: string): Opposition {
  try {
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (!json) throw new Error('No JSON in response');

    const parsed = JSON.parse(json);
    return {
      paragraphs: Array.isArray(parsed.paragraphs) ? parsed.paragraphs : [text],
      citations: Array.isArray(parsed.citations) ? parsed.citations : [],
      exhibits: Array.isArray(parsed.exhibits) ? parsed.exhibits : [],
      legalStandards: Array.isArray(parsed.legalStandards) ? parsed.legalStandards : []
    };
  } catch {
    // Fallback: return raw text
    return {
      paragraphs: [text],
      citations: [],
      exhibits: [],
      legalStandards: []
    };
  }
}
