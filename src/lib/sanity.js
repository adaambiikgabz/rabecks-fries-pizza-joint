import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset   = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const client = projectId
  ? createClient({ projectId, dataset, useCdn: false, apiVersion: '2024-01-01' })
  : null;

const builder = client ? imageUrlBuilder(client) : null;
export const urlFor = (source) => builder?.image(source);

export async function getSiteSettings() {
  if (!client) return null;
  try {
    return await client.fetch(`*[_type == "siteSettings"][0] {
      ...,
      "heroKitchenUrl":    heroKitchenImage.asset->url,
      "heroStorefrontUrl": heroStorefrontImage.asset->url
    }`);
  } catch { return null; }
}

export async function getMenuItems() {
  if (!client) return [];
  try {
    return await client.fetch(
      `*[_type == "menuItem"] | order(category asc, order asc) {
        _id, name, description, price, category, featured,
        "imageUrl": image.asset->url
      }`
    );
  } catch { return []; }
}
