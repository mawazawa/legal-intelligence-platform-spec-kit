// Temporarily disabled due to email-parser dependency issues

export interface EmailStats {
  totalEmails: number;
  emailsByMonth: Record<string, number>;
  topSenders: Array<{ email: string; count: number }>;
  averageEmailsPerDay: number;
}

export async function getEmailStats(): Promise<EmailStats> {
  // Return mock data for now
  return {
    totalEmails: 0,
    emailsByMonth: {},
    topSenders: [],
    averageEmailsPerDay: 0
  };
}