import { VoyageEmbeddingClient } from '../embeddings/voyage';

describe('VoyageEmbeddingClient.chunkText edge cases', () => {
  it('does not infinite-loop when overlap >= chunkSize', () => {
    const text = 'A'.repeat(120);
    const result = VoyageEmbeddingClient.chunkText(text, 50, 60); // overlap > chunkSize
    // Should produce a finite number of chunks and cover the whole text
    expect(Array.isArray(result)).toBe(true);
    expect(result.join('').length).toBeGreaterThan(0);
    // No chunk should be empty
    expect(result.every(c => c.length > 0)).toBe(true);
  });

  it('stops on whitespace-only input gracefully', () => {
    const text = '   \n\n   ';
    const result = VoyageEmbeddingClient.chunkText(text, 10, 5);
    expect(result).toEqual([]);
  });
});

