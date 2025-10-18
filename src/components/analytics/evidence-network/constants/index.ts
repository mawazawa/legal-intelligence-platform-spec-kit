export const NODE_SIZES = {
  airtight: 40,
  strong: 35,
  moderate: 30,
  weak: 25,
  default: 30
};

export const NODE_COLORS = {
  petitioner: {
    airtight: '#dc2626',
    strong: '#ea580c',
    moderate: '#d97706',
    weak: '#ca8a04',
    default: '#dc2626'
  },
  respondent: {
    airtight: '#059669',
    strong: '#0d9488',
    moderate: '#0891b2',
    weak: '#0284c7',
    default: '#059669'
  },
  neutral: '#6b7280'
};

export const EDGE_COLORS = {
  supports: '#059669',
  contradicts: '#dc2626',
  relates: '#6b7280',
  rebuts: '#ea580c',
  default: '#6b7280'
};

export const CANVAS_CONFIG = {
  width: 800,
  height: 600,
  minZoom: 0.1,
  maxZoom: 3,
  zoomStep: 0.2
};
