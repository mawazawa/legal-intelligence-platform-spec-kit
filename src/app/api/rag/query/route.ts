import { NextRequest, NextResponse } from 'next/server';
import { getVoyageClient } from '@/lib/embeddings/voyage';
import { getSupabaseClient } from '@/lib/search/supabase';
import { getNeo4jClient } from '@/lib/neo4j';

export interface RAGQueryRequest {
  query: string;
  maxResults?: number;
  threshold?: number;
  includeGraph?: boolean;
  graphHops?: number;
}

export interface RAGQueryResponse {
  claim: string;
  answer: string;
  evidence: Array<{
    id: string;
    content: string;
    source: string;
    similarity: number;
    metadata: Record<string, any>;
  }>;
  graphContext?: {
    nodes: Array<{
      id: string;
      labels: string[];
      properties: Record<string, any>;
    }>;
    relationships: Array<{
      id: string;
      type: string;
      startNodeId: string;
      endNodeId: string;
      properties: Record<string, any>;
    }>;
  };
  metadata: {
    query: string;
    totalResults: number;
    processingTime: number;
    sources: string[];
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: RAGQueryRequest = await request.json();
    const {
      query,
      maxResults = 10,
      threshold = 0.7,
      includeGraph = true,
      graphHops = 2
    } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Step 1: Generate embedding for the query
    const voyageClient = getVoyageClient();
    const queryEmbedding = await voyageClient.embedText(query);

    // Step 2: Vector search in Supabase
    const supabaseClient = getSupabaseClient();
    const searchResults = await supabaseClient.hybridSearch(
      queryEmbedding,
      query.split(' '), // Simple keyword extraction
      maxResults,
      threshold
    );

    // Step 3: Graph expansion in Neo4j (if enabled)
    let graphContext = undefined;
    if (includeGraph && searchResults.length > 0) {
      try {
        const neo4jClient = getNeo4jClient();
        await neo4jClient.connect();
        
        // Get graph neighborhood for top results
        const topResult = searchResults[0];
        const neighborhood = await neo4jClient.getNeighborhood(
          topResult.metadata.externalId,
          graphHops,
          50
        );
        
        graphContext = neighborhood;
      } catch (error) {
        console.warn('Graph expansion failed:', error);
        // Continue without graph context
      }
    }

    // Step 4: Generate answer with evidence
    const answer = generateAnswer(query, searchResults, graphContext);

    // Step 5: Prepare evidence citations
    const evidence = searchResults.map(result => ({
      id: result.id,
      content: result.content,
      source: result.metadata.source,
      similarity: result.similarity,
      metadata: result.metadata
    }));

    // Step 6: Extract unique sources
    const sources = [...new Set(evidence.map(c => c.source))];

    const response: RAGQueryResponse = {
      claim: query,
      answer,
      evidence,
      graphContext,
      metadata: {
        query,
        totalResults: evidence.length,
        processingTime: Date.now() - startTime,
        sources
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('RAG query error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateAnswer(
  query: string,
  searchResults: any[],
  graphContext?: any
): string {
  if (searchResults.length === 0) {
    return `I couldn't find any relevant information to answer your query: "${query}". Please try rephrasing your question or check if the relevant documents have been ingested.`;
  }

  // Simple answer generation based on search results
  const topResults = searchResults.slice(0, 3);
  const answerParts: string[] = [];
  
  answerParts.push(`Based on the available documents, here's what I found regarding your query: "${query}"`);
  
  for (const result of topResults) {
    const snippet = result.content.length > 200 
      ? result.content.substring(0, 200) + '...'
      : result.content;
    
    answerParts.push(`\n\nFrom ${result.metadata.source}:`);
    answerParts.push(`"${snippet}"`);
  }
  
  if (graphContext && graphContext.nodes.length > 0) {
    answerParts.push(`\n\nAdditional context from related documents:`);
    const relatedNodes = graphContext.nodes
      .filter((node: any) => node.labels.includes('Document') || node.labels.includes('Event'))
      .slice(0, 3);
    
    for (const node of relatedNodes) {
      if (node.properties.description || node.properties.title) {
        answerParts.push(`\n• ${node.properties.title || node.properties.description}`);
      }
    }
  }
  
  answerParts.push(`\n\nThis information is based on ${searchResults.length} relevant document(s) found in the system.`);
  
  return answerParts.join('');
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: '/api/rag/query - Submit a query for Graph RAG processing'
    }
  });
}
