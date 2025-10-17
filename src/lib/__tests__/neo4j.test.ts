import { Neo4jClient } from '../neo4j';

// Mock neo4j-driver
jest.mock('neo4j-driver', () => ({
  driver: jest.fn().mockReturnValue({
    verifyConnectivity: jest.fn().mockResolvedValue(undefined),
    session: jest.fn().mockReturnValue({
      run: jest.fn().mockResolvedValue({
        records: [
          { toObject: () => ({ test: 1 }) },
          { toObject: () => ({ count: 5 }) }
        ]
      }),
      close: jest.fn().mockResolvedValue(undefined)
    }),
    close: jest.fn().mockResolvedValue(undefined)
  }),
  auth: {
    basic: jest.fn().mockReturnValue({})
  }
}));

describe('Neo4jClient', () => {
  let client: Neo4jClient;

  beforeEach(() => {
    client = new Neo4jClient({
      uri: 'neo4j+s://test.databases.neo4j.io',
      username: 'neo4j',
      password: 'test-password',
      database: 'neo4j'
    });
  });

  describe('connect', () => {
    it('should connect successfully', async () => {
      await expect(client.connect()).resolves.not.toThrow();
    });

    it('should handle connection errors', async () => {
      const mockDriver = {
        verifyConnectivity: jest.fn().mockRejectedValue(new Error('Connection failed')),
        close: jest.fn()
      };
      
      (client as any).driver = mockDriver;
      
      await expect(client.connect()).rejects.toThrow('Connection failed');
    });
  });

  describe('executeQuery', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should execute basic queries', async () => {
      const result = await client.executeQuery('RETURN 1 as test');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].test).toBe(1);
    });

    it('should execute queries with parameters', async () => {
      const result = await client.executeQuery(
        'RETURN $value as result',
        { value: 'test' }
      );
      
      expect(result).toBeDefined();
    });

    it('should handle query errors', async () => {
      const mockSession = {
        run: jest.fn().mockRejectedValue(new Error('Query failed')),
        close: jest.fn().mockResolvedValue(undefined)
      };
      
      (client as any).driver.session = jest.fn().mockReturnValue(mockSession);
      
      await expect(client.executeQuery('INVALID QUERY')).rejects.toThrow('Query failed');
    });
  });

  describe('upsertEvent', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should upsert an event', async () => {
      const event = {
        externalId: 'test-event-1',
        type: 'test',
        date: '2024-01-01',
        description: 'Test event',
        actor: 'test',
        sourcePath: '/test/path',
        snippet: 'Test snippet'
      };

      await expect(client.upsertEvent(event)).resolves.not.toThrow();
    });

    it('should handle upsert errors', async () => {
      const mockSession = {
        run: jest.fn().mockRejectedValue(new Error('Upsert failed')),
        close: jest.fn().mockResolvedValue(undefined)
      };
      
      (client as any).driver.session = jest.fn().mockReturnValue(mockSession);
      
      const event = {
        externalId: 'test-event-1',
        type: 'test',
        date: '2024-01-01',
        description: 'Test event',
        actor: 'test'
      };

      await expect(client.upsertEvent(event)).rejects.toThrow('Upsert failed');
    });
  });

  describe('upsertContinuance', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should upsert a continuance', async () => {
      const continuance = {
        externalId: 'test-continuance-1',
        date: '2024-01-01',
        reason: 'Test reason',
        requestedBy: 'test',
        durationDays: 7,
        sourcePath: '/test/path',
        snippet: 'Test snippet'
      };

      await expect(client.upsertContinuance(continuance)).resolves.not.toThrow();
    });
  });

  describe('upsertPerson', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should upsert a person', async () => {
      const person = {
        externalId: 'test-person-1',
        name: 'Test Person',
        role: 'test',
        email: 'test@example.com',
        phone: '123-456-7890'
      };

      await expect(client.upsertPerson(person)).resolves.not.toThrow();
    });
  });

  describe('upsertDocument', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should upsert a document', async () => {
      const document = {
        externalId: 'test-doc-1',
        path: '/test/path',
        type: 'test',
        title: 'Test Document',
        date: '2024-01-01',
        checksum: 'abc123'
      };

      await expect(client.upsertDocument(document)).resolves.not.toThrow();
    });
  });

  describe('createRelationship', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should create a relationship', async () => {
      await expect(
        client.createRelationship('node1', 'node2', 'RELATES_TO', { weight: 1 })
      ).resolves.not.toThrow();
    });
  });

  describe('getNeighborhood', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should get graph neighborhood', async () => {
      const mockSession = {
        run: jest.fn().mockResolvedValue({
          records: [
            {
              toObject: () => ({
                nodes: [
                  { identity: '1', labels: ['Person'], properties: { name: 'Test' } },
                  { identity: '2', labels: ['Event'], properties: { type: 'test' } }
                ],
                relationships: [
                  { identity: '1', type: 'RELATES_TO', start: '1', end: '2', properties: {} }
                ]
              })
            }
          ]
        }),
        close: jest.fn().mockResolvedValue(undefined)
      };
      
      (client as any).driver.session = jest.fn().mockReturnValue(mockSession);
      
      const neighborhood = await client.getNeighborhood('test-node', 2, 10);
      
      expect(neighborhood).toBeDefined();
      expect(neighborhood.nodes).toHaveLength(2);
      expect(neighborhood.relationships).toHaveLength(1);
    });

    it('should handle empty neighborhood', async () => {
      const mockSession = {
        run: jest.fn().mockResolvedValue({
          records: []
        }),
        close: jest.fn().mockResolvedValue(undefined)
      };
      
      (client as any).driver.session = jest.fn().mockReturnValue(mockSession);
      
      const neighborhood = await client.getNeighborhood('test-node', 2, 10);
      
      expect(neighborhood.nodes).toHaveLength(0);
      expect(neighborhood.relationships).toHaveLength(0);
    });
  });

  describe('getContinuancesByActor', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should get continuances by actor', async () => {
      const continuances = await client.getContinuancesByActor('petitioner');
      
      expect(continuances).toBeDefined();
      expect(Array.isArray(continuances)).toBe(true);
    });
  });

  describe('getContinuanceStats', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should get continuance statistics', async () => {
      const stats = await client.getContinuanceStats();
      
      expect(stats).toBeDefined();
      expect(Array.isArray(stats)).toBe(true);
    });
  });

  describe('getTimelineEvents', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should get timeline events', async () => {
      const events = await client.getTimelineEvents();
      
      expect(events).toBeDefined();
      expect(Array.isArray(events)).toBe(true);
    });

    it('should get timeline events with date range', async () => {
      const events = await client.getTimelineEvents('2024-01-01', '2024-12-31');
      
      expect(events).toBeDefined();
      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully', async () => {
      await client.connect();
      await expect(client.disconnect()).resolves.not.toThrow();
    });

    it('should handle disconnect when not connected', async () => {
      await expect(client.disconnect()).resolves.not.toThrow();
    });
  });
});
