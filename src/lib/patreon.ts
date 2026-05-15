// Build-time Patreon fetch. Pulls campaign + tier data from the v2 API.
//
// Env vars (GitHub Actions secrets, local .env):
//   PATREON_ACCESS_TOKEN   Creator's access token from the Patreon dev portal.
//                          Default lifetime ~31 days; rotate via the portal
//                          or the OAuth refresh endpoint when it expires.
//
// On any failure (missing token, network, schema drift) returns null. The
// Patreon component falls back to its static tier data and hides the
// patron-count badge, so an expired token never breaks the build.

export interface PatreonTier {
  id: string;
  name: string;
  /** Monthly price in USD as a whole-dollar string, no symbol. */
  price: string;
  amountCents: number;
  /** Description split into clean paragraphs (HTML stripped). */
  paragraphs: string[];
  patronCount: number;
}

export interface PatreonStats {
  patronCount: number;
  tiers: PatreonTier[];
}

interface CampaignResource {
  id: string;
  attributes?: { patron_count?: number };
  relationships?: {
    tiers?: { data?: Array<{ id: string; type: string }> };
  };
}

interface TierResource {
  id: string;
  type: string;
  attributes?: {
    title?: string;
    amount_cents?: number;
    description?: string;
    patron_count?: number;
    published?: boolean;
  };
}

export async function fetchPatreonStats(): Promise<PatreonStats | null> {
  const token = import.meta.env.PATREON_ACCESS_TOKEN;
  if (!token) {
    console.warn("[patreon] Missing PATREON_ACCESS_TOKEN. Falling back to static tiers.");
    return null;
  }

  const url =
    "https://www.patreon.com/api/oauth2/v2/campaigns" +
    "?include=tiers" +
    "&fields%5Bcampaign%5D=patron_count" +
    "&fields%5Btier%5D=title,amount_cents,description,patron_count,published";

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.warn(`[patreon] Fetch returned ${res.status}. Falling back to static tiers.`);
      return null;
    }
    const data = (await res.json()) as {
      data?: CampaignResource[];
      included?: TierResource[];
    };

    const campaign = data.data?.[0];
    if (!campaign) return null;

    const patronCount = campaign.attributes?.patron_count ?? 0;
    const tiers = (data.included ?? [])
      .filter((r) => r.type === "tier")
      .filter((r) => r.attributes?.published)
      .filter((r) => (r.attributes?.amount_cents ?? 0) > 0)
      .map<PatreonTier>((r) => {
        const cents = r.attributes?.amount_cents ?? 0;
        return {
          id: r.id,
          name: r.attributes?.title ?? "Untitled",
          amountCents: cents,
          price: String(Math.round(cents / 100)),
          paragraphs: htmlToParagraphs(r.attributes?.description ?? ""),
          patronCount: r.attributes?.patron_count ?? 0,
        };
      })
      .sort((a, b) => a.amountCents - b.amountCents);

    if (tiers.length === 0) return null;
    return { patronCount, tiers };
  } catch (err) {
    console.warn("[patreon] Fetch failed, falling back to static tiers.", err);
    return null;
  }
}

function htmlToParagraphs(html: string): string[] {
  return html
    .split(/<\/p>/i)
    .map((chunk) => chunk.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim())
    .filter(Boolean)
    .map((s) => decodeEntities(s));
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}
