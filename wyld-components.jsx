// wyld-components.jsx
// All section components for the Wyld Wattage homepage.
// Globals expected: React.

const Arrow = ({ size = 14 }) => (
  <svg className="ww-arrow" viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M4 2.5v11l10-5.5z" />
  </svg>
);

const PlatformIcon = ({ kind }) => {
  // Tiny stylized glyphs — not the actual brand marks.
  if (kind === "apple") return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M11.7 8.4c0-1.6 1.3-2.4 1.3-2.4-.7-1-1.8-1.2-2.2-1.2-1-.1-1.9.6-2.4.6-.5 0-1.3-.6-2.1-.6-1.1 0-2.1.6-2.7 1.6C2.4 8.4 3.4 12 4.6 14c.6 1 1.3 2.1 2.2 2 .9 0 1.2-.6 2.3-.6 1 0 1.4.6 2.3.6.9 0 1.6-1 2.1-2 .7-1.1 1-2.2 1-2.3 0 0-2.1-.8-2.1-3.3zM10.4 4.4c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 1-.4.5-.8 1.3-.7 2.1.8.1 1.6-.4 2-1z"/>
    </svg>
  );
  if (kind === "spotify") return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <circle cx="8" cy="8" r="7" />
      <path d="M4.6 6.5c2.3-.6 5-.4 7 .8M4.9 8.9c1.9-.5 4.1-.3 5.7.7M5.2 11c1.4-.4 3-.2 4.3.5" stroke="#000" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  );
  if (kind === "overcast") return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4v4l2.5 1.5" strokeLinecap="round" />
    </svg>
  );
  if (kind === "rss") return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <circle cx="3.5" cy="12.5" r="1.5" />
      <path d="M2 6.5C5.6 6.5 9.5 10.4 9.5 14h-2C7.5 11.5 4.5 8.5 2 8.5v-2zm0-4C7.8 2.5 13.5 8.2 13.5 14h-2C11.5 9.3 6.7 4.5 2 4.5v-2z" />
    </svg>
  );
  return null;
};

const SocialIcon = ({ kind }) => {
  if (kind === "yt") return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M14.7 4.5c-.2-.7-.7-1.2-1.4-1.4C12 2.8 8 2.8 8 2.8s-4 0-5.3.3c-.7.2-1.2.7-1.4 1.4C1 5.8 1 8 1 8s0 2.2.3 3.5c.2.7.7 1.2 1.4 1.4 1.3.3 5.3.3 5.3.3s4 0 5.3-.3c.7-.2 1.2-.7 1.4-1.4.3-1.3.3-3.5.3-3.5s0-2.2-.3-3.5zM6.5 10.5v-5L10.7 8l-4.2 2.5z" />
    </svg>
  );
  if (kind === "ig") return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="1.7" y="1.7" width="12.6" height="12.6" rx="3.5" />
      <circle cx="8" cy="8" r="2.8" />
      <circle cx="11.6" cy="4.4" r=".6" fill="currentColor" />
    </svg>
  );
  if (kind === "x") return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M11.6 2h2.5L9 8l5.6 6h-4.4L7 9.7 3.2 14H.7l5.6-6.4L1 2h4.5l3 4 3.1-4z" />
    </svg>
  );
  if (kind === "patreon") return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <rect x="1.5" y="1.5" width="2.5" height="13" />
      <circle cx="10" cy="6.4" r="4.6" />
    </svg>
  );
  return null;
};

// ─────────────────────────────────────────────────────────────────────────
function Nav({ scrolled }) {
  return (
    <nav className={"ww-nav" + (scrolled ? " is-stuck" : "")} data-screen-label="Top nav">
      <a href="#top" className="ww-nav__brand" aria-label="Wyld Wattage home">
        <img src="assets/ww-logo.png" alt="" />
        <span className="ww-nav__wordmark">Wyld Wattage</span>
      </a>
      <div className="ww-nav__links">
        <a href="#about">About</a>
        <a href="#videos">Videos</a>
        <a href="#podcast">Podcast</a>
        <a href="#patreon">Patreon</a>
        <a href="#shop">Shop</a>
      </div>
      <a className="ww-nav__cta" href="https://members.wyldwattage.com" target="_blank" rel="noopener">
        Become a Patron
        <Arrow />
      </a>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────
function Hero({ variant }) {
  return (
    <header className="ww-hero" data-hero={variant} id="top" data-screen-label="01 Hero">
      <div className="ww-hero__bg" aria-hidden="true" />
      <div className="ww-hero__scrim" aria-hidden="true" />
      <div className="ww-hero__grain" aria-hidden="true" />
      {variant === "split" && <div className="ww-hero__image" aria-hidden="true" />}

      <div className="ww-hero__content">
        <div className="ww-hero__top">
          <span className="ww-mono">Wyld Wattage · S03 · 2026</span>
          <span className="ww-live"><i />New episode Thursday</span>
        </div>

        <h1 className="ww-hero__headline">
          DC fast charging,<br />
          reviewed by someone<br />
          who <em>builds it.</em>
        </h1>

        <p className="ww-hero__sub">
          Site reviews, network takes, road-trip diaries, and the occasional rant —
          from a charging operator with skin in the asphalt.
        </p>

        <div className="ww-hero__ctas">
          <a className="ww-btn ww-btn--primary" href="https://youtube.com/@wyldwattage" target="_blank" rel="noopener">
            Watch on YouTube
            <Arrow />
          </a>
          <a className="ww-btn ww-btn--ghost" href="https://members.wyldwattage.com" target="_blank" rel="noopener">
            Become a Patron
            <Arrow />
          </a>
        </div>

        <div className="ww-hero__meta">
          <div className="ww-hero__meta-item">
            <span className="k">Reviewed</span>
            <span className="v">147 sites</span>
          </div>
          <div className="ww-hero__meta-item">
            <span className="k">Networks</span>
            <span className="v">11 covered</span>
          </div>
          <div className="ww-hero__meta-item">
            <span className="k">Subs</span>
            <span className="v">38.4K</span>
          </div>
          <div className="ww-hero__meta-item">
            <span className="k">Operator</span>
            <span className="v">Rangeway Energy</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "Site reviews", "Network takes", "Road trip diaries", "Operator notes",
    "Hardware that lies", "Sites that work", "Concrete & kilowatts", "Reservations welcome",
  ];
  const all = [...items, ...items];
  return (
    <div className="ww-marquee" aria-hidden="true">
      <div className="ww-marquee__track">
        {all.map((t, i) => (
          <span className="ww-marquee__item" key={i}>
            <i className="dot" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="ww-section" id="about" data-screen-label="02 About">
      <div className="ww-section-num ww-mono">§ 02 / Who</div>
      <div className="ww-container ww-grid12">
        <div className="ww-eyebrow-row" style={{ gridColumn: "1 / -1" }}>
          <span className="ww-eyebrow"><span className="ww-idx">01</span> &nbsp; About</span>
          <span className="ww-bar" />
          <span className="ww-eyebrow">Who's reviewing this stuff?</span>
        </div>

        <p className="ww-about__lede">
          Zak Winnick has spent five years figuring out why a charging site
          works — or <em>quietly costs the network a million dollars.</em>
          The channel is what happens when an operator takes a camera to
          everyone else's homework.
        </p>

        <aside className="ww-about__sidebar">
          <dl>
            <div>
              <dt>Day Job</dt>
              <dd>Founder &amp; CEO, <em>Rangeway Energy</em></dd>
            </div>
            <div>
              <dt>Community</dt>
              <dd>Director, Bay Area Rivian Club</dd>
            </div>
            <div>
              <dt>Co-host</dt>
              <dd>Rivian Rundown podcast</dd>
            </div>
            <div>
              <dt>Lives in</dt>
              <dd>Berkeley, CA · usually a stall</dd>
            </div>
          </dl>
        </aside>

        <div className="ww-about__portrait">
          <div className="ww-ph">
            <div className="ww-ph__label">
              <span className="num">PHOTO/01</span>
              <span>portrait — Zak at a stall, golden hour, R1T behind</span>
            </div>
          </div>
        </div>

        <div className="ww-about__quote">
          <p>
            Most charging YouTubers test plugs. I test the parking lot, the
            lighting, the sign placement, the canopy, the bid documents, the
            host's attitude. The plug is the easy part.
          </p>
          <span className="ww-byline ww-mono">— from the channel intro</span>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
const VIDEOS = [
  { tag: "Site Review", title: "I drove 600 miles to review a 4-stall site, and it was somehow worse than that sounds.", duration: "18:42", views: "84K" },
  { tag: "Network Take", title: "What Electrify America's Plug & Charge fix actually means for your road trip.", duration: "11:09", views: "62K" },
  { tag: "Field Notes",  title: "The Tesla Magic Dock review nobody asked for (but here we are).",                      duration: "14:27", views: "112K" },
  { tag: "Site Review", title: "Why this Walmart in Bakersfield is somehow the gold standard.",                          duration: "9:53",  views: "47K" },
  { tag: "Operator",    title: "Touring a Rangeway site mid-construction. Spoiler: concrete is hard.",                    duration: "21:14", views: "73K" },
  { tag: "Rant",        title: "Pilot Flying J's network bid: dealbreaker, slow-clap, or both?",                          duration: "12:38", views: "55K" },
];

function VideoCard({ v, i }) {
  return (
    <article className="ww-video">
      <div className="ww-video__thumb">
        <div className="ww-ph">
          <div className="ww-ph__label">
            <span className="num">VID/{String(i + 1).padStart(2, "0")}</span>
            <span>{v.tag.toLowerCase()} thumb · 16:9 · drone or stall hero</span>
          </div>
        </div>
        <div className="ww-video__play"><PlayIcon /></div>
        <div className="ww-video__duration">{v.duration}</div>
      </div>
      <div className="ww-video__meta">
        <span className="tag">{v.tag}</span>
        <span>·</span>
        <span>{v.views} views</span>
      </div>
      <h3 className="ww-video__title">{v.title}</h3>
    </article>
  );
}

function Videos() {
  return (
    <section className="ww-section" id="videos" data-screen-label="03 Videos">
      <div className="ww-section-num ww-mono">§ 03 / Videos</div>
      <div className="ww-container">
        <div className="ww-eyebrow-row">
          <span className="ww-eyebrow"><span className="ww-idx">02</span> &nbsp; The Channel</span>
          <span className="ww-bar" />
          <span className="ww-eyebrow">Pulled live via YouTube API</span>
        </div>
        <div className="ww-videos__head">
          <h2 className="ww-display" style={{ fontSize: "var(--ww-h1)", margin: 0, color: "var(--ww-paper)" }}>
            Latest from the road.
          </h2>
          <a href="https://youtube.com/@wyldwattage" target="_blank" rel="noopener">
            All 218 videos on YouTube <Arrow />
          </a>
        </div>
        <div className="ww-videos__row">
          {VIDEOS.map((v, i) => <VideoCard key={i} v={v} i={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
function Podcast() {
  const bars = Array.from({ length: 64 }, (_, i) => {
    const x = i / 64;
    const h = 8 + Math.abs(Math.sin(x * 9 + 1)) * 60 + Math.abs(Math.sin(x * 21)) * 18;
    return Math.round(h);
  });
  return (
    <section className="ww-section" id="podcast" data-screen-label="04 Podcast">
      <div className="ww-section-num ww-mono">§ 04 / Audio</div>
      <div className="ww-container">
        <div className="ww-eyebrow-row">
          <span className="ww-eyebrow"><span className="ww-idx">03</span> &nbsp; The Podcast</span>
          <span className="ww-bar" />
          <span className="ww-eyebrow">Wyld Wramblings</span>
        </div>
        <div className="ww-podcast">
          <div className="ww-podcast__art">
            <div className="ww-podcast__art-glow" />
            <div className="ww-podcast__art-wave">
              {bars.map((h, i) => <i key={i} style={{ height: h + "%" }} />)}
            </div>
            <div className="ww-podcast__art-content">
              <div className="ww-podcast__art-title">Wyld<br />Wram-<br />blings</div>
              <div className="ww-podcast__art-foot">
                <span className="ww-mono">EP. 042 · 58 MIN</span>
                <img src="assets/ww-logo.png" alt="" />
              </div>
            </div>
          </div>

          <div className="ww-podcast__copy">
            <span className="ww-eyebrow" style={{ display: "block", marginBottom: 16 }}>The audio companion</span>
            <h2 className="ww-display" style={{ fontSize: "var(--ww-h1)", margin: 0, color: "var(--ww-paper)" }}>
              Voice memos<br />from the trailhead.
            </h2>
            <p style={{ marginTop: 24 }}>
              The podcast we make when there's too much to say for a 12-minute video.
              Hotel rants after a bad plug, three-hour deep-dives on bid documents,
              and the occasional guest who actually knows what they're talking about.
            </p>

            <ul className="ww-podcast__platforms">
              <li><a href="#"><PlatformIcon kind="apple" /> Apple Podcasts</a></li>
              <li><a href="#"><PlatformIcon kind="spotify" /> Spotify</a></li>
              <li><a href="#"><PlatformIcon kind="overcast" /> Overcast</a></li>
              <li><a href="#"><PlatformIcon kind="rss" /> RSS</a></li>
            </ul>

            <div className="ww-podcast__latest">
              <div>
                <div className="ep-num">Latest · EP 042</div>
                <div className="ep-title">"They built a 350 kW pull-through and the canopy is 9'6"."</div>
              </div>
              <span className="ep-time">58:14</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
const IG_POSTS = [
  { tag: "carousel", note: "EA Phoenix · 4-stall site walkaround" },
  { tag: "reel",     note: "R1T at Harris Ranch · golden hour" },
  { tag: "post",     note: "Bid document highlights · zoomed in" },
  { tag: "reel",     note: "Plug-and-play handshake test loop" },
  { tag: "carousel", note: "Drone over a CCS pull-through" },
  { tag: "post",     note: "Diner fries · charging while waiting" },
];

function Instagram() {
  return (
    <section className="ww-section" id="instagram" data-screen-label="05 Instagram">
      <div className="ww-section-num ww-mono">§ 05 / Field</div>
      <div className="ww-container">
        <div className="ww-eyebrow-row">
          <span className="ww-eyebrow"><span className="ww-idx">04</span> &nbsp; On Instagram</span>
          <span className="ww-bar" />
          <span className="ww-ig__handle">
            <SocialIcon kind="ig" />
            @wyldwattage
          </span>
        </div>
        <div className="ww-videos__head" style={{ alignItems: "flex-end" }}>
          <h2 className="ww-display" style={{ fontSize: "var(--ww-h1)", margin: 0, color: "var(--ww-paper)" }}>
            More from the road.
          </h2>
          <a href="https://instagram.com/wyldwattage" target="_blank" rel="noopener" className="ww-mono"
             style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ww-mid)", display: "inline-flex", alignItems: "center", gap: 8 }}>
            Follow <Arrow />
          </a>
        </div>
        <div className="ww-ig__grid">
          {IG_POSTS.map((p, i) => (
            <a key={i} href="#" className="ww-ig__cell" aria-label={p.note}>
              <div className="ww-ph">
                <div className="ww-ph__label">
                  <span className="num">IG/{String(i + 1).padStart(2, "0")}</span>
                  <span>{p.tag}</span>
                </div>
              </div>
              <div className="ww-ig__hover">
                <span>↗</span>
                <span>VIEW POST</span>
              </div>
            </a>
          ))}
        </div>
        <div style={{ marginTop: 24, fontFamily: "var(--ww-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ww-mute)" }}>
          Embed: behold.so · 6 most recent posts · auto-refresh every 24h
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "T-01",
    name: "Be Excellent",
    price: "5",
    perks: [
      "Access to The Charging Booth Discord",
      "Early-cut posts before YouTube",
      "Patron-only sticker pack, mailed",
    ],
  },
  {
    id: "T-02",
    name: "Station!",
    price: "15",
    featured: true,
    perks: [
      "Everything in Be Excellent",
      "Monthly live Q&A in the Booth",
      "Site Notes — the operator-grade behind-the-scenes",
      "First crack at road-trip route votes",
    ],
  },
  {
    id: "T-03",
    name: "Most Triumphant",
    price: "50",
    perks: [
      "Everything in Station!",
      "Quarterly Zoom hangout (max 12)",
      "Name in the channel credits, forever",
      "Vote on the next op-ed teardown",
    ],
  },
];

function Patreon() {
  return (
    <section className="ww-section ww-section--red" id="patreon" data-screen-label="06 Patreon">
      <div className="ww-section-num ww-mono">§ 06 / Members</div>
      <div className="ww-container">
        <div className="ww-eyebrow-row">
          <span className="ww-eyebrow"><span className="ww-idx" style={{ color: "var(--ww-black)" }}>05</span> &nbsp; Community</span>
          <span className="ww-bar" />
          <span className="ww-eyebrow">members.wyldwattage.com</span>
        </div>
        <div className="ww-patreon__head">
          <h2>
            Be excellent<br />to each other.<br />
            Then go review<br />a bad site.
          </h2>
          <p>
            Patreon keeps the channel honest — no sponsorships from networks I've
            reviewed, no advertorial site visits. Three tiers, one Discord
            (we call it The Charging Booth), and a small group of people who
            care about this stuff as much as I do.
          </p>
        </div>

        <div className="ww-patreon__tiers">
          {TIERS.map((t) => (
            <div key={t.id} className={"ww-tier" + (t.featured ? " ww-tier--featured" : "")}>
              <span className="ww-tier__id">{t.id} {t.featured ? "· Most popular" : ""}</span>
              <div className="ww-tier__name">{t.name}</div>
              <div className="ww-tier__price">${t.price}<span className="unit">/ month</span></div>
              <ul className="ww-tier__perks">
                {t.perks.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="ww-patreon__cta">
          <a className="ww-btn ww-btn--inverse" href="https://members.wyldwattage.com" target="_blank" rel="noopener">
            Join on Patreon <Arrow />
          </a>
          <a className="ww-discord" href="#">
            <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor" aria-hidden="true">
              <path d="M14.7 1.5A14 14 0 0 0 11.4.4l-.2.4c1.2.4 1.8.9 2.4 1.5-1-.5-2.1-.9-3.2-1A11 11 0 0 0 9 1.2c-.5 0-.9 0-1.4.1-1.1.1-2.2.5-3.2 1 .6-.6 1.2-1.1 2.4-1.5L6.6.4A14 14 0 0 0 3.3 1.5C1.5 4.6.9 7.6 1.1 10.6c1.4 1 2.7 1.7 4 2l.5-.7c-.7-.2-1.4-.6-2-1 .2.1.3.2.5.2 2.5 1.3 5.3 1.3 7.8 0 .2 0 .3-.1.5-.2-.6.4-1.3.8-2 1l.5.7c1.3-.3 2.6-1 4-2 .2-3.4-.5-6.4-2.2-9.1zm-7.6 7.4c-.7 0-1.3-.7-1.3-1.5 0-.9.6-1.5 1.3-1.5s1.3.7 1.3 1.5c0 .9-.6 1.5-1.3 1.5zm3.8 0c-.7 0-1.3-.7-1.3-1.5 0-.9.6-1.5 1.3-1.5s1.3.7 1.3 1.5c0 .9-.6 1.5-1.3 1.5z" />
            </svg>
            The Charging Booth
            <span style={{ fontFamily: "var(--ww-mono)", fontSize: 11, letterSpacing: ".14em", color: "var(--ww-mid)", textTransform: "uppercase" }}>
              · 1,847 members
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
const SHOP_ITEMS = [
  { name: "Pour Concrete Tee", price: "$32", mark: "T01" },
  { name: "Operator Hat", price: "$28", mark: "C02" },
  { name: "Site Notes Zine", price: "$12", mark: "Z03" },
  { name: "Wyld Sticker Pack", price: "$8",  mark: "S04" },
];

function Shop() {
  return (
    <section className="ww-section" id="shop" data-screen-label="07 Shop">
      <div className="ww-section-num ww-mono">§ 07 / Goods</div>
      <div className="ww-container">
        <div className="ww-eyebrow-row">
          <span className="ww-eyebrow"><span className="ww-idx">06</span> &nbsp; The Shop</span>
          <span className="ww-bar" />
          <span className="ww-eyebrow">wyldwattage.store</span>
        </div>
        <div className="ww-shop">
          <div className="ww-shop__copy">
            <h2 className="ww-display" style={{ fontSize: "var(--ww-h1)", color: "var(--ww-paper)", margin: 0 }}>
              Tees, hats,<br />and one zine.
            </h2>
            <p>
              Small drops, no bullshit. Made in California, shipped from a small
              warehouse in Oakland. If you wear it to a charging site, send a
              photo to the Discord.
            </p>
            <a className="ww-btn ww-btn--primary" href="https://wyldwattage.store" target="_blank" rel="noopener">
              Visit the shop <Arrow />
            </a>
          </div>
          <div className="ww-shop__products">
            {SHOP_ITEMS.map((p, i) => (
              <a key={i} href="https://wyldwattage.store" target="_blank" rel="noopener" className="ww-shop__product">
                <span className="pname">{p.name}</span>
                <span className="pmark">{p.mark}</span>
                <span className="pprice">{p.price}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="ww-footer" data-screen-label="08 Footer">
      <div className="ww-footer__inner">
        <div className="ww-footer__brand">
          <img src="assets/ww-logo.png" alt="Wyld Wattage" />
          <div className="ww-nav__wordmark" style={{ fontSize: 18 }}>Wyld Wattage</div>
          <p>
            DC fast charging, reviewed by an operator. Made between Berkeley
            and wherever the next bad plug is.
          </p>
        </div>
        <div>
          <h4>Channel</h4>
          <ul>
            <li><a href="https://youtube.com/@wyldwattage" target="_blank" rel="noopener"><SocialIcon kind="yt" />YouTube</a></li>
            <li><a href="#podcast">Wyld Wramblings</a></li>
            <li><a href="https://wyldwattage.store" target="_blank" rel="noopener">Shop</a></li>
          </ul>
        </div>
        <div>
          <h4>Around</h4>
          <ul>
            <li><a href="https://instagram.com/wyldwattage" target="_blank" rel="noopener"><SocialIcon kind="ig" />Instagram</a></li>
            <li><a href="https://x.com/zakwinnick" target="_blank" rel="noopener"><SocialIcon kind="x" />@ZakWinnick</a></li>
            <li><a href="https://members.wyldwattage.com" target="_blank" rel="noopener"><SocialIcon kind="patreon" />Patreon</a></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            <li><a href="mailto:hi@wyldwattage.com">hi@wyldwattage.com</a></li>
            <li><a href="#">Press &amp; sponsorship</a></li>
            <li><a href="#">Tip line — bad sites</a></li>
          </ul>
        </div>
      </div>
      <div className="ww-footer__bar">
        <span>© 2026 Wyld Wattage · A Rangeway Side-Project</span>
        <span>No network has paid for a review on this channel. No network ever will.</span>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
function BigWord() {
  return (
    <a href="#top" aria-label="Back to top">
      <h2 className="ww-bigword">Wyld<br />Wattage</h2>
    </a>
  );
}

Object.assign(window, {
  Nav, Hero, Marquee, About, Videos, Podcast, Instagram, Patreon, Shop, Footer, BigWord,
  Arrow, PlayIcon, PlatformIcon, SocialIcon,
});
