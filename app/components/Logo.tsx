import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({ size = 40, className = "", priority = false }: LogoProps) {
  return (
    <Image
      src="/brand/logo-icon.png"
      alt="Avrangzeb Abdujalilov logo"
      width={size}
      height={size}
      className={`rounded-lg object-contain ${className}`.trim()}
      priority={priority}
    />
  );
}
