import { Driver, Session, Result } from 'neo4j-driver';
import { env } from '../env';

export interface Neo4jConfig {
  uri: string;
  username: string;
  password: string;
  database?: string;
}

export interface GraphNode {
  id: string;
  labels: string[];
  properties: Record<string, any>;
}

export interface GraphRelationship {
  id: string;
  type: string;
  startNodeId: string;
  endNodeId: string;
  properties: Record<string, any>;
}

export class Neo4jClient {
  private driver: Driver | null = null;
  private config: Neo4jConfig;

  constructor(config: Neo4jConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.driver) return;

    try {
      const { default: neo4j } = await import('neo4j-driver');
      this.driver = neo4j.driver(
        this.config.uri,
        neo4j.auth.basic(this.config.username, this.config.password)
      );
      
      // Test connection
      await this.driver.verifyConnectivity();
    } catch (error) {
      throw new Error(`Neo4j connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
    }
  }

  async executeQuery<T = any>(query: string, parameters?: Record<string, any>): Promise<T[]> {
    if (!this.driver) {
      throw new Error('Neo4j driver not connected');
    }

    const session = this.driver.session({ database: this.config.database });
    try {
      const result = await session.run(query, parameters);
      return result.records.map(record => record.toObject());
    } finally {
      await session.close();
    }
  }

  /**
   * Generic upsert operation for any node type
   * Consolidates all typed upsert methods
   */
  private async upsertNode(
    label: string,
    data: Record<string, any>,
    extraLabels?: string[]
  ): Promise<void> {
    if (!data.externalId) {
      throw new Error('externalId is required for upsert operations');
    }

    const extraLabelSets = extraLabels?.map(l => `SET n:${l}`).join('\n') || '';
    const query = `
      MERGE (n:${label} {externalId: $externalId})
      ${extraLabelSets}
      SET n += $properties,
          n.updatedAt = datetime()
      RETURN n
    `;

    const { externalId, ...properties } = data;
    await this.executeQuery(query, {
      externalId,
      properties,
    });
  }

  // Typed upsert operations (delegate to generic implementation)
  async upsertEvent(event: {
    externalId: string;
    type: string;
    date: string;
    description: string;
    actor: string;
    sourcePath?: string;
    snippet?: string;
  }): Promise<void> {
    await this.upsertNode('Event', event);
  }

  async upsertContinuance(continuance: {
    externalId: string;
    date: string;
    reason: string;
    requestedBy: string;
    durationDays?: number;
    sourcePath?: string;
    snippet?: string;
  }): Promise<void> {
    await this.upsertNode('Continuance', continuance);
  }

  async upsertPerson(person: {
    externalId: string;
    name: string;
    role?: string;
    email?: string;
    phone?: string;
  }): Promise<void> {
    await this.upsertNode('Person', person);
  }

  async upsertDocument(document: {
    externalId: string;
    path: string;
    type: string;
    title: string;
    date?: string;
    checksum?: string;
  }): Promise<void> {
    await this.upsertNode('Document', document);
  }

  async upsertNodeWithLabels(params: {
    externalId: string;
    labels: string[];
    properties: Record<string, any>;
  }): Promise<void> {
    if (!params.labels || params.labels.length === 0) {
      throw new Error('At least one label is required');
    }

    const [primaryLabel, ...extraLabels] = params.labels;
    await this.upsertNode(primaryLabel, {
      externalId: params.externalId,
      ...params.properties,
    }, extraLabels);
  }

  // Relationship operations
  async createRelationship(
    fromId: string,
    toId: string,
    relationshipType: string,
    properties?: Record<string, any>
  ): Promise<void> {
    const query = `
      MATCH (a), (b)
      WHERE a.externalId = $fromId AND b.externalId = $toId
      MERGE (a)-[r:${relationshipType}]->(b)
      SET r += $properties,
          r.updatedAt = datetime()
      RETURN r
    `;

    await this.executeQuery(query, {
      fromId,
      toId,
      properties: properties || {}
    });
  }

  // Graph neighborhood queries for RAG
  async getNeighborhood(
    nodeId: string,
    hops: number = 2,
    limit: number = 50
  ): Promise<{ nodes: GraphNode[]; relationships: GraphRelationship[] }> {
    const query = `
      MATCH (n {externalId: $nodeId})
      CALL apoc.path.subgraphNodes(n, {
        relationshipFilter: '',
        labelFilter: '',
        minLevel: 0,
        maxLevel: $hops
      }) YIELD node
      WITH collect(node) as nodes
      UNWIND nodes as n1
      MATCH (n1)-[r]-(n2)
      WHERE n2 IN nodes
      RETURN DISTINCT nodes, collect(DISTINCT r) as relationships
      LIMIT $limit
    `;

    const result = await this.executeQuery(query, { nodeId, hops, limit });
    
    if (result.length === 0) {
      return { nodes: [], relationships: [] };
    }

    const record = result[0];
    const nodes = record.nodes.map((node: any) => ({
      id: node.identity.toString(),
      labels: node.labels,
      properties: node.properties
    }));

    const relationships = record.relationships.map((rel: any) => ({
      id: rel.identity.toString(),
      type: rel.type,
      startNodeId: rel.start.toString(),
      endNodeId: rel.end.toString(),
      properties: rel.properties
    }));

    return { nodes, relationships };
  }

  // Continuance analysis queries
  async getContinuancesByActor(actor: string): Promise<any[]> {
    const query = `
      MATCH (c:Continuance)
      WHERE c.requestedBy = $actor
      RETURN c
      ORDER BY c.date DESC
    `;

    return this.executeQuery(query, { actor });
  }

  async getContinuanceStats(): Promise<any[]> {
    const query = `
      MATCH (c:Continuance)
      RETURN c.requestedBy as actor,
             count(c) as count,
             sum(c.durationDays) as totalDays,
             avg(c.durationDays) as avgDays
      ORDER BY count DESC
    `;

    return this.executeQuery(query);
  }

  async getTimelineEvents(startDate?: string, endDate?: string): Promise<any[]> {
    let query = `
      MATCH (e:Event)
    `;
    
    const params: Record<string, any> = {};
    
    if (startDate || endDate) {
      query += ` WHERE `;
      const conditions = [];
      
      if (startDate) {
        conditions.push(`e.date >= $startDate`);
        params.startDate = startDate;
      }
      
      if (endDate) {
        conditions.push(`e.date <= $endDate`);
        params.endDate = endDate;
      }
      
      query += conditions.join(' AND ');
    }
    
    query += ` RETURN e ORDER BY e.date DESC`;

    return this.executeQuery(query, params);
  }
}

// Singleton instance
let neo4jClient: Neo4jClient | null = null;

export function getNeo4jClient(): Neo4jClient {
  if (!neo4jClient) {
    const config: Neo4jConfig = {
      uri: env.NEO4J_URI,
      username: env.NEO4J_USERNAME,
      password: env.NEO4J_PASSWORD,
      database: env.NEO4J_DATABASE || 'neo4j',
    };

    neo4jClient = new Neo4jClient(config);
  }

  return neo4jClient;
}
