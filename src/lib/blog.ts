import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/**
 * Сортирует посты блога по дате публикации (новые первыми)
 */
export function sortBlogPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => 
    b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
}

/**
 * Рассчитывает время чтения статьи в минутах
 * Средняя скорость чтения: 200 слов/мин для русского текста
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Получает пост блога по slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getCollection('blog');
  return posts.find(post => post.slug === slug);
}

/**
 * Получает все посты блога, отсортированные по дате
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  return sortBlogPostsByDate(posts);
}

/**
 * Получает последние N постов блога
 */
export async function getRecentBlogPosts(count: number): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, count);
}
