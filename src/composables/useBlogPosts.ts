import { CustomMarkdownParser } from '@/utils/classes/CustomMarkDownParser.class';
import type { BlogFile } from '@/utils/types/BlogItem.type';

const blogFiles = import.meta.glob('@/assets/blogs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/**
 * Every markdown post under src/assets/blogs, shaped for the views that list them.
 * Order follows the file glob; callers that need a specific order sort their own copy.
 */
export function useBlogPosts(): BlogFile[] {
  return Object.entries(blogFiles).map(([path, content]) => {
    const match = path.match(/blogs\/(\d{4})\/(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    return {
      path,
      markdown: new CustomMarkdownParser(content as string),
      year: match?.[1] ?? '',
      date: match?.[2] ?? '',
      slug: match?.[3] ?? '',
      title: match ? match[3].replace(/-/g, ' ') : path,
    };
  });
}