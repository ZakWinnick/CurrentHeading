// Build-time Fourthwall fetch. Pulls a small set of products from the
// Storefront API and returns sanitized data (name, price, image, url).
//
// Env vars (GitHub Actions secrets, local .env):
//   FOURTHWALL_PUBLIC_TOKEN       Public storefront token (the "ptkn_..." form)
//   FOURTHWALL_COLLECTION_SLUG    Collection to feature (default: "all")
//   FOURTHWALL_SHOP_HOST          Storefront host for product URLs (default: "wyldwattage.store")
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

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  const token = import.meta.env.FOURTHWALL_PUBLIC_TOKEN;
  if (!token) {
    console.warn("[fourthwall] Missing FOURTHWALL_PUBLIC_TOKEN. Shop will show CTA fallback.");
    return [];
  }

  const collection = import.meta.env.FOURTHWALL_COLLECTION_SLUG ?? "all";
  const host = import.meta.env.FOURTHWALL_SHOP_HOST ?? "wyldwattage.store";
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

    return raw.slice(0, PRODUCT_LIMIT).map((p) => ({
      id: p.id,
      name: p.name,
      price: formatPrice(p.variants?.[0]?.unitPrice),
      image: p.images?.[0]?.url ?? "",
      url: `https://${host}/products/${encodeURIComponent(p.slug)}`,
    }));
  } catch (err) {
    console.warn("[fourthwall] Fetch failed, using CTA fallback.", err);
    return [];
  }
}

function formatPrice(p: FourthwallVariant["unitPrice"]): string {
  if (!p) return "";
  if (p.currency === "USD") return `$${p.value.toFixed(0)}`;
  return `${p.value.toFixed(0)} ${p.currency}`;
}
