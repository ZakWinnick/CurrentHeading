/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly YOUTUBE_API_KEY?: string;
  readonly YOUTUBE_CHANNEL_ID?: string;
  readonly BEHOLD_FEED_ID?: string;
  readonly FOURTHWALL_PUBLIC_TOKEN?: string;
  readonly FOURTHWALL_COLLECTION_SLUG?: string;
  readonly FOURTHWALL_SHOP_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
