import VitChennaiLogo from './VitChennaiLogo';

/** Hero-only spotlight layer — sits above unified SiteBackground */
const HeroAtmosphere = () => (
  <div className="hero-atmosphere" aria-hidden>
    <div className="hero-atmosphere__spotlight" />
    <div className="hero-atmosphere__fade hero-atmosphere__fade--vignette" />
    <VitChennaiLogo variant="seal" size="hero" framed={false} />
  </div>
);

export default HeroAtmosphere;
