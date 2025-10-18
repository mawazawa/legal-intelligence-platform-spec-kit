import { GroupedData, ViewMode } from './types';
import { getCellColor, getCellIntensity } from './colorUtils';

export const exportHeatmapToCanvas = (
  categories: string[],
  subcategories: string[],
  groupedData: Record<string, GroupedData>,
  viewMode: ViewMode
): void => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = 800;
  canvas.height = 600;

  const cellWidth = canvas.width / subcategories.length;
  const cellHeight = canvas.height / categories.length;

  categories.forEach((category, categoryIndex) => {
    subcategories.forEach((subcategory, subcategoryIndex) => {
      const key = `${category}-${subcategory}`;
      const groupData = groupedData[key];

      if (groupData) {
        const color = getCellColor(groupData.items[0], viewMode);
        const intensity = getCellIntensity(groupData.items[0], viewMode);

        ctx.fillStyle = color;
        ctx.globalAlpha = intensity;
        ctx.fillRect(
          subcategoryIndex * cellWidth,
          categoryIndex * cellHeight,
          cellWidth,
          cellHeight
        );

        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          subcategoryIndex * cellWidth,
          categoryIndex * cellHeight,
          cellWidth,
          cellHeight
        );
      }
    });
  });

  // Export
  const link = document.createElement('a');
  link.download = 'evidence-heatmap.png';
  link.href = canvas.toDataURL();
  link.click();
};
