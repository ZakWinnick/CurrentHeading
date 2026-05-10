/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly YOUTUBE_API_KEY?: string;
  readonly YOUTUBE_CHANNEL_ID?: string;
  readonly BEHOLD_FEED_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare Pages Functions ambient types.
declare type PagesFunction<Env = Record<string, unknown>> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}) => Response | Promise<Response>;
