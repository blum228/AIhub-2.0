import type { ToolData } from './types';

export interface CollectionData {
  slug: string;
  title: string;
  description: string;
  seoDescription: string;
  icon: string;
  filterTag?: string;
  filterField?: 'acceptsRussianCards' | 'requiresVpn' | 'priceModel';
  filterValue?: any;
  order: number;
}

/**
 * Check if a tool matches a collection's filter criteria
 */
export function toolMatchesCollection(tool: ToolData, collection: CollectionData): boolean {
  // Check explicit collection membership first (highest priority)
  if ((tool as any).collections?.includes(collection.slug)) {
    return true;
  }
  
  // Check tag filter
  if (collection.filterTag && tool.tags.includes(collection.filterTag)) {
    return true;
  }
  
  // Check field filter
  if (collection.filterField && collection.filterValue !== undefined) {
    const fieldValue = tool[collection.filterField];
    return fieldValue === collection.filterValue;
  }
  
  return false;
}

/**
 * Get all tools that belong to a collection
 */
export function getToolsForCollection(tools: ToolData[], collection: CollectionData): ToolData[] {
  return tools.filter(tool => toolMatchesCollection(tool, collection));
}

/**
 * Get tool count for a collection
 */
export function getToolCountForCollection(tools: ToolData[], collection: CollectionData): number {
  return getToolsForCollection(tools, collection).length;
}

/**
 * Get primary collection for a tool (first matching collection by order)
 */
export function getPrimaryCollection(tool: ToolData, collections: CollectionData[]): CollectionData | undefined {
  // First check explicit membership
  const explicitCollections = (tool as any).collections as string[] | undefined;
  if (explicitCollections?.length) {
    const found = collections.find(c => explicitCollections.includes(c.slug));
    if (found) return found;
  }
  
  // Then check by filter criteria, sorted by order
  const sortedCollections = [...collections].sort((a, b) => a.order - b.order);
  return sortedCollections.find(c => toolMatchesCollection(tool, c));
}

/**
 * Get all collections a tool belongs to
 */
export function getCollectionsForTool(tool: ToolData, collections: CollectionData[]): CollectionData[] {
  return collections.filter(c => toolMatchesCollection(tool, c));
}

/**
 * Sort collections by order field
 */
export function sortCollectionsByOrder(collections: CollectionData[]): CollectionData[] {
  return [...collections].sort((a, b) => a.order - b.order);
}
