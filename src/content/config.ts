import { defineCollection, z } from 'astro:content';

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
    updatedAt: z.coerce.date().optional()
  })
});

export const collections = { tools: toolsCollection };

// Export schema for testing
export const toolSchema = toolsCollection.schema;
