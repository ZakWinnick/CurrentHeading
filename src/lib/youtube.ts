// Build-time YouTube fetch. Pulls latest uploads from the channel's
// uploads playlist, enriches with view count and duration.
//
// Env vars (Cloudflare Pages dashboard, or local .env):
//   YOUTUBE_API_KEY      Google Cloud API key with YouTube Data API v3 enabled
//   YOUTUBE_CHANNEL_ID   The "UC..." channel ID for @currentheading
//
// Falls back to a small placeholder set if the env vars are missing or the
// fetch fails. Site builds succeed in either case.

export interface VideoMeta {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  tag: string;
}

const FALLBACK: VideoMeta[] = [
  placeholder(1, "Site Review", "Latest site review coming soon. Check the channel for the live drop."),
  placeholder(2, "Network Take", "Latest network take coming soon. Check the channel for the live drop."),
  placeholder(3, "Field Notes", "Latest field notes coming soon. Check the channel for the live drop."),
  placeholder(4, "Site Review", "Latest site review coming soon. Check the channel for the live drop."),
  placeholder(5, "Operator", "Latest operator post coming soon. Check the channel for the live drop."),
  placeholder(6, "Rant", "Latest rant coming soon. Check the channel for the live drop."),
];

function placeholder(i: number, tag: string, title: string): VideoMeta {
  return {
    id: `placeholder-${i}`,
    title,
    url: "https://youtube.com/@currentheading",
    thumbnail: "",
    duration: "",
    views: "",
    publishedAt: new Date().toISOString(),
    tag,
  };
}

function uploadsPlaylistId(channelId: string): string {
  // Convention: a channel's uploads playlist is the channel ID with the
  // leading "UC" replaced by "UU".
  if (channelId.startsWith("UC")) return "UU" + channelId.slice(2);
  return channelId;
}

function parseDuration(iso: string): string {
  // PT1H2M3S -> 1:02:03, PT12M38S -> 12:38, PT45S -> 0:45
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "0:00";
  const h = parseInt(m[1] ?? "0", 10);
  const min = parseInt(m[2] ?? "0", 10);
  const sec = parseInt(m[3] ?? "0", 10);
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h > 0) return `${h}:${pad(min)}:${pad(sec)}`;
  return `${min}:${pad(sec)}`;
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function tagFor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("review")) return "Site Review";
  if (t.includes("rant") || t.includes("opinion")) return "Rant";
  if (t.includes("network") || t.includes("ea ") || t.includes("tesla")) return "Network Take";
  if (t.includes("road") || t.includes("trip")) return "Road Trip";
  if (t.includes("operator") || t.includes("rangeway")) return "Operator";
  return "Field Notes";
}

interface PlaylistItem {
  contentDetails: { videoId: string };
  snippet: { title: string; thumbnails: Record<string, { url: string }>; publishedAt: string };
}
interface VideoItem {
  id: string;
  contentDetails: { duration: string };
  statistics: { viewCount?: string };
}

export async function fetchLatestVideos(limit = 6): Promise<VideoMeta[]> {
  const key = import.meta.env.YOUTUBE_API_KEY;
  const channelId = import.meta.env.YOUTUBE_CHANNEL_ID;
  if (!key || !channelId) {
    console.warn("[youtube] Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID. Using placeholders.");
    return FALLBACK;
  }

  try {
    const playlistId = uploadsPlaylistId(channelId);
    const playlistUrl =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet,contentDetails&maxResults=${limit}` +
      `&playlistId=${encodeURIComponent(playlistId)}&key=${encodeURIComponent(key)}`;

    const playlistRes = await fetch(playlistUrl);
    if (!playlistRes.ok) throw new Error(`playlistItems ${playlistRes.status}`);
    const playlistJson = await playlistRes.json() as { items: PlaylistItem[] };
    const items = playlistJson.items ?? [];
    if (items.length === 0) return FALLBACK;

    const ids = items.map((it) => it.contentDetails.videoId).join(",");
    const videosUrl =
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=contentDetails,statistics&id=${encodeURIComponent(ids)}&key=${encodeURIComponent(key)}`;
    const videosRes = await fetch(videosUrl);
    if (!videosRes.ok) throw new Error(`videos ${videosRes.status}`);
    const videosJson = await videosRes.json() as { items: VideoItem[] };
    const stats = new Map(videosJson.items.map((v) => [v.id, v]));

    return items.map((it) => {
      const id = it.contentDetails.videoId;
      const meta = stats.get(id);
      const thumbs = it.snippet.thumbnails ?? {};
      const thumb =
        thumbs.maxres?.url ?? thumbs.standard?.url ?? thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? "";
      return {
        id,
        title: it.snippet.title,
        url: `https://youtube.com/watch?v=${id}`,
        thumbnail: thumb,
        duration: meta ? parseDuration(meta.contentDetails.duration) : "",
        views: meta?.statistics.viewCount ? formatViews(parseInt(meta.statistics.viewCount, 10)) : "",
        publishedAt: it.snippet.publishedAt,
        tag: tagFor(it.snippet.title),
      };
    });
  } catch (err) {
    console.warn("[youtube] Fetch failed, using placeholders.", err);
    return FALLBACK;
  }
}
