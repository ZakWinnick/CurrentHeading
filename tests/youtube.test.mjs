import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchLatestVideos } from '../src/lib/youtube.ts';

const config = { YOUTUBE_API_KEY: 'test-key', YOUTUBE_CHANNEL_ID: 'UCexample' };
function video(id, overrides = {}) {
  return { id, snippet: { title: id, channelId: 'UCexample', publishedAt: '2026-11-01T00:00:00Z', liveBroadcastContent: 'none', thumbnails: { high: { url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` } } },
    contentDetails: { duration: 'PT10M' }, statistics: { viewCount: '1234' },
    status: { privacyStatus: 'public', uploadStatus: 'processed' }, ...overrides };
}
function sources(t, pages, details) {
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (input) => {
    const url = new URL(input); requests.push(url);
    if (url.pathname.endsWith('/playlistItems')) {
      const page = pages[url.searchParams.get('pageToken') || 'first'];
      return Response.json({ items: page.ids.map(id => ({ contentDetails: { videoId: id }, snippet: video(id).snippet })), nextPageToken: page.next });
    }
    assert.ok(url.pathname.endsWith('/videos'));
    return Response.json({ items: url.searchParams.get('id').split(',').flatMap(id => details[id] ? [details[id]] : []) });
  });
  return requests;
}

test('only published regular videos longer than three minutes appear', async t => {
  const all = [video('regular'), video('short', { contentDetails: { duration: 'PT43S' } }),
    video('three-minutes', { contentDetails: { duration: 'PT3M' } }),
    video('upcoming', { snippet: { ...video('upcoming').snippet, liveBroadcastContent: 'upcoming' } }),
    video('active', { liveStreamingDetails: { actualStartTime: '2026-11-01T00:00:00Z' } }),
    video('archived', { liveStreamingDetails: { actualEndTime: '2026-11-01T01:00:00Z' } }),
    video('private', { status: { privacyStatus: 'private', uploadStatus: 'processed' } }),
    video('unlisted', { status: { privacyStatus: 'unlisted', uploadStatus: 'processed' } }),
    video('processing', { status: { privacyStatus: 'public', uploadStatus: 'uploaded' } }),
    video('other-channel', { snippet: { ...video('other-channel').snippet, channelId: 'UCother' } }),
    video('no-thumbnail', { snippet: { ...video('no-thumbnail').snippet, thumbnails: {} } }),
    video('invalid-duration', { contentDetails: { duration: 'invalid' } }),
    video('long-regular', { contentDetails: { duration: 'PT1H2M3S' } })];
  const requests = sources(t, { first: { ids: [...all.map(v => v.id), 'deleted'] } }, Object.fromEntries(all.map(v => [v.id, v])));
  const result = await fetchLatestVideos(6, config);
  assert.deepEqual(result.map(v => v.id), ['regular', 'long-regular']);
  assert.equal(result[1].duration, '1:02:03');
  assert.equal(result[0].views, '1.2K');
  assert.match(requests[1].searchParams.get('part'), /liveStreamingDetails/);
  assert.match(requests[1].searchParams.get('part'), /status/);
});

test('filtered uploads are replaced with older regular videos in playlist order', async t => {
  const details = Object.fromEntries([video('short', { contentDetails: { duration: 'PT1M' } }), video('a'), video('b'), video('c')].map(v => [v.id, v]));
  const requests = sources(t, { first: { ids: ['short', 'a'], next: 'older' }, older: { ids: ['b', 'c'] } }, details);
  const result = await fetchLatestVideos(2, config);
  assert.deepEqual(result.map(v => v.id), ['a', 'b']);
  assert.equal(requests.filter(u => u.pathname.endsWith('/playlistItems')).length, 2);
  assert.equal(requests[0].searchParams.get('maxResults'), '50');
  assert.equal(requests[0].searchParams.get('playlistId'), 'UUexample');
});

test('authoritative video details provide title and available thumbnail', async t => {
  const detail = video('a');
  detail.snippet.title = 'Current title';
  detail.snippet.thumbnails = { maxres: { url: '' }, standard: { url: 'https://i.ytimg.com/current.jpg' } };
  sources(t, { first: { ids: ['a'] } }, { a: detail });
  const [result] = await fetchLatestVideos(6, config);
  assert.equal(result.title, 'Current title');
  assert.equal(result.thumbnail, 'https://i.ytimg.com/current.jpg');
});

test('a YouTube API failure returns the honest empty state', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('Unavailable', { status: 503 }));
  assert.deepEqual(await fetchLatestVideos(6, config), []);
});
