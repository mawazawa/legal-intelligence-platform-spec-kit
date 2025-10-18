import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../../env';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export interface DocumentRecord {
  id: string;
  external_id: string;
  title: string;
  source: string;
  url?: string;
  created_at: string;
}

export interface DocumentChunkRecord {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  embedding: number[];
  external_id: string;
  created_at: string;
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: {
    source: string;
    chunkIndex: number;
    externalId: string;
    checksum?: string;
  };
  similarity: number;
}

export class SupabaseVectorClient {
  private client: SupabaseClient;
  private config: SupabaseConfig;

  constructor(config: SupabaseConfig) {
    this.config = config;
    this.client = createClient(config.url, config.serviceRoleKey || config.anonKey);
  }

  // Document operations
  async upsertDocument(document: {
    external_id: string;
    title: string;
    source: string;
    url?: string;
  }): Promise<DocumentRecord> {
    const { data, error } = await this.client
      .from('documents')
      .upsert({
        external_id: document.external_id,
        title: document.title,
        source: document.source,
        url: document.url,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'external_id'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Document upsert failed: ${error.message}`);
    }

    return data;
  }

  async getDocument(externalId: string): Promise<DocumentRecord | null> {
    const { data, error } = await this.client
      .from('documents')
      .select('*')
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Document fetch failed: ${error.message}`);
    }

    return data;
  }

  // Chunk operations
  async upsertChunk(chunk: {
    document_id: string;
    chunk_index: number;
    content: string;
    embedding: number[];
    external_id: string;
  }): Promise<DocumentChunkRecord> {
    const { data, error } = await this.client
      .from('document_chunks')
      .upsert({
        document_id: chunk.document_id,
        chunk_index: chunk.chunk_index,
        content: chunk.content,
        embedding: chunk.embedding,
        external_id: chunk.external_id,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'external_id'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Chunk upsert failed: ${error.message}`);
    }

    return data;
  }

  async upsertChunks(chunks: {
    document_id: string;
    chunk_index: number;
    content: string;
    embedding: number[];
    external_id: string;
  }[]): Promise<DocumentChunkRecord[]> {
    const { data, error } = await this.client
      .from('document_chunks')
      .upsert(chunks.map(chunk => ({
        ...chunk,
        created_at: new Date().toISOString()
      })), {
        onConflict: 'external_id'
      })
      .select();

    if (error) {
      throw new Error(`Chunks upsert failed: ${error.message}`);
    }

    return data;
  }

  // Vector search operations
  async vectorSearch(
    queryEmbedding: number[],
    limit: number = 10,
    threshold: number = 0.7,
    source?: string
  ): Promise<SearchResult[]> {
    // Use RPC directly from client to satisfy typings and runtime behavior
    const { data, error } = await (this.client as any).rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit
    });

    if (error) {
      throw new Error(`Vector search failed: ${error.message}`);
    }

    const rows = (data as any[]) || [];
    const mapped = rows
      .filter((item: any) => (source ? item.documents?.source === source : true))
      .map((item: any) => ({
      id: item.id,
      content: item.content,
      metadata: {
        source: item.documents.source,
        chunkIndex: item.chunk_index,
        externalId: item.external_id
      },
      similarity: item.similarity || 0
    }));
    return mapped;
  }

  async hybridSearch(
    queryEmbedding: number[],
    keywords: string[],
    limit: number = 10,
    threshold: number = 0.7
  ): Promise<SearchResult[]> {
    // Vector search
    const vectorResults = await this.vectorSearch(queryEmbedding, limit, threshold);
    
    // Keyword search
    const keywordResults = await this.keywordSearch(keywords, limit);
    
    // Combine and deduplicate results
    const combined = new Map<string, SearchResult>();
    
    // Add vector results with higher weight
    vectorResults.forEach(result => {
      combined.set(result.id, {
        ...result,
        similarity: result.similarity * 0.7 // Weight vector similarity
      });
    });
    
    // Add keyword results
    keywordResults.forEach(result => {
      const existing = combined.get(result.id);
      if (existing) {
        // Boost existing result
        existing.similarity += 0.3;
      } else {
        combined.set(result.id, {
          ...result,
          similarity: 0.3
        });
      }
    });
    
    // Sort by combined similarity and return top results
    return Array.from(combined.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  async keywordSearch(keywords: string[], limit: number = 10): Promise<SearchResult[]> {
    const keywordQuery = keywords.join(' | ');
    
    const { data, error } = await this.client
      .from('document_chunks')
      .select(`
        id,
        content,
        external_id,
        chunk_index,
        documents!inner(source, title)
      `)
      .textSearch('content', keywordQuery)
      .limit(limit);

    if (error) {
      throw new Error(`Keyword search failed: ${error.message}`);
    }

    return data.map((item: any) => ({
      id: item.id,
      content: item.content,
      metadata: {
        source: item.documents.source,
        chunkIndex: item.chunk_index,
        externalId: item.external_id
      },
      similarity: 1.0 // Keyword matches get full similarity score
    }));
  }

  // Utility methods
  async getChunksByDocument(documentId: string): Promise<DocumentChunkRecord[]> {
    const { data, error } = await this.client
      .from('document_chunks')
      .select('*')
      .eq('document_id', documentId)
      .order('chunk_index');

    if (error) {
      throw new Error(`Chunks fetch failed: ${error.message}`);
    }

    return data;
  }

  async deleteDocument(externalId: string): Promise<void> {
    // First delete chunks
    const { error: chunksError } = await this.client
      .from('document_chunks')
      .delete()
      .eq('external_id', externalId);

    if (chunksError) {
      throw new Error(`Chunks deletion failed: ${chunksError.message}`);
    }

    // Then delete document
    const { error: docError } = await this.client
      .from('documents')
      .delete()
      .eq('external_id', externalId);

    if (docError) {
      throw new Error(`Document deletion failed: ${docError.message}`);
    }
  }

  async getStats(): Promise<{
    totalDocuments: number;
    totalChunks: number;
    sources: string[];
  }> {
    const [documentsResult, chunksResult, sourcesResult] = await Promise.all([
      this.client.from('documents').select('id', { count: 'exact' }),
      this.client.from('document_chunks').select('id', { count: 'exact' }),
      this.client.from('documents').select('source')
    ]);

    if (documentsResult.error) {
      throw new Error(`Documents stats failed: ${documentsResult.error.message}`);
    }

    if (chunksResult.error) {
      throw new Error(`Chunks stats failed: ${chunksResult.error.message}`);
    }

    const sourcesErr = (sourcesResult as any).error;
    if (sourcesErr) {
      throw new Error(`Sources stats failed: ${sourcesErr.message}`);
    }

    return {
      totalDocuments: documentsResult.count || 0,
      totalChunks: chunksResult.count || 0,
      sources: Array.from(new Set((sourcesResult.data as any[]).map((item: any) => item.source)))
    };
  }
}

// Singleton instance
let supabaseClient: SupabaseVectorClient | null = null;

export function getSupabaseClient(): SupabaseVectorClient {
  if (!supabaseClient) {
    const config: SupabaseConfig = {
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    };
    
    supabaseClient = new SupabaseVectorClient(config);
  }
  
  return supabaseClient;
}
