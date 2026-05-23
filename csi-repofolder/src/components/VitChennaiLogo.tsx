import './VitChennaiLogo.css';

export const VIT_CHENNAI_SEAL_SRC = '/assets/vit-chennai-logo.svg';
export const VIT_CHENNAI_WORDMARK_SRC = '/assets/vit-chennai-wordmark.svg';

export type VitChennaiLogoSize = 'nav' | 'footer' | 'hero' | 'inline';
export type VitChennaiLogoVariant = 'seal' | 'wordmark';

type VitChennaiLogoProps = {
  variant?: VitChennaiLogoVariant;
  size?: VitChennaiLogoSize;
  showLabel?: boolean;
  framed?: boolean;
  className?: string;
};

const VitChennaiLogo = ({
  variant = 'seal',
  size = 'nav',
  showLabel = false,
  framed = true,
  className = '',
}: VitChennaiLogoProps) => {
  const src = variant === 'wordmark' ? VIT_CHENNAI_WORDMARK_SRC : VIT_CHENNAI_SEAL_SRC;
  const alt =
    variant === 'wordmark'
      ? 'Vellore Institute of Technology'
      : 'Vellore Institute of Technology official seal';

  const rootClass = [
    'vit-logo',
    `vit-logo--${size}`,
    `vit-logo--${variant}`,
    framed && size !== 'hero' ? 'vit-logo--framed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <span className="vit-logo__glow" aria-hidden />
      <span className="vit-logo__shine" aria-hidden />
      <img className="vit-logo__img" src={src} alt={alt} width={144} height={152} decoding="async" />
      {showLabel && (
        <span className="vit-logo__label">
          <span className="vit-logo__label-title">VIT</span>
          <span className="vit-logo__label-sub">Chennai</span>
        </span>
      )}
    </div>
  );
};

export default VitChennaiLogo;
