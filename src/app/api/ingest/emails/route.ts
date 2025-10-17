import { NextRequest, NextResponse } from 'next/server';
import { parseAllEmails, EmailParser, type EmailEvent } from '@/lib/ingestion/email-parser';
import path from 'node:path';
import fs from 'node:fs/promises';
import { getNeo4jClient } from '@/lib/neo4j';
import { getVoyageClient, VoyageEmbeddingClient } from '@/lib/embeddings/voyage';
import { getSupabaseClient } from '@/lib/search/supabase';

export async function POST(request: NextRequest) {
  try {
    const { action = 'parse' } = await request.json();
    
    if (action === 'parse') {
      return await parseEmails();
    } else if (action === 'embed') {
      return await embedEmails();
    } else if (action === 'upsert') {
      return await upsertEmails();
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: parse, embed, or upsert' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Email ingestion error:', error);
    return NextResponse.json(
      { 
        error: 'Email ingestion failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';

async function resolveMboxPath(): Promise<string> {
  const mailDir = path.resolve(process.cwd(), '..', 'Mail');
  try {
    const entries = await fs.readdir(mailDir);
    const mbox = entries.find((f) => f.endsWith('.mbox'));
    if (mbox) return path.join(mailDir, mbox);
  } catch {}
  // Fallback to a common filename if listing fails
  return path.join(mailDir, 'LEGAL-DIVORCE STUFF-EVIDENCE.mbox');
}

async function parseEmails() {
  const startTime = Date.now();
  
  try {
    // Parse emails from first available mbox file
    const mboxPath = await resolveMboxPath();
    const emailEvents = await parseAllEmails(mboxPath);
    
    // Continuances (best-effort)
    const parser = new EmailParser(mboxPath);
    const continuances = await parser.extractContinuances();
    
    const result = {
      totalEmails: emailEvents.length,
      continuances: continuances.length,
      events: (emailEvents as EmailEvent[]).slice(0, 10), // Return first 10 for preview
      processingTime: Date.now() - startTime
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Email parsing error:', error);
    throw error;
  }
}

async function embedEmails() {
  const startTime = Date.now();
  
  try {
    // Parse emails
    const mboxPath = await resolveMboxPath();
    const emailEvents = await parseAllEmails(mboxPath);
    
    // Create chunks for embedding
    const voyageClient = getVoyageClient();
    const chunks = emailEvents.flatMap(event => 
      VoyageEmbeddingClient.createChunks(
        `${event.description}\n\n${event.snippet}`,
        event.sourcePath,
        event.externalId
      )
    );
    
    // Generate embeddings
    const embeddingResults = await voyageClient.embedChunks(chunks);
    
    const result = {
      totalChunks: chunks.length,
      embeddedChunks: embeddingResults.length,
      processingTime: Date.now() - startTime
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Email embedding error:', error);
    throw error;
  }
}

async function upsertEmails() {
  const startTime = Date.now();
  
  try {
    // Parse emails
    const mboxPath = await resolveMboxPath();
    const emailEvents = await parseAllEmails(mboxPath);
    
    // Connect to Neo4j
    const neo4jClient = getNeo4jClient();
    await neo4jClient.connect();
    
    // Upsert events to Neo4j
    let upsertedEvents = 0;
    for (const event of emailEvents) {
      await neo4jClient.upsertEvent({
        externalId: event.externalId,
        type: event.type,
        date: event.date,
        description: event.description,
        actor: event.actor,
        sourcePath: event.sourcePath,
        snippet: event.snippet
      });
      upsertedEvents++;
    }
    
    // Create chunks and embeddings
    const voyageClient = getVoyageClient();
    const chunks = emailEvents.flatMap(event => 
      VoyageEmbeddingClient.createChunks(
        `${event.description}\n\n${event.snippet}`,
        event.sourcePath,
        event.externalId
      )
    );
    
    const embeddingResults = await voyageClient.embedChunks(chunks);
    
    // Upsert to Supabase
    const supabaseClient = getSupabaseClient();
    let upsertedChunks = 0;
    
    for (let i = 0; i < embeddingResults.length; i++) {
      const result = embeddingResults[i];
      const sourceChunk = chunks[i];
      // Upsert document
      const document = await supabaseClient.upsertDocument({
        external_id: result.metadata.externalId,
        title: `Email: ${result.metadata.source}`,
        source: result.metadata.source,
        url: result.metadata.source
      });
      
      // Upsert chunk
      await supabaseClient.upsertChunk({
        document_id: document.id,
        chunk_index: result.metadata.chunkIndex,
        content: sourceChunk.content,
        embedding: result.embedding,
        external_id: result.id
      });
      
      upsertedChunks++;
    }
    
    const result = {
      totalEmails: emailEvents.length,
      upsertedEvents,
      totalChunks: chunks.length,
      upsertedChunks,
      processingTime: Date.now() - startTime
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Email upsert error:', error);
    throw error;
  }
}

// GET endpoint for status
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: '/api/ingest/emails - Ingest email data (action: parse, embed, upsert)'
    }
  });
}
