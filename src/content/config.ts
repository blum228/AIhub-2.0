import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(150),
    description: z.string().min(10).max(300),
    publishedAt: z.coerce.date(),
    author: z.string().min(1),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    relatedTools: z.array(z.string()).optional()
  })
});

const toolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(100),
    shortDescription: z.string().min(10).max(200),
    coverImage: z.string(),
    gifPreview: z.string().optional(),
    tags: z.array(z.string()).min(1),
    priceModel: z.enum(['free', 'freemium', 'paid']),
    isNsfw: z.boolean().default(true),
    affiliateLink: z.string().url(),
    rating: z.number().min(0).max(5).optional(),
    acceptsRussianCards: z.boolean().default(false),
    requiresVpn: z.boolean().default(true),
    supportsRussian: z.boolean().default(false),
    paymentMethods: z.array(z.string()).optional(),
    telegramBotLink: z.string().optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    // v2: Explicit collection membership
    collections: z.array(z.string()).optional()
  })
});

const collectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(10).max(300),
    seoDescription: z.string().min(50).max(160),
    icon: z.string(),
    filterTag: z.string().optional(),
    filterField: z.enum(['acceptsRussianCards', 'requiresVpn', 'priceModel']).optional(),
    filterValue: z.any().optional(),
    order: z.number().default(0)
  })
});

export const collections = { 
  tools: toolsCollection,
  collections: collectionsCollection,
  blog: blogCollection
};

// Export schemas for testing
export const toolSchema = toolsCollection.schema;
export const collectionSchema = collectionsCollection.schema;
export const blogSchema = blogCollection.schema;
