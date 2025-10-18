/**
 * Advanced Auto-Tagging and Renaming Service
 * Provides intelligent document classification, tagging, and renaming capabilities
 */

export interface DocumentMetadata {
  filename: string;
  originalName: string;
  content?: string;
  fileType: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  author?: string;
  caseNumber?: string;
  pageCount?: number;
}

export interface AutoTaggingResult {
  tags: string[];
  category: 'core' | 'supporting' | 'reference' | 'exhibit';
  relevance: 'critical' | 'important' | 'supporting' | 'reference';
  suggestedName: string;
  confidence: number;
  reasoning: string[];
}

export interface RenamingRule {
  pattern: RegExp;
  template: string;
  priority: number;
  description: string;
}

export class AutoTaggingService {
  private static instance: AutoTaggingService;
  
  // Legal document patterns and keywords
  private readonly legalPatterns = {
    judgment: {
      keywords: ['judgment', 'statement of decision', 'final order', 'court order', 'decision'],
      patterns: [/judgment/i, /statement\s+of\s+decision/i, /final\s+order/i],
      tags: ['judgment', 'core-document', 'court-order'],
      category: 'core' as const,
      relevance: 'critical' as const
    },
    rfo: {
      keywords: ['request for order', 'rfo', 'motion', 'petitioner'],
      patterns: [/request\s+for\s+order/i, /rfo/i, /motion/i],
      tags: ['rfo', 'petitioner-filing', 'motion'],
      category: 'core' as const,
      relevance: 'critical' as const
    },
    fl320: {
      keywords: ['fl320', 'responsive declaration', 'respondent', 'declaration'],
      patterns: [/fl320/i, /responsive\s+declaration/i, /respondent/i],
      tags: ['fl320', 'respondent-filing', 'declaration'],
      category: 'core' as const,
      relevance: 'critical' as const
    },
    exhibit: {
      keywords: ['exhibit', 'attachment', 'supporting document'],
      patterns: [/exhibit\s+[a-z]/i, /attachment/i],
      tags: ['exhibit', 'evidence', 'supporting'],
      category: 'exhibit' as const,
      relevance: 'important' as const
    },
    financial: {
      keywords: ['closing statement', 'financial', 'escrow', 'bank statement', 'mortgage'],
      patterns: [/closing\s+statement/i, /financial/i, /escrow/i, /bank\s+statement/i],
      tags: ['financial', 'closing-statement', 'banking'],
      category: 'supporting' as const,
      relevance: 'important' as const
    },
    email: {
      keywords: ['email', 'correspondence', 'communication', 'letter'],
      patterns: [/email/i, /correspondence/i, /communication/i],
      tags: ['email', 'communication', 'correspondence'],
      category: 'supporting' as const,
      relevance: 'supporting' as const
    }
  };

  // Content-based tagging patterns
  private readonly contentPatterns = {
    mortgageArrears: {
      keywords: ['mortgage arrears', 'arrears', 'late payment', 'delinquent'],
      tags: ['mortgage-arrears', 'debt']
    },
    taxWithholding: {
      keywords: ['tax withholding', 'withholding', 'tax credit', 'irs'],
      tags: ['tax-withholding', 'tax-credit']
    },
    wattsCharges: {
      keywords: ['watts charges', 'watts', 'occupancy', 'use and occupancy'],
      tags: ['watts-charges', 'occupancy']
    },
    distribution: {
      keywords: ['distribution', 'split', 'division', 'percentage', 'allocation'],
      tags: ['distribution-calculation', 'property-division']
    },
    attorneyFees: {
      keywords: ['attorney fees', 'legal fees', 'costs', 'fees'],
      tags: ['attorney-fees', 'legal-costs']
    },
    settlement: {
      keywords: ['settlement', 'agreement', 'stipulation', 'mediation'],
      tags: ['settlement', 'agreement']
    }
  };

  // Renaming rules with priority
  private readonly renamingRules: RenamingRule[] = [
    {
      pattern: /judgment|statement\s+of\s+decision/i,
      template: 'Judgment - Statement of Decision - {date}',
      priority: 1,
      description: 'Judgment documents'
    },
    {
      pattern: /rfo|request\s+for\s+order/i,
      template: 'RFO - Petitioner - {date}',
      priority: 2,
      description: 'Request for Order documents'
    },
    {
      pattern: /fl320|responsive\s+declaration/i,
      template: 'FL-320 - Respondent - {date}',
      priority: 3,
      description: 'Responsive Declaration documents'
    },
    {
      pattern: /closing\s+statement/i,
      template: 'Closing Statement - {date}',
      priority: 4,
      description: 'Financial closing statements'
    },
    {
      pattern: /exhibit/i,
      template: 'Exhibit {letter} - {description} - {date}',
      priority: 5,
      description: 'Exhibit documents'
    },
    {
      pattern: /email|correspondence/i,
      template: 'Email - {sender} - {date}',
      priority: 6,
      description: 'Email communications'
    }
  ];

  public static getInstance(): AutoTaggingService {
    if (!AutoTaggingService.instance) {
      AutoTaggingService.instance = new AutoTaggingService();
    }
    return AutoTaggingService.instance;
  }

  /**
   * Analyze document and generate auto-tags, category, relevance, and suggested name
   */
  public analyzeDocument(metadata: DocumentMetadata): AutoTaggingResult {
    const filename = metadata.filename.toLowerCase();
    const content = metadata.content?.toLowerCase() || '';
    const combinedText = `${filename} ${content}`;

    let bestMatch: any = null;
    let highestConfidence = 0;
    const allTags = new Set<string>();
    const reasoning: string[] = [];

    // Analyze filename patterns
    for (const [type, pattern] of Object.entries(this.legalPatterns)) {
      const matchScore = this.calculateMatchScore(combinedText, pattern);
      if (matchScore > highestConfidence) {
        highestConfidence = matchScore;
        bestMatch = pattern;
        reasoning.push(`Matched ${type} pattern with ${Math.round(matchScore * 100)}% confidence`);
      }
    }

    // Analyze content patterns
    for (const [type, pattern] of Object.entries(this.contentPatterns)) {
      const matchScore = this.calculateContentMatchScore(content, pattern);
      if (matchScore > 0.3) {
        pattern.tags.forEach(tag => allTags.add(tag));
        reasoning.push(`Content analysis detected ${type} patterns`);
      }
    }

    // Generate suggested name
    const suggestedName = this.generateSuggestedName(metadata, bestMatch);

    // Determine final classification
    const result: AutoTaggingResult = {
      tags: Array.from(allTags),
      category: bestMatch?.category || 'reference',
      relevance: bestMatch?.relevance || 'reference',
      suggestedName,
      confidence: highestConfidence,
      reasoning
    };

    // Add pattern-specific tags
    if (bestMatch) {
      bestMatch.tags.forEach((tag: string) => allTags.add(tag));
      result.tags = Array.from(allTags);
    }

    return result;
  }

  /**
   * Calculate match score for filename and content patterns
   */
  private calculateMatchScore(text: string, pattern: any): number {
    let score = 0;
    const totalKeywords = pattern.keywords.length;

    // Check keyword matches
    pattern.keywords.forEach((keyword: string) => {
      if (text.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });

    // Check regex pattern matches
    pattern.patterns.forEach((regex: RegExp) => {
      if (regex.test(text)) {
        score += 2; // Regex matches are weighted higher
      }
    });

    return Math.min(score / (totalKeywords + pattern.patterns.length), 1);
  }

  /**
   * Calculate content-specific match score
   */
  private calculateContentMatchScore(content: string, pattern: any): number {
    let score = 0;
    const totalKeywords = pattern.keywords.length;

    pattern.keywords.forEach((keyword: string) => {
      if (content.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });

    return score / totalKeywords;
  }

  /**
   * Generate suggested filename based on document analysis
   */
  private generateSuggestedName(metadata: DocumentMetadata, bestMatch: any): string {
    const date = metadata.createdAt.toISOString().split('T')[0];
    
    // Find applicable renaming rule
    const applicableRule = this.renamingRules
      .filter(rule => rule.pattern.test(metadata.filename))
      .sort((a, b) => a.priority - b.priority)[0];

    if (applicableRule) {
      return this.applyRenamingTemplate(applicableRule.template, metadata, date);
    }

    // Fallback naming convention
    return this.generateFallbackName(metadata, date);
  }

  /**
   * Apply renaming template with metadata substitution
   */
  private applyRenamingTemplate(template: string, metadata: DocumentMetadata, date: string): string {
    return template
      .replace('{date}', date)
      .replace('{sender}', this.extractSender(metadata.content || ''))
      .replace('{description}', this.extractDescription(metadata.content || ''))
      .replace('{letter}', this.extractExhibitLetter(metadata.filename))
      .replace('{caseNumber}', metadata.caseNumber || '');
  }

  /**
   * Generate fallback name when no specific pattern matches
   */
  private generateFallbackName(metadata: DocumentMetadata, date: string): string {
    const fileType = metadata.fileType.toUpperCase();
    const baseName = metadata.filename.replace(/\.[^/.]+$/, ''); // Remove extension
    return `${baseName} - ${date}.${fileType}`;
  }

  /**
   * Extract sender information from email content
   */
  private extractSender(content: string): string {
    const senderMatch = content.match(/from:\s*([^\n\r]+)/i);
    if (senderMatch) {
      return senderMatch[1].trim();
    }
    return 'Unknown';
  }

  /**
   * Extract description from content
   */
  private extractDescription(content: string): string {
    // Simple extraction - first sentence or first 50 characters
    const sentences = content.split(/[.!?]/);
    if (sentences.length > 0) {
      return sentences[0].trim().substring(0, 50);
    }
    return content.substring(0, 50);
  }

  /**
   * Extract exhibit letter from filename
   */
  private extractExhibitLetter(filename: string): string {
    const exhibitMatch = filename.match(/exhibit\s+([a-z])/i);
    if (exhibitMatch) {
      return exhibitMatch[1].toUpperCase();
    }
    return 'A';
  }

  /**
   * Batch process multiple documents
   */
  public batchAnalyze(documents: DocumentMetadata[]): AutoTaggingResult[] {
    return documents.map(doc => this.analyzeDocument(doc));
  }

  /**
   * Get all available tags for the system
   */
  public getAllAvailableTags(): string[] {
    const allTags = new Set<string>();
    
    Object.values(this.legalPatterns).forEach(pattern => {
      pattern.tags.forEach(tag => allTags.add(tag));
    });
    
    Object.values(this.contentPatterns).forEach(pattern => {
      pattern.tags.forEach(tag => allTags.add(tag));
    });
    
    return Array.from(allTags).sort();
  }

  /**
   * Validate and suggest improvements for existing tags
   */
  public validateTags(existingTags: string[]): {
    valid: string[];
    suggested: string[];
    deprecated: string[];
  } {
    const allAvailableTags = this.getAllAvailableTags();
    const valid = existingTags.filter(tag => allAvailableTags.includes(tag));
    const deprecated = existingTags.filter(tag => !allAvailableTags.includes(tag));
    
    // Suggest missing tags based on common patterns
    const suggested: string[] = [];
    if (existingTags.some(tag => tag.includes('financial')) && !existingTags.includes('closing-statement')) {
      suggested.push('closing-statement');
    }
    if (existingTags.some(tag => tag.includes('petitioner')) && !existingTags.includes('petitioner-filing')) {
      suggested.push('petitioner-filing');
    }
    
    return { valid, suggested, deprecated };
  }
}

export default AutoTaggingService;
