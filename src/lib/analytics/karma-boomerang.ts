import { Neo4jClient } from '../neo4j';
import { EmailEvent, ContinuanceEvent } from '../ingestion/email-parser';

export interface KarmaAnalysis {
  actor: 'petitioner' | 'respondent' | 'court';
  totalDelays: number;
  totalDelayDays: number;
  cooperationScore: number;
  contradictionCount: number;
  financialInconsistencies: number;
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
}

export interface TimelineEvent {
  date: string;
  actor: string;
  action: string;
  impact: 'positive' | 'negative' | 'neutral';
  evidence: string;
  contradiction?: string;
}

export interface EvidenceItem {
  type: 'email' | 'document' | 'financial' | 'timeline';
  source: string;
  content: string;
  relevance: number;
  contradiction?: string;
}

export class KarmaBoomerangAnalyzer {
  private neo4j: Neo4jClient;

  constructor(neo4j: Neo4jClient) {
    this.neo4j = neo4j;
  }

  async analyzeOpponentBehavior(): Promise<KarmaAnalysis[]> {
    // Query Neo4j for all events and relationships
    const events = await this.neo4j.executeQuery(`
      MATCH (e:Event)-[r]-(n)
      WHERE e.actor IN ['petitioner', 'respondent']
      RETURN e, r, n
      ORDER BY e.date DESC
    `);

    const continuances = await this.neo4j.executeQuery(`
      MATCH (c:Continuance)
      RETURN c
      ORDER BY c.date DESC
    `);

    const financialEvents = await this.neo4j.executeQuery(`
      MATCH (f:FinancialEvent)
      RETURN f
      ORDER BY f.date DESC
    `);

    // Analyze each actor
    const analyses: KarmaAnalysis[] = [];
    
    for (const actor of ['petitioner', 'respondent'] as const) {
      const actorEvents = events.filter((e: any) => e.e.actor === actor);
      const actorContinuances = continuances.filter((c: any) => c.c.requestedBy === actor);
      
      const analysis: KarmaAnalysis = {
        actor,
        totalDelays: actorContinuances.length,
        totalDelayDays: actorContinuances.reduce((sum: number, c: any) => sum + (c.c.durationDays || 0), 0),
        cooperationScore: this.calculateCooperationScore(actorEvents),
        contradictionCount: this.findContradictions(actorEvents),
        financialInconsistencies: this.findFinancialInconsistencies(financialEvents.filter((f: any) => f.f.actor === actor)),
        timeline: this.buildTimeline(actorEvents, actorContinuances),
        evidence: this.collectEvidence(actorEvents, actorContinuances)
      };
      
      analyses.push(analysis);
    }

    return analyses;
  }

  private calculateCooperationScore(events: any[]): number {
    if (events.length === 0) return 0;
    
    const cooperationScores = events
      .map(e => e.e.cooperationScore || 0)
      .filter(score => score !== 0);
    
    if (cooperationScores.length === 0) return 0;
    
    return cooperationScores.reduce((sum, score) => sum + score, 0) / cooperationScores.length;
  }

  private findContradictions(events: any[]): number {
    let contradictions = 0;
    
    // Look for contradictory statements over time
    const statements = new Map<string, any[]>();
    
    events.forEach(event => {
      const key = this.extractStatementKey(event.e);
      if (key) {
        if (!statements.has(key)) {
          statements.set(key, []);
        }
        statements.get(key)!.push(event.e);
      }
    });
    
    // Check for contradictions within each statement category
    statements.forEach(statementGroup => {
      if (statementGroup.length > 1) {
        const values = statementGroup.map(s => s.value || s.content);
        if (new Set(values).size > 1) {
          contradictions++;
        }
      }
    });
    
    return contradictions;
  }

  private findFinancialInconsistencies(financialEvents: any[]): number {
    let inconsistencies = 0;
    
    // Group by financial category
    const categories = new Map<string, any[]>();
    
    financialEvents.forEach(event => {
      const category = event.f.category || 'general';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(event.f);
    });
    
    // Check for inconsistencies within each category
    categories.forEach(events => {
      if (events.length > 1) {
        const amounts = events.map(e => e.amount || 0);
        const uniqueAmounts = new Set(amounts);
        if (uniqueAmounts.size > 1) {
          inconsistencies++;
        }
      }
    });
    
    return inconsistencies;
  }

  private buildTimeline(events: any[], continuances: any[]): TimelineEvent[] {
    const timeline: TimelineEvent[] = [];
    
    // Add events
    events.forEach(event => {
      timeline.push({
        date: event.e.date,
        actor: event.e.actor,
        action: this.extractAction(event.e),
        impact: this.calculateImpact(event.e),
        evidence: event.e.snippet || event.e.description,
        contradiction: this.findEventContradiction(event.e, events)
      });
    });
    
    // Add continuances
    continuances.forEach(continuance => {
      timeline.push({
        date: continuance.c.date,
        actor: continuance.c.requestedBy,
        action: `Requested continuance: ${continuance.c.reason}`,
        impact: 'negative',
        evidence: continuance.c.snippet || continuance.c.description,
        contradiction: this.findContinuanceContradiction(continuance.c, continuances)
      });
    });
    
    return timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private collectEvidence(events: any[], continuances: any[]): EvidenceItem[] {
    const evidence: EvidenceItem[] = [];
    
    // Email evidence
    events.forEach(event => {
      if (event.e.eventType === 'communication') {
        evidence.push({
          type: 'email',
          source: event.e.sourcePath,
          content: event.e.snippet,
          relevance: this.calculateRelevance(event.e),
          contradiction: this.findEventContradiction(event.e, events)
        });
      }
    });
    
    // Continuance evidence
    continuances.forEach(continuance => {
      evidence.push({
        type: 'timeline',
        source: continuance.c.sourcePath,
        content: continuance.c.reason,
        relevance: 0.9, // High relevance for continuances
        contradiction: this.findContinuanceContradiction(continuance.c, continuances)
      });
    });
    
    return evidence.sort((a, b) => b.relevance - a.relevance);
  }

  private extractStatementKey(event: any): string | null {
    const subject = event.subject || '';
    const body = event.body || '';
    
    // Extract key statements that could be contradicted
    if (subject.includes('payment') || body.includes('$')) return 'financial';
    if (subject.includes('cooperate') || body.includes('work together')) return 'cooperation';
    if (subject.includes('schedule') || body.includes('available')) return 'availability';
    
    return null;
  }

  private extractAction(event: any): string {
    const subject = event.subject || '';
    const body = event.body || '';
    
    if (subject.includes('continuance')) return 'Requested continuance';
    if (subject.includes('cooperate')) return 'Demonstrated cooperation';
    if (subject.includes('refuse')) return 'Refused cooperation';
    if (body.includes('$') || subject.includes('payment')) return 'Financial communication';
    
    return 'General communication';
  }

  private calculateImpact(event: any): 'positive' | 'negative' | 'neutral' {
    const cooperationScore = event.cooperationScore || 0;
    
    if (cooperationScore > 0.3) return 'positive';
    if (cooperationScore < -0.3) return 'negative';
    
    return 'neutral';
  }

  private findEventContradiction(event: any, allEvents: any[]): string | undefined {
    // Look for contradictory statements in other events
    const key = this.extractStatementKey(event);
    if (!key) return undefined;
    
    const relatedEvents = allEvents.filter(e => 
      this.extractStatementKey(e.e) === key && 
      e.e.id !== event.id
    );
    
    if (relatedEvents.length > 0) {
      const values = relatedEvents.map(e => e.e.value || e.e.content);
      if (new Set(values).size > 1) {
        return `Contradicts previous statement about ${key}`;
      }
    }
    
    return undefined;
  }

  private findContinuanceContradiction(continuance: any, allContinuances: any[]): string | undefined {
    // Look for contradictory reasons for continuances
    const relatedContinuances = allContinuances.filter(c => 
      c.c.id !== continuance.id && 
      c.c.requestedBy === continuance.requestedBy
    );
    
    if (relatedContinuances.length > 0) {
      const reasons = relatedContinuances.map(c => c.c.reason);
      if (reasons.includes(continuance.reason) && reasons.length > 1) {
        return `Repeated reason: ${continuance.reason}`;
      }
    }
    
    return undefined;
  }

  private calculateRelevance(event: any): number {
    let relevance = 0.5; // Base relevance
    
    // Increase relevance for cooperation-related events
    if (event.cooperationScore > 0.5) relevance += 0.3;
    if (event.cooperationScore < -0.5) relevance += 0.3;
    
    // Increase relevance for financial events
    if (event.eventType === 'financial') relevance += 0.2;
    
    // Increase relevance for continuance requests
    if (event.eventType === 'continuance_request') relevance += 0.4;
    
    return Math.min(1, relevance);
  }

  // Generate court-ready analysis
  async generateCourtAnalysis(): Promise<string> {
    const analyses = await this.analyzeOpponentBehavior();
    
    let report = '# Opponent Behavior Analysis\n\n';
    
    analyses.forEach(analysis => {
      report += `## ${analysis.actor.toUpperCase()} ANALYSIS\n\n`;
      report += `**Total Delays:** ${analysis.totalDelays}\n`;
      report += `**Total Delay Days:** ${analysis.totalDelayDays}\n`;
      report += `**Cooperation Score:** ${analysis.cooperationScore.toFixed(2)}\n`;
      report += `**Contradictions:** ${analysis.contradictionCount}\n`;
      report += `**Financial Inconsistencies:** ${analysis.financialInconsistencies}\n\n`;
      
      if (analysis.evidence.length > 0) {
        report += `### Key Evidence\n\n`;
        analysis.evidence.slice(0, 5).forEach(evidence => {
          report += `- **${evidence.type.toUpperCase()}:** ${evidence.content}\n`;
          if (evidence.contradiction) {
            report += `  - *Contradiction: ${evidence.contradiction}*\n`;
          }
        });
        report += '\n';
      }
    });
    
    return report;
  }
}
