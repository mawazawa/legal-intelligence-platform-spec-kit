#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Data Ingestion Pipeline
 * Processes emails and ROA data into Neo4j graph and Supabase vectors
 */

const { getNeo4jClient } = require('../src/lib/neo4j.ts');
const { getVoyageClient, VoyageEmbeddingClient } = require('../src/lib/embeddings/voyage.ts');
const { getSupabaseClient } = require('../src/lib/search/supabase.ts');
const { parseAllEmails } = require('../src/lib/ingestion/email-parser.ts');
const { parseROAFiles } = require('../src/lib/ingestion/roa-parser.ts');

class DataIngestionPipeline {
  constructor() {
    this.neo4jClient = getNeo4jClient();
    this.voyageClient = getVoyageClient();
    this.supabaseClient = getSupabaseClient();
    this.stats = {
      emails: { parsed: 0, embedded: 0, upserted: 0 },
      roa: { parsed: 0, embedded: 0, upserted: 0 },
      errors: []
    };
  }

  async connect() {
    console.log('🔌 Connecting to services...');
    await this.neo4jClient.connect();
    console.log('✅ Connected to Neo4j');
  }

  async disconnect() {
    console.log('🔌 Disconnecting from services...');
    await this.neo4jClient.disconnect();
    console.log('✅ Disconnected from Neo4j');
  }

  async ingestEmails() {
    console.log('\n📧 Ingesting email data...');
    
    try {
      // Parse emails
      console.log('   Parsing mbox files...');
      const emailEvents = await parseAllEmails();
      this.stats.emails.parsed = emailEvents.length;
      console.log(`   ✅ Parsed ${emailEvents.length} email events`);

      if (emailEvents.length === 0) {
        console.log('   ⚠️  No emails found. Check Mail/ directory.');
        return;
      }

      // Upsert to Neo4j
      console.log('   Upserting to Neo4j...');
      for (const event of emailEvents) {
        try {
          await this.neo4jClient.upsertEvent({
            externalId: event.externalId,
            type: event.type,
            date: event.date,
            description: event.description,
            actor: event.actor,
            sourcePath: event.sourcePath,
            snippet: event.snippet
          });
          this.stats.emails.upserted++;
        } catch (error) {
          this.stats.errors.push(`Email upsert error: ${error.message}`);
        }
      }
      console.log(`   ✅ Upserted ${this.stats.emails.upserted} email events to Neo4j`);

      // Create chunks and embeddings
      console.log('   Creating embeddings...');
      const chunks = emailEvents.flatMap(event => 
        VoyageEmbeddingClient.createChunks(
          `${event.description}\n\n${event.snippet}`,
          event.sourcePath,
          event.externalId
        )
      );

      const embeddingResults = await this.voyageClient.embedChunks(chunks);
      this.stats.emails.embedded = embeddingResults.length;
      console.log(`   ✅ Generated ${embeddingResults.length} embeddings`);

      // Upsert to Supabase
      console.log('   Upserting to Supabase...');
      for (const result of embeddingResults) {
        try {
          // Upsert document
          const document = await this.supabaseClient.upsertDocument({
            external_id: result.metadata.externalId,
            title: `Email: ${result.metadata.source}`,
            source: result.metadata.source,
            url: result.metadata.source
          });

          // Upsert chunk
          await this.supabaseClient.upsertChunk({
            document_id: document.id,
            chunk_index: result.metadata.chunkIndex,
            content: result.content,
            embedding: result.embedding,
            external_id: result.id
          });
        } catch (error) {
          this.stats.errors.push(`Supabase upsert error: ${error.message}`);
        }
      }
      console.log(`   ✅ Upserted ${embeddingResults.length} chunks to Supabase`);

    } catch (error) {
      console.error('❌ Email ingestion failed:', error.message);
      this.stats.errors.push(`Email ingestion: ${error.message}`);
    }
  }

  async ingestROA() {
    console.log('\n📋 Ingesting ROA data...');
    
    try {
      // Parse ROA files
      console.log('   Parsing ROA files...');
      const roaEvents = await parseROAFiles();
      this.stats.roa.parsed = roaEvents.length;
      console.log(`   ✅ Parsed ${roaEvents.length} ROA events`);

      if (roaEvents.length === 0) {
        console.log('   ⚠️  No ROA files found. Check for CSV/TXT files.');
        return;
      }

      // Upsert to Neo4j
      console.log('   Upserting to Neo4j...');
      for (const event of roaEvents) {
        try {
          if (event.type === 'continuance') {
            await this.neo4jClient.upsertContinuance({
              externalId: event.externalId,
              date: event.date,
              reason: event.metadata.continuanceReason || 'Unknown',
              requestedBy: event.actor,
              durationDays: event.metadata.durationDays,
              sourcePath: event.sourcePath,
              snippet: event.snippet
            });
          } else {
            await this.neo4jClient.upsertEvent({
              externalId: event.externalId,
              type: event.type,
              date: event.date,
              description: event.description,
              actor: event.actor,
              sourcePath: event.sourcePath,
              snippet: event.snippet
            });
          }
          this.stats.roa.upserted++;
        } catch (error) {
          this.stats.errors.push(`ROA upsert error: ${error.message}`);
        }
      }
      console.log(`   ✅ Upserted ${this.stats.roa.upserted} ROA events to Neo4j`);

      // Create chunks and embeddings
      console.log('   Creating embeddings...');
      const chunks = roaEvents.flatMap(event => 
        VoyageEmbeddingClient.createChunks(
          `${event.description}\n\n${event.snippet}`,
          event.sourcePath,
          event.externalId
        )
      );

      const embeddingResults = await this.voyageClient.embedChunks(chunks);
      this.stats.roa.embedded = embeddingResults.length;
      console.log(`   ✅ Generated ${embeddingResults.length} embeddings`);

      // Upsert to Supabase
      console.log('   Upserting to Supabase...');
      for (const result of embeddingResults) {
        try {
          // Upsert document
          const document = await this.supabaseClient.upsertDocument({
            external_id: result.metadata.externalId,
            title: `ROA: ${result.metadata.source}`,
            source: result.metadata.source,
            url: result.metadata.source
          });

          // Upsert chunk
          await this.supabaseClient.upsertChunk({
            document_id: document.id,
            chunk_index: result.metadata.chunkIndex,
            content: result.content,
            embedding: result.embedding,
            external_id: result.id
          });
        } catch (error) {
          this.stats.errors.push(`Supabase upsert error: ${error.message}`);
        }
      }
      console.log(`   ✅ Upserted ${embeddingResults.length} chunks to Supabase`);

    } catch (error) {
      console.error('❌ ROA ingestion failed:', error.message);
      this.stats.errors.push(`ROA ingestion: ${error.message}`);
    }
  }

  async generateStats() {
    console.log('\n📊 Generating statistics...');
    
    try {
      // Neo4j stats
      const eventCount = await this.neo4jClient.executeQuery(
        'MATCH (e:Event) RETURN count(e) as count'
      );
      const continuanceCount = await this.neo4jClient.executeQuery(
        'MATCH (c:Continuance) RETURN count(c) as count'
      );
      const personCount = await this.neo4jClient.executeQuery(
        'MATCH (p:Person) RETURN count(p) as count'
      );

      console.log('   Neo4j Graph Stats:');
      console.log(`     Events: ${eventCount[0]?.count || 0}`);
      console.log(`     Continuances: ${continuanceCount[0]?.count || 0}`);
      console.log(`     People: ${personCount[0]?.count || 0}`);

      // Supabase stats
      try {
        const supabaseStats = await this.supabaseClient.getStats();
        console.log('   Supabase Vector Stats:');
        console.log(`     Documents: ${supabaseStats.totalDocuments}`);
        console.log(`     Chunks: ${supabaseStats.totalChunks}`);
        console.log(`     Sources: ${supabaseStats.sources.join(', ')}`);
      } catch (error) {
        console.log('   ⚠️  Supabase stats unavailable (not connected)');
      }

    } catch (error) {
      console.error('❌ Stats generation failed:', error.message);
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📋 INGESTION SUMMARY');
    console.log('='.repeat(50));
    
    console.log('📧 Email Data:');
    console.log(`   Parsed: ${this.stats.emails.parsed}`);
    console.log(`   Embedded: ${this.stats.emails.embedded}`);
    console.log(`   Upserted: ${this.stats.emails.upserted}`);
    
    console.log('\n📋 ROA Data:');
    console.log(`   Parsed: ${this.stats.roa.parsed}`);
    console.log(`   Embedded: ${this.stats.roa.embedded}`);
    console.log(`   Upserted: ${this.stats.roa.upserted}`);
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.stats.errors.forEach(error => console.log(`   ${error}`));
    } else {
      console.log('\n✅ No errors encountered');
    }
    
    const totalProcessed = this.stats.emails.parsed + this.stats.roa.parsed;
    const totalEmbedded = this.stats.emails.embedded + this.stats.roa.embedded;
    const totalUpserted = this.stats.emails.upserted + this.stats.roa.upserted;
    
    console.log('\n🎯 Totals:');
    console.log(`   Events Processed: ${totalProcessed}`);
    console.log(`   Embeddings Generated: ${totalEmbedded}`);
    console.log(`   Records Upserted: ${totalUpserted}`);
  }

  async run() {
    const startTime = Date.now();
    
    try {
      await this.connect();
      
      await this.ingestEmails();
      await this.ingestROA();
      await this.generateStats();
      
      this.printSummary();
      
      const duration = (Date.now() - startTime) / 1000;
      console.log(`\n⏱️  Total processing time: ${duration.toFixed(2)}s`);
      
    } catch (error) {
      console.error('❌ Pipeline failed:', error.message);
      this.stats.errors.push(`Pipeline: ${error.message}`);
    } finally {
      await this.disconnect();
    }
  }
}

async function main() {
  console.log('🚀 Graph RAG Data Ingestion Pipeline');
  console.log('='.repeat(50));
  
  const pipeline = new DataIngestionPipeline();
  await pipeline.run();
  
  const hasErrors = pipeline.stats.errors.length > 0;
  process.exit(hasErrors ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DataIngestionPipeline };
