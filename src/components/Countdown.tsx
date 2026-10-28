"use client";

import { useSyncExternalStore } from "react";
import { weddingDate } from "@/data/wedding";
import s from "./Countdown.module.css";

const UNITS = [
  { key: "days", label: "Ngày" },
  { key: "hours", label: "Giờ" },
  { key: "minutes", label: "Phút" },
  { key: "seconds", label: "Giây" },
] as const;

type Remaining = Record<(typeof UNITS)[number]["key"], number>;

/** Đồng hồ hệ thống, đọc mỗi giây. Trên server trả null để không lệch hydration. */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

const nowInSeconds = () => Math.floor(Date.now() / 1000);
const noClockOnServer = () => null;

function remainingFrom(targetMs: number, nowMs: number): Remaining {
  const total = Math.floor(Math.max(0, targetMs - nowMs) / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}

export function Countdown() {
  const nowSec = useSyncExternalStore(subscribe, nowInSeconds, noClockOnServer);
  const left = nowSec === null ? null : remainingFrom(new Date(weddingDate).getTime(), nowSec * 1000);
  const arrived = left !== null && Object.values(left).every((v) => v === 0);

  return (
    <div className={s.wrap}>
      <p className="eyebrow">{arrived ? "Hôm nay là ngày đó rồi!" : "Còn lại"}</p>
      <ul className={s.grid}>
        {UNITS.map(({ key, label }) => (
          <li key={key} className={s.cell}>
            <span className={`numeral ${s.value}`} suppressHydrationWarning>
              {left ? String(left[key]).padStart(2, "0") : "--"}
            </span>
            <span className={s.label}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
