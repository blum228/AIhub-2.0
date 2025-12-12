import type { ToolData } from './types';

/**
 * Сортировка инструментов по рейтингу (по убыванию)
 * Инструменты без рейтинга идут в конец
 */
export function sortToolsByRating<T extends Pick<ToolData, 'rating'>>(tools: T[]): T[] {
  return [...tools].sort((a, b) => {
    // Оба без рейтинга — сохраняем порядок
    if (a.rating === undefined && b.rating === undefined) return 0;
    // Без рейтинга — в конец
    if (a.rating === undefined) return 1;
    if (b.rating === undefined) return -1;
    // По убыванию рейтинга
    return b.rating - a.rating;
  });
}

/**
 * Фильтрация инструментов по тегам (AND логика)
 * Пустой набор тегов — возвращает все инструменты
 */
export function filterToolsByTags<T extends Pick<ToolData, 'tags'>>(
  tools: T[],
  selectedTags: string[]
): T[] {
  if (selectedTags.length === 0) return tools;
  return tools.filter(tool =>
    selectedTags.every(tag => tool.tags.includes(tag))
  );
}

/**
 * Поиск похожих инструментов по общим тегам
 */
export function findRelatedTools<T extends Pick<ToolData, 'slug' | 'tags'>>(
  currentTool: T,
  allTools: T[],
  limit = 4
): T[] {
  return allTools
    .filter(tool => tool.slug !== currentTool.slug)
    .map(tool => ({
      tool,
      sharedTags: tool.tags.filter(tag => currentTool.tags.includes(tag)).length
    }))
    .filter(({ sharedTags }) => sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, limit)
    .map(({ tool }) => tool);
}
