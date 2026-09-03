import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { imageField, draftField, statusField, stringListField } from './lib/blog-schema';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    categories: stringListField,
    tags: stringListField,
    draft: draftField,
    _status: statusField,
    featuredImage: imageField,
    heroImage: imageField,
    imageAlt: z.string().optional(),
    useLiveHtml: z.boolean().optional(),
  }).passthrough()
    // pubDate is optional in Payload output but templates call .toISOString()
    // on it — fall back rather than shipping undefined.
    .transform((d) => ({ ...d, pubDate: d.pubDate ?? d.date ?? new Date() })),
});

const pages = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    featuredImage: imageField,
    pageType: z.enum(['product']).optional(),
  }),
});

export const collections = { blog, pages };
