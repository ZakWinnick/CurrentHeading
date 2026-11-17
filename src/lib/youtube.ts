// Build-time YouTube fetch. Features public, processed uploads longer than
// three minutes. Excludes upcoming, current, and archived live broadcasts.
//
// Env vars (GitHub Actions secrets, or local .env):
//   YOUTUBE_API_KEY      Google Cloud API key with YouTube Data API v3 enabled
//   YOUTUBE_CHANNEL_ID   The "UC..." channel ID for @currentheading
//
// Returns an empty list if live data is unavailable. The page then links
// directly to the channel rather than displaying invented video records.

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

function uploadsPlaylistId(channelId: string): string {
  // Convention: a channel's uploads playlist is the channel ID with the
  // leading "UC" replaced by "UU".
  if (channelId.startsWith("UC")) return "UU" + channelId.slice(2);
  return channelId;
}

function durationSeconds(iso: string): number {
  const match = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!match) return 0;
  return Number(match[1] ?? 0) * 86400 + Number(match[2] ?? 0) * 3600
    + Number(match[3] ?? 0) * 60 + Number(match[4] ?? 0);
}

function parseDuration(iso: string): string {
  const total = durationSeconds(iso);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
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
  if (t.includes("infrastructure") || t.includes("rangeway")) return "Infrastructure";
  return "Video";
}

interface PlaylistItem {
  contentDetails?: { videoId?: string };
}
interface VideoItem {
  id: string;
  snippet?: {
    title: string;
    channelId: string;
    publishedAt: string;
    liveBroadcastContent?: string;
    thumbnails?: Record<string, { url?: string }>;
  };
  contentDetails?: { duration?: string };
  statistics?: { viewCount?: string };
  status?: { privacyStatus?: string; uploadStatus?: string };
  liveStreamingDetails?: object;
}

export async function fetchLatestVideos(limit = 6, env: Record<string, string | undefined> = import.meta.env ?? {}): Promise<VideoMeta[]> {
  const key = env.YOUTUBE_API_KEY;
  const channelId = env.YOUTUBE_CHANNEL_ID;
  if (!key || !channelId) {
    console.warn("[youtube] Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID. Live videos unavailable.");
    return [];
  }
  if (!Number.isFinite(limit) || limit < 1) return [];
  const wanted = Math.min(50, Math.floor(limit));

  try {
    const result: VideoMeta[] = [];
    const seen = new Set<string>();
    let pageToken: string | undefined;
    // Scan up to 250 uploads so excluded entries do not leave empty grid spots.
    for (let page = 0; page < 5 && result.length < wanted; page++) {
      const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      playlistUrl.search = new URLSearchParams({ part: "contentDetails", maxResults: "50",
        playlistId: uploadsPlaylistId(channelId), key, ...(pageToken ? { pageToken } : {}) }).toString();
      const playlistRes = await fetch(playlistUrl.href, { signal: AbortSignal.timeout(15_000) });
      if (!playlistRes.ok) throw new Error(`playlistItems ${playlistRes.status}`);
      const playlistJson = await playlistRes.json() as { items?: PlaylistItem[]; nextPageToken?: string };
      const ids = (playlistJson.items ?? []).flatMap(item => {
        const id = item.contentDetails?.videoId;
        if (!id || seen.has(id)) return [];
        seen.add(id);
        return [id];
      });
      if (ids.length) {
        const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
        videosUrl.search = new URLSearchParams({ part: "snippet,contentDetails,statistics,status,liveStreamingDetails", id: ids.join(","), key }).toString();
        const videosRes = await fetch(videosUrl.href, { signal: AbortSignal.timeout(15_000) });
        if (!videosRes.ok) throw new Error(`videos ${videosRes.status}`);
        const videosJson = await videosRes.json() as { items?: VideoItem[] };
        const details = new Map((videosJson.items ?? []).map(video => [video.id, video]));
        for (const id of ids) {
          const meta = details.get(id);
          const snippet = meta?.snippet;
          const duration = meta?.contentDetails?.duration ?? "";
          if (!snippet || snippet.channelId !== channelId || !snippet.title
            || meta?.status?.privacyStatus !== "public" || meta.status.uploadStatus !== "processed"
            || meta.liveStreamingDetails || (snippet.liveBroadcastContent && snippet.liveBroadcastContent !== "none")
            // YouTube does not expose an isShort flag. All Shorts are <= 3 minutes.
            || durationSeconds(duration) <= 180
            || !Number.isFinite(Date.parse(snippet.publishedAt)) || Date.parse(snippet.publishedAt) > Date.now()) continue;
          const thumbs = snippet.thumbnails ?? {};
          const thumbnail = ["maxres", "standard", "high", "medium", "default"]
            .map(size => thumbs[size]?.url).find(url => typeof url === "string" && url.trim());
          if (!thumbnail) continue;
          result.push({ id, title: snippet.title, url: `https://youtube.com/watch?v=${id}`, thumbnail,
            duration: parseDuration(duration), views: meta.statistics?.viewCount ? formatViews(Number(meta.statistics.viewCount)) : "",
            publishedAt: snippet.publishedAt, tag: tagFor(snippet.title) });
          if (result.length === wanted) break;
        }
      }
      pageToken = playlistJson.nextPageToken;
      if (!pageToken) break;
    }
    return result;
  } catch {
    console.warn("[youtube] Fetch failed. Live videos unavailable.");
    return [];
  }
}
