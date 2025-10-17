// Auto-generated types for email extraction data
export interface Person {
  name: string;
  email: string;
  phone: string;
  role: string;
  context: string;
  professional_background: string;
  company_affiliation: string;
  notes: string;
  category: string;
}

export interface CommunicationPattern {
  sender: string;
  count: number;
}

export interface EmailDomain {
  domain: string;
  count: number;
}

export interface SubjectKeyword {
  keyword: string;
  count: number;
}

export interface ProfessionalNetwork {
  legal_professionals: Person[];
  real_estate_professionals: Person[];
  court_personnel: Person[];
  financial_professionals: Person[];
  business_professionals: Person[];
  family_members: Person[];
}

export interface CommunicationPatterns {
  top_communicators: CommunicationPattern[];
  email_domains: EmailDomain[];
  subject_keywords: SubjectKeyword[];
}

export interface Insights {
  legal_firms: string[];
  real_estate_teams: string[];
  court_connections: string[];
  financial_institutions: string[];
}

export interface EmailExtractionData {
  metadata: {
    generated_at: string;
    total_persons: number;
    total_emails_analyzed: string;
    extraction_date: string;
  };
  persons: Person[];
  professional_networks: ProfessionalNetwork;
  communication_patterns: CommunicationPatterns;
  insights: Insights;
}
