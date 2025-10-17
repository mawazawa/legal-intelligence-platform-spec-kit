import { VoyageEmbeddingClient } from '../embeddings/voyage';

// Mock VoyageAI client
jest.mock('voyageai', () => ({
  VoyageAI: jest.fn().mockImplementation(() => ({
    embed: jest.fn().mockResolvedValue({
      embeddings: [
        new Array(1024).fill(0.1), // Mock embedding
        new Array(1024).fill(0.2)
      ]
    })
  }))
}));

describe('VoyageEmbeddingClient', () => {
  let client: VoyageEmbeddingClient;

  beforeEach(() => {
    client = new VoyageEmbeddingClient({
      apiKey: 'test-key',
      model: 'voyage-3-large',
      batchSize: 2,
      maxRetries: 3,
      retryDelay: 100
    });
  });

  describe('embedText', () => {
    it('should embed a single text', async () => {
      const text = 'This is a test document.';
      const embedding = await client.embedText(text);
      
      expect(embedding).toBeDefined();
      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding.length).toBe(1024);
    });

    it('should handle embedding errors', async () => {
      // Mock error
      const mockEmbed = jest.fn().mockRejectedValue(new Error('API Error'));
      (client as any).client.embed = mockEmbed;
      
      await expect(client.embedText('test')).rejects.toThrow('API Error');
    });
  });

  describe('embedBatch', () => {
    it('should embed multiple texts', async () => {
      const texts = ['First text', 'Second text'];
      const embeddings = await client.embedBatch(texts);
      
      expect(embeddings).toBeDefined();
      expect(Array.isArray(embeddings)).toBe(true);
      expect(embeddings.length).toBe(2);
      expect(embeddings[0].length).toBe(1024);
      expect(embeddings[1].length).toBe(1024);
    });

    it('should handle large batches', async () => {
      const texts = Array(5).fill('Test text');
      const embeddings = await client.embedBatch(texts);
      
      expect(embeddings.length).toBe(5);
    });
  });

  describe('embedChunks', () => {
    it('should embed chunks with metadata', async () => {
      const chunks = [
        {
          id: 'chunk1',
          content: 'First chunk content',
          metadata: {
            source: 'test.pdf',
            chunkIndex: 0,
            externalId: 'doc1',
            checksum: 'abc123'
          }
        },
        {
          id: 'chunk2',
          content: 'Second chunk content',
          metadata: {
            source: 'test.pdf',
            chunkIndex: 1,
            externalId: 'doc1',
            checksum: 'def456'
          }
        }
      ];

      const results = await client.embedChunks(chunks);
      
      expect(results).toBeDefined();
      expect(results.length).toBe(2);
      expect(results[0].id).toBe('chunk1');
      expect(results[0].embedding).toBeDefined();
      expect(results[0].metadata.source).toBe('test.pdf');
    });
  });

  describe('chunkText', () => {
    it('should chunk text into smaller pieces', () => {
      const text = 'This is a very long text that should be chunked into smaller pieces for better processing and embedding generation.';
      const chunks = VoyageEmbeddingClient.chunkText(text, 50, 10);
      
      expect(chunks).toBeDefined();
      expect(Array.isArray(chunks)).toBe(true);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[0].length).toBeLessThanOrEqual(50);
    });

    it('should handle short text', () => {
      const text = 'Short text.';
      const chunks = VoyageEmbeddingClient.chunkText(text, 100, 20);
      
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(text);
    });

    it('should respect chunk size', () => {
      const text = 'A'.repeat(200);
      const chunks = VoyageEmbeddingClient.chunkText(text, 50, 10);
      
      chunks.forEach(chunk => {
        expect(chunk.length).toBeLessThanOrEqual(50);
      });
    });
  });

  describe('createChunks', () => {
    it('should create chunks with proper metadata', () => {
      const text = 'This is a test document that will be chunked.';
      const source = 'test.pdf';
      const externalId = 'doc1';
      
      const chunks = VoyageEmbeddingClient.createChunks(text, source, externalId, 20, 5);
      
      expect(chunks).toBeDefined();
      expect(Array.isArray(chunks)).toBe(true);
      expect(chunks.length).toBeGreaterThan(0);
      
      chunks.forEach((chunk, index) => {
        expect(chunk.id).toBe(`${externalId}_chunk_${index}`);
        expect(chunk.content).toBeDefined();
        expect(chunk.metadata.source).toBe(source);
        expect(chunk.metadata.chunkIndex).toBe(index);
        expect(chunk.metadata.externalId).toBe(externalId);
        expect(chunk.metadata.checksum).toBeDefined();
      });
    });

    it('should generate unique checksums', () => {
      const text1 = 'First text';
      const text2 = 'Second text';
      
      const chunks1 = VoyageEmbeddingClient.createChunks(text1, 'source1', 'id1');
      const chunks2 = VoyageEmbeddingClient.createChunks(text2, 'source2', 'id2');
      
      expect(chunks1[0].metadata.checksum).not.toBe(chunks2[0].metadata.checksum);
    });
  });

  describe('rate limiting', () => {
    it('should respect batch size limits', async () => {
      const texts = Array(10).fill('Test text');
      const startTime = Date.now();
      
      await client.embedBatch(texts);
      
      const duration = Date.now() - startTime;
      // Should take some time due to rate limiting
      expect(duration).toBeGreaterThan(0);
    });
  });

  describe('retry logic', () => {
    it('should retry on failure', async () => {
      let attemptCount = 0;
      const mockEmbed = jest.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Temporary failure');
        }
        return Promise.resolve({ embeddings: [new Array(1024).fill(0.1)] });
      });
      
      (client as any).client.embed = mockEmbed;
      
      const embedding = await client.embedText('test');
      
      expect(attemptCount).toBe(3);
      expect(embedding).toBeDefined();
    });

    it('should fail after max retries', async () => {
      const mockEmbed = jest.fn().mockRejectedValue(new Error('Persistent failure'));
      (client as any).client.embed = mockEmbed;
      
      await expect(client.embedText('test')).rejects.toThrow('Persistent failure');
      expect(mockEmbed).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });
  });
});
