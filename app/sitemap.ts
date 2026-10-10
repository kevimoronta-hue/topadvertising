import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE.url}/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE.url}/aviso-legal`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
