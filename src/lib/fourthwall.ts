// Build-time Fourthwall fetch. Pulls a small set of products from the
// Storefront API, with current mockups from the published shop feed.
//
// Env vars (GitHub Actions secrets, local .env):
//   FOURTHWALL_PUBLIC_TOKEN       Public storefront token (the "ptkn_..." form)
//   FOURTHWALL_COLLECTION_SLUG    Collection to feature (default: "all")
//   FOURTHWALL_SHOP_HOST          Storefront host for product URLs (default: "shop.currentheading.com")
//
// On any failure (missing token, network, schema drift) returns []. The
// Shop component renders its CTA fallback when the list is empty.

export interface ShopProduct {
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

const PRODUCT_LIMIT = 4;

interface FourthwallConfig {
  FOURTHWALL_PUBLIC_TOKEN?: string;
  FOURTHWALL_COLLECTION_SLUG?: string;
  FOURTHWALL_SHOP_HOST?: string;
}

export async function fetchShopProducts(env: FourthwallConfig = import.meta.env): Promise<ShopProduct[]> {
  const token = env.FOURTHWALL_PUBLIC_TOKEN;
  if (!token) {
    console.warn("[fourthwall] Missing FOURTHWALL_PUBLIC_TOKEN. Shop will show CTA fallback.");
    return [];
  }

  const collection = env.FOURTHWALL_COLLECTION_SLUG ?? "all";
  const host = env.FOURTHWALL_SHOP_HOST ?? "shop.currentheading.com";
  const url =
    `https://storefront-api.fourthwall.com/v1/collections/${encodeURIComponent(collection)}/products` +
    `?currency=USD&storefront_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[fourthwall] Fetch returned ${res.status}. Using CTA fallback.`);
      return [];
    }
    const data = (await res.json()) as { results?: FourthwallProduct[] };
    const raw = data.results ?? [];
    const publishedImages = await fetchPublishedImages(host, collection);

    return raw.slice(0, PRODUCT_LIMIT).map((p) => ({
      id: p.id,
      name: p.name,
      price: formatPrice(p.variants?.[0]?.unitPrice),
      image: publishedImages.get(p.slug) ?? p.images?.[0]?.url ?? "",
      url: `https://${host}/products/${encodeURIComponent(p.slug)}`,
    }));
  } catch (err) {
    console.warn("[fourthwall] Fetch failed, using CTA fallback.", err);
    return [];
  }
}

async function fetchPublishedImages(host: string, collection: string): Promise<Map<string, string>> {
  const images = new Map<string, string>();
  try {
    // The Storefront API can retain old mockups after merchandise artwork changes.
    // Fourthwall's public collection feed reflects the images in the live shop.
    const res = await fetch(`https://${host}/collections/${encodeURIComponent(collection)}.json`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Shop feed returned ${res.status}`);
    const data = (await res.json()) as { products?: { handle?: string; image?: string }[] };
    for (const product of data.products ?? []) {
      if (typeof product.handle === "string" && typeof product.image === "string" && product.image.trim()) {
        images.set(product.handle, product.image);
      }
    }
  } catch {
    console.warn("[fourthwall] Published images unavailable. Keeping Storefront API images.");
  }
  return images;
}

function formatPrice(p: FourthwallVariant["unitPrice"]): string {
  if (!p) return "";
  if (p.currency === "USD") return `$${p.value.toFixed(0)}`;
  return `${p.value.toFixed(0)} ${p.currency}`;
}
