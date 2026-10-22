import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

// Two colorways of the same mark: the light variant is legible on the light
// theme background (--background #eef2f8), the gold variant on the dark theme
// (--background #081018). Visibility is switched with Tailwind's `dark:` variant,
// which is keyed to <html data-theme>, so no client-side state is needed.
const LIGHT_THEME_SRC = "/brand/logo/aaa-qora.svg";
const DARK_THEME_SRC = "/brand/logo/aaa-oltin.svg";
const ALT = "Avrangzeb Abdujalilov logo";

export function Logo({ size = 40, className = "", priority = false }: LogoProps) {
  const sharedClass = `object-contain ${className}`.trim();

  return (
    <>
      <Image
        src={LIGHT_THEME_SRC}
        alt={ALT}
        width={size}
        height={size}
        unoptimized
        className={`dark:hidden ${sharedClass}`}
        priority={priority}
      />
      <Image
        src={DARK_THEME_SRC}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        unoptimized
        className={`hidden dark:block ${sharedClass}`}
        priority={priority}
      />
    </>
  );
}
