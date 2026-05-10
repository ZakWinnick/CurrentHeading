// wyld-app.jsx — main app, ties components together with Tweaks.
// Globals: React, ReactDOM, Nav, Hero, Marquee, About, Videos, Podcast,
// Instagram, Patreon, Shop, Footer, BigWord, useTweaks, TweaksPanel,
// TweakSection, TweakRadio, TweakToggle.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero":     "image",
  "type":     "cinematic",
  "density":  "regular",
  "texture":  "grain",
  "rhythm":   "alternating",
  "marquee":  true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Push tweak values to <html> data-attrs so CSS can react.
  React.useEffect(() => {
    const html = document.documentElement;
    html.dataset.type = t.type;
    html.dataset.density = t.density;
    html.dataset.texture = t.texture;
    html.dataset.rhythm = t.rhythm;
  }, [t.type, t.density, t.texture, t.rhythm]);

  return (
    <>
      <Nav scrolled={scrolled} />
      <Hero variant={t.hero} />
      {t.marquee && <Marquee />}
      <About />
      <Videos />
      <Podcast />
      <Instagram />
      <Patreon />
      <Shop />
      <BigWord />
      <Footer />

      <div className="ww-texture-layer is-grain" aria-hidden="true" />
      <div className="ww-texture-layer is-scan"  aria-hidden="true" />

      <TweaksPanel title="Tweaks · Wyld Wattage">
        <TweakSection label="Hero">
          <TweakRadio label="Layout" value={t.hero}
            options={[
              { value: "image",     label: "Image" },
              { value: "split",     label: "Split" },
              { value: "manifesto", label: "Type" },
            ]}
            onChange={(v) => setTweak("hero", v)} />
        </TweakSection>

        <TweakSection label="Type system">
          <TweakRadio label="Pairing" value={t.type}
            options={[
              { value: "cinematic",  label: "Cine" },
              { value: "editorial",  label: "Edit" },
              { value: "brutalist",  label: "Brut" },
              { value: "industrial", label: "Indu" },
            ]}
            onChange={(v) => setTweak("type", v)} />
        </TweakSection>

        <TweakSection label="Density">
          <TweakRadio label="Rhythm" value={t.density}
            options={[
              { value: "airy",    label: "Airy" },
              { value: "regular", label: "Reg" },
              { value: "packed",  label: "Pack" },
            ]}
            onChange={(v) => setTweak("density", v)} />
        </TweakSection>

        <TweakSection label="Texture">
          <TweakRadio label="Overlay" value={t.texture}
            options={[
              { value: "clean",     label: "Clean" },
              { value: "grain",     label: "Grain" },
              { value: "scanlines", label: "Scan" },
            ]}
            onChange={(v) => setTweak("texture", v)} />
        </TweakSection>

        <TweakSection label="Section rhythm">
          <TweakRadio label="Mode" value={t.rhythm}
            options={[
              { value: "uniform",     label: "Uniform" },
              { value: "alternating", label: "Red break" },
            ]}
            onChange={(v) => setTweak("rhythm", v)} />
          <TweakToggle label="Marquee strip" value={t.marquee}
            onChange={(v) => setTweak("marquee", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
