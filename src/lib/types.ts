export interface Tag {
  id: string;
  label: string;
  labelEn: string;
  category: 'type' | 'language' | 'payment' | 'access';
  icon?: string;
}

export const TAGS: Tag[] = [
  { id: 'chatbot', label: 'Чат-бот', labelEn: 'Chatbot', category: 'type' },
  { id: 'image-gen', label: 'Генерация изображений', labelEn: 'Image Gen', category: 'type' },
  { id: 'video', label: 'Видео', labelEn: 'Video', category: 'type' },
  { id: 'telegram-bot', label: 'Telegram бот', labelEn: 'Telegram Bot', category: 'type' },
  { id: 'russian', label: 'Понимает русский', labelEn: 'Russian', category: 'language' },
  { id: 'russian-cards', label: 'Карты РФ', labelEn: 'Russian Cards', category: 'payment' },
  { id: 'crypto', label: 'Крипто', labelEn: 'Crypto', category: 'payment' },
  { id: 'no-vpn', label: 'Без VPN', labelEn: 'No VPN', category: 'access' }
];

export const TAGS_BY_ID = Object.fromEntries(TAGS.map(t => [t.id, t]));

export const TAGS_BY_CATEGORY = TAGS.reduce((acc, tag) => {
  if (!acc[tag.category]) acc[tag.category] = [];
  acc[tag.category].push(tag);
  return acc;
}, {} as Record<Tag['category'], Tag[]>);

export const PRICE_MODEL_LABELS: Record<string, string> = {
  free: 'Бесплатно',
  freemium: 'Freemium',
  paid: 'Платно'
};

export interface ToolData {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  gifPreview?: string;
  tags: string[];
  priceModel: 'free' | 'freemium' | 'paid';
  priceFrom?: number;
  isNsfw: boolean;
  affiliateLink: string;
  rating?: number;
  acceptsRussianCards: boolean;
  requiresVpn: boolean;
  supportsRussian: boolean;
  paymentMethods?: string[];
  telegramBotLink?: string;
  faq?: { question: string; answer: string }[];
  publishedAt: Date;
  updatedAt?: Date;
}
