#!/usr/bin/env node

/**
 * Test Neo4j Connection and Basic Operations
 * Verifies the Graph RAG system can connect to Neo4j Aura DB
 */

const { getNeo4jClient } = require('./src/lib/neo4j.ts');

async function testNeo4jConnection() {
  console.log('🔍 Testing Neo4j Aura DB connection...');
  
  try {
    const neo4jClient = getNeo4jClient();
    await neo4jClient.connect();
    
    console.log('✅ Neo4j connection successful!');
    
    // Test basic query
    const result = await neo4jClient.executeQuery('RETURN 1 as test');
    console.log('✅ Basic query test passed:', result);
    
    // Test event upsert
    const testEvent = {
      externalId: 'test_event_001',
      type: 'test',
      date: '2024-01-01',
      description: 'Test event for connection verification',
      actor: 'test',
      sourcePath: '/test/path',
      snippet: 'Test snippet'
    };
    
    await neo4jClient.upsertEvent(testEvent);
    console.log('✅ Event upsert test passed');
    
    // Test continuance upsert
    const testContinuance = {
      externalId: 'test_continuance_001',
      date: '2024-01-01',
      reason: 'Test continuance',
      requestedBy: 'test',
      durationDays: 7,
      sourcePath: '/test/path',
      snippet: 'Test continuance snippet'
    };
    
    await neo4jClient.upsertContinuance(testContinuance);
    console.log('✅ Continuance upsert test passed');
    
    // Test query for our test data
    const events = await neo4jClient.executeQuery(
      'MATCH (e:Event) WHERE e.externalId STARTS WITH "test_" RETURN e LIMIT 5'
    );
    console.log('✅ Event query test passed:', events.length, 'events found');
    
    const continuances = await neo4jClient.executeQuery(
      'MATCH (c:Continuance) WHERE c.externalId STARTS WITH "test_" RETURN c LIMIT 5'
    );
    console.log('✅ Continuance query test passed:', continuances.length, 'continuances found');
    
    // Clean up test data
    await neo4jClient.executeQuery(
      'MATCH (n) WHERE n.externalId STARTS WITH "test_" DELETE n'
    );
    console.log('✅ Test data cleanup completed');
    
    await neo4jClient.disconnect();
    console.log('✅ Neo4j connection closed successfully');
    
    return true;
    
  } catch (error) {
    console.error('❌ Neo4j connection test failed:', error.message);
    return false;
  }
}

async function testVoyageEmbedding() {
  console.log('\n🔍 Testing Voyage 3 Large embedding...');
  
  try {
    const { getVoyageClient } = require('./src/lib/embeddings/voyage.ts');
    const voyageClient = getVoyageClient();
    
    const testText = 'This is a test document for embedding generation.';
    const embedding = await voyageClient.embedText(testText);
    
    console.log('✅ Voyage embedding test passed');
    console.log('   Embedding dimensions:', embedding.length);
    console.log('   First 5 values:', embedding.slice(0, 5));
    
    return true;
    
  } catch (error) {
    console.error('❌ Voyage embedding test failed:', error.message);
    return false;
  }
}

async function testEmailParser() {
  console.log('\n🔍 Testing email parser...');
  
  try {
    const { parseAllEmails } = require('./src/lib/ingestion/email-parser.ts');
    const emailEvents = await parseAllEmails();
    
    console.log('✅ Email parser test passed');
    console.log('   Total emails parsed:', emailEvents.length);
    
    if (emailEvents.length > 0) {
      console.log('   Sample event:', {
        id: emailEvents[0].externalId,
        actor: emailEvents[0].actor,
        description: emailEvents[0].description.substring(0, 50) + '...'
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Email parser test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Graph RAG System Connection Tests');
  console.log('=' .repeat(50));
  
  const results = await Promise.all([
    testNeo4jConnection(),
    testVoyageEmbedding(),
    testEmailParser()
  ]);
  
  console.log('\n' + '=' .repeat(50));
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  if (passed === total) {
    console.log(`🎉 All tests passed! (${passed}/${total})`);
    console.log('\n📝 Next steps:');
    console.log('1. Set up Supabase project and run migration');
    console.log('2. Configure environment variables');
    console.log('3. Run ingestion pipeline');
    console.log('4. Test Graph RAG query endpoint');
  } else {
    console.log(`❌ Some tests failed (${passed}/${total})`);
    console.log('Please fix the issues before proceeding.');
  }
  
  process.exit(passed === total ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testNeo4jConnection, testVoyageEmbedding, testEmailParser };
