import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'automationbyJT Free Tools',
    short_name: 'JT Tools',
    description: 'Free business tools for South Florida',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f5f0',
    theme_color: '#1D9E75',
  };
}
