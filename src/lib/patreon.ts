// Build-time Patreon fetch. Pulls the campaign's live patron count for
// display in the membership section.
//
// Env vars (GitHub Actions secrets, local .env):
//   PATREON_ACCESS_TOKEN   Creator's access token from the Patreon dev portal.
//                          Default lifetime ~31 days; rotate via the portal
//                          or the OAuth refresh endpoint when it expires.
//
// On any failure (missing token, network, schema drift) returns null. The
// Patreon component hides the badge when this happens, so an expired
// token never breaks the build.

export interface PatreonStats {
  patronCount: number;
}

interface CampaignAttributes {
  patron_count?: number;
}
interface CampaignResource {
  attributes?: CampaignAttributes;
}

export async function fetchPatreonStats(): Promise<PatreonStats | null> {
  const token = import.meta.env.PATREON_ACCESS_TOKEN;
  if (!token) {
    console.warn("[patreon] Missing PATREON_ACCESS_TOKEN. Skipping patron count.");
    return null;
  }

  const url =
    "https://www.patreon.com/api/oauth2/v2/campaigns" +
    "?fields%5Bcampaign%5D=patron_count";

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.warn(`[patreon] Fetch returned ${res.status}. Hiding patron count.`);
      return null;
    }
    const data = (await res.json()) as { data?: CampaignResource[] };
    const count = data.data?.[0]?.attributes?.patron_count;
    if (typeof count !== "number") return null;
    return { patronCount: count };
  } catch (err) {
    console.warn("[patreon] Fetch failed, hiding patron count.", err);
    return null;
  }
}
