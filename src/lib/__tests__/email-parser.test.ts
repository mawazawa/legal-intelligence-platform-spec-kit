import { EmailParser } from '../ingestion/email-parser';

describe('EmailParser', () => {
  let parser: EmailParser;

  beforeEach(() => {
    parser = new EmailParser();
  });

  describe('parseEmailBlock', () => {
    it('should parse a basic email block', () => {
      const emailBlock = `From mathieuwauters@gmail.com Thu Jan 1 12:00:00 2024
Message-ID: <test@example.com>
From: Mathieu Wauters <mathieuwauters@gmail.com>
To: Rosanna Alvero <rosanna@example.com>
Subject: Test Email
Date: Thu, 1 Jan 2024 12:00:00 +0000

This is a test email body.`;

      const result = parser.parseEmailBlock(emailBlock);
      
      expect(result).toBeTruthy();
      expect(result?.from).toBe('Mathieu Wauters <mathieuwauters@gmail.com>');
      expect(result?.to).toEqual(['Rosanna Alvero <rosanna@example.com>']);
      expect(result?.subject).toBe('Test Email');
      expect(result?.body).toBe('This is a test email body.');
    });

    it('should handle emails with CC', () => {
      const emailBlock = `From mathieuwauters@gmail.com Thu Jan 1 12:00:00 2024
From: Mathieu Wauters <mathieuwauters@gmail.com>
To: Rosanna Alvero <rosanna@example.com>
Cc: Attorney <attorney@law.com>
Subject: Test Email

Test body.`;

      const result = parser.parseEmailBlock(emailBlock);
      
      expect(result?.cc).toEqual(['Attorney <attorney@law.com>']);
    });

    it('should return null for invalid email blocks', () => {
      const invalidBlock = 'Not an email block';
      const result = parser.parseEmailBlock(invalidBlock);
      expect(result).toBeNull();
    });
  });

  describe('determineActor', () => {
    it('should identify respondent emails', () => {
      const from = 'mathieuwauters@gmail.com';
      const subject = 'Response to motion';
      const body = 'I am responding to the motion.';
      
      const actor = parser.determineActor(from, subject, body);
      expect(actor).toBe('respondent');
    });

    it('should identify petitioner emails', () => {
      const from = 'rosanna.alvero@example.com';
      const subject = 'Motion for continuance';
      const body = 'I need a continuance.';
      
      const actor = parser.determineActor(from, subject, body);
      expect(actor).toBe('petitioner');
    });

    it('should identify attorney emails', () => {
      const from = 'selam@lawfirm.com';
      const subject = 'Legal correspondence';
      const body = 'This is from your attorney.';
      
      const actor = parser.determineActor(from, subject, body);
      expect(actor).toBe('attorney');
    });

    it('should identify court emails', () => {
      const from = 'court@sftc.org';
      const subject = 'Hearing notice';
      const body = 'Notice of hearing.';
      
      const actor = parser.determineActor(from, subject, body);
      expect(actor).toBe('court');
    });

    it('should default to other for unknown emails', () => {
      const from = 'unknown@example.com';
      const subject = 'Random email';
      const body = 'This is a random email.';
      
      const actor = parser.determineActor(from, subject, body);
      expect(actor).toBe('other');
    });
  });

  describe('generateDescription', () => {
    it('should generate continuance descriptions', () => {
      const email = {
        messageId: 'test@example.com',
        from: 'test@example.com',
        to: ['test@example.com'],
        cc: [],
        subject: 'Motion for continuance',
        date: '2024-01-01',
        body: 'Test body',
        headers: {}
      };

      const description = parser.generateDescription(email);
      expect(description).toContain('Continuance request');
    });

    it('should generate hearing descriptions', () => {
      const email = {
        messageId: 'test@example.com',
        from: 'test@example.com',
        to: ['test@example.com'],
        cc: [],
        subject: 'Hearing schedule',
        date: '2024-01-01',
        body: 'Test body',
        headers: {}
      };

      const description = parser.generateDescription(email);
      expect(description).toContain('Hearing communication');
    });

    it('should generate motion descriptions', () => {
      const email = {
        messageId: 'test@example.com',
        from: 'test@example.com',
        to: ['test@example.com'],
        cc: [],
        subject: 'Motion to compel',
        date: '2024-01-01',
        body: 'Test body',
        headers: {}
      };

      const description = parser.generateDescription(email);
      expect(description).toContain('Motion filing');
    });
  });

  describe('extractSnippet', () => {
    it('should extract short snippets', () => {
      const body = 'Short email body.';
      const snippet = parser.extractSnippet(body, 50);
      expect(snippet).toBe('Short email body.');
    });

    it('should truncate long snippets', () => {
      const body = 'This is a very long email body that should be truncated because it exceeds the maximum length allowed for snippets.';
      const snippet = parser.extractSnippet(body, 50);
      expect(snippet).toContain('...');
      expect(snippet.length).toBeLessThanOrEqual(53); // 50 + '...'
    });

    it('should remove quoted text', () => {
      const body = `This is my response.

> On Jan 1, 2024, someone wrote:
> This is quoted text that should be removed.

This is more of my response.`;
      
      const snippet = parser.extractSnippet(body, 100);
      expect(snippet).not.toContain('>');
      expect(snippet).toContain('This is my response');
    });
  });

  describe('detectContinuances', () => {
    it('should detect continuance emails', () => {
      const emails = [
        {
          externalId: '1',
          type: 'email' as const,
          date: '2024-01-01',
          description: 'Motion for continuance',
          actor: 'petitioner' as const,
          sourcePath: '/test',
          snippet: 'Requesting continuance due to scheduling conflict',
          metadata: {
            from: 'test@example.com',
            to: ['test@example.com'],
            cc: [],
            subject: 'Continuance request',
            messageId: 'test@example.com'
          }
        },
        {
          externalId: '2',
          type: 'email' as const,
          date: '2024-01-01',
          description: 'Regular email',
          actor: 'respondent' as const,
          sourcePath: '/test',
          snippet: 'Just a regular email',
          metadata: {
            from: 'test@example.com',
            to: ['test@example.com'],
            cc: [],
            subject: 'Regular email',
            messageId: 'test@example.com'
          }
        }
      ];

      const continuances = parser.detectContinuances(emails);
      expect(continuances).toHaveLength(1);
      expect(continuances[0].externalId).toBe('1');
    });
  });

  describe('analyzeDelays', () => {
    it('should analyze delays by actor', () => {
      const emails = [
        {
          externalId: '1',
          type: 'email' as const,
          date: '2024-01-01',
          description: 'Continuance request',
          actor: 'petitioner' as const,
          sourcePath: '/test',
          snippet: 'Requesting 14 day continuance',
          metadata: {
            from: 'test@example.com',
            to: ['test@example.com'],
            cc: [],
            subject: 'Continuance',
            messageId: 'test@example.com'
          }
        },
        {
          externalId: '2',
          type: 'email' as const,
          date: '2024-01-01',
          description: 'Another continuance',
          actor: 'petitioner' as const,
          sourcePath: '/test',
          snippet: 'Another request',
          metadata: {
            from: 'test@example.com',
            to: ['test@example.com'],
            cc: [],
            subject: 'Another',
            messageId: 'test@example.com'
          }
        }
      ];

      const analysis = parser.analyzeDelays(emails);
      expect(analysis.byActor.petitioner).toBe(2);
      expect(analysis.timeline).toHaveLength(2);
    });

    it('should extract delay days from snippets', () => {
      const emails = [
        {
          externalId: '1',
          type: 'email' as const,
          date: '2024-01-01',
          description: 'Continuance request',
          actor: 'petitioner' as const,
          sourcePath: '/test',
          snippet: 'Requesting 14 day continuance',
          metadata: {
            from: 'test@example.com',
            to: ['test@example.com'],
            cc: [],
            subject: 'Continuance',
            messageId: 'test@example.com'
          }
        }
      ];

      const analysis = parser.analyzeDelays(emails);
      expect(analysis.timeline[0].delayDays).toBe(14);
    });
  });
});
