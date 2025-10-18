import { VoyageAI } from 'voyageai';
import { env } from '../../env';

export interface VoyageConfig {
  apiKey: string;
  model?: string;
  batchSize?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface EmbeddingChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    chunkIndex: number;
    externalId: string;
    checksum?: string;
  };
}

export interface EmbeddingResult {
  id: string;
  embedding: number[];
  metadata: EmbeddingChunk['metadata'];
}

export class VoyageEmbeddingClient {
  private client: VoyageAI;
  private config: VoyageConfig;

  constructor(config: VoyageConfig) {
    this.config = {
      model: 'voyage-3-large',
      batchSize: 50,
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };
    
    this.client = new VoyageAI(this.config.apiKey);
  }

  async embedText(text: string): Promise<number[]> {
    let attempt = 0;
    const max = this.config.maxRetries ?? 3;
    const delay = this.config.retryDelay ?? 1000;
    // Initial try + retries
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const response = await this.client.embed([text], this.config.model!);
        return response.embeddings[0];
      } catch (error) {
        attempt++;
        if (attempt > max) {
          throw error;
        }
        await this.delay(delay * attempt);
      }
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    const batchSize = this.config.batchSize!;
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      try {
        const response = await this.client.embed(batch, this.config.model!);
        embeddings.push(...response.embeddings);
        
        // Rate limiting delay
        if (i + batchSize < texts.length) {
          await this.delay(this.config.retryDelay!);
        }
      } catch (error) {
        console.error(`Batch embedding error (${i}-${i + batchSize}):`, error);
        
        // Retry logic
        let retries = 0;
        while (retries < this.config.maxRetries!) {
          try {
            await this.delay(this.config.retryDelay! * (retries + 1));
            const response = await this.client.embed(batch, this.config.model!);
            embeddings.push(...response.embeddings);
            break;
          } catch (retryError) {
            retries++;
            if (retries === this.config.maxRetries!) {
              throw retryError;
            }
          }
        }
      }
    }
    
    return embeddings;
  }

  async embedChunks(chunks: EmbeddingChunk[]): Promise<EmbeddingResult[]> {
    const texts = chunks.map(chunk => chunk.content);
    const embeddings = await this.embedBatch(texts);
    
    return chunks.map((chunk, index) => ({
      id: chunk.id,
      embedding: embeddings[index],
      metadata: chunk.metadata
    }));
  }

  // Text chunking utilities
  static chunkText(
    text: string,
    chunkSize: number = 2000,
    overlap: number = 200
  ): string[] {
    const chunks: string[] = [];
    let start = 0;
    
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      let chunk = text.slice(start, end);
      
      // Try to break at sentence boundaries
      if (end < text.length) {
        const lastSentence = chunk.lastIndexOf('.');
        const lastNewline = chunk.lastIndexOf('\n');
        const breakPoint = Math.max(lastSentence, lastNewline);
        
        if (breakPoint > chunkSize * 0.7) {
          chunk = chunk.slice(0, breakPoint + 1);
        }
      }
      const trimmed = chunk.trim();
      if (trimmed.length === 0) {
        // Avoid infinite loops on whitespace-only ranges
        break;
      }
      chunks.push(trimmed);
      // Ensure forward progress even when overlap >= chunk.length
      const advance = Math.max(1, chunk.length - overlap);
      start = start + advance;
    }
    
    return chunks.filter(chunk => chunk.length > 0);
  }

  static createChunks(
    text: string,
    source: string,
    externalId: string,
    chunkSize: number = 2000,
    overlap: number = 200
  ): EmbeddingChunk[] {
    const textChunks = this.chunkText(text, chunkSize, overlap);
    
    return textChunks.map((content, index) => ({
      id: `${externalId}_chunk_${index}`,
      content,
      metadata: {
        source,
        chunkIndex: index,
        externalId,
        checksum: this.generateChecksum(content)
      }
    }));
  }

  private static generateChecksum(text: string): string {
    // Simple checksum for deduplication
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let voyageClient: VoyageEmbeddingClient | null = null;

export function getVoyageClient(): VoyageEmbeddingClient {
  if (!voyageClient) {
    const config: VoyageConfig = {
      apiKey: env.VOYAGE_API_KEY,
      model: env.VOYAGE_MODEL || 'voyage-3-large',
    };
    
    voyageClient = new VoyageEmbeddingClient(config);
  }
  
  return voyageClient;
}
