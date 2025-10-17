// Email parser - server-side only
// This file uses Node.js APIs and cannot run in edge runtime
import { readFileSync } from 'fs';
import { join } from 'path';

// Lazy import mailparser to avoid bundling issues
let parseEmail: any = null;
async function getMailParser() {
  if (!parseEmail) {
    const mailparser = await import('mailparser');
    parseEmail = mailparser.simpleParser;
  }
  return parseEmail;
}

export interface EmailEvent {
  id: string;
  date: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  actor: 'petitioner' | 'respondent' | 'court' | 'other';
  eventType: 'continuance_request' | 'cooperation' | 'delay' | 'financial' | 'communication';
  urgency: 'low' | 'medium' | 'high';
  cooperationScore: number; // -1 to 1
  delayDays?: number;
  sourcePath: string;
  snippet: string;
}

export interface ContinuanceEvent {
  id: string;
  date: string;
  requestedBy: 'petitioner' | 'respondent' | 'court';
  reason: string;
  durationDays: number;
  sourceEmail: string;
  justification: string;
  cooperationLevel: number;
}

export class EmailParser {
  private mboxPath: string;
  private actorEmails: Map<string, 'petitioner' | 'respondent' | 'court'>;

  constructor(mboxPath: string) {
    this.mboxPath = mboxPath;
    this.actorEmails = new Map([
      // Petitioner emails
      ['mathieu@example.com', 'petitioner'],
      ['mathieu.wauters@example.com', 'petitioner'],
      
      // Respondent emails  
      ['rosanna@example.com', 'respondent'],
      ['rosanna.alvero@example.com', 'respondent'],
      
      // Court emails
      ['court@example.com', 'court'],
      ['clerk@example.com', 'court'],
    ]);
  }

  async parseMbox(): Promise<EmailEvent[]> {
    const mboxContent = readFileSync(this.mboxPath, 'utf-8');
    const emails = this.splitMbox(mboxContent);

    const events: EmailEvent[] = [];
    const parse = await getMailParser();

    for (const email of emails) {
      try {
        const parsed = await parse(email);
        const event = this.extractEvent(parsed);
        if (event) {
          events.push(event);
        }
      } catch (error) {
        console.warn('Failed to parse email:', error);
      }
    }

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private splitMbox(content: string): string[] {
    // Split mbox by "From " lines
    const emails = content.split(/^From /m).filter(email => email.trim());
    return emails.map(email => `From ${email}`);
  }

  private extractEvent(parsed: any): EmailEvent | null {
    if (!parsed.from || !parsed.date) return null;

    const from = parsed.from.value[0]?.address || '';
    const actor = this.actorEmails.get(from) || 'other';
    
    const eventType = this.classifyEventType(parsed);
    const cooperationScore = this.calculateCooperationScore(parsed);
    const urgency = this.calculateUrgency(parsed);
    
    return {
      id: this.generateId(parsed),
      date: parsed.date.toISOString(),
      from: from,
      to: parsed.to?.value?.map((v: any) => v.address) || [],
      subject: parsed.subject || '',
      body: parsed.text || '',
      actor,
      eventType,
      urgency,
      cooperationScore,
      sourcePath: this.mboxPath,
      snippet: this.extractSnippet(parsed)
    };
  }

  private classifyEventType(parsed: any): EmailEvent['eventType'] {
    const subject = (parsed.subject || '').toLowerCase();
    const body = (parsed.text || '').toLowerCase();
    
    // Continuance requests
    if (subject.includes('continuance') || subject.includes('adjourn') || 
        body.includes('request continuance') || body.includes('adjourn hearing')) {
      return 'continuance_request';
    }
    
    // Financial discussions
    if (subject.includes('payment') || subject.includes('money') || 
        subject.includes('settlement') || body.includes('$') || body.includes('dollar')) {
      return 'financial';
    }
    
    // Cooperation indicators
    if (subject.includes('cooperate') || subject.includes('work together') ||
        body.includes('let\'s work together') || body.includes('coordinate')) {
      return 'cooperation';
    }
    
    // Delay indicators
    if (subject.includes('delay') || subject.includes('late') ||
        body.includes('running late') || body.includes('delayed')) {
      return 'delay';
    }
    
    return 'communication';
  }

  private calculateCooperationScore(parsed: any): number {
    const body = (parsed.text || '').toLowerCase();
    const subject = (parsed.subject || '').toLowerCase();
    
    let score = 0;
    
    // Positive cooperation indicators
    const positiveTerms = [
      'cooperate', 'work together', 'coordinate', 'collaborate',
      'mutual', 'agreed', 'consensus', 'compromise', 'reasonable'
    ];
    
    // Negative cooperation indicators  
    const negativeTerms = [
      'refuse', 'deny', 'object', 'oppose', 'unreasonable',
      'stubborn', 'difficult', 'non-cooperative', 'refuse to'
    ];
    
    positiveTerms.forEach(term => {
      if (body.includes(term) || subject.includes(term)) score += 0.1;
    });
    
    negativeTerms.forEach(term => {
      if (body.includes(term) || subject.includes(term)) score -= 0.1;
    });
    
    return Math.max(-1, Math.min(1, score));
  }

  private calculateUrgency(parsed: any): EmailEvent['urgency'] {
    const subject = (parsed.subject || '').toLowerCase();
    const body = (parsed.text || '').toLowerCase();
    
    const urgentTerms = ['urgent', 'asap', 'immediately', 'emergency', 'deadline'];
    const mediumTerms = ['soon', 'quickly', 'priority', 'important'];
    
    if (urgentTerms.some(term => subject.includes(term) || body.includes(term))) {
      return 'high';
    }
    
    if (mediumTerms.some(term => subject.includes(term) || body.includes(term))) {
      return 'medium';
    }
    
    return 'low';
  }

  private extractSnippet(parsed: any): string {
    const text = parsed.text || '';
    return text.substring(0, 200) + (text.length > 200 ? '...' : '');
  }

  private generateId(parsed: any): string {
    const date = parsed.date?.toISOString() || '';
    const from = parsed.from?.value?.[0]?.address || '';
    const subject = parsed.subject || '';
    return `${date}-${from}-${subject}`.replace(/[^a-zA-Z0-9-]/g, '-');
  }

  // Extract continuance events specifically
  async extractContinuances(): Promise<ContinuanceEvent[]> {
    const events = await this.parseMbox();
    
    return events
      .filter(event => event.eventType === 'continuance_request')
      .map(event => ({
        id: event.id,
        date: event.date,
        requestedBy: event.actor === 'other' ? 'petitioner' : event.actor,
        reason: this.extractContinuanceReason(event),
        durationDays: this.extractDurationDays(event),
        sourceEmail: event.from,
        justification: event.snippet,
        cooperationLevel: event.cooperationScore
      }));
  }

  private extractContinuanceReason(event: EmailEvent): string {
    const body = event.body.toLowerCase();
    
    if (body.includes('medical')) return 'Medical emergency';
    if (body.includes('travel')) return 'Travel conflict';
    if (body.includes('work')) return 'Work conflict';
    if (body.includes('family')) return 'Family emergency';
    if (body.includes('attorney')) return 'Attorney unavailable';
    
    return 'General scheduling conflict';
  }

  private extractDurationDays(event: EmailEvent): number {
    const body = event.body.toLowerCase();
    
    // Look for duration mentions
    const durationMatch = body.match(/(\d+)\s*(day|week|month)/);
    if (durationMatch) {
      const num = parseInt(durationMatch[1]);
      const unit = durationMatch[2];
      
      switch (unit) {
        case 'day': return num;
        case 'week': return num * 7;
        case 'month': return num * 30;
        default: return 14; // Default 2 weeks
      }
    }
    
    return 14; // Default duration
  }
}

// Export convenience function
export async function parseAllEmails(mboxPath: string): Promise<EmailEvent[]> {
  const parser = new EmailParser(mboxPath);
  return parser.parseMbox();
}