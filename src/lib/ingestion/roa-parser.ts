import fs from 'fs/promises';
import path from 'path';
import { logger } from '@/lib/logging/logger';

export interface ROAEvent {
  externalId: string;
  type: 'continuance' | 'filing' | 'hearing' | 'order';
  date: string;
  description: string;
  actor: 'petitioner' | 'respondent' | 'court' | 'attorney' | 'other';
  sourcePath: string;
  snippet: string;
  metadata: {
    caseNumber?: string;
    documentType?: string;
    hearingDate?: string;
    continuanceReason?: string;
    durationDays?: number;
  };
}

export interface ParsedROAEntry {
  date: string;
  description: string;
  actor: string;
  documentType?: string;
  hearingDate?: string;
  continuanceReason?: string;
  durationDays?: number;
}

export class ROAParser {
  private actorMapping: Record<string, 'petitioner' | 'respondent' | 'court' | 'attorney' | 'other'> = {
    'petitioner': 'petitioner',
    'respondent': 'respondent',
    'alvero': 'petitioner',
    'wauters': 'respondent',
    'court': 'court',
    'judge': 'court',
    'attorney': 'attorney',
    'counsel': 'attorney'
  };

  async parseCSVFile(filePath: string): Promise<ROAEvent[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const entries = this.parseCSVContent(content);

      return entries.map((entry, index) => this.convertToEvent(entry, filePath, index));
    } catch (error) {
      logger.error(`Error parsing CSV file ${filePath}`, error as Error);
      return [];
    }
  }

  async parseTextFile(filePath: string): Promise<ROAEvent[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const entries = this.parseTextContent(content);

      return entries.map((entry, index) => this.convertToEvent(entry, filePath, index));
    } catch (error) {
      logger.error(`Error parsing text file ${filePath}`, error as Error);
      return [];
    }
  }

  private parseCSVContent(content: string): ParsedROAEntry[] {
    const lines = content.split('\n').filter(line => line.trim());
    const entries: ParsedROAEntry[] = [];
    
    // Skip header if present
    let startIndex = 0;
    if (lines[0] && lines[0].toLowerCase().includes('date')) {
      startIndex = 1;
    }
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      const entry = this.parseCSVLine(line);
      if (entry) {
        entries.push(entry);
      }
    }
    
    return entries;
  }

  private parseCSVLine(line: string): ParsedROAEntry | null {
    const columns = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
    
    if (columns.length < 2) {
      return null;
    }
    
    const date = columns[0];
    const description = columns[1];
    const actor = columns[2] || '';
    const documentType = columns[3] || '';
    
    return {
      date,
      description,
      actor,
      documentType,
      continuanceReason: this.extractContinuanceReason(description),
      durationDays: this.extractDurationDays(description),
      hearingDate: this.extractHearingDate(description)
    };
  }

  private parseTextContent(content: string): ParsedROAEntry[] {
    const entries: ParsedROAEntry[] = [];
    const lines = content.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const entry = this.parseTextLine(line);
      if (entry) {
        entries.push(entry);
      }
    }
    
    return entries;
  }

  private parseTextLine(line: string): ParsedROAEntry | null {
    // Try to extract date and description from various formats
    const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) {
      return null;
    }
    
    const date = dateMatch[1];
    const description = line.replace(dateMatch[0], '').trim();
    
    return {
      date,
      description,
      actor: this.extractActor(description),
      continuanceReason: this.extractContinuanceReason(description),
      durationDays: this.extractDurationDays(description),
      hearingDate: this.extractHearingDate(description)
    };
  }

  private convertToEvent(entry: ParsedROAEntry, sourcePath: string, index: number): ROAEvent {
    const actor = this.determineActor(entry.actor, entry.description);
    const type = this.determineType(entry.description);
    const snippet = this.extractSnippet(entry.description);
    
    return {
      externalId: `roa_${path.basename(sourcePath)}_${index}`,
      type,
      date: entry.date,
      description: entry.description,
      actor,
      sourcePath,
      snippet,
      metadata: {
        documentType: entry.documentType,
        hearingDate: entry.hearingDate,
        continuanceReason: entry.continuanceReason,
        durationDays: entry.durationDays
      }
    };
  }

  private determineActor(actorString: string, description: string): 'petitioner' | 'respondent' | 'court' | 'attorney' | 'other' {
    const text = `${actorString} ${description}`.toLowerCase();
    
    for (const [key, actor] of Object.entries(this.actorMapping)) {
      if (text.includes(key.toLowerCase())) {
        return actor;
      }
    }
    
    // Default to court for orders and hearings
    if (text.includes('order') || text.includes('hearing') || text.includes('ruling')) {
      return 'court';
    }
    
    return 'other';
  }

  private determineType(description: string): 'continuance' | 'filing' | 'hearing' | 'order' {
    const text = description.toLowerCase();
    
    if (text.includes('continuance') || text.includes('adjourn') || text.includes('postpone')) {
      return 'continuance';
    }
    
    if (text.includes('hearing') || text.includes('trial')) {
      return 'hearing';
    }
    
    if (text.includes('order') || text.includes('ruling') || text.includes('judgment')) {
      return 'order';
    }
    
    return 'filing';
  }

  private extractSnippet(description: string, maxLength: number = 200): string {
    if (description.length <= maxLength) {
      return description;
    }
    
    return description.substring(0, maxLength) + '...';
  }

  private extractActor(description: string): string {
    const text = description.toLowerCase();
    
    if (text.includes('petitioner') || text.includes('alvero')) {
      return 'petitioner';
    }
    
    if (text.includes('respondent') || text.includes('wauters')) {
      return 'respondent';
    }
    
    if (text.includes('court') || text.includes('judge')) {
      return 'court';
    }
    
    if (text.includes('attorney') || text.includes('counsel')) {
      return 'attorney';
    }
    
    return 'other';
  }

  private extractContinuanceReason(description: string): string | undefined {
    const text = description.toLowerCase();
    
    if (text.includes('medical')) {
      return 'Medical reasons';
    }
    
    if (text.includes('attorney') || text.includes('counsel')) {
      return 'Attorney availability';
    }
    
    if (text.includes('discovery')) {
      return 'Discovery issues';
    }
    
    if (text.includes('settlement') || text.includes('mediation')) {
      return 'Settlement discussions';
    }
    
    if (text.includes('emergency') || text.includes('urgent')) {
      return 'Emergency';
    }
    
    return undefined;
  }

  private extractDurationDays(description: string): number | undefined {
    const delayMatch = description.match(/(\d+)\s*(?:day|week|month)/i);
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

  private extractHearingDate(description: string): string | undefined {
    const dateMatch = description.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/);
    return dateMatch ? dateMatch[1] : undefined;
  }

  // Analysis methods
  analyzeContinuances(events: ROAEvent[]): {
    byActor: Record<string, number>;
    byReason: Record<string, number>;
    timeline: Array<{
      date: string;
      actor: string;
      reason?: string;
      durationDays?: number;
    }>;
  } {
    const continuances = events.filter(event => event.type === 'continuance');
    
    const byActor: Record<string, number> = {};
    const byReason: Record<string, number> = {};
    const timeline: Array<{
      date: string;
      actor: string;
      reason?: string;
      durationDays?: number;
    }> = [];

    for (const continuance of continuances) {
      byActor[continuance.actor] = (byActor[continuance.actor] || 0) + 1;
      
      const reason = continuance.metadata.continuanceReason || 'Unknown';
      byReason[reason] = (byReason[reason] || 0) + 1;
      
      timeline.push({
        date: continuance.date,
        actor: continuance.actor,
        reason,
        durationDays: continuance.metadata.durationDays
      });
    }

    return { byActor, byReason, timeline };
  }

  calculateTotalDelays(events: ROAEvent[]): {
    totalDays: number;
    byActor: Record<string, number>;
    averageDelay: number;
  } {
    const continuances = events.filter(event => event.type === 'continuance');
    
    let totalDays = 0;
    const byActor: Record<string, number> = {};
    
    for (const continuance of continuances) {
      const days = continuance.metadata.durationDays || 0;
      totalDays += days;
      byActor[continuance.actor] = (byActor[continuance.actor] || 0) + days;
    }
    
    const averageDelay = continuances.length > 0 ? totalDays / continuances.length : 0;
    
    return { totalDays, byActor, averageDelay };
  }
}

// Utility function to parse ROA files
export async function parseROAFiles(): Promise<ROAEvent[]> {
  const parser = new ROAParser();
  const events: ROAEvent[] = [];
  
  // Look for ROA files in various locations
  const possiblePaths = [
    path.resolve(process.cwd(), '..', 'case-filing-transaction-history copy.csv'),
    path.resolve(process.cwd(), '..', 'case-filing-transaction-history.csv'),
    path.resolve(process.cwd(), '..', 'ROA.txt'),
    path.resolve(process.cwd(), '..', 'register-of-actions.txt')
  ];
  
  for (const filePath of possiblePaths) {
    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        if (filePath.endsWith('.csv')) {
          const csvEvents = await parser.parseCSVFile(filePath);
          events.push(...csvEvents);
        } else {
          const textEvents = await parser.parseTextFile(filePath);
          events.push(...textEvents);
        }
      }
    } catch (error) {
      // File doesn't exist, continue
    }
  }
  
  return events;
}
