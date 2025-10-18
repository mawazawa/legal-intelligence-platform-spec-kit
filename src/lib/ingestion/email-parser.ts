import 'server-only';

/**
 * Email event extracted from mbox files
 * Represents a single email message with semantic analysis
 */
export interface EmailEvent {
  externalId: string;
  type: 'email';
  date: string;
  description: string;
  actor: 'petitioner' | 'respondent' | 'attorney' | 'court' | 'other';
  sourcePath: string;
  snippet: string;
  metadata: {
    from: string;
    to: string[];
    cc: string[];
    subject: string;
    messageId: string;
  };
}

/**
 * Continuance event extracted from email analysis
 * Represents a request for delay/postponement
 */
export interface ContinuanceEvent {
  externalId: string;
  date: string;
  requestedBy: 'petitioner' | 'respondent' | 'court';
  reason: string;
  durationDays: number;
  sourceEmail: string;
  justification: string;
  cooperationLevel: number;
}

/**
 * Parsed email message structure
 * Internal representation after parsing raw mbox format
 */
interface ParsedEmail {
  messageId: string;
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  date: string;
  body: string;
  headers: Record<string, string>;
}

/**
 * EmailParser: Extracts and analyzes emails from mbox format
 * Applies semantic analysis to classify emails by actor and event type
 */
export class EmailParser {
  private actorPatterns = {
    respondent: [
      'mathieu@example.com',
      'mathieu.wauters@example.com',
      'mathieuwauters@gmail.com'
    ],
    petitioner: [
      'rosanna@example.com',
      'rosanna.alvero@example.com',
      'roseyalvero@gmail.com'
    ],
    attorney: [
      '@lawfirm.com',
      '@law.com',
      'selam@',
      'attorney',
      'counsel'
    ],
    court: [
      'court@',
      '@sftc.org',
      '@courts.ca.gov',
      'clerk@'
    ]
  };

  /**
   * Parse a single email block from mbox format
   * Returns null if parsing fails
   */
  parseEmailBlock(block: string): ParsedEmail | null {
    try {
      const lines = block.split('\n');
      const headers: Record<string, string> = {};
      let bodyStart = 0;

      // Parse headers
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') {
          bodyStart = i + 1;
          break;
        }

        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          headers[key] = value;
        }
      }

      // Require minimum headers
      if (!headers['From'] || !headers['Subject']) {
        return null;
      }

      const body = lines.slice(bodyStart).join('\n').trim();

      return {
        messageId: headers['Message-ID'] || `<${Date.now()}@generated>`,
        from: headers['From'] || '',
        to: this.parseAddresses(headers['To'] || ''),
        cc: this.parseAddresses(headers['Cc'] || ''),
        subject: headers['Subject'] || '',
        date: headers['Date'] || new Date().toISOString(),
        body,
        headers
      };
    } catch {
      return null;
    }
  }

  /**
   * Parse comma-separated email addresses
   */
  private parseAddresses(addressString: string): string[] {
    if (!addressString) return [];
    return addressString
      .split(',')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);
  }

  /**
   * Determine actor type based on email metadata
   */
  determineActor(
    from: string,
    subject: string,
    body: string
  ): 'petitioner' | 'respondent' | 'attorney' | 'court' | 'other' {
    const lowerFrom = from.toLowerCase();
    const lowerSubject = subject.toLowerCase();
    const lowerBody = body.toLowerCase();

    // Check petitioner
    if (this.actorPatterns.petitioner.some(pattern =>
      lowerFrom.includes(pattern.toLowerCase())
    )) {
      return 'petitioner';
    }

    // Check respondent
    if (this.actorPatterns.respondent.some(pattern =>
      lowerFrom.includes(pattern.toLowerCase())
    )) {
      return 'respondent';
    }

    // Check court
    if (this.actorPatterns.court.some(pattern =>
      lowerFrom.includes(pattern.toLowerCase())
    )) {
      return 'court';
    }

    // Check attorney
    if (this.actorPatterns.attorney.some(pattern =>
      lowerFrom.includes(pattern.toLowerCase()) ||
      lowerSubject.includes(pattern.toLowerCase()) ||
      lowerBody.includes(pattern.toLowerCase())
    )) {
      return 'attorney';
    }

    return 'other';
  }

  /**
   * Generate semantic description of email content
   */
  generateDescription(email: ParsedEmail): string {
    const subject = email.subject.toLowerCase();
    const body = email.body.toLowerCase();
    const combined = `${subject} ${body}`;

    if (combined.includes('continuance') || combined.includes('postpone') || combined.includes('adjourn')) {
      return 'Continuance request';
    }
    if (combined.includes('hearing') || combined.includes('schedule')) {
      return 'Hearing communication';
    }
    if (combined.includes('motion')) {
      return 'Motion filing';
    }
    if (combined.includes('payment') || combined.includes('invoice') || combined.includes('$')) {
      return 'Financial communication';
    }
    if (combined.includes('cooperate') || combined.includes('agree')) {
      return 'Cooperation attempt';
    }
    if (combined.includes('refuse') || combined.includes('object') || combined.includes('oppose')) {
      return 'Objection or refusal';
    }

    return 'General communication';
  }

  /**
   * Extract email snippet (first N characters, removing quoted text)
   */
  extractSnippet(body: string, maxLength: number = 200): string {
    // Remove quoted text
    let cleaned = body
      .split('\n')
      .filter(line => !line.trim().startsWith('>'))
      .join('\n')
      .trim();

    // Truncate to maxLength
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength).trim() + '...';
    }

    return cleaned;
  }

  /**
   * Detect continuance requests from email list
   */
  detectContinuances(emails: EmailEvent[]): ContinuanceEvent[] {
    return emails
      .filter(email => email.description.toLowerCase().includes('continuance'))
      .map((email) => ({
        externalId: email.externalId,
        date: email.date,
        requestedBy: email.actor === 'other' ? 'petitioner' : email.actor as 'petitioner' | 'respondent' | 'court',
        reason: this.extractContinuanceReason(email.metadata.subject, email.snippet),
        durationDays: this.extractDurationDays(email.snippet),
        sourceEmail: email.metadata.from,
        justification: email.snippet,
        cooperationLevel: 0
      }));
  }

  /**
   * Extract continuance reason from email
   */
  private extractContinuanceReason(subject: string, snippet: string): string {
    const combined = `${subject} ${snippet}`.toLowerCase();

    if (combined.includes('medical')) return 'Medical emergency';
    if (combined.includes('travel')) return 'Travel conflict';
    if (combined.includes('work')) return 'Work conflict';
    if (combined.includes('family')) return 'Family emergency';
    if (combined.includes('attorney')) return 'Attorney unavailable';
    if (combined.includes('preparation')) return 'Insufficient preparation time';

    return 'General scheduling conflict';
  }

  /**
   * Extract number of days from continuation request
   */
  private extractDurationDays(text: string): number {
    const match = text.match(/(\d+)\s*(day|week|month)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      switch (unit) {
        case 'week': return num * 7;
        case 'month': return num * 30;
        default: return num;
      }
    }
    return 14; // Default: 2 weeks
  }

  /**
   * Analyze delay patterns by actor
   */
  analyzeDelays(emails: EmailEvent[]): {
    byActor: Record<string, number>;
    timeline: Array<{ date: string; actor: string; delayDays: number }>;
  } {
    const byActor: Record<string, number> = {};
    const timeline: Array<{ date: string; actor: string; delayDays: number }> = [];

    const continuances = this.detectContinuances(emails);

    continuances.forEach(cont => {
      byActor[cont.requestedBy] = (byActor[cont.requestedBy] || 0) + 1;
      timeline.push({
        date: cont.date,
        actor: cont.requestedBy,
        delayDays: cont.durationDays
      });
    });

    return {
      byActor,
      timeline: timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };
  }
}

/**
 * Parse all emails from an mbox file
 * Convenience function that creates parser and returns events
 */
export async function parseAllEmails(mboxContent: string): Promise<EmailEvent[]> {
  const parser = new EmailParser();
  const events: EmailEvent[] = [];

  // Split by email boundaries (lines starting with "From ")
  const emailBlocks = mboxContent
    .split(/^From /m)
    .filter(block => block.trim())
    .map(block => `From ${block}`);

  let index = 0;
  for (const block of emailBlocks) {
    const parsed = parser.parseEmailBlock(block);
    if (parsed) {
      const actor = parser.determineActor(parsed.from, parsed.subject, parsed.body);
      const description = parser.generateDescription(parsed);
      const snippet = parser.extractSnippet(parsed.body);

      events.push({
        externalId: `email_${index++}`,
        type: 'email',
        date: parsed.date,
        description,
        actor,
        sourcePath: '',
        snippet,
        metadata: {
          from: parsed.from,
          to: parsed.to,
          cc: parsed.cc,
          subject: parsed.subject,
          messageId: parsed.messageId
        }
      });
    }
  }

  return events;
}
