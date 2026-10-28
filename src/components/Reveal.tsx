"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Thẻ HTML muốn render, mặc định là div */
  as?: ElementType;
  className?: string;
  /** Trễ bao lâu sau khi lọt vào khung nhìn */
  delay?: number;
  style?: CSSProperties;
};

/** Hiện dần nội dung khi cuộn tới. Xem `.reveal` trong globals.css. */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? " is-in" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--delay": `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
