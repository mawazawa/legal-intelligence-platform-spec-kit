import fs from 'fs/promises';
import path from 'path';

export interface EmailEvent {
  externalId: string;
  type: 'email';
  date: string;
  description: string;
  actor: 'petitioner' | 'respondent' | 'court' | 'attorney' | 'other';
  sourcePath: string;
  snippet: string;
  metadata: {
    from: string;
    to: string[];
    cc?: string[];
    subject: string;
    messageId: string;
  };
}

export interface ParsedEmail {
  messageId: string;
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  date: string;
  body: string;
  headers: Record<string, string>;
}

export class EmailParser {
  private actorMapping: Record<string, 'petitioner' | 'respondent' | 'court' | 'attorney' | 'other'> = {
    'mathieuwauters@gmail.com': 'respondent',
    'mathieu.wauters': 'respondent',
    'rosanna.alvero': 'petitioner',
    'rosanna': 'petitioner',
    'selam.gezahegn': 'attorney',
    'selam@': 'attorney',
    'berman': 'attorney',
    'court': 'court',
    'sftc.org': 'court',
    'superior court': 'court'
  };

  async parseMboxFile(filePath: string): Promise<EmailEvent[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const emails = this.parseMboxContent(content);
      
      return emails.map(email => this.convertToEvent(email, filePath));
    } catch (error) {
      console.error(`Error parsing mbox file ${filePath}:`, error);
      return [];
    }
  }

  async parseMboxDirectory(directoryPath: string): Promise<EmailEvent[]> {
    try {
      const files = await fs.readdir(directoryPath);
      const mboxFiles = files.filter(file => file.endsWith('.mbox'));
      
      const allEvents: EmailEvent[] = [];
      
      for (const file of mboxFiles) {
        const filePath = path.join(directoryPath, file);
        const events = await this.parseMboxFile(filePath);
        allEvents.push(...events);
      }
      
      return allEvents;
    } catch (error) {
      console.error(`Error parsing mbox directory ${directoryPath}:`, error);
      return [];
    }
  }

  private parseMboxContent(content: string): ParsedEmail[] {
    const emails: ParsedEmail[] = [];
    const emailBlocks = content.split(/^From /m).filter(block => block.trim());
    
    for (const block of emailBlocks) {
      try {
        const email = this.parseEmailBlock(block);
        if (email) {
          emails.push(email);
        }
      } catch (error) {
        console.warn('Error parsing email block:', error);
      }
    }
    
    return emails;
  }

  private parseEmailBlock(block: string): ParsedEmail | null {
    const lines = block.split('\n');
    const headers: Record<string, string> = {};
    let bodyStart = -1;
    
    // Parse headers
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.trim() === '') {
        bodyStart = i + 1;
        break;
      }
      
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        headers[key.toLowerCase()] = value;
      }
    }
    
    if (bodyStart === -1) {
      return null;
    }
    
    // Extract body
    const body = lines.slice(bodyStart).join('\n').trim();
    
    // Extract key fields
    const from = headers['from'] || '';
    const to = this.parseEmailList(headers['to'] || '');
    const cc = this.parseEmailList(headers['cc'] || '');
    const subject = headers['subject'] || '';
    const date = headers['date'] || '';
    const messageId = headers['message-id'] || '';
    
    return {
      messageId,
      from,
      to,
      cc,
      subject,
      date,
      body,
      headers
    };
  }

  private parseEmailList(emailString: string): string[] {
    if (!emailString) return [];
    
    return emailString
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
  }

  private convertToEvent(email: ParsedEmail, sourcePath: string): EmailEvent {
    const actor = this.determineActor(email.from, email.subject, email.body);
    const description = this.generateDescription(email);
    const snippet = this.extractSnippet(email.body);
    
    return {
      externalId: `email_${email.messageId}`,
      type: 'email',
      date: email.date,
      description,
      actor,
      sourcePath,
      snippet,
      metadata: {
        from: email.from,
        to: email.to,
        cc: email.cc,
        subject: email.subject,
        messageId: email.messageId
      }
    };
  }

  private determineActor(
    from: string,
    subject: string,
    body: string
  ): 'petitioner' | 'respondent' | 'court' | 'attorney' | 'other' {
    const text = `${from} ${subject} ${body}`.toLowerCase();
    
    for (const [key, actor] of Object.entries(this.actorMapping)) {
      if (text.includes(key.toLowerCase())) {
        return actor;
      }
    }
    
    return 'other';
  }

  private generateDescription(email: ParsedEmail): string {
    const subject = email.subject;
    const from = email.from;
    
    if (subject.toLowerCase().includes('continuance')) {
      return `Continuance request: ${subject}`;
    }
    
    if (subject.toLowerCase().includes('hearing')) {
      return `Hearing communication: ${subject}`;
    }
    
    if (subject.toLowerCase().includes('motion')) {
      return `Motion filing: ${subject}`;
    }
    
    if (subject.toLowerCase().includes('discovery')) {
      return `Discovery request: ${subject}`;
    }
    
    return `Email communication: ${subject}`;
  }

  private extractSnippet(body: string, maxLength: number = 200): string {
    // Remove quoted text and signatures
    const cleaned = body
      .replace(/^>.*$/gm, '') // Remove quoted lines
      .replace(/^On.*wrote:$/gm, '') // Remove "On ... wrote:" lines
      .replace(/^--\s*$/gm, '') // Remove signature separators
      .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
      .trim();
    
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    
    // Find a good break point
    const truncated = cleaned.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const lastPeriod = truncated.lastIndexOf('.');
    const lastNewline = truncated.lastIndexOf('\n');
    
    const breakPoint = Math.max(lastPeriod, lastNewline, lastSpace);
    
    if (breakPoint > maxLength * 0.7) {
      return cleaned.substring(0, breakPoint + 1) + '...';
    }
    
    return truncated + '...';
  }

  // Continuance detection
  detectContinuances(emails: EmailEvent[]): EmailEvent[] {
    return emails.filter(email => {
      const text = `${email.description} ${email.snippet}`.toLowerCase();
      return text.includes('continuance') || 
             text.includes('adjourn') || 
             text.includes('postpone') ||
             text.includes('reschedule');
    });
  }

  // Delay analysis
  analyzeDelays(emails: EmailEvent[]): {
    byActor: Record<string, number>;
    timeline: Array<{
      date: string;
      actor: string;
      description: string;
      delayDays?: number;
    }>;
  } {
    const byActor: Record<string, number> = {};
    const timeline: Array<{
      date: string;
      actor: string;
      description: string;
      delayDays?: number;
    }> = [];

    for (const email of emails) {
      byActor[email.actor] = (byActor[email.actor] || 0) + 1;
      
      timeline.push({
        date: email.date,
        actor: email.actor,
        description: email.description,
        delayDays: this.extractDelayDays(email.snippet)
      });
    }

    return { byActor, timeline };
  }

  private extractDelayDays(snippet: string): number | undefined {
    const delayMatch = snippet.match(/(\d+)\s*(?:day|week|month)/i);
    if (delayMatch) {
      const value = parseInt(delayMatch[1]);
      const unit = delayMatch[0].toLowerCase();
      
      if (unit.includes('week')) {
        return value * 7;
      } else if (unit.includes('month')) {
        return value * 30;
      } else {
        return value;
      }
    }
    
    return undefined;
  }
}

// Utility function to parse all mbox files in the Mail directory
export async function parseAllEmails(): Promise<EmailEvent[]> {
  const parser = new EmailParser();
  const mailDir = path.resolve(process.cwd(), '..', 'Mail');
  
  try {
    return await parser.parseMboxDirectory(mailDir);
  } catch (error) {
    console.error('Error parsing emails:', error);
    return [];
  }
}
