import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchShopProducts } from '../src/lib/fourthwall.ts';

const config = { FOURTHWALL_PUBLIC_TOKEN: 'test-token', FOURTHWALL_SHOP_HOST: 'shop.example.com' };
const products = [
  { id: 'shirt', slug: 'shirt', name: 'Shirt', images: [{ url: 'https://images.example.com/old-shirt.webp' }], variants: [{ unitPrice: { value: 30, currency: 'USD' } }] },
  { id: 'hat', slug: 'hat', name: 'Hat', images: [{ url: 'https://images.example.com/old-hat.webp' }], variants: [{ unitPrice: { value: 22, currency: 'USD' } }] },
];

function mockSources(t, feed) {
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (new URL(url).hostname === 'storefront-api.fourthwall.com') return Response.json({ results: products });
    return feed();
  });
}

test('published shop images replace stale API mockups without changing product order or prices', async (t) => {
  mockSources(t, () => Response.json({ products: [
    { handle: 'hat', image: 'https://images.example.com/new-hat.webp' },
    { handle: 'shirt', image: 'https://images.example.com/new-shirt.webp' },
  ] }));
  const result = await fetchShopProducts(config);
  assert.deepEqual(result.map(p => [p.name, p.price, p.image]), [
    ['Shirt', '$30', 'https://images.example.com/new-shirt.webp'],
    ['Hat', '$22', 'https://images.example.com/new-hat.webp'],
  ]);
});

test('a failed published feed preserves API product images', async (t) => {
  mockSources(t, () => new Response('Unavailable', { status: 503 }));
  const result = await fetchShopProducts(config);
  assert.deepEqual(result.map(p => p.image), products.map(p => p.images[0].url));
});

test('missing or empty published images fall back independently for each product', async (t) => {
  mockSources(t, () => Response.json({ products: [{ handle: 'shirt', image: '' }] }));
  const result = await fetchShopProducts(config);
  assert.deepEqual(result.map(p => p.image), products.map(p => p.images[0].url));
});

test('a network failure in the published feed does not hide the shop', async (t) => {
  mockSources(t, () => { throw new Error('Connection reset'); });
  const result = await fetchShopProducts(config);
  assert.equal(result.length, 2);
  assert.equal(result[0].image, products[0].images[0].url);
});
