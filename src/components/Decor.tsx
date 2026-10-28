import type { CSSProperties } from "react";

type Motion = "sway" | "float" | "wobble" | "twinkle" | "none";

export type DecorProps = {
  /** Tên file trong /public/art, ví dụ "beige/dove" hoặc "red/cupcake" */
  src: string;
  /** Vị trí trong section, tính từ mép trái / mép trên */
  x: string;
  y: string;
  /** Bề rộng — nên dùng clamp() để co theo màn hình */
  w: string;
  /** Độ xoay, ví dụ "-8deg" */
  r?: string;
  opacity?: number;
  motion?: Motion;
  /** Chu kỳ chuyển động */
  duration?: string;
  delay?: string;
  /** Ẩn trên mobile để không rối */
  hideOnMobile?: boolean;
};

/**
 * Một hoạ tiết trang trí đặt tự do trong section.
 * Mọi thứ điều khiển qua CSS custom properties — xem `.decor` trong globals.css.
 */
export function Decor({
  src,
  x,
  y,
  w,
  r = "0deg",
  opacity = 1,
  motion = "sway",
  duration = "7s",
  delay = "0s",
  hideOnMobile = false,
}: DecorProps) {
  const style = {
    "--x": x,
    "--y": y,
    "--w": w,
    "--r": r,
    "--o": opacity,
    "--dur": duration,
    "--delay": delay,
  } as CSSProperties;

  const classes = [
    "decor",
    motion === "none" ? "" : motion,
    hideOnMobile ? "decor--desktop" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <img src={`/art/${src}.webp`} alt="" aria-hidden="true" className={classes} style={style} />;
}

/** Rải một loạt hoạ tiết cùng lúc */
export function DecorSet({ items }: { items: DecorProps[] }) {
  return (
    <>
      {items.map((item, i) => (
        <Decor key={`${item.src}-${i}`} {...item} />
      ))}
    </>
  );
}
