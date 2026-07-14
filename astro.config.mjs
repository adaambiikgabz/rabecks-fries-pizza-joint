import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://rabecks-fries-pizza-joint.vercel.app',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
});
