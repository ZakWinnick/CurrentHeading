// Cloudflare Pages Function: GET /api/shop
//
// Proxies the Fourthwall Storefront API and returns a sanitized list of
// products (name, price, image, url). On any failure we return
// `{ products: [] }` so the client can render its CTA fallback.
//
// Env vars (Cloudflare Pages dashboard):
//   FOURTHWALL_PUBLIC_TOKEN       Public storefront token (the "ptkn_..." form)
//   FOURTHWALL_COLLECTION_SLUG    Collection to feature (default: "all")
//   FOURTHWALL_SHOP_HOST          Storefront host for product URLs (default: "wyldwattage.store")
//
// API shape verified against:
//   https://storefront-api.fourthwall.com/v1/collections/{slug}/products
//     ?currency=USD&storefront_token={ptkn_...}

interface Env {
  FOURTHWALL_PUBLIC_TOKEN?: string;
  FOURTHWALL_COLLECTION_SLUG?: string;
  FOURTHWALL_SHOP_HOST?: string;
}

interface SanitizedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  url: string;
}

interface FourthwallImage { url: string }
interface FourthwallVariant {
  unitPrice?: { value: number; currency: string };
}
interface FourthwallProduct {
  id: string;
  name: string;
  slug: string;
  images?: FourthwallImage[];
  variants?: FourthwallVariant[];
}

// Cache 15 minutes at the edge so we don't hammer Fourthwall.
const CACHE_SECONDS = 15 * 60;
const PRODUCT_LIMIT = 4;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const token = env.FOURTHWALL_PUBLIC_TOKEN;
  if (!token) return json({ products: [] satisfies SanitizedProduct[] });

  const collection = env.FOURTHWALL_COLLECTION_SLUG ?? "all";
  const host = env.FOURTHWALL_SHOP_HOST ?? "wyldwattage.store";
  const url =
    `https://storefront-api.fourthwall.com/v1/collections/${encodeURIComponent(collection)}/products` +
    `?currency=USD&storefront_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return json({ products: [] satisfies SanitizedProduct[] });

    const data = (await res.json()) as { results?: FourthwallProduct[] };
    const raw = data.results ?? [];

    const products: SanitizedProduct[] = raw.slice(0, PRODUCT_LIMIT).map((p) => {
      const price = formatPrice(p.variants?.[0]?.unitPrice);
      return {
        id: p.id,
        name: p.name,
        price,
        image: p.images?.[0]?.url ?? "",
        url: `https://${host}/products/${encodeURIComponent(p.slug)}`,
      };
    });

    return json({ products }, CACHE_SECONDS);
  } catch {
    return json({ products: [] satisfies SanitizedProduct[] });
  }
};

function formatPrice(p: FourthwallVariant["unitPrice"]): string {
  if (!p) return "";
  if (p.currency === "USD") return `$${p.value.toFixed(0)}`;
  return `${p.value.toFixed(0)} ${p.currency}`;
}

function json(body: unknown, cacheSeconds = 60): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`,
    },
  });
}
