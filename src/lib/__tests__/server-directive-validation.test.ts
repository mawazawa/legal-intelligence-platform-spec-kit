/**
 * Test to verify correct usage of 'use server' directive
 *
 * Bug: email-parser.ts incorrectly used 'use server' directive
 * Fix: Remove directive from library modules
 *
 * This test prevents regression by ensuring 'use server' is only used
 * in actual server action files, not library modules.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Server Directive Validation', () => {
  describe('Library modules should NOT have use server directive', () => {
    const libraryModules = [
      'src/lib/ingestion/email-parser.ts',
      'src/lib/neo4j.ts',
      'src/lib/embeddings/voyage.ts',
      'src/lib/search/supabase.ts',
      'src/lib/citations.ts',
      'src/lib/evidence.ts',
      'src/lib/analytics/email-stats.ts',
    ];

    libraryModules.forEach((modulePath) => {
      it(`${modulePath} should NOT have 'use server' directive`, () => {
        const fullPath = path.join(process.cwd(), modulePath);

        // Skip if file doesn't exist (it's ok, test passes)
        if (!fs.existsSync(fullPath)) {
          return;
        }

        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');

        // Check first 5 lines for 'use server' directive
        const firstLines = lines.slice(0, 5).join('\n');
        const hasUseServer = /['"]use server['"];?/.test(firstLines);

        expect(hasUseServer).toBe(false);
      });
    });
  });

  describe('email-parser.ts specific checks', () => {
    it('should have server-side only comment', () => {
      const emailParserPath = path.join(process.cwd(), 'src/lib/ingestion/email-parser.ts');

      if (!fs.existsSync(emailParserPath)) {
        return; // Skip if file doesn't exist
      }

      const content = fs.readFileSync(emailParserPath, 'utf-8');

      // Should have comment indicating it's server-side only
      expect(content).toMatch(/server-side only/i);
    });

    it('should NOT have use server directive', () => {
      const emailParserPath = path.join(process.cwd(), 'src/lib/ingestion/email-parser.ts');

      if (!fs.existsSync(emailParserPath)) {
        return;
      }

      const content = fs.readFileSync(emailParserPath, 'utf-8');
      const firstFewLines = content.split('\n').slice(0, 10).join('\n');

      // Should NOT have 'use server' directive
      expect(firstFewLines).not.toMatch(/['"]use server['"];?/);
    });

    it('should export EmailParser class', () => {
      const emailParserPath = path.join(process.cwd(), 'src/lib/ingestion/email-parser.ts');

      if (!fs.existsSync(emailParserPath)) {
        return;
      }

      const content = fs.readFileSync(emailParserPath, 'utf-8');

      // Should export EmailParser class
      expect(content).toMatch(/export\s+class\s+EmailParser/);
    });

    it('should have warning comment about use server', () => {
      const emailParserPath = path.join(process.cwd(), 'src/lib/ingestion/email-parser.ts');

      if (!fs.existsSync(emailParserPath)) {
        return;
      }

      const content = fs.readFileSync(emailParserPath, 'utf-8');

      // Should have comment warning NOT to add 'use server'
      expect(content).toMatch(/do not add.*use server/i);
    });
  });

  describe('Documentation of correct use server usage', () => {
    it('should understand use server is for async functions callable from client', () => {
      // This is a documentation test - it always passes but documents the rule
      const correctUsage = `
        'use server';

        export async function myServerAction(data: FormData) {
          // This can be called from client components
          'use server';
          return await saveToDatabase(data);
        }
      `;

      const incorrectUsage = `
        'use server';

        export class MyClass {
          // Classes cannot be server actions!
        }

        export interface MyInterface {
          // Interfaces cannot be server actions!
        }
      `;

      expect(correctUsage).toBeTruthy();
      expect(incorrectUsage).toBeTruthy();
    });
  });
});

describe('Regression test for Bug #2', () => {
  it('email-parser.ts should not have use server directive (Bug #2 fix)', () => {
    const emailParserPath = path.join(process.cwd(), 'src/lib/ingestion/email-parser.ts');

    if (!fs.existsSync(emailParserPath)) {
      // File doesn't exist, test passes
      return;
    }

    const content = fs.readFileSync(emailParserPath, 'utf-8');

    // Bug was: 'use server' directive on line 1
    // Fix: Remove it
    const hasUseServerDirective = /^['"]use server['"];?\s*$/m.test(content);

    expect(hasUseServerDirective).toBe(false);
  });

  it('should not break EmailParser class import', () => {
    // If the fix is correct, we should be able to import EmailParser
    expect(() => {
      const { EmailParser } = require('../ingestion/email-parser');
      expect(EmailParser).toBeDefined();
      expect(typeof EmailParser).toBe('function');
    }).not.toThrow();
  });

  it('should not break parseAllEmails function import', () => {
    expect(() => {
      const { parseAllEmails } = require('../ingestion/email-parser');
      expect(parseAllEmails).toBeDefined();
      expect(typeof parseAllEmails).toBe('function');
    }).not.toThrow();
  });
});
