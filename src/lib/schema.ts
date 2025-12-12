/**
 * Schema.org JSON-LD generators for SEO
 * Generates structured data for Product, FAQ, and Breadcrumb schemas
 */

import type { ToolData } from './types';

// Schema.org types
export interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  image?: string;
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  offers: {
    "@type": "Offer";
    price: number | string;
    priceCurrency: string;
    availability: string;
  };
}

export interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Generate Product Schema.org JSON-LD
 */
export function generateProductSchema(
  tool: Pick<ToolData, 'title' | 'shortDescription' | 'coverImage' | 'rating' | 'priceModel' | 'priceFrom'>,
  siteUrl: string
): ProductSchema {
  if (!tool.title || !tool.shortDescription) {
    throw new Error('Product schema requires title and shortDescription');
  }

  const schema: ProductSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tool.title,
    description: tool.shortDescription,
    offers: {
      "@type": "Offer",
      price: tool.priceModel === 'free' ? 0 : (tool.priceFrom ?? 0),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    }
  };

  if (tool.coverImage) {
    schema.image = tool.coverImage.startsWith('http') 
      ? tool.coverImage 
      : `${siteUrl}${tool.coverImage}`;
  }

  if (tool.rating !== undefined && tool.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: 5,
      worstRating: 1
    };
  }

  return schema;
}

/**
 * Generate FAQPage Schema.org JSON-LD
 * Returns null if FAQ is empty or undefined
 */
export function generateFAQSchema(
  faq: ToolData['faq']
): FAQPageSchema | null {
  if (!faq || faq.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

/**
 * Generate BreadcrumbList Schema.org JSON-LD
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  siteUrl: string
): BreadcrumbListSchema {
  if (!items || items.length === 0) {
    throw new Error('BreadcrumbList schema requires at least one item');
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const listItem: BreadcrumbListSchema['itemListElement'][0] = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label
      };

      if (item.href) {
        listItem.item = item.href.startsWith('http') 
          ? item.href 
          : `${siteUrl}${item.href}`;
      }

      return listItem;
    })
  };
}

/**
 * Validate that a schema object is valid JSON-LD
 * Returns true if valid, throws error if invalid
 */
export function validateSchema(schema: unknown): boolean {
  if (!schema || typeof schema !== 'object') {
    throw new Error('Schema must be a non-null object');
  }

  const obj = schema as Record<string, unknown>;
  
  if (obj['@context'] !== 'https://schema.org') {
    throw new Error('Schema must have @context: "https://schema.org"');
  }

  if (!obj['@type'] || typeof obj['@type'] !== 'string') {
    throw new Error('Schema must have a valid @type');
  }

  // Validate JSON serialization
  try {
    JSON.stringify(schema);
  } catch {
    throw new Error('Schema must be JSON serializable');
  }

  return true;
}
