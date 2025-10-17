import { getNeo4jClient } from '../neo4j';
import { getSupabaseClient } from '../search/supabase';

export interface IntegrityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: Record<string, any>;
}

export interface VerificationReport {
  timestamp: string;
  checks: IntegrityCheck[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

export class IntegrityVerifier {
  private neo4jClient = getNeo4jClient();
  private supabaseClient = getSupabaseClient();

  async runAllChecks(): Promise<VerificationReport> {
    const checks: IntegrityCheck[] = [];
    
    try {
      await this.neo4jClient.connect();
      
      // Run Neo4j checks
      checks.push(...await this.checkNeo4jConnection());
      checks.push(...await this.checkNeo4jDataConsistency());
      checks.push(...await this.checkNeo4jIndexes());
      
      // Run Supabase checks (if connected)
      try {
        checks.push(...await this.checkSupabaseConnection());
        checks.push(...await this.checkSupabaseDataConsistency());
        checks.push(...await this.checkVectorIndexes());
      } catch (error) {
        checks.push({
          name: 'Supabase Connection',
          status: 'warning',
          message: 'Supabase not connected - skipping vector checks',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }
      
      // Cross-system checks
      checks.push(...await this.checkCrossSystemConsistency());
      
    } catch (error) {
      checks.push({
        name: 'System Connection',
        status: 'fail',
        message: 'Failed to connect to systems',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      try {
        await this.neo4jClient.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
    }

    const summary = this.calculateSummary(checks);
    
    return {
      timestamp: new Date().toISOString(),
      checks,
      summary
    };
  }

  private async checkNeo4jConnection(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];
    
    try {
      const result = await this.neo4jClient.executeQuery('RETURN 1 as test');
      if (result && result.length > 0 && result[0].test === 1) {
        checks.push({
          name: 'Neo4j Connection',
          status: 'pass',
          message: 'Neo4j connection successful'
        });
      } else {
        checks.push({
          name: 'Neo4j Connection',
          status: 'fail',
          message: 'Neo4j connection test failed'
        });
      }
    } catch (error) {
      checks.push({
        name: 'Neo4j Connection',
        status: 'fail',
        message: 'Neo4j connection failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
    
    return checks;
  }

  private async checkNeo4jDataConsistency(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];
    
    try {
      // Check for orphaned nodes
      const orphanedEvents = await this.neo4jClient.executeQuery(
        'MATCH (e:Event) WHERE NOT (e)-[:EVIDENCES]->() AND NOT (e)-[:REFERENCED_IN]->() RETURN count(e) as count'
      );
      
      const orphanedCount = orphanedEvents[0]?.count || 0;
      if (orphanedCount === 0) {
        checks.push({
          name: 'Neo4j Data Consistency',
          status: 'pass',
          message: 'No orphaned event nodes found'
        });
      } else {
        checks.push({
          name: 'Neo4j Data Consistency',
          status: 'warning',
          message: `Found ${orphanedCount} orphaned event nodes`,
          details: { orphanedCount }
        });
      }
      
      // Check for duplicate external IDs
      const duplicateIds = await this.neo4jClient.executeQuery(
        'MATCH (n) WITH n.externalId as id, collect(n) as nodes WHERE size(nodes) > 1 RETURN id, size(nodes) as count'
      );
      
      if (duplicateIds.length === 0) {
        checks.push({
          name: 'Neo4j Duplicate IDs',
          status: 'pass',
          message: 'No duplicate external IDs found'
        });
      } else {
        checks.push({
          name: 'Neo4j Duplicate IDs',
          status: 'fail',
          message: `Found ${duplicateIds.length} duplicate external IDs`,
          details: { duplicates: duplicateIds }
        });
      }
      
    } catch (error) {
      checks.push({
        name: 'Neo4j Data Consistency',
        status: 'fail',
        message: 'Data consistency check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
    
    return checks;
  }

  private async checkNeo4jIndexes(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];
    
    try {
      // Check if indexes exist
      const indexes = await this.neo4jClient.executeQuery('SHOW INDEXES');
      
      const hasExternalIdIndex = indexes.some((idx: any) => 
        idx.labelsOrTypes?.includes('externalId') || 
        idx.properties?.includes('externalId')
      );
      
      if (hasExternalIdIndex) {
        checks.push({
          name: 'Neo4j Indexes',
          status: 'pass',
          message: 'External ID index found'
        });
      } else {
        checks.push({
          name: 'Neo4j Indexes',
          status: 'warning',
          message: 'External ID index not found - performance may be impacted'
        });
      }
      
    } catch (error) {
      checks.push({
        name: 'Neo4j Indexes',
        status: 'fail',
        message: 'Index check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
    
    return checks;
  }

  private async checkSupabaseConnection(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];
    
    try {
      const stats = await this.supabaseClient.getStats();
      checks.push({
        name: 'Supabase Connection',
        status: 'pass',
        message: 'Supabase connection successful',
        details: stats
      });
    } catch (error) {
      checks.push({
        name: 'Supabase Connection',
        status: 'fail',
        message: 'Supabase connection failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
    
    return checks;
  }

  private async checkSupabaseDataConsistency(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];
    
    try {
      // Check for orphaned chunks
      const stats = await this.supabaseClient.getStats();
      
      if (stats.totalDocuments > 0 && stats.totalChunks > 0) {
        const ratio = stats.totalChunks / stats.totalDocuments;
        if (ratio >= 1) {
          checks.push({
            name: 'Supabase Data Consistency',
            status: 'pass',
            message: `Healthy document-to-chunk ratio: ${ratio.toFixed(2)}`
          });
        } else {
          checks.push({
            name: 'Supabase Data Consistency',
            status: 'warning',
            message: `Low document-to-chunk ratio: ${ratio.toFixed(2)}`
          });
        }
      } else {
        checks.push({
          name: 'Supabase Data Consistency',
          status: 'warning',
          message: 'No data found in Supabase'
        });
      }
      
    } catch (error) {
      checks.push({
        name: 'Supabase Data Consistency',
        status: 'fail',
        message: 'Data consistency check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
    
    return checks;
  }

  private async checkVectorIndexes(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];
    
    try {
      // Test vector search functionality
      const testEmbedding = new Array(1024).fill(0.1);
      const searchResults = await this.supabaseClient.vectorSearch(
        testEmbedding,
        1,
        0.1
      );
      
      checks.push({
        name: 'Vector Indexes',
        status: 'pass',
        message: 'Vector search functionality working',
        details: { testResults: searchResults.length }
      });
      
    } catch (error) {
      checks.push({
        name: 'Vector Indexes',
        status: 'fail',
        message: 'Vector search test failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
    
    return checks;
  }

  private async checkCrossSystemConsistency(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];
    
    try {
      // Check if Neo4j events have corresponding Supabase documents
      const neo4jEvents = await this.neo4jClient.executeQuery(
        'MATCH (e:Event) RETURN e.externalId as externalId LIMIT 10'
      );
      
      if (neo4jEvents.length === 0) {
        checks.push({
          name: 'Cross-System Consistency',
          status: 'warning',
          message: 'No Neo4j events found to check consistency'
        });
        return checks;
      }
      
      let matchedCount = 0;
      for (const event of neo4jEvents) {
        try {
          const document = await this.supabaseClient.getDocument(event.externalId);
          if (document) {
            matchedCount++;
          }
        } catch (error) {
          // Document not found in Supabase
        }
      }
      
      const matchRatio = matchedCount / neo4jEvents.length;
      if (matchRatio >= 0.8) {
        checks.push({
          name: 'Cross-System Consistency',
          status: 'pass',
          message: `Good cross-system consistency: ${matchRatio.toFixed(2)}`
        });
      } else if (matchRatio >= 0.5) {
        checks.push({
          name: 'Cross-System Consistency',
          status: 'warning',
          message: `Moderate cross-system consistency: ${matchRatio.toFixed(2)}`
        });
      } else {
        checks.push({
          name: 'Cross-System Consistency',
          status: 'fail',
          message: `Poor cross-system consistency: ${matchRatio.toFixed(2)}`
        });
      }
      
    } catch (error) {
      checks.push({
        name: 'Cross-System Consistency',
        status: 'fail',
        message: 'Cross-system consistency check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
    
    return checks;
  }

  private calculateSummary(checks: IntegrityCheck[]) {
    const total = checks.length;
    const passed = checks.filter(c => c.status === 'pass').length;
    const failed = checks.filter(c => c.status === 'fail').length;
    const warnings = checks.filter(c => c.status === 'warning').length;
    
    return { total, passed, failed, warnings };
  }

  // Generate provenance report for a specific claim
  async generateProvenanceReport(claimId: string): Promise<{
    claimId: string;
    sources: Array<{
      documentId: string;
      source: string;
      excerpt: string;
      similarity: number;
      timestamp: string;
    }>;
    graphPath: Array<{
      nodeId: string;
      nodeType: string;
      properties: Record<string, any>;
    }>;
  }> {
    try {
      await this.neo4jClient.connect();
      
      // Find claim in Neo4j
      const claimNodes = await this.neo4jClient.executeQuery(
        'MATCH (c:Event {externalId: $claimId}) RETURN c',
        { claimId }
      );
      
      if (claimNodes.length === 0) {
        throw new Error(`Claim ${claimId} not found`);
      }
      
      // Get graph neighborhood
      const neighborhood = await this.neo4jClient.getNeighborhood(claimId, 2, 20);
      
      // Get Supabase sources
      const document = await this.supabaseClient.getDocument(claimId);
      const chunks = document ? await this.supabaseClient.getChunksByDocument(document.id) : [];
      
      return {
        claimId,
        sources: chunks.map(chunk => ({
          documentId: chunk.id,
          source: document?.source || 'Unknown',
          excerpt: chunk.content.substring(0, 200) + '...',
          similarity: 1.0, // Would need actual similarity calculation
          timestamp: chunk.created_at
        })),
        graphPath: neighborhood.nodes.map(node => ({
          nodeId: node.id,
          nodeType: node.labels.join(', '),
          properties: node.properties
        }))
      };
      
    } finally {
      try {
        await this.neo4jClient.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
    }
  }
}

// Singleton instance
let integrityVerifier: IntegrityVerifier | null = null;

export function getIntegrityVerifier(): IntegrityVerifier {
  if (!integrityVerifier) {
    integrityVerifier = new IntegrityVerifier();
  }
  return integrityVerifier;
}
