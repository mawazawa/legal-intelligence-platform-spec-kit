export const getPredictionColor = (confidence: number): string => {
  if (confidence >= 80) return 'text-green-700 bg-green-100 border-green-300';
  if (confidence >= 60) return 'text-blue-700 bg-blue-100 border-blue-300';
  if (confidence >= 40) return 'text-yellow-700 bg-yellow-100 border-yellow-300';
  return 'text-red-700 bg-red-100 border-red-300';
};

export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive': return 'text-green-700 bg-green-100 border-green-300';
    case 'negative': return 'text-red-700 bg-red-100 border-red-300';
    case 'neutral': return 'text-gray-700 bg-gray-100 border-gray-300';
    default: return 'text-gray-700 bg-gray-100 border-gray-300';
  }
};
